import "@/styles/home.css";

export default function Home() {
  return (
    
      <main className="">
        
      <section className="hero">
        <h1>CodeWork Digital</h1>
        <p>Desarrollo web profesional</p>
      </section>

      <section className="services">
        <div className="service-card">
          <h3>Desarrollo Web Profesional</h3>
          <p>Sitios institucionales, landing pages y portfolios con diseño moderno.</p>
        </div>

        <div className="service-card">
          <h3>Tiendas Online</h3>
          <p>E-commerce con WooCommerce o Shopify.</p>
        </div>

        <div className="service-card">
          <h3>Optimización & SEO Básico</h3>
          <p>Mejoras de velocidad y estructura.</p>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="cta-final">
        <div className="container">
          <h2>¿Listo para una web profesional?</h2>
          <p>Escribinos y empezamos tu proyecto hoy.</p>
          <a href="#contacto" className="btn-primary">
            Contactar ahora
          </a>
        </div>
      </section>
        
      </main>
      
    
  );
}
