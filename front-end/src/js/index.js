// Initialize AOS
AOS.init({
  duration: 1000,
  once: true,
});

// Mobile menu toggle
document
  .getElementById("mobile-menu-btn")
  .addEventListener("click", function () {
    const menu = document.getElementById("mobile-menu");
    menu.classList.toggle("hidden");
  });

// Navbar scroll effect
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

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

// Parallax effect for hero background elements
window.addEventListener("scroll", function () {
  const scrolled = window.pageYOffset;
  const parallax = document.querySelectorAll(".animate-float");
  const speed = 0.5;

  parallax.forEach((element) => {
    const yPos = -(scrolled * speed);
    element.style.transform = `translate3d(0, ${yPos}px, 0)`;
  });
});

// Lógica para mostrar/ocultar la barra de navegación y manejar el test vocacional
document.addEventListener("DOMContentLoaded", () => {
  const loggedInNav = document.getElementById("logged-in-nav");
  const loggedOutNav = document.getElementById("logged-out-nav");
  const testLink = document.getElementById("test-link");

  // Mobile-specific elements
  const loggedInMobile = document.getElementById("logged-in-mobile");
  const loggedOutMobile = document.getElementById("logged-out-mobile");
  const testMobileLink = document.getElementById("mobile-test-link");

  // Botones de cerrar sesión
  const logoutBtn = document.getElementById("logout-btn");
  const logoutMobileBtn = document.getElementById("logout-mobile-btn");

  const usuarioLogueado = localStorage.getItem("authToken");

  if (usuarioLogueado) {
    if (loggedInNav) loggedInNav.style.display = "block";
    if (loggedOutNav) loggedOutNav.style.display = "none";
    if (loggedInMobile) loggedInMobile.style.display = "block";
    if (loggedOutMobile) loggedOutMobile.style.display = "none";

    if (testLink) {
      testLink.href = "test.html";
      testLink.onclick = null;
    }
    if (testMobileLink) {
      testMobileLink.href = "test.html";
      testMobileLink.onclick = null;
    }
  } else {
    if (loggedInNav) loggedInNav.style.display = "none";
    if (loggedOutNav) loggedOutNav.style.display = "flex";
    if (loggedInMobile) loggedInMobile.style.display = "none";
    if (loggedOutMobile) loggedOutMobile.style.display = "block";

    const alertMessage =
      "Para acceder al test de Personalidad, debes iniciar sesión.";
    if (testLink) {
      testLink.href = "login.html";
      testLink.onclick = (e) => {
        e.preventDefault();
        alert(alertMessage);
      };
    }
    if (testMobileLink) {
      testMobileLink.href = "login.html";
      testMobileLink.onclick = (e) => {
        e.preventDefault();
        alert(alertMessage);
      };
    }
  }

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    window.location.reload();
  };

  if (logoutBtn) {
    logoutBtn.addEventListener("click", handleLogout);
  }

  if (logoutMobileBtn) {
    logoutMobileBtn.addEventListener("click", handleLogout);
  }
});
