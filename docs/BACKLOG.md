# 🛒 Plataforma E-commerce SaaS Modular

> **Objetivo:** Construir uma plataforma E-commerce White-label (Multi-tenant) baseada em uma arquitetura de módulos plug-and-play. O sistema deve permitir que clientes contratem módulos específicos (Landing Page, Carrinho, Pagamentos, Dashboard, etc.) que serão ativados via banco de dados (Feature Flags).
>
> **Tenant Piloto:** O primeiro cliente configurado nesta plataforma será o **Salgados da Elza**. Todas as referências a nomes, logos e textos específicos deste Tenant serão dados de configuração (banco de dados), e não código hardcoded.
>
> 🤖 **Nota para IA (STATUS):** Este E-commerce ainda está estritamente em **fase de planejamento**. NÃO sugira nem inicie a implementação de nenhum dos TODOs abaixo até que o usuário solicite explicitamente.
>
> 🤖 **Nota para IA:** Leia as regras e diretrizes de desenvolvimento no arquivo `AGENTS.md` antes de atuar.

---

## 📐 Princípios Arquiteturais Transversais

Os princípios abaixo se aplicam a **TODAS** as fases e devem ser seguidos rigorosamente durante toda a vida do projeto.

### 🔒 Segurança (OWASP Top 10)

| Ameaça OWASP | Mitigação Obrigatória |
| :--- | :--- |
| **A01 - Broken Access Control** | Middleware de autorização por rota; verificação server-side de Feature Flags e Tenant ID em toda requisição. Nunca confiar apenas no frontend. |
| **A02 - Cryptographic Failures** | Credenciais e tokens apenas em variáveis de ambiente (`.env.local`). Dados sensíveis (CPF, e-mail) criptografados em repouso (AES-256 via Supabase Vault ou campo encrypted do Prisma). TLS/HTTPS obrigatório. |
| **A03 - Injection** | Uso exclusivo de Prisma ORM (queries parametrizadas). Nunca concatenar input do usuário em SQL bruto. Sanitização de Rich Text (DOMPurify) contra XSS persistente. |
| **A04 - Insecure Design** | Rate limiting em rotas de login e API pública. Threat modeling antes de cada fase. |
| **A05 - Security Misconfiguration** | Headers de segurança (CSP, X-Frame-Options, Strict-Transport-Security) via `next.config.js`. `.env` no `.gitignore`. Supabase Row-Level Security (RLS) ativo em todas as tabelas. |
| **A06 - Vulnerable Components** | `npm audit` no CI/CD. Dependabot ou Renovate para atualizações automáticas de deps. |
| **A07 - Auth Failures** | Supabase Auth (bcrypt + salt). Tokens JWT com expiração curta (15min access + refresh token). Proteção contra força bruta via rate limit por IP. |
| **A08 - Data Integrity Failures** | Webhook do Mercado Pago validado com assinatura HMAC-SHA256. Integridade de uploads validada (tipo MIME real, tamanho máximo). |
| **A09 - Logging & Monitoring** | Logs estruturados (JSON) de eventos de autenticação e transações financeiras. Nunca logar dados sensíveis (senhas, tokens, CPFs completos — mascarar como `***.456.***-XX`). |
| **A10 - SSRF** | Validação de URLs de callback/webhook. Whitelist de domínios para integrações externas. |

### 🛡️ Conformidade LGPD (Lei nº 13.709/2018)

| Requisito Legal | Implementação Técnica |
| :--- | :--- |
| **Base Legal (Art. 7)** | Coleta de dados pessoais somente com consentimento explícito (checkbox + timestamp) ou quando necessário para execução do contrato (pedido de compra). |
| **Finalidade e Minimização (Art. 6)** | Coletar apenas os dados estritamente necessários para a operação (nome, e-mail, telefone, endereço de entrega). Não coletar dados extras "por precaução". |
| **Transparência (Art. 9)** | Página de Política de Privacidade acessível via footer. Informar claramente quais dados são coletados e para que servem antes do envio de qualquer formulário. |
| **Direito de Acesso e Exclusão (Art. 18)** | Endpoint `/api/user/my-data` para exportação dos dados em JSON. Endpoint `/api/user/delete-account` para anonimização completa (soft-delete com hash irreversível dos dados pessoais). |
| **Retenção e Descarte (Art. 16)** | Definir política de retenção: dados de pedidos mantidos por 5 anos (obrigação fiscal). Dados de conta inativa anonimizados após 2 anos sem login. |
| **Incidentes (Art. 48)** | Procedimento documentado para notificação à ANPD e ao titular em caso de vazamento, no prazo legal. |
| **Encarregado (DPO)** | Informação de contato do responsável pelos dados visível na Política de Privacidade. |

### 🗄️ Normalização de Banco de Dados (Prisma)

| Forma Normal | Regra aplicada ao projeto |
| :--- | :--- |
| **1FN** | Nenhum campo armazenará listas separadas por vírgula. Relacionamentos N:N usam tabelas de junção (ex: `ProductTag` entre `Product` e `Tag`). |
| **2FN** | Toda coluna não-chave depende da chave primária inteira. Tabelas como `OrderItem` terão chave composta (`orderId` + `productId`) ou PK própria, com preço unitário copiado no momento do pedido (snapshot, não referência). |
| **3FN** | Nenhuma dependência transitiva. Exemplo: `Order` não armazena `customerName` — referencia `userId` e busca do `User`. Exceção planejada: campos de _snapshot_ financeiro (preço no momento da venda) para auditoria. |
| **Soft Deletes** | Registros críticos (Usuários, Pedidos, Transações) nunca são deletados fisicamente. Usam campo `deletedAt` (nullable DateTime) filtrado por `@default(dbgenerated())`. Isso garante rastreabilidade e conformidade fiscal/LGPD. |
| **UUIDs** | Todas as PKs serão `UUID v4` em vez de IDs sequenciais, para impedir _enumeration attacks_ (ex: adivinhar `/api/orders/123`). |
| **Timestamps** | Toda tabela terá `createdAt` e `updatedAt` automáticos via Prisma (`@default(now())` / `@updatedAt`). |

### ✅ Definition of Done (DoD) — Checklist de Conclusão por TODO

Todo TODO só pode ser considerado **"Done"** quando **TODOS** os itens abaixo forem cumpridos:

| Etapa | Critério |
| :--- | :--- |
| **Implementação** | Todo o código da tarefa foi escrito, está limpo, modular e com comentários didáticos em pt-BR conforme `AGENTS.md`. |
| **Validação de Linting** | Código passa sem erros no ESLint + Prettier + TypeScript (`npm run lint` e `npm run type-check`). |
| **Testes** | Testes unitários e/ou de integração escritos para toda lógica de negócios nova. Cobertura mínima: 80% das linhas alteradas. |
| **Segurança** | Revisão manual das mitigações OWASP listadas na tarefa. `npm audit` sem vulnerabilidades críticas ou altas. |
| **LGPD** | Se a tarefa coleta ou processa dados pessoais, verificar conformidade com a tabela LGPD transversal deste documento. |
| **Acessibilidade** | Componentes UI novos passam nas verificações WCAG 2.1 AA (contraste, navegação por teclado, alt texts). |
| **Code Review** | O código foi revisado (pelo próprio dev usando diff + checklist, ou por par quando houver). |
| **Versionamento** | Branch criada no início (`feat/TODO-XXX-XX`). Commits semânticos em inglês (`<tipo>(<escopo>): <descrição>`). Merge na `main`, push e delete da branch (local + remota). Veja o workflow em `.agents/workflows/todo-workflow.md`. |
| **Documentação** | Se houve alteração arquitetural ou de API, o `BACKLOG.md` ou o `README.md` foram atualizados. |

---

## Fase 1: Motor Principal e Arquitetura Multi-tenant (Core)

### TODO-CORE-01 🔴 Setup do Monorepo Next.js e Infraestrutura

**Descrição:** Configurar a base do monorepo Next.js de forma isolada, garantindo que a landing page estática (produção atual) permaneça inalterada até que a nova plataforma esteja validada e pronta para substituí-la.

**Sub-tarefas:**

- [ ] Criar branch paralela (`feat/TODO-CORE-01`) a partir da `main`.
- [ ] Limpar arquivos legados (HTML/CSS puro) NA NOVA BRANCH e inicializar boilerplate Next.js (App Router, TypeScript strict mode).
- [ ] Inicializar estrutura de rotas da API/Backend (API Routes ou Server Actions).
- [ ] Configurar conexão segura com o Supabase (Database, Auth e Storage).
  - Variáveis `SUPABASE_URL` e `SUPABASE_ANON_KEY` apenas em `.env.local`.
  - `SUPABASE_SERVICE_ROLE_KEY` (chave privilegiada) usada SOMENTE em Server Actions/API Routes, **nunca exposta no client-side**.
- [ ] Configurar Prisma ORM com gerador de client e provider `postgresql`.
  - `DATABASE_URL` apontando para o Supabase via connection pooling (porta 6543, modo `transaction`).
  - Primeira migration inicial vazia (`prisma migrate dev --name init`).
- [ ] Criar `.env.example` documentado (sem valores reais, apenas placeholders com comentários descritivos), incluído no versionamento.
- [ ] Configurar headers de segurança no `next.config.js`:
  - `Content-Security-Policy` (CSP) restritiva.
  - `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Strict-Transport-Security`.
- [ ] Configurar ESLint + Prettier (padrão do projeto) e Husky para pre-commit hooks.
- [ ] Configurar CI/CD básico (GitHub Actions): lint, type-check e `npm audit` a cada PR.

**⚠️ Riscos e Cuidados:**

- **Exposição de chaves:** Nunca commitar `.env.local`. Verificar `.gitignore` inclui `*.env.local`.
- **Drift de banco:** Sempre rodar `prisma migrate` pelo CI e nunca editar o banco de produção "na mão".

---

### TODO-CORE-02 🔴 Gerenciador de Módulos (Feature Flags)

**Descrição:** O coração do modelo SaaS. Cada Tenant (cliente) terá no banco de dados um registro indicando quais módulos ele contratou. O sistema usará essas flags para decidir, no servidor, quais rotas, componentes e menus renderizar.

**Sub-tarefas:**

- [ ] Modelagem (Prisma):

  ```text
  Tenant (id UUID PK, name, slug UNIQUE, createdAt, updatedAt, deletedAt?)
    └── TenantModule (id UUID PK, tenantId FK → Tenant, moduleKey ENUM, isActive BOOLEAN, activatedAt, expiresAt?, createdAt, updatedAt)
  ```

  - `moduleKey` será um Enum com valores como: `LANDING_PAGE`, `CUSTOMIZATION`, `ECOMMERCE`, `CHECKOUT`, `DASHBOARD`, `LOYALTY`, `DELIVERY_MGMT`, `SUBSCRIPTIONS`, `COUPONS`.
  - Índice composto `UNIQUE(tenantId, moduleKey)` para impedir duplicatas.

- [ ] Criar middleware Next.js (`middleware.ts`) que intercepta toda rota dentro de `/admin/*` e `/api/*`:
  - Identifica o Tenant atual (via header, subdomain ou cookie seguro).
  - Consulta (com cache em memória — TTL de 60s) quais módulos estão ativos.
  - Retorna `403 Forbidden` se o Tenant tentar acessar rota de módulo não contratado.
- [ ] Criar helper server-side `hasModule(tenantId, moduleKey)` reutilizável em Server Components e Server Actions.
- [ ] Criar componente React `<ModuleGate moduleKey="ECOMMERCE">` para esconder UI de módulos inativos no lado do cliente (defesa em profundidade; a segurança real é no middleware).

**⚠️ Riscos e Cuidados:**

- **Bypass client-side:** As Feature Flags controlam a UI, mas a segurança REAL está no middleware/server. Um atacante pode manipular o DOM, mas NÃO as rotas protegidas.
- **Cache Stale:** Se o cache do middleware não invalidar após a compra de um módulo, o cliente pode não ver a feature. Usar `revalidateTag('tenant-modules')` do Next.js para invalidação sob demanda.

---

### TODO-CORE-03 🔴 Autenticação, Segurança e Theming Global

**Descrição:** Implementar o sistema de autenticação para o painel administrativo e a base da infraestrutura de theming dinâmico (CSS Variables + React Context).

**Sub-tarefas:**

- [ ] Implementar fluxo de Login nativo via Supabase Auth (e-mail + senha com hash bcrypt automático).
  - Página `/admin/login` com formulário acessível (WCAG 2.1 AA: labels visíveis, foco visível, mensagens de erro claras).
  - Armazenamento do JWT em cookie `HttpOnly`, `Secure`, `SameSite=Lax` (nunca `localStorage`, que é vulnerável a XSS).
- [ ] Implementar proteção contra força bruta:
  - Rate limiting de 5 tentativas por IP a cada 15 minutos na rota `/api/auth/login`.
  - Resposta genérica: "Credenciais inválidas" (nunca revelar se o e-mail existe ou não — OWASP A07).
- [ ] Proteger rotas da API e do admin com middleware de sessão:
  - Validar JWT a cada requisição server-side; buscar `userId` e `tenantId` a partir da sessão.
  - Proteção CSRF via `SameSite` cookie + Supabase Auth (token rotation automático).
- [ ] Implementar RBAC (Role-Based Access Control) no Prisma:

  ```text
  User (id UUID PK, email UNIQUE, role ENUM['OWNER','MANAGER','VIEWER'], tenantId FK, createdAt, updatedAt, deletedAt?)
  ```

  - `OWNER`: Acesso total. `MANAGER`: Acesso ao catálogo e pedidos. `VIEWER`: Somente leitura.

- [ ] Inicializar a base do Design System no `globals.css`:
  - Tokens CSS (variáveis): `--color-primary`, `--color-secondary`, `--font-family-base`, `--radius-base`, etc.
  - Tema claro e escuro via `prefers-color-scheme` + toggle manual.
- [ ] Criar `ThemeProvider` (React Context) para injetar variáveis de tema dinamicamente no frontend, consumidas do banco na Fase 3.

**⚠️ Riscos e Cuidados:**

- **Session Hijacking:** Cookies `HttpOnly` + `Secure` mitigam roubo via XSS. `SameSite=Lax` mitiga CSRF em navegações top-level.
- **Enumeração de usuários:** O endpoint de login NUNCA deve retornar mensagens diferentes para "e-mail não encontrado" vs "senha errada".
- **Escopo do Tenant:** Um usuário autenticado SOMENTE pode ver dados do seu próprio Tenant. Toda query Prisma DEVE incluir `WHERE tenantId = currentTenantId`. Implementar isso como extensão Prisma (`$extends`) global para evitar esquecimento.

---

## Fase 2: Módulo Base (A Landing Page)

### TODO-MOD-01 🟡 Módulo Institucional (Vendas pelo WhatsApp)

**Descrição:** O produto mínimo vendável. Uma landing page moderna e responsiva (Mobile-first) com exibição de catálogo estático. O pedido é direcionado para o WhatsApp da loja. Sem carrinho, sem pagamento online.

**Sub-tarefas:**

- [ ] Portar os componentes estáticos do MVP atual (Header, Seção Hero, Cards de Produtos, Rodapé) para Server Components React.
- [ ] Implementar carregamento dinâmico dos textos e imagens a partir da tabela `StoreSettings` (definida na Fase 3 — TODO-MOD-02). Se o módulo de Personalização estiver **inativo**, o sistema usará valores default hardcoded no código (fallback seguro).
- [ ] Botão de CTA ("Fazer Pedido") gera link `https://wa.me/{whatsappNumber}?text={mensagemPreFormatada}`.
  - O número de WhatsApp vem do banco (`StoreSettings.whatsappNumber`) — nunca hardcoded.
  - A mensagem pré-formatada deve incluir o nome do produto clicado (sem dados pessoais do visitante).
- [ ] Implementar SEO On-page:
  - `<title>` e `<meta description>` dinâmicos por Tenant.
  - Schema.org `LocalBusiness` + `Product` em JSON-LD.
  - Open Graph e Twitter Card metas para compartilhamento em redes sociais.
  - Sitemap.xml dinâmico.
- [ ] Implementar acessibilidade (WCAG 2.1 AA):
  - Navegação por teclado funcional em todos os elementos interativos.
  - Contraste mínimo de 4.5:1 para texto normal.
  - `alt` descritivo em todas as imagens; `aria-label` em botões com ícone.
- [ ] Performance: Imagens servidas em formato WebP via Supabase Storage com dimensões otimizadas. Lazy loading com `loading="lazy"` nativo.

**⚠️ Riscos e Cuidados:**

- **Open Redirect via WhatsApp:** Validar que o `whatsappNumber` armazenado no banco contém apenas dígitos (regex: `/^\d{10,13}$/`). Nunca interpolar input do visitante na URL sem sanitização.
- **Dados do visitante:** Nesta fase, NÃO coletamos nenhum dado pessoal do visitante (sem formulários, sem cookies de rastreio). Isso simplifica enormemente a conformidade LGPD da landing page pura.

---

## Fase 3: Módulo de Personalização (White-label Engine)

### TODO-MOD-02 🟡 Configurações e Customização (Storefront Settings)

**Descrição:** Área do admin para alterar aspectos visuais e textuais do frontend de forma autônoma, sem tocar no código e sem re-deploy. Módulo plugável: se inativo, o site usa valores default.

**Sub-tarefas:**

- [ ] Modelagem (Prisma):

  ```text
  StoreSettings (id UUID PK, tenantId FK UNIQUE → Tenant)
    ├── storeName       String
    ├── logoUrl         String?       (URL para Supabase Storage)
    ├── faviconUrl      String?
    ├── primaryColor    String        (hex, ex: #E05A00)
    ├── secondaryColor  String?
    ├── fontFamily      String        (nome Google Fonts, ex: "Inter")
    ├── heroTitle       String        (Frase Hero principal)
    ├── heroSubtitle    String?
    ├── deliveryRules   String        (Texto de regras de entrega)
    ├── whatsappNumber  String        (Apenas dígitos, validado por regex)
    ├── privacyPolicyUrl String?      (Link externo para a Política de Privacidade — LGPD)
    ├── createdAt       DateTime
    └── updatedAt       DateTime
  ```

- [ ] Módulo Visual de Theming (Admin):
  - Color Picker nativo (componente acessível) para escolher a Cor Primária e Secundária.
  - Dropdown de Google Fonts pré-curadas (5 a 10 opções seguras em termos de performance e leitura).
  - Preview ao vivo (live preview) das mudanças antes de salvar.
- [ ] Módulo de Textos Institucionais:
  - Inputs para alterar Frase Hero, Regras de Entrega e Número do WhatsApp.
  - Validação server-side: WhatsApp somente dígitos, textos limitados a 500 caracteres (prevenir abuso de storage e XSS em campos gigantes).
- [ ] Ingestão de Contexto no Frontend:
  - Server Component busca `StoreSettings` com caching agressivo (`revalidate: 3600` — 1 hora) para performance.
  - Injeta os valores no `ThemeProvider`, que aplica como CSS Variables no `:root`.
  - Cache é invalidado via `revalidateTag('store-settings')` quando o admin salva alterações.

**⚠️ Riscos e Cuidados:**

- **XSS via CMS:** Os valores de texto inseridos pelo admin (Hero Title, Regras) devem ser sanitizados (DOMPurify) antes de renderizar no frontend. Um admin comprometido poderia injetar `<script>` no campo de texto.
- **Upload de Logo malicioso:** Validação MIME type real do arquivo (não confiar na extensão). Aceitar apenas `image/png`, `image/jpeg`, `image/webp`, `image/svg+xml`. Tamanho máximo: 2 MB. Para SVGs, sanitizar com biblioteca dedicada (ex: `dompurify` com `ALLOWED_TAGS` restrito).

---

## Fase 4: Módulo E-commerce Core

### TODO-MOD-03 🟢 CRUD de Produtos (Gestão de Catálogo e Estoque)

**Descrição:** Interface administrativa intuitiva para que o gestor da loja gerencie o catálogo de produtos, categorias, tags e estoque de forma independente. Inclui lógica de prevenção de venda furada.

**Sub-tarefas:**

- [ ] Modelagem (Prisma) — Normalizada (3FN):

  ```text
  Category (id UUID PK, tenantId FK, name, slug UNIQUE per tenant, sortOrder INT, createdAt, updatedAt, deletedAt?)

  Product (id UUID PK, tenantId FK, categoryId FK → Category)
    ├── name           String
    ├── slug           String         (UNIQUE per tenant, gerado a partir do name)
    ├── description    String         (Rich Text sanitizado)
    ├── priceInCents   Int            (⚠️ SEMPRE em centavos para evitar erros de ponto flutuante)
    ├── imageUrl       String         (Supabase Storage)
    ├── stockCount     Int            (>= 0, estoque real disponível)
    ├── stockReserved  Int            (default 0 — unidades "travadas" em checkouts em andamento, TTL 15min)
    ├── isActive       Boolean        (permite "despublicar" sem deletar)
    ├── createdAt      DateTime
    ├── updatedAt      DateTime
    └── deletedAt      DateTime?

  Tag (id UUID PK, tenantId FK, label String — ex: "Mais Vendido", "Novidade")

  ProductTag (productId FK, tagId FK) — PK composta (tabela de junção N:N, 1FN)
  ```

- [ ] API Endpoints seguros (Server Actions com `use server`):
  - Toda ação valida `tenantId` da sessão vs o `tenantId` do recurso (impede Tenant A editar produto do Tenant B).
  - Toda ação valida role do usuário (`OWNER` ou `MANAGER` para escrita; `VIEWER` somente leitura).
  - Validação de entrada (Zod schema): `name` obrigatório (3-120 chars), `priceInCents` inteiro positivo, `stockCount` inteiro >= 0.
- [ ] Formulário Criativo (Admin):
  - Editor Rich Text limitado (negrito, itálico, listas) com sanitização via `DOMPurify` antes de salvar.
  - Upload de Imagens: Supabase Storage com crop client-side (antes do upload) e conversão para WebP na nuvem.
  - Validação de upload: MIME type real, tamanho máximo 5 MB, apenas formatos de imagem.
- [ ] Listagem Administrativa:
  - Tabela com Filtros combinados (Categoria + Status + Tag), Ordenação e Paginação server-side (cursor-based, não offset — mais performático para catálogos grandes).
- [ ] Controle de Estoque com Lock de Concorrência:
  - Ao iniciar o fluxo de checkout (Fase 5 — TODO-MOD-05), o campo `stockReserved` é incrementado e `stockCount` decrementado em transação atômica, com TTL de 15 minutos.
  - Cron job ou Supabase Edge Function libera reservas expiradas automaticamente (`stockReserved--`, `stockCount++`).
  - Alertas visuais no Admin: Tag `Warning` (Laranja) se `stockCount <= 5`, Tag `Danger` (Vermelho) se `stockCount === 0`.
  - **Nota de dependência:** A efetivação definitiva do estoque (converter reserva em venda real) ocorre no TODO-MOD-06 via Webhook do Mercado Pago.

**⚠️ Riscos e Cuidados:**

- **Race Condition no Estoque:** Usar transação Prisma (`$transaction`) com `SELECT ... FOR UPDATE` para garantir que dois clientes não comprem o mesmo último item simultaneamente.
- **Preço em centavos:** Armazenar valores monetários como `Int` em centavos (ex: R$ 15,90 = `1590`). Nunca usar `Float` — erros de arredondamento causam discrepâncias financeiras.
- **IDOR (Insecure Direct Object Reference):** Sempre validar que o `productId` na URL pertence ao `tenantId` da sessão. Nunca confiar no ID da URL sem checar ownership.

---

### TODO-MOD-04 🟢 Carrinho de Compras e UX Avançada

**Descrição:** Implementação de um carrinho fluido e responsivo, sem recarregamento da página (SPA), mantendo o usuário engajado.

**Sub-tarefas:**

- [ ] State management contínuo do carrinho via Zustand (escolhido por ser leve e sem boilerplate).
  - Store tipada com TypeScript: `{ items: CartItem[], addItem, removeItem, updateQuantity, clearCart }`.
- [ ] Sidebar Animada (Drawer) para o Carrinho:
  - Subtotal dinâmico calculado no client.
  - Botões + / − com debounce para evitar spam de cliques.
  - Animação de entrada/saída suave (CSS `transform` + `transition`, sem depender de Framer Motion se possível — menos bundle).
- [ ] Persistência segura no cliente (`localStorage`):
  - Zustand middleware `persist` com serialização automática.
  - Dados armazenados: `productId`, `quantity`, `priceSnapshot` (preço no momento da adição — para verificar se houve mudança depois).
  - **NÃO armazenar dados pessoais** em `localStorage` (LGPD + segurança XSS).
- [ ] Validações dinâmicas ao clicar "Ir para o Pagamento":
  - Chamada server-side para verificar estoque atual de cada item no carrinho.
  - Se algum produto ficou indisponível, exibir mensagem clara e remover automaticamente do carrinho.
  - Verificar se o preço do produto mudou desde a adição ao carrinho (respeito ao consumidor + prevenção de fraude).

**⚠️ Riscos e Cuidados:**

- **Manipulação de preço no client:** O preço exibido no carrinho é meramente informativo. O valor REAL é calculado **no servidor** no momento do checkout, consultando o banco. Nunca confiar no preço enviado pelo frontend.
- **XSS e localStorage:** Se um atacante conseguir executar JavaScript na página (XSS), ele pode ler o `localStorage`. Por isso, nunca armazenar tokens, e-mails ou dados pessoais ali.

---

## Fase 5: Checkout e Integração Financeira

### TODO-MOD-05 🔵 Checkout Transparente (Mercado Pago)

**Descrição:** Um processo de finalização de compra sem redirecionamento externo (White-label), maximizando a taxa de conversão. A segurança dos dados de cartão é inteiramente responsabilidade do SDK do Mercado Pago (Tokenization), garantindo que nenhum dado de cartão passe pelo nosso backend (PCI-DSS compliance).

**Sub-tarefas:**

- [ ] Tela de Checkout em Etapas (Stepper):
  1. **Identificação:** Nome, E-mail, Telefone. Consentimento LGPD explícito (checkbox: "Li e aceito a Política de Privacidade" com link).
  2. **Endereço de Entrega:** CEP com auto-preenchimento (API ViaCEP), rua, número, complemento, bairro, cidade, estado.
  3. **Pagamento:** Cartão de Crédito (via SDK MP) ou PIX.
- [ ] Modelagem (Prisma):

  ```text
  Order (id UUID PK, tenantId FK, userId FK?, orderNumber SERIAL UNIQUE per tenant)
    ├── status         ENUM ['PENDING','PROCESSING','PAID','PREPARING','SHIPPED','DELIVERED','CANCELLED','REFUNDED']
    ├── totalInCents   Int
    ├── discountInCents Int?       (desconto aplicado via cupom — TODO-APPSTORE-05, se ativo)
    ├── couponId       FK?         (→ StoreCoupon, nullable — rastreabilidade do cupom usado)
    ├── paymentMethod  ENUM ['CREDIT_CARD','PIX']
    ├── mpPaymentId    String?     (ID externo do Mercado Pago, UNIQUE para idempotência)
    ├── createdAt      DateTime
    ├── updatedAt      DateTime
    └── deletedAt      DateTime?
    ⚠️ userId é opcional (FK?) porque visitantes podem comprar sem criar conta (guest checkout).

  OrderStatusHistory (id UUID PK, orderId FK → Order)
    ├── fromStatus     ENUM?       (null se for o primeiro status)
    ├── toStatus       ENUM
    ├── changedBy      FK? → User  (quem moveu — admin ou sistema)
    ├── note           String?     (comentário opcional, ex: "Cliente solicitou troca")
    └── createdAt      DateTime    (⚠️ Registro de auditoria para o Kanban da Fase 6)

  OrderItem (id UUID PK, orderId FK → Order, productId FK → Product)
    ├── quantity        Int
    ├── unitPriceInCents Int       (⚠️ Snapshot do preço no momento da compra — 2FN justificada)
    └── productName     String    (⚠️ Snapshot do nome — para auditoria se o produto for editado depois)

  CustomerInfo (id UUID PK, orderId FK UNIQUE → Order)
    ├── fullName        String    (criptografado em repouso)
    ├── email           String    (criptografado em repouso)
    ├── phone           String    (criptografado em repouso)
    ├── addressZip      String
    ├── addressStreet   String
    ├── addressNumber   String
    ├── addressComplement String?
    ├── addressNeighborhood String
    ├── addressCity     String
    ├── addressState    String    (UF, 2 chars)
    └── lgpdConsentAt   DateTime  (⚠️ Timestamp do consentimento — obrigatório LGPD Art. 8)
  ```

- [ ] Integração do SDK Frontend `@mercadopago/sdk-react`:
  - O formulário de cartão é renderizado pelo SDK (iframe seguro). Nosso código **nunca** toca nos dados do cartão.
  - O SDK gera um `card_token` que enviamos ao backend para criar o pagamento via API do MP.
- [ ] Fluxo Backend PIX:
  - Server Action chama a API do Mercado Pago para gerar pagamento PIX.
  - Retorna o `qr_code_base64` e o código `copy_paste` (Copia e Cola).
  - Frontend exibe com contagem regressiva de validade (30 minutos).
- [ ] Salvar `Order` + `OrderItem[]` + `CustomerInfo` + primeiro registro de `OrderStatusHistory` (status `PENDING`) no Prisma dentro de uma TRANSACTION atômica:
  - Se qualquer parte falhar (ex: item esgotado após verificação), todo o pedido é cancelado (rollback).
  - Neste momento, o `stockReserved` do Product é incrementado (reserva temporária de 15min — definido no TODO-MOD-03).

**⚠️ Riscos e Cuidados:**

- **PCI-DSS:** Nosso backend NUNCA recebe, armazena ou loga número de cartão, CVV ou data de validade. Isso é 100% responsabilidade do SDK do Mercado Pago. Se violarmos isso, estamos sujeitos a multas pesadas e banimento do gateway.
- **Dados pessoais (LGPD):** A tabela `CustomerInfo` contém dados sensíveis (nome, e-mail, telefone, endereço). Todos esses campos devem ser criptografados em repouso. O campo `lgpdConsentAt` é obrigatório e prova que o titular deu consentimento explícito.
- **Idempotência:** Se o webhook do MP disparar duas vezes (retry), o sistema não deve processar o pedido em duplicidade. Usar `mpPaymentId` como chave de idempotência (`UNIQUE` constraint).

---

### TODO-MOD-06 🔵 Webhooks e Notificações (Orquestração de Pedidos)

**Descrição:** Sistema reativo que escuta as atualizações de pagamento do Mercado Pago para dar andamento automatizado ao pedido.

**Sub-tarefas:**

- [ ] Criar endpoint `POST /api/webhooks/mercadopago` com validação de integridade:
  - Verificar assinatura HMAC-SHA256 do header `x-signature` usando a chave secreta do MP armazenada em `.env.local`.
  - Se a assinatura for inválida, retornar `401 Unauthorized` e logar o evento como tentativa de ataque.
  - Se válida, processar o evento de forma **assíncrona** (retornar `200 OK` imediatamente e processar em background para evitar timeout do MP).
- [ ] Listener de Eventos:
  - `payment.approved`: Atualizar `Order.status` para `PAID` + decrementar estoque real (`stockCount--`, liberando o `stockReserved`).
  - `payment.rejected` / `payment.cancelled`: Atualizar `Order.status` para `CANCELLED` + liberar reserva de estoque.
  - `payment.refunded`: Atualizar para `REFUNDED` + incrementar estoque (`stockCount++`).
- [ ] Automação de E-mail Transacional:
  - Integração com Resend (ou AWS SES como fallback).
  - Template HTML responsivo: "Seu Pedido #XXXX foi confirmado!".
  - **LGPD:** Incluir link de "Gerenciar meus dados" no rodapé do e-mail.
- [ ] (Fase futura, opcional) Notificação para o lojista:
  - Integração via API do WhatsApp (Evolution API ou Z-API) para o lojista receber: "🔔 Novo pedido #1234 pago — R$ 85,00!".

**⚠️ Riscos e Cuidados:**

- **Webhook Forgery:** Sem validação HMAC, qualquer pessoa pode simular uma chamada do MP e marcar pedidos como pagos sem pagar. Isso é uma vulnerabilidade CRÍTICA.
- **Replay Attack:** Armazenar `mpPaymentId` já processados e ignorar duplicatas (idempotência).
- **Timeout:** O Mercado Pago espera resposta em até 10 segundos. Se demorar mais, ele faz retry. Por isso, processar em background e responder `200 OK` imediatamente.

---

## Fase 6: Analytics e Dashboard Administrativo

### TODO-MOD-07 🟣 Dashboard Gerencial Avançado

**Descrição:** Uma sala de controle rica em dados para o gestor ter visibilidade total do fluxo do negócio, usando gráficos interativos.

**Sub-tarefas:**

- [ ] Layout do Admin Dashboard com Sidebar Lateral:
  - Navegação: Visão Geral, Pedidos, Catálogo, Configurações, (App Store — se Fase 7 ativa).
  - Sidebar responsiva: colapsável em mobile para tela `≤ 768px`.
- [ ] **Visão Geral (Cards de KPI):**
  - Faturamento Diário / Semanal / Mensal (calculado via query aggregada no Prisma: `SUM(totalInCents) WHERE status = 'PAID'`).
  - Ticket Médio por Venda (`AVG(totalInCents)`).
  - Número total de pedidos no período.
  - Top 5 Produtos mais vendidos (ranking com `GROUP BY productId, COUNT()`).
- [ ] **Fluxo de Caixa Visual (Gráficos):**
  - Gráfico de linha: evolução de receita (`Receita` x `Dias da Semana`) com Recharts ou Chart.js.
  - Filtros de período: Hoje, Últimos 7 dias, Este mês, Custom range.
- [ ] **Gestor de Pedidos (Kanban em Tempo Real):**
  - Colunas: `[Recebido] → [Em Preparo] → [Saiu para Entrega] → [Entregue]`.
  - Drag-and-drop para mover pedidos entre colunas (Server Action com atualização otimista).
  - Timeline de rastreio: cada mudança de status insere um registro na tabela `OrderStatusHistory` (definida na Fase 5 — TODO-MOD-05), permitindo auditoria completa com data, responsável e observação.
- [ ] Backend Server Actions para mover pedidos entre colunas, com validação de transição (ex: não pode pular de "Recebido" direto para "Entregue" — máquina de estados finita com transições permitidas definidas em código).
- [ ] Tela de Rastreio Pública: link compartilhável `/rastreio/{orderNumber}` que o cliente final pode acessar para ver o status do pedido em tempo real (consome `OrderStatusHistory`). Não exige login.

**⚠️ Riscos e Cuidados:**

- **Queries pesadas:** As queries de agregação (SUM, AVG, COUNT) podem ficar lentas com volume grande. Planejar índices adequados e, se necessário, materializar views no Supabase.
- **Dados financeiros expostos:** O Dashboard só deve ser acessível por role `OWNER`. `MANAGER` e `VIEWER` veem apenas dados de pedidos, não financeiros.
- **Escopo do Tenant:** Toda query de KPI DEVE filtrar por `tenantId`. Sem isso, um admin veria dados de TODOS os clientes da plataforma.

---

## Fase 7: App Store Interna (Plugins High-Ticket)

### TODO-APPSTORE-01 ⚫ Setup da Vitrine de Módulos (Admin Global)

**Descrição:** Área visível dentro do painel Admin onde o cliente (Tenant) pode ver quais módulos extras estão disponíveis, seus preços e comprá-los direto pelo painel. Inclui motor de cupons de desconto para o dono da plataforma negociar valores.

**Sub-tarefas:**

- [ ] Modelagem (Prisma):

  ```text
  ModuleCatalog (id UUID PK)
    ├── moduleKey         ENUM (mesmo do TenantModule)
    ├── displayName       String      (ex: "Programa de Fidelidade")
    ├── description       String      (Texto de venda)
    ├── priceInCents      Int         (Mensalidade ou Taxa Única)
    ├── billingType       ENUM ['MONTHLY','ONE_TIME']
    ├── isAvailable       Boolean
    ├── createdAt         DateTime
    └── updatedAt         DateTime

  DiscountCoupon (id UUID PK)
    ├── code              String UNIQUE (ex: "LANCAMENTO50")
    ├── discountPercent   Int?        (ex: 50 = 50% off)
    ├── discountFixedCents Int?       (ou valor fixo em centavos)
    ├── maxUses           Int?        (null = ilimitado)
    ├── currentUses       Int         (default 0)
    ├── validUntil        DateTime?
    ├── createdAt         DateTime
    └── updatedAt         DateTime
  ```

- [ ] Tela "App Store" no Admin do Tenant:
  - Cards visuais dos módulos disponíveis com descrição, preço e botão "Assinar" / "Comprar".
  - Campo para aplicar Cupom de Desconto antes do pagamento.
- [ ] Integração de pagamento para a compra dos módulos:
  - Checkout interno via Mercado Pago (reuso da infra do TODO-MOD-05).
  - Ao confirmar o pagamento, o sistema ativa automaticamente a Feature Flag (`TenantModule.isActive = true`) e invalida o cache do middleware.

**⚠️ Riscos e Cuidados:**

- **Cupom Bruting:** Rate limiting no endpoint de validação de cupons. Cupons devem ter mínimo 8 caracteres alfanuméricos.
- **Race Condition em `maxUses`:** Usar `UPDATE ... SET currentUses = currentUses + 1 WHERE currentUses < maxUses` atômico (Prisma raw query ou `$executeRaw`) para impedir uso acima do limite.

---

### TODO-APPSTORE-02 ⚫ Módulo de Fidelidade (Cashback / Pontos)

**Descrição:** Sistema de pontos para reter clientes finais. Cada compra acumula pontos que podem ser trocados por descontos.

**Sub-tarefas:**

- [ ] Modelagem (Prisma):

  ```text
  LoyaltyAccount (userId FK UNIQUE, tenantId FK, pointsBalance INT, createdAt, updatedAt)

  LoyaltyTransaction (id UUID PK, accountId FK → LoyaltyAccount)
    ├── type       ENUM ['EARN','REDEEM','EXPIRE','ADMIN_ADJUST']
    ├── points     Int          (positivo para ganho, negativo para resgate)
    ├── orderId    FK? → Order  (referência ao pedido que gerou os pontos)
    ├── note       String?      (ex: "Resgate manual pelo admin")
    └── createdAt  DateTime
  ```

- [ ] Lógica de conversão configurável por Tenant (ex: R$ 10 = 1 pt, ou R$ 1 = 1 pt). Configuração armazenada em tabela `LoyaltyConfig (tenantId FK UNIQUE, pointsPerCurrencyUnit INT, currencyPerPoint INT)`.
- [ ] Gateway de resgate no fluxo de checkout: "Usar X pontos para R$ Y de desconto". O desconto é aplicado server-side e registrado no `Order.discountInCents`.
- [ ] Auditoria: toda movimentação de pontos gera um registro em `LoyaltyTransaction` (rastreabilidade completa). Saldo nunca pode ficar negativo (validação server-side).

**⚠️ Riscos e Cuidados:**

- **Fraude de pontos:** Nunca confiar no saldo enviado pelo frontend. Sempre recalcular server-side via `SUM(points) FROM LoyaltyTransaction WHERE accountId = X`.
- **Expiração:** Definir política de expiração de pontos (ex: 12 meses sem uso) para evitar passivo contábil infinito.

---

### TODO-APPSTORE-03 ⚫ Módulo de Gestão de Motoboys

**Descrição:** Ferramenta para o lojista gerenciar seus entregadores e automatizar o fechamento de diárias/comissões.

**Sub-tarefas:**

- [ ] Modelagem (Prisma):

  ```text
  DeliveryDriver (id UUID PK, tenantId FK)
    ├── name              String
    ├── whatsappNumber    String      (validado por regex, somente dígitos)
    ├── commissionType    ENUM ['FIXED_PER_DELIVERY','PERCENTAGE_OF_ORDER']
    ├── commissionValue   Int         (em centavos se FIXED, ou inteiro se PERCENTAGE ex: 5 = 5%)
    ├── isActive          Boolean
    ├── createdAt         DateTime
    └── updatedAt         DateTime

  DeliveryAssignment (id UUID PK, orderId FK UNIQUE → Order, driverId FK → DeliveryDriver)
    ├── assignedAt        DateTime
    ├── pickedUpAt        DateTime?   (quando saiu para entrega)
    ├── deliveredAt       DateTime?   (quando confirmou entrega)
    ├── status            ENUM ['ASSIGNED','IN_TRANSIT','DELIVERED','FAILED']
    └── failureNote       String?     (motivo se FAILED, ex: "Endereço não encontrado")
  ```

- [ ] Visualização restrita para o motoboy (via Magic Link seguro com expiração de 12h): Tela simplificada mostrando apenas endereço de entrega, itens do pedido (sem valores financeiros) e botão "Marcar como Entregue".
- [ ] Cálculo automático de comissões/diárias no painel Admin: total de entregas × valor por entrega, com relatório exportável em CSV e filtro por período.
- [ ] CRUD de entregadores no painel Admin (cadastrar, editar, ativar/desativar motoboys).

**⚠️ Riscos e Cuidados:**

- **Magic Link roubado:** Se alguém interceptar o link do motoboy, pode marcar entregas falsas. Mitigar com expiração curta (12h), token de uso único (single-use) e binding de IP ou device fingerprint.
- **Dados do cliente expostos ao motoboy:** A tela do motoboy deve mostrar APENAS o endereço de entrega, nunca o e-mail, telefone ou nome completo do comprador (LGPD — minimização de dados).

---

### TODO-APPSTORE-04 ⚫ Clube de Assinatura (Recorrência)

**Descrição:** Permite que o lojista venda "caixas mensais" ou "kits recorrentes" com cobrança automática.

**Sub-tarefas:**

- [ ] Modelagem (Prisma):

  ```text
  SubscriptionPlan (id UUID PK, tenantId FK)
    ├── name           String      (ex: "Caixa Festa Mensal")
    ├── description    String?
    ├── priceInCents   Int
    ├── intervalDays   Int         (ex: 30 para mensal, 7 para semanal)
    ├── isActive       Boolean
    ├── createdAt      DateTime
    └── updatedAt      DateTime

  CustomerSubscription (id UUID PK, planId FK → SubscriptionPlan, userId FK → User)
    ├── mpSubscriptionId  String?  (ID externo do Mercado Pago Subscriptions)
    ├── status            ENUM ['ACTIVE','PAUSED','CANCELLED']
    ├── startedAt         DateTime
    ├── nextBillingAt     DateTime
    ├── cancelledAt       DateTime?
    ├── createdAt         DateTime
    └── updatedAt         DateTime
  ```

- [ ] Integração com Mercado Pago Subscriptions API para cobrança recorrente automática.
- [ ] Disparo automatizado (cron / Supabase Edge Function) de criação de Pedido "Clube" no Kanban a cada ciclo de cobrança confirmado pelo webhook.
- [ ] Página de gerenciamento para o cliente final: pausar, cancelar ou trocar de plano. Botão de cancelamento deve ser **claramente visível** e funcional em no máximo 2 cliques (conformidade LGPD + CDC).
- [ ] E-mail de lembrete 3 dias antes da próxima cobrança (transparência com o consumidor).

**⚠️ Riscos e Cuidados:**

- **LGPD e Recorrência:** O consumidor DEVE poder cancelar a assinatura a qualquer momento, de forma autônoma e simples (Art. 18, LGPD + direito do consumidor). Não dificultar o cancelamento.
- **Cobrança indevida:** Se o cancelamento no nosso banco não sincronizar com o MP, o cliente pode ser cobrado após cancelar. Implementar webhook de `subscription.cancelled` do MP para garantir consistência bidirecional.

---

### TODO-APPSTORE-05 ⚫ Motor de Cupons Customizados (Marketing do Lojista)

**Descrição:** Permite que o lojista (Tenant) crie seus próprios cupons de desconto para os clientes finais da loja dele.

- [ ] Modelagem: `StoreCoupon (id UUID PK, tenantId FK, code UNIQUE per tenant, discountType ENUM['PERCENT','FIXED'], discountValue INT, minOrderCents INT?, maxUses INT?, currentUses INT, validFrom DateTime, validUntil DateTime, isActive BOOLEAN, createdAt, updatedAt)`.
- [ ] CRUD no painel do Lojista para criação e gerenciamento de cupons (nome, valor, limite de uso, validade).
- [ ] Verificação do código no gateway do Carrinho antes de prosseguir ao Checkout.
- [ ] Validações server-side: cupom expirado, limite de uso atingido, valor mínimo do pedido não atingido, cupom pertence ao Tenant correto.

**⚠️ Riscos e Cuidados:**

- **Abuso de cupons:** Limitar 1 cupom por pedido. Validação exclusivamente no server-side (nunca aplicar desconto apenas no frontend).
- **Enumeration attack:** Não retornar mensagens diferentes para "cupom inválido" vs "cupom expirado" na API pública. Mensagem genérica: "Cupom não encontrado ou indisponível".
