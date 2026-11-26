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

## Em andamento
- Nada.

## Backlog
- **Testar no iPhone de verdade** o botão do menu (folha de compartilhamento e tela "Adicionar" do Calendário).
- Publicação: esta versão está só no branch `claude/atlas-invest-prompt-5jzy99`; o `main` não foi alterado e não foi
  verificado onde o app é publicado.
- Recorrentes: concluir cria tarefa com id novo e o reenvio ao calendário gera série duplicada; avaliar `UID` por série.
- Decidir com o usuário o destino das cópias `index_3.html` (agora é a v3.0.0), `icon_1.svg`, `icon-180_1.png`,
  `icon-192_1.png`, `icon-512_1.png` e `manifest_1.json` (nada as referencia).
- Branch `joaogabrielll093-star-patch-1` existe no remoto; conferir se ainda é necessário.
- Testes automatizados para `quickParse()`, `nextDue()` e importação de backup.
