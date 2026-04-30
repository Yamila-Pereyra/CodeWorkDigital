import "@/styles/novedades.css";
import NovedadItem from "@/components/NovedadItem";

export const metadata = {
  title: "Code Work Digital",
  description: "Soluciones web que impulsan tu negocio",
};

export const dynamic = "force-dynamic";

async function fetchNovedades() {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!apiBaseUrl) {
    throw new Error(
      "Falta configurar NEXT_PUBLIC_API_BASE_URL en el .env.local de la raiz."
    );
  }

  const response = await fetch(`${apiBaseUrl}/api/novedades`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      `No se pudieron cargar las novedades. El backend respondio ${response.status}.`
    );
  }

  return response.json();
}

export default async function Novedades() {
  let novedades = [];
  let errorMessage = null;

  try {
    novedades = await fetchNovedades();
  } catch (error) {
    errorMessage = error.message;
  }

  return (
    <section className="novedades-container">
      <h1>Nuestras Novedades</h1>
      <div className="cards-wrapper">
        {errorMessage ? (
          <p>{errorMessage}</p>
        ) : novedades && novedades.length > 0 ? (
          novedades.map((item) => (
            <NovedadItem
              key={item.id}
              title={item.titulo}
              description={item.descripcion}
              publishDate={item.fecha_publicacion}
              link={item.link}
              imagen={item.imagen}
            />
          ))
        ) : (
          <p>No hay novedades disponibles.</p>
        )}
      </div>
    </section>
  );
}
