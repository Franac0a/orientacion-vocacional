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
    if (menu) menu.classList.toggle("hidden");
  });

// Efecto de sombra en el Navbar al hacer scroll
window.addEventListener("scroll", function () {
  const navbar = document.getElementById("navbar");
  if (!navbar) return;
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

  if (!messageContainer || !alertMessage || !alertText) return;

  alertText.textContent = text;
  messageContainer.classList.remove("hidden"); // Limpiar clases de color

  alertMessage.classList.remove(
    "bg-red-100",
    "border-red-400",
    "text-red-700",
    "bg-green-100",
    "border-green-400",
    "text-green-700" // Corregido de emerald
  );

  if (type === "success") {
    alertMessage.classList.add(
      "bg-green-100",
      "border-green-400",
      "text-green-700"
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
  const messageContainer = document.getElementById("message-container");
  if (messageContainer) messageContainer.classList.add("hidden");
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
    	  <div class="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg hidden group-hover:block z-50">
    		<a href="perfil.html" class="block px-4 py-2 text-gray-800 hover:bg-gray-100" id="profile-link-nav">Perfil</a>
    		<button id="logout-button-nav" class="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100">Cerrar Sesión</button>
    	  </div>
    	</div>
    	  `;
  }
  if (mobileAuthButtonsContainer) {
    mobileAuthButtonsContainer.innerHTML = `
    	  <a href="perfil.html" class="block w-full text-center px-4 py-2 text-impulso-teal border border-impulso-teal rounded-lg" id="mobile-profile-link-nav">
    		<i class="fas fa-user-circle mr-2"></i> Mi Perfil
    	  </a>
    	  <button id="mobile-logout-button-nav" class="block w-full text-center px-4 py-2 bg-gradient-to-r from-impulso-green to-impulso-teal text-white rounded-lg">
    		Cerrar Sesión
    	  </button>
    	`;
  } // Ocultar/Mostrar Test si no es estudiante

  if (userType !== "estudiante") {
    if (testLink) testLink.classList.add("hidden");
    if (mobileTestLink) mobileTestLink.classList.add("hidden");
  } else {
    if (testLink) testLink.classList.remove("hidden");
    if (mobileTestLink) mobileTestLink.classList.remove("hidden");
  } // Añadir manejadores de logout a los nuevos botones

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
async function handleLogout() {
  const token = localStorage.getItem("authToken");
  try {
    await fetch("http://localhost:3000/api/auth/logout", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error(
      "Error al notificar logout al servidor (se deslogueará localmente):",
      error
    );
  } finally {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userType");
    localStorage.removeItem("user");
    localStorage.removeItem("userRiasec"); // Limpiar RIASEC
    window.location.href = "index.html";
  }
}

// Función principal para cargar datos del perfil desde el Backend
async function fetchUserProfile() {
  const authToken = localStorage.getItem("authToken");

  if (!authToken) {
    handleLogout(); // Redirige si no hay token
    return;
  }

  try {
    // --- ¡ERROR CORREGIDO! ---
    // La URL ahora es /perfil (en español), como en tu user.routes.js
    const response = await fetch("http://localhost:3000/api/users/perfil", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        showMessage(
          "Sesión expirada. Por favor, inicia sesión de nuevo.",
          "error"
        );
        setTimeout(handleLogout, 2000);
        return;
      }
      const errorData = await response
        .json()
        .catch(() => ({ mensaje: "Error al cargar el perfil." }));
      throw new Error(errorData.mensaje || "Error al cargar el perfil.");
    }

    const data = await response.json();
    const serverProfile = data.perfil;

    localStorage.setItem("user", JSON.stringify(serverProfile));
    localStorage.setItem("userType", serverProfile.type);

    updateProfileUI(); // Llama a la función para actualizar la UI
  } catch (error) {
    console.error("Error en fetchUserProfile:", error);
    showMessage(error.message || "Error al conectar con el servidor.", "error");
    // Mostrar datos "viejos" de localStorage si falla el fetch
    if (localStorage.getItem("user")) {
      updateProfileUI();
    }
  }
}

// Funciones para actualizar el DOM con los datos (¡ACTUALIZADO A RIASEC!)
function updateProfileUI() {
  const updatedUserString = localStorage.getItem("user");
  if (!updatedUserString) {
    console.log("No hay datos de usuario en localStorage, deslogueando.");
    handleLogout();
    return;
  }

  const updatedUser = JSON.parse(updatedUserString);
  const userType = localStorage.getItem("userType");

  const userName = updatedUser.name || "Usuario";
  const userEmail = updatedUser.email || "email no disponible";

  // --- CAMBIO CLAVE: Leer 'riasecProfile' en lugar de 'mbtiType' ---
  const userRiasec = updatedUser.riasecProfile;

  // Selectores
  const riasecDisplay = document.getElementById("riasec-display");
  const riasecActionLink = document.getElementById("riasec-action-link"); // Actualización de datos básicos

  document.getElementById("profile-name").textContent = userName;
  document.getElementById("profile-email").textContent = userEmail;
  document.getElementById("display-name").textContent = userName;
  document.getElementById("display-email").textContent = userEmail;
  document.getElementById("edit-name").value = userName;
  document.getElementById("edit-email").value = userEmail;
  document.getElementById("profile-type").textContent = userType
    ? userType.charAt(0).toUpperCase() + userType.slice(1)
    : "N/A"; // ---------------------------------------------------- // ACTUALIZACIÓN DE RIASEC (antes MBTI) // ----------------------------------------------------

  // Reemplazamos mbti-display por riasec-display
  if (riasecDisplay && riasecActionLink) {
    riasecDisplay.classList.remove(
      "text-gray-500",
      "font-medium",
      "text-impulso-teal",
      "bg-impulso-light/50",
      "px-3",
      "py-1",
      "rounded"
    );

    if (userRiasec) {
      // Si el usuario TIENE un perfil RIASEC guardado
      riasecDisplay.textContent = userRiasec;
      riasecDisplay.classList.add(
        "text-impulso-teal",
        "bg-impulso-light/50",
        "px-3",
        "py-1",
        "rounded"
      );
      riasecActionLink.textContent = "Ver recomendaciones en Explorador";
      riasecActionLink.href = `explorador.html?riasec=${userRiasec.charAt(0)}`;
    } else {
      // Si el usuario NO ha completado el test
      riasecDisplay.textContent = "¡Test pendiente!";
      riasecDisplay.classList.add("text-gray-500", "font-medium");
      riasecActionLink.textContent = "Realizar el Test Vocacional ahora";
      riasecActionLink.href = "test.html";
    }
  } // Actualiza el nombre en la barra de navegación también

  updateUIForUser(updatedUser, userType);
}

// ****************************************
// 3. INICIO Y MANEJADORES DE EVENTOS
// ****************************************

document.addEventListener("DOMContentLoaded", () => {
  const authToken = localStorage.getItem("authToken"); // 1. Verificar autenticación al cargar

  if (!authToken) {
    window.location.href = "login.html";
    return;
  } // 2. Elementos de la UI

  const profileView = document.getElementById("profile-view");
  const profileEditForm = document.getElementById("profile-edit-form");
  const editProfileBtn = document.getElementById("edit-profile-btn");
  const cancelEditBtn = document.getElementById("cancel-edit-btn");
  const mainLogoutBtn = document.getElementById("logout-button-main"); // ID Corregido // 3. Cargar los datos iniciales llamando al backend

  fetchUserProfile(); // 4. Manejadores de eventos para los botones de edición

  if (editProfileBtn) {
    editProfileBtn.addEventListener("click", () => {
      profileView.classList.add("hidden");
      if (mainLogoutBtn) mainLogoutBtn.classList.add("hidden");
      profileEditForm.classList.remove("hidden");
    });
  }

  if (cancelEditBtn) {
    cancelEditBtn.addEventListener("click", () => {
      section;
      profileView.classList.remove("hidden");
      if (mainLogoutBtn) mainLogoutBtn.classList.remove("hidden");
      profileEditForm.classList.add("hidden"); // Revertir los valores del formulario al cancelar
      const currentUser = JSON.parse(localStorage.getItem("user"));
      if (currentUser) {
        document.getElementById("edit-name").value = currentUser.name || "";
        document.getElementById("edit-email").value = currentUser.email || "";
      }
    });
  }
  if (profileEditForm) {
    profileEditForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const newName = document.getElementById("edit-name").value.trim();
      const newEmail = document.getElementById("edit-email").value.trim();

      if (!newName || !newEmail) {
        showMessage("Por favor, completa todos los campos.", "error");
        return;
      } // Simulación: Guardado en LocalStorage

      // --- (INICIO) Lógica real de guardado (a implementar) ---
      // try {
      //   const response = await fetch("http://localhost:3000/api/users/perfil", { // Deberías crear una ruta PUT /api/users/perfil
      //     method: 'PUT',
      //     headers: {
      //       'Content-Type': 'application/json',
      //       'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      //     },
      //     body: JSON.stringify({ name: newName, email: newEmail })
      //   });
      //   if (!response.ok) {
      //     const errData = await response.json();
      //     throw new Error(errData.mensaje || "Error al guardar perfil");
      //   }
      //   const updatedData = await response.json();
      //   localStorage.setItem('user', JSON.stringify(updatedData.perfil));
      //   showMessage("¡Tu perfil ha sido actualizado!", "success");
      // } catch (error) {
      //   console.error("Error al guardar perfil:", error);
      //   showMessage(error.message, "error");
      //   return;
      // }
      // --- (FIN) Lógica real de guardado ---

      let currentUser = JSON.parse(localStorage.getItem("user"));
      currentUser.name = newName;
      currentUser.email = newEmail;
      localStorage.setItem("user", JSON.stringify(currentUser));
      showMessage(
        "¡Tu perfil ha sido actualizado! (Simulación local)",
        "success"
      );
      // Fin simulación

      updateProfileUI(); // Actualiza la UI con los nuevos datos

      profileView.classList.remove("hidden");
      if (mainLogoutBtn) mainLogoutBtn.classList.remove("hidden");
      profileEditForm.classList.add("hidden");
    });
  } // 5. Botón de cerrar sesión principal en la página

  if (mainLogoutBtn) {
    mainLogoutBtn.addEventListener("click", handleLogout);
  }
});
