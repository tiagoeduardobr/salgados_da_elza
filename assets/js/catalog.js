/**
 * ============================================================================
 * 📦 catalog.js — Renderização Dinâmica do Catálogo (TODO-FE-01)
 * ============================================================================
 *
 * Este script substitui o HTML hardcoded dos produtos por renderização
 * dinâmica via JavaScript, preparando o terreno para a futura integração
 * com o Firebase (TODO-BaaS-02).
 *
 * POR QUE FAZEMOS ISSO?
 * No MVP, os produtos estavam escritos diretamente no HTML (hardcoded).
 * Isso funcionava, mas impedia qualquer atualização sem editar código.
 * Agora os dados vivem em um array JavaScript (productsData), que no
 * futuro será substituído por uma consulta ao Firebase Firestore.
 *
 * SEGURANÇA (OWASP A03 — XSS):
 * Toda a construção do DOM é feita com document.createElement() e
 * .textContent ao invés de .innerHTML com strings concatenadas.
 * Isso impede ataques de Stored XSS mesmo que o banco de dados seja
 * comprometido no futuro — qualquer HTML malicioso inserido nos campos
 * de texto será renderizado como texto puro, não como código executável.
 *
 * @see docs/BACKLOG_PHASE2.md — TODO-FE-01
 */

// =============================================================================
// 📊 DADOS DOS PRODUTOS (Fonte provisória — será substituída pelo Firebase)
// =============================================================================

/**
 * Array de objetos representando o catálogo completo de salgados.
 *
 * POR QUE PREÇO EM CENTAVOS (price_cents)?
 * O JavaScript usa ponto flutuante IEEE 754 para números decimais, o que
 * causa bugs clássicos de arredondamento (ex: 0.1 + 0.2 === 0.30000000000000004).
 * Guardar valores monetários em centavos (inteiros) elimina esse problema.
 * A formatação para o usuário final é feita pela função formatPrice().
 *
 * POR QUE image_webp E image_fallback?
 * Mantemos dois caminhos de imagem para construir o elemento <picture> com
 * <source type="image/webp"> e um <img> como fallback JPEG. Isso garante
 * que navegadores modernos usem o WebP (menor tamanho) e os antigos
 * recebam o JPEG padrão, mantendo a performance do MVP.
 */
const productsData = [
  {
    id: "pizza-gourmet",
    name: "Pizza Gourmet",
    description:
      "Massa macia e dourada, recheio cremoso de queijo, presunto, tomate seco e orégano. O toque especial da casa que conquistou nossos clientes!",
    price_cents: 1200,
    image_webp: "assets/images/assado-pizza-gourmet.webp",
    image_fallback: "assets/images/assado-pizza-gourmet.jpeg",
    image_alt:
      "Salgado Pizza Gourmet assado dourado com queijo, presunto e tomate seco",
    image_width: 1220,
    image_height: 896,
    flavors: [],
    is_active: true,
  },
  {
    id: "assado-frango",
    name: "Assado de Frango",
    description:
      "Recheio generoso de frango desfiado temperado com temperos selecionados, envolto em massa leve e dourada. Suculento e irresistível!",
    price_cents: 1200,
    image_webp: "assets/images/assado-de-frango.webp",
    image_fallback: "assets/images/assado-de-frango.jpeg",
    image_alt: "Salgado de frango desfiado assado dourado",
    image_width: 1220,
    image_height: 902,
    flavors: [],
    is_active: true,
  },
  {
    id: "assado-calabresa",
    name: "Assado de Calabresa",
    description:
      "Calabresa selecionada moída com um toque de tempero especial, envolta em uma massa leve, macia e perfeitamente assada. Um clássico que todo mundo ama!",
    price_cents: 1000,
    image_webp: "assets/images/assado-de-calabresa.webp",
    image_fallback: "assets/images/assado-de-calabresa.jpeg",
    image_alt: "Salgado assado de calabresa dourado e suculento",
    image_width: 1220,
    image_height: 915,
    flavors: [],
    is_active: false,
  },
  {
    id: "dogao-assado",
    name: "Dogão Assado",
    description:
      "Salsicha premium, queijo derretido e molho especial, tudo envolvido em massa assada. Perfeito para um lanche rápido e saboroso!",
    price_cents: 1200,
    image_webp: "assets/images/dogao.webp",
    image_fallback: "assets/images/dogao.jpeg",
    image_alt: "Dogão assado com salsicha, queijo derretido e molho especial",
    image_width: 1220,
    image_height: 1068,
    flavors: [],
    is_active: true,
  },
  {
    id: "pastel-assado",
    name: "Pastel Assado",
    description:
      "Massa sequinha e levemente crocante por fora, recheios caprichados e bem temperados por dentro. A versão mais saudável do pastel tradicional!",
    price_cents: 800,
    image_webp: "assets/images/pastel-assado.webp",
    image_fallback: "assets/images/pastel-assado.jpeg",
    image_alt: "Pastel assado crocante com recheio caprichado",
    image_width: 1220,
    image_height: 817,
    flavors: ["4 Queijos", "Calabresa", "Carne", "Frango", "Pizza"],
    is_active: true,
  },
  {
    id: "croissant",
    name: "Croissants",
    description:
      "Massa folhada artesanal, leve e delicada. Perfeito para acompanhar aquele café especial ou para qualquer momento do dia!",
    price_cents: 1000,
    image_webp: "assets/images/croissant.webp",
    image_fallback: "assets/images/croissant.jpeg",
    image_alt: "Croissant doce artesanal com massa folhada dourada",
    image_width: 1220,
    image_height: 1044,
    flavors: ["Chocolate", "Coco", "Frango"],
    is_active: true,
  },
];

// =============================================================================
// 🛡️ FUNÇÕES UTILITÁRIAS
// =============================================================================

/**
 * Formata um valor em centavos para moeda brasileira (BRL).
 *
 * POR QUE USAR Intl.NumberFormat?
 * É a API nativa do JavaScript para internacionalização de números.
 * Ela cuida automaticamente do separador de milhar (.), decimal (,)
 * e símbolo da moeda (R$), seguindo o padrão pt-BR.
 *
 * @param {number} cents - Valor em centavos (ex: 1200 para R$ 12,00)
 * @returns {string} Valor formatado como moeda (ex: "R$ 12,00")
 */
function formatPrice(cents) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(cents / 100);
}

// =============================================================================
// 🏗️ CONSTRUÇÃO DO DOM (Renderização Segura)
// =============================================================================

/**
 * Cria um elemento <picture> com source WebP e fallback JPEG.
 *
 * POR QUE <picture> COM <source>?
 * O elemento <picture> permite servir formatos diferentes de imagem
 * dependendo do suporte do navegador. Navegadores modernos usam o
 * WebP (40% menor), enquanto os antigos recebem o JPEG.
 *
 * @param {Object} product - Objeto do produto com dados de imagem
 * @param {boolean} isFirst - Se é o primeiro produto (sem lazy loading)
 * @returns {HTMLElement} Elemento <picture> pronto para inserção no DOM
 */
function createProductImage(product, isFirst) {
  // Cria o container <picture>
  const picture = document.createElement("picture");

  // Cria o <source> para WebP (formato otimizado)
  const source = document.createElement("source");
  source.srcset = product.image_webp;
  source.type = "image/webp";

  // Cria o <img> fallback (JPEG)
  const img = document.createElement("img");
  img.src = product.image_fallback;
  img.alt = product.image_alt;
  img.width = product.image_width;
  img.height = product.image_height;
  img.decoding = "async";

  // O primeiro produto NÃO usa lazy loading para aparecer imediatamente
  // (é o conteúdo acima da dobra — "above the fold"). Os demais usam
  // loading="lazy" para economizar banda e melhorar o LCP.
  if (!isFirst) {
    img.loading = "lazy";
  }

  picture.appendChild(source);
  picture.appendChild(img);

  return picture;
}

/**
 * Cria a seção de sabores (flavors) de um produto, se existirem.
 *
 * @param {string[]} flavors - Array de nomes de sabores
 * @returns {HTMLElement|null} Container de sabores ou null se vazio
 */
function createFlavorsSection(flavors) {
  // Se o produto não tem sabores, retorna null (não renderiza nada)
  if (!flavors || flavors.length === 0) return null;

  // Cria o container principal dos sabores
  const flavorsDiv = document.createElement("div");
  flavorsDiv.className = "product-flavors";

  // Cria o título (h4) usando textContent (seguro contra XSS)
  const title = document.createElement("h4");
  title.textContent = "Sabores Disponíveis:";
  flavorsDiv.appendChild(title);

  // Cria a lista não-ordenada (ul) com os sabores
  const ul = document.createElement("ul");
  flavors.forEach((flavor) => {
    const li = document.createElement("li");
    // textContent: o sabor vindo do banco é tratado como texto puro,
    // impossibilitando injeção de HTML malicioso (Stored XSS)
    li.textContent = flavor;
    ul.appendChild(li);
  });
  flavorsDiv.appendChild(ul);

  return flavorsDiv;
}

/**
 * Cria um <article> completo para um produto do catálogo.
 *
 * POR QUE document.createElement() EM VEZ DE innerHTML?
 * A construção via DOM API (createElement + textContent) é imune a
 * ataques de Stored XSS. Se alguém inserir '<script>alert("hack")</script>'
 * no campo "name" do banco de dados, o textContent renderiza isso como
 * texto visível na tela "<script>alert("hack")</script>" em vez de
 * executar o código JavaScript. Com innerHTML, esse ataque funcionaria.
 *
 * POR QUE O ÍNDICE RENDERIZADO PARA O ZIG-ZAG?
 * A classe "reverse" alterna o layout (foto esquerda/direita). Usamos o
 * índice do array FILTRADO (pós-filter), não o do array original. Assim,
 * se a Elza desativar um produto no painel, o padrão zig-zag continua
 * consistente visualmente com os produtos restantes.
 *
 * @param {Object} product - Objeto com dados do produto
 * @param {number} renderedIndex - Índice no array filtrado (pós-filter)
 * @returns {HTMLElement} Elemento <article> pronto para inserção no DOM
 */
function createProductArticle(product, renderedIndex) {
  // Cria o <article> com a classe base e alternância zig-zag
  const article = document.createElement("article");
  // Índices ímpares (1, 3, 5...) recebem "reverse" para alternar o layout
  article.className =
    renderedIndex % 2 !== 0 ? "product-section reverse" : "product-section";

  // --- Coluna da Imagem ---
  const imageDiv = document.createElement("div");
  imageDiv.className = "product-image";
  const isFirst = renderedIndex === 0;
  imageDiv.appendChild(createProductImage(product, isFirst));

  // --- Coluna do Conteúdo ---
  const contentDiv = document.createElement("div");
  contentDiv.className = "product-content";

  // Título do produto (h3)
  const titleEl = document.createElement("h3");
  titleEl.className = "product-title";
  titleEl.textContent = product.name;

  // Descrição (parágrafo)
  const descEl = document.createElement("p");
  descEl.className = "product-description";
  descEl.textContent = product.description;

  // Preço formatado (parágrafo)
  const priceEl = document.createElement("p");
  priceEl.className = "product-price";
  priceEl.textContent = formatPrice(product.price_cents);

  // Monta a coluna de conteúdo
  contentDiv.appendChild(titleEl);
  contentDiv.appendChild(descEl);
  contentDiv.appendChild(priceEl);

  // Sabores (opcional — só renderiza se o produto tiver sabores)
  const flavorsSection = createFlavorsSection(product.flavors);
  if (flavorsSection) {
    contentDiv.appendChild(flavorsSection);
  }

  // Monta o artigo final (imagem + conteúdo)
  article.appendChild(imageDiv);
  article.appendChild(contentDiv);

  return article;
}

// =============================================================================
// 🚀 FUNÇÃO PRINCIPAL — RENDERIZAÇÃO DO CATÁLOGO
// =============================================================================

/**
 * Renderiza o catálogo de produtos no DOM.
 *
 * FLUXO:
 * 1. Filtra apenas produtos com is_active === true
 * 2. Cria os elementos DOM para cada produto ativo
 * 3. Injeta tudo no container #catalog-container
 * 4. Inicializa as animações de scroll (IntersectionObserver)
 *
 * POR QUE DocumentFragment?
 * Ao invés de adicionar cada <article> diretamente ao DOM (causando
 * múltiplos reflows/repaints), acumulamos tudo em um DocumentFragment
 * (que existe apenas em memória) e fazemos uma única inserção. Isso
 * melhora a performance de renderização.
 *
 * @param {Object[]} products - Array de objetos de produto
 */
function renderCatalog(products) {
  // Localiza o container onde os produtos serão injetados
  const container = document.getElementById("catalog-container");
  if (!container) {
    console.error(
      "[catalog.js] Elemento #catalog-container não encontrado no DOM.",
    );
    return;
  }

  // Filtra apenas produtos ativos (is_active === true)
  const activeProducts = products.filter((product) => product.is_active);

  // Cria um DocumentFragment para acumular os artigos em memória
  // antes de inseri-los no DOM de uma só vez (performance)
  const fragment = document.createDocumentFragment();

  // Itera sobre os produtos ATIVOS, usando o índice do array filtrado
  // para garantir a alternância correta do zig-zag visual
  activeProducts.forEach((product, renderedIndex) => {
    fragment.appendChild(createProductArticle(product, renderedIndex));
  });

  // Limpa o container (remove qualquer conteúdo prévio) e injeta os artigos
  container.innerHTML = "";
  container.appendChild(fragment);

  // Inicializa as animações de scroll para os novos elementos injetados.
  // A função initScrollAnimations() é declarada no animations.js e
  // precisa ser chamada APÓS os elementos existirem no DOM.
  if (typeof window.initScrollAnimations === "function") {
    window.initScrollAnimations();
  }
}

// =============================================================================
// ▶️ INICIALIZAÇÃO
// =============================================================================

// Renderiza o catálogo assim que este script for carregado.
// Como usamos "defer" na tag <script>, o DOM já está pronto neste ponto.
renderCatalog(productsData);
