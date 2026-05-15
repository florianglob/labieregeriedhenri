"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { SiteData } from "@/lib/data";

export default function Footer({ data }: { data: SiteData }) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  function handleNewsletter(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
    setEmail("");
    timerRef.current = setTimeout(() => setSent(false), 4000);
  }

  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-grid">
          {/* Brand */}
          <div>
            <div className="brand-row">
              <Image src="/assets/logo.png" alt="" width={56} height={56} />
              <div>
                <div className="name">La Bièregerie</div>
                <span className="script script-sm">d&apos;Henri</span>
              </div>
            </div>
            <p className="small-text">
              {data.contact.tagline}. Bar à bières, cave-épicerie &amp; afterworks
              dans ton quartier.
            </p>
            <div className="socials" style={{ marginTop: 18 }}>
              <a href={data.contact.instagram} target="_blank" rel="noreferrer" aria-label="Instagram">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <circle cx="12" cy="12" r="4"/>
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4>Visite</h4>
            <ul>
              <li><Link href="/bieres">La carte des bières</Link></li>
              <li><Link href="/midi">Le menu du midi</Link></li>
              <li><Link href="/evenements">Événements</Link></li>
              <li><Link href="/tireuse">Louer une tireuse</Link></li>
              <li><Link href="/contact">Nous trouver</Link></li>
            </ul>
          </div>

          {/* Horaires */}
          <div>
            <h4>Horaires</h4>
            <ul>
              {data.horaires.map((h) => (
                <li key={h.jour}>
                  <strong>{h.jour}</strong> · {h.hr}
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4>La gazette d&apos;Henri</h4>
            <p className="small-text">
              Une fois par mois : nouvelles bières, événements, et menu du midi. Pas
              de pub, promis.
            </p>
            {sent ? (
              <p style={{ color: "var(--dore)", marginTop: 10, fontSize: 14 }}>
                ✓ Merci ! On garde ton mail au chaud.
              </p>
            ) : (
              <form className="newsletter" onSubmit={handleNewsletter}>
                <input
                  type="email"
                  placeholder="ton@mail.fr"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button type="submit" className="btn btn-primary btn-sm">
                  OK
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="footer-bottom">
          <span>
            © 2026 La Bièregerie d&apos;Henri · L&apos;abus d&apos;alcool est dangereux pour la
            santé. À consommer avec modération.
          </span>
          <span>
            <Link href="/mentions">Mentions légales</Link> ·{" "}
            <Link href="/cgv">CGV</Link> ·{" "}
            <Link href="/admin">Admin</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
