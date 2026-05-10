// Inicialización de animaciones SVG (efecto dibujo)
import { createClient } from "@supabase/supabase-js";

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
    navigator.serviceWorker.register("/sw.js")
      .catch(err => console.log("SW registration failed:", err));
  });
}

// Ejecutar inicialización de SVGs al cargar el DOM
document.addEventListener('DOMContentLoaded', () => {
  initSVGAnimations();
  initBlurUp();
  initPortfolioAdmin();
});

// Progressive Image Loading (Blur-up)
function initBlurUp() {
  const blurElements = document.querySelectorAll('.blur-up');
  
  const loadHighRes = (el) => {
    const highResUrl = el.dataset.src;
    if (!highResUrl) return;

    const img = new Image();
    img.src = highResUrl;
    img.onload = () => {
      if (el.tagName === 'IMG') {
        el.src = highResUrl;
      } else {
        if (el.style.getPropertyValue('--pillar-image')) el.style.setProperty('--pillar-image', `url('${highResUrl}')`);
        if (el.style.getPropertyValue('--case-image')) el.style.setProperty('--case-image', `url('${highResUrl}')`);
      }
      el.classList.add('loaded');
    };
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        loadHighRes(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: '100px' });

  blurElements.forEach(el => {
    if (el.closest('.hero') || el.getAttribute('loading') === 'eager') {
      loadHighRes(el);
    } else {
      observer.observe(el);
    }
  });
}

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
  hamburger.setAttribute('aria-label', isOpen ? 'Abrir menú' : 'Cerrar menú');
}

function closeMenu() {
  hamburger.classList.remove('active');
  navMenu.classList.remove('active');
  if (navOverlay) navOverlay.classList.remove('active');
  document.body.classList.remove('nav-open');
  hamburger.setAttribute('aria-expanded', 'false');
  hamburger.setAttribute('aria-label', 'Abrir menú');
}

if (hamburger) {
  hamburger.addEventListener('click', toggleMenu);
  if (navOverlay) navOverlay.addEventListener('click', closeMenu);
  
  navLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
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
const backToTopButton = document.querySelector("[data-back-to-top]");

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

if (backToTopButton) {
  const toggleBackToTop = () => {
    const isVisible = window.scrollY > 520;
    backToTopButton.classList.toggle("is-visible", isVisible);
    backToTopButton.setAttribute("aria-hidden", String(!isVisible));
    backToTopButton.tabIndex = isVisible ? 0 : -1;
  };

  backToTopButton.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  toggleBackToTop();
  window.addEventListener("scroll", toggleBackToTop, { passive: true });
}

const brandStorageKey = "weagro_brand_logos";
const workStorageKey = "weagro_completed_work";
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

const defaultBrands = [
  { id: "brand-cabana", name: "Cabaña El Ombú", logoUrl: "" },
  { id: "brand-agroinsumos", name: "AgroInsumos NEA", logoUrl: "" },
  { id: "brand-distribuidora", name: "Distribuidora Formosa", logoUrl: "" },
  { id: "brand-cooperativa", name: "Cooperativa Regional", logoUrl: "" },
];

const defaultWorks = [
  {
    id: "work-cabana",
    company: "Cabaña El Ombú",
    sector: "Cabaña ganadera",
    description: "Sitio institucional para presentar genética, remates, reproductores y vías de contacto.",
    result: "Más confianza antes del primer contacto y consultas mejor calificadas.",
    imageUrl: "",
    services: ["Página web", "Branding", "SEO"],
  },
  {
    id: "work-agroinsumos",
    company: "AgroInsumos NEA",
    sector: "Insumos agropecuarios",
    description: "Webapp y catálogo digital para ordenar stock, productos destacados y consultas comerciales.",
    result: "Datos más claros para el equipo y oportunidades comerciales mejor organizadas.",
    imageUrl: "",
    services: ["Tienda online", "Webapp a medida", "Automatizaciones"],
  },
  {
    id: "work-distribuidora",
    company: "Distribuidora Formosa",
    sector: "Distribución agro",
    description: "Estrategia de contenidos y presencia digital para captar clientes en nuevas zonas.",
    result: "Mayor alcance comercial y mejor seguimiento de consultas por canal.",
    imageUrl: "",
    services: ["Redes sociales", "SEO", "Branding"],
  },
];

function getStoredItems(key, fallback) {
  try {
    const stored = JSON.parse(localStorage.getItem(key));
    return Array.isArray(stored) ? stored : fallback;
  } catch {
    return fallback;
  }
}

function setStoredItems(key, items) {
  localStorage.setItem(key, JSON.stringify(items));
}

function getInitials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 3)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

function isSafeAssetUrl(url) {
  if (!url) return false;

  try {
    const parsed = new URL(url, window.location.href);
    return ["http:", "https:"].includes(parsed.protocol) || url.startsWith("data:image/");
  } catch {
    return false;
  }
}

function createServiceTags(services) {
  const wrapper = document.createElement("div");
  wrapper.className = "service-tags";

  services.forEach((service) => {
    const tag = document.createElement("span");
    tag.className = "service-tag";
    tag.textContent = service;
    wrapper.appendChild(tag);
  });

  return wrapper;
}

function renderBrandLogos(brands) {
  const logoGrid = document.querySelector("[data-brand-logos]");
  if (!logoGrid) return;

  logoGrid.replaceChildren();

  brands.forEach((brand) => {
    const card = document.createElement("article");
    card.className = "brand-logo-card";
    card.setAttribute("aria-label", brand.name);

    if (isSafeAssetUrl(brand.logo_url || brand.logoUrl)) {
      const img = document.createElement("img");
      img.src = brand.logo_url || brand.logoUrl;
      img.alt = brand.name;
      img.loading = "lazy";
      card.appendChild(img);
    } else {
      const fallback = document.createElement("span");
      fallback.className = "brand-logo-fallback";
      fallback.textContent = getInitials(brand.name) || brand.name;
      card.appendChild(fallback);
    }

    logoGrid.appendChild(card);
  });
}

function renderWorks(works) {
  const workGrid = document.querySelector("[data-work-list]");
  if (!workGrid) return;

  workGrid.replaceChildren();

  works.forEach((work) => {
    const card = document.createElement("article");
    card.className = "card work-card";

    const media = document.createElement("div");
    media.className = "work-media";

    if (isSafeAssetUrl(work.image_url || work.imageUrl)) {
      media.classList.add("has-image");
      const img = document.createElement("img");
      img.src = work.image_url || work.imageUrl;
      img.alt = work.company;
      img.loading = "lazy";
      media.appendChild(img);
    }

    const mediaLabel = document.createElement("span");
    mediaLabel.textContent = work.company;
    media.appendChild(mediaLabel);

    const body = document.createElement("div");
    body.className = "work-body";

    const sector = document.createElement("p");
    sector.className = "work-sector";
    sector.textContent = work.sector;

    const title = document.createElement("h3");
    title.textContent = work.company;

    const description = document.createElement("p");
    description.textContent = work.description;

    body.append(sector, title, description);

    if (work.result) {
      const result = document.createElement("p");
      result.textContent = work.result;
      body.appendChild(result);
    }

    if (work.services?.length) {
      body.appendChild(createServiceTags(work.services));
    }

    card.append(media, body);
    workGrid.appendChild(card);
  });
}

function renderAdminList(items, selector, emptyText, onEdit, onDelete) {
  const list = document.querySelector(selector);
  if (!list) return;

  list.replaceChildren();

  if (!items.length) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = emptyText;
    list.appendChild(empty);
    return;
  }

  items.forEach((item) => {
    const row = document.createElement("div");
    row.className = "admin-item";

    const content = document.createElement("div");
    const name = document.createElement("strong");
    name.textContent = item.name || item.company;
    const meta = document.createElement("span");
    meta.textContent = item.sector || item.logo_url || item.logoUrl || "Sin logo cargado";
    content.append(name, meta);

    const actions = document.createElement("div");
    actions.className = "admin-item-actions";

    const editButton = document.createElement("button");
    editButton.className = "admin-edit";
    editButton.type = "button";
    editButton.textContent = "Editar";
    editButton.addEventListener("click", () => onEdit(item));

    const deleteButton = document.createElement("button");
    deleteButton.className = "admin-delete";
    deleteButton.type = "button";
    deleteButton.textContent = "Eliminar";
    deleteButton.addEventListener("click", () => onDelete(item.id));

    actions.append(editButton, deleteButton);
    row.append(content, actions);
    list.appendChild(row);
  });
}

function setAdminStatus(message, type = "info") {
  const status = document.querySelector("[data-admin-status]");
  if (!status) return;
  status.textContent = message;
  status.dataset.status = type;
}

function setAdminAccess(isLoggedIn) {
  const privatePanel = document.querySelector("[data-admin-private]");
  const logoutButton = document.querySelector("[data-admin-logout]");
  if (privatePanel) privatePanel.hidden = !isLoggedIn;
  if (logoutButton) logoutButton.hidden = !isLoggedIn;
}

function fileFromForm(formData, key) {
  const value = formData.get(key);
  return value instanceof File && value.size > 0 ? value : null;
}

function setFieldValue(form, name, value) {
  const field = form?.querySelector(`[name="${name}"]`);
  if (!field) return;
  field.value = value ?? "";
}

function focusField(form, name) {
  const field = form?.querySelector(`[name="${name}"]`);
  if (!field) return;
  field.focus({ preventScroll: true });
}

function normalizeServices(services) {
  if (Array.isArray(services)) return services;
  if (typeof services === "string") return services.split(",").map((service) => service.trim()).filter(Boolean);
  return [];
}

function sanitizeFileName(name) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .replace(/-+/g, "-")
    .toLowerCase();
}

async function uploadPublicImage(bucket, file) {
  if (!supabase || !file) return "";

  const path = `${Date.now()}-${sanitizeFileName(file.name)}`;
  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: "31536000",
    upsert: false,
  });

  if (error) throw error;

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

async function initPortfolioAdmin() {
  const brandForm = document.querySelector("[data-brand-form]");
  const workForm = document.querySelector("[data-work-form]");
  const loginForm = document.querySelector("[data-admin-login]");
  const logoutButton = document.querySelector("[data-admin-logout]");
  const brandFormTitle = document.querySelector("[data-brand-form-title]");
  const brandSubmit = document.querySelector("[data-brand-submit]");
  const brandCancel = document.querySelector("[data-brand-cancel]");
  const workFormTitle = document.querySelector("[data-work-form-title]");
  const workSubmit = document.querySelector("[data-work-submit]");
  const workCancel = document.querySelector("[data-work-cancel]");
  let brands = getStoredItems(brandStorageKey, defaultBrands);
  let works = getStoredItems(workStorageKey, defaultWorks);

  const sync = () => {
    setStoredItems(brandStorageKey, brands);
    setStoredItems(workStorageKey, works);
    renderBrandLogos(brands);
    renderWorks(works);
    renderAdminList(brands, "[data-admin-brand-list]", "Todavía no hay marcas cargadas.", editBrand, deleteBrand);
    renderAdminList(works, "[data-admin-work-list]", "Todavía no hay trabajos cargados.", editWork, deleteWork);
  };

  const resetBrandForm = () => {
    brandForm?.reset();
    if (brandForm) {
      setFieldValue(brandForm, "brandId", "");
      setFieldValue(brandForm, "currentLogoUrl", "");
    }
    if (brandFormTitle) brandFormTitle.textContent = "Agregar marca";
    if (brandSubmit) brandSubmit.textContent = "Guardar marca";
    if (brandCancel) brandCancel.hidden = true;
  };

  const resetWorkForm = () => {
    workForm?.reset();
    if (workForm) {
      setFieldValue(workForm, "workId", "");
      setFieldValue(workForm, "currentImageUrl", "");
      workForm.querySelectorAll('input[name="workServices"]').forEach((checkbox) => {
        checkbox.checked = false;
      });
    }
    if (workFormTitle) workFormTitle.textContent = "Agregar trabajo realizado";
    if (workSubmit) workSubmit.textContent = "Guardar trabajo";
    if (workCancel) workCancel.hidden = true;
  };

  function editBrand(brand) {
    if (!brandForm) return;
    setFieldValue(brandForm, "brandId", brand.id);
    setFieldValue(brandForm, "currentLogoUrl", brand.logo_url || brand.logoUrl || "");
    setFieldValue(brandForm, "brandName", brand.name || "");
    setFieldValue(brandForm, "brandLogo", "");
    if (brandFormTitle) brandFormTitle.textContent = "Editar marca";
    if (brandSubmit) brandSubmit.textContent = "Guardar cambios";
    if (brandCancel) brandCancel.hidden = false;
    setAdminStatus(`Editando marca: ${brand.name || "sin nombre"}.`, "info");
    brandForm.scrollIntoView({ behavior: "smooth", block: "center" });
    focusField(brandForm, "brandName");
  }

  function editWork(work) {
    if (!workForm) return;
    setFieldValue(workForm, "workId", work.id);
    setFieldValue(workForm, "currentImageUrl", work.image_url || work.imageUrl || "");
    setFieldValue(workForm, "workCompany", work.company || "");
    setFieldValue(workForm, "workSector", work.sector || "");
    setFieldValue(workForm, "workDescription", work.description || "");
    setFieldValue(workForm, "workResult", work.result || "");
    setFieldValue(workForm, "workImage", "");
    const services = new Set(normalizeServices(work.services));
    workForm.querySelectorAll('input[name="workServices"]').forEach((checkbox) => {
      checkbox.checked = services.has(checkbox.value);
    });
    if (workFormTitle) workFormTitle.textContent = "Editar trabajo realizado";
    if (workSubmit) workSubmit.textContent = "Guardar cambios";
    if (workCancel) workCancel.hidden = false;
    setAdminStatus(`Editando trabajo: ${work.company || "sin nombre"}.`, "info");
    workForm.scrollIntoView({ behavior: "smooth", block: "center" });
    focusField(workForm, "workCompany");
  }

  const loadFromSupabase = async () => {
    if (!supabase) {
      setAdminStatus("Modo local: configurá VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY para guardar en la base de datos.", "warning");
      setAdminAccess(true);
      sync();
      return;
    }

    const [{ data: brandRows, error: brandError }, { data: workRows, error: workError }] = await Promise.all([
      supabase.from("brands").select("id,name,logo_url").order("created_at", { ascending: false }),
      supabase.from("projects").select("id,company,sector,description,result,image_url,services").order("created_at", { ascending: false }),
    ]);

    if (brandError || workError) {
      console.error(brandError || workError);
      setAdminStatus("No se pudieron leer los datos de Supabase. Se muestra el respaldo local.", "warning");
      sync();
      return;
    }

    brands = brandRows;
    works = workRows;
    sync();
  };

  const refreshSession = async () => {
    if (!supabase) return;
    const { data } = await supabase.auth.getSession();
    const isLoggedIn = Boolean(data.session);
    setAdminAccess(isLoggedIn);
    setAdminStatus(isLoggedIn ? "Sesión admin activa. Los cambios se guardan en Supabase." : "Iniciá sesión para administrar marcas y trabajos.", isLoggedIn ? "success" : "info");
  };

  async function deleteBrand(id) {
    if (!window.confirm("¿Eliminar esta marca?")) return;

    if (!supabase) {
      brands = brands.filter((brand) => brand.id !== id);
      sync();
      return;
    }

    const { error } = await supabase.from("brands").delete().eq("id", id);
    if (error) {
      setAdminStatus(`No se pudo eliminar la marca: ${error.message}`, "error");
      return;
    }

    await loadFromSupabase();
  }

  async function deleteWork(id) {
    if (!window.confirm("¿Eliminar este trabajo realizado?")) return;

    if (!supabase) {
      works = works.filter((work) => work.id !== id);
      sync();
      return;
    }

    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) {
      setAdminStatus(`No se pudo eliminar el trabajo: ${error.message}`, "error");
      return;
    }

    await loadFromSupabase();
  }

  loginForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!supabase) {
      setAdminStatus("Supabase todavía no está configurado. Usando modo local.", "warning");
      setAdminAccess(true);
      return;
    }

    const formData = new FormData(loginForm);
    const email = String(formData.get("adminEmail") || "").trim();
    const password = String(formData.get("adminPassword") || "");
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setAdminStatus(`No se pudo iniciar sesión: ${error.message}`, "error");
      return;
    }

    loginForm.reset();
    await refreshSession();
    await loadFromSupabase();
  });

  logoutButton?.addEventListener("click", async () => {
    if (supabase) await supabase.auth.signOut();
    setAdminAccess(false);
    setAdminStatus("Sesión cerrada.", "info");
  });

  brandCancel?.addEventListener("click", resetBrandForm);
  workCancel?.addEventListener("click", resetWorkForm);

  brandForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(brandForm);
    const id = String(formData.get("brandId") || "").trim();
    const name = String(formData.get("brandName") || "").trim();
    const currentLogoUrl = String(formData.get("currentLogoUrl") || "").trim();
    const logoFile = fileFromForm(formData, "brandLogo");
    if (!name) return;

    try {
      if (!supabase) {
        const item = { id: id || crypto.randomUUID(), name, logo_url: currentLogoUrl };
        brands = id
          ? brands.map((brand) => (brand.id === id ? item : brand))
          : [item, ...brands];
        resetBrandForm();
        sync();
        return;
      }

      const logo_url = logoFile ? await uploadPublicImage("logos", logoFile) : currentLogoUrl;
      const request = id
        ? supabase.from("brands").update({ name, logo_url }).eq("id", id)
        : supabase.from("brands").insert({ name, logo_url });
      const { error } = await request;
      if (error) throw error;

      resetBrandForm();
      setAdminStatus(id ? "Marca actualizada correctamente." : "Marca guardada correctamente.", "success");
      await loadFromSupabase();
    } catch (error) {
      setAdminStatus(`No se pudo guardar la marca: ${error.message}`, "error");
    }
  });

  workForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(workForm);
    const id = String(formData.get("workId") || "").trim();
    const company = String(formData.get("workCompany") || "").trim();
    const sector = String(formData.get("workSector") || "").trim();
    const description = String(formData.get("workDescription") || "").trim();
    const result = String(formData.get("workResult") || "").trim();
    const currentImageUrl = String(formData.get("currentImageUrl") || "").trim();
    const imageFile = fileFromForm(formData, "workImage");
    const services = formData.getAll("workServices").map((service) => String(service));

    if (!company || !sector || !description) return;

    try {
      if (!supabase) {
        const item = { id: id || crypto.randomUUID(), company, sector, description, result, image_url: currentImageUrl, services };
        works = id
          ? works.map((work) => (work.id === id ? item : work))
          : [item, ...works];
        resetWorkForm();
        sync();
        return;
      }

      const image_url = imageFile ? await uploadPublicImage("projects", imageFile) : currentImageUrl;
      const payload = {
        company,
        sector,
        description,
        result,
        image_url,
        services,
      };
      const request = id
        ? supabase.from("projects").update(payload).eq("id", id)
        : supabase.from("projects").insert(payload);
      const { error } = await request;
      if (error) throw error;

      resetWorkForm();
      setAdminStatus(id ? "Trabajo actualizado correctamente." : "Trabajo guardado correctamente.", "success");
      await loadFromSupabase();
    } catch (error) {
      setAdminStatus(`No se pudo guardar el trabajo: ${error.message}`, "error");
    }
  });

  supabase?.auth.onAuthStateChange(() => {
    refreshSession();
    loadFromSupabase();
  });

  await loadFromSupabase();
  await refreshSession();
}

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

if (companyType && urgency && sendEstimate) {
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
}

contactButtons.forEach((button) => {
  button.addEventListener("click", () => {
    trackEvent("cta_contact_click", {
      label: button.textContent.trim(),
    });
    document.getElementById("contacto")?.scrollIntoView({
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

contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(contactForm);
  const submitButton = contactForm.querySelector('button[type="submit"]');
  const payload = {
    name: formData.get("name"),
    company: formData.get("company"),
    email: formData.get("email"),
    service: formData.get("service"),
    message: formData.get("message"),
  };
  const message = [
    "Hola WEAGRO, quiero coordinar un diagnóstico sin cargo.",
    "",
    `Nombre: ${payload.name}`,
    `Empresa: ${payload.company}`,
    `Email: ${payload.email}`,
    `Servicio de interés: ${payload.service}`,
    `Mensaje: ${payload.message}`,
  ].join("\n");
  
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

  trackEvent("contact_form_submit", { service: payload.service });

  submitButton.disabled = true;
  submitButton.textContent = "Enviando...";
  contactStatus.className = "form-status";
  contactStatus.style.display = "block";
  contactStatus.textContent = "Estamos enviando tu consulta por email.";

  fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
    .then(async (response) => {
      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        const error = new Error(errorBody.error || "No se pudo enviar el email.");
        throw error;
      }

      await response.json().catch(() => ({}));
      contactStatus.className = "form-status success";
      contactStatus.textContent =
        "Consulta enviada. Gracias, te vamos a responder a la brevedad.";
      contactForm.reset();
      trackEvent("contact_email_sent", { service: payload.service });
    })
    .catch(() => {
      contactStatus.className = "form-status error";
      contactStatus.innerHTML = `No pudimos enviar el email ahora. <a href="${whatsappUrl}" target="_blank" rel="noreferrer">Continuar por WhatsApp</a>.`;
      trackEvent("contact_email_failed", { service: payload.service });
    })
    .finally(() => {
      submitButton.disabled = false;
      submitButton.textContent = "Enviar consulta";
    });
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

// Efecto Parallax para elementos decorativos
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  const decoElements = document.querySelectorAll('.deco-element');
  
  decoElements.forEach((el, index) => {
    const speed = (index + 1) * 0.05; // Diferentes velocidades para cada uno
    const offset = scrollY * speed;
    el.style.setProperty('--parallax-offset', `${offset}px`);
  });
});
