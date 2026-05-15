"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const links = [
  { id: "bieres", label: "Bières", href: "/bieres" },
  { id: "carte", label: "La carte", href: "/carte" },
  { id: "midi", label: "Le midi", href: "/midi" },
  { id: "evenements", label: "Événements", href: "/evenements" },
  { id: "tireuse", label: "Tireuse", href: "/tireuse" },
  { id: "contact", label: "Contact", href: "/contact" },
];

export default function Nav({ active }: { active?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <nav className="nav">
      <div className="wrap nav-inner">
        <Link className="nav-logo" href="/" aria-label="Accueil — La Bièregerie d'Henri">
          <Image src="/assets/logo.png" alt="Logo La Bièregerie d'Henri" width={56} height={56} />
          <span className="hide-xs">
            <span className="name">La Bièregerie</span>
            <br />
            <span className="sub">d&apos;Henri</span>
          </span>
        </Link>

        <div className={`nav-links${open ? " open" : ""}`}>
          {links.map((l) => (
            <Link
              key={l.id}
              href={l.href}
              className={active === l.id ? "active" : ""}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <Link href="/contact#reserver" className="btn btn-primary btn-sm nav-cta">
          Réserver une table <span className="arrow">→</span>
        </Link>

        <button
          className="nav-burger"
          aria-label="Menu"
          onClick={() => setOpen((o) => !o)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </nav>
  );
}
