"use client";

import React from "react";
import "@/styles/novedades.css";

export default function NovedadItem({
  title,
  description,
  publishDate,
  link,
  imagen,
}) {
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
    </div>
  );
}
