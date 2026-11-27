# Estado da Sessão

**Última atualização:** 2026-11-26

## Task em Andamento
Nenhuma. Botão "Enviar tarefas ao calendário" (v5.1.0) publicado: `main` em `cd5d104` e GitHub Pages servindo build 510 (conferido em 2026-11-27).

## Arquivos Modificados
- `index.html` - `icsFor` dividido em `icsEvent`/`icsWrap`/`icsFold`; novos `icsForAll`, `calendarTasks`, botão `#mCal` e
  handler; versão 5.1.0, build 510 (título, rodapé, `backupJson`). Mantém CRLF. Diff contra o `main`: 58 linhas a mais, 9 a menos
- `sw.js` - cache `taskflow-510`
- `tests/calendar-export.e2e.cjs`, `tests/validate_ics.py` - testes novos
- `CLAUDE.md`, `docs/*.md` - reescritos para a v5 (antes descreviam a v3.0.0)

## Decisões Tomadas (ainda não documentadas)
- `UID` das tarefas recorrentes continua `id@taskflow` (sem UID por série), para não mudar o que já foi exportado.
- O trabalho começou numa base v3.0.0 desatualizada; o `main` havia recebido a v5 por upload. Foi feito merge de `origin/main`
  (sem force) e o botão foi portado. Só `index.html` e `sw.js` mudaram em relação ao `main`.

## Próximo Passo
O dono deve fechar e reabrir o app no iPhone e conferir "5.1.0 · build 510" no rodapé do menu. Pendente de teste no iPhone:
se a folha de compartilhamento oferece o Calendário e se exportar duas vezes duplica os eventos (o `UID` é estável, sem
`SEQUENCE`). Antes de qualquer novo upload de `index.html`, a pasta local do dono precisa ter a versão 5.1.0, senão o botão some.
