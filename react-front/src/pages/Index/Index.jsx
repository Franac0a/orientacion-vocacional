import React from "react";
import { Navbar } from "../../componentes/Navbar";

export const Index = () => {
  return (
    <div>
      <Navbar />
      <section
        id="inicio"
        className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20"
      >
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-32 w-96 h-96 bg-impulso-light/20 rounded-full animate-float"></div>
          <div className="absolute -bottom-32 -left-40 w-80 h-80 bg-impulso-gold/20 rounded-full animate-bounce-slow"></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-impulso-teal/10 rounded-full animate-pulse-slow"></div>
        </div>

        <div className="container mx-auto px-4 z-10">
          <div className="text-center">
            <div className="mb-8" data-aos="zoom-in" data-aos-duration="1000">
              <div className="inline-block relative">
                <img
                  src="src/img/logo.jpg"
                  alt="Logo principal de Impulso Educativo con libro abierto y birrete de graduación"
                  className="w-32 h-32 md:w-40 md:h-40 mx-auto animate-float drop-shadow-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-impulso-teal to-impulso-green opacity-20 rounded-full animate-pulse-slow"></div>
              </div>
            </div>

            <h1
              className="text-4xl md:text-6xl lg:text-7xl font-bold text-impulso-dark mb-6"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <span className="bg-gradient-to-r from-impulso-green to-impulso-teal bg-clip-text text-transparent">
                Impulso Educativo
              </span>
            </h1>

            <h2
              className="text-xl md:text-2xl lg:text-3xl text-impulso-teal mb-4"
              data-aos="fade-up"
              data-aos-delay="400"
            >
              Tu Futuro Profesional Comienza acá
            </h2>

            <p
              className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed"
              data-aos="fade-up"
              data-aos-delay="600"
            >
              Descubrí tu verdadera vocación con nuestro sistema inteligente de
              orientación educativa. Conectamos tus pasiones con oportunidades
              reales del mercado laboral.
            </p>

            <div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              data-aos="fade-up"
              data-aos-delay="800"
            >
              <a
                href="registro.html"
                className="group px-8 py-4 bg-gradient-to-r from-impulso-green to-impulso-teal text-white text-lg font-semibold rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                <i className="fas fa-user-plus mr-2 group-hover:animate-bounce"></i>
                Comenzar Ahora
                <i className="fas fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform"></i>
              </a>

              <a
                href="login.html"
                className="group px-8 py-4 border-2 border-impulso-teal text-impulso-teal text-lg font-semibold rounded-xl hover:bg-impulso-teal hover:text-white transition-all duration-300"
              >
                <i className="fas fa-sign-in-alt mr-2"></i>
                Iniciar Sesión
              </a>
            </div>

            <div
              className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6"
              data-aos="fade-up"
              data-aos-delay="1000"
            >
              <div className="text-center"></div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-impulso-teal mb-2">
                  98%
                </div>
                <div className="text-sm text-gray-600">Satisfacción</div>
              </div>

              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-impulso-teal mb-2">
                  24/7
                </div>
                <div className="text-sm text-gray-600">Soporte</div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <i className="fas fa-chevron-down text-impulso-teal text-2xl"></i>
        </div>
      </section>

      <section id="servicios" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2
              className="text-3xl md:text-4xl font-bold text-impulso-dark mb-4"
              data-aos="fade-up"
            >
              Nuestros Servicios
            </h2>
            <p
              className="text-lg text-gray-600 max-w-2xl mx-auto"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              Herramientas especializadas para guiar tu camino educativo y
              profesional
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div
              className="group bg-gradient-to-br from-impulso-light/10 to-impulso-teal/10 p-8 rounded-2xl hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              <div className="bg-impulso-teal/20 w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <i className="fas fa-brain text-impulso-teal text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-impulso-dark mb-4">
                Test De Personalidad
              </h3>
              <p className="text-gray-600">
                Descubre tus aptitudes y preferencias profesionales con nuestros
                tests especializados y científicamente validados.
              </p>
            </div>

            <div
              className="group bg-gradient-to-br from-impulso-green/10 to-impulso-teal/10 p-8 rounded-2xl hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2"
              data-aos="fade-up"
              data-aos-delay="500"
            >
              <div className="bg-impulso-green/20 w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <i className="fas fa-graduation-cap text-impulso-green text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-impulso-dark mb-4">
                Orientación Académica
              </h3>
              <p className="text-gray-600">
                Recibe recomendaciones personalizadas sobre carreras
                universitarias y técnicas que se alineen con tu perfil.
              </p>
            </div>

            <div
              className="group bg-gradient-to-br from-impulso-gold/10 to-impulso-teal/10 p-8 rounded-2xl hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2"
              data-aos="fade-up"
              data-aos-delay="700"
            >
              <div className="bg-impulso-gold/20 w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <i className="fas fa-chart-line text-impulso-gold text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-impulso-dark mb-4">
                Perspectivas Laborales
              </h3>
              <p className="text-gray-600">
                Conoce las tendencias del mercado laboral y las oportunidades de
                crecimiento en diferentes sectores.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-impulso-green to-impulso-teal relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-impulso-green/90 to-impulso-teal/90"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2
            className="text-3xl md:text-4xl font-bold text-white mb-6"
            data-aos="fade-up"
          >
            ¿Listo para Descubrir tu Futuro?
          </h2>
          <p
            className="text-xl text-impulso-light mb-8 max-w-2xl mx-auto"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            Únete a miles de estudiantes que ya encontraron su camino con
            Impulso Educativo
          </p>
          <div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            data-aos="fade-up"
            data-aos-delay="400"
          >
            <a
              href="registro.html"
              className="group px-8 py-4 bg-white text-impulso-teal text-lg font-semibold rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              <i className="fas fa-rocket mr-2 group-hover:animate-bounce"></i>
              Empezar Gratis
            </a>
            <a
              href="#contacto"
              className="group px-8 py-4 border-2 border-white text-white text-lg font-semibold rounded-xl hover:bg-white hover:text-impulso-teal transition-all duration-300"
            >
              <i className="fas fa-phone mr-2"></i>
              Contactar
            </a>
          </div>
        </div>
      </section>

      <section id="carreras" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-impulso-dark mb-8 text-center">
            Carreras Disponibles
          </h2>
          <div
            id="carrerasContainer"
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          ></div>
        </div>
      </section>

      <footer className="bg-impulso-dark text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <img
                  src="src/img/logo.jpg"
                  alt="Logo Impulso Educativo para footer"
                  className="w-8 h-8"
                />
                <span className="text-xl font-bold">Impulso Educativo</span>
              </div>
              <p className="text-impulso-light">
                Transformando el futuro educativo, una orientación a la vez.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Enlaces Rápidos</h4>
              <div className="space-y-2">
                <a
                  href="#inicio"
                  className="block text-impulso-light hover:text-white transition-colors"
                >
                  Inicio
                </a>
                <a
                  href="#servicios"
                  className="block text-impulso-light hover:text-white transition-colors"
                >
                  Servicios
                </a>
                <a
                  href="#sobre-nosotros"
                  className="block text-impulso-light hover:text-white transition-colors"
                >
                  Nosotros
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Contacto</h4>
              <div className="space-y-2 text-impulso-light">
                <p>
                  <i className="fas fa-envelope mr-2"></i>
                  info@impulsoeducativo.com
                </p>
                <p>
                  <i className="fas fa-phone mr-2"></i>+1 234 567 8900
                </p>
                <p>
                  <i className="fas fa-map-marker-alt mr-2"></i>Ciudad, País
                </p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Síguenos</h4>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-impulso-light hover:text-impulso-gold transition-colors"
                >
                  <i className="fab fa-facebook-f text-xl"></i>
                </a>
                <a
                  href="#"
                  className="text-impulso-light hover:text-impulso-gold transition-colors"
                >
                  <i className="fab fa-twitter text-xl"></i>
                </a>
                <a
                  href="#"
                  className="text-impulso-light hover:text-impulso-gold transition-colors"
                >
                  <i className="fab fa-instagram text-xl"></i>
                </a>
                <a
                  href="#"
                  className="text-impulso-light hover:text-impulso-gold transition-colors"
                >
                  <i className="fab fa-linkedin-in text-xl"></i>
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-impulso-teal/30 mt-8 pt-8 text-center text-impulso-light">
            <p>&copy; 2024 Impulso Educativo. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
