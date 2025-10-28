// --- CONFIGURACIÓN ---
const API_BASE_URL = "http://localhost:3000/api/carreras"; // Tu API pública
// (¡Asegúrate de que tu backend esté corriendo y que CORS esté habilitado!)

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

// --- LÓGICA DE PESTAÑAS (TABS) ---
const switchToCareers = () => {
  careersView.classList.remove("hidden");
  universitiesView.classList.add("hidden");
  careersTabBtn.classList.add("active-btn");
  universitiesTabBtn.classList.remove("active-btn");
  // Cargar carreras al cambiar a la pestaña
  fetchCarreras();
};

const switchToUniversities = () => {
  universitiesView.classList.remove("hidden");
  careersView.classList.add("hidden");
  universitiesTabBtn.classList.add("active-btn");
  careersTabBtn.classList.remove("active-btn");
  // (Aquí llamaríamos a 'fetchUniversidades()' en el futuro)
  // fetchUniversidades();
};

// --- FUNCIÓN PRINCIPAL: OBTENER CARRERAS ---
let debounceTimer;
const fetchCarreras = () => {
  // Cancelar cualquier timer de búsqueda anterior
  clearTimeout(debounceTimer);

  // Iniciar un timer para no llamar a la API en cada tecla
  debounceTimer = setTimeout(async () => {
    // 1. Mostrar spinner y ocultar mensajes
    loadingSpinner.classList.remove("hidden");
    errorMessage.classList.add("hidden");
    noResultsMessage.classList.add("hidden");
    careersContainer.innerHTML = ""; // Limpiar resultados anteriores

    // 2. Obtener valores de los filtros
    const search = searchCareerInput.value;
    const area = filtroArea.value;
    const tipo = filtroTipo.value;
    const provincia = filtroProvincia.value;

    // 3. Construir la URL con parámetros de búsqueda
    const params = new URLSearchParams();
    if (search) params.append("search", search); // ¡Necesitamos añadir esto al backend!
    if (area) params.append("area", area);
    if (tipo) params.append("tipo", tipo);
    if (provincia) params.append("provincia", provincia);

    const url = `${API_BASE_URL}?${params.toString()}`;

    try {
      // 4. Hacer la petición fetch
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const carreras = await response.json();

      // 5. Renderizar los resultados
      renderCarreras(carreras);
    } catch (error) {
      // 6. Mostrar error
      console.error("Error al obtener carreras:", error);
      errorText.textContent = `No se pudieron cargar las carreras. ${error.message}`;
      errorMessage.classList.remove("hidden");
    } finally {
      // 7. Ocultar spinner
      loadingSpinner.classList.add("hidden");
    }
  }, 300); // 300ms de espera (debounce)
};

// --- FUNCIÓN: RENDERIZAR CARRERAS (CON TU DISEÑO) ---
const renderCarreras = (carreras) => {
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

    // ¡Aquí está la nueva tarjeta que coincide con tu diseño!
    const card = `
            <div class="card bg-white rounded-xl shadow-lg overflow-hidden flex flex-col hover:shadow-2xl transition-all duration-300 animate-fade-in">
                <!-- Contenido de la tarjeta -->
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
                    
                    <!-- Etiquetas (Badges) -->
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
                
                <!-- Pie de la tarjeta -->
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

// --- EVENT LISTENERS ---
document.addEventListener("DOMContentLoaded", () => {
  // Iniciar en la pestaña de carreras
  switchToCareers();
  AOS.init(); // Iniciar animaciones
});

// Listeners de Pestañas
careersTabBtn.addEventListener("click", switchToCareers);
universitiesTabBtn.addEventListener("click", switchToUniversities);

// Listeners de Filtros de Carreras
searchCareerInput.addEventListener("input", fetchCarreras);
filtroArea.addEventListener("change", fetchCarreras);
filtroTipo.addEventListener("change", fetchCarreras);
filtroProvincia.addEventListener("change", fetchCarreras);
