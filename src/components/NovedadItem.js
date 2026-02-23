"use client";
import React from "react";

import "@/styles/novedades.css";

export default function NovedadItem({ title, subtitle, estado, link, imagen }) {
  const estadoTexto = estado === 1 ? "Activo" : "En Proceso";
  const estadoClase = estado === 1 ? "estado-activo" : "estado-en proceso";
 c0c8bc3 (fix case sensitive import)

  // fecha!
  const formattedDate = subtitle
    ? new Date(subtitle).toLocaleDateString("es-ES")
    : "";


export default function NovedadItem({ title, subtitle, estado, link, imagen }) {
  const estadoTexto = estado === 1 ? "Activo" : "En Proceso";
  const estadoClase = estado === 1 ? "estado-activo" : "estado-en-proceso";

  // fecha!
  const formattedDate = subtitle
    ? new Date(subtitle).toLocaleDateString("es-ES")
    : "";

  return (
    <div
      className="novedad-card"
      onClick={() => link && window.open(link, "_blank")}
    >
      {imagen && <img src={imagen} alt={title} className="card-img" />}
      <h1>{title}</h1>
      <h2>{formattedDate}</h2>
      <div className="extra-info">
        Estado: <span className={estadoClase}>{estadoTexto}</span>
      </div>
    </div>
  );
}

=======
  return (
    <div
      className="service-card"
      onClick={() => link && window.open(link, "_blank")}
    >
      {imagen && <img src={imagen} alt={title} className="card-img" />}
      <h1>{title}</h1>
      <h2>{formattedDate}</h2>
      <div className="extra-info">
        Estado: <span className={estadoClase}>{estadoTexto}</span>
      </div>
    </div>
  );
}

>>>>>>> c0c8bc3 (fix case sensitive import)
