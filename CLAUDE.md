# TaskFlow

Aplicativo pessoal de organização de tarefas (pt-BR), instalável como PWA, usado no iPhone. As tarefas viram um mapa
(buraco negro no centro, tarefas em órbita por prazo) com lista clássica, painel "Resumo" e tela de entrada com o nome.
Lema do manifesto: "Organize. Priorize. Realize."

## Stack
- Um único `index.html` (~2.500 linhas) com HTML, CSS e JavaScript inline, sem build e sem dependências; fontes locais em `fonts/`
- Dados no `localStorage` do aparelho; service worker `sw.js` (cache `taskflow-510`, lista de arquivos pré-carregados)
- IA opcional para ler frases: função externa em `AI_URL` (Cloudflare Worker), vazia por padrão
- Publicação: o dono sobe arquivos inteiros pelo GitHub ("Add files via upload") e o app roda no GitHub Pages (ver `docs/state.md`)

## Comandos
- Servir local: `python3 -m http.server 8080` e abrir http://localhost:8080 (sem build)
- Teste do envio ao calendário (Playwright + `pip install icalendar`): com o servidor em outra porta, `node tests/calendar-export.e2e.cjs http://localhost:8790/ /tmp/ics` e depois `python3 tests/validate_ics.py /tmp/ics/share.ics`
- Não há outros testes automatizados

## Contexto do Projeto
- Visão, propósito e o que o projeto não é → `docs/project.md`
- Requisitos e regras de negócio → `docs/requirements.md`
- Histórico e próximos passos → `docs/roadmap.md`
- Estado da última sessão → `docs/state.md`
- Prompt do dono para a v5, com o que não pode quebrar → `PROMPT-claude-code-taskflow-v5.md`

## Regras Absolutas
- Antes de editar, `git fetch` e confira se o `main` mudou: o dono envia versões novas inteiras do `index.html` e uma
  base antiga gera trabalho perdido
- Nunca quebrar as chaves do `localStorage`: `taskflow`, `taskflow_alerted`, `taskflow_snoozed`, `taskflow_seen`,
  `taskflow_help`, `taskflow_ui`, `taskflow_calm`, `taskflow_name`. Só se acrescentam chaves novas; mudança de formato
  exige migração que leia o formato antigo. Formato da tarefa: `{id,title,description,category,priority,due,reminder,done,repeat,subs,spawned,doneAt}`
- A versão aparece em 4 lugares e muda junto: `<title>`, rodapé do menu ("X.Y.Z · build N"), `backupJson()` (version e
  build) e o cache em `sw.js`. Arquivo novo servido offline entra na lista do `sw.js`
- `index.html` usa finais de linha **CRLF**. Edite lendo e gravando em binário (ou sem converter); converter para LF faz o
  diff virar "arquivo inteiro mudou". Confira com `git diff --stat`
- Arquivo `.ics`: no máximo 75 octetos por linha (`icsFold`) e o botão por tarefa (`icsFor`) não pode mudar de saída sem aviso
- `AI_URL` nunca recebe chave secreta: a chave fica no Worker, não no HTML público
- `index_3.html` (v3.0.0), `icon_1.svg`, `icon-*_1.png` e `manifest_1.json` são cópias antigas; não apague nem edite sem
  confirmar com o usuário (ver `docs/roadmap.md`)
- Texto da interface em português do Brasil; alvos de toque de 44 px; respeitar `prefers-reduced-motion` e o modo calmo

## Fluxo de Trabalho
1. Leia `docs/state.md` antes de qualquer ação
2. Ao concluir uma task, mova-a para `## Consolidado` em `docs/roadmap.md`
3. Ao encerrar a sessão, sobrescreva `docs/state.md` com o checkpoint
4. Ao entregar, liste os arquivos exatos que o dono precisa subir (ex.: `index.html`, `sw.js`)
