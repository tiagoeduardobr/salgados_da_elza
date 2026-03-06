<!-- ======================================================================
     🤖 CONTEXTO PARA IA — Instruções para assistentes em novos chats
     ======================================================================

     📌 PERFIL DO USUÁRIO
     - O usuário está aprendendo programação.
     - Este projeto tem uso pessoal E teor acadêmico.
     - SEMPRE explique O PORQUÊ de cada implementação e decisão técnica.
     - Adicione comentários DIDÁTICOS e detalhados no código para facilitar
       o aprendizado (o que faz, por que faz, como funciona).

     📌 CONVENÇÕES DE IDIOMA
     - Documentação e planejamento: pt-BR
     - Código-fonte, nomes de variáveis, classes CSS e termos técnicos: inglês
     - Comentários no código: pt-BR (para fins didáticos)

     📌 DIRETRIZES DE DESENVOLVIMENTO
     - Seguir OWASP Top 10 e boas práticas de segurança.
     - Código profissional, limpo e bem estruturado.
     - Priorizar acessibilidade (WCAG 2.1) e SEO.
     - Cada mudança deve ser justificada e explicada.

     📌 REGRAS DE VERSIONAMENTO (GIT)
     - Commits semânticos (Conventional Commits) SEMPRE em inglês.
     - NUNCA empilhar comandos git (um comando por vez).
     - Criar uma branch separada para CADA TODO (ex: feat/TODO-S-01).
     - Criar a branch no INÍCIO do TODO.
     - Fazer merge na main e push no FINAL do TODO.
     - Deletar a branch local e remota após o merge.
     - Formato: <tipo>(<escopo>): <descrição>
       Tipos: feat, fix, docs, style, refactor, perf, chore

     📌 REGRAS DE DOCUMENTAÇÃO MARKDOWN
     - Tabelas: SEMPRE usar espaços ao redor dos pipes e alinhadores.
       Correto:   | Header | Header |
                  | :--- | :--- |
       Incorreto: |:---|:---|
     - Blocos de código: SEMPRE especificar a linguagem (text, html, css, etc).
     - Manter uma linha em branco antes e depois de headings, listas e blocos.

     ====================================================================== -->

# 🥟 Salgados da Elza — Backlog de Profissionalização

> **Objetivo:** Elevar o projeto de landing page estática a nível profissional, aplicando OWASP Top 10, acessibilidade WCAG 2.1, SEO avançado, performance e design premium.
>
> **Convenção de idioma:** Documentação em pt-BR · Código e termos técnicos em inglês

## 🤖 Contexto do Projeto (para referência de IA)

| Diretriz          | Descrição                                                                  |
| :---------------- | :------------------------------------------------------------------------- |
| **Perfil**        | Usuário em aprendizado de programação — projeto pessoal com teor acadêmico |
| **Explicações**   | Sempre explicar **o porquê** de cada implementação e decisão técnica       |
| **Comentários**   | Código deve conter comentários **didáticos e detalhados** em pt-BR         |
| **Idioma docs**   | Documentação, planejamento e comentários no código em **pt-BR**            |
| **Idioma código** | Código-fonte, variáveis, classes CSS e termos técnicos em **inglês**       |
| **Segurança**     | Seguir **OWASP Top 10** e boas práticas de segurança web                   |
| **Qualidade**     | Código profissional, limpo, bem estruturado e justificado                  |
| **Commits**       | Semânticos (Conventional Commits), **sempre em inglês**                    |
| **Branches**      | Uma branch por TODO — criar no início, merge + push + cleanup no final     |
| **Git**           | **Nunca empilhar** comandos git (um por vez)                               |
| **Markdown**      | Tabelas com espaços nos pipes, blocos de código com linguagem especificada |

---

## 🔀 Regras de Versionamento (Git)

### Conventional Commits (sempre em inglês)

| Tipo       | Uso                                      |
| :--------- | :--------------------------------------- |
| `feat`     | Nova funcionalidade                      |
| `fix`      | Correção de bug                          |
| `docs`     | Alteração em documentação                |
| `style`    | Formatação, sem mudança de lógica        |
| `refactor` | Refatoração sem mudança de comportamento |
| `perf`     | Melhoria de performance                  |
| `chore`    | Tarefas de manutenção, build, configs    |

**Formato:** `<tipo>(<escopo>): <descrição>`
**Exemplo:** `feat(structure): reorganize project directory layout`

### Workflow por TODO

```text
1. git checkout main
2. git pull origin main
3. git checkout -b feat/TODO-XX-NN
4. ... (implementar o TODO)
5. git add <arquivos>
6. git commit -m "tipo(escopo): descrição"
7. git checkout main
8. git merge feat/TODO-XX-NN
9. git push origin main
10. git branch -d feat/TODO-XX-NN
11. Marcar o TODO como concluído no BACKLOG.md (ver regra abaixo)
```

> ⚠️ **NUNCA empilhar comandos git** — executar um por vez, aguardar conclusão.

### Marcação de TODO concluído

Ao finalizar um TODO, **antes de iniciar o próximo**, marcar no BACKLOG.md:

1. Trocar todos os `- [ ]` dos critérios de aceitação por `- [x]`
2. Adicionar uma linha de conclusão logo após o título do TODO:

```markdown
> ✅ **Concluído em:** AAAA-MM-DD às HH:MM (fuso local)
```

**Exemplo:**

```markdown
### TODO-S-01 🟡 Criar estrutura de diretórios profissional

> ✅ **Concluído em:** 2026-03-03 às 21:42 (UTC-3)
```

---

## 📋 Legenda

|   Símbolo   | Significado                 |
| :---------: | :-------------------------- |
|     🔴      | Prioridade **Crítica**      |
|     🟡      | Prioridade **Alta**         |
|     🟢      | Prioridade **Média**        |
|     🔵      | Prioridade **Baixa**        |
| `TODO-X-##` | Identificador único do item |

---

## Fase 1 — Reestruturação do Projeto

> Organizar a base de código para manutenibilidade e escalabilidade.

### TODO-S-01 🟡 Criar estrutura de diretórios profissional

> ✅ **Concluído em:** 2026-03-03 às 21:42 (UTC-3)

**Descrição:** Reorganizar arquivos do projeto em uma estrutura limpa e escalável.

**Estrutura alvo:**

```text
salgados_da_elza/
├── assets/
│   └── images/           # Imagens dos produtos
├── docs/
│   └── BACKLOG.md        # Este arquivo
├── styles/
│   └── main.css          # Stylesheet principal
├── index.html            # Página principal
├── robots.txt            # Diretivas para crawlers
├── sitemap.xml           # Mapa do site
├── manifest.json         # Web App manifest
└── README.md
```

**Critérios de aceitação:**

- [x] Diretórios `assets/images/` e `styles/` criados
- [x] Imagens `.jpeg` movidas da raiz para `assets/images/`
- [x] Nomes de arquivos de imagem normalizados (sem espaços, lowercase)

---

### TODO-S-02 🟡 Extrair CSS inline para arquivo externo

> ✅ **Concluído em:** 2026-03-03 às 22:08 (UTC-3)

**Descrição:** Separar todo o CSS do bloco `<style>` em `index.html` para `styles/main.css`.

**Critérios de aceitação:**

- [x] Arquivo `styles/main.css` criado com todo o CSS extraído
- [x] Bloco `<style>` removido do `index.html`
- [x] `<link rel="stylesheet" href="styles/main.css">` adicionado ao `<head>`
- [x] CSS organizado em seções com comentários: Reset, Layout, Components, Responsive

---

## Fase 2 — Segurança (OWASP Top 10)

> Aplicar hardening de segurança relevante para sites estáticos.

### TODO-SEC-01 🔴 Implementar Content Security Policy (CSP)

> ✅ **Concluído em:** 2026-03-03 às 22:17 (UTC-3)

**Descrição:** Adicionar CSP via `<meta>` tag para mitigar XSS e data injection (OWASP A03 — Injection).

**Critérios de aceitação:**

- [x] Meta tag CSP adicionada ao `<head>` com diretivas `default-src`, `style-src`, `img-src`, `font-src`
- [x] Apenas origens confiáveis permitidas (self, Google Fonts, WhatsApp API)
- [x] Nenhum `unsafe-inline` desnecessário (exceto estilos necessários)

---

### TODO-SEC-02 🔴 Adicionar security headers via meta tags

> ✅ **Concluído em:** 2026-03-03 às 22:19 (UTC-3)

**Descrição:** Configurar headers de segurança para defesa em profundidade (OWASP A05 — Security Misconfiguration).

**Critérios de aceitação:**

- [x] `X-Content-Type-Options: nosniff` configurado
- [x] `Referrer-Policy: strict-origin-when-cross-origin` configurado
- [x] `Permissions-Policy` configurado (restringir camera, microphone, geolocation)

---

### TODO-SEC-03 🔴 Eliminar dependências externas não confiáveis

> ✅ **Concluído em:** 2026-03-03 às 22:22 (UTC-3)

**Descrição:** Substituir URLs S3 externas por imagens locais (OWASP A08 — Software and Data Integrity Failures).

**Critérios de aceitação:**

- [x] Todas as 4 URLs `agi-prod-file-upload-public-main-use1.s3.amazonaws.com` substituídas por caminhos locais
- [x] Imagens servidas exclusivamente do repositório local
- [x] Nenhuma referência a domínios S3 remanescente no código

---

### TODO-SEC-04 🟡 Sanitizar links externos

> ✅ **Concluído em:** 2026-03-03 às 22:22 (UTC-3)

**Descrição:** Garantir que todos os links para domínios externos usem atributos de segurança.

**Critérios de aceitação:**

- [x] Todos os `<a>` com `target="_blank"` possuem `rel="noopener noreferrer"`
- [x] Links WhatsApp validados e seguros

---

## Fase 3 — Acessibilidade (WCAG 2.1) & SEO

> Tornar o site acessível e otimizado para mecanismos de busca.

### TODO-A11Y-01 🟡 Implementar HTML semântico

> ✅ **Concluído em:** 2026-03-03 às 22:42 (UTC-3)

**Descrição:** Substituir `<div>` genéricos por elementos semânticos HTML5.

**Critérios de aceitação:**

- [x] `<main>` envolvendo conteúdo principal
- [x] `<section>` para cada grupo de conteúdo com `aria-label`
- [x] `<article>` para cada card de produto
- [x] `<header>` e `<footer>` mantidos (já existem)
- [x] Hierarquia de headings correta: único `<h1>`, `<h2>` por seção, `<h3>` por produto

---

### TODO-A11Y-02 🟡 Melhorar atributos de acessibilidade

> ✅ **Concluído em:** 2026-03-03 às 22:42 (UTC-3)

**Descrição:** Adicionar atributos ARIA e melhorar textos alternativos.

**Critérios de aceitação:**

- [x] Atributos `alt` descritivos em todas as imagens (ex: "Salgado Pizza Gourmet assado dourado")
- [x] `aria-label` nos links de navegação e CTA
- [x] `role="img"` no SVG do ícone WhatsApp com `aria-hidden="true"`
- [x] Foco visível mantido em elementos interativos

---

### TODO-SEO-01 🟡 Adicionar meta tags avançadas

> ✅ **Concluído em:** 2026-03-03 às 22:47 (UTC-3)

**Descrição:** Implementar Open Graph, Twitter Cards e meta description.

**Critérios de aceitação:**

- [x] `<meta name="description">` com descrição otimizada
- [x] Tags Open Graph: `og:title`, `og:description`, `og:image`, `og:url`, `og:type`
- [x] Tags Twitter: `twitter:card`, `twitter:title`, `twitter:description`
- [x] `<link rel="canonical">` adicionado

---

### TODO-SEO-02 🟢 Adicionar dados estruturados Schema.org

> ✅ **Concluído em:** 2026-03-03 às 22:52 (UTC-3)

**Descrição:** Implementar JSON-LD com schemas `LocalBusiness` e `Menu`.

**Critérios de aceitação:**

- [x] Script JSON-LD `LocalBusiness` com nome, endereço, telefone, URL
- [x] Script JSON-LD `Menu` com itens e preços do cardápio
- [x] JSON validado no [Rich Results Test](https://search.google.com/test/rich-results)

---

### TODO-SEO-03 🟢 Criar robots.txt e sitemap.xml

> ✅ **Concluído em:** 2026-03-03 às 22:53 (UTC-3)

**Descrição:** Adicionar arquivos de diretivas para crawlers e mapa do site.

**Critérios de aceitação:**

- [x] `robots.txt` com `Allow: /` e referência ao sitemap
- [x] `sitemap.xml` com URL principal e data de última modificação

---

## Fase 4 — Performance & PWA

> Otimizar carregamento e experiência mobile.

### TODO-PERF-01 🟡 Otimizar carregamento de imagens

> ✅ **Concluído em:** 2026-03-05 às 21:50 (UTC-3)

**Descrição:** Implementar lazy loading e dimensionamento adequado.

**Critérios de aceitação:**

- [x] `loading="lazy"` em todas as imagens (exceto above-the-fold)
- [x] `width` e `height` explícitos para evitar CLS (Cumulative Layout Shift)
- [x] Atributo `decoding="async"` adicionado

---

### TODO-PERF-02 🟢 Criar Web App manifest

> ✅ **Concluído em:** 2026-03-05 às 22:04 (UTC-3)

**Descrição:** Adicionar `manifest.json` para experiência PWA-like.

**Critérios de aceitação:**

- [x] `manifest.json` com `name`, `short_name`, `theme_color`, `background_color`, `display`
- [x] `<link rel="manifest">` adicionado ao `<head>`
- [x] `<meta name="theme-color">` configurado

---

### TODO-PERF-03 🟢 Otimizar carregamento de fontes

**Descrição:** Implementar preconnect e font-display para Google Fonts.

**Critérios de aceitação:**

- [ ] `<link rel="preconnect">` para `fonts.googleapis.com` e `fonts.gstatic.com`
- [ ] `font-display: swap` aplicado para evitar FOIT (Flash of Invisible Text)

---

## Fase 5 — Design Premium

> Elevar o visual a padrão profissional com design moderno.

### TODO-UI-01 🟡 Implementar tipografia premium

**Descrição:** Substituir fontes genéricas por Google Fonts curadas.

**Critérios de aceitação:**

- [ ] **Playfair Display** para headings (elegância, serifa)
- [ ] **Inter** para body text (legibilidade, sans-serif moderna)
- [ ] Escala tipográfica harmoniosa (modular scale)
- [ ] Font fallbacks adequados definidos

---

### TODO-UI-02 🟡 Refinar paleta de cores e visual

**Descrição:** Criar uma paleta mais sofisticada e aplicar tratamento visual premium.

**Critérios de aceitação:**

- [ ] Paleta refinada com tons quentes e acolhedores usando HSL
- [ ] Gradientes suaves aplicados em header e CTA
- [ ] Sombras em camadas (layered box-shadows) para profundidade
- [ ] Glassmorphism sutil nos cards de produto

---

### TODO-UI-03 🟢 Adicionar animações e micro-interações

**Descrição:** Implementar animações CSS puras para uma experiência dinâmica e envolvente.

**Critérios de aceitação:**

- [ ] Animações `fade-in` / `slide-up` nos cards (via `@keyframes` + `animation`)
- [ ] Hover effects nos cards de produto (scale, shadow elevation)
- [ ] Pulse animation no botão WhatsApp
- [ ] Transições suaves em todos os elementos interativos
- [ ] `prefers-reduced-motion` respeitado para acessibilidade

---

### TODO-UI-04 🟢 Melhorar responsividade mobile-first

**Descrição:** Refatorar CSS para abordagem mobile-first com breakpoints otimizados.

**Critérios de aceitação:**

- [ ] Base CSS para mobile (< 768px)
- [ ] Breakpoint tablet (768px–1024px)
- [ ] Breakpoint desktop (> 1024px)
- [ ] Cards empilhados no mobile, lado-a-lado no desktop
- [ ] Touch targets mínimo 44×44px

---

## Resumo de Prioridades

| Prioridade | Itens                                                                                                            | Fase                           |
| :--------: | :--------------------------------------------------------------------------------------------------------------- | :----------------------------- |
| 🔴 Crítica | TODO-SEC-01, TODO-SEC-02, TODO-SEC-03                                                                            | Segurança                      |
|  🟡 Alta   | TODO-S-01, TODO-S-02, TODO-SEC-04, TODO-A11Y-01, TODO-A11Y-02, TODO-SEO-01, TODO-PERF-01, TODO-UI-01, TODO-UI-02 | Estrutura, A11Y, SEO, Perf, UI |
|  🟢 Média  | TODO-SEO-02, TODO-SEO-03, TODO-PERF-02, TODO-PERF-03, TODO-UI-03, TODO-UI-04                                     | SEO, Perf, UI                  |

---

## Plano de Verificação

### Testes no Browser

- Abrir `index.html` no browser e validar renderização desktop + mobile
- Verificar carregamento de imagens locais (nenhum request externo S3)
- Confirmar CSP e headers de segurança via DevTools

### Validação Externa

- Validar HTML no [W3C Validator](https://validator.w3.org/)
- Testar Schema.org no [Rich Results Test](https://search.google.com/test/rich-results)
- Verificar Lighthouse scores (Performance ≥ 90, SEO ≥ 90, Accessibility ≥ 90)
