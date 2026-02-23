import "@/styles/globals.css";
import Nav from "@/components/Nav";

export const metadata = {
  title: "Code Work Digital",
  description: "Soluciones web que impulsan tu negocio",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* CONTENEDOR FIJO */}
        <div className="fixed-header-nav">
          <header>
            <div className="header-container">
              <img
                src="/imagenes/CodeWork-logo.png"
                className="logo"
                alt="logo"
              />
              <div className="header-text">
                <h1>CodeWork Digital</h1>
                <h4>Soluciones web que impulsan tu negocio</h4>
              </div>
            </div>
          </header>

          <Nav />
        </div>

        {/* CONTENIDO PRINCIPAL */}
        <main className="main-content">
          {children}
        </main>

        <footer>
          <p>© 2025 CodeWork Digital — Todos los derechos reservados.</p>
        </footer>
      </body>
    </html>
  );
}
