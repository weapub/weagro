const requiredFields = ["name", "company", "email", "service", "message"];

function createRequestId() {
  return `contact_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function normalizePayload(payload = {}) {
  return {
    name: String(payload.name || "").trim(),
    company: String(payload.company || "").trim(),
    email: String(payload.email || "").trim(),
    service: String(payload.service || "").trim(),
    message: String(payload.message || "").trim(),
  };
}

export default async function handler(request, response) {
  const requestId = createRequestId();

  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    console.warn("[contact]", requestId, "method_not_allowed", {
      method: request.method,
    });
    return response.status(405).json({ error: "Method not allowed", requestId });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL || "info@weagro.com.ar";
  const from = process.env.CONTACT_FROM_EMAIL;

  if (!apiKey || !from) {
    console.error("[contact]", requestId, "missing_email_configuration", {
      hasApiKey: Boolean(apiKey),
      hasFrom: Boolean(from),
      to,
    });
    return response.status(503).json({
      error:
        "Email service is not configured. Set RESEND_API_KEY and CONTACT_FROM_EMAIL in Vercel.",
      requestId,
    });
  }

  const data = normalizePayload(request.body);
  const missing = requiredFields.filter((field) => !data[field]);

  if (missing.length > 0) {
    console.warn("[contact]", requestId, "missing_required_fields", { missing });
    return response.status(400).json({
      error: "Missing required fields",
      fields: missing,
      requestId,
    });
  }

  const subject = `Consulta WEAGRO - ${data.company}`;
  const text = [
    "Nueva consulta desde el sitio WEAGRO",
    "",
    `Nombre: ${data.name}`,
    `Empresa: ${data.company}`,
    `Email: ${data.email}`,
    `Servicio de interes: ${data.service}`,
    "",
    "Mensaje:",
    data.message,
  ].join("\n");

  const html = `
    <h2>Nueva consulta desde el sitio WEAGRO</h2>
    <p><strong>Nombre:</strong> ${escapeHtml(data.name)}</p>
    <p><strong>Empresa:</strong> ${escapeHtml(data.company)}</p>
    <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
    <p><strong>Servicio de interes:</strong> ${escapeHtml(data.service)}</p>
    <p><strong>Mensaje:</strong></p>
    <p>${escapeHtml(data.message).replaceAll("\n", "<br />")}</p>
  `;

  try {
    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to,
        reply_to: data.email,
        subject,
        text,
        html,
      }),
    });

    const result = await resendResponse.json().catch(() => ({}));

    if (!resendResponse.ok) {
      console.error("[contact]", requestId, "provider_failed", {
        status: resendResponse.status,
        providerError: result,
        to,
        from,
        service: data.service,
      });
      return response.status(502).json({
        error: "Email provider failed",
        requestId,
      });
    }

    console.info("[contact]", requestId, "email_sent", {
      providerId: result.id,
      to,
      from,
      service: data.service,
      company: data.company,
    });

    return response.status(200).json({
      ok: true,
      id: result.id,
      requestId,
    });
  } catch (error) {
    console.error("[contact]", requestId, "unexpected_error", {
      message: error?.message,
      stack: error?.stack,
    });

    return response.status(502).json({
      error: "Unexpected email service error",
      requestId,
    });
  }
}
