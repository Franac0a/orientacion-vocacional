// Inicialización de AOS (Animate On Scroll)
AOS.init({
  duration: 1000,
  once: true,
});

// Alternar menú móvil
document
  .getElementById("mobile-menu-btn")
  .addEventListener("click", function () {
    const menu = document.getElementById("mobile-menu");
    menu.classList.toggle("hidden");
  });

// Efecto de sombra de la barra de navegación al hacer scroll
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

// Desplazamiento suave para enlaces ancla (a[href="#..."])
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
// **Este código es un ejemplo para tu lógica de login/autenticación**

function manejarInicioSesionExitoso(tokenRecibido, datosUsuario) {
  // 1. Almacena el token (esencial para la navegación)
  localStorage.setItem("authToken", tokenRecibido);

  // 2. Opcionalmente, almacena datos del usuario
  localStorage.setItem("user", JSON.stringify(datosUsuario));

  // 3. Redirige al usuario a la página principal o de perfil
  window.location.href = "index.html";
}
// login.js (en la función que maneja la respuesta de POST /api/auth/login)
if (response.ok) {
  const data = await response.json();

  // 🔑 CLAVE: Guarda el token para que otros scripts JS puedan acceder a él.
  localStorage.setItem("authToken", data.token);
  localStorage.setItem("userType", data.user.type); // Guarda el tipo de usuario

  window.location.href = "perfil.html"; // O la página a donde redirijas
}
// Efecto Parallax para elementos de fondo en la sección de inicio
window.addEventListener("scroll", function () {
  const scrolled = window.pageYOffset;
  // Solo se aplica a los elementos con la clase 'animate-float'
  const parallax = document.querySelectorAll(".animate-float");
  const speed = 0.5;

  parallax.forEach((element) => {
    const yPos = -(scrolled * speed);
    element.style.transform = `translate3d(0, ${yPos}px, 0)`;
  });
});
