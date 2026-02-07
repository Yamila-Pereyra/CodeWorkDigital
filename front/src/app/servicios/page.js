import "@/styles/servicios.css";

export const metadata = {
  title: "Code Work Digital - Servicios",
  description: "Soluciones web que impulsan tu negocio",
};

export default function Servicios() {
  return (
    <main>
       <section class="hero-section">
            <div class="container">
                <h2>Creamos sitios web profesionales que impulsan tu negocio</h2>
                <p class="subtitulo">
                    En <strong>CodeWork Digital</strong> desarrollamos páginas web modernas, seguras y optimizadas
                    para que tu marca tenga presencia profesional y atraiga más clientes.
                </p>

                <div class="hero-buttons">
                    <a href="#contacto" class="btn-primary">Solicitar presupuesto</a>
                    <a href="#portfolio" class="btn-outline">Ver portfolio</a>
                </div>
            </div>
        </section>
      {/* SECCIÓN BENEFICIOS */}
      <section className="beneficios">
        <div className="container">
          <h2>¿Por qué elegirnos?</h2>
          <ul className="lista-beneficios">
            <li className="subtitulo">Diseño moderno y adaptable</li>
            <li className="subtitulo">Sitios rápidos y seguros</li>
            <li className="subtitulo">Entrega puntual</li>
            <li className="subtitulo">Código limpio y optimizado</li>
            <li className="subtitulo">SEO básico incluido</li>
            <li className="subtitulo">Soporte opcional</li>
          </ul>
        </div>
      </section>

      {/* SERVICIOS */}
      <section className="servicios">
        <div className="container">
          <h2>Servicios</h2>

          <div className="service-card">
            <h3>Desarrollo Web Profesional</h3>
            <p>
              Sitios institucionales, landing pages y portfolios con diseño moderno y experiencia clara.
            </p>
          </div>

          <div className="service-card">
            <h3>Tiendas Online</h3>
            <p>
              E-commerce con WooCommerce o Shopify, integración de pagos y diseño totalmente responsive.
            </p>
          </div>

          <div className="service-card">
            <h3>Optimización & SEO Básico</h3>
            <p>
              Mejoras de velocidad, rendimiento y estructura para aumentar visibilidad y conversiones.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

