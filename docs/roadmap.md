# Roadmap

## Consolidado
Histórico do que está implementado e estável. Nunca apagar; só acrescentar.

- **2026-11-15 · v1.x** — criação do `index.html` e versões 1.2 a 1.3.4 (inclui correção de acentuação).
- **2026-11-24 · v3.0.0** — upload da versão atual com ícones, manifesto e service worker
  (commits "Add files via upload").
- **2026-11-25 · CLAUDE.md como índice modular** (skill `claude-md-index`): `docs/` criado a partir do código.
- **2026-11-26 · v3.1.0 — Enviar tarefas ao calendário**: botão no menu que gera um `.ics` com todas as tarefas abertas com
  data (eventos e alarmes), dobra de linhas da RFC 5545 e validação de data/hora por tarefa. Testes em `tests/` (e2e + validador
  `icalendar`). Testado só no Chromium; não em iPhone.
- **2026-11-25/26 · v5.0.0** — o dono enviou ao `main` a versão 5 (mapa com buraco negro, "Resumo", tela de entrada,
  fontes locais, cache `taskflow-500`); este branch passou a incluir essa base (merge de `origin/main`).
- **2026-11-26 · v5.1.0 — Enviar tarefas ao calendário** (portado para a v5): botão no menu que gera um `.ics` com todas as
  tarefas abertas com data (eventos e alarmes), dobra de linhas da RFC 5545 e validação de data/hora por tarefa. Substitui a
  tentativa v3.1.0, feita antes sobre uma base desatualizada e que ficou só no histórico do branch. Testes em `tests/` (e2e +
  validador `icalendar`). Testado só no Chromium; não em iPhone.

## Em andamento
- Nada.

## Backlog
- **Subir `index.html` e `sw.js` v5.1.0 ao `main`/GitHub Pages** (ver `docs/state.md`) e **testar no iPhone de verdade**
  o botão (folha de compartilhamento e tela "Adicionar" do Calendário).
- Verificar no iPhone se reexportar atualiza os eventos ou cria duplicados (o envio em lote reexporta tudo a cada vez);
  se duplicar, considerar `SEQUENCE`/`LAST-MODIFIED`.
- Recorrentes: concluir cria tarefa com id novo e o reenvio ao calendário gera série duplicada; avaliar `UID` por série.
- Decidir com o usuário o destino das cópias antigas `index_3.html` (v3.0.0), `icon_1.svg`, `icon-180_1.png`,
  `icon-192_1.png`, `icon-512_1.png` e `manifest_1.json` (nada as referencia).
- Branch `joaogabrielll093-star-patch-1` existe no remoto; conferir se ainda é necessário.
- Testes automatizados para `quickParse()`, `nextDue()` e importação de backup.
