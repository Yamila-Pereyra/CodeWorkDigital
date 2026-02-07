export default function ContactForm() {
  return (
    <>
      <h3>Formulario</h3>

      <form action="#" method="post" className="contacto-form">
        <p>
          <label>Nombre</label>
          <input type="text" name="nombre" required />
        </p>

        <p>
          <label>Email</label>
          <input type="email" name="email" required />
        </p>

        <p>
          <label>Mensaje</label>
          <textarea name="mensaje" rows="4" required />
        </p>

        <button type="submit" className="btn-primary form-btn">
          Enviar mensaje
        </button>
      </form>
    </>
  );
}
