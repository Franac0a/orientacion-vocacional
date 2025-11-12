document.addEventListener("DOMContentLoaded", () => {
  // --- SELECTORES DEL DOM ---
  const loginSection = document.getElementById("loginSection");
  const testSection = document.getElementById("testSection");
  const testForm = document.getElementById("testForm");
  const questionContainers = document.querySelectorAll(".question-container"); // NodeList de todas las preguntas
  const nextBtn = document.getElementById("next-btn");
  const submitBtn = document.getElementById("submit-btn");
  const progressText = document.getElementById("progressText");
  const progressFill = document.getElementById("progressFill");

  // Resultados
  const resultSection = document.getElementById("resultSection");
  const riasecResultEl = document.getElementById("riasecResult");
  const riasecDescriptionEl = document.getElementById("riasecDescription");

  // Recomendaciones
  const recommendationsSection = document.getElementById(
    "recommendationsSection"
  );
  const recommendedCareersContainer = document.getElementById(
    "recommendedCareersContainer"
  );
  const loadingSpinnerRec = document.getElementById("loading-spinner-rec");
  const errorMessageRec = document.getElementById("error-message-rec");
  const errorTextRec = document.getElementById("error-text-rec");
  const noResultsMessageRec = document.getElementById("no-results-message-rec");

  // Navbar y Auth
  const authButtonsContainer = document.getElementById("auth-buttons");
  const mobileAuthButtonsContainer = document.getElementById(
    "mobile-auth-buttons"
  );
  const testLink = document.getElementById("test-link");
  const mobileTestLink = document.getElementById("mobile-test-link");
  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");

  const API_CARRERAS_URL = "http://localhost:3000/api/carreras";
  // --- ENDPOINT ACTUALIZADO ---
  const API_SAVE_RESULTS_URL =
    "http://localhost:3000/api/users/save-vocational-result";

  let currentQuestionIndex = 0;
  const totalQuestions = questionContainers.length; // 18

  // --- Datos de Descripciones (RIASEC) ---
  const riasecData = {
    R: "Realista: Personas prácticas, con habilidades mecánicas. Disfrutan trabajar al aire libre, con animales, herramientas o máquinas.",
    I: "Investigador: Personas analíticas, curiosas y observadoras. Disfrutan resolver problemas complejos y trabajar con ideas.",
    A: "Artístico: Personas creativas, expresivas e intuitivas. Disfrutan trabajar en situaciones no estructuradas usando su imaginación.",
    S: "Social: Personas amables, generosas y cooperativas. Disfrutan ayudar, enseñar o cuidar a otros.",
    E: "Emprendedor: Personas persuasivas, enérgicas y ambiciosas. Disfrutan liderar, vender o influir en otros.",
    C: "Convencional: Personas organizadas, detallistas y eficientes. Disfrutan trabajar con datos y seguir procedimientos establecidos.",
  };

  // --- LÓGICA DE AUTENTICACIÓN DEL NAVBAR ---
  function updateUIForUser(user, userType) {
    if (authButtonsContainer) {
      authButtonsContainer.innerHTML = ""; // Limpiar botones existentes
      const userName = user && user.name ? user.name : "Mi Perfil";
      const userMenuHtml = `
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
      authButtonsContainer.innerHTML = userMenuHtml;
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
    }

    if (userType !== "estudiante") {
      if (testLink) testLink.classList.add("hidden");
      if (mobileTestLink) mobileTestLink.classList.add("hidden");
    } else {
      if (testLink) testLink.classList.remove("hidden");
      if (mobileTestLink) mobileTestLink.classList.remove("hidden");
    }

    const logoutButton = document.getElementById("logout-button-nav");
    const mobileLogoutButton = document.getElementById(
      "mobile-logout-button-nav"
    );

    if (logoutButton) logoutButton.addEventListener("click", handleLogout);
    if (mobileLogoutButton)
      mobileLogoutButton.addEventListener("click", handleLogout);
  }

  async function handleLogout() {
    const token = localStorage.getItem("authToken");
    try {
      await fetch("http://localhost:3000/api/auth/logout", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      console.error(
        "Error al notificar logout (se deslogueará localmente):",
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

  // --- VERIFICACIÓN INICIAL DE LOGIN Y TIPO DE USUARIO ---
  const token = localStorage.getItem("authToken");
  const userType = localStorage.getItem("userType");
  const user = JSON.parse(localStorage.getItem("user"));

  if (token) {
    updateUIForUser(user, userType); // Configurar navbar
    if (userType === "estudiante") {
      if (loginSection) loginSection.classList.add("hidden");
      if (testSection) testSection.classList.remove("hidden");
      showCurrentQuestion(); // Iniciar el test
    } else {
      // Logueado pero NO es estudiante
      if (loginSection) loginSection.classList.remove("hidden");
      if (testSection) testSection.classList.add("hidden");
      const loginMessage = loginSection?.querySelector(".p-8 p.text-gray-600");
      if (loginMessage)
        loginMessage.textContent =
          "El test vocacional está disponible solo para estudiantes.";
      const loginBtn = loginSection?.querySelector('a[href="login.html"]');
      const registerLink = loginSection?.querySelector(
        'a[href="registro.html"]'
      );
      if (loginBtn) loginBtn.classList.add("hidden");
      if (registerLink && registerLink.parentElement)
        registerLink.parentElement.classList.add("hidden");
    }
  } else {
    // No logueado
    if (loginSection) loginSection.classList.remove("hidden");
    if (testSection) testSection.classList.add("hidden");
    if (testLink) testLink.classList.add("hidden");
    if (mobileTestLink) mobileTestLink.classList.add("hidden");
  }

  // --- LÓGICA DEL TEST ---
  function updateProgress() {
    const progress = currentQuestionIndex + 1;
    if (progressText)
      progressText.textContent = `${progress} / ${totalQuestions}`;
    const percentage = (progress / totalQuestions) * 100;
    if (progressFill) progressFill.style.width = `${percentage}%`;
  }

  function showCurrentQuestion() {
    questionContainers.forEach((container, index) => {
      container.classList.toggle("active", index === currentQuestionIndex);
    });
    updateProgress();
    if (nextBtn)
      nextBtn.classList.toggle(
        "hidden",
        currentQuestionIndex === totalQuestions - 1
      );
    if (submitBtn)
      submitBtn.classList.toggle(
        "hidden",
        currentQuestionIndex !== totalQuestions - 1
      );
  }

  function isCurrentQuestionAnswered() {
    const currentQuestionEl = questionContainers[currentQuestionIndex];
    if (!currentQuestionEl) return false;
    const radioName = `q${currentQuestionIndex + 1}`;
    return (
      currentQuestionEl.querySelector(`input[name="${radioName}"]:checked`) !==
      null
    );
  }

  function handleNextQuestion() {
    if (isCurrentQuestionAnswered()) {
      if (currentQuestionIndex < totalQuestions - 1) {
        currentQuestionIndex++;
        showCurrentQuestion();
        window.scrollTo(0, 0);
      }
    } else {
      alert("Por favor, selecciona una opción para continuar.");
    }
  }

  // --- FUNCIÓN calculateResult (¡ACTUALIZADA A RIASEC!) ---
  async function calculateResult() {
    if (!isCurrentQuestionAnswered()) {
      alert("Por favor, selecciona una opción para la última pregunta.");
      return;
    }

    // 1. Calcular puntajes RIASEC
    const riasecScores = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
    questionContainers.forEach((container, index) => {
      const radioName = `q${index + 1}`;
      const selectedOption = container.querySelector(
        `input[name="${radioName}"]:checked`
      );
      if (selectedOption) {
        const value = selectedOption.value; // El valor es "R", "I", "A", etc.
        if (riasecScores.hasOwnProperty(value)) {
          riasecScores[value]++;
        }
      }
    });

    // 2. Determinar Perfil RIASEC (Top 3)
    const riasecArray = Object.entries(riasecScores); // [ ['R', 2], ['I', 5], ... ]
    riasecArray.sort((a, b) => b[1] - a[1]); // Ordenar de mayor a menor puntaje
    const riasecProfile = riasecArray
      .slice(0, 3)
      .map((item) => item[0])
      .join(""); // Ej: "SAI"
    const primaryRiasecCode = riasecProfile.charAt(0); // Ej: "S"

    // --- 3. GUARDAR EN BACKEND (¡Ruta y body actualizados!) ---
    const currentToken = localStorage.getItem("authToken");
    if (!currentToken) {
      alert("Debes iniciar sesión para guardar tus resultados.");
      return;
    }

    let saveSuccessful = false;
    try {
      console.log("Intentando guardar resultado RIASEC:", riasecProfile);
      const response = await fetch(API_SAVE_RESULTS_URL, {
        // Llama a /api/users/save-vocational-result
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentToken}`,
        },
        body: JSON.stringify({
          riasecProfile: riasecProfile, // <-- Envía el perfil RIASEC
          dateCompleted: new Date().toISOString(),
        }),
      });
      console.log(
        "Respuesta del servidor (guardar):",
        response.status,
        response.statusText
      );

      if (response.ok) {
        console.log("Resultado RIASEC guardado exitosamente.");
        localStorage.setItem("userRiasec", riasecProfile); // <-- Guarda RIASEC en localStorage
        saveSuccessful = true;
      } else {
        const errorText = await response.text();
        let errorMessage = `Error ${response.status}: Error al guardar resultado.`;
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (e) {
          errorMessage = errorText || errorMessage;
        }
        console.error("Error al guardar resultado:", errorMessage);
        alert(`Error al guardar el resultado del test: ${errorMessage}.`);
      }
    } catch (error) {
      console.error("Error de red al guardar:", error);
      alert("No se pudo conectar con el servidor para guardar el resultado.");
    }

    // --- 4. MOSTRAR RESULTADOS LOCALES ---
    console.log("Mostrando resultados para:", riasecProfile);
    const desc1 = riasecData[riasecProfile[0]] || "";
    const desc2 = riasecData[riasecProfile[1]] || "";
    const desc3 = riasecData[riasecProfile[2]] || "";

    if (riasecResultEl) riasecResultEl.textContent = riasecProfile;
    if (riasecDescriptionEl) {
      riasecDescriptionEl.innerHTML = `
            <p class="mb-2">Tu código principal es <strong>${riasecProfile[0]}</strong>: ${desc1}</p>
            <p class="text-sm text-gray-600 mb-1">Secundario <strong>${riasecProfile[1]}</strong>: ${desc2}</p>
            <p class="text-sm text-gray-600">Terciario <strong>${riasecProfile[2]}</strong>: ${desc3}</p>
        `;
    }

    // --- 5. Transición de vistas ---
    console.log("Ocultando formulario, mostrando resultados...");
    if (testForm) testForm.style.display = "none";
    const progressBarContainer = progressFill?.parentElement?.parentElement;
    if (progressBarContainer) progressBarContainer.classList.add("hidden");
    if (resultSection) resultSection.classList.remove("hidden");
    if (recommendationsSection)
      recommendationsSection.classList.remove("hidden");
    window.scrollTo({ top: testSection?.offsetTop || 0, behavior: "smooth" });
    console.log("Vistas cambiadas.");

    // --- 6. LLAMAR A FETCH RECOMENDACIONES (¡con RIASEC!) ---
    console.log("Llamando a fetchRecommendedCareers con:", primaryRiasecCode);
    fetchRecommendedCareers(primaryRiasecCode); // Llama con la letra principal
  }

  // --- FUNCIÓN: OBTENER RECOMENDACIONES ---
  async function fetchRecommendedCareers(riasecCode) {
    console.log("fetchRecommendedCareers iniciado para:", riasecCode);
    if (loadingSpinnerRec) loadingSpinnerRec.classList.remove("hidden");
    if (errorMessageRec) errorMessageRec.classList.add("hidden");
    if (noResultsMessageRec) noResultsMessageRec.classList.add("hidden");
    if (recommendedCareersContainer) recommendedCareersContainer.innerHTML = "";

    // --- URL ACTUALIZADA A RIASEC ---
    const url = `${API_CARRERAS_URL}?riasec=${riasecCode}`;
    console.log("URL para recomendaciones:", url);

    try {
      const response = await fetch(url);
      console.log(
        "Respuesta del servidor (recomendaciones):",
        response.status,
        response.statusText
      );
      if (!response.ok)
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      const carreras = await response.json();
      console.log("Carreras recibidas:", carreras.length);
      renderRecommendedCareers(carreras);
    } catch (error) {
      console.error("Error al obtener recomendaciones:", error);
      if (errorTextRec)
        errorTextRec.textContent = `No se pudieron cargar las recomendaciones. ${error.message}`;
      if (errorMessageRec) errorMessageRec.classList.remove("hidden");
    } finally {
      if (loadingSpinnerRec) loadingSpinnerRec.classList.add("hidden");
      console.log("fetchRecommendedCareers finalizado.");
    }
  }

  // --- FUNCIÓN: RENDERIZAR RECOMENDACIONES ---
  function renderRecommendedCareers(carreras) {
    console.log(
      "renderRecommendedCareers iniciado con",
      carreras.length,
      "carreras."
    );
    if (recommendedCareersContainer) recommendedCareersContainer.innerHTML = "";
    if (carreras.length === 0) {
      if (noResultsMessageRec) noResultsMessageRec.classList.remove("hidden");
      console.log("Mostrando mensaje 'sin resultados'.");
      return;
    }
    if (noResultsMessageRec) noResultsMessageRec.classList.add("hidden");
    carreras.forEach((carrera) => {
      const universidad = carrera.Universidad || {
        nombre: "N/A",
        sitio_web: "#",
      };
      const card = `
        <div class="card bg-white rounded-xl shadow-lg overflow-hidden flex flex-col hover:shadow-2xl transition-all duration-300 animate-fade-in">
            <div class="p-6"> <h3 class="text-xl font-bold text-impulso-dark mb-2">${
              carrera.nombre
            }</h3> <h4 class="text-md font-semibold text-impulso-green mb-3">${
        universidad.nombre
      }</h4> <p class="text-gray-600 text-sm mb-4 min-h-[60px]">${
        carrera.descripcion || "No hay descripción disponible."
      }</p> <div class="flex flex-wrap gap-2 mb-4 pt-4 border-t border-gray-100"> <span class="text-xs font-medium mr-2 px-2.5 py-1 rounded-full bg-impulso-light text-impulso-dark" title="Área de Estudio"> <i class="fas fa-shapes mr-1"></i> ${
        carrera.area_estudio
      } </span> <span class="text-xs font-medium mr-2 px-2.5 py-1 rounded-full bg-gray-100 text-gray-700" title="Tipo"> <i class="fas fa-graduation-cap mr-1"></i> ${
        carrera.tipo
      } </span> <span class="text-xs font-medium mr-2 px-2.5 py-1 rounded-full bg-gray-100 text-gray-700" title="Duración"> <i class="fas fa-clock mr-1"></i> ${
        carrera.duracion_anios || "?"
      } años </span> </div> </div>
            <div class="mt-auto bg-gray-50 p-4"> <a href="${
              universidad.sitio_web || "#"
            }" target="_blank" rel="noopener noreferrer" class="font-medium text-impulso-teal hover:text-impulso-dark transition-colors"> Visitar sitio web <i class="fas fa-external-link-alt ml-1 text-xs"></i> </a> </div>
        </div> `;
      if (recommendedCareersContainer)
        recommendedCareersContainer.innerHTML += card;
    });
    console.log("renderRecommendedCareers finalizado.");
  }

  // --- EVENT LISTENERS ---
  if (nextBtn) nextBtn.addEventListener("click", handleNextQuestion);
  if (submitBtn) submitBtn.addEventListener("click", calculateResult);

  // Navegación móvil
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener("click", () => {
      if (mobileMenu) mobileMenu.classList.toggle("hidden");
    });
  }

  // Listener de Scroll para Navbar
  window.addEventListener("scroll", function () {
    const navbar = document.getElementById("navbar");
    if (navbar) {
      if (window.scrollY > 50) {
        navbar.classList.add("shadow-2xl");
        navbar.classList.remove("shadow-lg");
      } else {
        navbar.classList.remove("shadow-2xl");
        navbar.classList.add("shadow-lg");
      }
    }
  });

  AOS.init(); // Inicializar AOS al final
}); // Fin DOMContentLoaded
