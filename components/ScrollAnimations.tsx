"use client";
import { useEffect } from "react";

export default function ScrollAnimations() {
  useEffect(() => {
    document.documentElement.classList.add("anim-ready");

    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.1 }
    );

    // Pour le chargement initial : animation déclenchée au scroll via IO
    document.querySelectorAll("[data-anim]").forEach((el) => {
      if (!el.classList.contains("is-visible")) io.observe(el);
    });

    // Pour les éléments ajoutés dynamiquement (changement de filtre) :
    // on ajoute is-visible directement (pas via IO) pour qu'ils soient visibles
    const mo = new MutationObserver((mutations) => {
      mutations.forEach((m) => {
        m.addedNodes.forEach((node) => {
          if (!(node instanceof Element)) return;
          const targets: Element[] = [];
          if (node.matches("[data-anim]")) targets.push(node);
          node.querySelectorAll("[data-anim]").forEach((el) => targets.push(el));
          requestAnimationFrame(() => {
            targets.forEach((el) => {
              if (!el.classList.contains("is-visible")) {
                el.classList.add("is-visible");
              }
            });
          });
        });
      });
    });

    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);
  return null;
}
