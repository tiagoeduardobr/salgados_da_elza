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

/**
 * Funcionalidade Pix: copia a chave Pix para a área de transferência do dispositivo.
 *
 * Como funciona?
 * - O botão possui o atributo `data-pix-key` com a chave literal a copiar.
 * - Ao clicar, usamos a API `navigator.clipboard.writeText()` (padrão moderno).
 * - Como fallback para browsers mais antigos, usamos `document.execCommand('copy')`.
 * - Após a cópia, o botão muda visualmente (cor verde + ícone de check) e
 *   exibe a mensagem de feedback por 3 segundos antes de resetar.
 *
 * Segurança: não há manipulação de DOM dinâmica com dados externos.
 * A chave Pix é lida apenas do atributo `data-pix-key` do próprio botão.
 */
document.addEventListener("DOMContentLoaded", () => {
  const copyBtn = document.getElementById("pix-copy-btn");
  const feedbackMsg = document.getElementById("pix-copy-feedback");

  // Sai silenciosamente se os elementos não existirem na página
  if (!copyBtn || !feedbackMsg) return;

  // Guarda o conteúdo original do botão para restaurar após feedback
  const originalBtnHTML = copyBtn.innerHTML;

  // Tempo (ms) para o feedback desaparecer e o botão resetar
  const FEEDBACK_DURATION_MS = 3000;
  let resetTimer = null;

  /**
   * Mostra o feedback de sucesso no botão e na mensagem de texto.
   * Reseta automaticamente após FEEDBACK_DURATION_MS.
   */
  function showCopySuccess() {
    // Limpa qualquer reset pendente (ex.: usuário clicou duas vezes)
    if (resetTimer) clearTimeout(resetTimer);

    // Altera o botão para o estado "copiado"
    copyBtn.classList.add("copied");
    copyBtn.innerHTML =
      '<svg class="pix-copy-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>Copiado!';

    // Exibe a mensagem de feedback abaixo do botão (acessível via aria-live)
    feedbackMsg.classList.add("visible");

    // Após o tempo definido, reseta tudo ao estado original
    resetTimer = setTimeout(() => {
      copyBtn.classList.remove("copied");
      copyBtn.innerHTML = originalBtnHTML;
      feedbackMsg.classList.remove("visible");
      resetTimer = null;
    }, FEEDBACK_DURATION_MS);
  }

  copyBtn.addEventListener("click", () => {
    // Lê a chave Pix do atributo data do próprio botão (sem dado externo)
    const pixKey = copyBtn.dataset.pixKey;
    if (!pixKey) return;

    // Tenta usar a API moderna de clipboard (requer contexto seguro: HTTPS/localhost)
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(pixKey)
        .then(showCopySuccess)
        .catch(() => {
          // Fallback caso o usuário negue a permissão de clipboard
          copyWithExecCommand(pixKey);
        });
    } else {
      // Fallback para browsers que não suportam navigator.clipboard
      copyWithExecCommand(pixKey);
    }
  });

  /**
   * Fallback de cópia via `execCommand('copy')` para browsers legados.
   * Cria um input temporário oculto, seleciona o texto e executa o comando.
   * O input é removido logo após a operação.
   */
  function copyWithExecCommand(text) {
    const tempInput = document.createElement("input");
    // Usa position:fixed para não causar scroll na página
    tempInput.style.cssText = "position:fixed;top:-9999px;left:-9999px;opacity:0";
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    tempInput.setSelectionRange(0, text.length); // compatibilidade mobile

    try {
      // execCommand está obsoleto mas ainda funciona em browsers legados
      document.execCommand("copy");
      showCopySuccess();
    } catch (err) {
      // Se nenhum método funcionar, a cópia não ocorre silenciosamente
      // para não quebrar a experiência do usuário
      void err;
    } finally {
      document.body.removeChild(tempInput);
    }
  }
});
