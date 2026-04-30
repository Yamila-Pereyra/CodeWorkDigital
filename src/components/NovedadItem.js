"use client";

import React from "react";
import "@/styles/novedades.css";

function formatPublishDate(publishDate) {
  if (typeof publishDate !== "string") {
    return "";
  }

  const parts = publishDate.split("-");

  if (parts.length !== 3) {
    return "";
  }

  const [year, month, day] = parts;
  const yearNumber = Number(year);
  const monthNumber = Number(month);
  const dayNumber = Number(day);

  if (
    !Number.isInteger(yearNumber) ||
    !Number.isInteger(monthNumber) ||
    !Number.isInteger(dayNumber) ||
    year.length !== 4 ||
    month.length !== 2 ||
    day.length !== 2 ||
    monthNumber < 1 ||
    monthNumber > 12 ||
    dayNumber < 1 ||
    dayNumber > 31
  ) {
    return "";
  }

  return `${day}/${month}/${year}`;
}

export default function NovedadItem({
  title,
  description,
  publishDate,
  link,
  imagen,
}) {
  const formattedDate = formatPublishDate(publishDate);
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
