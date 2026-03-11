# 🥟 Salgados da Elza — E-commerce Backlog

> **Objetivo:** Evoluir a landing page estática (MVP) em uma plataforma E-commerce funcional, com integrações de pagamento (Mercado Pago), carrinho dinâmico e um painel de administração completo (CMS, Controle de Estoque e Dashboard Financeiro).
>
> 🤖 **Nota para IA (STATUS)**: Este E-commerce ainda está estritamente em **fase de planejamento**. NÃO sugira nem inicie a implementação de nenhum dos TODOs abaixo até que o usuário solicite explicitamente.
>
> 🤖 **Nota para IA:** Leia as regras e diretrizes de desenvolvimento no arquivo `AGENTS.md` antes de atuar.

---

## Fase 1: Fundação do Sistema Dinâmico (Arquitetura White-label)

### TODO-ECO-01 🔴 Setup do Repositório Frontend e Backend (Zero Downtime)

**Descrição:** Configurar a base do monorepo Next.js de forma isolada, garantindo que a landing page estática (produção atual) permaneça inalterada até que a nova plataforma esteja validada.

- [ ] Criar branch paralela (`feat/ecommerce-v1`) a partir da main.
- [ ] Limpar arquivos legados (HTML/CSS) NA NOVA BRANCH e inicializar boilerplate web moderno (Next.js App Router).
- [ ] Portar os componentes estáticos do MVP (Header, Cards, Footer) para componentes React.
- [ ] Inicializar estrutura de rotas da API/Backend no Next.js (API Routes/Server Actions).
- [ ] Configurar conexão com o Supabase (Database e Auth).
- [ ] Configurar Prisma ORM para gerenciar as "migrations" (esquema do banco).
- [ ] Criar `.env.example` documentado para facilitar a clonagem da plataforma para novos clientes.

### TODO-ECO-02 🔴 Autenticação, Segurança e Theming Global

**Descrição:** Implementar sistema de segurança do Admin e a infraestrutura que permitirá a troca de cores/estilos dinamicamente sem alterar código (conceito de White-label).

- [ ] Implementar fluxo de Login nativo via Supabase Auth.
- [ ] Proteger rotas da API e da pasta (app/admin) usando Middleware do Next.js.
- [ ] Inicializar a base do Design System no `globals.css` usando Variáveis CSS (Tokens).
- [ ] Criar Provider (Contexto React) para ingestão do tema no frontend (preparando terreno para o futuro TODO-ECO-05).

---

## Fase 2: Gestão de Catálogo (Admin CMS Avançado)

### TODO-ECO-03 🟡 CRUD de Produtos (Gestão de Catálogo)

**Descrição:** Interface administrativa intuitiva para que a dona da loja gerencie o catálogo de produtos e variações de forma independente.

- [ ] Modelagem do banco de dados (Prisma): Tabelas `Products`, `Categories` e `ProductTags` ("Mais Vendido", "Novidade").
- [ ] API Endpoints seguros (`/api/admin/products`) para Criar, Ler, Atualizar e Deletar produtos via Server Actions.
- [ ] Formulário Criativo:
  - Campos descritivos com suporte a Markdown/Rich Text básico.
  - Upload Dinâmico de Imagens: Integração com o Storage do Supabase (com crop em tempo real antes do upload e geração de WebP na nuvem).
- [ ] Listagem Administrativa (Table Flow): Tabela com Filtros combinados (Categoria + Status), Ordenação e Paginação Server-side (para lidar com catálogos grandes no futuro).

### TODO-ECO-04 🟡 Controle de Estoque Inteligente

**Descrição:** Rastreamento dinâmico que previne vendas furadas e facilita o balanço diário.

- [ ] Adicionar entidade relacional de estoque ou campo `stockCount` à tabela de Produtos.
- [ ] Lógica de Prevenção de Concorrência: Redução temporária do estoque ("em reserva") no momento em que um pedido entra em "Processando Pagamento" (lock de 15 minutos).
- [ ] Alertas Coloridos no Admin Panel: Produtos próximos a acabar ficam com tag `Warning` (Laranja) e os esgotados com tag `Danger` (Vermelho).

---

## Fase 3: Personalização e CMS Global (White-label Engine)

### TODO-ECO-05 🟡 Configurações e Customização (Storefront Settings)

**Descrição:** Área do admin para alterar aspectos visuais e de texto do frontend de forma autônoma, sem necessidade de tocar no código ou fazer novo deploy.

- [ ] Modelagem (Prisma): Tabela única (Singleton) `StoreSettings` para armazenar as preferências dinâmicas da loja.
- [ ] Módulo Visual de Theming (Admin):
  - Color Picker nativo para a dona escolher a **Cor Primária** (Ex: O laranja característico da Elza, ou Azul caso o clone seja para outro cliente).
  - Opção de troca de Tipografia Global selecionando de uma lista de Google Fonts pré-carregadas.
- [ ] Módulo de Textos Institucionais: Inputs para alterar a "Frase Hero" principal, as "Regras de Entrega" e a "Mensagem do WhatsApp" do rodapé.
- [ ] Ingestão de Contexto: O frontend Next.js fará o fetching (com caching agressivo para performance) destas configurações e injetará no `ThemeProvider` (conforme criado no TODO-ECO-02).

---

## Fase 4: Experiência do Usuário e Carrinho (Frontend)

### TODO-ECO-06 🟢 Sistema de Carrinho Avançado e UX (Zustand/Context)

**Descrição:** Implementação de um carrinho super fluido, sem recarregamento da página (SPA), mantendo o usuário engajado.

- [ ] Implementar state management contínuo do carrinho (ex: Zustand ou Redux Toolkit) para atualizações instantâneas.
- [ ] Criar Sidebar Animada (Drawer) para o Carrinho mostrando: Subtotal dinâmico, Input de Quantidade (com botões + / - funcionais) e botão de remoção rápida.
- [ ] Persistência segura na camada Cliente (`localStorage`) sincronizada via Zustand para não perder itens ao fechar a aba.
- [ ] UX/UI Boost: Animações de microinteração ao adicionar itens (ex: feedback visual no botão, ícone do carrinho balançando) usando Framer Motion ou animações CSS nativas.
- [ ] Lógica de Validação: Prevenir fechamento de pedido com carrinho vazio, ou itens esgotados (verificando estoque dinamicamente no clique do "Ir para o Pagamento").

---

## Fase 5: Checkout e Integração Financeira (Mercado Pago)

### TODO-ECO-07 🔴 Checkout Transparente via Cartão de Crédito e PIX

**Descrição:** Um processo de finalização de compra sem redirecionamento externo (White-label), aumentando a taxa de conversão.

- [ ] Tela de Checkout em Etapas (Stepper): 1. Identificação -> 2. Endereço -> 3. Pagamento.
- [ ] Integração do SDK Frontend do Mercado Pago (`@mercadopago/sdk-react`) para captura segura dos dados de cartão (Tokenization), garantindo que os dados não passem em claro pelo nosso backend.
- [ ] Fluxo Backend PIX: Chamada à API MP para gerar Copia e Cola instantâneo e QR Code base64, exibindo no Front com contagem regressiva de validade (ex: 30 minutos).
- [ ] Salvar a "Transaction" no nosso banco de dados (Prisma) atrelada ao "User" e ao respectivo "Order", guardando o `payment_id` externo.

### TODO-ECO-08 🟡 Webhooks e Notificações (Orquestração de Pedidos)

**Descrição:** Sistema reativo que escuta as atualizações de pagamento para dar andamento automatizado ao pedido.

- [ ] Criar endpoint `api/webhooks/mercadopago` assinado com HMAC (verificação de integridade).
- [ ] Listener no Webhook: Se retorno for "Aprovado", atualizar tabela `Orders` para "PAGO_RECEBIDO" e disparar evento de decréscimo de Estoque real.
- [ ] Integração com AWS SES (ou Resend) para envio de E-mail Transacional formatado em HTML: "Seu Pedido #XXXX foi confirmado!".
- [ ] (Opcional Futuro) Integração via API de WhatsApp (Evolution API / Baileys) para a dona Elza receber msg: "Novo pedido Pago!".

---

## Fase 6: Analytics e Dashboard Administrativo

### TODO-ECO-09 🟢 Dashboard Gerencial (Painel do Administrador)

**Descrição:** Uma sala de controle rica em dados para o gestor ter controle total do fluxo do negócio, usando bibliotecas de gráficos (Ex: Recharts ou Chart.js).

- [ ] Layout do Admin Dashboard com Sidebar Lateral (Navegação: Visão Geral, Pedidos, Catálogo, Configurações).
- [ ] **Visão Geral (Cards de KPI):**
  - Faturamento Diário / Mensal (Calculado on the fly pelo Banco).
  - Ticket Médio por Venda.
  - Produtos mais vendidos (Ranking Top 5).
- [ ] **Fluxo de Caixa Visual (Gráficos):** Gráfico de linha mostrando a evolução de vendas (`Receita` x `Dias da Semana`).
- [ ] **Gestor de Pedidos em Tempo Real:** Tabela dinâmica estilo Kanban para o Status de Preparo: `[Recebido] -> [Em Preparo] -> [Saiu para Entrega] -> [Entregue]`.
- [ ] Backend Server-Actions (Next.js) para mover os pedidos entre essas colunas, atualizando a "Timeline" de rastreio que o cliente final poderá ver via link.
