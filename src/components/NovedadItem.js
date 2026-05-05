"use client";

import React from "react";
import "@/styles/novedades.css";

export default function NovedadItem({ title, subtitle, body }) {
  return (
    <div className="novedad-card">
      <h1>{title}</h1>
      {subtitle && <h2>{subtitle}</h2>}
      {body && <p>{body}</p>}
    </div>
  );
}
