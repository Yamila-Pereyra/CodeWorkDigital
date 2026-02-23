"use client";

import Head from "next/head";
import "@/app/home1.css";
import "@/styles/contacto.css";
import Link from "next/link";
import ContactForm from "@/components/ContactForm";

import { useEffect, useState, useRef } from "react";

 c0c8bc3 (fix case sensitive import)

export default function Home() {
  const frases = [
    "Desarrollo Web Profesional",
    "Tiendas Online Modernas",
    "Optimización y SEO",
    "Diseño que convierte"
  ];

  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const beneficiosRef = useRef(null);

  /* =========================
     HERO CARRUSEL
  ========================= */
  useEffect(() => {
    const intervalo = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % frases.length);
        setFade(true);
      }, 300);
    }, 2500);

    return () => clearInterval(intervalo);
  }, []);

  /* =========================
     BENEFICIOS ANIMACIÓN SCROLL
  ========================= */
  useEffect(() => {
    if (!beneficiosRef.current) return;

    const items = beneficiosRef.current.querySelectorAll("li");

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const delay =
              [...items].indexOf(el) * 120;

            el.style.transitionDelay = `${delay}ms`;
            el.classList.add("show");
            obs.unobserve(el);
          }
        });
      },
      { threshold: 0.25 }
    );

    items.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, []);

  return (
    <main>
      <Head>
<<<<<<< HEAD
        <title>Code Work Digital - Inicio</title>
        <meta
          name="description"
          content="Contáctanos para impulsar tu negocio con soluciones web"
        />
      </Head>

      {/* ================= HERO ================= */}
=======
        <title>Code Work Digital - Contacto</title>
        <meta name="description" content="Contáctanos para impulsar tu negocio con soluciones web" />
      </Head>

      {/* HERO */}
>>>>>>> c0c8bc3 (fix case sensitive import)
      <section className="hero">
        <h1>CodeWork Digital</h1>
        <p className={`carousel-text ${fade ? "fade-in" : "fade-out"}`}>
          {frases[index]}
        </p>
      </section>

      {/* ================= HERO SECTION ================= */}
      <section className="hero-section">
        <div className="container">
          <h2>
            Creamos sitios web profesionales que impulsan tu negocio
          </h2>
          <p className="subtitulo">
            En <strong>CodeWork Digital</strong> desarrollamos páginas web
            modernas, seguras y optimizadas para que tu marca tenga presencia
            profesional y atraiga más clientes.
          </p>
        </div>
      </section>

      {/* ================= NOSOTROS ================= */}
      <section className="nosotros">
        <div className="container">
          <h2>¿Qué hacemos?</h2>
          <p className="subtitulo">
            Combinamos diseño, tecnología y estrategia
            para crear sitios web que se vean bien, funcionen perfecto y
            representen tu marca con profesionalismo.
          </p>
        </div>
      </section>

      {/* ================= BENEFICIOS ================= */}
      <section className="beneficios">
        <div className="container">
          <h2>¿Por qué elegirnos?</h2>

          <ul className="lista-beneficios" ref={beneficiosRef}>
            <li>Diseño moderno y adaptable</li>
            <li>Sitios rápidos y seguros</li>
            <li>Entrega puntual</li>
            <li>Código limpio y optimizado</li>
            <li>SEO básico incluido</li>
            <li>Soporte opcional</li>
          </ul>
        </div>
      </section>

      {/* ================= SERVICIOS ================= */}
      <section className="services">
<<<<<<< HEAD
        <div className="container">
          <h2>Servicios</h2>

          <div className="service-card">
            <h3>Desarrollo Web Profesional</h3>
            <p>
              Sitios institucionales, landing pages y portfolios
              con diseño moderno y experiencia clara.
            </p>
          </div>

          <div className="service-card">
            <h3>Tiendas Online</h3>
            <p>
              E-commerce con WooCommerce o Shopify.
            </p>
          </div>

          <div className="service-card">
            <h3>Optimización & SEO Básico</h3>
            <p>
              Mejoras de velocidad, estructura y posicionamiento.
            </p>
          </div>
=======
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
>>>>>>> c0c8bc3 (fix case sensitive import)
        </div>
      </section>

      {/* ================= CTA FINAL ================= */}
      <section className="cta-final">
        <div className="container">
          <h2>¿Listo para una web profesional?</h2>
          <p>Escribinos y empezamos tu proyecto hoy.</p>

          <Link href="/contacto" className="btn-primary btn-contactar">
            Contactar ahora
          </Link>
        </div>
      </section>

<<<<<<< HEAD
      {/* ================= FORMULARIO ================= */}
      <ContactForm
        postUrl={`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/contacto`}
=======
      {/* FORMULARIO DE CONTACTO ABAJO */}
      <ContactForm
        postUr={`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/contacto`}
>>>>>>> c0c8bc3 (fix case sensitive import)
      />
    </main>
  );
}

