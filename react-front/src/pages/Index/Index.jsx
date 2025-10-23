import React from "react";
import { Navbar } from "../../componentes/Navbar";

export const Index = () => {
  return (
    <div>
      <Navbar />
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
