---
description: Fluxo padrão para executar um TODO do Backlog, alinhado ao AGENTS.md
---

# Workflow: Execução de TODO

Este workflow define o passo a passo obrigatório para executar qualquer TODO do `docs/BACKLOG.md`, respeitando rigorosamente as regras de versionamento do `AGENTS.md`.

## Pré-requisitos

- Estar na branch `main` atualizada.
- O TODO a ser executado já foi aprovado pelo usuário.
- Ambiente de desenvolvimento funcional (`npm install` rodado, `.env.local` configurado).

## Passos

// turbo-all

1. **Atualizar a main:**

   ```bash
   git pull origin main
   ```

2. **Criar branch da tarefa** (nome deve seguir o ID do TODO):

   ```bash
   git checkout -b feat/TODO-XXX-XX
   ```

3. **Marcar o TODO como "em progresso"** no `docs/BACKLOG.md` (trocar `[ ]` por `[/]` na tarefa principal).

4. **Implementar** todas as sub-tarefas listadas no TODO.
   - Seguir as convenções de idioma do `AGENTS.md`: código em inglês, comentários em pt-BR.
   - Adicionar comentários didáticos detalhados.

5. **Rodar linting e type-check:**

   ```bash
   npm run lint
   ```

   ```bash
   npm run type-check
   ```

6. **Rodar testes:**

   ```bash
   npm run test
   ```

7. **Verificar vulnerabilidades:**

   ```bash
   npm audit
   ```

8. **Verificar o DoD** — conferir cada item da tabela "Definition of Done" no `BACKLOG.md`.

9. **Adicionar arquivos ao stage:**

   ```bash
   git add .
   ```

10. **Commitar com Conventional Commits (em INGLÊS):**

    ```bash
    git commit -m "<tipo>(<escopo>): <descrição>"
    ```

    - Tipos válidos: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `chore`.
    - Exemplo: `git commit -m "feat(auth): implement Supabase login flow with rate limiting"`

11. **Voltar para a main:**

    ```bash
    git checkout main
    ```

12. **Fazer merge da branch:**

    ```bash
    git merge feat/TODO-XXX-XX
    ```

13. **Push para o remoto:**

    ```bash
    git push origin main
    ```

14. **Deletar branch local:**

    ```bash
    git branch -d feat/TODO-XXX-XX
    ```

15. **Deletar branch remota:**

    ```bash
    git push origin --delete feat/TODO-XXX-XX
    ```

16. **Marcar o TODO como concluído** no `docs/BACKLOG.md` (trocar `[/]` por `[x]`).

## Regras Críticas

> ⚠️ **NUNCA empilhe comandos git.** Execute um por vez e verifique a saída ANTES de prosseguir ao próximo.
>
> ⚠️ **Commits SEMPRE em inglês**, seguindo Conventional Commits.
>
> ⚠️ **A branch DEVE ser deletada** (local e remotamente) imediatamente após o merge, no final do TODO.
