import "@/styles/novedades.css";
import NovedadItem from "@/components/NovedadItem";

export const metadata = {
  title: "Code Work Digital",
  description: "Soluciones web que impulsan tu negocio",
};

export default async function Novedades() {
  const data = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/novedades`,
    {
      cache: "no-store",
    }
  );
  const novedades = await data.json();

  return (
    <section className="novedades-container">
      <h1>Nuestras Novedades</h1>
      <div className="cards-wrapper">
        {novedades && novedades.length > 0 ? (
          novedades.map((item) => (
            <NovedadItem
              key={item.id}
              title={item.titulo}
              description={item.descripcion}
              publishDate={item.fecha_publicacion}
              estado={item.estado}
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
