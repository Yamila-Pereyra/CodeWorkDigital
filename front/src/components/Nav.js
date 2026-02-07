"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Nav() {
  const pathname = usePathname();

  const isActive = (path) => path === pathname;

  return (
    <nav>
      <ul className="holder">
        <li>
          <Link className={isActive("/") ? "activo" : ""} href="/">
            Home
          </Link>
        </li>

        <li>
          <Link
            className={isActive("/quienessomos") ? "activo" : ""}
            href="/quienessomos"
          >
            Quiénes somos
          </Link>
        </li>

        <li>
          <Link
            className={isActive("/servicios") ? "activo" : ""}
            href="/servicios"
          >
            Servicios
          </Link>
        </li>

        <li>
          <Link
            className={isActive("/novedades") ? "activo" : ""}
            href="/novedades"
          >
            Novedades
          </Link>
        </li>

        <li>
          <Link
            className={isActive("/contacto") ? "activo" : ""}
            href="/contacto"
          >
            Contacto
          </Link>
        </li>
      </ul>
    </nav>
  );
}

