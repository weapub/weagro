// Inicialización de animaciones SVG (efecto dibujo)
function initSVGAnimations() {
  const icons = document.querySelectorAll('svg');
  icons.forEach(svg => {
    const elements = svg.querySelectorAll('path, circle, rect, line, polyline, polygon');
    elements.forEach(el => {
      const length = el.getTotalLength();
      el.style.strokeDasharray = length;
      el.style.strokeDashoffset = length;
    });
  });
}

// Registro del Service Worker para PWA
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js")
      .catch(err => console.log("SW registration failed:", err));
  });
}

// Ejecutar inicialización de SVGs al cargar el DOM
document.addEventListener('DOMContentLoaded', initSVGAnimations);

// Animaciones de revelado al scroll
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
    }
  });
}, { threshold: 0.01, rootMargin: '0px 0px -20px 0px' });

document.querySelectorAll('section:not(.hero, .site-header, .footer-cta)').forEach(el => {
  el.classList.add('reveal');
  revealObserver.observe(el);
});

// Menú hamburguesa interactivo
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navOverlay = document.querySelector('.nav-overlay');
const navLinks = document.querySelectorAll('.nav-menu a, .nav-cta');

function toggleMenu() {
  const isOpen = hamburger.classList.contains('active');
  hamburger.classList.toggle('active');
  navMenu.classList.toggle('active');
  if (navOverlay) navOverlay.classList.toggle('active');
  document.body.classList.toggle('nav-open');
  hamburger.setAttribute('aria-expanded', !isOpen);
}

function closeMenu() {
  hamburger.classList.remove('active');
  navMenu.classList.remove('active');
  if (navOverlay) navOverlay.classList.remove('active');
  document.body.classList.remove('nav-open');
  hamburger.setAttribute('aria-expanded', 'false');
}

if (hamburger) {
  hamburger.addEventListener('click', toggleMenu);
  if (navOverlay) navOverlay.addEventListener('click', closeMenu);
  
  navLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });
}

const serviceCheckboxes = document.querySelectorAll('.checkbox-list input[type="checkbox"]');
const companyType = document.getElementById("companyType");
const urgency = document.getElementById("urgency");
const estimateTotal = document.getElementById("estimateTotal");
const estimateMessage = document.getElementById("estimateMessage");
const estimateDetails = document.getElementById("estimateDetails");
const estimateActions = document.getElementById("estimateActions");
const sendEstimate = document.getElementById("sendEstimate");
const contactButtons = document.querySelectorAll("[data-scroll-contact]");
const contactForm = document.getElementById("contactForm");
const contactStatus = document.getElementById("contactStatus");
const whatsappLinks = document.querySelectorAll("[data-whatsapp-link]");
const whatsappNumber = "543704602028";

const formatter = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

function trackEvent(name, params = {}) {
  if (typeof window.gtag === "function") {
    window.gtag("event", name, params);
  }
}

const defaultWhatsappMessage = encodeURIComponent(
  "Hola WEAGRO, quiero coordinar un diagnóstico sin cargo para mi empresa agro."
);

whatsappLinks.forEach((link) => {
  link.href = `https://wa.me/${whatsappNumber}?text=${defaultWhatsappMessage}`;
});

function getSelectedServices() {
  return Array.from(serviceCheckboxes)
    .filter((checkbox) => checkbox.checked)
    .map((checkbox) => ({
      name: checkbox.nextElementSibling.textContent.trim(),
      value: Number(checkbox.value),
    }));
}

function getEstimateData() {
  const services = getSelectedServices();
  const subtotal = services.reduce((sum, service) => sum + service.value, 0);
  const multiplier = Number(companyType.value) * Number(urgency.value);
  const adjusted = Math.round((subtotal * multiplier) / 1000) * 1000;

  return {
    services,
    min: Math.round((adjusted * 0.85) / 1000) * 1000,
    max: Math.round((adjusted * 1.2) / 1000) * 1000,
    companyType: companyType.options[companyType.selectedIndex].text,
    urgency: urgency.options[urgency.selectedIndex].text,
  };
}

function updateEstimate() {
  const estimate = getEstimateData();

  if (estimate.services.length === 0) {
    estimateTotal.style.display = "none";
    estimateDetails.style.display = "none";
    estimateActions.style.display = "none";
    estimateDetails.innerHTML = "";
    estimateMessage.textContent = "Seleccioná al menos un servicio para ver la estimación.";
    return;
  }

  estimateTotal.style.display = "block";
  estimateDetails.style.display = "block";
  estimateActions.style.display = "block";
  estimateTotal.textContent = `${formatter.format(estimate.min)} - ${formatter.format(estimate.max)}`;
  estimateMessage.textContent = "Rango orientativo para dimensionar el proyecto. El diagnóstico permite ajustar alcance, tiempos y prioridades.";
  estimateDetails.innerHTML = [
    `<li>Servicios: ${estimate.services.map((service) => service.name).join(", ")}</li>`,
    `<li>Empresa: ${estimate.companyType}</li>`,
    `<li>Prioridad: ${estimate.urgency}</li>`,
  ].join("");
}

serviceCheckboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", () => {
    updateEstimate();
    trackEvent("estimate_service_toggle", {
      service: checkbox.nextElementSibling.textContent.trim(),
      checked: checkbox.checked,
    });
  });
});

companyType.addEventListener("change", updateEstimate);
urgency.addEventListener("change", updateEstimate);

sendEstimate.addEventListener("click", () => {
  const estimate = getEstimateData();
  const message = [
    "Hola WEAGRO, quiero revisar esta estimación.",
    "",
    `Servicios: ${estimate.services.map((service) => service.name).join(", ")}`,
    `Tipo de empresa: ${estimate.companyType}`,
    `Prioridad: ${estimate.urgency}`,
    `Rango estimado: ${formatter.format(estimate.min)} - ${formatter.format(estimate.max)}`,
  ].join("\n");

  trackEvent("estimate_whatsapp_click", {
    services_count: estimate.services.length,
    min: estimate.min,
    max: estimate.max,
  });
  window.open(
    `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`,
    "_blank",
    "noopener,noreferrer"
  );
});

contactButtons.forEach((button) => {
  button.addEventListener("click", () => {
    trackEvent("cta_contact_click", {
      label: button.textContent.trim(),
    });
    document.getElementById("contacto").scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  });
});

whatsappLinks.forEach((link) => {
  link.addEventListener("click", () => {
    trackEvent("whatsapp_direct_click", {
      location: link.classList.contains("whatsapp-float") ? "floating_button" : "contact_panel",
    });
  });
});

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(contactForm);
  const message = [
    "Hola WEAGRO, quiero coordinar un diagnóstico sin cargo.",
    "",
    `Nombre: ${formData.get("name")}`,
    `Empresa: ${formData.get("company")}`,
    `Email: ${formData.get("email")}`,
    `Servicio de interés: ${formData.get("service")}`,
    `Mensaje: ${formData.get("message")}`,
  ].join("\n");
  
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

  trackEvent("contact_form_submit", {
    service: formData.get("service"),
  });
  
  contactStatus.style.display = "block";
  setTimeout(() => {
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  }, 500);
});

// Lógica del Slider de Testimonios
const track = document.querySelector('.testimonial-track');
const slides = Array.from(document.querySelectorAll('.testimonial-card'));
const nextBtn = document.querySelector('.slider-btn.next');
const prevBtn = document.querySelector('.slider-btn.prev');
let currentIdx = 0;

function updateSlider() {
  slides.forEach((slide, index) => {
    slide.classList.toggle('active', index === currentIdx);
  });
  track.style.transform = `translateX(-${currentIdx * 100}%)`;
}

if (nextBtn && prevBtn) {
  nextBtn.addEventListener('click', () => {
    currentIdx = (currentIdx + 1) % slides.length;
    updateSlider();
  });

  prevBtn.addEventListener('click', () => {
    currentIdx = (currentIdx - 1 + slides.length) % slides.length;
    updateSlider();
  });
}