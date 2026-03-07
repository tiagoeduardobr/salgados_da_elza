# 🥟 Salgados da Elza — E-commerce Backlog

> **Objetivo:** Evoluir a landing page estática (MVP) em uma plataforma E-commerce funcional, com integrações de pagamento (Mercado Pago), carrinho dinâmico e um painel de administração completo (CMS, Controle de Estoque e Dashboard Financeiro).
>
> 🤖 **Nota para IA:** Leia as regras e diretrizes de desenvolvimento no arquivo `docs/AI_CONTEXT.md` antes de atuar.

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

## Fase 2: Gestão de Catálogo (Admin CMS)

### TODO-ECO-03 🟡 CRUD de Produtos

**Descrição:** Interface administrativa para que a Elza gerencie o catálogo de salgados.

- [ ] Modelagem do banco de dados para `Products` e `Categories`.
- [ ] API endpoints para Criar, Ler, Atualizar e Deletar produtos.
- [ ] Interface visual do Admin para listar produtos com filtros/paginação.
- [ ] Formulário integrado de edição avançada (com upload em bucket S3/Cloudinary).

### TODO-ECO-04 🟡 Controle de Estoque

**Descrição:** Rastreamento dinâmico do número de salgados disponíveis.

- [ ] Adicionar entidade de estoque aos salgados com status (Ativo/Esgotado).
- [ ] Regras de decréscimo automático mediante reserva em carrinho ou confirmação de compra.
- [ ] Alertas visuais de "Estoque Baixo" no dashboard.

---

## Fase 3: Personalização e CMS Global (Admin)

### TODO-ECO-05 🟡 Configurações e White-label Customization

**Descrição:** Área do admin para alterar aspectos visuais e de texto do frontend, evitando deploy a cada mudança.

- [ ] Painel para alterar textos dinâmicos (Frase de Introdução, Termos, Horários).
- [ ] Seção para customizar variáveis globais (Cor Primária, Cor de Destaque).
- [ ] Salvar essas preferências de forma global no banco de dados e aplicar no SSR do frontend.

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
