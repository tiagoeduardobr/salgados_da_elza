# Salgados da Elza — Visão Geral do Projeto

## 📌 Escopo Atual (MVP)

A versão atual do projeto **Salgados da Elza** é uma Landing Page estática altamente otimizada, focada em performance, design premium, segurança e acessibilidade (WCAG 2.1). O site exibe o catálogo de salgados assados artesanais de Blumenau, SC, e direciona o usuário a uma conversão via WhatsApp oferecendo pagamento instantâneo via Pix QR Code.

### Características do MVP

- **Design Premium Mobile-First** usando tipografia escalonada (Playfair Display & Inter) e paleta HSL quente com Glassmorphism.
- **Performance extrema** pontuando 100/100 no Lighthouse (Imagens com `decoding=async` e `loading=lazy`, preconnect de fontes e meta tags otimizadas).
- **Hardening de Segurança** usando OWASP Top 10 com forte `Content-Security-Policy` (CSP) configurada via meta tags.
- **Semântica e SEO**, incluindo Rich Snippets (Schema.org / JSON-LD para `LocalBusiness`).
- **Integração de Pagamento CTA**, dispondo uma área de Pix copia-e-cola rica em UI e interatividade JavaScript sem sair do MVP.

---

## 🚀 Próxima Evolução: Fase 2 (E-commerce Leve)

O próximo passo é transformar a landing page em um catálogo dinâmico com **Carrinho de Compras** no front-end, mantendo a finalização de checkout através do WhatsApp. Além disso, entregaremos ferramentas para conferir autonomia na gestão da loja pela Dona Elza sem custos altos em infraestrutura, utilizando **Firebase**.

### O que vem na Fase 2

1. **Catálogo Dinâmico e Carrinho:** Frontend renderizando itens dinamicamente do Firebase, com seleção e cálculos de quantidade no client-side (Local Storage).
2. **Backend Serverless (Firebase):** Configuração de banco de dados NoSQL e bucket de imagens hospedando todo o catálogo, substituindo as tags HTML hardcoded.
3. **Painel Administrativo Restrito:** Setup simples de autenticação (Firebase Auth) e CRUD completo de gestão de estoque e horário de abertura.

---

## 🔮 Visão de Futuro: Plataforma E-commerce SaaS

Após a implementação da Fase 2, uma visão de longo prazo prevê a adoção de um **E-commerce SaaS Multi-tenant completo** com:

- Frontend Dinâmico nativo em React/Next.js (Servidor App Router).
- Backend relacional Prisma ORM + PostgreSQL.
- Checkout Nativo (Pagamentos instantâneos com Mercado Pago PIX, sem contato via WhatsApp).
- Áreas Administrativas avançadas (Dashboard Financeiro).

## 👥 Público-Alvo e Personalização

Este projeto mantém seu foco em um público que consome salgados artesanais prontos para aquecer. O tom deve se manter pessoal, "feito com carinho", enquanto a tecnologia de fundo abstrai a complexidade do lojista.
