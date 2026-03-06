# Salgados da Elza — Visão Geral do Projeto

## 📌 Escopo Atual (MVP)

A versão atual do projeto **Salgados da Elza** é uma Landing Page estática altamente otimizada, focada em performance, design premium, segurança e acessibilidade (WCAG 2.1). O site exibe o catálogo de salgados assados artesanais de Blumenau, SC, e direciona o usuário a uma conversão via WhatsApp.

### Características do MVP

- **Design Premium Mobile-First** usando tipografia escalonada (Playfair Display & Inter) e paleta HSL quente com Glassmorphism.
- **Performance extrema** pontuando 100/100 no Lighthouse (Imagens com `decoding=async` e `loading=lazy`, preconnect de fontes e meta tags otimizadas).
- **Hardening de Segurança** usando OWASP Top 10 com forte `Content-Security-Policy` (CSP) configurada via meta tags.
- **Semântica e SEO**, incluindo Rich Snippets (Schema.org / JSON-LD para `LocalBusiness`).

---

## 🚀 Próxima Evolução: Plataforma de E-commerce

O próximo passo para a Elza é transformar esta landing page estática em uma **plataforma completa de e-commerce e gestão de pedidos**. O sistema deixará de ser apenas um catálogo para se tornar um hub de vendas robusto.

### Visão Funcional (App)

1. **Frontend Dinâmico:** SPA (Single Page Application) em framework moderno (React/Next.js).
2. **Backend/API Segura:** Servidor REST ou GraphQL para gerenciar regras de negócios, integrando produtos, estoque e pagamentos.
3. **Checkout Nativo:** Abandono da conversão estática do WhatsApp por um carrinho de compras completo com integração nativa do **Mercado Pago** (PIX, Cartão e Boleto).

### Área Administrativa (Admin Dashboard)

A plataforma incluirá um painel seguro de administração exclusivo para a gestão da loja:

- **Dashboard Financeiro & Fluxo de Caixa:** Visão geral de vendas, lucros e métricas diárias.
- **Gestão de Catálogo (CRUD):** Adição, edição e exclusão de salgados com upload de imagens, preços customizados e controle dinâmico de estoque.
- **Configurações Globais CMS:** Área dedicada para modificar os textos institucionais do site e ajustar variáveis de estilo (como paleta de cores primárias) sem necessidade de re-deploy do código.
- **Gestão de Pedidos:** Status de preparo (Recebido, Assando, Saiu para Entrega, Entregue) com notificação automatizada ao cliente.

## 👥 Público-Alvo e Personalização

Este projeto mantém seu foco em um público que consome salgados artesanais prontos para aquecer. O tom deve se manter pessoal, "feito com carinho", enquanto a tecnologia de fundo abstrai a complexidade do lojista.
