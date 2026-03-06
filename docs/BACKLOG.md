# 🥟 Salgados da Elza — E-commerce Backlog

> **Objetivo:** Evoluir a landing page estática (MVP) em uma plataforma E-commerce funcional, com integrações de pagamento (Mercado Pago), carrinho dinâmico e um painel de administração completo (CMS, Controle de Estoque e Dashboard Financeiro).
>
> 🤖 **Nota para IA:** Leia as regras e diretrizes de desenvolvimento no arquivo `docs/AI_CONTEXT.md` antes de atuar.

---

## Fase 1: Fundação do Sistema Dinâmico (Backend & Frontend Framework)

### TODO-ECO-01 🔴 Setup do Repositório Frontend e Backend

**Descrição:** Migrar o HTML/CSS atual para um framework SPA (ex: Next.js) e criar a base do backend (ex: Node.js/NestJS ou servidor Serverless).

- [ ] Inicializar boilerplate web moderno (Next.js/React).
- [ ] Portar os componentes estáticos do MVP (Header, Cards, Footer) para componentes React.
- [ ] Inicializar estrutura de rotas da API/Backend.
- [ ] Configurar ORM (Prisma/TypeORM) e banco de dados relacional (PostgreSQL).

### TODO-ECO-02 🔴 Autenticação e Segurança

**Descrição:** Implementar sistema de login seguro para acessar a área de administração.

- [ ] Implementar fluxo JWT com Refresh Tokens.
- [ ] Proteger rotas da API de administração.
- [ ] Configurar hashing seguro de senhas (Argon2/Bcrypt) e proteções de força bruta.

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

## Fase 4: Experiência do Usuário (Cliente)

### TODO-ECO-06 🟢 Sistema de Carrinho de Compras

**Descrição:** Capacidade do cliente visualizar e agrupar diferentes salgados na sua sessão.

- [ ] Implementar state management local do carrinho.
- [ ] Sidebar animada exibindo itens do carrinho, quantidades e sub-total.
- [ ] Persistência de carrinho na sessão do usuário ou Storage.

---

## Fase 5: Checkout e Integração Financeira

### TODO-ECO-07 🔴 Integração Mercado Pago

**Descrição:** Integração pesada para receber pagamentos via PIX e Cartões nativamente, sem sair do site.

- [ ] Gerar Access Token e registrar Webhooks da API do Mercado Pago.
- [ ] Fluxo backend de geração de PIX copia-e-cola / QR Code transparente.
- [ ] Fluxo frontend do Checkout Transparente (Cartões de Crédito).
- [ ] Listener no webhooks do MP para atualizar o status do pedido `(Pending -> Paid)`.

### TODO-ECO-08 🟡 Fluxo de Notificações

**Descrição:** Alertar o cliente e a dona Elza quando vendas são concluídas.

- [ ] Envio automático de E-mail ou WhatsApp transacional.
- [ ] Tela visualística de acompanhamento de pedido ("Seu pedido está no forno").

---

## Fase 6: Analytics Empresarial (Admin)

### TODO-ECO-09 🟢 Dashboard de Vendas e Fluxo de Caixa

**Descrição:** Gráficos e tabelas na área de administração para resumir a saúde financeira.

- [ ] Cards de métricas diárias, semanais e mensais (Receita Bruta x Ticket Médio).
- [ ] Tabela cronológica dos pedidos detalhados.
- [ ] Integração de gráficos estatísticos do fluxo de vendas (ex: Recharts).
