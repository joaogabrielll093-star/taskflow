# TaskFlow

Aplicativo pessoal de organização de tarefas (pt-BR), instalável como PWA. Lema do manifesto:
"Organize. Priorize. Realize."

## Stack
- Um único `index.html` com HTML, CSS e JavaScript inline, sem build e sem dependências
- Dados no `localStorage` do aparelho; service worker `sw.js` (cache `taskflow-310`)
- IA opcional para ler frases: função externa em `AI_URL` (Cloudflare Worker), vazia por padrão

## Comandos
- Servir local: `python3 -m http.server 8080` e abrir http://localhost:8080 (sem build)
- Teste do envio ao calendário (Playwright + `pip install icalendar`): com o servidor em outra porta, `node tests/calendar-export.e2e.cjs http://localhost:8790/ /tmp/ics` e depois `python3 tests/validate_ics.py /tmp/ics/share.ics`
- Não há outros testes automatizados

## Contexto do Projeto
- Visão, propósito e o que o projeto não é → `docs/project.md`
- Requisitos e regras de negócio → `docs/requirements.md`
- Histórico e próximos passos → `docs/roadmap.md`
- Estado da última sessão → `docs/state.md`

## Regras Absolutas
- Nunca quebrar as chaves do `localStorage` (`taskflow`, `taskflow_alerted`, `taskflow_snoozed`,
  `taskflow_help`); mudança de formato exige migração que leia o formato antigo
- Ao mudar arquivos servidos, trocar a versão do cache em `sw.js`, no `<title>` e no "build" do rodapé do menu
- Arquivo `.ics`: no máximo 75 octetos por linha (usar `icsFold`) e o botão por tarefa (`icsFor`) não pode mudar de saída sem aviso
- `AI_URL` nunca recebe chave secreta: a chave fica no Worker, não no HTML público
- Os arquivos `*_1.*` são cópias dos originais e `index_3.html` é uma cópia antiga da v3.0.0 (anterior ao envio ao
  calendário); não apague nem edite sem confirmar com o usuário (ver `docs/roadmap.md`)
- Texto da interface em português do Brasil

## Fluxo de Trabalho
1. Leia `docs/state.md` antes de qualquer ação
2. Ao concluir uma task, mova-a para `## Consolidado` em `docs/roadmap.md`
3. Ao encerrar a sessão, sobrescreva `docs/state.md` com o checkpoint
