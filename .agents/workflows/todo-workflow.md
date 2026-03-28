---
description: Fluxo padrão para executar um TODO do Backlog, alinhado ao AGENTS.md
---

# Workflow: Execução de TODO

Este workflow define o passo a passo obrigatório para executar qualquer TODO do Backlog do projeto (ex: `docs/BACKLOG_MVP.md`, `docs/BACKLOG_PHASE2.md`), respeitando rigorosamente as regras de versionamento do `AGENTS.md`.

## Pré-requisitos

- Estar na branch `main` atualizada.
- O TODO a ser executado já foi aprovado pelo usuário.

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

3. **Marcar o TODO como "em progresso"** no arquivo de Backlog da fase atual (trocar `[ ]` por `[/]` na tarefa principal).

4. **Implementar** todas as sub-tarefas listadas no TODO.
   - Seguir as convenções de idioma do `AGENTS.md`: código em inglês, comentários em pt-BR.
   - Adicionar comentários didáticos detalhados.

5. **Verificar o DoD** — conferir cada item da tabela "Definition of Done" no Backlog da fase atual.

6. **Adicionar arquivos ao stage:**

   ```bash
   git add .
   ```

7. **Commitar com Conventional Commits (em INGLÊS):**

   ```bash
   git commit -m "<tipo>(<escopo>): <descrição>"
   ```

   - Tipos válidos: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `chore`.
   - Exemplo: `git commit -m "feat(auth): implement Supabase login flow with rate limiting"`

8. **Voltar para a main:**

   ```bash
   git checkout main
   ```

9. **Fazer merge da branch:**

   ```bash
   git merge feat/TODO-XXX-XX
   ```

10. **Push para o remoto:**

    ```bash
    git push origin main
    ```

11. **Deletar branch local:**

    ```bash
    git branch -d feat/TODO-XXX-XX
    ```

12. **Deletar branch remota:**

    ```bash
    git push origin --delete feat/TODO-XXX-XX
    ```

13. **Marcar o TODO como concluído** no arquivo de Backlog da fase atual (trocar `[/]` por `[x]`).

## Regras Críticas

> ⚠️ **NUNCA empilhe comandos git.** Execute um por vez e verifique a saída ANTES de prosseguir ao próximo.
>
> ⚠️ **Commits SEMPRE em inglês**, seguindo Conventional Commits.
>
> ⚠️ **A branch DEVE ser deletada** (local e remotamente) imediatamente após o merge, no final do TODO.
