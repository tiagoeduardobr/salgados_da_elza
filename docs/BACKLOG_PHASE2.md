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

### TODO-SEC-PD-02 🔴 Validar HTTPS Forçado no GitHub Pages

- [ ] Validar no repositório GitHub que a opção "Enforce HTTPS" está ativa em *Settings → Pages*.
- [ ] Documentar em comentário HTML no `<head>` que o HSTS é gerenciado pelo GitHub Pages (meta tag `Strict-Transport-Security` é ignorada por navegadores quando servida via HTML; o header real é entregue pela infraestrutura do GitHub).
- [ ] Critérios: ✓ HTTPS forçado validado, ✓ Documentação adicionada.

### TODO-SEC-PD-03 🔴 Preparar CSP para Firebase Fase 2

- [ ] Atualizar CSP em `index.html`: `connect-src` mudar de `'none'` para `'self' https://firestore.googleapis.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com`. Usar domínios explícitos — evitar wildcards como `*.googleapis.com` que são excessivamente permissivos.
- [ ] Adicionar também `script-src` para as CDNs do Firebase SDK se utilizar importação via CDN.
- [ ] Manter resto rígido. Testar com DevTools → Console (violações CSP) e Network (requests bloqueados).
- [ ] Critérios: ✓ CSP expandida sem quebrar fonts/WhatsApp, ✓ Nenhum `unsafe-inline` adicionado, ✓ Nenhum wildcard `*` nos domínios.

> ⚠️ **Nota:** Este TODO unifica a configuração de CSP para toda a Fase 2. O TODO-BaaS-01 referencia esta configuração em vez de duplicá-la.

---

## Epic 1 — Experiência de E-commerce (Front-end Dinâmico)

> Evoluir a landing page estática para um comportamento de loja virtual leve no front-end, mantendo a performance e o envio via WhatsApp.

### TODO-FE-01 🔴 Renderização Dinâmica do Catálogo

> ✅ **Concluído em:** 2026-03-26 às 21:50 (UTC-3)

**Descrição:** Remover o HTML hardcoded dos produtos e criar um script JavaScript que renderiza os cards (*articles*) a partir de um array de objetos (JSON). Este é o passo preparatório fundamental antes de conectarmos o Firebase.

**Critérios de aceitação detalhados (Passo-a-passo):**

- [x] Extrair todos os `<article class="product-section">` do `index.html` e anotá-los (eles serão o nosso template). Em seu lugar, deixar apenas uma `<div id="catalog-container"></div>`.
- [x] Em `assets/js/catalog.js` (a criar), definir um array constante `productsData` imitando a estrutura do Firebase, com propriedades: `id` (string/number), `name`, `description`, `price_cents` (int), `image_url`, `flavors` (array, opcional) e uma importantíssima flag **`is_active`** (boolean).
  
  - *Dica Didática:* Guardar preço em centavos (`1200` em vez de `12.00`) evita bugs clássicos de arredondamento no JavaScript (IEEE 754). No HTML formatamos com `Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })`.
  
- [x] Criar função `renderCatalog(products)` que faz interações no array via `.filter(p => p.is_active)` e `.map()`, retornando uma String longa de HTML APENAS dos produtos ativos.
- [x] Injetar essa string no DOM (`document.getElementById('catalog-container').innerHTML = ...`).
- [x] **Auditoria de Segurança (OWASP A03/XSS):** Como usaremos `.innerHTML`, qualquer texto vindo do banco (nome, descrição) DEVE ser tratado/escapado, ou a injeção deve ser feita criando os nós via `document.createElement()` e `.textContent`, para impedir ataques de *Stored XSS* caso o banco seja comprometido.
- [x] Garantir que o JS mantenha as exatas classes de animação e estruturas semânticas, atributos `alt` de imagem e fallback `loading="lazy"`.
- [x] **Dependência Crítica de Animação:** O `assets/js/animations.js` atual usa `DOMContentLoaded` para escanear a classe `.product-section`. Como os produtos agora nascerão *depois* via JS, você precisará refatorar o `animations.js` exportando uma função (ex: `initScrollAnimations()`) e chamá-la **após** o `renderCatalog` finalizar as injeções no DOM.

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

### TODO-FE-03 🟡 Preparação do Checkout (Carrinho)

**Descrição:** Evoluir o CTA principal interligando-o com o carrinho de compras, fazendo a validação de dados antes de acionar a camada de pagamento.

**Critérios de aceitação detalhados (Passo-a-passo):**

- [ ] Modificar o botão "Fazer Pedido" (aquele que já existe na `<section class="cta-section">`) para, no clique (evento `addEventListener`), processar os dados do carrinho, e PREVENIR sua funcionalidade base padrão (`preventDefault`).
- [ ] **Integração de UX:** Fazer com que o clique no **Floating Cart** (criado no TODO-FE-02) execute a mesma rotina de Checkout do CTA principal da página.
- [ ] Se carrinho vazio: Mostrar um "SweetAlert" simples ou um Toast de feedback nativo dizendo: *"Seu carrinho está vazio! Selecione os deliciosos salgados acima."* (Prevenção de conversão fantasma).
- [ ] Se houver carrinho cheio: a lógica JS irá fazer um "`.reduce()`" no array de produtos em memória, montando um text-block formatado puro (sem enviá-lo imediatamente).

  ```text
  Detalhes do pedido:
  - 2x Assado de Calabresa (R$ 20,00)
  - 1x Pastel Assado Sabor Frango (R$ 8,00)
  ---
  *Total:* R$ 28,00
  ```

- [ ] Deixar essa Data String e os totais prontos e encapsulados em memória para que o Modal do **TODO-PAY-02** os consuma para gerar a cobrança e conduzir o fluxo final do WhatsApp visando evitar redundâncias de redirecionamento.

---

### TODO-FE-04 🟢 Widget de Status (Aberto/Fechado)

**Descrição:** Adicionar uma badge no cabeçalho ou CTA indicando se a loja está recebendo pedidos ou não, baseado no horário de funcionamento.

**Critérios de aceitação detalhados (Passo-a-passo):**

- [ ] Criar função isolada em `js/status.js` chamada `isStoreOpen()` que utiliza `new Intl.DateTimeFormat('pt-BR', { timeZone: 'America/Sao_Paulo', hour: 'numeric', weekday: 'short' })` para extrair hora e dia da semana com fuso correto (sem hardcodar `UTC-3`, pois a API IANA resolve automaticamente eventuais ajustes futuros). Exemplo base: ter-sáb, 08h às 19h (mapear os horários com a Elza).
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
- [ ] **Auditoria de Segurança (CSP):** Validar que a configuração CSP feita no TODO-SEC-PD-03 cobre todos os domínios necessários para o Firebase funcionar corretamente. Testar com DevTools que nenhum request é bloqueado.

---

### TODO-BaaS-02 🔴 Integração Catálogo ↔ Firestore

**Descrição:** Substituir a fonte de dados provisória (JSON array) pelo banco de dados na nuvem da Google em tempo real.

**Critérios de aceitação detalhados (Passo-a-passo):**

- [ ] Entrar no Painel do Firebase Database, iniciar a coleção raiz `products`, preencher com documentos idênticos às propriedades de objeto feitas no TODO-FE-01.
- [ ] No JS do front-end original (`assets/js/catalog.js`), utilizar os métodos do Firebase `getDocs()` ou `onSnapshot()` conectando-se na coleção `products`.
  
  - *Dica Didática:* `onSnapshot()` permite que, se houver edição na Nuvem, o site dos usuários em tempo real atualize dados instantaneamente — é "mágico", mas gasta "reads" (Leituras faturadas) toda hora. O mais pragmático, como é uma padaria local, é o `getDocs()` que roda 1x por página.
  
- [ ] Aplicar UI de feedback: Quando abrir o site, `document.innerHTML` no componente de listagem deve ter classe `<div class="skeleton"></div>` ou `<em>Carregando o forno...</em>` visível até o banco dar resposta (Aguardar a Promise do `getDocs()` finalizar) para depois injetar os cartões HTML.
- [ ] **Auditoria de SEO (Rich Results):** Manter a tag `<script type="application/ld+json">` estática no `index.html` como **fallback** (caso o JS falhe ou o bot não renderize o script). No final da Promise que baixou o array de produtos, **sobrescrever** o conteúdo do JSON-LD existente com o payload atualizado via `JSON.stringify`, garantindo que os dados estejam sempre em sincronia com o Firebase sem perder cobertura se o JS não executar.

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
- [ ] **Proteção Anti-Brute-Force (UX):** Após 5 tentativas falhadas consecutivas, desabilitar o botão de login por 60 segundos e exibir mensagem: *"Muitas tentativas. Aguarde 1 minuto."* A mensagem de erro em caso de falha deve ser genérica: *"Credenciais inválidas."* — nunca diferenciar se o e-mail existe ou não (OWASP A07).
- [ ] Implementar um botão limpo "Fazer Logoff" com `signOut(auth)` simples.
- [ ] (Server Side security): Firestore Database Security Rules. Modificar regras padrão no painel pra que APENAS o UID específico da Dona Elza consiga escrever/deletar na tabela de `products`:

  ```ruby
  match /products/{document=**} {
     allow read: if true;
     allow write: if request.auth != null && request.auth.uid == 'UID_DA_ELZA';
  }
  ```

  *Dica Didática:* Restringir por UID (em vez de apenas `request.auth != null`) impede que qualquer pessoa que crie uma conta no Firebase Auth consiga escrever no banco. Isso garante o pilar de **Confidencialidade (C)** da tríade CIA da segurança da informação.

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
- [ ] No Formulário (Adição/Edição de produto), criar um input puro do HTML `type="file" accept="image/png, image/jpeg, image/webp"`. Limitar tamanho máximo a **5 MB**.
- [ ] **Auditoria de Segurança (OWASP A08 — Data Integrity):** Validar o tipo MIME real do arquivo no JavaScript antes do upload, lendo os *magic bytes* do cabeçalho via `FileReader` (o atributo `accept` do input é apenas uma sugestão para o navegador e pode ser burlado). Rejeitar qualquer arquivo que não seja imagem válida.
- [ ] Lógica para UX performática: ao arrastar a foto pra área (File reader nativo), rodar JS que extrai object e pré-visualiza na tela pra ela aprovar se cortou certo/viu a foto antes, não subindo cegamente (Melhor visibilidade).
- [ ] Submissão do Firebase SDK Storage V9 (`uploadBytes` + `getDownloadURL`). Essa promessa gerará um link web absoluto e público. Inseri-lo no campo de banco de dados `image_url` lá na etapa (BaaS-02/Admin-02).
- [ ] Se um produto for apagado no CRUD Administrador (Delete), engatar uma segunda Promise no Storage (`deleteObject`) que procura no Folder pelo path do salgado e apaga o arquivo junto com o produto! Se não fizermos isso, vai acumular muito "lixo" caro sem uso num bucket de imagens do GCP.

---

### TODO-ADM-04 🟢 Gestão de Configurações Dinâmicas (MVP Settings)

**Descrição:** Migrar variáveis soltas no código do MVP para ficarem sob controle da Elza no Painel Admin.

**Critérios de aceitação detalhados (Passo-a-passo):**

- [ ] Criar coleção simples de nome fixo no Firestore chamada: `storeSettings` e criamos o documento hardcoded chamado `config`. (Ninguém gera doc novo, é uma tabela de 1 linha de Database).
- [ ] Campos de texto gerados no doc Firestore: `whatsapp_number_raw`, `pix_key`, `merchant_name` (Ex: "Elza Salgados"), `merchant_city` (Ex: "Blumenau"). E Campos Objetos/Array para o controle do relógio como `opening_hours: { weekday_open: 8, weekday_close: 18 }`.
- [ ] Admin HTML deve possuir a aba *"🔧 Ajustes do Site"*. Que mapeará os valores descritos e usará do SDK o método de Database `updateDoc()` em cima desse documento base `config`.
- [ ] Modificar o código do front (`index.html` e `js/status.js`) que validava chaves hardcoded e puxar direto do Firebase. É preciso remapear a injeção da Chave Pix no atributo `data-pix-key` do botão de cópia atual, e atualizar o `href` do botão principal do WhatsApp com o número dinâmico do banco.

---

## Epic 4 — Central de Pagamentos (Frontend & Pix)

> Evolucionar a landing page do MVP substituindo a ida cega ao WhatsApp por um Checkout seguro focado na experiência Pix com valor automático.

### TODO-PAY-01 🟡 Gerador de Payload Pix EMV (Módulo Core)

**Descrição:** Criar módulo JavaScript isolado e testável que receba parâmetros base (chave, valor) e gere um payload Pix estático compatível com a norma EMV do BACEN.

**Critérios de aceitação detalhados (Passo-a-passo):**

- [ ] Criar o arquivo `assets/js/pix-payload.js` para isolar estritamente a lógica criptográfica e financeira.
- [ ] Implementar a concatenação rigorosa dos campos EMV (00, 01, 26, 52, 53, 54, 58, 59, 60, 63) conforme manual do Banco Central.
- [ ] Desenvolver função em JavaScript puro para o cálculo de `CRC16-CCITT` (Polinômio `0x1021`), obrigatória na assinatura do BR Code.
- [ ] A função exportada (`generatePixPayload`) deve receber o valor do carrinho sanitizado (convertendo a string monetária para cents/inteiro visando segurança float em JS) e retornar a string correspondente ao "Pix Copia e Cola".
- [ ] **Auditoria de Segurança (OWASP A03 / XSS):** Adicionar função sanitizadora interna que trate Inputs (nome da cidade, beneficiário), removendo acentuação e limitando tamanho restrito em caracteres, o que previne corrupções na leitura do QRCode por aplicativos bancários rígidos.

---

### TODO-PAY-02 🟡 Modal de Checkout com Pix + Workflow WhatsApp

**Descrição:** Modificar o fluxo do Carrinho. Em vez de ir cego para o WhatsApp, abrir um Modal de Pagamento Interativo que propõe o pagamento PIX, e guia o usuário no Workflow de envio anexado via Zap. E introduz o espaço para Mercado Pago (*Placeholder* para escalarem os passos seguintes).

**Critérios de aceitação detalhados (Passo-a-passo):**

- [ ] Integrar no `assets/js/catalog.js` (ou CTA principal): ao fechar o carrinho, prevenir redirect padrão (`e.preventDefault()`) e invocar um Modal Acessível (`role="dialog"`, tag `aria-modal="true"`, escopo de foco focado e suporte de teclado nativo ESC).
- [ ] O Modal exibe o Resumo da Compra e lê o Valor do Cart/BD para invocar e plotar UI do gerador nativo em `pix-payload.js`.
- [ ] Exibir UI nativa completa e conversiva do Pix: Ícone Pix/Banco Central, Botão "Copiar Chave", Input tipo *readonly* com o texto Copia-e-Cola gerado, e renderização visual do QR Code Canvas via CDN segura leve (ex: `.qrcode` ou lib própria de HTML5).
- [ ] **Fluxo Operacional de Pós-Pagamento e UX (Core Task):** Abaixo da área do Pix, preposicionar o botão fundamental primário do sistema que leva para atendimento fechado: *"🔴 Já paguei! Enviar Comprovante para o WhatsApp"*.
- [ ] Ao trigar (*click*) no referido CTA Pós-Pagamento Pix, usar o URI Component de escape gerando mensagem formal e montando o Array (`encodeURIComponent` do text). Ex: *"Olá Dona Elza! Realizei o pagamento PIX de R$ XX,XX. Segue o comprovante em anexo! Detalhes do pedido: [array-loop-text]"*. Logo após, engatilhar liberação / limpeza do cache front-end (localStorage do Carrinho varrido para vazio).
- [ ] **UX Fluída e Governança:** No final absoluto do Modal, colocar um botão fantasma secundário *"Mercado Pago / Cartões [Em Breve]"* engessando seu uso via estado de código HTML nativo (`disabled="true"`). Tooltip informativo justificando o estado e acalmando UX para implantações vindouras.

---

### TODO-PAY-03 🟡 Página Autônoma de Pagamento (`payment.html`)

**Descrição:** Renderização independente e pública num ambiente seguro voltada especificamente em resolver e finalizar Pagamentos sob Demanda e Cobranças customizadas originadas do Link da Cliente Elza.

**Critérios de aceitação detalhados (Passo-a-passo):**

- [ ] Iniciar na raiz arquivo HTML estrutural (`payment.html`). Reaproveitando header e folha local referenciada (`main.css`). Declarar index blocks visando impedir motores de busca de poluir tráfego (`<meta name="robots" content="noindex, nofollow">`).
- [ ] **Fluxo Fechado Dinâmico (Via Wizzard/Query Param):** Validar Fetch Backend/Firestore nativamente via ID: Se endereço do browser invocar `?order=XYZ123`, bater e requerer na base `payment_links` referenciado. Imprimir Card com a Listagem Dinâmica dos itens escolhidos ("*Recibo: 2x Assado, 1x Croissant - Total: R$ 28,00*") travando a edição de campos (`disabled input`).
- [ ] **Fluxo Aberto Manual (Fallback):** Sem query params inseridos pelo User no Request original — Exibir UI limpa contendo um único Field Monetário (`<input type="text" inputmode="numeric">`). Proteger JS bloqueando `< 0`, submetendo o dado apenas ao clique e invocando o respectivo processamento da `class PixPayload`. Modela texto limpo pra BRL (`R$ XX,XX`).
- [ ] Herda identicamente as funções e templates de interface de UX idealizados e fechados no TODO-PAY-02, a saber: Card QRCode PIX, CTA de Confirmação pelo Workflow do WhatsApp resgatado pro contexto ("Enviar Comprovante de Pagamento"), e a flag visual suspensa `disabled` indicadora de opção no MP/Cartão.

---

## Epic 5 — Ferramentas Financeiras Admin e Gateways

> Expandir a retaguarda com painéis para controle avançado à Elza e linkagem criptografada via Serverless para Checkouts.

### TODO-PAY-04 🟢 Ferramenta Admin: Gerador Inteligente e Controle UI

**Descrição:** Integrar na interface de Admin protegida a capacidade geradora orgânica de links fechados associados nativamente à Cloud Base, sem necessidade da Dona Elza escrever links massivos em barras do navegador.

**Critérios de aceitação detalhados (Passo-a-passo):**

- [ ] Criar divisão visual de bloco em `admin.html`: aba gerencial nomeada "🔗 Links de Pagamento", separando form Wizzard de Tabela logística (`table`).
- [ ] No form, criar CTA Primário: *"Criar Link para Cobrança"*. Ao clickar, Modal/Drawer abre a relação dos Itens da loja num painel tipo Checkout de Point-of-Sale. Elza insere a numeração iterativamente. Frontend computa matematicamente sub-totals bloqueando intervenção de erros numéricos e floats descompassados na tela total de centavos.
- [ ] Disparar promise Firebase Cloud SDK `addDoc()/setDoc()` à *Collection* `payment_links` com objeto contendo json string do Payload dos Produtos e Status Flag ativa "Pendente/Aguardando".
- [ ] Responder ao Frontend após resposta (HTTP 200/Firebase): Imprimir visualmente e gerar string short `https://site.com/payment.html?order=[CHAVE_ALEATORIA_ENCRIPTADA]`.
- [ ] **Auditoria de Capacidades UX (Web Share API Native):** Providenciar botoeiras contíguas e úteis à visualização do link entregue e renderizado:
  - Botão Icon Copy local (`navigator.clipboard.writeText(url)`) devolvendo notificação silenciosa ("Link copiado!").
  - Botão Icon Compartilhar API Nativa Browser (`navigator.share({ title: 'Pagamento - Salgados da Elza', url: url })`) provocando abertura de interface em nível do Sistema Operacional (iOS, Android, Windows) contendo App Connecters (Ex: Compartilhar no Zap via Botão Direto). Fallbacks defensivos (`try/catch`) aplicados onde for web-view morta limitadora ou browser Desktop antigo, retrocedendo para "Copy" natural se der fail no share call em ambiente web.
- [ ] Embutir visualmente no design macro da aba um botão solitário: *"Gerar Link sem valor"* que joga no Output diretamente a Path absoluta padrão `/payment.html`. (Funciona igual máquina Mercado Pago).
- [ ] Na área administrativa, Tabela histórica renderizando ID Curto de Pedido, Data da Emissão, Valor Base Integral, Tag de Cor (Status: Aberto / Confirmed), e Action Column.

---

### TODO-PAY-05 🔵 Integração Mercado Pago Node Engine (Checkout Pro Endpoint)

**Descrição:** Implementação arquitetural escalável server-side faturando Cartões com alto índice de segurança protegida da exposição Front End, provendo Workflow reverso limpo Pós-Pagamento.

**Critérios de aceitação detalhados (Passo-a-passo):**

- [ ] Alocar, através de Setup Node e Server Firebase-CLI, arquivo executor de Runtime (`function/createPreference`), alinhando o App com o pacote base NPM `mercadopago` (SDK v2 version).
- [ ] Escrever API/Função de nuvem formatícia da *Preference*. A mesma tranca a key `Access Token` estritamente nas Environments (Firebase Secrets Manager A02 Shield). Processa body param do Web, e devolve Object `preferenceId`. Amarra Endpoints de Failure/Success (Callbacks HTTP).
- [ ] Injetar Redirection JS: Call Fetch em `catalog.js/payment.html` capturando retorno da function. Ligar motor via MP Frontend Pack (Via Public Key que não impõe perigo de vulnerabilidade), abrindo janelagem pro URL/Domain do Gateway nativo no Checkout nativo deles (`window.location = MP_URL`).
- [ ] **Callback Return UI / Fluxo Pós-Cartão:** Criação do ambiente `payment-success.html`. Focado 100% em confirmar visualização base Approval e provendo Button primário Call to Action: *"🔴 Pagamento Aprovado (ID). Finalizar Pedido pelo WhatsApp!"* — disparador da macro textual do Whatsapp que consolida aprovação mecânica da bandeira perante base empírica com o vendedor (Zap elza).
- [ ] **Auditoria de Segurança (CSP):** Atualizar a Restrição Strict CSP autorizando os end-points dinâmicos do payment provider: Habilitar diretiva `script-src` para `https://sdk.mercadopago.com` e `connect-src` integrando `https://api.mercadopago.com` prevenindo quebras em transações reais (OWASP A05 mitigations).
- [ ] **Limpeza Técnica Sistêmica:** Empreender exclusão compulsória geral de qualquer classe tag/button contendo o estado textual `[Em Breve]` ou os hardcoded disabled states postos nas atividades PAY-02, PAY-03 que eram marcadores temporários para tal gateway.

---

### TODO-PAY-06 🔵 Watcher Webhooks IPN (Optional Admin Tools)

**Descrição:** Monitorar pagers automáticos e Webhook Pushes externos engajadamente em real-time e marcar no banco.

**Critérios de aceitação detalhados (Passo-a-passo):**

- [ ] Firebase Edge Function API Node (`mpWebhook`) expondo Rota acessível Server2Server, pronta a engajar notificações de Update Request MP (HTTP Trigger Change IPNs).
- [ ] Read and Update da *Collection* original referenciada `payment_links` convertendo state do Payment de Array status "Aberto/Pendente" para "Pago (Credited / Approved)".
- [ ] Executar check sum Hash (x-signature via Secret Mercado Pago Webhook App Tool) isolando payloads de bots, web scrapers ou spam injection visando corrompimento logístico (Owasp Fraud).
- [ ] Confirmação de coloração limpa/sincronia nativa da Tab Histórica do Admin em conformidade com Tabela e status do Firebase Live Watcher.

---

## Resumo Arquitetural

- **Front-end:** HTML Semântico, Vanilla JavaScript, CSS Puro (mantendo a essência do MVP). Web Share API base UI e QR Canvas rendering.
- **Database & Storage & API Engine Serverless:** Firebase Cloud Firestore (NoSQL), Cloud Functions GCP (Node.js SDK Provider Runtime) + Firebase Storage.
- **Autenticação Admin e Gateways Checkout:** Firebase Auth Client e Mercado Pago V2 SDK Pro.
- **Ecossistema:** Otimizado, serverless e modular. Funcional do Free Tier base até escalar Cloud Computing pay-as-you-go em produção com UX contínua.
