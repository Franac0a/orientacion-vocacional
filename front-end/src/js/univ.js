
      AOS.init({ duration: 1000, once: true });

      document
        .getElementById("mobile-menu-btn")
        .addEventListener("click", function () {
          const menu = document.getElementById("mobile-menu");
          menu.classList.toggle("hidden");
        });

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

      document.addEventListener("DOMContentLoaded", () => {
        const authButtonsContainer = document.getElementById("auth-buttons");
        const mobileAuthButtonsContainer = document.getElementById(
          "mobile-auth-buttons"
        );
        const testLink = document.getElementById("test-link");
        const mobileTestLink = document.getElementById("mobile-test-link");

        function updateUIForUser(userType) {
          if (authButtonsContainer) {
            authButtonsContainer.innerHTML = `
                        <div class="relative group">
                            <button class="px-4 py-2 text-impulso-teal border border-impulso-teal rounded-lg hover:bg-impulso-teal hover:text-white transition-all duration-300">
                                <i class="fas fa-user-circle mr-2"></i> Mi Perfil
                            </button>
                            <div class="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg hidden group-hover:block">
                                <a href="#" class="block px-4 py-2 text-gray-800 hover:bg-gray-100" id="profile-link">Perfil</a>
                                <button id="logout-button" class="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100">Cerrar Sesión</button>
                            </div>
                        </div>
                    `;
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
          } else {
            if (testLink) testLink.classList.remove("hidden");
            if (mobileTestLink) mobileTestLink.classList.remove("hidden");
          }
          const logoutButton = document.getElementById("logout-button");
          const mobileLogoutButton = document.getElementById(
            "mobile-logout-button"
          );
          if (logoutButton)
            logoutButton.addEventListener("click", () => {
              localStorage.removeItem("authToken");
              localStorage.removeItem("userType");
              window.location.href = "index.html";
            });
          if (mobileLogoutButton)
            mobileLogoutButton.addEventListener("click", () => {
              localStorage.removeItem("authToken");
              localStorage.removeItem("userType");
              window.location.href = "index.html";
            });
        }

        const token = localStorage.getItem("authToken");
        const userType = localStorage.getItem("userType");
        if (token) updateUIForUser(userType);
        else {
          if (testLink) testLink.classList.add("hidden");
          if (mobileTestLink) mobileTestLink.classList.add("hidden");
        }

        const universities = [
          {
            id: 1,
            name: "Universidad Nacional de Formosa",
            location: "Formosa, Formosa",
            description:
              "UNaF, Universidad Nacional de Formosa, ofrece 36 títulos oficiales para estudiar en Argentina. líder en investigación científica y desarrollo tecnológico.",
            image: "src/img/unaf.jpg",
            link: "univ-unaf.html",

            isUniversity: true,
          },
          {
            id: 2,
            name: "Instituto Politécnico Formosa",
            location: "Formosa, Formosa",
            description:
              "Ofrece tecnicaturas superiores especializadas en áreas de alta tecnología y con salida laboral, como mecatrónica y desarrollo de software",
            image: "src/img/ipf.jpg",
            link: "univ-ipf.html",
            isUniversity: false,
          },
          {
            id: 3,
            name: "Universidad de la Cuenca del Plata",
            location: "Formosa, Argentina",
            description:
              "Una universidad privada con una amplia oferta académica en el Nordeste Argentino, que incluye carreras en áreas de ciencias sociales, salud, ingeniería y derecho.",
            image: "src/img/cuenca.jpg",
            link: "univ-cuenca.html",
            isUniversity: true,
          },
          {
            id: 4,
            name: "Universidad Tecnológica Nacional",
            location: "Formosa, Formosa",
            description:
              "La UTN es la única universidad en Argentina con un enfoque prioritario en la ingeniería. Su sede regional en Formosa ofrece tecnicaturas y licenciaturas con alta salida laboral, contribuyendo al desarrollo tecnológico local",
            image: "src/img/logo-utn.jpg",
            link: "univ-utn.html",

            isUniversity: true,
          },
          {
            id: 5,
            name: "Instituto Superior Macedo Martínez",
            location: "Formosa, Argentina",
            description:
              "Institución pionera en la educación terciaria privada en Formosa, con una fuerte oferta en carreras técnicas como Analista de Sistemas de Información y profesorados.",
            image: "src/img/macedo.jpg",
            link: "univ-macedo.html",
            isUniversity: false,
          },
        ];

        const careers = [
          {
            id: 1,
            universityId: 1,
            name: "Licenciatura en Psicopedagogía",
            type: "Ciencias Sociales",
            duration: "4 años",
            subjects: [
              "Neuropsicología",
              "Diagnóstico Psicopedagógico",
              "Inclusión Educativa",
            ],
            contact: "psicopedagogia@unaf.edu.ar",
            hasScholarship: true,
            isUniversity: true,
          },
          {
            id: 2,
            universityId: 1,
            name: "Ingeniería Forestal",
            type: "Ingeniería",
            duration: "5 años",
            subjects: [
              "Silvicultura",
              "Manejo de Bosques",
              "Recursos Naturales",
            ],
            contact: "forestal@unaf.edu.ar",
            hasScholarship: false,
            isUniversity: true,
          },
          {
            id: 3,
            universityId: 2,
            name: "Tecnicatura Superior en Desarrollo de Software",
            type: "Tecnológicas",
            duration: "3 años",
            subjects: [
              "Programación I y II",
              "Bases de Datos",
              "Metodologías Ágiles",
            ],
            contact: "info@ipf.edu.ar",
            hasScholarship: true,
            isUniversity: false,
          },
          {
            id: 4,
            universityId: 3,
            name: "Licenciatura en Medicina",
            type: "Medicina y Biología",
            duration: "6 años",
            subjects: ["Anatomía", "Fisiología", "Farmacología"],
            contact: "medicina@ucp.edu.ar",
            hasScholarship: false,
            isUniversity: true,
          },
          {
            id: 5,
            universityId: 4,
            name: "Ingeniería Química",
            type: "Ingeniería",
            duration: "5 años",
            subjects: [
              "Termodinámica",
              "Balance de Materia y Energía",
              "Operaciones Unitarias",
            ],
            contact: "quimica@utn.edu.ar",
            hasScholarship: true,
            isUniversity: true,
          },
          {
            id: 6,
            universityId: 5,
            name: "Profesorado en Educación Secundaria en Matemática",
            type: "Ciencias Exactas",
            duration: "4 años",
            subjects: ["Álgebra", "Geometría", "Didáctica de la Matemática"],
            contact: "matematica@macedo.edu.ar",
            hasScholarship: true,
            isUniversity: false,
          },
          {
            id: 7,
            universityId: 5,
            name: "Tecnicatura Superior en Contabilidad",
            type: "Ciencias Sociales",
            duration: "3 años",
            subjects: [
              "Contabilidad General",
              "Derecho Comercial",
              "Tributación",
            ],
            contact: "contabilidad@macedo.edu.ar",
            hasScholarship: false,
            isUniversity: false,
          },
          {
            id: 8,
            universityId: 6,
            name: "Tecnicatura Superior en Gestión y Administración Pública",
            type: "Ciencias Sociales",
            duration: "3 años",
            subjects: [
              "Derecho Administrativo",
              "Gestión de Recursos Humanos",
              "Políticas Públicas",
            ],
            contact: "info@iest.edu.ar",
            hasScholarship: true,
            isUniversity: false,
          },
          {
            id: 9,
            universityId: 7,
            name: "Profesorado en Educación Primaria",
            type: "Ciencias Sociales",
            duration: "4 años",
            subjects: [
              "Pedagogía",
              "Práctica Docente",
              "Psicología del Desarrollo",
            ],
            contact: "info@pedagogico.edu.ar",
            hasScholarship: false,
            isUniversity: false,
          },
          {
            id: 10,
            universityId: 1,
            name: "Licenciatura en Enfermería",
            type: "Medicina y Biología",
            duration: "5 años",
            subjects: [
              "Salud Pública",
              "Farmacología",
              "Enfermería Comunitaria",
            ],
            contact: "enfermeria@unaf.edu.ar",
            hasScholarship: true,
            isUniversity: true,
          },
        ];

        let currentView = "universities";
        let searchTerm = "";
        let selectedCategory = "todas";
        let selectedType = "todas";

        const universitiesContainer = document.getElementById(
          "universitiesContainer"
        );
        const careersContainer = document.getElementById("careersContainer");
        const universitiesView = document.getElementById("universities-view");
        const careersView = document.getElementById("careers-view");
        const searchUniInput = document.getElementById("searchUniInput");
        const searchCareerInput = document.getElementById("searchCareerInput");
        const categoryFilters = document.getElementById("categoryFilters");
        const institutionTypeFilters = document.getElementById(
          "institutionTypeFilters"
        );

        function renderUniversities() {
          universitiesContainer.innerHTML = "";
          const filtered = universities.filter(
            (uni) =>
              uni.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              uni.location.toLowerCase().includes(searchTerm.toLowerCase())
          );
          if (filtered.length === 0) {
            universitiesContainer.innerHTML = `
                        <div class="col-span-full text-center py-12" data-aos="fade-up">
                            <div class="text-gray-500 text-lg">
                                <i class="fas fa-exclamation-triangle text-impulso-gold mb-2"></i>
                                <p>No se encontraron universidades que coincidan con los criterios de búsqueda.</p>
                            </div>
                        </div>
                    `;
            return;
          }
          filtered.forEach((uni) => {
            const card = document.createElement("div");
            card.className =
              "bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden card flex flex-col";
            card.innerHTML = `
                        <img src="${uni.image}" alt="Logo de ${uni.name}" class="university-logo">
                        <div class="p-6 flex flex-col flex-grow">
                            <h4 class="text-2xl font-bold text-impulso-dark mb-2">${uni.name}</h4>
                            <p class="text-sm text-gray-500 mb-4"><i class="fas fa-map-marker-alt text-impulso-teal mr-2"></i>${uni.location}</p>
                            <p class="text-gray-600 flex-grow">${uni.description}</p>
                            <a href="${uni.link}" class="mt-4 inline-block text-impulso-teal hover:text-impulso-green transition-colors font-medium">Más información <i class="fas fa-arrow-right ml-1 text-xs"></i></a>
                        </div>
                    `;
            universitiesContainer.appendChild(card);
          });
        }

        function renderCareers() {
          careersContainer.innerHTML = "";
          const filtered = careers.filter((career) => {
            const university = universities.find(
              (uni) => uni.id === career.universityId
            );
            if (!university) return false;
            const matchesCategory =
              selectedCategory === "todas" || career.type === selectedCategory;
            const matchesType =
              selectedType === "todas" ||
              (selectedType === "universitarias" && career.isUniversity) ||
              (selectedType === "no-universitarias" && !career.isUniversity);
            const matchesSearch =
              career.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              university.name
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
              career.type.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesCategory && matchesType && matchesSearch;
          });
          if (filtered.length === 0) {
            careersContainer.innerHTML = `
                        <div class="col-span-full text-center py-12" data-aos="fade-up">
                            <div class="text-gray-500 text-lg">
                                <i class="fas fa-exclamation-triangle text-impulso-gold mb-2"></i>
                                <p>No se encontraron carreras que coincidan con los criterios de búsqueda.</p>
                            </div>
                        </div>
                    `;
            return;
          }
          filtered.forEach((career) => {
            const university = universities.find(
              (uni) => uni.id === career.universityId
            );
            const card = document.createElement("div");
            card.className =
              "bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden card flex flex-col";
            card.innerHTML = `
                        <img src="${university.image}" alt="Logo de ${
              university.name
            }" class="university-logo">
                        <div class="p-6 flex flex-col flex-grow">
                            <h4 class="text-2xl font-bold text-impulso-dark mb-2">${
                              career.name
                            }</h4>
                            <p class="text-sm text-gray-500 mb-2"><i class="fas fa-university text-impulso-teal mr-2"></i>${
                              university.name
                            }</p>
                            <p class="text-sm text-gray-500 mb-2"><i class="fas fa-map-marker-alt text-impulso-teal mr-2"></i>${
                              university.location
                            }</p>
                            <div class="flex-grow">
                                <p class="text-gray-600 mb-1"><strong class="font-semibold text-impulso-dark">Área:</strong> ${
                                  career.type
                                }</p>
                                <p class="text-gray-600 mb-1"><strong class="font-semibold text-impulso-dark">Duración:</strong> ${
                                  career.duration
                                }</p>
                                <p class="text-gray-600 mb-1"><strong class="font-semibold text-impulso-dark">Beca:</strong> ${
                                  career.hasScholarship ? "Sí" : "No"
                                }</p>
                                <p class="text-gray-600 mb-1"><strong class="font-semibold text-impulso-dark">Contacto:</strong> <a href="mailto:${
                                  career.contact
                                }" class="text-blue-500 hover:underline">${
              career.contact
            }</a></p>
                                <div class="mt-3">
                                    <strong class="font-semibold text-impulso-dark">Materias clave:</strong>
                                    <ul class="list-disc list-inside text-gray-600 ml-4">
                                        ${career.subjects
                                          .map(
                                            (subject) => `<li>${subject}</li>`
                                          )
                                          .join("")}
                                    </ul>
                                </div>
                            </div>
                            <a href="#" class="mt-4 inline-block text-impulso-teal hover:text-impulso-green transition-colors font-medium">Más información <i class="fas fa-arrow-right ml-1 text-xs"></i></a>
                        </div>
                    `;
            careersContainer.appendChild(card);
          });
        }

        function switchView(view) {
          currentView = view;
          if (view === "universities") {
            universitiesView.classList.remove("hidden");
            careersView.classList.add("hidden");
            searchUniInput.value = "";
            searchTerm = "";
            renderUniversities();
          } else {
            universitiesView.classList.add("hidden");
            careersView.classList.remove("hidden");
            searchCareerInput.value = "";
            searchTerm = "";
            renderCareers();
          }
        }

        document
          .getElementById("universities-tab-btn")
          .addEventListener("click", () => {
            document
              .querySelectorAll(".tab-btn")
              .forEach((btn) => btn.classList.remove("active-btn"));
            document
              .getElementById("universities-tab-btn")
              .classList.add("active-btn");
            switchView("universities");
          });

        document
          .getElementById("careers-tab-btn")
          .addEventListener("click", () => {
            document
              .querySelectorAll(".tab-btn")
              .forEach((btn) => btn.classList.remove("active-btn"));
            document
              .getElementById("careers-tab-btn")
              .classList.add("active-btn");
            switchView("careers");
          });

        searchUniInput.addEventListener("input", (e) => {
          searchTerm = e.target.value;
          renderUniversities();
        });

        searchCareerInput.addEventListener("input", (e) => {
          searchTerm = e.target.value;
          renderCareers();
        });

        categoryFilters.addEventListener("click", (e) => {
          const button = e.target.closest("button");
          if (!button) return;
          document
            .querySelectorAll("#categoryFilters .filter-btn")
            .forEach((btn) => {
              btn.classList.remove("active-btn");
              btn.querySelector(".filter-icon").classList.remove("text-white");
              btn
                .querySelector(".filter-icon")
                .classList.add("text-impulso-dark");
            });
          button.classList.add("active-btn");
          button.querySelector(".filter-icon").classList.add("text-white");
          button
            .querySelector(".filter-icon")
            .classList.remove("text-impulso-dark");
          selectedCategory = button.dataset.category;
          renderCareers();
        });

        institutionTypeFilters.addEventListener("click", (e) => {
          const button = e.target.closest("button");
          if (!button) return;
          document
            .querySelectorAll("#institutionTypeFilters .filter-btn")
            .forEach((btn) => btn.classList.remove("active-btn"));
          button.classList.add("active-btn");
          selectedType = button.dataset.type;
          renderCareers();
        });

        // Renderiza la vista inicial (Universidades)
        switchView("universities");
      });