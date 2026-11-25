# Requisitos e regras de negócio

Levantados do código em 2026-11-25 (`index.html`, v3.0.0). Atualize sempre que um requisito mudar.

## Tarefas
- Tarefas com data de vencimento, prioridade, categoria/tag e subtarefas (`parseSubs()`).
- Rótulos de data relativos: "Hoje", "Amanhã" (`dueLabel()`), com datas locais no formato AAAA-MM-DD.
- Recorrência diária, semanal ou mensal (`REP`); concluir uma recorrente gera a próxima (`spawnNext()`,
  `nextDue()`).
- Visões e filtros por estado (abertas/concluídas) e agrupamento por período (`bucket()`, `renderList()`).

## Entrada rápida
- Frase em linguagem natural interpretada localmente (`quickParse()`), com pré-visualização das tarefas.
- IA opcional: `POST` para `AI_URL` com `{text, today, now, weekday…}`; timeout de 15 s; HTTP 429 =
  limite diário; 422 = frase não entendida. Em qualquer falha, mantém a leitura local.

## Lembretes
- Notificações do navegador (`notify()`, `checkReminders()`), com adiamento (`taskflow_snoozed`) e
  registro do que já foi avisado (`taskflow_alerted`). Clique na notificação foca o app (`sw.js`).

## Dados
- `localStorage`: `taskflow` (lista de tarefas), `taskflow_alerted`, `taskflow_snoozed`, `taskflow_help`
  (ajuda já vista).
- Backup e importação em JSON (`backupJson()`, importação normaliza categorias e campos), exportação
  (`exportTasks()`), compartilhamento de arquivo (`shareFile()`) e calendário ICS (`icsFor()`).
