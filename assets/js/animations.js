/**
 * Intersection Observer para animações de scroll (TODO-UI-05)
 * Oculta os itens inicialmente (via CSS `.product-section`, `.intro`, etc.)
 * e adiciona a classe `.animate-in` quando entrarem no viewport.
 */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Seleciona todos os elementos que devem ser animados
  const animatedElements = document.querySelectorAll(
    ".intro, .product-section, .cta-section",
  );

  // 2. Verifica preferência de movimento reduzido (Acessibilidade WCAG)
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  // Se o usuário prefere sem animação, apenas mostre tudo imediatamente
  if (prefersReducedMotion) {
    animatedElements.forEach((el) => el.classList.add("animate-in"));
    return;
  }

  // 3. Configura o Observer
  const observerOptions = {
    root: null, // usa o viewport como referência
    rootMargin: "0px 0px -50px 0px", // dispara um pouco antes de aparecer 100%
    threshold: 0.15, // 15% do elemento precisa estar visível
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Adiciona a classe que engatilha o fade-in-up
        entry.target.classList.add("animate-in");
        // Para de observar este elemento para performar melhor
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // 4. Inicia a observação de cada elemento
  animatedElements.forEach((el) => observer.observe(el));
});
