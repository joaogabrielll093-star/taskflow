# Estado da Sessão

**Última atualização:** 2026-11-26

## Task em Andamento
Nenhuma. Entregue o botão "Enviar tarefas ao calendário" (v3.1.0), commitado no branch de trabalho.

## Arquivos Modificados
- `index.html` - `icsFor` dividido em `icsEvent`/`icsWrap`/`icsFold`; novos `icsForAll`, `calendarTasks`, botão `#mCal` e
  handler; versão v3.1.0, build 310
- `sw.js` - cache `taskflow-310`
- `tests/calendar-export.e2e.cjs`, `tests/validate_ics.py` - testes novos
- `CLAUDE.md`, `docs/requirements.md`, `docs/roadmap.md`, `docs/state.md` - atualizados

## Decisões Tomadas (ainda não documentadas)
- `UID` das tarefas recorrentes continua `id@taskflow` (sem UID por série), para não mudar o que já foi exportado.

## Próximo Passo
Branch de trabalho: `claude/atlas-invest-prompt-5jzy99`. O `main` não tem o botão: para chegar ao iPhone é preciso
mesclar o branch (ou abrir PR) e o app ser publicado de onde o usuário o abre. Testar no iPhone (ver Backlog).
