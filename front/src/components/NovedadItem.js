
//export const metadata = {
  //title: "Code Work Digital",
  //description: "Soluciones web que impulsan tu negocio",
//};


export default async function NovedadItem(props) {

    const { title, subtitle,body} = props;
    return(
        <div className="novedades">

            <h1>{title}</h1>
            <h2>{subtitle}</h2>
            <div dangerouslySetInnerHTML={{__html: body}}/>


        <hr />

        </div>
    );
    
}