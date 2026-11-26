# Estado da Sessão

**Última atualização:** 2026-11-26

## Task em Andamento
Nenhuma. Entregue o botão "Enviar tarefas ao calendário" na v5.1.0, commitado no branch de trabalho (ainda não está no `main`).

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
Para o botão chegar ao iPhone: levar `index.html` e `sw.js` deste branch para o `main` (merge/PR) **ou** subir esses 2 arquivos
pelo GitHub. Atenção: se o dono depois subir de novo um `index.html` local antigo, o botão some; a pasta local precisa receber
o arquivo novo antes. O GitHub Pages é citado no prompt do v5, mas qual branch ele publica não foi verificado. Testar no iPhone.
