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

## Calendário (v3.1.0)
- Dois caminhos, ambos geram `.ics` com alarme (o alarme é do Calendário do aparelho e toca com o app fechado):
  - botão "Adicionar ao calendário" na tarefa (`icsFor`): um evento;
  - menu "Enviar tarefas ao calendário" (`icsForAll`): um único `VCALENDAR` com N eventos.
- Com horário de lembrete: evento de 30 min e alarme na hora (`TRIGGER:PT0M`). Sem horário: dia inteiro e alarme às 9h.
  Recorrência diária/semanal/mensal vira `RRULE`. `UID` = `id@taskflow`.
- Quais entram no envio em lote (`calendarTasks`): abertas, com data e horário válidos. Ficam de fora (e o aviso conta
  quantas): sem data; atrasadas não recorrentes; data/hora inválida (ex.: importadas com texto livre). Atrasadas
  recorrentes entram, porque a repetição ainda gera avisos futuros.
- Linhas dobradas em 75 octetos UTF-8 (`icsFold`), como manda a RFC 5545.
- Entrega: `navigator.share` com arquivo (folha de compartilhamento do iOS, onde aparece "Calendário"); sem suporte, baixa
  o arquivo. O envio é chamado sem `await` antes do compartilhamento, para não perder o gesto do toque no iOS.
- Limite conhecido: concluir uma tarefa recorrente cria outra com id novo; reenviar ao calendário cria uma segunda série.

