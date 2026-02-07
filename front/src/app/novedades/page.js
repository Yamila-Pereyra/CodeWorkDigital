import "@/styles/novedades.css";
import NovedadItem from "@/components/NovedadItem";

export const metadata = {
  title: "Code Work Digital",
  description: "Soluciones web que impulsan tu negocio",
};

export default async function Novedades() {


const data = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/novedades`, { cache: 'no-store' });



  const novedades = await data.json();

  return (
    <section className="holder">
       <h2>Novedades</h2> 
       {
        novedades.map(item => <NovedadItem key={item.id}
          title={item.titulo} subtitle={item.subtitulo}
          imagen={item.imagen} body={item.cuerpo}/>)
       }


    </section>
  )
  }