// Inicializa AOS (Animate On Scroll)
AOS.init();
// **Este código es un ejemplo para tu lógica de login/autenticación**

// --- Variables y Selectores ---
const mobileMenuBtn = document.getElementById("mobile-menu-btn");
const mobileMenu = document.getElementById("mobile-menu");
const testForm = document.getElementById("testForm");
const questionContainers = document.querySelectorAll(".question-container");
const progressText = document.getElementById("progressText");
const progressFill = document.getElementById("progressFill");
const loginSection = document.getElementById("loginSection");
const testSection = document.getElementById("testSection");

// Botones de navegación
const nextBtn = document.getElementById("next-btn");
const submitBtn = document.getElementById("submit-btn");

// Elementos de resultados
const resultSection = document.getElementById("resultSection");
const mbtiResult = document.getElementById("mbtiResult");
const mbtiDescription = document.getElementById("mbtiDescription");
const careerList = document.getElementById("careerList");

let currentQuestionIndex = 0;
const totalQuestions = questionContainers.length;
// Simulación de autenticación (Cámbialo a 'true' si el usuario ha iniciado sesión)
const isAuthenticated = true;

// --- 1. Datos de Resultados (MBTI) ---
// Define los datos de personalidad para cargar en la sección de resultados
const mbtiData = {
  ISTJ: {
    description:
      "El Logista. Práctico, orientado a los hechos, fiable y responsable. Se enfoca en la tradición y las reglas.",
    careers: [
      "Contador",
      "Analista de Sistemas",
      "Ingeniero Civil",
      "Abogado",
      "Administrador de Bases de Datos",
    ],
  },
  INFJ: {
    description:
      "El Consejero. Idealista, misterioso, tranquilo, pero inspirador. Les mueve un profundo sentido del propósito.",
    careers: [
      "Psicólogo",
      "Escritor/Autor",
      "Trabajador Social",
      "Profesor Universitario (Humanidades)",
      "Terapeuta",
    ],
  },
  ENFP: {
    description:
      "El Activista. Entusiasta, creativo y sociable espíritu libre. Le gusta explorar conexiones y posibilidades.",
    careers: [
      "Diseñador Gráfico",
      "Periodista",
      "Consultor de Marketing",
      "Coach de Vida",
      "Artista",
    ],
  },
  ESTP: {
    description:
      "El Emprendedor. Inteligente, enérgico y perceptivo. Disfruta de la acción y el drama.",
    careers: [
      "Vendedor",
      "Bombero/Paramédico",
      "Agente Inmobiliario",
      "Entrenador Deportivo",
      "Inversor",
    ],
  },
  // Añade el resto de los 12 tipos MBTI restantes (ej: INTJ, ESFJ, INTP, etc.)
  INTJ: {
    description:
      "El Arquitecto. Pensadores estratégicos con un plan para todo. Independientes y lógicos.",
    careers: [
      "Científico",
      "Estratega Corporativo",
      "Ingeniero de Software",
      "Juez",
      "Analista Financiero",
    ],
  },
  ESFJ: {
    description:
      "El Cónsul. Extremadamente social, popular y protector. Le encanta ser el pilar de sus comunidades.",
    careers: [
      "Maestro de Primaria",
      "Organizador de Eventos",
      "Profesional de RR.HH.",
      "Enfermero",
      "Gerente de Oficina",
    ],
  },
  INTP: {
    description:
      "El Lógico. Innovadores con una sed insaciable de conocimiento. Buscan entender los principios subyacentes.",
    careers: [
      "Físico/Matemático",
      "Desarrollador de IA",
      "Filósofo",
      "Investigador",
      "Profesor de Ciencias",
    ],
  },
  ENTJ: {
    description:
      "El Comandante. Líderes audaces, imaginativos y de voluntad fuerte. Siempre buscan una manera, o la crean.",
    careers: [
      "CEO/Ejecutivo",
      "Gerente de Proyectos",
      "Abogado Corporativo",
      "Político",
      "Director de Ventas",
    ],
  },
  ISFP: {
    description:
      "El Aventurero. Artistas flexibles y encantadores, siempre listos para explorar y experimentar.",
    careers: [
      "Diseñador de Moda",
      "Fisioterapeuta",
      "Veterinario",
      "Chef/Cocinero",
      "Jardinero/Paisajista",
    ],
  },
  ESTJ: {
    description:
      "El Ejecutivo. Administradores excelentes, insuperables en la gestión de cosas o personas.",
    careers: [
      "Militar",
      "Gerente de Logística",
      "Inspector",
      "Oficial de Policía",
      "Director de Escuela",
    ],
  },
  ENFJ: {
    description:
      "El Protagonista. Líderes carismáticos e inspiradores, capaces de cautivar a sus oyentes.",
    careers: [
      "Orador Motivacional",
      "Líder Comunitario",
      "Relaciones Públicas",
      "Coach Ejecutivo",
      "Pastor/Ministro",
    ],
  },
  ISFJ: {
    description:
      "El Defensor. Protectores y cálidos, siempre dispuestos a defender a sus seres queridos. Muy detallistas.",
    careers: [
      "Bibliotecario",
      "Archivista",
      "Asistente Médico",
      "Asistente Administrativo",
      "Conservador de Museo",
    ],
  },
  ENTP: {
    description:
      "El Debatiente. Pensadores inteligentes y curiosos que no pueden resistirse a un desafío intelectual.",
    careers: [
      "Emprendedor (Startup)",
      "Consultor Estratégico",
      "Ingeniero de I+D",
      "Crítico de Cine/Arte",
      "Profesor de Debate",
    ],
  },
  INFP: {
    description:
      "El Mediador. Personas poéticas, amables y altruistas, siempre dispuestas a ayudar una buena causa.",
    careers: [
      "Poeta/Escritor",
      "Musicoterapeuta",
      "Ilustrador",
      "Asesor Vocacional",
      "Conservacionista",
    ],
  },
  ISTP: {
    description:
      "El Virtuoso. Experimentadores audaces y prácticos, maestros en el uso de herramientas.",
    careers: [
      "Mecánico",
      "Piloto",
      "Técnico Electrónico",
      "Artesano",
      "Ingeniero Mecánico",
    ],
  },
  InFp: {
    description:
      "El Aventurero. Artistas flexibles y encantadores, siempre listos para explorar y experimentar.",
    careers: [
      "Diseñador de Moda",
      "Fisioterapeuta",
      "Veterinario",
      "Chef/Cocinero",
      "Jardinero/Paisajista",
    ],
  },
};

// --- 2. Funciones del Test ---

/** Muestra la sección correcta (Login/Test) */
function showSection() {
  if (isAuthenticated) {
    loginSection.classList.add("hidden");
    testSection.classList.remove("hidden");
    showCurrentQuestion();
  } else {
    loginSection.classList.remove("hidden");
    testSection.classList.add("hidden");
  }
}

/** Actualiza el texto y la barra de progreso */
function updateProgress() {
  const progress = currentQuestionIndex + 1;
  progressText.textContent = `${progress} / ${totalQuestions}`;
  const percentage = (progress / totalQuestions) * 100;
  progressFill.style.width = `${percentage}%`;
}

/** Muestra la pregunta actual y actualiza los botones */
function showCurrentQuestion() {
  questionContainers.forEach((container, index) => {
    container.classList.remove("active");
  });

  if (currentQuestionIndex < totalQuestions) {
    questionContainers[currentQuestionIndex].classList.add("active");
    updateProgress();

    // Lógica de los botones Siguiente/Finalizar
    if (currentQuestionIndex === totalQuestions - 1) {
      nextBtn.classList.add("hidden");
      submitBtn.classList.remove("hidden");
    } else {
      nextBtn.classList.remove("hidden");
      submitBtn.classList.add("hidden");
    }
  }
}

/** Valida que la pregunta actual esté respondida */
function isCurrentQuestionAnswered() {
  const questionNumber = currentQuestionIndex + 1;
  return (
    document.querySelector(`input[name="q${questionNumber}"]:checked`) !== null
  );
}

/** Procesa la respuesta para avanzar a la siguiente pregunta */
function handleNextQuestion() {
  if (isCurrentQuestionAnswered()) {
    // Usa setTimeout para dar tiempo a la animación (si la hubiera)
    setTimeout(() => {
      currentQuestionIndex++;
      showCurrentQuestion();
    }, 100);
  } else {
    // Alerta si el usuario intenta avanzar sin responder
    alert("Por favor, selecciona una opción para continuar.");
  }
}
/** Calcula el resultado MBTI y lo envía al servidor */
async function calculateResult() {
  // 1. Validar la última pregunta (Mantenemos la validación)
  if (!isCurrentQuestionAnswered()) {
    alert("Por favor, selecciona una opción para continuar.");
    return;
  }

  const results = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };

  // 2. Contar los resultados (Mantenemos el conteo)
  for (let i = 1; i <= totalQuestions; i++) {
    const selectedOption = document.querySelector(
      `input[name="q${i}"]:checked`
    );
    if (selectedOption) {
      results[selectedOption.value]++;
    }
  }

  // 3. Determinar el Tipo Final (MBTI)
  let finalType = "";
  finalType += results["E"] >= results["I"] ? "E" : "I";
  finalType += results["S"] >= results["N"] ? "S" : "N"; // Corregido: E/I, S/N, T/F, J/P es el orden canónico.
  finalType += results["T"] >= results["F"] ? "T" : "F";
  finalType += results["J"] >= results["P"] ? "J" : "P";
  const mbtiType = finalType.toUpperCase();

  // =========================================================
  // 4. LÓGICA DE AUTENTICACIÓN Y ENVÍO AL BACKEND
  // =========================================================

  // 4.1 Obtener el Token (AJUSTAR: usa la clave real donde lo guardas, ej: 'authToken')
  const token = localStorage.getItem("authToken");

  if (!token) {
    alert(
      "Debes iniciar sesión para guardar tus resultados (Token no encontrado)."
    );
    console.error("TOKEN NO ENCONTRADO EN LOCAL STORAGE.");
    // Opcional: Redirigir al login si no hay token
    // window.location.href = '/login.html';
    return;
  }

  try {
    const response = await fetch("http://localhost:3000/api/save-mbti-result", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // 🔑 CLAVE: Incluir el token en el formato 'Bearer <token>'
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        mbtiResult: mbtiType,
        dateCompleted: new Date().toISOString(),
      }),
    });

    // 4.2 Manejar la respuesta del servidor
    if (response.ok) {
      console.log("Resultado MBTI guardado exitosamente en el back-end.");
    } else if (response.status === 401 || response.status === 403) {
      // Manejo específico del 401/403 (No autorizado/Prohibido)
      alert(
        "Acceso denegado. Tu sesión ha expirado o no tienes permisos para guardar."
      );
      // Opcional: Redirigir al login
      // window.location.href = '/login.html';
      return;
    } else {
      // Manejo de otros errores (400, 500, etc.)
      const errorText = await response.text();
      let errorMessage = `Error ${response.status}: El servidor respondió con un error.`;

      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (e) {
        // Si la respuesta no es JSON válido (ej. HTML o texto plano)
        errorMessage = errorText || errorMessage;
      }

      console.error("Error al guardar el resultado:", errorMessage);
      alert(`Error al guardar el resultado del test: ${errorMessage}.`);
      return;
    }
  } catch (error) {
    console.error("Error de red o de fetch:", error);
    alert(
      "No se pudo conectar con el servidor para guardar el resultado (Error de red)."
    );
    return;
  }

  // =========================================================
  // 5. Mostrar los resultados (visualización)
  // =========================================================
  const data = mbtiData[mbtiType] || mbtiData["INTJ"]; // Fallback

  mbtiResult.textContent = mbtiType;
  mbtiDescription.textContent = data.description;

  careerList.innerHTML = "";
  data.careers.forEach((career) => {
    const li = document.createElement("li");
    li.textContent = career;
    careerList.appendChild(li);
  });

  // 6. Transición de vistas
  testForm.classList.add("hidden");
  resultSection.classList.remove("hidden");
  window.scrollTo({ top: testSection.offsetTop, behavior: "smooth" });
}
// --- 3. Event Listeners ---

// Navegación principal
document.addEventListener("DOMContentLoaded", showSection);
nextBtn.addEventListener("click", handleNextQuestion);
submitBtn.addEventListener("click", calculateResult);

// Navegación móvil
mobileMenuBtn.addEventListener("click", () => {
  mobileMenu.classList.toggle("hidden");
  const icon = mobileMenuBtn.querySelector("i");
  icon.classList.toggle("fa-bars");
  icon.classList.toggle("fa-times");
});

// Avance automático al seleccionar una opción (solo para UX, se mantiene el botón como avance principal)
// testForm.addEventListener('change', (event) => {
//     if (event.target.type === 'radio' && isCurrentQuestionAnswered() && currentQuestionIndex < totalQuestions - 1) {
//          handleNextQuestion();
//     }
// });
