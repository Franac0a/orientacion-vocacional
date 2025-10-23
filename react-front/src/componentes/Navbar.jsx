import React from "react";

export const Navbar = () => {
  return (
    <nav
      className="fixed top-0 w-full bg-white/90 backdrop-blur-md shadow-lg z-50 transition-all duration-300"
      id="navbar"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-3">
            <img
              src="src/img/logo.jpg"
              alt="Logo Impulso Educativo con libro abierto y birrete de graduación en círculo verde"
              className="w-10 h-10 animate-pulse-slow"
            />
            <span className="text-xl font-bold text-impulso-dark">
              Impulso Educativo
            </span>
          </div>

          <div className="md:hidden">
            <button
              id="mobile-menu-btn"
              className="text-impulso-dark hover:text-impulso-teal transition-colors"
            >
              <i className="fas fa-bars text-xl"></i>
            </button>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <a
              href="#inicio"
              className="text-impulso-dark hover:text-impulso-teal transition-colors font-medium"
            >
              Inicio
            </a>
            <a
              href="#servicios"
              className="text-impulso-dark hover:text-impulso-teal transition-colors font-medium"
            >
              Servicios
            </a>
            <a
              href="test.html"
              id="test-link"
              className="text-impulso-dark hover:text-impulso-teal transition-colors font-medium"
            >
              Test de Personalidad
            </a>

            <a
              href="nosotros.html"
              className="text-impulso-dark hover:text-impulso-teal transition-colors font-medium"
            >
              Nosotros
            </a>
            <a
              href="contacto.html"
              className="text-impulso-dark hover:text-impulso-teal transition-colors font-medium"
            >
              Contacto
            </a>
            <a
              href="univ.invitado.html"
              className="text-impulso-dark hover:text-impulso-teal transition-colors font-medium"
            >
              Explorá
            </a>

            <div id="logged-out-nav" className="flex items-center space-x-3">
              <a
                href="login.html"
                className="px-4 py-2 text-impulso-teal border border-impulso-teal rounded-lg hover:bg-impulso-teal hover:text-white transition-all duration-300"
              >
                Iniciar Sesión
              </a>
              <a
                href="registro.html"
                className="px-4 py-2 bg-gradient-to-r from-impulso-green to-impulso-teal text-white rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300"
              >
                Registrarse
              </a>
            </div>

            <div
              id="logged-in-nav"
              style="display: none"
              className="relative group"
            >
              <button className="px-4 py-2 text-impulso-teal border border-impulso-teal rounded-lg hover:bg-impulso-teal hover:text-white transition-all duration-300">
                <i className="fas fa-user-circle mr-2"></i> Mi Perfil
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="py-1">
                  <a
                    href="perfil.html"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Mi Perfil
                  </a>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    id="logout-btn"
                  >
                    Cerrar Sesión
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div id="mobile-menu" className="md:hidden hidden pb-4 space-y-3">
          <a
            href="#inicio"
            className="block text-impulso-dark hover:text-impulso-teal transition-colors"
          >
            Inicio
          </a>
          <a
            href="#servicios"
            className="block text-impulso-dark hover:text-impulso-teal transition-colors"
          >
            Servicios
          </a>
          <a
            href="test.html"
            id="mobile-test-link"
            className="block text-impulso-dark hover:text-impulso-teal transition-colors"
          >
            Test de Personalidad
          </a>
          <a
            href="#sobre-nosotros"
            className="block text-impulso-dark hover:text-impulso-teal transition-colors"
          >
            Nosotros
          </a>
          <a
            href="#contacto"
            className="block text-impulso-dark hover:text-impulso-teal transition-colors"
          >
            Contacto
          </a>
          <a
            href="univ.invitado.html"
            className="block text-impulso-dark hover:text-impulso-teal transition-colors"
          >
            Explorá
          </a>

          <div id="logged-out-mobile" className="pt-3 space-y-2">
            <a
              href="login.html"
              className="block w-full text-center px-4 py-2 text-impulso-teal border border-impulso-teal rounded-lg"
            >
              Iniciar Sesión
            </a>
            <a
              href="registro.html"
              className="block w-full text-center px-4 py-2 bg-gradient-to-r from-impulso-green to-impulso-teal text-white rounded-lg"
            >
              Registrarse
            </a>
          </div>
          <div
            id="logged-in-mobile"
            style="display: none"
            className="pt-3 space-y-2"
          >
            <a
              href="perfil.html"
              className="block w-full text-center px-4 py-2 text-impulso-teal border border-impulso-teal rounded-lg"
            >
              Mi Perfil
            </a>
            <a
              href="#"
              id="logout-mobile-btn"
              className="block w-full text-center px-4 py-2 bg-gradient-to-r from-impulso-green to-impulso-teal text-white rounded-lg"
            >
              Cerrar Sesión
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};
