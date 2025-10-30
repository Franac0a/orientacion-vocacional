document.addEventListener("DOMContentLoaded", () => {
  const authButtonsContainer = document.getElementById("auth-buttons");
  const mobileAuthButtonsContainer = document.getElementById(
    "mobile-auth-buttons"
  );
  const testLink = document.getElementById("test-link");
  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");

  // Función para actualizar la UI según el estado del usuario
  function updateUIForUser(userType) {
    // Ocultar los botones de ingreso/registro y mostrar el menú de usuario
    const userMenuHtml = `
            <div class="profile-menu">
                <button class="profile-btn">
                    <i class="fas fa-user-circle"></i> Mi Perfil <i class="fas fa-chevron-down"></i>
                </button>
                <div class="dropdown-content">
                    <a href="#" id="profile-link">Perfil</a>
                    <button id="logout-button">Cerrar Sesión</button>
                </div>
            </div>
        `;
    authButtonsContainer.innerHTML = userMenuHtml;

    const mobileUserMenuHtml = `
            <a href="#" id="mobile-profile-link">
                <i class="fas fa-user-circle"></i> Mi Perfil
            </a>
            <button id="mobile-logout-button" class="btn primary">
                Cerrar Sesión
            </button>
        `;
    mobileAuthButtonsContainer.innerHTML = mobileUserMenuHtml;

    // Redirigir el enlace de perfil según el tipo de usuario
    const profileLink = document.getElementById("profile-link");
    const mobileProfileLink = document.getElementById("mobile-profile-link");
    let profilePage = "perfil-estudiante.html"; // Default para estudiante
    if (userType === "universidad") {
      profilePage = "dashboard-universidad.html";
    }
    profileLink.href = profilePage;
    mobileProfileLink.href = profilePage;

    // Añadir evento de cerrar sesión
    const logoutButton = document.getElementById("logout-button");
    const mobileLogoutButton = document.getElementById("mobile-logout-button");

    const logout = () => {
      localStorage.removeItem("authToken");
      localStorage.removeItem("userType");
      localStorage.removeItem("user");
      window.location.href = "index.html";
    };

    if (logoutButton) logoutButton.addEventListener("click", logout);
    if (mobileLogoutButton)
      mobileLogoutButton.addEventListener("click", logout);
  }

  // Función para mostrar el estado de no-autenticado
  function showAuthButtons() {
    const loginRegisterHtml = `
            <a href="login.html">Ingresar</a>
            <a href="registro.html" class="btn">Registrarse</a>
        `;
    authButtonsContainer.innerHTML = loginRegisterHtml;
    mobileAuthButtonsContainer.innerHTML = loginRegisterHtml;
  }

  // Lógica para mostrar/ocultar el test y la barra de navegación
  const token = localStorage.getItem("authToken");
  const userType = localStorage.getItem("userType");
  const testSection = document.getElementById("mbtiForm");
  const progressSection = document.getElementById("progressSection");
  const resultSection = document.getElementById("result");
  const savedCard = document.getElementById("savedCard");

  if (token && userType === "estudiante") {
    updateUIForUser("estudiante");
    testSection.classList.remove("hidden");
    progressSection.classList.remove("hidden");
    resultSection.classList.add("hidden"); // Asegurarse de que el resultado esté oculto al cargar
    savedCard.classList.remove("hidden"); // Mostrar historial
  } else {
    showAuthButtons();
    // Ocultar el test y sus secciones si el usuario no es estudiante o no está logueado
    testSection.classList.add("hidden");
    progressSection.classList.add("hidden");
    resultSection.classList.add("hidden");
    savedCard.classList.add("hidden");

    // Aquí puedes agregar un mensaje o redirigir al login
    const mainContainer = document.querySelector("main.container");
    mainContainer.innerHTML = `
            <div class="login-prompt card">
                <h2>Acceso Restringido</h2>
                <p>Para acceder al test vocacional, debes ser un estudiante y haber iniciado sesión.</p>
                <a href="login.html" class="btn primary">Iniciar Sesión</a>
            </div>
        `;
  }

  // Lógica para el menú móvil
  mobileMenuBtn.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden");
  });
});
