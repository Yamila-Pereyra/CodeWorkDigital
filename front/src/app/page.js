"use client";

import Head from "next/head";
import "@/app/home1.css";
import "@/styles/contacto.css";
import Link from "next/link";
import ContactForm from "@/components/ContactForm";

export default function Home() {
  return (
    <main>
      <Head>
        <title>Code Work Digital - Contacto</title>
        <meta name="description" content="Contáctanos para impulsar tu negocio con soluciones web" />
      </Head>

      {/* HERO */}
      <section className="hero">
        <h1>CodeWork Digital</h1>
        <p>Desarrollo web profesional</p>
      </section>

      {/* SERVICIOS */}
      <section className="services">
        <div className="service-card1">
          <h3>Desarrollo Web Profesional</h3>
          <p>Sitios institucionales, landing pages y portfolios con diseño moderno.</p>
        </div>

        <div className="service-card1">
          <h3>Tiendas Online</h3>
          <p>E-commerce con WooCommerce o Shopify.</p>
        </div>

        <div className="service-card1">
          <h3>Optimización & SEO Básico</h3>
          <p>Mejoras de velocidad y estructura.</p>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="cta-final">
        <div className="container">
          <h2>¿Listo para una web profesional?</h2>
          <p>Escribinos y empezamos tu proyecto hoy.</p>

          {/* Botón que lleva a la página de contacto */}
          <Link href="/contacto" className="btn-primary btn-contactar">
            Contactar ahora
          </Link>
        </div>
      </section>

      {/* FORMULARIO DE CONTACTO ABAJO */}
      <ContactForm
        postUr={`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/contacto`}
      />
    </main>
  );
}

