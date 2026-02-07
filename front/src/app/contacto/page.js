import "@/styles/contacto.css";
import ContactForm from "@/components/ContactForm";

export const metadata = {
  title: "Code Work Digital - Contacto",
  description: "Contáctanos para impulsar tu negocio con soluciones web",
};

export default function Contacto() {
  return (
    <main>
      <section id="contacto" className="contacto">
        <div className="container">
          <h2 className="titulo-contacto">Contáctanos</h2>
          <p className="texto-contacto">
            Contanos sobre tu proyecto y te respondemos a la brevedad.
          </p>

          {/* Componente del formulario */}
          <ContactForm />
        </div>

        <div className="contacto-what">
          {/* CONTACTO WHATSAPP */}
          <div className="contacto-box">
            <h3>WhatsApp</h3>
            <p>Consultas rápidas, presupuestos y atención inmediata.</p>
            <a
              href="https://wa.me/393393309228"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp"
            >
              <button type="button" className="btn-primary form-btn">
                Enviar WhatsApp
              </button>
            </a>
          </div>

          {/* Formulario alternativo o información adicional */}
          {/* Puedes añadir más contenido aquí si quieres */}
        </div>
      </section>
    </main>
  );
}
