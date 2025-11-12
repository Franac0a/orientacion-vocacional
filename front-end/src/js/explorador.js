// --- CONFIGURACIÓN ---
const API_CARRERAS_URL = "http://localhost:3000/api/carreras";
const API_UNIVERSIDADES_URL = "http://localhost:3000/api/universidades";

// --- SELECTORES DEL DOM ---
// Pestañas
const universitiesTabBtn = document.getElementById("universities-tab-btn");
const careersTabBtn = document.getElementById("careers-tab-btn");
const universitiesView = document.getElementById("universities-view");
const careersView = document.getElementById("careers-view");

// Contenedores de Carreras
const careersContainer = document.getElementById("careersContainer");
const loadingSpinner = document.getElementById("loading-spinner");
const errorMessage = document.getElementById("error-message");
const errorText = document.getElementById("error-text");
const noResultsMessage = document.getElementById("no-results-message");

// Filtros de Carreras
const searchCareerInput = document.getElementById("searchCareerInput");
const filtroArea = document.getElementById("filtro-area");
const filtroTipo = document.getElementById("filtro-tipo");
const filtroProvincia = document.getElementById("filtro-provincia");
const filtroMbtiSwitch = document.getElementById("filtro-mbti"); // <-- NUEVO SELECTOR
const mbtiWarning = document.getElementById("mbti-warning"); // <-- NUEVO SELECTOR

// Selectores de Universidades
const universitiesContainer = document.getElementById("universitiesContainer");
const loadingSpinnerUni = document.getElementById("loading-spinner-uni");
const errorMessageUni = document.getElementById("error-message-uni");
const errorTextUni = document.getElementById("error-text-uni");
const noResultsMessageUni = document.getElementById("no-results-message-uni");
const searchUniInput = document.getElementById("searchUniInput");

// Navbar y Auth
const mobileMenuBtn = document.getElementById("mobile-menu-btn");
const mobileMenu = document.getElementById("mobile-menu");

// --- LÓGICA DE PESTAÑAS (TABS) ---
const switchToCareers = () => {
  careersView.classList.remove("hidden");
  universitiesView.classList.add("hidden");
  careersTabBtn.classList.add("active-btn");
  universitiesTabBtn.classList.remove("active-btn");
  fetchCarreras();
};

const switchToUniversities = () => {
  universitiesView.classList.remove("hidden");
  careersView.classList.add("hidden");
  universitiesTabBtn.classList.add("active-btn");
  careersTabBtn.classList.remove("active-btn");
  fetchUniversidades();
};

// --- FUNCIÓN PRINCIPAL: OBTENER CARRERAS (ACTUALIZADA CON MBTI) ---
let debounceTimerCarreras;
const fetchCarreras = () => {
  clearTimeout(debounceTimerCarreras);
  debounceTimerCarreras = setTimeout(async () => {
    loadingSpinner.classList.remove("hidden");
    errorMessage.classList.add("hidden");
    noResultsMessage.classList.add("hidden");
    mbtiWarning.classList.add("hidden"); // Ocultar advertencia por defecto
    careersContainer.innerHTML = "";

    // Obtener valores de filtros
    const search = searchCareerInput.value;
    const area = filtroArea.value;
    const tipo = filtroTipo.value;
    const provincia = filtroProvincia.value;
    const filtrarPorMbti = filtroMbtiSwitch.checked; // <-- Leer el estado del switch
    const userMbti = localStorage.getItem("userMbti"); // <-- Leer MBTI guardado

    // Construir parámetros de URL
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (area) params.append("area", area);
    if (tipo) params.append("tipo", tipo);
    if (provincia) params.append("provincia", provincia);

    // --- LÓGICA DEL FILTRO MBTI ---
    if (filtrarPorMbti) {
      if (userMbti) {
        params.append("mbti", userMbti); // <-- AÑADIR PARÁMETRO MBTI
      } else {
        // Si el filtro está activo pero no hay MBTI, mostrar advertencia y no filtrar
        mbtiWarning.classList.remove("hidden");
        // Podríamos optar por no hacer el fetch aquí si queremos forzar al usuario
        // console.warn("Filtro MBTI activo pero no se encontró 'userMbti' en localStorage.");
      }
    }
    // --- FIN LÓGICA MBTI ---

    const url = `${API_CARRERAS_URL}?${params.toString()}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      const carreras = await response.json();
      renderCarreras(carreras);
    } catch (error) {
      console.error("Error al obtener carreras:", error);
      errorText.textContent = `No se pudieron cargar las carreras. ${error.message}`;
      errorMessage.classList.remove("hidden");
    } finally {
      loadingSpinner.classList.add("hidden");
    }
  }, 300);
};

// --- FUNCIÓN: RENDERIZAR CARRERAS ---
const renderCarreras = (carreras) => {
  // ... (Sin cambios aquí) ...
  careersContainer.innerHTML = "";
  if (carreras.length === 0) {
    noResultsMessage.classList.remove("hidden");
    return;
  }
  noResultsMessage.classList.add("hidden");

  carreras.forEach((carrera) => {
    const universidad = carrera.Universidad || {
      nombre: "N/A",
      sitio_web: "#",
    };

    const card = `
            <div class="card bg-white rounded-xl shadow-lg overflow-hidden flex flex-col hover:shadow-2xl transition-all duration-300 animate-fade-in">
                <div class="p-6">
                    <h3 class="text-xl font-bold text-impulso-dark mb-2">${
                      carrera.nombre
                    }</h3>
                    <h4 class="text-md font-semibold text-impulso-green mb-3">${
                      universidad.nombre
                    }</h4>
                    <p class="text-gray-600 text-sm mb-4 min-h-[60px]">${
                      carrera.descripcion || "No hay descripción disponible."
                    }</p>
                    
                    <div class="flex flex-wrap gap-2 mb-4 pt-4 border-t border-gray-100">
                        <span class="text-xs font-medium mr-2 px-2.5 py-1 rounded-full bg-impulso-light text-impulso-dark" title="Área de Estudio">
                            <i class="fas fa-shapes mr-1"></i> ${
                              carrera.area_estudio
                            }
                        </span>
                        <span class="text-xs font-medium mr-2 px-2.5 py-1 rounded-full bg-gray-100 text-gray-700" title="Tipo">
                            <i class="fas fa-graduation-cap mr-1"></i> ${
                              carrera.tipo
                            }
                        </span>
                        <span class="text-xs font-medium mr-2 px-2.5 py-1 rounded-full bg-gray-100 text-gray-700" title="Duración">
                            <i class="fas fa-clock mr-1"></i> ${
                              carrera.duracion_anios || "?"
                            } años
                        </span>
                    </div>
                </div>
                
                <div class="mt-auto bg-gray-50 p-4">
                    <a href="${
                      universidad.sitio_web
                    }" target="_blank" rel="noopener noreferrer" class="font-medium text-impulso-teal hover:text-impulso-dark transition-colors">
                        Visitar sitio web
                        <i class="fas fa-external-link-alt ml-1 text-xs"></i>
                    </a>
                </div>
            </div>
          `;
    careersContainer.innerHTML += card;
  });
};

// --- FUNCIÓN: OBTENER UNIVERSIDADES ---
let debounceTimerUni;
const fetchUniversidades = () => {
  // ... (Sin cambios aquí) ...
  clearTimeout(debounceTimerUni);
  debounceTimerUni = setTimeout(async () => {
    loadingSpinnerUni.classList.remove("hidden"); // Mostrar spinner Uni
    errorMessageUni.classList.add("hidden");
    noResultsMessageUni.classList.add("hidden");
    universitiesContainer.innerHTML = "";

    const search = searchUniInput.value;

    const params = new URLSearchParams();
    if (search) params.append("search", search);

    const url = `${API_UNIVERSIDADES_URL}?${params.toString()}`; // URL correcta

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      const universidades = await response.json();
      renderUniversidades(universidades);
    } catch (error) {
      console.error("Error al obtener universidades:", error);
      errorTextUni.textContent = `No se pudieron cargar las universidades. ${error.message}`;
      errorMessageUni.classList.remove("hidden");
    } finally {
      loadingSpinnerUni.classList.add("hidden"); // Ocultar spinner Uni
    }
  }, 300);
};

// --- FUNCIÓN: RENDERIZAR UNIVERSIDADES ---
const renderUniversidades = (universidades) => {
  // ... (Sin cambios aquí) ...
  universitiesContainer.innerHTML = "";
  if (universidades.length === 0) {
    noResultsMessageUni.classList.remove("hidden");
    return;
  }
  noResultsMessageUni.classList.add("hidden");

  universidades.forEach((uni) => {
    const card = `
            <div class="card bg-white rounded-xl shadow-lg overflow-hidden flex flex-col hover:shadow-2xl transition-all duration-300 animate-fade-in">
                <div class="p-6">
                    <h3 class="text-xl font-bold text-impulso-dark mb-2">${
                      uni.nombre
                    } (${uni.alias || "N/A"})</h3>
                    <p class="text-gray-600 text-sm mb-4">${
                      uni.provincia || "Provincia no especificada"
                    }</p>
                    
                    <div class="flex flex-wrap gap-2 mb-4 pt-4 border-t border-gray-100">
                        <span class="text-xs font-medium mr-2 px-2.5 py-1 rounded-full ${
                          uni.tipo_gestion === "Pública"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                        }" title="Gestión">
                            <i class="fas fa-landmark mr-1"></i> ${
                              uni.tipo_gestion
                            }
                        </span>
                    </div>
                </div>
                
                <div class="mt-auto bg-gray-50 p-4">
                    <a href="${
                      uni.sitio_web || "#"
                    }" target="_blank" rel="noopener noreferrer" class="font-medium text-impulso-teal hover:text-impulso-dark transition-colors">
                        Visitar sitio web
                        <i class="fas fa-external-link-alt ml-1 text-xs"></i>
                    </a>
                </div>
            </div>
          `;
    universitiesContainer.innerHTML += card;
  });
};

// --- EVENT LISTENERS (FUSIONADOS Y ACTUALIZADOS) ---
document.addEventListener("DOMContentLoaded", () => {
  // --- INICIO: LÓGICA DE AUTH (de nosotros.html) ---
  // ... (Tu lógica de autenticación sigue igual) ...
  const authButtonsContainer = document.getElementById("auth-buttons");
  const mobileAuthButtonsContainer = document.getElementById(
    "mobile-auth-buttons"
  );
  const testLink = document.getElementById("test-link");
  const mobileTestLink = document.getElementById("mobile-test-link");

  function updateUIForUser(userType) {
    if (authButtonsContainer) {
      authButtonsContainer.innerHTML = "";
      const userMenuHtml = `
              <div class="relative group">
                <button class="px-4 py-2 text-impulso-teal border border-impulso-teal rounded-lg hover:bg-impulso-teal hover:text-white transition-all duration-300">
                  <i class="fas fa-user-circle mr-2"></i> Mi Perfil
                </button>
                <div class="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg hidden group-hover:block z-50">
                  <a href="#" class="block px-4 py-2 text-gray-800 hover:bg-gray-100" id="profile-link">Perfil</a>
                  <button id="logout-button" class="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100">Cerrar Sesión</button>
                </div>
              </div>
            `;
      authButtonsContainer.innerHTML = userMenuHtml;
    }

    if (mobileAuthButtonsContainer) {
      mobileAuthButtonsContainer.innerHTML = `
              <a href="#" class="block w-full text-center px-4 py-2 text-impulso-teal border border-impulso-teal rounded-lg" id="mobile-profile-link">
                <i class="fas fa-user-circle mr-2"></i> Mi Perfil
              </a>
              <button id="mobile-logout-button" class="block w-full text-center px-4 py-2 bg-gradient-to-r from-impulso-green to-impulso-teal text-white rounded-lg">
                Cerrar Sesión
              </button>
            `;
    }

    if (userType !== "estudiante") {
      if (testLink) testLink.classList.add("hidden");
      if (mobileTestLink) mobileTestLink.classList.add("hidden");
      // Ocultar filtro MBTI si no es estudiante
      if (filtroMbtiSwitch && filtroMbtiSwitch.parentElement.parentElement) {
        filtroMbtiSwitch.parentElement.parentElement.classList.add("hidden");
      }
    } else {
      if (testLink) testLink.classList.remove("hidden");
      if (mobileTestLink) mobileTestLink.classList.remove("hidden");
      // Mostrar filtro MBTI si es estudiante
      if (filtroMbtiSwitch && filtroMbtiSwitch.parentElement.parentElement) {
        filtroMbtiSwitch.parentElement.parentElement.classList.remove("hidden");
      }
    }

    const logoutButton = document.getElementById("logout-button");
    const mobileLogoutButton = document.getElementById("mobile-logout-button");
    const profileLink = document.getElementById("profile-link");
    const mobileProfileLink = document.getElementById("mobile-profile-link");

    // Obtener los datos del usuario del localStorage
    const user = JSON.parse(localStorage.getItem("user"));

    if (profileLink && user) {
      let profilePage = "";
      if (user.type === "estudiante") {
        profilePage = "perfil.html";
      } else if (user.type === "universidad") {
        profilePage = "dashboard-universidad.html";
      }
      profileLink.href = profilePage;
      if (mobileProfileLink) mobileProfileLink.href = profilePage; // Añadido chequeo
    }

    const logoutFn = () => {
      localStorage.removeItem("authToken");
      localStorage.removeItem("userType");
      localStorage.removeItem("user");
      localStorage.removeItem("userMbti"); // Borrar MBTI al cerrar sesión
      window.location.href = "index.html";
    };

    if (logoutButton) {
      logoutButton.addEventListener("click", logoutFn);
    }

    if (mobileLogoutButton) {
      mobileLogoutButton.addEventListener("click", logoutFn);
    }
  }

  const token = localStorage.getItem("authToken");
  const userType = localStorage.getItem("userType");

  if (token) {
    updateUIForUser(userType);
  } else {
    if (testLink) testLink.classList.add("hidden");
    if (mobileTestLink) mobileTestLink.classList.add("hidden");
    // Ocultar filtro MBTI si no está logueado
    if (filtroMbtiSwitch && filtroMbtiSwitch.parentElement.parentElement) {
      filtroMbtiSwitch.parentElement.parentElement.classList.add("hidden");
    }
  }
  // --- FIN: LÓGICA DE AUTH ---

  // --- LÓGICA DE EXPLORADOR ---
  AOS.init(); // Iniciar animaciones
  switchToCareers(); // Iniciar en la pestaña de carreras

  // Listeners de Pestañas
  careersTabBtn.addEventListener("click", switchToCareers);
  universitiesTabBtn.addEventListener("click", switchToUniversities);

  // Listeners de Filtros de Carreras
  searchCareerInput.addEventListener("input", fetchCarreras);
  filtroArea.addEventListener("change", fetchCarreras);
  filtroTipo.addEventListener("change", fetchCarreras);
  filtroProvincia.addEventListener("change", fetchCarreras);
  filtroMbtiSwitch.addEventListener("change", fetchCarreras); // <-- NUEVO LISTENER

  // Listener de Búsqueda de Universidades
  searchUniInput.addEventListener("input", fetchUniversidades);

  // Listener del Menú Móvil
  mobileMenuBtn.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden");
  });

  // Listener de Scroll
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
});
