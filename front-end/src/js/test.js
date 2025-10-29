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
  const mbtiResultEl = document.getElementById("mbtiResult");
  const mbtiDescriptionEl = document.getElementById("mbtiDescription");

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
  // Asegúrate que este sea tu endpoint correcto para guardar
  const API_SAVE_RESULTS_URL = "http://localhost:3000/api/save-mbti-result";

  let currentQuestionIndex = 0;
  // Se adapta automáticamente a 16 o 32 preguntas
  const totalQuestions = questionContainers.length;

  // --- Datos de Descripciones (MBTI) ---
  const mbtiData = {
    /* ... Tu objeto mbtiData completo ... */
    ISTJ: {
      description:
        "El Logista. Práctico, orientado a los hechos, fiable y responsable...",
      careers: ["Contador", "Analista de Sistemas" /*...*/],
    },
    INFJ: {
      description:
        "El Consejero. Idealista, misterioso, tranquilo, pero inspirador...",
      careers: ["Psicólogo", "Escritor/Autor" /*...*/],
    },
    ENFP: {
      description:
        "El Activista. Entusiasta, creativo y sociable espíritu libre...",
      careers: ["Diseñador Gráfico", "Periodista" /*...*/],
    },
    ESTP: {
      description: "El Emprendedor. Inteligente, enérgico y perceptivo...",
      careers: ["Vendedor", "Bombero/Paramédico" /*...*/],
    },
    INTJ: {
      description:
        "El Arquitecto. Pensadores estratégicos con un plan para todo...",
      careers: ["Científico", "Estratega Corporativo" /*...*/],
    },
    ESFJ: {
      description: "El Cónsul. Extremadamente social, popular y protector...",
      careers: ["Maestro de Primaria", "Organizador de Eventos" /*...*/],
    },
    INTP: {
      description:
        "El Lógico. Innovadores con una sed insaciable de conocimiento...",
      careers: ["Físico/Matemático", "Desarrollador de IA" /*...*/],
    },
    ENTJ: {
      description:
        "El Comandante. Líderes audaces, imaginativos y de voluntad fuerte...",
      careers: ["CEO/Ejecutivo", "Gerente de Proyectos" /*...*/],
    },
    ISFP: {
      description: "El Aventurero. Artistas flexibles y encantadores...",
      careers: ["Diseñador de Moda", "Fisioterapeuta" /*...*/],
    },
    ESTJ: {
      description: "El Ejecutivo. Administradores excelentes...",
      careers: ["Militar", "Gerente de Logística" /*...*/],
    },
    ENFJ: {
      description: "El Protagonista. Líderes carismáticos e inspiradores...",
      careers: ["Orador Motivacional", "Líder Comunitario" /*...*/],
    },
    ISFJ: {
      description: "El Defensor. Protectores y cálidos...",
      careers: ["Bibliotecario", "Archivista" /*...*/],
    },
    ENTP: {
      description: "El Debatiente. Pensadores inteligentes y curiosos...",
      careers: ["Emprendedor (Startup)", "Consultor Estratégico" /*...*/],
    },
    INFP: {
      description: "El Mediador. Personas poéticas, amables y altruistas...",
      careers: ["Poeta/Escritor", "Musicoterapeuta" /*...*/],
    },
    ISTP: {
      description: "El Virtuoso. Experimentadores audaces y prácticos...",
      careers: ["Mecánico", "Piloto" /*...*/],
    },
    ESFP: {
      description: "El Animador. Espontáneos, enérgicos y entusiastas...",
      careers: ["Actor/Actriz", "Planificador de Fiestas" /*...*/],
    },
  };

  // --- LÓGICA DE AUTENTICACIÓN DEL NAVBAR (de nosotros.html) ---
  function updateUIForUser(userType) {
    if (authButtonsContainer) {
      authButtonsContainer.innerHTML = ""; // Limpiar botones existentes
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

    // --- Lógica específica para test.html ---
    if (userType !== "estudiante") {
      console.log("Usuario no estudiante intentando acceder al test.");
      if (testLink) testLink.classList.add("hidden");
      if (mobileTestLink) mobileTestLink.classList.add("hidden");
    } else {
      if (testLink) testLink.classList.remove("hidden");
      if (mobileTestLink) mobileTestLink.classList.remove("hidden");
    }
    // --- Fin lógica específica ---

    // --- Configuración de links de perfil y botones de logout ---
    const logoutButton = document.getElementById("logout-button");
    const mobileLogoutButton = document.getElementById("mobile-logout-button");
    const profileLink = document.getElementById("profile-link");
    const mobileProfileLink = document.getElementById("mobile-profile-link");

    const user = JSON.parse(localStorage.getItem("user"));

    if (profileLink && user) {
      let profilePage = "perfil.html";
      if (user.type === "universidad") {
        profilePage = "dashboard-universidad.html";
      }
      profileLink.href = profilePage;
      if (mobileProfileLink) mobileProfileLink.href = profilePage;
    }

    const logoutFn = () => {
      localStorage.removeItem("authToken");
      localStorage.removeItem("userType");
      localStorage.removeItem("user");
      localStorage.removeItem("userMbti"); // Borrar MBTI al cerrar sesión
      window.location.href = "index.html";
    };

    if (logoutButton) logoutButton.addEventListener("click", logoutFn);
    if (mobileLogoutButton)
      mobileLogoutButton.addEventListener("click", logoutFn);
  }

  // --- VERIFICACIÓN INICIAL DE LOGIN Y TIPO DE USUARIO ---
  const token = localStorage.getItem("authToken");
  const userType = localStorage.getItem("userType");

  if (token) {
    updateUIForUser(userType);
    if (userType === "estudiante") {
      loginSection.classList.add("hidden");
      testSection.classList.remove("hidden");
      showCurrentQuestion();
    } else {
      loginSection.classList.remove("hidden");
      testSection.classList.add("hidden");
      const loginMessage = loginSection.querySelector(".p-8 p.text-gray-600");
      if (loginMessage)
        loginMessage.textContent =
          "El test de personalidad está disponible solo para estudiantes.";
      const loginBtn = loginSection.querySelector('a[href="login.html"]');
      const registerLink = loginSection.querySelector(
        'a[href="registro.html"]'
      );
      if (loginBtn) loginBtn.classList.add("hidden");
      if (registerLink && registerLink.parentElement)
        registerLink.parentElement.classList.add("hidden");
    }
  } else {
    loginSection.classList.remove("hidden");
    testSection.classList.add("hidden");
    if (testLink) testLink.classList.add("hidden");
    if (mobileTestLink) mobileTestLink.classList.add("hidden");
  }

  // --- LÓGICA DEL TEST ---
  function updateProgress() {
    const progress = currentQuestionIndex + 1;
    progressText.textContent = `${progress} / ${totalQuestions}`;
    const percentage = (progress / totalQuestions) * 100;
    progressFill.style.width = `${percentage}%`;
  }

  function showCurrentQuestion() {
    questionContainers.forEach((container, index) => {
      container.classList.toggle("active", index === currentQuestionIndex);
    });
    updateProgress();
    nextBtn.classList.toggle(
      "hidden",
      currentQuestionIndex === totalQuestions - 1
    );
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

  // --- FUNCIÓN calculateResult ---
  async function calculateResult() {
    if (!isCurrentQuestionAnswered()) {
      alert("Por favor, selecciona una opción para la última pregunta.");
      return;
    }

    const mbtiScores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
    questionContainers.forEach((container, index) => {
      const radioName = `q${index + 1}`;
      const selectedOption = container.querySelector(
        `input[name="${radioName}"]:checked`
      );
      if (selectedOption) {
        const value = selectedOption.value;
        if (mbtiScores.hasOwnProperty(value)) {
          mbtiScores[value]++;
        }
      }
    });

    let mbtiType = "";
    mbtiType += mbtiScores["E"] >= mbtiScores["I"] ? "E" : "I";
    mbtiType += mbtiScores["S"] >= mbtiScores["N"] ? "S" : "N";
    mbtiType += mbtiScores["T"] >= mbtiScores["F"] ? "T" : "F";
    mbtiType += mbtiScores["J"] >= mbtiScores["P"] ? "J" : "P";
    mbtiType = mbtiType.toUpperCase();

    // --- GUARDAR EN BACKEND ---
    const currentToken = localStorage.getItem("authToken");
    if (!currentToken) {
      alert("Debes iniciar sesión para guardar tus resultados.");
      return;
    }

    let saveSuccessful = false;
    try {
      console.log("Intentando guardar resultado MBTI:", mbtiType); // Log antes de fetch
      const response = await fetch(API_SAVE_RESULTS_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentToken}`,
        },
        body: JSON.stringify({
          mbtiResult: mbtiType,
          dateCompleted: new Date().toISOString(),
        }),
      });
      console.log(
        "Respuesta del servidor (guardar):",
        response.status,
        response.statusText
      ); // Log después de fetch

      if (response.ok) {
        console.log("Resultado MBTI guardado exitosamente.");
        localStorage.setItem("userMbti", mbtiType);
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

    // --- MOSTRAR RESULTADOS LOCALES ---
    console.log("Mostrando resultados para:", mbtiType); // Log antes de mostrar
    const mbtiDescData = mbtiData[mbtiType] || {
      description: "Descripción no disponible.",
    };
    mbtiResultEl.textContent = mbtiType;
    mbtiDescriptionEl.textContent = mbtiDescData.description;

    // --- Transición de vistas ---
    console.log("Ocultando formulario, mostrando resultados..."); // Log antes de cambiar vistas
    testForm.style.display = "none";
    // Ocultar barra de progreso
    progressFill.parentElement.parentElement.classList.add("hidden"); // <<<--- POSIBLE PUNTO DE FALLO (TypeError)
    resultSection.classList.remove("hidden"); // <<<--- POSIBLE PUNTO DE FALLO (TypeError)
    recommendationsSection.classList.remove("hidden"); // <<<--- POSIBLE PUNTO DE FALLO (TypeError)
    window.scrollTo({ top: testSection.offsetTop, behavior: "smooth" });
    console.log("Vistas cambiadas."); // Log después de cambiar vistas

    // --- LLAMAR A FETCH RECOMENDACIONES ---
    console.log("Llamando a fetchRecommendedCareers con:", mbtiType); // Log antes de fetch rec
    fetchRecommendedCareers(mbtiType);
  }

  // --- FUNCIÓN: OBTENER RECOMENDACIONES ---
  async function fetchRecommendedCareers(mbtiType) {
    console.log("fetchRecommendedCareers iniciado para:", mbtiType); // Log inicio fetch rec
    loadingSpinnerRec.classList.remove("hidden");
    errorMessageRec.classList.add("hidden");
    noResultsMessageRec.classList.add("hidden");
    recommendedCareersContainer.innerHTML = "";
    const url = `${API_CARRERAS_URL}?mbti=${mbtiType}`;
    console.log("URL para recomendaciones:", url); // Log URL

    try {
      const response = await fetch(url);
      console.log(
        "Respuesta del servidor (recomendaciones):",
        response.status,
        response.statusText
      ); // Log resp rec
      if (!response.ok)
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      const carreras = await response.json();
      console.log("Carreras recibidas:", carreras.length); // Log carreras recibidas
      renderRecommendedCareers(carreras);
    } catch (error) {
      console.error("Error al obtener recomendaciones:", error);
      errorTextRec.textContent = `No se pudieron cargar las recomendaciones. ${error.message}`;
      errorMessageRec.classList.remove("hidden");
    } finally {
      loadingSpinnerRec.classList.add("hidden");
      console.log("fetchRecommendedCareers finalizado."); // Log fin fetch rec
    }
  }

  // --- FUNCIÓN: RENDERIZAR RECOMENDACIONES ---
  function renderRecommendedCareers(carreras) {
    console.log(
      "renderRecommendedCareers iniciado con",
      carreras.length,
      "carreras."
    ); // Log inicio render
    recommendedCareersContainer.innerHTML = "";
    if (carreras.length === 0) {
      noResultsMessageRec.classList.remove("hidden");
      console.log("Mostrando mensaje 'sin resultados'."); // Log sin resultados
      return;
    }
    noResultsMessageRec.classList.add("hidden");
    carreras.forEach((carrera, index) => {
      // Añadido index para log
      // console.log("Renderizando tarjeta para:", carrera.nombre); // Log por cada tarjeta (puede ser mucho)
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
      recommendedCareersContainer.innerHTML += card;
    });
    console.log("renderRecommendedCareers finalizado."); // Log fin render
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
