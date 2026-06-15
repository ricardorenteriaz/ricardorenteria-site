const stages = ["Prospecto", "Calificado", "Propuesta", "Negociacion", "Ganado"];
const SUPABASE_URL = "https://itpdqkumkgaossbfhqhp.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0cGRxa3Vta2dhb3NzYmZocWhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3NjkxOTEsImV4cCI6MjA5NTM0NTE5MX0.o17idXAkho5s8ekQwZX_tJD-12lfwyA_bEVwgEkMx40";
const XOLTEC_ORGANIZATION_ID = "00000000-0000-4000-8000-000000000001";
const supabaseClient =
  window.supabase && SUPABASE_URL && SUPABASE_ANON_KEY
    ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    : null;
const supabaseSignupClient =
  window.supabase && SUPABASE_URL && SUPABASE_ANON_KEY
    ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      })
    : null;

const starterUsers = [
  {
    user: "ricardo",
    password: "admin",
    name: "RICARDO RENTERIA",
    position: "SUPER ADMIN",
    superAdmin: true,
  },
];

const starterProductCatalog = [
  {
    id: "panel-longi-640",
    name: "Panel solar marca SOL LONGI Mod 640 HIMO 6 NYTPE",
    workArea: "Generación fotovoltaica",
    isLot: false,
    price: 4800,
    defaultQuantity: 14,
  },
  {
    id: "inversor-growatt-max-9000",
    name: "Inversor GROWAT MAX 9,000 KW Mod TL",
    workArea: "Conversión eléctrica",
    isLot: false,
    price: 16000,
    defaultQuantity: 1,
  },
  {
    id: "kit-estructural-ajustable",
    name: "KIT estructural Ajustable a 14 paneles solares",
    workArea: "Estructura y montaje",
    isLot: true,
    price: 15500,
    defaultQuantity: 1,
  },
  {
    id: "cables-conectores-accesorios",
    name: "Cables conectores, accesorios eléctricos",
    workArea: "Instalación eléctrica",
    isLot: true,
    price: 12350,
    defaultQuantity: 1,
  },
  {
    id: "tramites-gestorias",
    name: "Tramites y Gestorías",
    workArea: "Gestión CFE",
    isLot: true,
    price: 5500,
    defaultQuantity: 1,
  },
  {
    id: "mano-obra",
    name: "Mano de Obra",
    workArea: "Mano de obra",
    isLot: true,
    price: 20500,
    defaultQuantity: 1,
  },
];

const mexicanStates = [
  "Aguascalientes",
  "Baja California",
  "Baja California Sur",
  "Campeche",
  "Chiapas",
  "Chihuahua",
  "Ciudad de México",
  "Coahuila",
  "Colima",
  "Durango",
  "Estado de México",
  "Guanajuato",
  "Guerrero",
  "Hidalgo",
  "Jalisco",
  "Michoacán",
  "Morelos",
  "Nayarit",
  "Nuevo León",
  "Oaxaca",
  "Puebla",
  "Querétaro",
  "Quintana Roo",
  "San Luis Potosí",
  "Sinaloa",
  "Sonora",
  "Tabasco",
  "Tamaulipas",
  "Tlaxcala",
  "Veracruz",
  "Yucatán",
  "Zacatecas",
];

const starterDeals = [
  {
    id: createId(),
    account: "Norte Energia",
    contact: "Laura Mendez",
    name: "Implementacion CRM ventas B2B",
    value: 42000,
    stage: "Propuesta",
    next: "Enviar ajuste de alcance",
    activity: "Hoy",
  },
  {
    id: createId(),
    account: "Clinica Altura",
    contact: "Diego Soto",
    name: "Portal de seguimiento comercial",
    value: 18500,
    stage: "Calificado",
    next: "Demo con direccion",
    activity: "Ayer",
  },
  {
    id: createId(),
    account: "Grupo Madero",
    contact: "Sofia Ruiz",
    name: "Automatizacion de cotizaciones",
    value: 63000,
    stage: "Negociacion",
    next: "Revisar contrato",
    activity: "Hace 2 dias",
  },
  {
    id: createId(),
    account: "Viva Retail",
    contact: "Marco Vidal",
    name: "Capacitacion equipo ventas",
    value: 12000,
    stage: "Prospecto",
    next: "Calificar presupuesto",
    activity: "Hace 4 dias",
  },
  {
    id: createId(),
    account: "Arco Logistica",
    contact: "Paola Herrera",
    name: "Soporte anual premium",
    value: 28500,
    stage: "Ganado",
    next: "Onboarding",
    activity: "Hace 1 semana",
  },
];

const starterTasks = [
  {
    id: createId(),
    title: "Preparar propuesta para Norte Energia",
    account: "Norte Energia",
    date: todayPlus(1),
    done: false,
  },
  {
    id: createId(),
    title: "Confirmar asistentes a demo",
    account: "Clinica Altura",
    date: todayPlus(2),
    done: false,
  },
  {
    id: createId(),
    title: "Enviar minuta de negociacion",
    account: "Grupo Madero",
    date: todayPlus(0),
    done: true,
  },
];

const state = loadState();
let editingQuoteId = null;
let editingProductId = null;
let editingUserName = null;
let pricesUnlocked = false;
let signatureDataUrl = "";
let usersRefreshPromise = null;

const money = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  maximumFractionDigits: 0,
});

const views = {
  dashboard: document.querySelector("#dashboard-view"),
  pipeline: document.querySelector("#pipeline-view"),
  accounts: document.querySelector("#accounts-view"),
  tasks: document.querySelector("#tasks-view"),
  quotes: document.querySelector("#quotes-view"),
  quoteHistory: document.querySelector("#quote-history-view"),
  products: document.querySelector("#products-view"),
  users: document.querySelector("#users-view"),
  maintenance: document.querySelector("#maintenance-view"),
};

const titles = {
  dashboard: "Dashboard",
  pipeline: "Pipeline",
  accounts: "Cuentas",
  tasks: "Tareas",
  quotes: "Cotizar",
  quoteHistory: "Cotizaciones",
  products: "Productos",
  users: "Usuarios",
  maintenance: "Mantenimiento",
};

document.querySelectorAll(".nav-item").forEach((button) => {
  button.addEventListener("click", () => setView(button.dataset.view));
});

document.querySelectorAll("[data-view-shortcut]").forEach((button) => {
  button.addEventListener("click", () => setView(button.dataset.viewShortcut));
});

document.querySelector("#search-input").addEventListener("input", render);
document.querySelector("#open-deal-modal").addEventListener("click", () => {
  document.querySelector("#deal-modal").showModal();
  document.querySelector("#deal-account").focus();
});
document.querySelector("#close-deal-modal").addEventListener("click", closeDealModal);
document.querySelector("#cancel-deal").addEventListener("click", closeDealModal);
document.querySelector("#deal-form").addEventListener("submit", addDeal);
document.querySelector("#task-form").addEventListener("submit", addTask);
document.querySelector("#quote-client-form").addEventListener("submit", addQuoteClient);
document.querySelector("#quote-client-list").addEventListener("click", handleQuoteActionClick);
document.querySelector("#quote-cancel-edit").addEventListener("click", resetQuoteForm);
document.querySelector("#unlock-prices").addEventListener("click", unlockQuotePrices);
document.querySelector("#same-install-address").addEventListener("change", syncInstallAddress);
document.querySelector("#quote-type").addEventListener("change", renderQuoteProducts);
document.querySelector("#quote-discount").addEventListener("input", renderQuoteProductTotals);
document.querySelector("#quote-commission-percent").addEventListener("input", renderQuoteProductTotals);
document.querySelector("#product-form").addEventListener("submit", addProduct);
document.querySelector("#product-cancel-edit").addEventListener("click", resetProductForm);
document.querySelector("#user-form").addEventListener("submit", addUser);
document.querySelector("#user-cancel-edit").addEventListener("click", resetUserForm);
document.querySelector("#clear-signature").addEventListener("click", clearSignaturePad);
document.querySelector("#signature-upload").addEventListener("change", importSignature);
document
  .querySelectorAll(
    "#quote-fiscal-street, #quote-fiscal-neighborhood, #quote-fiscal-city, #quote-fiscal-state, #quote-fiscal-zip",
  )
  .forEach((field) => field.addEventListener("input", syncInstallAddress));
document.querySelector("#login-form").addEventListener("submit", login);
document.querySelector("#logout-button").addEventListener("click", logout);
document.querySelector("#mobile-menu-toggle").addEventListener("click", toggleMobileMenu);
document.querySelector(".sidebar").addEventListener("click", closeMobileMenuFromBackdrop);
document.querySelector("#admin-download-backup").addEventListener("click", downloadCrmBackup);
document.querySelector("#admin-copy-backup").addEventListener("click", copyCrmBackup);
document.querySelector("#admin-import-backup-text").addEventListener("click", importCrmData);
document.querySelector("#admin-import-backup-file").addEventListener("change", importCrmBackupFile);

document.querySelector("#task-date").value = todayPlus(1);

populateStateSelects();
renderQuoteProducts();
setupSignaturePad();
syncAuthView();
render();
recoverSavedBrowserData();

async function restoreSupabaseSession() {
  if (!supabaseClient) return;
  const { data } = await supabaseClient.auth.getSession();
  if (!data.session) return;

  const profile = await loadSupabaseProfile(data.session.user.id);
  if (!profile) return;

  sessionStorage.setItem("ventas-crm-authenticated", "true");
  sessionStorage.setItem("ventas-crm-current-user", JSON.stringify(profileToLocalUser(profile)));
  sessionStorage.setItem("ventas-crm-auth-provider", "supabase");
  await loadSupabaseState();
  syncAuthView();
}

async function login(event) {
  event.preventDefault();
  const user = document.querySelector("#login-user").value.trim().toLowerCase();
  const password = cleanPassword(document.querySelector("#login-password").value);
  const error = document.querySelector("#auth-error");

  if (supabaseClient && user.includes("@")) {
    error.textContent = "Validando acceso...";
    const { data, error: authError } = await supabaseClient.auth.signInWithPassword({
      email: user,
      password,
    });

    if (authError || !data.user) {
      error.textContent = friendlyAuthError(authError);
      return;
    }

    const profile = await loadSupabaseProfile(data.user.id);
    if (!profile) {
      await supabaseClient.auth.signOut();
      error.textContent = "Tu usuario existe, pero falta el perfil del CRM.";
      return;
    }

    const currentUser = profileToLocalUser(profile);
    sessionStorage.setItem("ventas-crm-authenticated", "true");
    sessionStorage.setItem("ventas-crm-current-user", JSON.stringify(currentUser));
    sessionStorage.setItem("ventas-crm-auth-provider", "supabase");
    error.textContent = "";
    event.target.reset();
    await loadSupabaseState();
    syncAuthView();
    setView("quotes");
    document.querySelector(".sidebar").classList.remove("menu-open");
    return;
  }

  const matchedUser = state.users.find((item) => item.user === user && item.password === password);

  if (!matchedUser) {
    error.textContent = supabaseClient
      ? "Usa tu correo de Supabase para entrar al laboratorio."
      : "Usuario o contraseña incorrectos.";
    return;
  }

  sessionStorage.setItem("ventas-crm-authenticated", "true");
  sessionStorage.setItem("ventas-crm-current-user", JSON.stringify(matchedUser));
  sessionStorage.setItem("ventas-crm-auth-provider", "local");
  error.textContent = "";
  event.target.reset();
  syncAuthView();
  setView("quotes");
  document.querySelector(".sidebar").classList.remove("menu-open");
}

async function logout() {
  if (supabaseClient && sessionStorage.getItem("ventas-crm-auth-provider") === "supabase") {
    await supabaseClient.auth.signOut();
  }
  sessionStorage.removeItem("ventas-crm-authenticated");
  sessionStorage.removeItem("ventas-crm-current-user");
  sessionStorage.removeItem("ventas-crm-auth-provider");
  document.querySelector("#search-input").value = "";
  syncAuthView();
}

function populateStateSelects() {
  ["#quote-fiscal-state", "#quote-install-state"].forEach((selector) => {
    const select = document.querySelector(selector);
    select.innerHTML = [
      '<option value="">Selecciona estado</option>',
      ...mexicanStates.map((state) => `<option value="${escapeHtml(state)}">${escapeHtml(state)}</option>`),
    ].join("");
  });
}

async function loadSupabaseProfile(userId) {
  const { data, error } = await supabaseClient
    .from("profiles")
    .select("id, username, full_name, position, role, signature_url")
    .eq("id", userId)
    .single();

  if (error) {
    console.warn("No pude cargar el perfil de Supabase.", error);
    return null;
  }

  return data;
}

function profileToLocalUser(profile) {
  return {
    id: profile.id,
    user: profile.username,
    password: "",
    name: profile.full_name,
    position: profile.position,
    signature: profile.signature_url || "",
    superAdmin: profile.role === "super_admin",
    role: profile.role,
  };
}

async function loadSupabaseState() {
  if (!supabaseClient) return;

  const [productsResult, quotesResult, dealsResult, tasksResult, profilesResult] = await Promise.all([
    fetchSupabaseProducts(),
    supabaseClient
      .from("quotes")
      .select("*, quote_items(*)")
      .order("created_at", { ascending: false }),
    supabaseClient.from("deals").select("*").order("created_at", { ascending: false }),
    supabaseClient.from("tasks").select("*").order("created_at", { ascending: false }),
    supabaseClient.from("profiles").select("id, username, full_name, position, role, signature_url"),
  ]);

  const failed = [productsResult, quotesResult, dealsResult, tasksResult, profilesResult].find((result) => result.error);
  if (failed) {
    console.warn("No pude cargar datos de Supabase.", failed.error);
    window.alert(`No pude cargar datos de Supabase: ${failed.error.message}`);
    return;
  }

  state.products = productsResult.data.map(dbProductToLocal);
  state.quoteClients = quotesResult.data.map(dbQuoteToLocal);
  state.deals = dealsResult.data.map(dbDealToLocal);
  state.tasks = tasksResult.data.map(dbTaskToLocal);
  state.users = profilesResult.data.map(profileToLocalUser);
  saveState();
  renderQuoteProducts();
  render();
}

async function fetchSupabaseProducts() {
  const result = await supabaseClient
    .from("products")
    .select("id, legacy_id, name, work_area, is_lot, price, default_quantity")
    .eq("active", true)
    .order("created_at", { ascending: true });

  if (!result.error || !isMissingOptionalProductColumn(result.error)) {
    return result;
  }

  return supabaseClient
    .from("products")
    .select("id, legacy_id, name, price, default_quantity")
    .eq("active", true)
    .order("created_at", { ascending: true });
}

function isMissingOptionalProductColumn(error) {
  const message = String((error && error.message) || "");
  return message.includes("work_area") || message.includes("is_lot");
}

function dbProductToLocal(product) {
  return {
    id: product.id,
    legacyId: product.legacy_id,
    name: product.name,
    workArea: product.work_area || "",
    isLot: Boolean(product.is_lot),
    price: Number(product.price) || 0,
    defaultQuantity: Number(product.default_quantity) || 1,
  };
}

function dbQuoteToLocal(quote) {
  const products = (quote.quote_items || [])
    .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
    .map((item) => ({
      id: item.product_id || item.legacy_product_id || item.id,
      name: item.name,
      workArea: item.work_area || "",
      isLot: Boolean(item.is_lot),
      basePrice: Number(item.base_price) || Number(item.price) || 0,
      price: Number(item.price) || 0,
      quantity: Number(item.quantity) || 1,
      defaultQuantity: Number(item.default_quantity) || 1,
      lineTotal: Number(item.line_total) || 0,
      baseLineTotal: Number(item.base_line_total) || 0,
      commissionAdjustmentPercent: Number(item.commission_adjustment_percent) || 0,
      commissionAdjustmentAmount: Number(item.commission_adjustment_amount) || 0,
      selected: true,
    }));

  return {
    id: quote.id,
    company: quote.company,
    quoteType: quote.quote_type || "solar",
    taxId: quote.tax_id,
    contact: quote.contact,
    email: quote.email,
    phone: quote.phone,
    notes: quote.notes,
    referredBy: quote.referred_by,
    fiscalAddress: quote.fiscal_address || {},
    installationAddress: quote.installation_address || {},
    products,
    discountPercent: Number(quote.discount_percent) || 0,
    commissionPercent: Number(quote.commission_percent) || 0,
    commissionAppliedPercent: Number(quote.commission_applied_percent) || 0,
    commissionFor: quote.commission_for,
    commissionAmount: Number(quote.commission_amount) || 0,
    companyCommissionAmount: Number(quote.company_commission_amount) || 0,
    advancePercent: Number(quote.advance_percent) || 70,
    totals: {
      subtotal: Number(quote.subtotal) || 0,
      discountAmount: Number(quote.discount_amount) || 0,
      iva: Number(quote.iva) || 0,
      total: Number(quote.total) || 0,
    },
    createdAt: quote.created_at,
    updatedAt: quote.updated_at,
    preparedByUser: quote.prepared_by,
  };
}

function dbDealToLocal(deal) {
  return {
    id: deal.id,
    account: deal.account,
    contact: deal.contact,
    name: deal.name,
    value: Number(deal.value) || 0,
    stage: deal.stage,
    next: deal.next_step,
    activity: deal.activity,
  };
}

function dbTaskToLocal(task) {
  return {
    id: task.id,
    title: task.title,
    account: task.account,
    date: task.due_date,
    done: Boolean(task.done),
  };
}

function backupPayload() {
  return {
    app: "XOLTEC CRM",
    version: "20260526-supabase",
    exportedAt: new Date().toISOString(),
    source: isSupabaseSession() ? "supabase-cache" : "localStorage",
    data: state,
  };
}

function encodedBackupPayload() {
  return btoa(unescape(encodeURIComponent(JSON.stringify(backupPayload()))));
}

async function downloadCrmBackup() {
  const backup = isSupabaseSession() ? await supabaseBackupPayload() : backupPayload();
  if (!backup) return;
  const payload = JSON.stringify(backup, null, 2);
  const blob = new Blob([payload], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `xoltec-crm-${backup.source || "backup"}-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

async function copyCrmBackup() {
  const backup = isSupabaseSession() ? await supabaseBackupPayload() : backupPayload();
  if (!backup) return;
  const payload = btoa(unescape(encodeURIComponent(JSON.stringify(backup))));
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard
      .writeText(payload)
      .then(() => window.alert("Datos copiados. En el iPhone toca Importar datos y pega este texto."))
      .catch(() => window.prompt("Copia este texto para importarlo en el iPhone:", payload));
  } else {
    window.prompt("Copia este texto para importarlo en el iPhone:", payload);
  }
}

async function supabaseBackupPayload() {
  const [profilesResult, productsResult, quotesResult, quoteItemsResult, dealsResult, tasksResult] = await Promise.all([
    supabaseClient.from("profiles").select("*").order("created_at", { ascending: true }),
    supabaseClient.from("products").select("*").order("created_at", { ascending: true }),
    supabaseClient.from("quotes").select("*").order("created_at", { ascending: false }),
    supabaseClient.from("quote_items").select("*").order("sort_order", { ascending: true }),
    supabaseClient.from("deals").select("*").order("created_at", { ascending: false }),
    supabaseClient.from("tasks").select("*").order("created_at", { ascending: false }),
  ]);
  const failed = [profilesResult, productsResult, quotesResult, quoteItemsResult, dealsResult, tasksResult].find(
    (result) => result.error,
  );

  if (failed) {
    window.alert(`No pude generar el respaldo de Supabase: ${failed.error.message}`);
    return null;
  }

  return {
    app: "XOLTEC CRM",
    version: "20260526-supabase",
    exportedAt: new Date().toISOString(),
    source: "supabase",
    tables: {
      profiles: profilesResult.data,
      products: productsResult.data,
      quotes: quotesResult.data,
      quote_items: quoteItemsResult.data,
      deals: dealsResult.data,
      tasks: tasksResult.data,
    },
    data: state,
  };
}

function exportCrmData() {
  copyCrmBackup();
}

function importCrmData() {
  const payload = window.prompt("Pega aquí los datos exportados desde tu computadora:");
  if (!payload) return;
  try {
    restoreCrmState(JSON.parse(decodeURIComponent(escape(atob(payload.trim())))));
  } catch (error) {
    window.alert("No pude importar esos datos. Revisa que hayas pegado el texto completo.");
  }
}

function importCrmBackupFile(event) {
  const file = event.target.files && event.target.files[0];
  event.target.value = "";
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      restoreCrmState(JSON.parse(String(reader.result)));
    } catch (error) {
      window.alert("No pude importar ese archivo. Revisa que sea un respaldo JSON del CRM.");
    }
  };
  reader.readAsText(file);
}

function restoreCrmState(payload) {
  const importedState = payload && payload.data ? payload.data : payload;
  if (!importedState || typeof importedState !== "object") {
    window.alert("El respaldo no contiene datos válidos.");
    return;
  }
  localStorage.setItem("ventas-crm-state", JSON.stringify(importedState));
  window.alert("Datos importados. La app se recargará con el respaldo restaurado.");
  window.location.reload();
}

async function recoverSavedBrowserData() {
  const hasUserData =
    state.quoteClients.length > 0 ||
    state.users.some((user) => !isRicardoUser(user)) ||
    state.products.some((product) => !starterProductCatalog.some((starter) => starter.id === product.id));

  if (hasUserData) return;

  try {
    const response = await fetch("recovered-ventas-crm-state.json", { cache: "no-store" });
    if (!response.ok) return;
    const recoveredState = await response.json();
    if (!Array.isArray(recoveredState.quoteClients) || recoveredState.quoteClients.length === 0) return;

    state.deals = recoveredState.deals || state.deals;
    state.tasks = recoveredState.tasks || state.tasks;
    state.quoteClients = recoveredState.quoteClients || [];
    state.products = recoveredState.products || starterProductCatalog;
    state.users = ensureStarterUsers(recoveredState.users || []);
    saveState();
    renderQuoteProducts();
    syncAuthView();
    render();
  } catch (error) {
    console.warn("No se pudo recuperar el respaldo local del CRM.", error);
  }
}

function syncAuthView() {
  const isAuthenticated = sessionStorage.getItem("ventas-crm-authenticated") === "true";
  const currentUser = getCurrentUser();
  document.querySelector("#auth-screen").classList.toggle("hidden", isAuthenticated);
  document.querySelector("#app-shell").classList.toggle("locked", !isAuthenticated);
  document.querySelectorAll(".super-admin-only").forEach((item) => {
    item.classList.toggle("hidden", !isAuthenticated || !currentUser.superAdmin);
  });

  if (!isAuthenticated) {
    document.querySelector("#login-user").focus();
  } else if (
    !currentUser.superAdmin &&
    ((views.users && views.users.classList.contains("active")) ||
      (views.maintenance && views.maintenance.classList.contains("active")))
  ) {
    setView("quotes");
  }
}

function setView(view) {
  if (!views[view]) return;
  Object.values(views).forEach((section) => section.classList.remove("active"));
  views[view].classList.add("active");
  document.querySelector("#view-title").textContent = titles[view];
  document.body.dataset.view = view;
  const hideSearch = view === "users" || view === "maintenance";
  document.querySelector(".search").classList.toggle("hidden", hideSearch);
  if (hideSearch) document.querySelector("#search-input").value = "";
  if (view === "users" && isSupabaseSession()) refreshSupabaseUsers();
  document.querySelectorAll(".nav-item").forEach((button) => {
    button.classList.toggle("active", button.dataset.view === view);
  });
  document.querySelector(".sidebar").classList.remove("menu-open");
}

async function refreshSupabaseUsers() {
  if (!supabaseClient) return;
  if (usersRefreshPromise) return usersRefreshPromise;

  usersRefreshPromise = supabaseClient
    .from("profiles")
    .select("id, username, full_name, position, role, signature_url")
    .order("created_at", { ascending: true })
    .then(({ data, error }) => {
      if (error) {
        console.warn("No pude recargar usuarios de Supabase.", error);
        return;
      }
      state.users = data.map(profileToLocalUser);
      saveState();
      renderUsers();
      syncAuthView();
    })
    .finally(() => {
      usersRefreshPromise = null;
    });

  return usersRefreshPromise;
}

function toggleMobileMenu() {
  document.querySelector(".sidebar").classList.toggle("menu-open");
}

function closeMobileMenuFromBackdrop(event) {
  if (event.target.classList.contains("sidebar")) {
    document.querySelector(".sidebar").classList.remove("menu-open");
  }
}

function render() {
  const deals = filteredDeals();
  renderMetrics(deals);
  renderCompactPipeline(deals);
  renderPipelineBoard(deals);
  renderAccounts(deals);
  renderTasks();
  renderQuoteClients();
  renderProductsCatalog();
  renderUsers();
}

function renderMetrics(deals) {
  const openDeals = deals.filter((deal) => deal.stage !== "Ganado");
  const wonDeals = deals.filter((deal) => deal.stage === "Ganado");
  const forecast = openDeals.reduce((sum, deal) => sum + deal.value, 0);
  const won = wonDeals.reduce((sum, deal) => sum + deal.value, 0);
  const pendingTasks = state.tasks.filter((task) => !task.done).length;

  document.querySelector("#metrics").innerHTML = [
    metric("Pipeline abierto", money.format(forecast)),
    metric("Ventas ganadas", money.format(won)),
    metric("Oportunidades", String(deals.length)),
    metric("Tareas pendientes", String(pendingTasks)),
  ].join("");
}

function renderCompactPipeline(deals) {
  const html = stages
    .map((stage) => {
      const total = deals
        .filter((deal) => deal.stage === stage)
        .reduce((sum, deal) => sum + deal.value, 0);
      return `
        <div class="deal-card">
          <div class="deal-meta">
            <span class="pill">${stageLabel(stage)}</span>
            <span>${money.format(total)}</span>
          </div>
        </div>
      `;
    })
    .join("");
  document.querySelector("#compact-pipeline").innerHTML = html || emptyState("Sin oportunidades");
}

function renderPipelineBoard(deals) {
  document.querySelector("#pipeline-board").innerHTML = stages
    .map((stage) => {
      const stageDeals = deals.filter((deal) => deal.stage === stage);
      const total = stageDeals.reduce((sum, deal) => sum + deal.value, 0);
      return `
        <section class="stage-column">
          <div class="stage-header">
            <span>${stageLabel(stage)}</span>
            <span>${money.format(total)}</span>
          </div>
          ${stageDeals.map(dealCard).join("") || emptyState("Sin tratos")}
        </section>
      `;
    })
    .join("");
}

function renderAccounts(deals) {
  document.querySelector("#accounts-table").innerHTML =
    deals
      .map(
        (deal) => `
          <tr>
            <td><strong>${escapeHtml(deal.account)}</strong><br><span>${escapeHtml(deal.name)}</span></td>
            <td>${escapeHtml(deal.contact)}</td>
            <td><span class="pill">${stageLabel(deal.stage)}</span></td>
            <td>${money.format(deal.value)}</td>
            <td>${escapeHtml(deal.activity)}</td>
          </tr>
        `,
      )
      .join("") || `<tr><td colspan="5">${emptyState("No hay cuentas que coincidan")}</td></tr>`;
}

function renderTasks() {
  const tasks = filteredTasks().sort((a, b) => a.date.localeCompare(b.date));
  const upcoming = tasks.filter((task) => !task.done).slice(0, 4);

  document.querySelector("#upcoming-tasks").innerHTML =
    upcoming.map(taskItem).join("") || emptyState("Sin tareas pendientes");
  document.querySelector("#all-tasks").innerHTML =
    tasks.map(taskItem).join("") || emptyState("No hay tareas que coincidan");

  document.querySelectorAll("[data-task-id]").forEach((checkbox) => {
    checkbox.addEventListener("change", async () => {
      const task = state.tasks.find((item) => item.id === checkbox.dataset.taskId);
      task.done = checkbox.checked;
      if (isSupabaseSession()) {
        await saveSupabaseTask(task, true);
      }
      saveState();
      render();
    });
  });
}

async function addDeal(event) {
  event.preventDefault();
  const deal = {
    id: createId(),
    account: document.querySelector("#deal-account").value.trim(),
    contact: document.querySelector("#deal-contact").value.trim(),
    name: document.querySelector("#deal-name").value.trim(),
    value: Number(document.querySelector("#deal-value").value),
    stage: document.querySelector("#deal-stage").value,
    next: document.querySelector("#deal-next").value.trim(),
    activity: "Hoy",
  };
  const task = {
    id: createId(),
    title: deal.next,
    account: deal.account,
    date: todayPlus(2),
    done: false,
  };

  if (isSupabaseSession()) {
    const savedDeal = await saveSupabaseDeal(deal);
    if (!savedDeal) return;
    deal.id = savedDeal.id;

    const savedTask = await saveSupabaseTask(task);
    if (savedTask) task.id = savedTask.id;
  }

  state.deals.unshift(deal);
  state.tasks.unshift(task);
  saveState();
  event.target.reset();
  closeDealModal();
  setView("pipeline");
  render();
}

async function addTask(event) {
  event.preventDefault();
  const task = {
    id: createId(),
    title: document.querySelector("#task-title").value.trim(),
    account: document.querySelector("#task-account").value.trim(),
    date: document.querySelector("#task-date").value,
    done: false,
  };

  if (isSupabaseSession()) {
    const savedTask = await saveSupabaseTask(task);
    if (!savedTask) return;
    task.id = savedTask.id;
  }

  state.tasks.unshift(task);
  saveState();
  event.target.reset();
  document.querySelector("#task-date").value = todayPlus(1);
  render();
}

async function saveSupabaseDeal(deal) {
  const currentUser = getCurrentUser();
  const payload = {
    organization_id: XOLTEC_ORGANIZATION_ID,
    owner_id: currentUser.id || null,
    account: deal.account,
    contact: deal.contact,
    name: deal.name,
    value: deal.value,
    stage: deal.stage,
    next_step: deal.next,
    activity: deal.activity,
  };

  const { data, error } = await supabaseClient.from("deals").insert(payload).select().single();
  if (error) {
    window.alert(`No pude guardar la oportunidad en Supabase: ${error.message}`);
    return null;
  }

  return data;
}

async function saveSupabaseTask(task, isEditing = false) {
  const currentUser = getCurrentUser();
  const payload = {
    organization_id: XOLTEC_ORGANIZATION_ID,
    owner_id: currentUser.id || null,
    title: task.title,
    account: task.account,
    due_date: task.date,
    done: task.done,
  };

  const query = isEditing
    ? supabaseClient.from("tasks").update(payload).eq("id", task.id).select().single()
    : supabaseClient.from("tasks").insert(payload).select().single();
  const { data, error } = await query;
  if (error) {
    window.alert(`No pude guardar la tarea en Supabase: ${error.message}`);
    return null;
  }

  return data;
}

async function addQuoteClient(event) {
  event.preventDefault();
  const products = selectedQuoteProducts();
  const totals = calculateQuoteTotals(products);
  const commission = calculateCommission(products);

  if (products.length === 0) {
    document.querySelector("#quote-total-box").innerHTML = `
      <div class="quote-warning">Selecciona al menos un producto para guardar la cotización.</div>
    `;
    return;
  }

  const existingQuote = state.quoteClients.find((quote) => quote.id === editingQuoteId);
  const currentUser = getCurrentUser();
  const quote = {
    id: editingQuoteId || createId(),
    company: document.querySelector("#quote-company").value.trim(),
    quoteType: document.querySelector("#quote-type").value || "solar",
    taxId: document.querySelector("#quote-tax-id").value.trim(),
    contact: document.querySelector("#quote-contact").value.trim(),
    email: document.querySelector("#quote-email").value.trim(),
    phone: document.querySelector("#quote-phone").value.trim(),
    notes: document.querySelector("#quote-notes").value.trim(),
    referredBy: document.querySelector("#quote-referred-by").value.trim(),
    fiscalAddress: readAddress("fiscal"),
    installationAddress: readAddress("install"),
    products,
    discountPercent: Number(document.querySelector("#quote-discount").value) || 0,
    commissionPercent: Number(document.querySelector("#quote-commission-percent").value) || 0,
    commissionFor: document.querySelector("#quote-commission-for").value.trim(),
    commissionAmount: commission.amount,
    commissionAppliedPercent: commission.appliedPercent,
    companyCommissionAmount: commission.companyAmount,
    advancePercent: Number(document.querySelector("#quote-advance-percent").value) || 0,
    totals,
    createdAt: (existingQuote && existingQuote.createdAt) || new Date().toISOString(),
    preparedByUser: (existingQuote && existingQuote.preparedByUser) || currentUser.user,
    updatedAt: editingQuoteId ? new Date().toISOString() : null,
  };

  if (isSupabaseSession()) {
    const savedQuote = await saveSupabaseQuote(quote, Boolean(editingQuoteId));
    if (!savedQuote) return;
    quote.id = savedQuote.id;
    quote.createdAt = savedQuote.created_at;
    quote.updatedAt = savedQuote.updated_at;
    quote.preparedByUser = savedQuote.prepared_by;
  }

  if (editingQuoteId) {
    state.quoteClients = state.quoteClients.map((item) => (item.id === editingQuoteId ? quote : item));
  } else {
    state.quoteClients.unshift(quote);
  }

  saveState();
  resetQuoteForm();
  render();
}

async function saveSupabaseQuote(quote, isEditing) {
  const currentUser = getCurrentUser();
  const payload = {
    organization_id: XOLTEC_ORGANIZATION_ID,
    prepared_by: currentUser.id || null,
    company: quote.company,
    quote_type: quote.quoteType || "solar",
    tax_id: quote.taxId,
    contact: quote.contact,
    email: quote.email,
    phone: quote.phone,
    notes: quote.notes,
    referred_by: quote.referredBy,
    fiscal_address: quote.fiscalAddress,
    installation_address: quote.installationAddress,
    discount_percent: quote.discountPercent,
    commission_percent: quote.commissionPercent,
    commission_applied_percent: quote.commissionAppliedPercent,
    commission_for: quote.commissionFor,
    commission_amount: quote.commissionAmount,
    company_commission_amount: quote.companyCommissionAmount,
    advance_percent: quote.advancePercent,
    subtotal: quote.totals.subtotal,
    discount_amount: quote.totals.discountAmount,
    iva: quote.totals.iva,
    total: quote.totals.total,
    updated_at: isEditing ? new Date().toISOString() : null,
  };

  const quoteQuery = isEditing
    ? supabaseClient.from("quotes").update(payload).eq("id", quote.id).select().single()
    : supabaseClient.from("quotes").insert(payload).select().single();
  let { data: savedQuote, error: quoteError } = await quoteQuery;

  if (quoteError && String(quoteError.message || "").includes("quote_type")) {
    const fallbackPayload = { ...payload };
    delete fallbackPayload.quote_type;
    const fallbackQuery = isEditing
      ? supabaseClient.from("quotes").update(fallbackPayload).eq("id", quote.id).select().single()
      : supabaseClient.from("quotes").insert(fallbackPayload).select().single();
    const fallbackResult = await fallbackQuery;
    savedQuote = fallbackResult.data;
    quoteError = fallbackResult.error;
  }

  if (quoteError) {
    window.alert(`No pude guardar la cotización en Supabase: ${quoteError.message}`);
    return null;
  }

  if (isEditing) {
    const { error: deleteError } = await supabaseClient.from("quote_items").delete().eq("quote_id", savedQuote.id);
    if (deleteError) {
      window.alert(`Guardé la cotización, pero no pude actualizar sus conceptos: ${deleteError.message}`);
      return null;
    }
  }

  const items = quote.products.map((product, index) => ({
    quote_id: savedQuote.id,
    product_id: isUuid(product.id) ? product.id : null,
    legacy_product_id: product.legacyId || (!isUuid(product.id) ? product.id : null),
    name: product.name,
    work_area: product.workArea || "",
    is_lot: Boolean(product.isLot),
    base_price: product.basePrice || product.price,
    price: product.price,
    quantity: product.quantity,
    default_quantity: product.defaultQuantity || 1,
    line_total: product.lineTotal,
    base_line_total: product.baseLineTotal || product.lineTotal,
    commission_adjustment_percent: product.commissionAdjustmentPercent || 0,
    commission_adjustment_amount: product.commissionAdjustmentAmount || 0,
    sort_order: index,
  }));

  let { error: itemsError } = await supabaseClient.from("quote_items").insert(items);
  if (itemsError && isMissingOptionalProductColumn(itemsError)) {
    const fallbackItems = items.map(({ work_area, is_lot, ...item }) => item);
    const fallbackResult = await supabaseClient.from("quote_items").insert(fallbackItems);
    itemsError = fallbackResult.error;
  }
  if (itemsError) {
    window.alert(`Guardé la cotización, pero no pude guardar sus conceptos: ${itemsError.message}`);
    return null;
  }

  return savedQuote;
}

function renderQuoteClients() {
  const clients = filteredQuoteClients();
  document.querySelector("#quote-client-count").textContent = String(clients.length);
  document.querySelector("#quote-client-list").innerHTML =
    clients.map(quoteListItem).join("") || emptyState("No hay cotizaciones guardadas");
}

function handleQuoteActionClick(event) {
  const button = event.target.closest("button");
  if (!button) return;
  if (button.dataset.pdfQuote) generateQuotePdf(button.dataset.pdfQuote);
  if (button.dataset.whatsappQuote) shareQuoteByWhatsApp(button.dataset.whatsappQuote);
  if (button.dataset.emailQuote) shareQuoteByEmail(button.dataset.emailQuote);
  if (button.dataset.editQuote) editQuote(button.dataset.editQuote);
  if (button.dataset.deleteQuote) deleteQuote(button.dataset.deleteQuote);
}

function renderQuoteProducts() {
  const showWorkArea = document.querySelector("#quote-type").value === "maintenance";
  document.querySelector("#quote-products").innerHTML = state.products
    .map(
      (product) => `
        <article class="quote-product-row">
          <label class="checkbox-row">
            <input class="quote-product-check" data-product-id="${product.id}" type="checkbox" />
            <span>
              ${escapeHtml(product.name)}
              ${showWorkArea ? `<small>Área a trabajar: ${escapeHtml(product.workArea || "Sin especificar")}</small>` : ""}
            </span>
          </label>
          <label class="quote-price-input">
            Precio
            <input class="quote-product-price-input" data-product-id="${product.id}" type="number" min="0" step="0.01" value="${product.price}" ${pricesUnlocked ? "" : "disabled"} />
          </label>
          <label class="quote-quantity">
            ${product.isLot ? "Lote" : "Cant."}
            <input class="quote-product-quantity" data-product-id="${product.id}" type="number" min="1" step="1" value="${product.defaultQuantity}" />
          </label>
        </article>
      `,
    )
    .join("");

  document
    .querySelectorAll(".quote-product-check, .quote-product-quantity, .quote-product-price-input")
    .forEach((field) => {
      field.addEventListener("input", renderQuoteProductTotals);
      field.addEventListener("change", renderQuoteProductTotals);
    });
  document.querySelector("#unlock-prices").textContent = pricesUnlocked
    ? "Precios desbloqueados"
    : "Modificar precios";
  renderQuoteProductTotals();
}

function resetQuoteForm() {
  editingQuoteId = null;
  document.querySelector("#quote-client-form").reset();
  document.querySelector("#quote-type").disabled = false;
  document.querySelector("#same-install-address").checked = false;
  renderQuoteProducts();
  updateQuoteFormMode();
}

function updateQuoteFormMode() {
  const isEditing = Boolean(editingQuoteId);
  document.querySelector("#quote-form-title").textContent = isEditing
    ? "Editar cotización"
    : "Nueva cotización";
  document.querySelector("#quote-form-mode").textContent = isEditing
    ? "Modificando"
    : "Cliente + productos";
  document.querySelector("#quote-save-button").textContent = isEditing
    ? "Guardar cambios"
    : "Guardar cotización";
  document.querySelector("#quote-type").disabled = isEditing;
  document.querySelector("#quote-type").title = isEditing
    ? "El tipo de cotización queda fijo después de guardar."
    : "";
  document.querySelector("#quote-cancel-edit").classList.toggle("hidden", !isEditing);
}

function editQuote(quoteId) {
  const quote = state.quoteClients.find((item) => item.id === quoteId);
  if (!quote) return;

  editingQuoteId = quote.id;
  setView("quotes");
  document.querySelector("#quote-type").value = quote.quoteType || "solar";
  renderQuoteProducts();
  document.querySelector("#quote-company").value = quote.company || "";
  document.querySelector("#quote-tax-id").value = quote.taxId || "";
  document.querySelector("#quote-contact").value = quote.contact || "";
  document.querySelector("#quote-email").value = quote.email || "";
  document.querySelector("#quote-phone").value = quote.phone || "";
  document.querySelector("#quote-notes").value = quote.notes || "";
  document.querySelector("#quote-referred-by").value = quote.referredBy || "";
  document.querySelector("#quote-discount").value = quote.discountPercent || 0;
  document.querySelector("#quote-commission-percent").value = quote.commissionPercent || 0;
  document.querySelector("#quote-commission-for").value = quote.commissionFor || "";
  document.querySelector("#quote-advance-percent").value = quote.advancePercent || 70;
  fillAddress("fiscal", quote.fiscalAddress);
  fillAddress("install", quote.installationAddress);
  document.querySelector("#same-install-address").checked = addressesMatch(
    quote.fiscalAddress,
    quote.installationAddress,
  );
  applyQuoteProducts(quote.products || []);
  updateQuoteFormMode();
  document.querySelector("#quote-client-form").scrollIntoView({ behavior: "smooth", block: "start" });
}

function applyQuoteProducts(products) {
  const productMap = new Map(products.map((product) => [product.id, product]));
  state.products.forEach((product) => {
    const savedProduct = productMap.get(product.id);
    const checkbox = document.querySelector(`.quote-product-check[data-product-id="${product.id}"]`);
    const quantityField = document.querySelector(
      `.quote-product-quantity[data-product-id="${product.id}"]`,
    );
    const priceField = document.querySelector(
      `.quote-product-price-input[data-product-id="${product.id}"]`,
    );
    checkbox.checked = Boolean(savedProduct);
    quantityField.value = (savedProduct && savedProduct.quantity) || product.defaultQuantity;
    priceField.value = (savedProduct && (savedProduct.basePrice || savedProduct.price)) || product.price;
  });
  renderQuoteProductTotals();
}

function unlockQuotePrices() {
  if (pricesUnlocked) return;
  const currentUser = getCurrentUser();
  if (currentUser && currentUser.superAdmin) {
    setQuotePricesUnlocked();
    return;
  }

  const password = window.prompt("Contraseña de administrador para modificar precios:");
  if (!isAdminPassword(password)) {
    window.alert("Contraseña incorrecta.");
    return;
  }
  setQuotePricesUnlocked();
}

function setQuotePricesUnlocked() {
  pricesUnlocked = true;
  document.querySelectorAll(".quote-product-price-input").forEach((input) => {
    input.disabled = false;
  });
  document.querySelector("#unlock-prices").textContent = "Precios desbloqueados";
}

async function deleteQuote(quoteId) {
  const quote = state.quoteClients.find((item) => item.id === quoteId);
  if (!quote) return;
  const quoteName = quote.company || quote.contact || "esta cotización";
  const confirmed = window.confirm(`¿Eliminar la cotización de ${quoteName}? Esta acción no se puede deshacer.`);
  if (!confirmed) return;

  if (isSupabaseSession()) {
    const { error } = await supabaseClient.from("quotes").delete().eq("id", quoteId);
    if (error) {
      window.alert(`No pude eliminar la cotización en Supabase: ${error.message}`);
      return;
    }
  }

  state.quoteClients = state.quoteClients.filter((item) => item.id !== quoteId);
  if (editingQuoteId === quoteId) {
    resetQuoteForm();
  }
  saveState();
  render();
}

function renderQuoteProductTotals() {
  const products = selectedQuoteProducts();
  const totals = calculateQuoteTotals(products);
  const commission = calculateCommission(products);
  document.querySelector("#quote-total-box").innerHTML = `
    <div><span>Subtotal</span><strong>${money.format(totals.subtotal)}</strong></div>
    <div><span>Descuento</span><strong>${money.format(totals.discountAmount)}</strong></div>
    <div><span>IVA</span><strong>${money.format(totals.iva)}</strong></div>
    <div class="quote-grand-total"><span>Total</span><strong>${money.format(totals.total)}</strong></div>
  `;
  document.querySelector("#commission-result").innerHTML = `
    <div>
      <span>Cliente: se aplica ${commission.appliedPercent}% a cada concepto</span>
      <strong>${money.format(commission.amount)}</strong>
    </div>
    <div>
      <span>COMISIÓN QUE PAGA LA EMPRESA</span>
      <strong>${money.format(commission.companyAmount)}</strong>
    </div>
  `;
}

function selectedQuoteProducts() {
  return state.products
    .map((product) => {
      const checkbox = document.querySelector(`.quote-product-check[data-product-id="${product.id}"]`);
      const quantityField = document.querySelector(
        `.quote-product-quantity[data-product-id="${product.id}"]`,
      );
      const priceField = document.querySelector(
        `.quote-product-price-input[data-product-id="${product.id}"]`,
      );
      const quantity = Math.max(Number(quantityField && quantityField.value) || product.defaultQuantity, 1);
      const basePrice = Math.max(Number(priceField && priceField.value) || product.price, 0);
      const commissionAdjustmentPercent = commissionPriceAdjustmentPercent();
      const price = basePrice * (1 + commissionAdjustmentPercent / 100);
      const baseLineTotal = quantity * basePrice;
      const lineTotal = quantity * price;
      return {
        ...product,
        basePrice,
        price,
        quantity,
        isLot: Boolean(product.isLot),
        baseLineTotal,
        lineTotal,
        commissionAdjustmentPercent,
        commissionAdjustmentAmount: lineTotal - baseLineTotal,
        selected: (checkbox && checkbox.checked) || false,
      };
    })
    .filter((product) => product.selected);
}

function calculateQuoteTotals(products) {
  const subtotal = products.reduce((sum, product) => sum + product.lineTotal, 0);
  const discountPercent = Math.min(
    Math.max(Number(document.querySelector("#quote-discount").value) || 0, 0),
    100,
  );
  const discountAmount = subtotal * (discountPercent / 100);
  const taxableSubtotal = subtotal - discountAmount;
  const iva = taxableSubtotal * 0.16;
  return {
    subtotal,
    discountAmount,
    iva,
    total: taxableSubtotal + iva,
  };
}

function formatProductQuantity(product) {
  const quantity = Number(product && product.quantity) || Number(product && product.defaultQuantity) || 1;
  return product && product.isLot ? `${quantity} LOTE` : String(quantity);
}

function quoteTypeLabel(type) {
  return type === "maintenance" ? "Mantenimiento y obra civil" : "Paneles solares";
}

function cleanPassword(value) {
  return String(value || "").trim();
}

function friendlyAuthError(error) {
  const message = String((error && error.message) || "");
  if (message === "Invalid login credentials") {
    return "Correo o contraseña incorrectos. En el lab debes entrar con el correo completo y la contraseña exacta creada en Usuarios.";
  }
  if (message === "Email not confirmed") {
    return "Ese correo todavía no está confirmado en Supabase.";
  }
  return message || "No pude iniciar sesión en Supabase.";
}

function commissionPriceAdjustmentPercent() {
  const percent = Math.min(
    Math.max(Number(document.querySelector("#quote-commission-percent").value) || 0, 0),
    100,
  );
  return percent / 2;
}

function calculateCommission(products) {
  const percent = Math.min(
    Math.max(Number(document.querySelector("#quote-commission-percent").value) || 0, 0),
    100,
  );
  const appliedPercent = percent / 2;
  const amount = products.reduce((sum, product) => sum + (product.commissionAdjustmentAmount || 0), 0);
  return {
    percent,
    appliedPercent,
    amount,
    companyAmount: amount,
  };
}

async function addProduct(event) {
  event.preventDefault();
  const product = {
    id: editingProductId || createId(),
    name: document.querySelector("#product-name").value.trim(),
    workArea: document.querySelector("#product-work-area").value.trim(),
    isLot: document.querySelector("#product-is-lot").checked,
    price: Number(document.querySelector("#product-price").value) || 0,
    defaultQuantity: Math.max(Number(document.querySelector("#product-quantity").value) || 1, 1),
  };

  if (isSupabaseSession()) {
    const savedProduct = await saveSupabaseProduct(product, Boolean(editingProductId));
    if (!savedProduct) return;
    product.id = savedProduct.id;
    product.legacyId = savedProduct.legacy_id;
  }

  if (editingProductId) {
    state.products = state.products.map((item) => (item.id === editingProductId ? product : item));
  } else {
    state.products.unshift(product);
  }

  saveState();
  resetProductForm();
  renderProductsCatalog();
  renderQuoteProducts();
}

async function saveSupabaseProduct(product, isEditing) {
  const payload = {
    organization_id: XOLTEC_ORGANIZATION_ID,
    legacy_id: product.legacyId || (isEditing ? null : product.id),
    name: product.name,
    work_area: product.workArea || "",
    is_lot: Boolean(product.isLot),
    price: product.price,
    default_quantity: product.defaultQuantity,
    active: true,
  };

  const query = isEditing
    ? supabaseClient.from("products").update(payload).eq("id", product.id).select().single()
    : supabaseClient.from("products").insert(payload).select().single();
  let { data, error } = await query;

  if (error && isMissingOptionalProductColumn(error)) {
    const fallbackPayload = { ...payload };
    delete fallbackPayload.work_area;
    delete fallbackPayload.is_lot;
    const fallbackQuery = isEditing
      ? supabaseClient.from("products").update(fallbackPayload).eq("id", product.id).select().single()
      : supabaseClient.from("products").insert(fallbackPayload).select().single();
    const fallbackResult = await fallbackQuery;
    data = fallbackResult.data;
    error = fallbackResult.error;
  }

  if (error) {
    window.alert(`No pude guardar el producto en Supabase: ${error.message}`);
    return null;
  }

  return data;
}

function editProduct(productId) {
  const product = state.products.find((item) => item.id === productId);
  if (!product) return;

  editingProductId = product.id;
  document.querySelector("#product-name").value = product.name || "";
  document.querySelector("#product-work-area").value = product.workArea || "";
  document.querySelector("#product-is-lot").checked = Boolean(product.isLot);
  document.querySelector("#product-price").value = product.price || 0;
  document.querySelector("#product-quantity").value = product.defaultQuantity || 1;
  updateProductFormMode();
  document.querySelector("#product-form").scrollIntoView({ behavior: "smooth", block: "start" });
}

function resetProductForm() {
  editingProductId = null;
  document.querySelector("#product-form").reset();
  document.querySelector("#product-quantity").value = 1;
  document.querySelector("#product-is-lot").checked = false;
  updateProductFormMode();
}

function updateProductFormMode() {
  const isEditing = Boolean(editingProductId);
  document.querySelector("#product-form-title").textContent = isEditing
    ? "Editar producto o concepto"
    : "Nuevo producto o concepto";
  document.querySelector("#product-form-mode").textContent = isEditing ? "Modificando" : "Catálogo";
  document.querySelector("#product-save-button").textContent = isEditing ? "Guardar cambios" : "Agregar producto";
  document.querySelector("#product-cancel-edit").classList.toggle("hidden", !isEditing);
}

function renderProductsCatalog() {
  const products = filteredProducts();
  document.querySelector("#product-count").textContent = String(products.length);
  document.querySelector("#product-list").innerHTML =
    products
      .map(
        (product) => `
          <article class="product-card">
            <strong>${escapeHtml(product.name)}</strong>
            <div class="deal-meta">
              <span>Área: ${escapeHtml(product.workArea || "Sin especificar")}</span>
              <span>${money.format(product.price)}</span>
              <span>Cantidad sugerida: ${formatProductQuantity(product)}</span>
            </div>
            <div class="quote-card-actions">
              <button class="ghost-button" data-edit-product="${product.id}" type="button">Editar</button>
              <button class="danger-button" data-delete-product="${product.id}" type="button">Eliminar</button>
            </div>
          </article>
        `,
      )
      .join("") || emptyState("Aún no hay productos");

  document.querySelectorAll("[data-edit-product]").forEach((button) => {
    button.addEventListener("click", () => editProduct(button.dataset.editProduct));
  });
  document.querySelectorAll("[data-delete-product]").forEach((button) => {
    button.addEventListener("click", () => deleteProduct(button.dataset.deleteProduct));
  });
}

async function addUser(event) {
  event.preventDefault();
  if (isSupabaseSession()) await refreshSupabaseUsers();

  const user = document.querySelector("#new-user-login").value.trim().toLowerCase();
  const existingUser = state.users.find((item) => item.user === editingUserName);
  const currentSignature = signatureDataUrl || readSignaturePad();
  const selectedRole = document.querySelector("#new-user-role").value || "seller";

  if (!editingUserName && state.users.some((item) => item.user === user)) {
    window.alert("Ese usuario ya existe.");
    return;
  }

  if (editingUserName && user !== editingUserName && state.users.some((item) => item.user === user)) {
    window.alert("Ese usuario ya existe.");
    return;
  }

  const updatedUser = {
    id: existingUser && existingUser.id,
    user,
    password: cleanPassword(document.querySelector("#new-user-password").value),
    name: document.querySelector("#new-user-name").value.trim().toUpperCase(),
    position: document.querySelector("#new-user-position").value.trim().toUpperCase(),
    signature: currentSignature,
    superAdmin: selectedRole === "super_admin",
    role: selectedRole,
  };

  if (isSupabaseSession()) {
    const savedUser = await saveSupabaseUser(updatedUser, Boolean(editingUserName));
    if (!savedUser) return;
    updatedUser.id = savedUser.id;
    updatedUser.user = savedUser.username;
    updatedUser.name = savedUser.full_name;
    updatedUser.position = savedUser.position;
    updatedUser.signature = savedUser.signature_url || "";
    updatedUser.role = savedUser.role;
    updatedUser.superAdmin = savedUser.role === "super_admin";
  }

  if (editingUserName) {
    state.users = state.users.map((item) => (item.user === editingUserName ? updatedUser : item));
    const currentUser = getCurrentUser();
    if (currentUser.user === editingUserName) {
      sessionStorage.setItem("ventas-crm-current-user", JSON.stringify(updatedUser));
    }
  } else {
    state.users.push(updatedUser);
  }

  saveState();
  resetUserForm();
  renderUsers();
  syncAuthView();
  if (!editingUserName && isSupabaseSession()) {
    window.alert(`Usuario creado. Para entrar usa el correo ${updatedUser.user} y la contraseña que acabas de asignar.`);
  }
}

async function saveSupabaseUser(user, isEditing) {
  let authUserId = user.id;

  if (!isEditing) {
    if (!supabaseSignupClient) {
      window.alert("Supabase no está disponible para crear accesos.");
      return null;
    }

    const { data, error } = await supabaseSignupClient.auth.signUp({
      email: user.user,
      password: user.password,
      options: {
        data: {
          full_name: user.name,
          position: user.position,
          role: user.role || "seller",
        },
      },
    });

    if (error || !data.user) {
      window.alert(`No pude crear el acceso en Supabase: ${error ? error.message : "sin usuario devuelto"}`);
      return null;
    }

    authUserId = data.user.id;
  }

  const payload = {
    id: authUserId,
    organization_id: XOLTEC_ORGANIZATION_ID,
    username: user.user,
    full_name: user.name,
    position: user.position,
    role: user.role || "seller",
    signature_url: user.signature || null,
  };

  const query = isEditing
    ? supabaseClient
        .from("profiles")
        .update(payload)
        .eq("id", authUserId)
        .select("id, username, full_name, position, role, signature_url")
        .single()
    : supabaseClient
        .from("profiles")
        .upsert(payload, { onConflict: "id" })
        .select("id, username, full_name, position, role, signature_url")
        .single();
  const { data, error } = await query;

  if (error) {
    window.alert(`El acceso se creó, pero no pude guardar el perfil del CRM: ${error.message}`);
    return null;
  }

  return data;
}

function renderUsers() {
  const list = document.querySelector("#user-list");
  if (!list) return;

  const users = filteredUsers();
  document.querySelector("#user-count").textContent = String(users.length);
  list.innerHTML =
    users
      .map(
        (user) => `
          <article class="product-card">
            <strong>${escapeHtml(user.name)}</strong>
            <div class="deal-meta">
              <span>${escapeHtml(user.user)}</span>
              <span>${escapeHtml(user.position || user.role)}</span>
              <span>${userRoleLabel(user.role, user.superAdmin)}</span>
            </div>
            <div class="quote-card-actions">
              <button class="ghost-button" data-edit-user="${user.user}" type="button">Editar</button>
              ${
                isCurrentUser(user)
                  ? ""
                  : `<button class="danger-button" data-delete-user="${user.user}" type="button">Eliminar</button>`
              }
            </div>
          </article>
        `,
      )
      .join("") || emptyState("Aún no hay usuarios");

  document.querySelectorAll("[data-edit-user]").forEach((button) => {
    button.addEventListener("click", () => editUser(button.dataset.editUser));
  });
  document.querySelectorAll("[data-delete-user]").forEach((button) => {
    button.addEventListener("click", () => deleteUser(button.dataset.deleteUser));
  });
}

function editUser(userName) {
  const user = state.users.find((item) => item.user === userName);
  if (!user) return;

  editingUserName = user.user;
  document.querySelector("#new-user-login").value = user.user;
  document.querySelector("#new-user-password").value = "";
  document.querySelector("#new-user-password").required = false;
  document.querySelector("#new-user-name").value = user.name;
  document.querySelector("#new-user-position").value = user.position || user.role || "";
  document.querySelector("#new-user-role").value = user.role || (user.superAdmin ? "super_admin" : "seller");
  loadSignatureToPad(user.signature || "");
  updateUserFormMode();
  document.querySelector("#user-form").scrollIntoView({ behavior: "smooth", block: "start" });
}

function resetUserForm() {
  editingUserName = null;
  document.querySelector("#user-form").reset();
  document.querySelector("#new-user-password").required = true;
  document.querySelector("#new-user-role").value = "seller";
  clearSignaturePad();
  updateUserFormMode();
}

function updateUserFormMode() {
  const isEditing = Boolean(editingUserName);
  document.querySelector("#user-form-title").textContent = isEditing ? "Editar usuario" : "Nuevo usuario";
  document.querySelector("#user-form-mode").textContent = isEditing ? "Modificando" : "Agregar usuario";
  document.querySelector("#user-save-button").textContent = isEditing ? "Guardar cambios" : "Agregar usuario";
  document.querySelector("#user-cancel-edit").classList.toggle("hidden", !isEditing);
}

async function deleteUser(userName) {
  const user = state.users.find((item) => item.user === userName);
  if (!user || isCurrentUser(user)) return;

  const confirmed = window.confirm(`¿Eliminar el usuario ${user.user}?`);
  if (!confirmed) return;

  if (isSupabaseSession() && user.id) {
    const { error } = await supabaseClient.from("profiles").delete().eq("id", user.id);
    if (error) {
      window.alert(`No pude eliminar el perfil del CRM: ${error.message}`);
      return;
    }
  }

  state.users = state.users.filter((item) => item.user !== userName);
  if (editingUserName === userName) {
    resetUserForm();
  }
  saveState();
  renderUsers();
}

function userRoleLabel(role, superAdmin = false) {
  if (role === "super_admin" || superAdmin) return "Super admin";
  if (role === "admin") return "Admin";
  return "Vendedor";
}

function isCurrentUser(user) {
  const currentUser = getCurrentUser();
  return Boolean(
    user &&
      currentUser &&
      ((user.id && currentUser.id && user.id === currentUser.id) || user.user === currentUser.user),
  );
}

function setupSignaturePad() {
  const canvas = document.querySelector("#signature-pad");
  const context = canvas.getContext("2d");
  let drawing = false;

  context.lineWidth = 2.4;
  context.lineCap = "round";
  context.strokeStyle = "#17202b";

  const point = (event) => {
    const rect = canvas.getBoundingClientRect();
    const source = (event.touches && event.touches[0]) || event;
    return {
      x: ((source.clientX - rect.left) / rect.width) * canvas.width,
      y: ((source.clientY - rect.top) / rect.height) * canvas.height,
    };
  };

  const start = (event) => {
    event.preventDefault();
    drawing = true;
    const { x, y } = point(event);
    context.beginPath();
    context.moveTo(x, y);
  };

  const move = (event) => {
    if (!drawing) return;
    event.preventDefault();
    const { x, y } = point(event);
    context.lineTo(x, y);
    context.stroke();
    signatureDataUrl = canvas.toDataURL("image/png");
  };

  const stop = () => {
    drawing = false;
    signatureDataUrl = canvas.toDataURL("image/png");
  };

  canvas.addEventListener("mousedown", start);
  canvas.addEventListener("mousemove", move);
  window.addEventListener("mouseup", stop);
  canvas.addEventListener("touchstart", start);
  canvas.addEventListener("touchmove", move);
  window.addEventListener("touchend", stop);
}

function clearSignaturePad() {
  const canvas = document.querySelector("#signature-pad");
  const context = canvas.getContext("2d");
  context.clearRect(0, 0, canvas.width, canvas.height);
  signatureDataUrl = "";
  document.querySelector("#signature-upload").value = "";
}

function readSignaturePad() {
  const canvas = document.querySelector("#signature-pad");
  const context = canvas.getContext("2d");
  const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
  const hasInk = pixels.some((value, index) => index % 4 === 3 && value !== 0);
  return hasInk ? canvas.toDataURL("image/png") : "";
}

function importSignature(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => loadSignatureToPad(String(reader.result || ""));
  reader.readAsDataURL(file);
}

function loadSignatureToPad(dataUrl) {
  clearSignaturePad();
  if (!dataUrl) return;
  const canvas = document.querySelector("#signature-pad");
  const context = canvas.getContext("2d");
  const image = new Image();
  image.onload = () => {
    const scale = Math.min(canvas.width / image.width, canvas.height / image.height);
    const width = image.width * scale;
    const height = image.height * scale;
    const x = (canvas.width - width) / 2;
    const y = (canvas.height - height) / 2;
    context.drawImage(image, x, y, width, height);
    signatureDataUrl = dataUrl;
  };
  image.src = dataUrl;
}

async function deleteProduct(productId) {
  const product = state.products.find((item) => item.id === productId);
  if (!product) return;

  if (!isSupabaseSession()) {
    const password = window.prompt("Contraseña de administrador para eliminar productos:");
    if (!isAdminPassword(password)) {
      window.alert("Contraseña incorrecta.");
      return;
    }
  }

  const confirmed = window.confirm(`¿Eliminar el producto "${product.name}"?`);
  if (!confirmed) return;

  if (isSupabaseSession()) {
    const { error } = await supabaseClient.from("products").update({ active: false }).eq("id", productId);
    if (error) {
      window.alert(`No pude eliminar el producto en Supabase: ${error.message}`);
      return;
    }
  }

  state.products = state.products.filter((item) => item.id !== productId);
  if (editingProductId === productId) {
    resetProductForm();
  }
  saveState();
  renderProductsCatalog();
  renderQuoteProducts();
}

function isSupabaseSession() {
  return Boolean(supabaseClient) && sessionStorage.getItem("ventas-crm-auth-provider") === "supabase";
}

function isUuid(value) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    String(value || ""),
  );
}

function isAdminPassword(password) {
  return state.users.some((user) => user.superAdmin && user.password === password);
}

function getCurrentUser() {
  try {
    const sessionUser = JSON.parse(sessionStorage.getItem("ventas-crm-current-user"));
    if (!sessionUser) return state.users[0];
    return state.users.find((user) => user.user === sessionUser.user) || state.users[0];
  } catch {
    return state.users[0];
  }
}

function syncInstallAddress() {
  if (!document.querySelector("#same-install-address").checked) return;
  ["street", "neighborhood", "city", "state", "zip"].forEach((field) => {
    document.querySelector(`#quote-install-${field}`).value = document.querySelector(
      `#quote-fiscal-${field}`,
    ).value;
  });
}

function readAddress(type) {
  return {
    street: document.querySelector(`#quote-${type}-street`).value.trim(),
    neighborhood: document.querySelector(`#quote-${type}-neighborhood`).value.trim(),
    city: document.querySelector(`#quote-${type}-city`).value.trim(),
    state: document.querySelector(`#quote-${type}-state`).value.trim(),
    zip: document.querySelector(`#quote-${type}-zip`).value.trim(),
  };
}

function fillAddress(type, address = {}) {
  ["street", "neighborhood", "city", "state", "zip"].forEach((field) => {
    document.querySelector(`#quote-${type}-${field}`).value = (address && address[field]) || "";
  });
}

function addressesMatch(first = {}, second = {}) {
  return ["street", "neighborhood", "city", "state", "zip"].every(
    (field) => ((first && first[field]) || "") === ((second && second[field]) || ""),
  );
}

function closeDealModal() {
  document.querySelector("#deal-modal").close();
}

function filteredDeals() {
  const query = searchQuery();
  if (!query) return state.deals;
  return state.deals.filter((deal) =>
    matchesSearch([deal.account, deal.contact, deal.name, deal.stage, deal.next].join(" "), query),
  );
}

function filteredTasks() {
  const query = searchQuery();
  if (!query) return state.tasks;
  return state.tasks.filter((task) =>
    matchesSearch([task.title, task.account].join(" "), query),
  );
}

function filteredQuoteClients() {
  const query = searchQuery();
  if (!query) return state.quoteClients;
  return state.quoteClients.filter((client) => matchesSearch(quoteSearchText(client), query));
}

function filteredProducts() {
  const query = searchQuery();
  if (!query) return state.products;
  return state.products.filter((product) =>
    matchesSearch([product.name, product.workArea, product.price, product.defaultQuantity].join(" "), query),
  );
}

function filteredUsers() {
  return state.users;
}

function searchQuery() {
  return normalizeSearchText(document.querySelector("#search-input").value);
}

function matchesSearch(searchableText, query) {
  const haystack = normalizeSearchText(searchableText);
  const terms = query.split(" ").filter(Boolean);
  return terms.every((term) => haystack.includes(term));
}

function normalizeSearchText(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function quoteSearchText(client) {
  const fiscalAddress = formatAddress(client.fiscalAddress, client.address);
  const installationAddress = formatAddress(client.installationAddress);
  const productText = (client.products || [])
    .map((product) => [product.name, product.workArea, product.quantity, product.price, product.total].join(" "))
    .join(" ");
  const preparedBy = state.users.find((user) => user.user === client.preparedByUser);
  return [
    client.company,
    client.taxId,
    client.contact,
    client.email,
    client.phone,
    client.referredBy,
    client.notes,
    fiscalAddress,
    installationAddress,
    productText,
    client.discountPercent,
    client.commissionPercent,
    client.commissionAppliedPercent,
    client.commissionFor,
    client.advancePercent,
    quoteTypeLabel(client.quoteType),
    client.totals && client.totals.subtotal,
    client.totals && client.totals.discountAmount,
    client.totals && client.totals.iva,
    client.totals && client.totals.total,
    client.createdAt ? formatDate(client.createdAt.slice(0, 10)) : "",
    client.preparedByUser,
    preparedBy && preparedBy.name,
    preparedBy && preparedBy.position,
  ].join(" ");
}

function dealCard(deal) {
  return `
    <article class="deal-card">
      <strong>${escapeHtml(deal.name)}</strong>
      <p>${escapeHtml(deal.account)} · ${escapeHtml(deal.contact)}</p>
      <div class="deal-meta">
        <span class="pill">${money.format(deal.value)}</span>
        <span>${escapeHtml(deal.next)}</span>
      </div>
    </article>
  `;
}

function taskItem(task) {
  return `
    <article class="task-item ${task.done ? "done" : ""}">
      <div class="task-title">
        <input data-task-id="${task.id}" type="checkbox" ${task.done ? "checked" : ""} aria-label="Completar tarea" />
        <div>
          <strong>${escapeHtml(task.title)}</strong>
          <div class="task-meta">
            <span>${escapeHtml(task.account)}</span>
            <span>${formatDate(task.date)}</span>
          </div>
        </div>
      </div>
    </article>
  `;
}

function quoteClientCard(client) {
  const products = client.products || [];
  const fiscalAddress = formatAddress(client.fiscalAddress, client.address);
  const installationAddress = formatAddress(client.installationAddress);
  const total = (client.totals && client.totals.total) || 0;
  const whatsappUrl = quoteWhatsAppUrl(client);
  const emailUrl = quoteEmailUrl(client);
  return `
    <article class="quote-client-card">
      <div class="quote-card-header">
        <strong>${escapeHtml(client.company || client.contact)}</strong>
        <span>${money.format(total)}</span>
      </div>
      <div class="quote-card-details">
        ${quoteDetailRow("Empresa", client.company || "Opcional")}
        ${quoteDetailRow("Contacto", client.contact)}
        ${quoteDetailRow("Teléfono", client.phone)}
        ${quoteDetailRow("Correo", client.email)}
        ${quoteDetailRow("RFC", client.taxId || "Pendiente")}
        ${quoteDetailRow("Tipo", quoteTypeLabel(client.quoteType))}
        ${quoteDetailRow("Referido por", client.referredBy || "Sin referido")}
        ${quoteDetailRow("Fecha", formatDate(client.createdAt.slice(0, 10)))}
        ${quoteDetailRow("Domicilio fiscal", fiscalAddress)}
        ${quoteDetailRow("Instalación", installationAddress || fiscalAddress)}
        ${client.notes ? quoteDetailRow("Observaciones:", client.notes) : ""}
      </div>
      <div class="quote-card-products">
        ${products.map((product) => `<span>${escapeHtml(product.name)} x ${escapeHtml(formatProductQuantity(product))}</span>`).join("")}
      </div>
      <div class="quote-card-total">
        <span>Descuento ${client.discountPercent || 0}%</span>
        <strong>${money.format(total)}</strong>
      </div>
      <div class="quote-internal-note">
        Comisión total ${client.commissionPercent || 0}%:
        cliente absorbe ${client.commissionAppliedPercent || 0}% (${money.format(client.commissionAmount || 0)}),
        empresa absorbe ${client.commissionAppliedPercent || 0}% (${money.format(client.companyCommissionAmount || client.commissionAmount || 0)})
        ${client.commissionFor ? `para ${escapeHtml(client.commissionFor)}` : ""}
      </div>
      <div class="quote-card-actions">
        <button class="primary-button app-action-button" data-pdf-quote="${client.id}" type="button">${appIcon("pdf")}Generar PDF</button>
        <a class="whatsapp-button app-action-button" href="${escapeHtml(whatsappUrl)}" target="_blank" rel="noopener">${appIcon("whatsapp")}Mandar WhatsApp</a>
        ${
          emailUrl
            ? `<a class="email-button app-action-button" href="${escapeHtml(emailUrl)}">${appIcon("mail")}Mandar correo</a>`
            : `<button class="email-button app-action-button" data-email-quote="${client.id}" type="button">${appIcon("mail")}Mandar correo</button>`
        }
        <button class="ghost-button" data-edit-quote="${client.id}" type="button">Editar</button>
        <button class="danger-button" data-delete-quote="${client.id}" type="button">Eliminar</button>
      </div>
    </article>
  `;
}

function quoteListItem(client) {
  const total = (client.totals && client.totals.total) || 0;
  const whatsappUrl = quoteWhatsAppUrl(client);
  const emailUrl = quoteEmailUrl(client);
  return `
    <article class="quote-list-item">
      <div class="quote-list-main">
        <strong>${escapeHtml(client.company || client.contact)}</strong>
        <span>${quoteTypeLabel(client.quoteType)} · ${formatDate(client.createdAt.slice(0, 10))}</span>
      </div>
      <div class="quote-list-total">${money.format(total)}</div>
      <div class="quote-list-actions">
        <button class="primary-button app-action-button icon-only-action" data-pdf-quote="${client.id}" type="button" title="Generar PDF" aria-label="Generar PDF">${appIcon("pdf")}</button>
        <a class="whatsapp-button app-action-button icon-only-action" href="${escapeHtml(whatsappUrl)}" target="_blank" rel="noopener" title="Mandar WhatsApp" aria-label="Mandar WhatsApp">${appIcon("whatsapp")}</a>
        ${
          emailUrl
            ? `<a class="email-button app-action-button icon-only-action" href="${escapeHtml(emailUrl)}" title="Mandar correo" aria-label="Mandar correo">${appIcon("mail")}</a>`
            : `<button class="email-button app-action-button icon-only-action" data-email-quote="${client.id}" type="button" title="Mandar correo" aria-label="Mandar correo">${appIcon("mail")}</button>`
        }
        <button class="ghost-button" data-edit-quote="${client.id}" type="button">Editar</button>
        <button class="danger-button" data-delete-quote="${client.id}" type="button">Eliminar</button>
      </div>
    </article>
  `;
}

function quoteDetailRow(label, value) {
  return `
    <div class="quote-detail-row">
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(value || "-")}</strong>
    </div>
  `;
}

function quoteWhatsAppUrl(quote) {
  const phone = normalizePhoneForWhatsApp(quote.phone);
  const message = `${quoteShareMessage(quote, "whatsapp")}\n\nTe comparto la cotización en PDF por separado.`;
  return phone
    ? `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(message)}`
    : `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
}

function quoteEmailUrl(quote) {
  if (!quote.email) return "";
  const subject = `Cotización XOLTEC - ${quote.company || quote.contact}`;
  const body = `${quoteShareMessage(quote, "email")}\n\nTe comparto la cotización en PDF por separado.`;
  return `mailto:${quote.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function shareQuoteByWhatsApp(quoteId) {
  const quote = state.quoteClients.find((item) => item.id === quoteId);
  if (!quote) return;
  window.location.href = quoteWhatsAppUrl(quote);
}

function shareQuoteByEmail(quoteId) {
  const quote = state.quoteClients.find((item) => item.id === quoteId);
  if (!quote) return;
  if (!quote.email) {
    window.alert("Esta cotización no tiene correo capturado. Agrégalo para poder preparar el envío.");
    return;
  }
  const emailUrl = quoteEmailUrl(quote);
  window.location.href = emailUrl;
}

function quoteShareMessage(quote, channel) {
  const products = (quote.products || [])
    .map((product) => `- ${product.name} x ${formatProductQuantity(product)}`)
    .join("\n");
  const intro = channel === "email" ? "Hola," : `Hola ${quote.contact || ""},`.trim();
  return [
    intro,
    "",
    "Te compartimos tu cotización de XOLTEC Soluciones Solares.",
    "",
    `Cliente: ${quote.company || quote.contact}`,
    `Total: ${money.format((quote.totals && quote.totals.total) || 0)}`,
    products ? `Productos:\n${products}` : "",
    "",
    "La cotización tiene una vigencia de 8 días naturales a partir de la fecha de expedición.",
    "",
    "Para cualquier duda puedes responder este mensaje.",
    "",
    "XOLTEC",
    "722 518 5448",
    "hola@xoltec.mx",
    "xoltec.mx",
  ]
    .filter(Boolean)
    .join("\n");
}

function normalizePhoneForWhatsApp(phone) {
  const digits = String(phone || "").replace(/\D/g, "");
  if (!digits) return "";
  if (digits.length === 10) return `52${digits}`;
  return digits;
}

function isLikelyIOS() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
}

function appIcon(type) {
  const icons = {
    pdf: `<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M6 2h8l4 4v16H6z"/><path d="M14 2v5h5"/><path d="M8 15h8M8 18h5"/></svg>`,
    whatsapp: `<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M7.2 20.3 3 21l.8-4A8.8 8.8 0 1 1 7.2 20.3z"/><path d="M8.8 8.4c.2-.5.4-.5.7-.5h.6c.2 0 .4.1.5.4l.8 1.9c.1.3 0 .5-.2.7l-.5.6c.8 1.4 1.9 2.4 3.4 3.1l.6-.7c.2-.2.5-.3.8-.2l1.8.9c.3.1.4.3.4.6 0 .8-.6 1.7-1.5 1.8-2.5.3-7.6-2.7-8.4-6.8-.2-.8.5-1.5 1-1.8z"/></svg>`,
    mail: `<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M4 6h16v12H4z"/><path d="m4 7 8 6 8-6"/></svg>`,
  };
  return `<span class="button-icon">${icons[type] || ""}</span>`;
}

function quoteCommercialTerms(type, total, advancePercent, balancePercent) {
  if (type === "maintenance") {
    const firstPayment = total * (advancePercent / 100);
    const balancePayment = total - firstPayment;
    return `
      <div class="terms-card maintenance-terms">
        <div class="terms-summary">
          <span>COSTO TOTAL DE LOS TRABAJOS</span>
          <strong>${money.format(total)}</strong>
        </div>
        <div class="payment-grid">
          <div><span>Anticipo solicitado</span><strong>${advancePercent}% · ${money.format(firstPayment)}</strong></div>
          <div><span>Saldo contra avance/finalización</span><strong>${balancePercent}% · ${money.format(balancePayment)}</strong></div>
        </div>
        <div class="notes">
          <p>Todas las actividades descritas se realizarán por niveles, de tal manera que la totalidad de la instalación eléctrica quedará revisada y, de ser el caso, se procederá a realizar las correcciones pertinentes.</p>
          <p>Como se comentó en la entrevista previa, nosotros no manejamos la compra del material requerido para los trabajos; sin embargo, podemos sugerir lugares donde se cuente con el material y quizá el mejor precio del mercado.</p>
          <p>El costo total por los trabajos señalados asciende a la cantidad de <strong>${money.format(total)}</strong>. El anticipo requerido será de <strong>${advancePercent}%</strong> al inicio de los trabajos y el <strong>${balancePercent}%</strong> restante se cubrirá conforme al avance acordado y/o al finalizar el trabajo.</p>
          <p>Cualquier trabajo que se requiera de manera adicional podrá realizarse, siempre y cuando sea consensuado por las partes involucradas y con autorización expresa.</p>
          <p>Es importante mencionar que la solicitud de materiales se hará con 72 horas de anticipación al suministro del mismo, para que el usuario tenga el tiempo suficiente para realizar la compra.</p>
          <p>Bajo ninguna circunstancia los técnicos asignados podrán retirar de las instalaciones del usuario ningún material. Los encargados de realizar compras, cambios o devoluciones en todo momento son los administradores del edificio.</p>
        </div>
      </div>
    `;
  }

  return `
    <div class="notes">
      <p><strong>NOTA UNO:</strong> SE REQUIERE ${advancePercent}% DE ANTICIPO A LA FIRMA DEL PRESENTE DOCUMENTO, ${balancePercent}% AL MOMENTO DE LA INSTALACION,</p>
      <p><strong>NOTA DOS:</strong> GARANTÍA EN PANELES Y EQUIPOS DE 20 AÑOS</p>
      <p><strong>NOTA TRES:</strong> EN LA PRESENTE COTIZACIÓN NO SE INCLUYE EL COSTO DE OBRA CIVIL, EN CASO DE QUE EL PROYECTO LA REQUIERA,</p>
      <p><strong>NOTA CUATRO:</strong> EL TRAMITE DE INTERCONEXION ESTA SUJETO A LOS TIEMPOS DE LA COMISION FEDERAL DE ELECTRICIDAD Y DEMAS DEPENDENCIAS INVOLUCRADAS</p>
      <p><strong>NOTA:</strong> ESTE PRESUPUESTO ESTA SUJETO A CAMBIOS DE ACUERDO AL TIPO DE CAMBIO VIGENTE, SIN EMBARGO, TIENE UNA VIGENCIA DE 8 DIAS HABILES</p>
      <p><strong>NOTA:</strong> APLICA UN DESCUENTO ESPECIAL DEL 8% EN EL COSTO, O BIEN SE PUEDE CANJEAR POR DOS PANELES MAS</p>
    </div>
  `;
}

function generateQuotePdf(quoteId) {
  const quote = state.quoteClients.find((item) => item.id === quoteId);
  if (!quote) return;
  const currentUser = getCurrentUser();
  const preparedBy = state.users.find((user) => user.user === quote.preparedByUser) || currentUser;

  const fiscalAddress = formatAddress(quote.fiscalAddress, quote.address);
  const installationAddress = formatAddress(quote.installationAddress) || fiscalAddress;
  const subtotal = (quote.totals && quote.totals.subtotal) || 0;
  const discountAmount = (quote.totals && quote.totals.discountAmount) || 0;
  const iva = (quote.totals && quote.totals.iva) || 0;
  const total = (quote.totals && quote.totals.total) || 0;
  const advancePercent = quote.advancePercent || 70;
  const balancePercent = Math.max(100 - advancePercent, 0);
  const quoteType = quote.quoteType || "solar";
  const quoteIntro = quoteType === "maintenance"
    ? "Ponemos a su consideración nuestro presupuesto de mantenimiento y obra civil:"
    : "Ponemos a su consideración nuestro presupuesto de paneles solares:";
  const commercialTerms = quoteCommercialTerms(quoteType, total, advancePercent, balancePercent);
  const quoteDate = quote.createdAt ? new Date(quote.createdAt) : new Date();
  const userSignature = preparedBy.signature
    ? `<img class="signature-image" src="${preparedBy.signature}" alt="Firma de ${escapeHtml(preparedBy.name)}" />`
    : "";
  const rows = (quote.products || [])
    .map(
      (product) => `
        <tr>
          <td>${escapeHtml(product.name)}</td>
          ${quoteType === "maintenance" ? `<td>${escapeHtml(product.workArea || "Sin especificar")}</td>` : ""}
          <td>${escapeHtml(formatProductQuantity(product))}</td>
          <td>${money.format(product.price)}</td>
          <td>${money.format(product.lineTotal)}</td>
        </tr>
      `,
    )
    .join("");
  const footer = quotePdfFooter();
  const logoUrl = new URL("assets/xoltec-logo.png", window.location.href).href;

  const printable = window.open("", "_blank");
  if (!printable) {
    window.alert("El navegador bloqueó la ventana del PDF. Permite ventanas emergentes para generarlo.");
    return;
  }

  printable.document.write(`
    <!doctype html>
    <html lang="es">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="format-detection" content="telephone=no, email=no, address=no" />
        <title>Cotización XOLTEC</title>
        <style>
          @page { size: letter portrait; margin: 0; }
          * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; color-adjust: exact; }
          body { margin: 0; color: #17202b; font-family: Arial, sans-serif; background: #ffffff; }
          .page { width: 8.5in; min-height: 11in; padding: 0.36in 0.5in 0.78in; position: relative; overflow: hidden; }
          .watermark { position: absolute; left: 1.35in; right: 1.35in; top: 4.15in; height: 3.4in; background: url("${logoUrl}") center / contain no-repeat; opacity: 0.16; z-index: 0; pointer-events: none; }
          .watermark.soft { top: 3.05in; opacity: 0.12; }
          .content { position: relative; z-index: 1; }
          .hero { display: flex; justify-content: space-between; align-items: center; background: #203a49; border-radius: 16px; padding: 18px 26px; color: white; }
          .hero img { width: 174px; height: auto; }
          .hero strong { display: block; font-size: 18px; margin-bottom: 4px; }
          .hero span { color: #eba83a; font-weight: 700; }
          .date { margin: 16px 0 26px; text-align: right; font-size: 13px; }
          h1 { font-size: 19px; margin: 0 0 12px; color: #111827; }
          .present { display: inline-flex; align-items: center; gap: 13px; margin: 0 0 20px; color: #111827; font-size: 14px; font-weight: 800; letter-spacing: 6px; }
          .present::before, .present::after { content: ""; width: 34px; height: 1px; background: #c7ccd4; }
          .client-card { background: rgba(255,255,255,0.72); border: 1px solid #d7dde5; border-radius: 10px; margin-top: 16px; margin-bottom: 30px; padding: 15px 18px; line-height: 1.58; font-size: 12px; box-shadow: none; }
          .intro { margin: 18px 0 0; font-size: 13px; }
          table { width: 100%; border-collapse: collapse; margin-top: 0; background: transparent; border: 1px solid #6b7280; border-radius: 0; overflow: visible; }
          th { background-color: #bfbfbf !important; color: #111827; font-size: 11px; letter-spacing: 0.3px; padding: 8px; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          td { border: 1px solid rgba(31,41,55,0.58); background: transparent; padding: 8px; font-size: 11.5px; }
          td:nth-child(3), td:nth-child(4) { text-align: center; white-space: nowrap; }
          td:nth-child(5) { text-align: right; white-space: nowrap; }
          body.solar td:nth-child(2), body.solar td:nth-child(3) { text-align: center; white-space: nowrap; }
          body.solar td:nth-child(4) { text-align: right; white-space: nowrap; }
          .totals { width: 38%; margin-left: auto; margin-top: 16px; background: transparent; border: 0; border-radius: 0; padding: 6px 13px; box-shadow: none; }
          .totals div { display: flex; justify-content: space-between; font-weight: 700; padding: 4px 0; font-size: 12px; }
          .totals div:last-child { border-top: 1px solid #d7dde5; margin-top: 4px; padding-top: 8px; color: #0f766e; font-size: 14px; }
          .footer { position: absolute; left: 0.5in; right: 0.5in; bottom: 0.24in; color: #5f6672; font-size: 10px; border-top: 1px solid #d7dde5; padding-top: 9px; }
          .footer-grid { display: grid; grid-template-columns: 1fr 1.15fr 0.85fr 2.15fr; gap: 11px; align-items: start; }
          .footer-item { display: flex; gap: 6px; align-items: flex-start; }
          .footer-text { color: #5f6672; text-decoration: none; line-height: 1.25; }
          .footer-icon { width: 18px; height: 18px; min-width: 18px; border-radius: 999px; display: inline-grid; place-items: center; background: #203a49; color: #eba83a; font-size: 11px; font-weight: 700; }
          .footer-icon svg { width: 11px; height: 11px; fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
          .footer-address { color: #6b7280; display: block; margin-top: 2px; padding-left: 24px; font-size: 9.2px; line-height: 1.25; }
          .footer a, .footer a:visited { color: #5f6672 !important; text-decoration: none !important; }
          .page-break { page-break-before: always; }
          .section-title { display: flex; align-items: center; gap: 10px; margin: 0 0 15px; }
          .section-title::before { content: ""; width: 34px; height: 4px; border-radius: 99px; background: #eba83a; }
          .faq { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 16px; }
          .faq article { border: 1px solid #d7dde5; border-left: 4px solid #eba83a; background: rgba(248,250,252,0.95); padding: 10px; border-radius: 9px; font-size: 11.5px; line-height: 1.35; }
          .faq strong { display: block; margin-bottom: 4px; color: #17202b; }
          .annex-hero { background: #203a49; color: #ffffff; border-radius: 16px; padding: 20px 22px; display: flex; justify-content: space-between; gap: 16px; align-items: center; margin-bottom: 18px; }
          .annex-hero img { width: 138px; height: auto; }
          .annex-hero strong { display: block; color: #eba83a; font-size: 12px; letter-spacing: 1.4px; margin-bottom: 5px; }
          .annex-hero h1 { color: #ffffff; margin: 0; font-size: 21px; }
          .annex-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 18px; align-items: stretch; }
          .annex-card { border: 1px solid #d7dde5; border-radius: 12px; background: rgba(255,255,255,0.76); padding: 16px; box-shadow: none; min-height: 96px; overflow: hidden; }
          .annex-card strong { display: block; color: #17202b; font-size: 13px; margin-bottom: 6px; }
          .annex-card p, .annex-card li { color: #4b5563; font-size: 11.5px; line-height: 1.42; margin: 0; }
          .annex-card ul { margin: 0; padding-left: 16px; display: grid; gap: 5px; }
          .annex-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-top: 18px; }
          .annex-stat { background: rgba(255,248,232,0.78); border: 1px solid #f0d7a0; border-radius: 12px; padding: 12px 8px; text-align: center; }
          .annex-stat strong { display: block; color: #203a49; font-size: 18px; margin-bottom: 3px; }
          .annex-stat span { color: #7a520f; font-size: 10.5px; font-weight: 700; line-height: 1.25; }
          .process-list { display: grid; gap: 10px; margin-top: 14px; }
          .process-step { display: grid; grid-template-columns: 28px 1fr; gap: 9px; align-items: start; border: 1px solid #d7dde5; border-radius: 10px; padding: 10px; background: rgba(255,255,255,0.76); }
          .process-step b { display: grid; place-items: center; width: 28px; height: 28px; border-radius: 999px; background: #203a49; color: #eba83a; font-size: 12px; }
          .process-step strong { display: block; font-size: 12.5px; margin-bottom: 2px; }
          .process-step span { color: #4b5563; font-size: 11px; line-height: 1.35; }
          .terms-card { margin-top: 18px; border: 1px solid #d7dde5; border-radius: 14px; background: rgba(255,255,255,0.82); overflow: hidden; }
          .terms-summary { display: flex; justify-content: space-between; gap: 14px; align-items: center; background: #203a49; color: #ffffff; padding: 12px 14px; }
          .terms-summary span { color: rgba(255,255,255,0.82); font-size: 9.5px; font-weight: 900; letter-spacing: 1.1px; }
          .terms-summary strong { color: #eba83a; font-size: 17px; }
          .payment-grid { display: grid; grid-template-columns: 1fr 1fr; border-bottom: 1px solid #e5e7eb; }
          .payment-grid div { padding: 10px 12px; border-right: 1px solid #e5e7eb; }
          .payment-grid div:last-child { border-right: 0; }
          .payment-grid span { display: block; color: #6b7280; font-size: 9px; font-weight: 900; letter-spacing: 0.5px; text-transform: uppercase; margin-bottom: 4px; }
          .payment-grid strong { color: #17202b; font-size: 12px; }
          .notes { display: grid; gap: 7px; margin-top: 18px; line-height: 1.3; font-size: 11px; }
          .terms-card .notes { margin-top: 0; padding: 12px; }
          .notes p { margin: 0; padding: 8px 10px; border-radius: 8px; background: rgba(255,255,255,0.74); border: 1px solid #e5e7eb; }
          .maintenance-terms .notes p { background: #f8fafc; border-left: 3px solid #eba83a; }
          .prepared { display: grid; gap: 5px; margin-top: 18px; font-size: 11.5px; line-height: 1.4; background: rgba(32,58,73,0.92); color: #ffffff; border-radius: 12px; padding: 15px 16px; box-shadow: none; }
          .prepared strong { color: #eba83a; }
          .signature { display: grid; grid-template-columns: 1fr 1fr; gap: 44px; margin-top: 24px; font-size: 12px; }
          .signature-box { min-height: 108px; border: 1px solid #d7dde5; border-radius: 12px; background: rgba(255,255,255,0.74); padding: 12px 14px 14px; display: grid; align-content: end; justify-items: center; box-shadow: none; }
          .signature-line { width: fit-content; border-top: 1.5px solid #17202b; padding: 7px 18px 0; color: #5f6672; font-weight: 700; text-align: center; }
          .signature-line.date-line { min-width: 150px; }
          .signature-line.sign-line { min-width: 175px; }
          .signature-value { align-self: center; justify-self: center; margin-bottom: 10px; color: #17202b; font-weight: 800; }
          .signature-image { max-width: 210px; max-height: 54px; align-self: center; justify-self: center; margin-bottom: 5px; }
          .validity { margin-top: 24px; border: 1px solid #eba83a; background: rgba(255,248,232,0.78); color: #7a520f; border-radius: 12px; padding: 12px 14px; font-size: 11.5px; font-weight: 800; text-align: center; letter-spacing: 0.2px; }
          .bank-card { margin-top: 14px; border: 1px solid #cfd7e2; border-radius: 14px; overflow: hidden; background: rgba(255,255,255,0.86); box-shadow: none; }
          .bank-card-header { display: flex; justify-content: space-between; gap: 14px; align-items: center; background: #203a49; color: #ffffff; padding: 11px 14px; }
          .bank-card-header strong { color: #eba83a; font-size: 11px; letter-spacing: 1.2px; }
          .bank-card-header span { font-size: 10.5px; color: rgba(255,255,255,0.82); text-align: right; }
          .bank-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0; border-bottom: 1px solid #e5e7eb; }
          .bank-item { display: grid; gap: 3px; padding: 9px 12px; border-right: 1px solid #e5e7eb; border-top: 1px solid #eef2f7; }
          .bank-item:nth-child(2n) { border-right: 0; }
          .bank-item span { color: #6b7280; font-size: 8.8px; font-weight: 800; letter-spacing: 0.55px; text-transform: uppercase; }
          .bank-item strong { color: #17202b; font-size: 11px; line-height: 1.25; }
          .invoice-note { margin: 0; padding: 10px 12px; color: #4b5563; font-size: 10px; line-height: 1.35; background: #f8fafc; }
          .solar-map-hero { display: grid; grid-template-columns: 1fr auto; gap: 18px; align-items: end; border-bottom: 1px solid #d7dde5; padding-bottom: 14px; margin-bottom: 18px; }
          .solar-map-hero img { width: 124px; height: auto; }
          .solar-map-kicker { width: fit-content; display: inline-flex; align-items: center; gap: 8px; border-radius: 999px; background: rgba(235,168,58,0.16); color: #7a520f; font-size: 10px; font-weight: 900; letter-spacing: 1.2px; padding: 7px 12px; text-transform: uppercase; }
          .solar-map-kicker::before { content: ""; width: 18px; height: 3px; border-radius: 99px; background: #eba83a; }
          .solar-map-hero h1 { color: #203a49; font-size: 27px; line-height: 1.04; margin: 12px 0 8px; max-width: 520px; }
          .solar-map-hero p { color: #5f6672; font-size: 12px; line-height: 1.42; margin: 0; max-width: 560px; }
          .solar-flow { display: grid; grid-template-columns: repeat(3, 1fr); gap: 42px 16px; position: relative; margin-top: 8px; }
          .solar-arrows { position: absolute; inset: 0; width: 100%; height: 100%; z-index: 0; pointer-events: none; }
          .solar-arrows path { fill: none; stroke: #18a058; stroke-width: 2.2; stroke-linecap: round; stroke-linejoin: round; }
          .solar-node { min-height: 112px; border: 1px solid #d7dde5; border-radius: 14px; background: rgba(255,255,255,0.9); padding: 13px; box-shadow: 0 10px 22px rgba(15,23,42,0.06); position: relative; z-index: 1; }
          .solar-node-head { display: grid; grid-template-columns: 34px 1fr; gap: 10px; align-items: center; margin-bottom: 8px; }
          .solar-icon { width: 34px; height: 34px; display: grid; place-items: center; border-radius: 50%; background: #eef6f5; color: #203a49; border: 1px solid #d7dde5; }
          .solar-icon svg { width: 22px; height: 22px; fill: none; stroke: currentColor; stroke-width: 2.1; stroke-linecap: round; stroke-linejoin: round; }
          .solar-icon .cfe-mark { color: #18a058; font-size: 13px; font-weight: 900; letter-spacing: -0.6px; }
          .solar-node h2 { color: #17202b; font-size: 13.5px; margin: 0; line-height: 1.15; }
          .solar-node p { color: #4b5563; font-size: 10.5px; line-height: 1.35; margin: 0; }
          .solar-node.accent .solar-icon { color: #18a058; background: #ecfdf5; border-color: #b7ebcf; }
          .solar-node.gold .solar-icon { color: #b7791f; background: #fff8e8; border-color: #f0d7a0; }
          .solar-stats-title { display: flex; align-items: center; gap: 10px; color: #203a49; font-size: 16px; margin: 18px 0 10px; }
          .solar-stats-title::before { content: ""; width: 32px; height: 4px; border-radius: 99px; background: #18a058; }
          .solar-metrics { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
          .solar-metric { border: 1px solid #d7dde5; border-radius: 13px; background: rgba(255,255,255,0.82); padding: 12px 10px; min-height: 84px; }
          .solar-metric strong { display: block; color: #203a49; font-size: 20px; line-height: 1; margin-bottom: 5px; }
          .solar-metric span { display: block; color: #5f6672; font-size: 9.8px; line-height: 1.25; font-weight: 700; }
          .solar-metric.green strong { color: #18a058; }
          .solar-metric.gold strong { color: #eba83a; }
          .solar-metric.teal strong { color: #2bbeb4; }
          .generation-box { margin-top: 14px; border: 1px solid #d7dde5; border-radius: 14px; background: rgba(255,255,255,0.82); padding: 14px; }
          .generation-box h2 { margin: 0 0 12px; color: #203a49; font-size: 16px; }
          .generation-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
          .generation-item { display: grid; grid-template-columns: 34px 1fr; gap: 10px; align-items: start; border-right: 1px solid #d7dde5; padding-right: 10px; }
          .generation-item:last-child { border-right: 0; }
          .generation-item b { display: grid; place-items: center; width: 34px; height: 34px; border-radius: 50%; background: #eef6f5; color: #18a058; font-size: 18px; }
          .generation-item:nth-child(2) b { color: #0f6f9f; }
          .generation-item:nth-child(3) b { color: #b7791f; background: #fff8e8; }
          .generation-item strong { display: block; color: #17202b; font-size: 11.5px; margin-bottom: 4px; }
          .generation-item span { color: #4b5563; font-size: 10px; line-height: 1.32; }
          @media screen and (max-width: 620px) {
            html, body { width: 100%; min-height: 100%; overflow-x: hidden; }
            body { background: #e8edf2; }
            .page { width: 100%; max-width: 100vw; min-height: 100dvh; padding: 14px 12px 92px; background: #ffffff; box-shadow: 0 10px 24px rgba(15,23,42,0.14); }
            .page + .page { margin-top: 14px; }
            .hero { border-radius: 10px; padding: 13px 14px; }
            .hero img { width: 118px; }
            .hero strong { font-size: 14px; }
            h1 { font-size: 16px; }
            .date { margin: 12px 0 18px; }
            .client-card { margin-bottom: 22px; padding: 12px; }
            table { font-size: 10px; }
            th, td { padding: 6px 4px; font-size: 9.5px; }
            .totals { width: 72%; }
            .payment-grid { grid-template-columns: 1fr; }
            .payment-grid div { border-right: 0; border-bottom: 1px solid #e5e7eb; }
            .payment-grid div:last-child { border-bottom: 0; }
            .annex-grid, .annex-stats { grid-template-columns: 1fr; }
            .solar-map-hero, .solar-flow, .solar-metrics, .generation-grid { grid-template-columns: 1fr; }
            .solar-arrows { display: none; }
            .generation-item { border-right: 0; border-bottom: 1px solid #d7dde5; padding-bottom: 10px; }
            .generation-item:last-child { border-bottom: 0; }
            .bank-grid { grid-template-columns: 1fr; }
            .bank-item { border-right: 0; }
            .signature { grid-template-columns: 1fr; gap: 14px; }
            .footer { left: 12px; right: 12px; bottom: 14px; font-size: 8.2px; padding-top: 7px; }
            .footer-grid { grid-template-columns: 1fr 1fr; gap: 7px 9px; }
            .footer-icon { width: 15px; height: 15px; min-width: 15px; }
            .footer-icon svg { width: 9px; height: 9px; }
            .footer-address { padding-left: 21px; font-size: 7.6px; line-height: 1.2; }
          }
          @media print { button { display: none; } .page { width: 8.5in; } }
        </style>
      </head>
      <body class="${quoteType}">
        <section class="page">
          <div class="watermark"></div>
          <div class="content">
            <div class="hero">
              <div>
                <strong>El sol es constante.</strong>
                <span>Nuestra tecnología también.</span>
              </div>
              <img src="${logoUrl}" alt="XOLTEC" />
            </div>
            <div class="date">${formatLongDate(quoteDate)}</div>
            <h1>${escapeHtml(quote.company || quote.contact)}</h1>
            <div class="present">PRESENTE</div>
            <p class="intro">${quoteIntro}</p>
            <div class="client-card">
              <strong>Contacto:</strong> ${escapeHtml(quote.contact)}<br>
              <strong>Teléfono:</strong> ${escapeHtml(quote.phone)}<br>
              <strong>Correo:</strong> ${escapeHtml(quote.email)}<br>
              <strong>RFC:</strong> ${escapeHtml(quote.taxId)}<br>
              <strong>Domicilio fiscal:</strong> ${escapeHtml(fiscalAddress)}<br>
              <strong>Instalación:</strong> ${escapeHtml(installationAddress)}
            </div>
            <table>
              <thead>
                <tr>
                  <th>DESCRIPCIÓN</th>
                  ${quoteType === "maintenance" ? "<th>ÁREA A TRABAJAR</th>" : ""}
                  <th>CANTIDAD</th>
                  <th>PRECIO UNITARIO</th>
                  <th>TOTALES</th>
                </tr>
              </thead>
              <tbody>${rows}</tbody>
            </table>
            <div class="totals">
              <div><span>SUBTOTAL</span><span>${money.format(subtotal)}</span></div>
              <div><span>DESCUENTO</span><span>${money.format(discountAmount)}</span></div>
              <div><span>IVA</span><span>${money.format(iva)}</span></div>
              <div><span>TOTAL</span><span>${money.format(total)}</span></div>
            </div>
          </div>
          ${footer}
        </section>
        <section class="page page-break">
          <div class="watermark soft"></div>
          <div class="content">
            <h1 class="section-title">Condiciones comerciales</h1>
            <div class="prepared">
              <strong>PRESUPUESTO ELABORADO POR:</strong>
              <span>${escapeHtml(preparedBy.name)}</span>
              <span>${escapeHtml(preparedBy.position || preparedBy.role)}</span>
            </div>
            ${commercialTerms}
            <div class="signature">
              <div class="signature-box">
                <div class="signature-value">${formatLongDate(quoteDate)}</div>
                <div class="signature-line date-line">FECHA</div>
              </div>
              <div class="signature-box">
                ${userSignature}
                <div class="signature-line sign-line">FIRMA</div>
              </div>
            </div>
            <div class="validity">
              ESTE PRESUPUESTO TIENE UNA VIGENCIA DE 8 DÍAS NATURALES A PARTIR DE LA FECHA DE EXPEDICIÓN.
            </div>
            <div class="bank-card">
              <div class="bank-card-header">
                <strong>DATOS BANCARIOS</strong>
                <span>Información para transferencia y facturación</span>
              </div>
              <div class="bank-grid">
                <div class="bank-item"><span>Beneficiario</span><strong>Pedro Alejandro Torres Martínez</strong></div>
                <div class="bank-item"><span>RFC</span><strong>TOMP770507TM4</strong></div>
                <div class="bank-item"><span>Correo electrónico</span><strong>palejandro_torres@yahoo.com.mx</strong></div>
                <div class="bank-item"><span>Institución bancaria</span><strong>BANORTE</strong></div>
                <div class="bank-item"><span>Cuenta CLABE</span><strong>072 441 00662046978 0</strong></div>
                <div class="bank-item"><span>Cuenta bancaria</span><strong>0662046978</strong></div>
              </div>
              <p class="invoice-note">
                En caso de requerir factura, favor de enviar la constancia de situación fiscal,
                especificar el régimen en el supuesto de tener varios regímenes, señalar uso del CFDI
                y mencionar un correo electrónico.
              </p>
            </div>
          </div>
          ${footer}
        </section>
        ${quoteType === "solar" ? `
        <section class="page page-break">
          <div class="watermark soft"></div>
          <div class="content">
            <div class="annex-hero">
              <div>
                <strong>ANEXO EJECUTIVO</strong>
                <h1>Valor de la solución solar</h1>
              </div>
              <img src="${logoUrl}" alt="XOLTEC" />
            </div>
            <p class="intro">
              Un sistema solar fotovoltaico convierte la radiación solar en energía útil para el inmueble,
              ayudando a reducir el gasto eléctrico y a construir un activo energético de largo plazo.
            </p>
            <div class="annex-stats">
              <div class="annex-stat"><strong>2-6</strong><span>años de amortización estimada</span></div>
              <div class="annex-stat"><strong>25+</strong><span>años de vida útil esperada</span></div>
              <div class="annex-stat"><strong>80%</strong><span>producción aproximada al año 25</span></div>
              <div class="annex-stat"><strong>Mín.</strong><span>mantenimiento operativo</span></div>
            </div>
            <div class="annex-grid">
              <article class="annex-card">
                <strong>Ahorro y control del gasto</strong>
                <p>La energía generada reduce el consumo tomado de la red y ayuda a proteger al cliente ante incrementos en tarifas eléctricas.</p>
              </article>
              <article class="annex-card">
                <strong>Sistema modular</strong>
                <p>La solución puede adaptarse al consumo actual y crecer conforme cambie la demanda del hogar o negocio.</p>
              </article>
              <article class="annex-card">
                <strong>Bajo impacto operativo</strong>
                <p>La operación es silenciosa, limpia y no genera contaminación local durante la producción de energía.</p>
              </article>
              <article class="annex-card">
                <strong>Activo de largo plazo</strong>
                <p>Después del periodo de recuperación, la generación se convierte en el principal beneficio económico del sistema.</p>
              </article>
            </div>
            <h1 class="section-title" style="margin-top:20px;">¿Cómo funciona?</h1>
            <div class="annex-grid">
              <article class="annex-card"><strong>Paneles solares</strong><p>Capturan radiación solar y producen corriente continua.</p></article>
              <article class="annex-card"><strong>Inversor</strong><p>Convierte la corriente continua en corriente alterna utilizable.</p></article>
              <article class="annex-card"><strong>Consumo</strong><p>La energía se utiliza en tiempo real dentro del inmueble.</p></article>
              <article class="annex-card"><strong>Monitoreo</strong><p>El inversor registra generación y permite revisar diagnósticos del sistema.</p></article>
            </div>
          </div>
          ${footer}
        </section>
        <section class="page page-break">
          <div class="watermark soft"></div>
          <div class="content">
            <div class="annex-hero">
              <div>
                <strong>ANEXO EJECUTIVO</strong>
                <h1>Interconexión y mantenimiento</h1>
              </div>
              <img src="${logoUrl}" alt="XOLTEC" />
            </div>
            <h1 class="section-title">Ruta de interconexión con CFE</h1>
            <div class="process-list">
              <div class="process-step"><b>1</b><div><strong>Solicitud</strong><span>Presentación de solicitud y documentación técnica del sistema.</span></div></div>
              <div class="process-step"><b>2</b><div><strong>Revisión técnica</strong><span>Evaluación de requisitos, seguridad e inspección cuando aplique.</span></div></div>
              <div class="process-step"><b>3</b><div><strong>Medidor bidireccional</strong><span>Sustitución por medidor que registra consumo e inyección de excedentes.</span></div></div>
              <div class="process-step"><b>4</b><div><strong>Contrato y operación</strong><span>Formalización de condiciones de interconexión e inicio de operación.</span></div></div>
            </div>
            <div class="annex-grid" style="margin-top:18px;">
              <article class="annex-card">
                <strong>Mantenimiento recomendado</strong>
                <ul>
                  <li>Limpieza periódica de paneles para evitar pérdidas de generación.</li>
                  <li>Revisión de conexiones, protecciones, fusibles y puesta a tierra.</li>
                  <li>Monitoreo del inversor para detectar anomalías de operación.</li>
                  <li>Revisión de baterías cuando el proyecto las incluya.</li>
                </ul>
              </article>
              <article class="annex-card">
                <strong>Mensaje clave para el cliente</strong>
                <p>La interconexión formaliza el sistema y habilita el esquema de medición para que el cliente vea el beneficio reflejado en su facturación eléctrica.</p>
              </article>
            </div>
          </div>
          ${footer}
        </section>
        <section class="page page-break">
          <div class="watermark soft"></div>
          <div class="content">
            <div class="solar-map-hero">
              <div>
                <span class="solar-map-kicker">Mapa rápido</span>
                <h1>Cómo funciona un sistema solar fotovoltaico</h1>
                <p>Resumen ejecutivo para entender componentes, flujo de energía, interconexión y criterios de selección en una cotización profesional.</p>
              </div>
              <img src="${logoUrl}" alt="XOLTEC" />
            </div>
            <div class="solar-flow">
              <svg class="solar-arrows" viewBox="0 0 720 270" preserveAspectRatio="none" aria-hidden="true">
                <defs>
                  <marker id="solar-arrow-head" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                    <path d="M0,0 L8,4 L0,8 Z" fill="#18a058"></path>
                  </marker>
                </defs>
                <path d="M225 56 H252" marker-end="url(#solar-arrow-head)"></path>
                <path d="M468 56 H495" marker-end="url(#solar-arrow-head)"></path>
                <path d="M600 112 L115 174" marker-end="url(#solar-arrow-head)"></path>
                <path d="M600 112 L360 174" marker-end="url(#solar-arrow-head)"></path>
                <path d="M600 112 L600 174" marker-end="url(#solar-arrow-head)"></path>
              </svg>
              <article class="solar-node">
                <div class="solar-node-head"><span class="solar-icon">${solarMapIcon("panel")}</span><h2>1. Paneles</h2></div>
                <p>Capturan radiación solar y producen corriente continua para iniciar la generación.</p>
              </article>
              <article class="solar-node accent">
                <div class="solar-node-head"><span class="solar-icon">${solarMapIcon("inverter")}</span><h2>2. Inversor</h2></div>
                <p>Convierte corriente continua en corriente alterna apta para equipos eléctricos.</p>
              </article>
              <article class="solar-node">
                <div class="solar-node-head"><span class="solar-icon">${solarMapIcon("home")}</span><h2>3. Consumo</h2></div>
                <p>La energía se usa en el hogar o negocio en tiempo real, reduciendo consumo de red.</p>
              </article>
              <article class="solar-node accent">
                <div class="solar-node-head"><span class="solar-icon">${solarMapIcon("battery")}</span><h2>4. Baterías</h2></div>
                <p>Almacenan energía para usarla cuando el proyecto lo requiere.</p>
              </article>
              <article class="solar-node">
                <div class="solar-node-head"><span class="solar-icon">${solarMapIcon("cfe")}</span><h2>5. Red CFE</h2></div>
                <p>Los excedentes pueden inyectarse mediante medidor bidireccional.</p>
              </article>
              <article class="solar-node gold">
                <div class="solar-node-head"><span class="solar-icon">${solarMapIcon("monitor")}</span><h2>6. Monitoreo</h2></div>
                <p>El inversor registra producción y permite revisar diagnósticos o reportes.</p>
              </article>
            </div>
            <h1 class="solar-stats-title">Indicadores clave</h1>
            <div class="solar-metrics">
              <article class="solar-metric green"><strong>2-6</strong><span>años de amortización estimada</span></article>
              <article class="solar-metric gold"><strong>25+</strong><span>años de vida útil esperada</span></article>
              <article class="solar-metric teal"><strong>80%</strong><span>producción aproximada al año 25</span></article>
              <article class="solar-metric"><strong>Mín.</strong><span>mantenimiento operativo</span></article>
            </div>
            <div class="generation-box">
              <h2>¿De qué depende la generación?</h2>
              <div class="generation-grid">
                <div class="generation-item"><b>1</b><div><strong>Tamaño del sistema</strong><span>Más capacidad instalada puede cubrir mayor demanda.</span></div></div>
                <div class="generation-item"><b>2</b><div><strong>Cantidad y eficiencia de paneles</strong><span>El tipo de panel y su potencia afectan la producción.</span></div></div>
                <div class="generation-item"><b>3</b><div><strong>Radiación y clima</strong><span>Ubicación, inclinación y condiciones climáticas influyen cada día.</span></div></div>
              </div>
            </div>
          </div>
          ${footer}
        </section>
        ` : ""}
        <script>window.addEventListener("load", () => setTimeout(() => window.print(), 250));</script>
      </body>
    </html>
  `);
  printable.document.close();
}

function metric(label, value) {
  return `
    <article class="metric">
      <span>${label}</span>
      <strong>${value}</strong>
    </article>
  `;
}

function emptyState(text) {
  return `<div class="empty-state">${text}</div>`;
}

function stageLabel(stage) {
  return stage === "Negociacion" ? "Negociación" : stage;
}

function todayPlus(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function createId() {
  if (window.crypto && window.crypto.randomUUID) return window.crypto.randomUUID();
  return `id-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function formatDate(value) {
  return new Intl.DateTimeFormat("es-MX", {
    day: "2-digit",
    month: "short",
  }).format(new Date(`${value}T12:00:00`));
}

function formatLongDate(value) {
  return new Intl.DateTimeFormat("es-MX", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(value);
}

function quotePdfFooter() {
  return `
    <div class="footer">
      <div class="footer-grid">
        <div class="footer-item"><span class="footer-icon">${pdfFooterIcon("phone")}</span><span class="footer-text">722 518 5448</span></div>
        <div class="footer-item"><span class="footer-icon">${pdfFooterIcon("mail")}</span><span class="footer-text">hola@xoltec.mx</span></div>
        <div class="footer-item"><span class="footer-icon">${pdfFooterIcon("web")}</span><span class="footer-text">xoltec.mx</span></div>
        <div>
          <div class="footer-item"><span class="footer-icon">${pdfFooterIcon("pin")}</span><span class="footer-text">Guillermo González Camarena No. 999 Int. 204</span></div>
          <span class="footer-address">Colonia Santa Fe, Delegación Álvaro Obregón</span>
        </div>
      </div>
    </div>
  `;
}

function pdfFooterIcon(type) {
  const icons = {
    phone: '<svg viewBox="0 0 24 24"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.7.6 2.5a2 2 0 0 1-.5 2.1L8 9.5a16 16 0 0 0 6.5 6.5l1.2-1.2a2 2 0 0 1 2.1-.5c.8.3 1.6.5 2.5.6A2 2 0 0 1 22 16.9z"/></svg>',
    mail: '<svg viewBox="0 0 24 24"><path d="M4 6h16v12H4z"/><path d="m4 7 8 6 8-6"/></svg>',
    web: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.5 3 14 0 18M12 3c-3 3.5-3 14 0 18"/></svg>',
    pin: '<svg viewBox="0 0 24 24"><path d="M12 21s7-5.4 7-12a7 7 0 1 0-14 0c0 6.6 7 12 7 12z"/><circle cx="12" cy="9" r="2.4"/></svg>',
  };
  return icons[type] || "";
}

function solarMapIcon(type) {
  const icons = {
    panel:
      '<svg viewBox="0 0 24 24"><path d="m4 8 14-3 2 9-14 3z"/><path d="M7 7.4 9 16M11.5 6.4l2 8.6M16 5.5l2 8.5M5.5 11.5l14-3M6.4 15l14-3"/></svg>',
    inverter:
      '<svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="3"/><path d="M7 14c2.6-5.3 4.6-5.3 7.2 0 1.2 2.5 2.2 2.5 3.8 0"/></svg>',
    home:
      '<svg viewBox="0 0 24 24"><path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10.5V20h13v-9.5"/><path d="M9.5 20v-5h5v5"/></svg>',
    battery:
      '<svg viewBox="0 0 24 24"><rect x="3" y="7" width="16" height="10" rx="2"/><path d="M21 10v4"/><path d="M7 11h7"/></svg>',
    cfe: '<span class="cfe-mark">CFE</span>',
    monitor:
      '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/><path d="M12 12 17 9"/><path d="M8 16h8"/><circle cx="12" cy="12" r="1.5"/></svg>',
  };
  return icons[type] || "";
}

function formatAddress(address, fallback = "") {
  if (!address) return fallback;
  return [address.street, address.neighborhood, address.city, address.state, address.zip]
    .filter(Boolean)
    .join(", ");
}

function loadState() {
  const stored = localStorage.getItem("ventas-crm-state");
  if (stored) {
    const parsed = JSON.parse(stored);
    return {
      deals: parsed.deals || [],
      tasks: parsed.tasks || [],
      quoteClients: parsed.quoteClients || [],
      products: parsed.products || starterProductCatalog,
      users: ensureStarterUsers(parsed.users || []),
    };
  }
  return {
    deals: starterDeals,
    tasks: starterTasks,
    quoteClients: [],
    products: starterProductCatalog,
    users: ensureStarterUsers([]),
  };
}

function saveState() {
  localStorage.setItem("ventas-crm-state", JSON.stringify(state));
}

function migrateUsers(users) {
  return users.map((user) => ({
    ...user,
    position: user.position || user.role || "",
    signature: user.signature || "",
    superAdmin: isRicardoUser(user),
  }));
}

function ensureStarterUsers(existingUsers) {
  const migrated = migrateUsers(existingUsers);
  const usersWithoutLegacyAdmin = migrated.filter((user) => user.user !== "user" && user.user !== "admin");

  starterUsers.forEach((starterUser) => {
    const existingIndex = usersWithoutLegacyAdmin.findIndex((user) => isRicardoUser(user));
    if (existingIndex >= 0) {
      usersWithoutLegacyAdmin[existingIndex] = {
        ...starterUser,
        ...usersWithoutLegacyAdmin[existingIndex],
        superAdmin: true,
      };
    } else {
      usersWithoutLegacyAdmin.unshift(starterUser);
    }
  });

  return usersWithoutLegacyAdmin.map((user) => ({
    ...user,
    superAdmin: isRicardoUser(user),
  }));
}

function isRicardoUser(user) {
  const userName = normalizeSearchText(user && user.user);
  const fullName = normalizeSearchText(user && user.name);
  return userName === "ricardo" || userName === "ricardorenteria" || fullName === "ricardo renteria";
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
