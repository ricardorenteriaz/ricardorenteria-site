const PROJECT_AUTH_KEY = "rrz-xoltec-crm-lab-access";
const PROJECT_PASSWORD_HASH = "6a127ec91de4c01dfc74bf49b5209df8822f1663ac712131492d3a5f4585553d";

const gateForm = document.querySelector("#project-gate-form");
const gatePassword = document.querySelector("#project-gate-password");
const gateError = document.querySelector("#project-gate-error");

function unlockProject() {
  document.body.classList.remove("project-locked");
  document.body.classList.add("project-unlocked");
}

async function sha256(value) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

if (sessionStorage.getItem(PROJECT_AUTH_KEY) === "ok") {
  unlockProject();
} else if (gatePassword) {
  gatePassword.focus();
}

if (gateForm) {
  gateForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const passwordHash = await sha256(gatePassword.value.trim());
    if (passwordHash === PROJECT_PASSWORD_HASH) {
      sessionStorage.setItem(PROJECT_AUTH_KEY, "ok");
      unlockProject();
      return;
    }

    gateError.textContent = "Contraseña incorrecta.";
    gatePassword.select();
  });
}
