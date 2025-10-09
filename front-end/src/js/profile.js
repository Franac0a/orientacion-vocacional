// src/js/perfil.js

// Inicialización de AOS
AOS.init({
  duration: 1000,
  once: true,
});

// ****************************************
// 1. FUNCIONES GENERALES (NAV, ALERTAS)
// ****************************************

// Toggle de menú móvil
document
  .getElementById("mobile-menu-btn")
  .addEventListener("click", function () {
    const menu = document.getElementById("mobile-menu");
    menu.classList.toggle("hidden");
  });

// Efecto de sombra en el Navbar al hacer scroll
window.addEventListener("scroll", function () {
  const navbar = document.getElementById("navbar");
  if (window.scrollY > 50) {
    navbar.classList.add("shadow-2xl");
    navbar.classList.remove("shadow-lg");
  } else {
    navbar.classList.remove("shadow-2xl");
    navbar.classList.add("shadow-lg");
  }
});

// Función para mostrar mensajes de alerta
function showMessage(text, type = "success") {
  const messageContainer = document.getElementById("message-container");
  const alertMessage = document.getElementById("alertMessage");
  const alertText = document.getElementById("alert-text");

  alertText.textContent = text;
  messageContainer.classList.remove("hidden");

  // Limpiar clases de color
  alertMessage.classList.remove(
    "bg-red-100",
    "border-red-400",
    "text-red-700",
    "bg-emerald-100",
    "border-emerald-400",
    "text-emerald-700"
  );

  if (type === "success") {
    alertMessage.classList.add(
      "bg-emerald-100",
      "border-emerald-400",
      "text-emerald-700"
    );
  } else if (type === "error") {
    alertMessage.classList.add("bg-red-100", "border-red-400", "text-red-700");
  }

  setTimeout(() => {
    hideMessage();
  }, 3000);
}

// Función para ocultar mensajes de alerta
function hideMessage() {
  document.getElementById("message-container").classList.add("hidden");
}

// Función para actualizar la UI de navegación (botón de perfil/logout)
function updateUIForUser(user, userType) {
  const authButtonsContainer = document.getElementById("auth-buttons");
  const mobileAuthButtonsContainer = document.getElementById(
    "mobile-auth-buttons"
  );
  const testLink = document.getElementById("test-link");
  const mobileTestLink = document.getElementById("mobile-test-link");
  const userName = user && user.name ? user.name : "Mi Perfil";

  if (authButtonsContainer) {
    authButtonsContainer.innerHTML = `
            <div class="relative group">
              <button class="px-4 py-2 text-impulso-teal border border-impulso-teal rounded-lg hover:bg-impulso-teal hover:text-white transition-all duration-300">
                <i class="fas fa-user-circle mr-2"></i> ${userName}
              </button>
              <div class="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg hidden group-hover:block">
                <a href="perfil.html" class="block px-4 py-2 text-gray-800 hover:bg-gray-100" id="profile-link">Perfil</a>
                <button id="logout-button-nav" class="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100">Cerrar Sesión</button>
              </div>
            </div>
          `;
  }
  if (mobileAuthButtonsContainer) {
    mobileAuthButtonsContainer.innerHTML = `
            <a href="perfil.html" class="block w-full text-center px-4 py-2 text-impulso-teal border border-impulso-teal rounded-lg" id="mobile-profile-link">
              <i class="fas fa-user-circle mr-2"></i> Mi Perfil
            </a>
            <button id="mobile-logout-button-nav" class="block w-full text-center px-4 py-2 bg-gradient-to-r from-impulso-green to-impulso-teal text-white rounded-lg">
              Cerrar Sesión
            </button>
          `;
  }

  // Ocultar/Mostrar Test si no es estudiante
  if (userType !== "estudiante") {
    if (testLink) testLink.classList.add("hidden");
    if (mobileTestLink) mobileTestLink.classList.add("hidden");
  } else {
    if (testLink) testLink.classList.remove("hidden");
    if (mobileTestLink) mobileTestLink.classList.remove("hidden");
  }

  // Añadir manejadores de logout a los nuevos botones
  const logoutButton = document.getElementById("logout-button-nav");
  const mobileLogoutButton = document.getElementById(
    "mobile-logout-button-nav"
  );

  if (logoutButton) logoutButton.addEventListener("click", handleLogout);
  if (mobileLogoutButton)
    mobileLogoutButton.addEventListener("click", handleLogout);
}

// ****************************************
// 2. LÓGICA ESPECÍFICA DE PERFIL
// ****************************************

// Función de Logout (para reutilizar en caso de error de sesión)
function handleLogout() {
  localStorage.removeItem("authToken");
  localStorage.removeItem("userType");
  localStorage.removeItem("user");
  window.location.href = "index.html";
}

// Función principal para cargar datos del perfil desde el Backend
async function fetchUserProfile() {
  const authToken = localStorage.getItem("authToken");

  if (!authToken) {
    handleLogout(); // Redirige si no hay token
    return;
  }

  try {
    const response = await fetch("http://localhost:3000/api/users/profile", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (!response.ok) {
      // Manejar errores de autenticación o expiración
      if (response.status === 401 || response.status === 403) {
        showMessage(
          "Sesión expirada. Por favor, inicia sesión de nuevo.",
          "error"
        );
        handleLogout();
        return;
      }
      const errorData = await response
        .json()
        .catch(() => ({ mensaje: "Error al cargar el perfil." }));
      throw new Error(errorData.mensaje || "Error al cargar el perfil.");
    }

    const data = await response.json();
    const serverProfile = data.perfil;

    // Actualizamos el localStorage con los datos del servidor (incluyendo MBTI)
    localStorage.setItem("user", JSON.stringify(serverProfile));

    updateProfileUI(); // Llama a la función para actualizar la UI con los nuevos datos
  } catch (error) {
    console.error("Error en fetchUserProfile:", error);
    showMessage(
      error.message ||
        "Error al conectar con el servidor para cargar el perfil.",
      "error"
    );
  }
}

// Funciones para actualizar el DOM con los datos (incluyendo MBTI)
function updateProfileUI() {
  // Carga los datos del Local Storage (actualizados por fetchUserProfile)
  const updatedUserString = localStorage.getItem("user");
  const updatedUser = JSON.parse(updatedUserString);
  const userType = localStorage.getItem("userType");

  const userName = updatedUser.name || "Usuario";
  const userEmail = updatedUser.email || "email no disponible";
  const userMbti = updatedUser.mbtiType; // El dato clave

  const mbtiDisplay = document.getElementById("mbti-display");
  const mbtiActionLink = document.getElementById("mbti-action-link");

  // Actualización de datos básicos
  document.getElementById("profile-name").textContent = userName;
  document.getElementById("profile-email").textContent = userEmail;
  document.getElementById("display-name").textContent = userName;
  document.getElementById("display-email").textContent = userEmail;
  document.getElementById("edit-name").value = userName;
  document.getElementById("edit-email").value = userEmail;
  document.getElementById("profile-type").textContent =
    userType.charAt(0).toUpperCase() + userType.slice(1);

  // ----------------------------------------------------
  // ACTUALIZACIÓN DE MBTI
  // ----------------------------------------------------
  mbtiDisplay.classList.remove(
    "text-gray-500",
    "font-medium",
    "text-impulso-teal",
    "bg-impulso-light/50",
    "px-3",
    "py-1",
    "rounded"
  );

  if (userMbti) {
    mbtiDisplay.textContent = userMbti;
    mbtiDisplay.classList.add(
      "text-impulso-teal",
      "bg-impulso-light/50",
      "px-3",
      "py-1",
      "rounded"
    );
    mbtiActionLink.textContent = "Ver resultados detallados y carreras";
  } else {
    mbtiDisplay.textContent = "¡Test pendiente!";
    mbtiDisplay.classList.add("text-gray-500", "font-medium");
    mbtiActionLink.textContent = "Realizar el Test de Personalidad ahora";
  }

  // Actualiza el nombre en la barra de navegación también
  updateUIForUser(updatedUser, userType);
}

// ****************************************
// 3. INICIO Y MANEJADORES DE EVENTOS
// ****************************************

document.addEventListener("DOMContentLoaded", () => {
  const userString = localStorage.getItem("user");
  const authToken = localStorage.getItem("authToken");

  // 1. Verificar autenticación al cargar
  if (!authToken || !userString) {
    window.location.href = "login.html";
    return;
  }

  // 2. Elementos de la UI
  const profileView = document.getElementById("profile-view");
  const profileEditForm = document.getElementById("profile-edit-form");
  const editProfileBtn = document.getElementById("edit-profile-btn");
  const cancelEditBtn = document.getElementById("cancel-edit-btn");

  // 3. Cargar los datos iniciales llamando al backend
  fetchUserProfile();

  // 4. Manejadores de eventos para los botones de edición
  editProfileBtn.addEventListener("click", () => {
    profileView.classList.add("hidden");
    profileEditForm.classList.remove("hidden");
  });

  cancelEditBtn.addEventListener("click", () => {
    profileView.classList.remove("hidden");
    profileEditForm.classList.add("hidden");
    // Revertir los valores del formulario al cancelar
    const currentUser = JSON.parse(localStorage.getItem("user"));
    document.getElementById("edit-name").value = currentUser.name || "";
    document.getElementById("edit-email").value = currentUser.email || "";
  });

  profileEditForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // ⚠️ NOTA: Aquí iría tu lógica de fetch PUT/PATCH al backend
    // para guardar los cambios de nombre/email de forma PERMANENTE.

    const newName = document.getElementById("edit-name").value.trim();
    const newEmail = document.getElementById("edit-email").value.trim();

    if (!newName || !newEmail) {
      showMessage("Por favor, completa todos los campos.", "error");
      return;
    }

    // Simulación: Guardado en LocalStorage (REEMPLAZAR CON FETCH AL BACKEND)
    let currentUser = JSON.parse(localStorage.getItem("user"));
    currentUser.name = newName;
    currentUser.email = newEmail;
    localStorage.setItem("user", JSON.stringify(currentUser));

    updateProfileUI();

    profileView.classList.remove("hidden");
    profileEditForm.classList.add("hidden");

    showMessage(
      "¡Tu perfil ha sido actualizado! (Recuerda implementar el guardado en el servidor)",
      "success"
    );
  });

  // 5. Botón de cerrar sesión principal en la página
  document
    .getElementById("logout-button")
    .addEventListener("click", handleLogout);
});
