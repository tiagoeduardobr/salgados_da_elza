# 🥟 Salgados da Elza — Backlog Fase 2 (E-commerce Leve & Admin)

> **Status:** Em Planejamento.
> Este backlog representa o próximo passo evolutivo do MVP, trazendo dinamismo ao cardápio e autonomia para a Dona Elza gerenciar seus produtos sem necessidade de deploy, utilizando **Firebase** como backend-as-a-service.
>
> 🤖 **Nota para IA:** Leia as regras e diretrizes de desenvolvimento no arquivo `AGENTS.md` antes de atuar.

---

## 📋 Legenda de Prioridades

| Símbolo | Significado |
| :---: | :--- |
| 🔴 | Prioridade **Crítica** |
| 🟡 | Prioridade **Alta** |
| 🟢 | Prioridade **Média** |
| 🔵 | Prioridade **Baixa** |

---

## 🔴 FASE 2.0 — PRE-REQUISITOS DE SEGURANÇA E LGPD (PRIORIDADE CRÍTICA — FAZER ANTES DE QUALQUER EPIC)

### TODO-SEC-PD-01 🔴 Implementar Política de Privacidade LGPD

- [ ] Criar `privacy.html` com texto explicando: site estático, sem coleta de dados, WhatsApp/Pix públicos, Firebase só catálogo público na Fase 2.
- [ ] Link no footer de `index.html`: `<a href="privacy.html" class="privacy-link">Política de Privacidade</a>`
- [ ] Estilo: herda `main.css`, footer-like, mobile-first.
- [ ] Critérios: ✓ Arquivo criado, ✓ Link no footer, ✓ Texto cobre MVP + Fase 2, ✓ Sem trackers/cookies.

### TODO-SEC-PD-02 🔴 Hardening HSTS no MVP

- [ ] Adicionar meta tag no `<head>` de `index.html`: `<meta http-equiv="Strict-Transport-Security" content="max-age=31536000; includeSubDomains">`
- [ ] Critérios: ✓ Meta adicionada, ✓ GitHub Pages HTTPS forçado validado.

### TODO-SEC-PD-03 🔴 Preparar CSP para Firebase Fase 2

- [ ] Atualizar CSP em `index.html`: `connect-src` adicionar `https://*.firebaseio.com https://*.googleapis.com https://*.googleusercontent.com`
- [ ] Manter resto rígido. Testar com devtools CSP reports.
- [ ] Critérios: ✓ CSP expandida sem quebrar fonts/WhatsApp, ✓ Nenhum `unsafe-inline` adicionado.

---

## Epic 1 — Experiência de E-commerce (Front-end Dinâmico)

> Evoluir a landing page estática para um comportamento de loja virtual leve no front-end, mantendo a performance e o envio via WhatsApp.

### TODO-FE-01 🔴 Renderização Dinâmica do Catálogo

**Descrição:** Remover o HTML hardcoded dos produtos e criar um script JavaScript que renderiza os cards (*articles*) a partir de um array de objetos (JSON). Este é o passo preparatório fundamental antes de conectarmos o Firebase.

**Critérios de aceitação detalhados (Passo-a-passo):**

- [ ] Extrair todos os `<article class="product-section">` do `index.html` e anotá-los (eles serão o nosso template). Em seu lugar, deixar apenas uma `<div id="catalog-container"></div>`.
- [ ] Em `assets/js/catalog.js` (a criar), definir um array constante `productsData` imitando a estrutura do Firebase, com propriedades: `id` (string/number), `name`, `description`, `price_cents` (int), `image_url`, `flavors` (array, opcional) e uma importantíssima flag **`is_active`** (boolean).
  
  - *Dica Didática:* Guardar preço em centavos (`1200` em vez de `12.00`) evita bugs clássicos de arredondamento no JavaScript (IEEE 754). No HTML formatamos com `Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })`.
  
- [ ] Criar função `renderCatalog(products)` que faz interações no array via `.filter(p => p.is_active)` e `.map()`, retornando uma String longa de HTML APENAS dos produtos ativos.
- [ ] Injetar essa string no DOM (`document.getElementById('catalog-container').innerHTML = ...`).
- [ ] **Auditoria de Segurança (OWASP A03/XSS):** Como usaremos `.innerHTML`, qualquer texto vindo do banco (nome, descrição) DEVE ser tratado/escapado, ou a injeção deve ser feita criando os nós via `document.createElement()` e `.textContent`, para impedir ataques de *Stored XSS* caso o banco seja comprometido.
- [ ] Garantir que o JS mantenha as exatas classes de animação e estruturas semânticas, atributos `alt` de imagem e fallback `loading="lazy"`.
- [ ] **Dependência Crítica de Animação:** O `assets/js/animations.js` atual usa `DOMContentLoaded` para escanear a classe `.product-section`. Como os produtos agora nascerão *depois* via JS, você precisará refatorar o `animations.js` exportando uma função (ex: `initScrollAnimations()`) e chamá-la **após** o `renderCatalog` finalizar as injeções no DOM.

---

### TODO-FE-02 🔴 Sistema de Carrinho de Compras (Local Storage)

**Descrição:** Implementar um carrinho de compras simples no front-end para que o cliente possa selecionar múltiplos itens e quantidades diferentes.

**Critérios de aceitação detalhados (Passo-a-passo):**

- [ ] No HTML de cada produto (via `renderCatalog`), injetar um pequeno componente/bloco para o "Controle de Quantidade" (Botão `-`, Input *readonly* de número, Botão `+`).
  
  - **Auditoria de Acessibilidade (WCAG 2.1):** Estes botões de controle `-` e `+` **obrigam** o uso de `aria-label` descritivos (ex: `aria-label="Aumentar quantidade de [Nome do Salgado]"`), botão `<button type="button">` semânticos (nada de divs com `onclick`) e suporte navegação por `Tab` e `Enter`.
  
- [ ] Criar objeto/classe `Cart` em JS para manejar o estado (ex: `[{ id: 1, qty: 2 }]`).
- [ ] Ao clicar nos botões, atualizar o estado do array no JS e IMEDIATAMENTE re-salvar no Local Storage: `localStorage.setItem('elzaCart', JSON.stringify(cartArray))`.
- [ ] Criar um **Floating Cart Widget** (Bottom ou lateral fixo visível via CSS `position: sticky` ou `fixed`) onde deve constar o SVG de "Bolsinha de compra" com a quantidade total de itens (uma bolinha em cima com a soma).
- [ ] O componente também deve ter a soma do dinheiro (valor total calculado cruzando `qty` com o `price_cents`).
- [ ] **Auditoria de UX/Segurança:** Sempre que a página carregar (reload), o script deve ler do Local Storage, cruzar com o array de `productsData` atual e SANEAR. Se o `id` não existe mais no cardápio de hoje, remova essa linha do objeto "Cart". Assim impedimos um "pedido fantasma" caso a Elza delete um sabor no seu backend.

---

### TODO-FE-03 🟡 Checkout Estruturado via WhatsApp

**Descrição:** Evoluir o CTA principal interligando-o com o carrinho de compras.

**Critérios de aceitação detalhados (Passo-a-passo):**

- [ ] Modificar o botão "Fazer Pedido" (aquele que já existe na `<section class="cta-section">`) para, no clique (evento `addEventListener`), processar os dados do carrinho, e PREVENIR sua funcionalidade base padrão caso o carrinho esteja vazio (`preventDefault`).
- [ ] **Integração de UX:** Fazer com que o clique no **Floating Cart** (criado no TODO-FE-02) execute a mesma função de Checkout do CTA principal da página.
- [ ] Se carrinho vazio: Mostrar um "SweetAlert" simples ou um Toast dizendo: *"Seu carrinho está vazio! Selecione os deliciosos salgados acima."* (Melhoria visível de UX).
- [ ] Se houver carrinho: a lógica JS irá fazer um "`.reduce()`" no carrinho montando um text-block formatado:

  ```text
  Olá! Gostaria de fazer o seguinte pedido:
  - 2x Assado de Calabresa (R$ 20,00)
  - 1x Pastel Assado Sabor Frango (R$ 8,00)
  ---
  *Total:* R$ 28,00
  ```

- [ ] Criar a URL com `encodeURIComponent()` (Para transformar espaços em `%20`, novas linhas em `%0A`, garantido que todo Zap web e App vai abrir as quebras de linha corretas).
- [ ] Fazer o redirecionamento com `window.open(url, '_blank')`.
- [ ] Limpar o Carrinho pós-checkout: `localStorage.removeItem('elzaCart')` depois de redirecionar para a Elza começar com carrinho limpo se voltar à página.

---

### TODO-FE-04 🟢 Widget de Status (Aberto/Fechado)

**Descrição:** Adicionar uma badge no cabeçalho ou CTA indicando se a loja está recebendo pedidos ou não, baseado no horário de funcionamento.

**Critérios de aceitação detalhados (Passo-a-passo):**

- [ ] Criar função isolada em `js/status.js` chamada `isStoreOpen()` que faz `new Date()` e checa o `getHours()` limitando aos dias úteis e fuso de Brasília (`UTC-3`). Exemplo base: ter-sáb, 08h às 19h (Vamos mapear os horários).
- [ ] No Header (junto a logo), injetar a UI:
  
  - Uma bolinha HTML div redonda (`background: #4ade80` ou `#f87171`) para aberto e fechado.
  - Texto simples: *"🔴 Fechado"* ou *"🟢 Aberta Agora"*.
  
- [ ] Caso a loja esteja FECHADA, **NÃO impedir a compra** (isso prejudica as vendas), mas alterar a mensagem final do WhatsApp! Embutir um aviso extra pre-programado no checkout (TODO-FE-03) tipo: *(Mandando fora do horário! Aguardando o retorno para o próximo dia útil)*.

---

## Epic 2 — Backend Serverless (Firebase Database)

> Conectar a aplicação front-end a um banco de dados em tempo real no Firebase.

### TODO-BaaS-01 🔴 Configuração do Projeto Firebase

**Descrição:** Setup inicial do Firebase Firestore e Storage.

**Critérios de aceitação detalhados (Passo-a-passo):**

- [ ] Acessar `console.firebase.google.com` e criar projeto (Tier Grátis).
- [ ] Habilitar **Autenticação** (Email/Senha), **Firestore Database** (NoSQL em tempo real).
- [ ] Exportar as credenciais (`firebaseConfig` object contendo `apiKey`, `projectId`, `appId`).
- [ ] Criar um pacote base em JS  `assets/js/firebase-init.js` importando as dependências Firebase V9 (SDK modular) usando as CDNs públicas ou pacote Local.
- [ ] Aplicar no Firebase as proteções de domínios: Configurar `apiKey` nas Restrições de API do Google Cloud para aceitar request somente do GitHub Pages (`tiagoeduardobr.github.io`) e localhost.
- [ ] **Auditoria de Segurança (CSP):** No `index.html`, a meta-tag `Content-Security-Policy` no atributo `connect-src` deve mudar de `'none'` para `connect-src 'self' https://firestore.googleapis.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com`. Isso bloqueará conexões não desejadas e permitirá somente Firebase Authentication e Firewall Database, barrando XSS e exfiltração de dados (OWASP Top 10 - A03).

---

### TODO-BaaS-02 🔴 Integração Catálogo ↔ Firestore

**Descrição:** Substituir a fonte de dados provisória (JSON array) pelo banco de dados na nuvem da Google em tempo real.

**Critérios de aceitação detalhados (Passo-a-passo):**

- [ ] Entrar no Painel do Firebase Database, iniciar a coleção raiz `products`, preencher com documentos idênticos às propriedades de objeto feitas no TODO-FE-01.
- [ ] No JS do front-end original (`assets/js/catalog.js`), utilizar os métodos do Firebase `getDocs()` ou `onSnapshot()` conectando-se na coleção `products`.
  
  - *Dica Didática:* `onSnapshot()` permite que ser houver edição na Nuvem, o site dos usuários em tempo real vai atualizar dados instantaneamente, é "mágico", mas gasta "reads" (Leituras faturadas) toda hora. O mais pragmático como é uma padaria local é o `getDocs()` que roda 1x por página.
  
- [ ] Aplicar UI de feedback: Quando abrir o site, `document.innerHTML` no componente de listagem deve ter classe `<div class="skeleton"></div>` ou `<em>Carregando o forno...</em>` visível até o banco dar resposta (Aguardar a Promise do `getDocs()` finalizar) para depois injetar os cartões HTML.
- [ ] **Auditoria de SEO (Rich Results):** Remover a tag `<script type="application/ld+json">` estática do `index.html`. No final da Promessa que baixou o array de produtos, criar o payload JSON-schema programaticamente com `JSON.stringify` e inseri-lo no `<head>` injetando o novo script de dados. Isso mantém os WebBots enxergando o `Menu` completo em conformidade ao Google Standards sem necessidade de renderização SSR pesada.

---

## Epic 3 — Autonomia da Elza (Painel Administrativo)

> Desenvolver uma rota protegida e interface para gestão autônoma do negócio.

### TODO-ADM-01 🔴 Autenticação (Login Segurado)

**Descrição:** Garantir que o painel de administração só possa ser acessado pela Dona Elza.

**Critérios de aceitação detalhados (Passo-a-passo):**

- [ ] Na raiz, criar `admin.html`. Ela NÃO será uma página indexável (Usar Tag Meta `robots: noindex, nofollow`).
- [ ] Na página de admin, haverá `div#login-view` e `div#dashboard-view` escondido com CSS nativo (`display: none`).
- [ ] Utilizar o pacote de Firebase Auth: `signInWithEmailAndPassword(auth, email, password)`.
- [ ] Implementar fluxo no JS em `assets/js/admin.js` interceptando o state: `onAuthStateChanged()`. Se existir um usuário autenticado e ativo na máquina (Sessão viva salva no cache), o Login é escondido, e a Dashboard aparece, bloqueando o visual do painel público. Caso não haja usuário, vice-versa.
- [ ] Implementar um botão limpo "Fazer Logoff" com `signOut(auth)` simples.
- [ ] (Server Side security): Firestore Database Security Rules. Modificar regras padrão no painel pra que APENAS usuários autenticados via Auth consigam escrever/deletar na tabela de `products`:

  ```ruby
  match /products/{document=**} {
     allow read: if true;
     allow write: if request.auth != null;
  }
  ```

  Isso protege o banco que seria público. Conquistei assim o conceito C de Cryptography do CIA da segurança.

---

### TODO-ADM-02 🔴 CRUD do Cardápio

**Descrição:** Interface central para gerenciar os salgados anunciados na Landing Page principal.

**Critérios de aceitação detalhados (Passo-a-passo):**

- [ ] Na UI do `admin.html` aba *"Gerenciar Salgados"*: Fazer tabela limpa em HTML puxando os produtos lidos via Firestore (`getDocs`).
- [ ] Criar a UI (Modal ou Nova Form): *Nome*, *Preço (string que vamos converter pra centavos na saída)*, *Descrição do produto*, *Sabores Extra* e **Status de Exibição (Toggle: Visível / Oculto)**.
- [ ] Lógica Ligar botão Confirmar com Cloud Function/SDK `addDoc()` ou `setDoc()` do FirebaseV9. Injetar notificação e dar reload na tabela.
- [ ] A tabela deve ter os Actions do lado Direito: Botão 👁/🚫 Ocultar (Alterna a prop `is_active`), 🖊 Edit (Reabre Formulário), 🗑 Delete. Delete usará método Firebase `deleteDoc()`.
  
  - **Auditoria de Acessibilidade (Admin UI):** Ícones das "actions" devem possuir atributos `title` e classes `sr-only` (textos ocultos visualmente) para que leitores de tela na máquina da cliente ou teclado entendam que cada ícone faz uma função crítica.
  
- [ ] Sempre injetar no `delete` o pop-up nativo de salvaguarda `window.confirm("Atenção, isso deletará esse salgado definitivamente do projeto de e-commerce! Recomenda-se apenas 'Ocultar'. Continuar?")` para impedir destruição da tabela por engano/clique acidental da cliente.

---

### TODO-ADM-03 🟡 Upload de Imagens do Cardápio

**Descrição:** Permitir upload de fotos dos produtos direto do celular/computador da Elza para os servidores do Google.

**Critérios de aceitação detalhados (Passo-a-passo):**

- [ ] Ativar *Firebase Storage* no painel Google, habilitando as **Security Rules** para `write: request.auth != null`.
- [ ] No Formulário (Adição/Edição de produto), criar um input puro do HTML `type="file" accept="image/png, image/jpeg, image/webp"`.
- [ ] Lógica para UX performática: ao arrastar a foto pra área (File reader nativo), rodar JS que extrai object e pré-visualiza na tela pra ela aprovar se cortou certo/viu a foto antes, não subindo cegamente (Melhor visibilidade).
- [ ] Submissão do Firebase SDK Storage V9 (`uploadBytes` + `getDownloadURL`). Essa promessa gerará uma link web absoluta e pública. Inseri-lo no campo de banco de dados `image_url` lá na etapa (BaaS-02/Admin-02).
- [ ] Se um produto for apagado no CRUD Administrador (Delete), engatar uma segunda Promise no Storage (`deleteObject`) que procura no Folder pelo path do salgado e apaga o arquivo junto com o produto! Se não fizermos isso, vai virilizar muito "lixo" caro sem uso num bucket de imagens do GCP.

---

### TODO-ADM-04 🟢 Gestão de Configurações Dinâmicas (MVP Settings)

**Descrição:** Migrar variáveis soltas no código do MVP para ficarem sob controle da Elza no Painel Admin.

**Critérios de aceitação detalhados (Passo-a-passo):**

- [ ] Criar coleção simples de nome fixo no Firestore chamada: `storeSettings` e criamos o documento hardcoded chamado `config`. (Ninguém gera doc novo, é uma tabela de 1 linha de Database).
- [ ] Campos de texto gerados no doc Firestore: `whatsapp_number_raw` e `pix_key` `pix_copy_bank`. E Campos Objetos/Array para o controle do relógio como `opening_hours: { weekday_open: 8, weekday_close:18 }`.
- [ ] Admin HTML deve possuir a aba *"🔧 Ajustes do Site"*. Que mapeará os 4 valores descritos e usará do SDK o método de Database `updateDoc()` em cima desse documento base `config`.
- [ ] Modificar o código do front (`index.html` e `js/status.js`) que validava chaves hardcoded e puxar direto do Firebase. É preciso remapear a injeção da Chave Pix no atributo `data-pix-key` do botão de cópia atual, e atualizar o `href` do botão principal do WhatsApp com o número dinâmico do banco.

---

## Resumo Arquitetural

- **Front-end:** HTML Semântico, Vanilla JavaScript, CSS Puro (mantendo a essência do MVP).
- **Database & Storage:** Firebase Cloud Firestore + Firebase Storage.
- **Autenticação Admin:** Firebase Auth.
- **Infraestrutura Exigida:** Nenhuma gestão de servidor e zero custo fixo pra a cliente (Free Tier do Firebase sobra para este tráfego).
