"use client";

import React from "react";
import "@/styles/novedades.css";

export default function NovedadItem({
  title,
  description,
  publishDate,
  estado,
  link,
  imagen,
}) {
  const estadoTexto = estado === 1 ? "Activo" : "Inactivo";
  const estadoClase = estado === 1 ? "estado-activo" : "estado-en-proceso";
  const formattedDate = publishDate
    ? new Date(publishDate).toLocaleDateString("es-ES")
    : "";
  const shortDescription =
    description && description.length > 160
      ? `${description.slice(0, 157)}...`
      : description;

  return (
    <div
      className="novedad-card"
      onClick={() => link && window.open(link, "_blank")}
    >
      {imagen && <img src={imagen} alt={title} className="card-img" />}
      <h1>{title}</h1>
      <h2>{formattedDate}</h2>
      {shortDescription && <p>{shortDescription}</p>}
      <div className="extra-info">
        Estado: <span className={estadoClase}>{estadoTexto}</span>
      </div>
    </div>
  );
}
