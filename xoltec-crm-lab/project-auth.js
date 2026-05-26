const PROJECT_AUTH_KEY = "rrz-xoltec-crm-lab-access";
const PROJECT_PASSWORD_HASH = "7efba5cb23594466d03e329c3c69646199377d4ed9fe9a5fc75abd9e663104ff";

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
