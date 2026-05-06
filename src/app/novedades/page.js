import "@/styles/novedades.css";
import NovedadItem from "@/components/NovedadItem";
import { buildApiUrl } from "@/lib/apiConfig";

export const metadata = {
  title: "Code Work Digital",
  description: "Soluciones web que impulsan tu negocio",
};

export const dynamic = "force-dynamic";

async function fetchNovedades() {
  const response = await fetch(buildApiUrl("/api/novedades"), {
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
    console.error("Error loading public novedades:", error);
    errorMessage =
      "No pudimos cargar las novedades en este momento. Intenta nuevamente mas tarde.";
  }

  return (
    <section className="novedades-container">
      <h1>Nuestras Novedades</h1>
      <div className="novedades-cards-wrapper">
        {errorMessage ? (
          <p>{errorMessage}</p>
        ) : novedades && novedades.length > 0 ? (
          novedades.map((item) => (
            <NovedadItem
              key={item.id}
              title={item.titulo}
              subtitle={item.subtitulo}
              body={item.cuerpo}
            />
          ))
        ) : (
          <p>No hay novedades disponibles.</p>
        )}
      </div>
    </section>
  );
}
