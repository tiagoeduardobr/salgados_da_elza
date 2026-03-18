<!-- ======================================================================
     🤖 CONTEXTO PARA IA — Instruções para assistentes em novos chats
     ====================================================================== -->

# 🤖 Contexto para Inteligência Artificial (Salgados da Elza)

Este arquivo contém as diretrizes que **todas as IAs** devem seguir ao contribuir ou dar manutenção neste repositório.

## 📌 PERFIL DO USUÁRIO E DIDÁTICA

- O usuário principal está aprendendo programação; logo, este projeto tem um teor acadêmico aliado ao uso pessoal real.
- **Sempre explique O PORQUÊ** de cada decisão técnica e implementação.
- Adicione **comentários didáticos e detalhados** no código para facilitar o aprendizado (explique o que faz, por que faz, e como funciona).

## 📌 CONVENÇÕES DE IDIOMA

- **Documentação e planejamento estrutural:** pt-BR (Português do Brasil).
- **Código-fonte:** Nomes de variáveis, funções, classes CSS e termos técnicos abstratos **devem ser em inglês**.
- **Comentários no código:** pt-BR (para manter o foco no aspecto didático).

## 📌 DIRETRIZES DE DESENVOLVIMENTO

- **Segurança:** O projeto segue e respeita rigorosamente o **OWASP Top 10** e boas práticas de segurança web. Nomes de usuário não devem trafegar em claro, proteções de força bruta, CSRF e CSP fortes devem ser mantidas.
- **Qualidade de Código:** Entregar código profissional, limpo, modular, bem estruturado e altamente testável.
- **Acessibilidade e SEO:** Priorize acessibilidade realística baseada nas normas WCAG 2.1 (A e AA no mínimo) e técnicas modernas de Technical SEO (Schema.org / Server-side rendering amigável).
- **Manipulação de Arquivos (Uso da IA):** SEMPRE modifique ou crie arquivos e textos utilizando suas ferramentas nativas adequadas (tools de I/O de código). JAMAIS utilize comandos bash/terminal (como `echo`, `cat` ou manipulação de strings via shell) para editar, apagar, injetar ou criar conteúdo em arquivos do repositório.
- **Justificativas Técnicas:** Toda alteração de código ou setup de arquitetura deve ser embasada e previamente decidida/acordada.

## 📌 REGRAS DE VERSIONAMENTO (GIT)

- Usar formato de commits semânticos (**Conventional Commits**), SEMPRE redigidos em INGLÊS.
- **NUNCA empilhar comandos git** (execute um comando por vez para prevenir erros cegos).
- **Branches de Feature/Fix:**
  - Criar uma branch separada para CADA tarefa/TODO (ex: `feat/TODO-ECO-01`).
  - O branch cut deve ser feito no exato início da tarefa.
  - Faça o commit, merge para a `main`, push e então delete a branch (local e remotamente) imediatamente no **final do TODO**.
- **Formato de Commit:** `<tipo>(<escopo>): <descrição>`
  - Tipos válidos: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `chore`.

## 📌 REGRAS DE DOCUMENTAÇÃO (MARKDOWN)

- **Tabelas:** SEMPRE usar espaços de respiro ao redor dos pipes e dos marcadores de alinhamento (`| :--- |`). Não use colados (`|:---|`).
- **Blocos de código:** SEMPRE especifique a linguagem (`text`, `javascript`, `typescript`, `css`, `bash`, etc).
- **Legibilidade:** Manter obrigatoriamente uma linha em branco (blank line) antes e depois de listagens, *headings* (h1, h2, h3) e file blocks. (Evita MD032).
- **Listas e Sublistas:** SEMPRE insira uma linha em branco (blank line) ao redor de listas e aninhamentos (nested lists) para evitar erros de linting MD032.
- **Ênfase (Itálico):** SEMPRE use um único asterisco para itálico (`*texto*`). JAMAIS use underscore (`_texto_`), para evitar o erro MD049.
- **Revisão Ortográfica:** Cuidado com typos e erros de grafia ao gerar o documento (ex: raízes, schemas, usuário). Preste atenção na gramática e não crie jargões quebrados.

---

> **Atenção IA:** Ao abrir um chat, se solicitado para atuar no projeto, consuma as regras deste arquivo e as trate como System Prompts complementares da mais alta prioridade para o escopo desta codebase.
