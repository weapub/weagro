const requiredFields = ["name", "company", "email", "service", "message"];

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
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL || "info@weagro.com.ar";
  const from = process.env.CONTACT_FROM_EMAIL;

  if (!apiKey || !from) {
    return response.status(503).json({
      error:
        "Email service is not configured. Set RESEND_API_KEY and CONTACT_FROM_EMAIL in Vercel.",
    });
  }

  const data = normalizePayload(request.body);
  const missing = requiredFields.filter((field) => !data[field]);

  if (missing.length > 0) {
    return response.status(400).json({
      error: "Missing required fields",
      fields: missing,
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

    await resendResponse.json().catch(() => ({}));

    if (!resendResponse.ok) {
      return response.status(502).json({
        error: "Email provider failed",
      });
    }

    return response.status(200).json({
      ok: true,
    });
  } catch {
    return response.status(502).json({
      error: "Unexpected email service error",
    });
  }
}
