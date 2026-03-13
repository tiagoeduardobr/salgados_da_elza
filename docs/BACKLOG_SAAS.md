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

| Ameaça OWASP                        | Mitigação Obrigatória                                                                                                                                                                                                                                       |
| :---------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **A01 - Broken Access Control**     | Middleware de autorização por rota; verificação server-side de Feature Flags e Tenant ID em toda requisição. Nunca confiar apenas no frontend.                                                                                                              |
| **A02 - Cryptographic Failures**    | Credenciais e tokens apenas em variáveis de ambiente (`.env.local`). Dados sensíveis (CPF, e-mail) criptografados em repouso (AES-256 via Supabase Vault ou campo encrypted do Prisma). TLS/HTTPS obrigatório.                                              |
| **A03 - Injection**                 | Uso exclusivo de Prisma ORM (queries parametrizadas). Nunca concatenar input do usuário em SQL bruto. Sanitização de Rich Text (DOMPurify) contra XSS persistente.                                                                                          |
| **A04 - Insecure Design**           | Rate limiting em rotas de login e API pública. Threat modeling antes de cada fase. ⚠️ Implementar como **middleware reutilizável centralizado** (`rateLimit(config)`) com limites configuráveis por rota, em vez de implementações ad-hoc em cada endpoint. |
| **A05 - Security Misconfiguration** | Headers de segurança (CSP, X-Frame-Options, Strict-Transport-Security) via `next.config.js`. `.env` no `.gitignore`. Supabase Row-Level Security (RLS) ativo em todas as tabelas.                                                                           |
| **A06 - Vulnerable Components**     | `npm audit` no CI/CD. Dependabot ou Renovate para atualizações automáticas de deps.                                                                                                                                                                         |
| **A07 - Auth Failures**             | Supabase Auth (bcrypt + salt). Tokens JWT com expiração curta (15min access + refresh token). Proteção contra força bruta via rate limit por IP.                                                                                                            |
| **A08 - Data Integrity Failures**   | Webhook do Mercado Pago validado com assinatura HMAC-SHA256. Integridade de uploads validada (tipo MIME real, tamanho máximo).                                                                                                                              |
| **A09 - Logging & Monitoring**      | Logs estruturados (JSON) de eventos de autenticação e transações financeiras. Nunca logar dados sensíveis (senhas, tokens, CPFs completos — mascarar como `***.456.***-XX`).                                                                                |
| **A10 - SSRF**                      | Validação de URLs de callback/webhook. Whitelist de domínios para integrações externas.                                                                                                                                                                     |

### 🛡️ Conformidade LGPD (Lei nº 13.709/2018)

| Requisito Legal                            | Implementação Técnica                                                                                                                                                                                                                                                                                                                      |
| :----------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Base Legal (Art. 7)**                    | Coleta de dados pessoais somente com consentimento explícito (checkbox + timestamp) ou quando necessário para execução do contrato (pedido de compra).                                                                                                                                                                                     |
| **Finalidade e Minimização (Art. 6)**      | Coletar apenas os dados estritamente necessários para a operação (nome, e-mail, telefone, endereço de entrega). Não coletar dados extras "por precaução".                                                                                                                                                                                  |
| **Transparência (Art. 9)**                 | Página de Política de Privacidade acessível via footer. Informar claramente quais dados são coletados e para que servem antes do envio de qualquer formulário.                                                                                                                                                                             |
| **Direito de Acesso e Exclusão (Art. 18)** | Endpoint `/api/user/my-data` para exportação dos dados em JSON. Endpoint `/api/user/delete-account` para anonimização completa (soft-delete com hash irreversível dos dados pessoais).                                                                                                                                                     |
| **Retenção e Descarte (Art. 16)**          | Definir política de retenção: dados de pedidos mantidos por 5 anos (obrigação fiscal). Dados de conta inativa anonimizados após 2 anos sem login.                                                                                                                                                                                          |
| **Incidentes (Art. 48)**                   | Procedimento documentado para notificação à ANPD e ao titular em caso de vazamento, no prazo legal.                                                                                                                                                                                                                                        |
| **Encarregado (DPO)**                      | Informação de contato do responsável pelos dados visível na Política de Privacidade.                                                                                                                                                                                                                                                       |
| **Perfilamento (Art. 12, §2°)**            | Se dados pessoais forem usados para gerar perfil de consumo (ex: programa de fidelidade, histórico de compras), o titular deve ser informado de forma transparente e ter direito de solicitar revisão de decisões automatizadas.                                                                                                           |
| **Transferência Internacional (Art. 33)**  | Dados pessoais que trafeguem por serviços hospedados fora do Brasil (Supabase, Mercado Pago, Resend/SES) exigem base legal: consentimento específico, cláusulas contratuais padrão ou país com nível adequado de proteção. Documentar quais serviços processam dados e em que região.                                                      |
| **Segurança Técnica (Art. 46)**            | Medidas de segurança técnicas e administrativas devem ser adotadas para proteger dados pessoais contra acessos não autorizados, destruição, perda ou alteração. Referência cruzada: tabela OWASP Top 10 deste documento. Padrão de mascaramento em logs: CPF → `***.456.***-XX`, e-mail → `t***r@domain.com`, telefone → `(**) ****-1234`. |
| **Privacy by Design (Art. 49)**            | Sistemas devem ser concebidos desde o início com proteção de dados integrada (Privacy by Design) e com configurações de privacidade no máximo nível por padrão (Privacy by Default).                                                                                                                                                       |

### 🗄️ Normalização de Banco de Dados (Prisma)

| Forma Normal                             | Regra aplicada ao projeto                                                                                                                                                                                                                                                                                               |
| :--------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **1FN**                                  | Nenhum campo armazenará listas separadas por vírgula. Relacionamentos N:N usam tabelas de junção (ex: `ProductTag` entre `Product` e `Tag`).                                                                                                                                                                            |
| **2FN**                                  | Toda coluna não-chave depende da chave primária inteira. Tabelas como `OrderItem` terão chave composta (`orderId` + `productId`) ou PK própria, com preço unitário copiado no momento do pedido (snapshot, não referência).                                                                                             |
| **3FN**                                  | Nenhuma dependência transitiva. Exemplo: `Order` não armazena `customerName` — referencia `userId` e busca do `User`. Exceção planejada: campos de _snapshot_ financeiro (preço no momento da venda) para auditoria.                                                                                                    |
| **3FN — Campos Desnormalizados (Cache)** | Alguns campos são intencionalmente desnormalizados por performance (ex: `pointsBalance`, `currentUses`, `totalInCents`). Esses campos DEVEM ser tratados como **cache**: o valor autoritário é sempre a query derivada (`SUM`, `COUNT`). Documentar a justificativa em cada TODO que usar esse padrão.                  |
| **Soft Deletes**                         | Registros críticos (Usuários, Pedidos, Transações, dados pessoais) nunca são deletados fisicamente. Usam campo `deletedAt` (nullable DateTime) filtrado por `@default(dbgenerated())`. Tabelas de referência e configuração (ex: planos, cupons, motoristas) também devem usar soft delete para manter rastreabilidade. |
| **UUIDs**                                | Todas as PKs serão `UUID v4` em vez de IDs sequenciais, para impedir _enumeration attacks_ (ex: adivinhar `/api/orders/123`). Exceção: tabelas de junção N:N puras (ex: `ProductTag`) podem usar PK composta sem UUID próprio, desde que documentado.                                                                   |
| **Timestamps**                           | Toda tabela terá `createdAt` e `updatedAt` automáticos via Prisma (`@default(now())` / `@updatedAt`). Exceção: tabelas de auditoria append-only (ex: `OrderStatusHistory`) podem ter apenas `createdAt`, pois registros nunca são editados.                                                                             |

### ✅ Definition of Done (DoD) — Checklist de Conclusão por TODO

Todo TODO só pode ser considerado **"Done"** quando **TODOS** os itens abaixo forem cumpridos:

| Etapa                    | Critério                                                                                                                                                                                                                                       |
| :----------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Implementação**        | Todo o código da tarefa foi escrito, está limpo, modular e com comentários didáticos em pt-BR conforme `AGENTS.md`.                                                                                                                            |
| **Validação de Linting** | Código passa sem erros no ESLint + Prettier + TypeScript (`npm run lint` e `npm run type-check`).                                                                                                                                              |
| **Testes**               | Testes unitários e/ou de integração escritos para toda lógica de negócios nova. Cobertura mínima: 80% das linhas alteradas.                                                                                                                    |
| **Segurança**            | Revisão manual das mitigações OWASP listadas na tarefa. `npm audit` sem vulnerabilidades críticas ou altas.                                                                                                                                    |
| **LGPD**                 | Se a tarefa coleta ou processa dados pessoais, verificar conformidade com a tabela LGPD transversal deste documento.                                                                                                                           |
| **Acessibilidade**       | Componentes UI novos passam nas verificações WCAG 2.1 AA (contraste, navegação por teclado, alt texts).                                                                                                                                        |
| **Code Review**          | O código foi revisado (pelo próprio dev usando diff + checklist, ou por par quando houver).                                                                                                                                                    |
| **Versionamento**        | Branch criada no início (`feat/TODO-XXX-XX`). Commits semânticos em inglês (`<tipo>(<escopo>): <descrição>`). Merge na `main`, push e delete da branch (local + remota). Veja o workflow em `.agents/workflows/todo-workflow.md`.              |
| **Documentação**         | Se houve alteração arquitetural ou de API, o `BACKLOG.md` ou o `README.md` foram atualizados.                                                                                                                                                  |
| **Error Handling**       | Todo Server Action e API Route possui tratamento de erros estruturado (`try/catch`). Erros retornam respostas HTTP padronizadas (ex: `{ error: string, code: string }`). Componentes React com fetch usam Error Boundaries para isolar falhas. |
| **Performance**          | Páginas públicas atendem Core Web Vitals: LCP < 2.5s, FID < 100ms, CLS < 0.1. Bundle size monitorado com `@next/bundle-analyzer`.                                                                                                              |
| **UX de Estados**        | Todo componente que faz fetch possui 3 estados visuais: **loading** (skeleton/shimmer/spinner), **sucesso** (dados renderizados) e **erro** (mensagem amigável + ação de retry). Nunca mostrar tela em branco ou congelada.                    |

---

## Fase 1: Motor Principal e Arquitetura Multi-tenant (Core)

### TODO-CORE-01 🔴 Setup do Monorepo Next.js e Infraestrutura

**Descrição:** Configurar a base do monorepo Next.js de forma isolada, garantindo que a landing page estática (produção atual) permaneça inalterada até que a nova plataforma esteja validada e pronta para substituí-la.

**Dependências:** Nenhuma (raiz do projeto).

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
- [ ] Desabilitar _source maps_ em produção (`productionBrowserSourceMaps: false` no `next.config.js`) para impedir que atacantes leiam o código-fonte original (OWASP A05 - Security Misconfiguration).
- [ ] Configurar Dependabot ou Renovate para atualização automática de dependências com vulnerabilidades conhecidas (OWASP A06 - Vulnerable Components).

**⚠️ Riscos e Cuidados:**

- **Exposição de chaves (OWASP A02 - Cryptographic Failures):** Nunca commitar `.env.local`. Verificar `.gitignore` inclui `*.env.local`. A `SUPABASE_SERVICE_ROLE_KEY` deve ser rotacionada periodicamente (mínimo a cada 90 dias) e armazenada exclusivamente em variáveis de ambiente do serviço de deploy (Vercel/Railway), nunca no repositório.
- **Drift de banco:** Sempre rodar `prisma migrate` pelo CI e nunca editar o banco de produção "na mão".

**🛡️ LGPD — Cuidados com Dados:**

- **Transferência Internacional de Dados (LGPD Art. 33):** Ao configurar o Supabase, priorizar a região `South America (São Paulo)` para armazenamento de dados. Se utilizar região fora do Brasil, documentar a base legal para transferência internacional (consentimento específico do titular ou cláusulas contratuais padrão com o provedor).
- **Privacy by Design (LGPD Art. 49):** A arquitetura do projeto deve ser concebida desde o início com proteção de dados integrada. Todas as configurações de privacidade devem estar no nível máximo por padrão (Privacy by Default). Exemplo: RLS ativo em todas as tabelas desde a primeira migration, campos sensíveis criptografados por padrão.

**✨ Boas Práticas:**

- **Error Boundary global:** Criar arquivos `error.tsx` (erro genérico) e `not-found.tsx` (404) no diretório raiz do App Router. O `error.tsx` deve exibir mensagem amigável com botão "Tentar novamente" e logar o erro no console/servidor. Nunca expor stack traces ao usuário.
- **`@next/bundle-analyzer`:** Instalar e configurar como ferramenta de dev para monitorar o tamanho do bundle. Executar periodicamente para identificar dependências pesadas (ex: moment.js vs date-fns).
- **Core Web Vitals targets:** Definir alvos para páginas públicas: LCP < 2.5s, FID < 100ms, CLS < 0.1. Medir com Lighthouse CI no pipeline de CI/CD.

---

### TODO-CORE-02 🔴 Gerenciador de Módulos (Feature Flags)

**Descrição:** O coração do modelo SaaS. Cada Tenant (cliente) terá no banco de dados um registro indicando quais módulos ele contratou. O sistema usará essas flags para decidir, no servidor, quais rotas, componentes e menus renderizar.

**Dependências:** TODO-CORE-01 (infra base, Prisma, Supabase).

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

- **Bypass client-side (OWASP A01 - Broken Access Control):** As Feature Flags controlam a UI, mas a segurança REAL está no middleware/server. Um atacante pode manipular o DOM, mas NÃO as rotas protegidas. Garantir que o middleware cobre **todas** as rotas sensíveis, sem caminhos alternativos que o contornem (ex: rotas de API sem prefixo `/api/`).
- **Injeção no identificador de Tenant (OWASP A03 - Injection):** O identificador de Tenant (header, subdomain ou cookie) DEVE ser sanitizado e validado contra o banco antes de qualquer operação. Nunca interpolar diretamente em queries sem parametrização.
- **Cache Stale:** Se o cache do middleware não invalidar após a compra de um módulo, o cliente pode não ver a feature. Usar `revalidateTag('tenant-modules')` do Next.js para invalidação sob demanda.

**🗄️ Normalização — Cuidados:**

- **`TenantModule` sem `deletedAt` (Soft Deletes):** A desativação de módulos usa `isActive = false`, porém, se um registro de `TenantModule` for excluído, perde-se o histórico de quais módulos o Tenant já contratou. Adicionar `deletedAt?` para manter rastreabilidade, ou documentar que a exclusão NUNCA é permitida (apenas desativação via `isActive`).

**✨ Boas Práticas:**

- **Fallback fail-closed para Feature Flags:** Se a consulta de módulos falhar (banco offline, timeout), o middleware DEVE negar acesso (fail-closed) em vez de permitir. Estratégia: retornar `503 Service Unavailable` com página amigável "Serviço temporariamente indisponível, tente novamente em instantes". Nunca falhar silenciosamente permitindo acesso a módulos não contratados.

---

### TODO-CORE-03 🔴 Autenticação, Segurança e Theming Global

**Descrição:** Implementar o sistema de autenticação para o painel administrativo e a base da infraestrutura de theming dinâmico (CSS Variables + React Context).

**Dependências:** TODO-CORE-01 (infra base, Supabase Auth).

**Sub-tarefas:**

- [ ] Implementar fluxo de Login nativo via Supabase Auth (e-mail + senha com hash bcrypt automático).
  - Página `/admin/login` com formulário acessível (WCAG 2.1 AA: labels visíveis, foco visível, mensagens de erro claras).
  - Armazenamento do JWT em cookie `HttpOnly`, `Secure`, `SameSite=Lax` (nunca `localStorage`, que é vulnerável a XSS).
- [ ] Implementar proteção contra força bruta:
  - Rate limiting de 5 tentativas por IP a cada 15 minutos na rota `/api/auth/login`.
  - Resposta genérica: "Credenciais inválidas" (nunca revelar se o e-mail existe ou não — OWASP A07).
- [ ] Implementar política de senhas seguras (OWASP A07 - Auth Failures):
  - Comprimento mínimo: 12 caracteres. Não impor regras de complexidade excessiva (NIST SP 800-63B recomenda comprimento sobre complexidade).
  - Verificar senha contra lista de senhas vazadas (API HaveIBeenPwned Passwords — via hash k-anonymity, sem enviar a senha em claro).
  - Bloqueio temporário por conta (não apenas por IP) após 10 tentativas consecutivas falhadas: lockout de 30 minutos + e-mail de alerta ao titular.
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
- **Logging de autenticação (OWASP A09 - Logging & Monitoring):** Registrar em log estruturado (JSON) todos os eventos de autenticação: login bem-sucedido, login falhado (com IP e User-Agent, sem senha), logout e alteração de senha. Nunca logar senhas, tokens completos ou dados pessoais em claro.

**🛡️ LGPD — Cuidados com Dados:**

- **E-mail do admin é dado pessoal (LGPD Art. 7, V — Execução de Contrato):** O e-mail armazenado na tabela `User` é dado pessoal cujo tratamento é justificado pela execução do contrato de prestação de serviço SaaS. Não utilizá-lo para marketing sem consentimento específico.
- **Retenção de logs de autenticação (LGPD Art. 16 — Eliminação):** Logs de login contêm IP e User-Agent, que são dados pessoais (identificam pessoa indiretamente). Definir período máximo de retenção: **90 dias**, após os quais os logs devem ser anonimizados (remover IP e User-Agent, manter apenas métricas agregadas).
- **Direito de exclusão do admin (LGPD Art. 18, VI):** Usuários administradores devem poder solicitar a exclusão de sua conta via endpoint `/api/user/delete-account` (definido na tabela LGPD transversal). A exclusão deve anonimizar o registro (soft delete com hash irreversível) sem comprometer o histórico de auditoria do Tenant.

**✨ Boas Práticas:**

- **Loading state no login:** Desabilitar o botão de submit + exibir spinner durante a requisição de autenticação para evitar double-submit. Usar `useFormStatus` do React ou estado local `isSubmitting`.
- **Fluxo de redirecionamento:** Após login bem-sucedido → redirecionar para `/admin/dashboard`. Após logout → redirecionar para `/admin/login`. Se o usuário tentar acessar uma rota protegida sem sessão → redirecionar para `/admin/login?redirect={rotaOriginal}` e, após login, voltar à rota original.

---

## Fase 2: Módulo Base (A Landing Page)

### TODO-MOD-01 🟡 Módulo Institucional (Vendas pelo WhatsApp)

**Descrição:** O produto mínimo vendável. Uma landing page moderna e responsiva (Mobile-first) com exibição de catálogo estático. O pedido é direcionado para o WhatsApp da loja. Sem carrinho, sem pagamento online.

**Dependências:** TODO-CORE-01 (infra), TODO-CORE-02 (Feature Flags para módulo condicional).

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

- **Open Redirect via WhatsApp (OWASP A01 - Broken Access Control):** Validar que o `whatsappNumber` armazenado no banco contém apenas dígitos (regex: `/^\d{10,13}$/`). Nunca interpolar input do visitante na URL sem sanitização.
- **XSS na Landing Page (OWASP A03 - Injection):** Garantir que a CSP configurada no TODO-CORE-01 esteja ativa na landing page, bloqueando scripts inline não autorizados e fontes externas não whitelisted.
- **Dados do visitante (LGPD Art. 6, III — Necessidade):** Nesta fase, NÃO coletamos nenhum dado pessoal do visitante (sem formulários, sem cookies de rastreio). Isso simplifica enormemente a conformidade LGPD da landing page pura.

**🛡️ LGPD — Cuidados com Dados:**

- **Cookies e Analytics futuro (LGPD Art. 7, I — Consentimento):** Se futuramente for integrado Google Analytics, Meta Pixel ou qualquer ferramenta de rastreamento, será OBRIGATÓRIO implementar um banner de consentimento de cookies (opt-in explícito) antes de disparar qualquer script de tracking. Sem consentimento, nenhum cookie de rastreio deve ser setado.

**✨ Boas Práticas:**

- **Meta de performance Lighthouse:** A landing page é a porta de entrada e deve ter Lighthouse Performance ≥ 90 e Accessibility ≥ 90. Testar regularmente com Lighthouse CI.
- **Placeholder blur nas imagens:** Usar `blurDataURL` do Next.js `Image` para exibir placeholder desfocado enquanto a imagem carrega, evitando layout shift (CLS) e melhorando a percepção de velocidade.
- **`aria-live` para conteúdo dinâmico:** Se houver toasts ou notificações (ex: "Link copiado!"), usar `aria-live="polite"` para que leitores de tela anunciem a mudança.

---

## Fase 3: Módulo de Personalização (White-label Engine)

### TODO-MOD-02 🟡 Configurações e Customização (Storefront Settings)

**Descrição:** Área do admin para alterar aspectos visuais e textuais do frontend de forma autônoma, sem tocar no código e sem re-deploy. Módulo plugável: se inativo, o site usa valores default.

**Dependências:** TODO-CORE-01 (infra), TODO-CORE-03 (auth + ThemeProvider).

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

- **XSS via CMS (OWASP A03 - Injection):** Os valores de texto inseridos pelo admin (Hero Title, Regras) devem ser sanitizados (DOMPurify) antes de renderizar no frontend. Um admin comprometido poderia injetar `<script>` no campo de texto.
- **Upload de Logo malicioso (OWASP A08 - Data Integrity Failures):** Validação MIME type real do arquivo (não confiar na extensão). Aceitar apenas `image/png`, `image/jpeg`, `image/webp`, `image/svg+xml`. Tamanho máximo: 2 MB. Para SVGs, sanitizar com biblioteca dedicada (ex: `dompurify` com `ALLOWED_TAGS` restrito).
- **SSRF via URLs armazenadas (OWASP A10 - SSRF):** Os campos `logoUrl` e `faviconUrl` devem ser validados contra uma whitelist de domínios permitidos (ex: apenas o bucket Supabase Storage do Tenant). Nunca permitir URLs arbitrárias que possam apontar para recursos internos da rede.
- **Controle de acesso às configurações (OWASP A01 - Broken Access Control):** Apenas usuários com role `OWNER` devem poder alterar `StoreSettings`. Validar role server-side em toda Server Action de escrita neste módulo.

**🛡️ LGPD — Cuidados com Dados:**

- **Número de WhatsApp é dado pessoal do lojista (LGPD Art. 7, V — Execução de Contrato):** O campo `whatsappNumber` em `StoreSettings` é dado pessoal do lojista. Seu tratamento é justificado pela execução do contrato SaaS. Não compartilhar este número com terceiros além da exibição pública na landing page (finalidade consentida pelo lojista ao cadastrar).

**✨ Boas Práticas:**

- **Toast de feedback ao salvar:** Após salvar configurações com sucesso, exibir toast/snackbar "Configurações salvas com sucesso!" (verde). Em caso de erro, exibir "Erro ao salvar. Tente novamente." (vermelho) com botão de retry.
- **Validação visual inline nos formulários:** Além da validação server-side, exibir feedback em tempo real: borda vermelha + mensagem abaixo do campo inválido (ex: "Apenas dígitos permitidos"). Usar `aria-describedby` para acessibilidade.
- **`font-display: swap` como fallback:** Ao carregar Google Fonts, garantir `font-display: swap` para que o texto seja visível imediatamente com fonte de sistema, evitando FOIT (Flash of Invisible Text).

**🗄️ Normalização — Cuidados:**

- **`StoreSettings` sem `deletedAt` (Exceção justificada):** `StoreSettings` é um registro 1:1 com `Tenant` (FK UNIQUE). Não faz sentido deletar as configurações independentemente do Tenant — se o Tenant for excluído, as configurações seguem por cascade. Portanto, `deletedAt` não é necessário aqui.

---

## Fase 4: Módulo E-commerce Core

### TODO-MOD-03 🟢 CRUD de Produtos (Gestão de Catálogo e Estoque)

**Descrição:** Interface administrativa intuitiva para que o gestor da loja gerencie o catálogo de produtos, categorias, tags e estoque de forma independente. Inclui lógica de prevenção de venda furada.

**Dependências:** TODO-CORE-02 (Feature Flags), TODO-CORE-03 (auth + RBAC).

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

- **Race Condition no Estoque (OWASP A04 - Insecure Design):** Usar transação Prisma (`$transaction`) com `SELECT ... FOR UPDATE` para garantir que dois clientes não comprem o mesmo último item simultaneamente.
- **Preço em centavos:** Armazenar valores monetários como `Int` em centavos (ex: R$ 15,90 = `1590`). Nunca usar `Float` — erros de arredondamento causam discrepâncias financeiras.
- **IDOR — Insecure Direct Object Reference (OWASP A01 - Broken Access Control):** Sempre validar que o `productId` na URL pertence ao `tenantId` da sessão. Nunca confiar no ID da URL sem checar ownership.
- **Sanitização de Slug (OWASP A03 - Injection):** O `slug` gerado a partir do nome do produto deve ser sanitizado rigorosamente: apenas caracteres alfanuméricos e hífens, sem caracteres especiais, barras ou sequências de path traversal (`../`). Usar biblioteca dedicada (ex: `slugify`) com whitelist de caracteres.
- **Audit Trail de Catálogo (OWASP A09 - Logging & Monitoring):** Toda operação de escrita no catálogo (criação, edição, exclusão de produtos) deve gerar um log estruturado com `userId`, `tenantId`, `productId`, ação realizada e timestamp. Essencial para rastreabilidade e detecção de comprometimento de conta admin.

**🗄️ Normalização — Cuidados:**

- **`ProductTag` — PK composta sem UUID (Exceção documentada):** A tabela de junção `ProductTag` usa PK composta `(productId, tagId)` sem UUID próprio. Isso é uma exceção aceitável para tabelas de junção N:N puras, conforme nota na tabela transversal. Adicionar `createdAt` para rastreabilidade (saber quando a tag foi associada ao produto).
- **`Tag` sem `deletedAt` (Soft Deletes):** Se uma `Tag` for deletada fisicamente, os registros de `ProductTag` que a referenciam ficarão órfãos. Adicionar `deletedAt?` em `Tag` e filtrar por `WHERE deletedAt IS NULL` nas queries. Alternativa: usar `ON DELETE CASCADE` em `ProductTag`, mas isso perde histórico.
- **`Tag` sem timestamps (Timestamps):** O modelo Prisma de `Tag` (L342) define apenas `id`, `tenantId` e `label`, sem `createdAt` nem `updatedAt`. Adicionar ambos para conformidade com a regra transversal.
- **Índices compostos recomendados:** Criar `INDEX(tenantId, categoryId, isActive)` em `Product` para otimizar a listagem admin que filtra por tenant, categoria e status de publicação.

**✨ Boas Práticas:**

- **Skeleton rows na tabela admin:** Enquanto os dados carregam, exibir linhas de skeleton com efeito shimmer em vez de spinner centralizado. Mantém a percepção de rapidez.

**♿ Acessibilidade (WCAG 2.1):**

- **Modal de Confirmação:** O modal de exclusão deve ter `role="alertdialog"`, `aria-modal="true"`. O foco inicial ao abrir o modal DEVE ir direto para o botão "Cancelar" (primário e safe-action) para evitar exclusões acidentais por _enter-spam_.

- **Modal de confirmação antes de deletar/desativar:** Ao clicar em deletar ou desativar produto, exibir modal: _"Tem certeza que deseja desativar [Nome do Produto]? O produto ficará invisível na loja."_ com botões "Cancelar" (primário) e "Confirmar" (secundário/destrutivo).

- **Progress bar no upload de imagem:** Exibir barra de progresso durante upload de imagens grandes. Usar `XMLHttpRequest.upload.onprogress` ou equivalente do Supabase Storage client.
- **Compressão client-side antes do upload:** Comprimir e redimensionar a imagem no navegador antes de enviar ao storage (biblioteca `browser-image-compression`). Reduz tempo de upload e custo de banda.

---

### TODO-MOD-04 🟢 Carrinho de Compras e UX Avançada

**Descrição:** Implementação de um carrinho fluido e responsivo, sem recarregamento da página (SPA), mantendo o usuário engajado.

**Dependências:** TODO-MOD-03 (produtos precisam existir para serem adicionados ao carrinho).

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

- **Manipulação de preço no client (OWASP A04 - Insecure Design):** O preço exibido no carrinho é meramente informativo. O valor REAL é calculado **no servidor** no momento do checkout, consultando o banco. Nunca confiar no preço enviado pelo frontend.
- **XSS e localStorage (OWASP A03 - Injection / LGPD Art. 6, III — Necessidade):** Se um atacante conseguir executar JavaScript na página (XSS), ele pode ler o `localStorage`. Por isso, nunca armazenar tokens, e-mails ou dados pessoais ali. O carrinho armazena APENAS `productId`, `quantity` e `priceSnapshot` — dados não-pessoais, conforme o princípio da minimização.
- **Validação de quantidade no servidor (OWASP A04 - Insecure Design):** A `quantity` de cada item enviada pelo frontend DEVE ser revalidada server-side como inteiro positivo, com limite máximo razoável (ex: `MAX_QTY_PER_ITEM = 99`). Impedir que um atacante envie quantidades negativas, zero, ou absurdamente altas para manipular cálculos ou causar DoS.

**✨ Boas Práticas:**

- **Empty state do carrinho:** Quando o carrinho está vazio, exibir ilustração + texto _"Seu carrinho está vazio!"_ com botão CTA _"Explorar Produtos"_ que leva de volta ao catálogo. Nunca exibir drawer vazio sem orientação.
- **Micro-animação no badge do carrinho:** Ao adicionar um item, o badge numérico no ícone do carrinho deve fazer animação bounce (CSS `@keyframes`) para dar feedback tátil ao usuário.
- **Toast undo ao remover item:** Ao remover um item do carrinho, exibir toast _"Item removido"_ com botão **"Desfazer"** por 5 segundos. Se o usuário clicar, restaurar o item. Previne remoções acidentais e melhora a confiança do usuário.

**♿ Acessibilidade (WCAG 2.1):**

- **Focus Trap no Drawer:** O Carrinho (Drawer) deve gerenciar o foco (usar `role="dialog"`, `aria-modal="true"`) impedindo a navegação no fundo da página enquanto aberto. Ao fechar, o foco deve retornar ao botão que abriu o carrinho.
- **Botões Descritivos:** Os botões de incremento/decremento de quantidade devem possuir `aria-label` descritivo, ex: `aria-label="Aumentar quantidade de [Nome do Produto]"`.
- **Estado do Toggle:** O botão/ícone que abre o carrinho deve possuir `aria-expanded` refletindo o estado atual (true/false).

---

## Fase 5: Checkout e Integração Financeira

### TODO-MOD-05 🔵 Checkout Transparente (Mercado Pago)

**Descrição:** Um processo de finalização de compra sem redirecionamento externo (White-label), maximizando a taxa de conversão. A segurança dos dados de cartão é inteiramente responsabilidade do SDK do Mercado Pago (Tokenization), garantindo que nenhum dado de cartão passe pelo nosso backend (PCI-DSS compliance).

**Dependências:** TODO-MOD-03 (estoque + reserva), TODO-MOD-04 (carrinho).

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
    ├── discountInCents Int?       (desconto total aplicado — pode vir de cupom TODO-APPSTORE-05 e/ou pontos TODO-APPSTORE-02)
    ├── discountSource  ENUM?     ['COUPON','LOYALTY','COMBINED'] (⚠️ origem do desconto para rastreabilidade)
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

- **PCI-DSS (OWASP A02 - Cryptographic Failures):** Nosso backend NUNCA recebe, armazena ou loga número de cartão, CVV ou data de validade. Isso é 100% responsabilidade do SDK do Mercado Pago. Se violarmos isso, estamos sujeitos a multas pesadas e banimento do gateway.
- **Dados pessoais — LGPD (OWASP A02 - Cryptographic Failures):** A tabela `CustomerInfo` contém dados sensíveis (nome, e-mail, telefone, endereço). Todos esses campos devem ser criptografados em repouso com **AES-256-GCM** via Supabase Vault ou campo encrypted gerenciado pelo Prisma middleware. O campo `lgpdConsentAt` é obrigatório e prova que o titular deu consentimento explícito.
- **Idempotência (OWASP A08 - Data Integrity Failures):** Se o webhook do MP disparar duas vezes (retry), o sistema não deve processar o pedido em duplicidade. Usar `mpPaymentId` como chave de idempotência (`UNIQUE` constraint).
- **Rate Limiting no Checkout (OWASP A04 - Insecure Design):** O endpoint de criação de pedido deve ter rate limiting por IP e por sessão (ex: máximo 5 pedidos por minuto) para impedir abuso, DDoS e tentativas automatizadas de compra fraudulenta.
- **SSRF via API ViaCEP (OWASP A10 - SSRF):** A chamada à API de CEP (ViaCEP) deve ser feita exclusivamente server-side, com domínio fixo em whitelist (`viacep.com.br`). Nunca permitir que o frontend especifique a URL da API de CEP. Validar que o CEP informado contém apenas 8 dígitos numéricos antes da chamada.

**🛡️ LGPD — Cuidados com Dados (PONTO CRÍTICO DO PROJETO):**

- **Transparência pré-coleta (LGPD Art. 9):** Antes do formulário de Identificação (Etapa 1 do Stepper), exibir texto informativo claro: _"Coletamos seu nome, e-mail, telefone e endereço exclusivamente para processar e entregar seu pedido. Seus dados são criptografados e nunca compartilhados para marketing. Consulte nossa [Política de Privacidade]."_
- **Criptografia COMPLETA de `CustomerInfo` (LGPD Art. 46):** ALÉM de `fullName`, `email` e `phone`, os campos de endereço (`addressStreet`, `addressNumber`, `addressComplement`, `addressNeighborhood`, `addressCity`) TAMBÉM devem ser criptografados em repouso. O endereço identifica uma pessoa e é dado pessoal segundo a LGPD. Somente `addressZip` e `addressState` (UF) podem permanecer em claro (não identificam individualmente).
- **Campos opcionais vs obrigatórios (LGPD Art. 6, III — Necessidade):** O campo `addressComplement` é opcional e deve ser claramente marcado como tal na UI (não obrigar o titular a fornecer dados desnecessários). Revisar se todos os campos do formulário são realmente necessários para a finalidade (entrega do pedido).
- **Guest Checkout e direitos do titular (LGPD Art. 18):** No guest checkout (sem conta), o titular não tem login para acessar `/api/user/my-data`. Implementar mecanismo alternativo: enviar no e-mail de confirmação do pedido um link seguro (token único com expiração de 30 dias) para que o comprador possa consultar ou solicitar exclusão de seus dados.
- **Retenção diferenciada (LGPD Art. 16 — Eliminação):** Dados do pedido (itens, valores, status) são mantidos por 5 anos (obrigação fiscal). Porém, os dados pessoais em `CustomerInfo` podem ser anonimizados ANTES desse prazo se o titular solicitar (Art. 18, VI). Implementar anonimização seletiva: hash irreversível dos campos pessoais mantendo o registro do pedido para fins fiscais.
- **Minimização na integração com Mercado Pago (LGPD Art. 6, III):** Enviar ao MP apenas os dados estritamente necessários para processar o pagamento. Não enviar o endereço completo na API de pagamento se não for exigido pelo MP para a modalidade escolhida (PIX não exige endereço).

**🗄️ Normalização — Cuidados:**

- **`OrderItem` sem timestamps (Timestamps):** Adicionar `createdAt` em `OrderItem` para registrar o instante exato do snapshot de preço. Como registros de itens são imutáveis após criação (nunca editados), `updatedAt` não é necessário (exceção append-only).
- **`CustomerInfo` sem timestamps nem `deletedAt` (Timestamps + Soft Deletes):** Adicionar `createdAt` e `updatedAt`. Adicionar `deletedAt?` — essencial para o fluxo de anonimização LGPD (Art. 18, VI): ao anonimizar, popular `deletedAt` e substituir campos pessoais por hash irreversível, mantendo o registro do pedido intacto.
- **`OrderStatusHistory` apenas com `createdAt` (Exceção documentada):** Registros de histórico de status são append-only (nunca editados). Ter apenas `createdAt` é correto e intencional — conforme exceção na tabela transversal.
- **`Order.totalInCents` — 3FN (Campo desnormalizado justificado):** O total é derivável de `SUM(OrderItem.unitPriceInCents * quantity) - discountInCents`, o que seria uma dependência transitiva. Porém, armazená-lo é justificado como snapshot financeiro para auditoria e performance em queries de KPI (Dashboard). Tratar como **valor autoritário após criação** — nunca recalcular retroativamente.
- **Índices compostos recomendados:** `INDEX(tenantId, status)` e `INDEX(tenantId, createdAt)` em `Order` para queries do Kanban e KPIs. `INDEX(orderId, createdAt)` em `OrderStatusHistory` para timeline de rastreio.

**✨ Boas Práticas:**

- **Loading overlay entre etapas do stepper:** Ao avançar entre etapas do checkout, exibir overlay semi-transparente com spinner. Desabilitar botões "Avançar" e "Voltar" durante a transição para evitar double-submit.
- **Persistência parcial do checkout em `sessionStorage`:** Salvar progresso das etapas (identificação, endereço) em `sessionStorage` (não `localStorage` — dados pessoais temporários). Se o usuário sair e voltar na mesma sessão, os campos já preenchidos são restaurados. Limpar ao finalizar ou abandonar.
- **Tratamento de erro do SDK Mercado Pago:** Se o `card_token` for rejeitado ou o SDK retornar erro, exibir mensagem amigável: _"Não foi possível processar o cartão. Verifique os dados e tente novamente."_ Nunca expor códigos técnicos do MP ao usuário.
- **Retry com backoff exponencial para API do MP:** Em caso de falha transitória (erros 5xx), implementar retry automático com backoff exponencial (1s, 2s, 4s) por no máximo 3 tentativas. Se falhar definitivamente, exibir _"Serviço de pagamento indisponível. Tente novamente em instantes."_
- **Timeout do QR Code PIX:** Ao expirar o prazo de validade do PIX (30 minutos), exibir claramente _"QR Code expirado"_ com botão **"Gerar novo QR Code"** em vez de deixar a tela congelada.

**♿ Acessibilidade (WCAG 2.1):**

- **Indicador de Etapa (Stepper):** O item do stepper correspondente à etapa ativa deve possuir `aria-current="step"` para que usuários de tecnologias assistivas compreendam o progresso.
- **Iframe de Pagamento:** O iframe renderizado pelo SDK do Mercado Pago DEVE possuir um atributo `title` descritivo (ex: `title="Formulário de pagamento seguro"`).

---

### TODO-MOD-06 🔵 Webhooks e Notificações (Orquestração de Pedidos)

**Descrição:** Sistema reativo que escuta as atualizações de pagamento do Mercado Pago para dar andamento automatizado ao pedido.

**Dependências:** TODO-MOD-05 (pedidos + configuração MP).

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

- **Webhook Forgery (OWASP A08 - Data Integrity Failures):** Sem validação HMAC, qualquer pessoa pode simular uma chamada do MP e marcar pedidos como pagos sem pagar. Isso é uma vulnerabilidade **CRÍTICA**. A validação de assinatura HMAC-SHA256 é o ponto mais importante de segurança de todo o fluxo financeiro.
- **Replay Attack (OWASP A08 - Data Integrity Failures):** Armazenar `mpPaymentId` já processados e ignorar duplicatas (idempotência).
- **IP Whitelist do Mercado Pago (OWASP A05 - Security Misconfiguration):** Sempre que possível, restringir o endpoint `/api/webhooks/mercadopago` para aceitar chamadas apenas dos IPs oficiais do Mercado Pago (consultar documentação do MP para lista atualizada). Isso adiciona uma camada extra de defesa além do HMAC.
- **Rate Limiting no Webhook (OWASP A04 - Insecure Design):** Aplicar rate limiting no endpoint de webhook para mitigar ataques de DDoS. Um atacante poderia inundar o endpoint com chamadas falsas (que seriam rejeitadas pelo HMAC, mas consumiriam recursos de processamento).
- **Logging de Transações Financeiras (OWASP A09 - Logging & Monitoring):** Toda transação processada pelo webhook (aprovação, rejeição, reembolso) deve gerar um log estruturado (JSON) contendo: `mpPaymentId`, `orderId`, `status`, `timestamp` e resultado do processamento. Nunca logar dados de cartão ou informações pessoais do comprador. Esses logs são essenciais para auditoria financeira e detecção de fraudes.
- **Timeout:** O Mercado Pago espera resposta em até 10 segundos. Se demorar mais, ele faz retry. Por isso, processar em background e responder `200 OK` imediatamente.

**🛡️ LGPD — Cuidados com Dados:**

- **Link "Gerenciar meus dados" no e-mail (LGPD Art. 18 — Direitos do Titular):** O link no rodapé do e-mail transacional deve direcionar para uma página onde o titular pode: (1) visualizar seus dados armazenados, (2) solicitar exportação em JSON, (3) solicitar exclusão/anonimização. Para guest checkout, o acesso é via token seguro enviado no próprio e-mail.
- **Operadores externos — DPA (LGPD Art. 39 — Operador):** Resend (ou AWS SES) é um **Operador** de dados sob a LGPD, pois processa dados pessoais (e-mail do comprador) em nome do Controlador (Tenant). Exigir que o provedor de e-mail tenha um Data Processing Agreement (DPA) assinado ou que seus Termos de Serviço cubram os requisitos do Art. 39.
- **Mascaramento em logs de e-mail (LGPD Art. 46 — Segurança):** Logs de envio de e-mail não devem conter o endereço de e-mail completo do destinatário. Mascarar como `t***r@email.com`. Logar apenas `orderId`, status de envio e timestamp.

**✨ Boas Práticas:**

- **Dead Letter Queue (DLQ) para webhooks falhados:** Se o processamento de um evento falhar após 3 retries internos, mover para uma fila de erro persistente (tabela `WebhookDeadLetter` ou solução de mensageria) para análise e reprocessamento manual. Alertar admin via e-mail/notificação.
- **Retry para e-mail transacional:** Se o envio de e-mail falhar (Resend/SES down), implementar retry com backoff (1s, 5s, 30s) por até 3 tentativas. Se falhar definitivamente, registrar em log de erro e alertar admin. O pedido já foi confirmado — o e-mail não deve bloquear o fluxo.
- **Template de e-mail responsivo testado:** Antes do deploy, testar renderização do template em múltiplos clientes de e-mail (Gmail web, Gmail app, Outlook, Apple Mail). Usar ferramenta como Litmus, Email on Acid ou ao menos envio de teste manual.

---

## Fase 6: Analytics e Dashboard Administrativo

### TODO-MOD-07 🟣 Dashboard Gerencial Avançado

**Descrição:** Uma sala de controle rica em dados para o gestor ter visibilidade total do fluxo do negócio, usando gráficos interativos.

**Dependências:** TODO-MOD-05 (dados de pedidos), TODO-MOD-06 (webhooks para status atualizado).

**Sub-tarefas:**

- [ ] Layout do Admin Dashboard com Sidebar Lateral:
  - Navegação: Visão Geral, Pedidos, Catálogo, Configurações, (App Store — se Fase 7 ativa).
  - Sidebar responsiva: colapsável em mobile para tela `≤ 768px`.
- [ ] **Visão Geral (Cards de KPI):**
  - Faturamento Diário / Semanal / Mensal (calculado via query agregada no Prisma: `SUM(totalInCents) WHERE status = 'PAID'`).
  - Ticket Médio por Venda (`AVG(totalInCents)`).
  - Número total de pedidos no período.
  - Top 5 Produtos mais vendidos (ranking com `GROUP BY productId, COUNT()`).
- [ ] **Fluxo de Caixa Visual (Gráficos):**
  - Gráfico de linha: evolução de receita (`Receita` x `Dias da Semana`) com Recharts ou Chart.js.
  - Filtros de período: Hoje, Últimos 7 dias, Este mês, Custom range.
- [ ] **Gestor de Pedidos (Kanban em Tempo Real):**
  - Colunas: `[Recebido] → [Em Preparo] → [Saiu para Entrega] → [Entregue]`.
  - **Mapeamento Kanban ↔ `Order.status`:** `PAID → Recebido`, `PREPARING → Em Preparo`, `SHIPPED → Saiu para Entrega`, `DELIVERED → Entregue`. Pedidos `PENDING`/`PROCESSING` ficam fora do Kanban (aguardando pagamento). `CANCELLED`/`REFUNDED` acessíveis via filtro lateral.
  - Drag-and-drop para mover pedidos entre colunas (Server Action com atualização otimista).
  - Timeline de rastreio: cada mudança de status insere um registro na tabela `OrderStatusHistory` (definida na Fase 5 — TODO-MOD-05), permitindo auditoria completa com data, responsável e observação.
- [ ] Backend Server Actions para mover pedidos entre colunas, com validação de transição (ex: não pode pular de "Recebido" direto para "Entregue" — máquina de estados finita com transições permitidas definidas em código).
- [ ] Tela de Rastreio Pública: link compartilhável `/rastreio/{orderNumber}` que o cliente final pode acessar para ver o status do pedido em tempo real (consome `OrderStatusHistory`). Não exige login.

**⚠️ Riscos e Cuidados:**

- **Queries pesadas:** As queries de agregação (SUM, AVG, COUNT) podem ficar lentas com volume grande. Planejar índices adequados e, se necessário, materializar views no Supabase.
- **Dados financeiros expostos (OWASP A01 - Broken Access Control):** O Dashboard só deve ser acessível por role `OWNER`. `MANAGER` e `VIEWER` veem apenas dados de pedidos, não financeiros. Validar role server-side em toda Server Action e endpoint de KPI.
- **Escopo do Tenant (OWASP A01 - Broken Access Control):** Toda query de KPI DEVE filtrar por `tenantId`. Sem isso, um admin veria dados de TODOS os clientes da plataforma.
- **Tela de Rastreio Público — Vazamento de Dados (OWASP A01 - Broken Access Control / LGPD):** A rota pública `/rastreio/{orderNumber}` deve exibir APENAS o status do pedido e a timeline de fases (`OrderStatusHistory`). Nunca expor `CustomerInfo` (nome, e-mail, telefone, endereço) na tela pública. Verificar que a query não faz JOIN com dados pessoais.
- **Enumeração de Pedidos na Rota Pública (OWASP A04 - Insecure Design):** O `orderNumber` NÃO deve ser um número sequencial previsível (1, 2, 3...), pois permitiria que qualquer pessoa acessasse o status de pedidos alheios incrementando o número na URL. Usar formato alfanumérico aleatório (ex: `ELZA-A7K9X2`) ou incluir um token de segurança no link de rastreio enviado ao cliente.
- **Rate Limiting na Rota Pública (OWASP A04 - Insecure Design):** Aplicar rate limiting na rota `/rastreio/{orderNumber}` para impedir _enumeration attacks_ automatizados (brute-force para descobrir pedidos válidos).

**🛡️ LGPD — Cuidados com Dados:**

- **Dados pessoais no Kanban (LGPD Art. 6, III — Necessidade):** Os cards de pedido no Kanban devem exibir apenas o mínimo necessário para operação: número do pedido, status, valor e itens. O nome completo do comprador deve ser exibido de forma parcial (ex: `Maria S.`) ou somente acessível ao clicar no detalhe do pedido. Nunca exibir e-mail ou telefone diretamente no card.
- **Exportação de dados do Dashboard (LGPD Art. 46 — Segurança):** Se o Dashboard permitir exportação de relatórios em CSV/Excel, os dados pessoais dos clientes (nome, e-mail, telefone, endereço) devem ser anonimizados ou omitidos na exportação por padrão. Caso o `OWNER` necessite dos dados completos, exigir confirmação explícita e registrar a exportação em log de auditoria.

**✨ Boas Práticas:**

- **Skeleton shimmer nos cards de KPI:** Enquanto os dados carregam, exibir cards com efeito shimmer (animação de brilho) no lugar dos números. Nunca mostrar "0" ou "R$ 0,00" como placeholder — isso confunde o admin.
- **Empty state nos gráficos:** Quando não há dados suficientes para renderizar um gráfico (ex: loja recém-criada), exibir ilustração + texto: _"Ainda não há dados suficientes para exibir gráficos. Comece a receber pedidos!"_
- **Atualização otimista no Kanban:** Ao arrastar um card de pedido entre colunas, mover visualmente IMEDIATAMENTE (UI otimista). Se a Server Action falhar, reverter a posição e mostrar toast de erro: _"Não foi possível mover o pedido. Tente novamente."_
- **Error Boundary isolado por gráfico:** Se o Recharts/Chart.js crashar em um gráfico específico, não derrubar a página toda. Envolver cada card/gráfico em um Error Boundary próprio que exibe _"Erro ao carregar gráfico"_ com botão de retry.

**♿ Acessibilidade (WCAG 2.1):**

- **Navegação por Teclado no Kanban:** A biblioteca de Drag-and-Drop deve ser totalmente operável via teclado (ex: `dnd-kit`), permitindo focar, selecionar (`Espaço`) e mover (`Setas`) os cards entre as colunas com anúncios para screen readers.
- **Alternativa Estruturada para Gráficos:** Para cada gráfico de KPI, deve haver uma tabela invisível (`.sr-only`) ou um botão "Ver como tabela" que forneça os mesmos dados estruturados para usuários de leitor de tela.

---

## Fase 7: App Store Interna (Plugins High-Ticket)

### TODO-APPSTORE-01 ⚫ Setup da Vitrine de Módulos (Admin Global)

**Descrição:** Área visível dentro do painel Admin onde o cliente (Tenant) pode ver quais módulos extras estão disponíveis, seus preços e comprá-los direto pelo painel. Inclui motor de cupons de desconto para o dono da plataforma negociar valores.

**Dependências:** TODO-CORE-02 (Feature Flags), TODO-MOD-05 (checkout para pagamento de módulos).

> ⚠️ **Não confundir:** `DiscountCoupon` (definido aqui) são cupons da **plataforma** — usados pelo admin global para dar desconto na compra de módulos. Já `StoreCoupon` (definido no TODO-APPSTORE-05) são cupons do **lojista** — criados pelo Tenant para seus clientes finais.

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

- **Cupom Bruting (OWASP A07 - Auth Failures):** Rate limiting no endpoint de validação de cupons. Cupons devem ter mínimo 8 caracteres alfanuméricos. Mensagem genérica em caso de falha: "Cupom inválido" (nunca revelar se o código existe mas está expirado).
- **Race Condition em `maxUses` (OWASP A04 - Insecure Design):** Usar `UPDATE ... SET currentUses = currentUses + 1 WHERE currentUses < maxUses` atômico (Prisma raw query ou `$executeRaw`) para impedir uso acima do limite.
- **Permissão de Compra de Módulos (OWASP A01 - Broken Access Control):** Apenas usuários com role `OWNER` devem poder comprar módulos na App Store. Validar role server-side antes de processar a compra ou ativar Feature Flags.

**🗄️ Normalização — Cuidados:**

- **`ModuleCatalog` sem `deletedAt` (Soft Deletes):** Se um módulo for descontinuado, excluí-lo fisicamente quebra referências de Tenants que já o compraram. Adicionar `deletedAt?` e filtrar por `WHERE deletedAt IS NULL` na vitrine.
- **`DiscountCoupon` sem `deletedAt` (Soft Deletes):** Cupons usados são referências históricas. Adicionar `deletedAt?` para manter rastreabilidade de cupons expirados ou removidos.
- **`DiscountCoupon.currentUses` — 3FN (Campo cache):** O valor é derivável de `COUNT(pedidos que usaram este cupom)`. Armazenar por performance, mas tratar como cache. A operação atômica `UPDATE ... SET currentUses = currentUses + 1 WHERE currentUses < maxUses` (já documentada nos Riscos) garante consistência.

**✨ Boas Práticas:**

- **Feedback visual ao aplicar cupom:** Ao inserir um cupom válido, exibir check animation (verde) + texto _"Cupom aplicado! -50%"_. Se inválido, shake animation (vermelha) + texto _"Cupom inválido"_. A animação dá feedback imediato e satisfatório.

---

### TODO-APPSTORE-02 ⚫ Módulo de Fidelidade (Cashback / Pontos)

**Descrição:** Sistema de pontos para reter clientes finais. Cada compra acumula pontos que podem ser trocados por descontos.

**Dependências:** TODO-MOD-05 (checkout para acumular/resgatar pontos).

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

- **Fraude de pontos (OWASP A04 - Insecure Design):** Nunca confiar no saldo enviado pelo frontend. Sempre recalcular server-side via `SUM(points) FROM LoyaltyTransaction WHERE accountId = X`. Toda movimentação de pontos DEVE ser registrada em `LoyaltyTransaction` — sem exceção — para garantir auditoria completa (OWASP A09 - Logging & Monitoring).
- **Expiração:** Definir política de expiração de pontos (ex: 12 meses sem uso) para evitar passivo contábil infinito.

**🛡️ LGPD — Cuidados com Dados:**

- **Histórico de pontos é perfil de consumo (LGPD Art. 12, §2° — Perfilamento):** A associação `userId ↔ LoyaltyTransaction` constitui dados pessoais que revelam o perfil de consumo do titular. O titular deve ser informado de forma transparente (na Política de Privacidade e no momento de adesão ao programa) de que seus dados de compra são utilizados para calcular pontos de fidelidade.
- **Exclusão da conta de fidelidade (LGPD Art. 18, VI — Eliminação):** Se o titular solicitar exclusão de conta via `/api/user/delete-account`, a `LoyaltyAccount` e todo o histórico de `LoyaltyTransaction` devem ser anonimizados junto com os demais dados pessoais. Os pontos não resgatados são perdidos (documentar isso nos termos do programa).

**🗄️ Normalização — Cuidados:**

- **`LoyaltyAccount` sem `id UUID PK` (UUIDs):** O modelo atual define apenas `userId FK UNIQUE` como identificador, sem PK UUID própria. Adicionar `id UUID PK` para consistência com o padrão do projeto e para facilitar referências de FK de `LoyaltyTransaction`.
- **`LoyaltyAccount` sem `deletedAt` (Soft Deletes):** Vinculado a dados pessoais. Adicionar `deletedAt?` para o fluxo de anonimização LGPD.
- **`LoyaltyConfig` incompleta (UUIDs + Timestamps):** Mencionada inline sem `id UUID PK`, `createdAt` nem `updatedAt`. Adicionar todos para conformidade com as regras transversais.
- **`LoyaltyAccount.pointsBalance` — 3FN (Campo cache):** O saldo é derivável de `SUM(points) FROM LoyaltyTransaction WHERE accountId = X`. Armazená-lo melhora performance, mas DEVE ser tratado como cache. O aviso de "Fraude de pontos" já documenta que o valor autoritário é o `SUM` — manter consistência via `$transaction` ao criar `LoyaltyTransaction` + atualizar `pointsBalance` atomicamente.
- **Índice recomendado:** `INDEX(accountId, createdAt)` em `LoyaltyTransaction` para queries de saldo e expiração.

**✨ Boas Práticas:**

- **Empty state para conta sem pontos:** Quando o usuário ainda não tem pontos, exibir ilustração + texto: _"Você ainda não tem pontos. Faça uma compra para começar a acumular!"_ com CTA para o catálogo.
- **Formatação locale-aware de pontos:** Exibir saldo formatado com `Intl.NumberFormat` (ex: `1.500 pts` em vez de `1500`). Respeitar o locale do navegador.

---

### TODO-APPSTORE-03 ⚫ Módulo de Gestão de Motoboys

**Descrição:** Ferramenta para o lojista gerenciar seus entregadores e automatizar o fechamento de diárias/comissões.

**Dependências:** TODO-MOD-05 (pedidos precisam existir para atribuir entregas).

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

- **Magic Link roubado (OWASP A07 - Auth Failures):** Se alguém interceptar o link do motoboy, pode marcar entregas falsas. Mitigar com expiração curta (12h), token de uso único (single-use) e binding de sessão seguro. ⚠️ Binding por IP é frágil em conexões móveis (IP dinâmico); preferir _device fingerprint_ (via User-Agent + resolução de tela) combinado com token JWT de sessão curta assinado no backend.
- **Dados do cliente expostos ao motoboy (OWASP A01 - Broken Access Control / LGPD):** A tela do motoboy deve mostrar APENAS o endereço de entrega, nunca o e-mail, telefone ou nome completo do comprador (LGPD — minimização de dados, Art. 6). A query da rota do motoboy DEVE selecionar apenas os campos necessários (`SELECT addressStreet, addressNumber, ...`) — nunca `SELECT *` da tabela `CustomerInfo`.

**🛡️ LGPD — Cuidados com Dados:**

- **Dados do motoboy são dados pessoais (LGPD Art. 7, V — Execução de Contrato):** Os campos `DeliveryDriver.name` e `whatsappNumber` são dados pessoais do entregador. Seu tratamento é justificado pela execução do contrato de prestação de serviço de entrega. O consentimento deve ser obtido no cadastro do motoboy (checkbox ou termo de aceite) e o motoboy deve poder solicitar exclusão de seus dados.
- **Compartilhamento de endereço com motoboy (LGPD Art. 7, V — Execução de Contrato):** O endereço do cliente é compartilhado com o entregador exclusivamente para a finalidade de entrega do pedido. Esse compartilhamento é justificado pela execução do contrato de compra. O endereço deve ser visível ao motoboy APENAS durante o período ativo da entrega — após a conclusão (`status = DELIVERED`), a tela do motoboy não deve mais exibir o endereço.

**🗄️ Normalização — Cuidados:**

- **`DeliveryDriver` sem `deletedAt` (Soft Deletes):** O modelo usa `isActive` para desativação, mas sem `deletedAt?`, a exclusão física perde o histórico de entregas vinculadas ao motoboy. Adicionar `deletedAt?` para manter rastreabilidade e permitir anonimização LGPD sem perder registros de `DeliveryAssignment`.
- **`DeliveryDriver.commissionValue` — Semântica ambígua:** O campo armazena centavos (se `FIXED`) OU porcentagem inteira (se `PERCENTAGE`). Não viola 1FN, mas a semântica dupla pode causar bugs. Documentar claramente e validar server-side conforme `commissionType`.
- **Índice recomendado:** `INDEX(driverId, status)` em `DeliveryAssignment` para listagem de entregas ativas por motoboy.

**✨ Boas Práticas:**

- **Skeleton na tela do motoboy:** Enquanto os dados da entrega carregam, exibir skeleton do endereço e itens. A tela do motoboy pode ser acessada em condições de rede ruim (4G fraco) — o skeleton evita que o motoboy pense que o link está quebrado.
- **Confirmação antes de "Marcar como Entregue":** Exibir modal de confirmação: _"Confirmar entrega no endereço [Rua X, Nº Y]?"_ para evitar taps acidentais em tela de celular. Uma vez confirmado, não pode ser revertido pelo motoboy.

**♿ Acessibilidade (WCAG 2.1):**

- **Touch Targets Mínimos:** Como a tela do motoboy é voltada para uso mobile em trânsito, todos os botões e áreas clicáveis devem ter no mínimo **44px por 44px** (WCAG 2.1 AA) para evitar erros de toque e facilitar a interação rápida.

---

### TODO-APPSTORE-04 ⚫ Clube de Assinatura (Recorrência)

**Descrição:** Permite que o lojista venda "caixas mensais" ou "kits recorrentes" com cobrança automática.

**Dependências:** TODO-MOD-05 (infra MP), TODO-MOD-06 (webhooks para cobrança recorrente).

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

- **LGPD e Recorrência (OWASP A04 - Insecure Design):** O consumidor DEVE poder cancelar a assinatura a qualquer momento, de forma autônoma e simples (Art. 18, LGPD + direito do consumidor). Não dificultar o cancelamento.
- **Cobrança indevida (OWASP A08 - Data Integrity Failures):** Se o cancelamento no nosso banco não sincronizar com o MP, o cliente pode ser cobrado após cancelar. Implementar webhook de `subscription.cancelled` do MP para garantir consistência bidirecional. ⚠️ O webhook de assinatura DEVE passar pela mesma validação HMAC-SHA256 definida no TODO-MOD-06 — nunca processar sem verificar assinatura.
- **Audit Trail de Assinaturas (OWASP A09 - Logging & Monitoring):** Toda mudança de status de assinatura (ativação, pausa, cancelamento, reativação) deve gerar um log estruturado com `userId`, `subscriptionId`, status anterior/novo, origem da ação (cliente, admin ou webhook) e timestamp. Essencial para resolver disputas de cobrança.

**🛡️ LGPD — Cuidados com Dados:**

- **Consentimento específico para cobrança recorrente (LGPD Art. 8, §4° — Granularidade):** O consentimento para cobrança recorrente deve ser **específico e separado** do consentimento geral de coleta de dados. No momento da assinatura, exibir checkbox dedicado: _"Autorizo a cobrança recorrente de R$ X,XX a cada Y dias no meu cartão/conta, até que eu cancele."_ com timestamp registrado.
- **Portabilidade dos dados de assinatura (LGPD Art. 18, V):** O titular deve poder exportar seus dados de assinatura (plano contratado, histórico de cobranças, datas) em formato estruturado (JSON/CSV) via a mesma interface de "Gerenciar meus dados" ou endpoint `/api/user/my-data`.

**🗄️ Normalização — Cuidados:**

- **`SubscriptionPlan` sem `deletedAt` (Soft Deletes):** Planos descontinuados devem ser mantidos para referência histórica pelas `CustomerSubscription` que já os usam. Adicionar `deletedAt?` e filtrar por `WHERE deletedAt IS NULL` na listagem de planos ativos.
- **`CustomerSubscription` sem `deletedAt` (Soft Deletes):** Contém dados financeiros e pessoais (referência a `userId`). Adicionar `deletedAt?` para o fluxo de anonimização LGPD e rastreabilidade de cancelamentos.

**✨ Boas Práticas:**

- **Feedback visual ao pausar/cancelar assinatura:** Ao clicar em "Pausar" ou "Cancelar", exibir atualização otimista do status (mudar badge de "Ativa" para "Pausada") + toast de confirmação. Se a Server Action falhar, reverter e mostrar erro.
- **Modal de confirmação de cancelamento:** Antes de cancelar definitivamente, exibir modal: _"Ao cancelar, você perderá acesso ao plano [Nome] e NÃO será cobrado novamente. Deseja continuar?"_ com botões "Manter assinatura" (primário) e "Cancelar assinatura" (secundário/destrutivo).

---

### TODO-APPSTORE-05 ⚫ Motor de Cupons Customizados (Marketing do Lojista)

**Descrição:** Permite que o lojista (Tenant) crie seus próprios cupons de desconto para os clientes finais da loja dele.

**Dependências:** TODO-MOD-04 (carrinho para aplicar cupom), TODO-MOD-05 (checkout para validar desconto server-side).

> ⚠️ **Não confundir:** `StoreCoupon` (definido aqui) são cupons do **lojista** para clientes finais. Já `DiscountCoupon` (definido no TODO-APPSTORE-01) são cupons da **plataforma** para venda de módulos.

- [ ] Modelagem: `StoreCoupon (id UUID PK, tenantId FK, code UNIQUE per tenant, discountType ENUM['PERCENT','FIXED'], discountValue INT, minOrderCents INT?, maxUses INT?, currentUses INT, validFrom DateTime, validUntil DateTime, isActive BOOLEAN, createdAt, updatedAt)`.
- [ ] CRUD no painel do Lojista para criação e gerenciamento de cupons (nome, valor, limite de uso, validade).
- [ ] Verificação do código no gateway do Carrinho antes de prosseguir ao Checkout.
- [ ] Validações server-side: cupom expirado, limite de uso atingido, valor mínimo do pedido não atingido, cupom pertence ao Tenant correto.

**⚠️ Riscos e Cuidados:**

- **Abuso de cupons (OWASP A04 - Insecure Design):** Limitar 1 cupom por pedido. Validação exclusivamente no server-side (nunca aplicar desconto apenas no frontend).
- **Enumeration attack (OWASP A01 - Broken Access Control):** Não retornar mensagens diferentes para "cupom inválido" vs "cupom expirado" na API pública. Mensagem genérica: "Cupom não encontrado ou indisponível".
- **Rate Limiting na Validação de Cupom (OWASP A04 - Insecure Design):** O endpoint público de validação de cupom deve ter rate limiting por IP (ex: 10 tentativas por minuto) para impedir ataques de força bruta que tentem adivinhar códigos válidos.

**🗄️ Normalização — Cuidados:**

- **`StoreCoupon` sem `deletedAt` (Soft Deletes):** Cupons vinculados a pedidos (`Order.couponId FK`) não podem ser excluídos fisicamente sem perder rastreabilidade. Adicionar `deletedAt?` e filtrar por `WHERE deletedAt IS NULL` na listagem de cupons ativos.
- **`StoreCoupon.currentUses` — 3FN (Campo cache):** O valor é derivável de `COUNT(orders WHERE couponId = X)`. Armazenar por performance, mas tratar como cache. Manter consistência via operação atômica `$transaction` ao vincular cupom ao pedido.

**✨ Boas Práticas:**

- **Preview do desconto no carrinho:** Ao aplicar um cupom válido, exibir imediatamente no subtotal do carrinho: preço original riscado + novo valor com desconto + badge _"Cupom [CÓDIGO] aplicado"_. O cálculo visual é client-side (informativo), mas o desconto real é recalculado server-side no checkout.
