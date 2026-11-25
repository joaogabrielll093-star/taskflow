# TaskFlow

Aplicativo pessoal de organização de tarefas (pt-BR), instalável como PWA. Lema do manifesto:
"Organize. Priorize. Realize."

## Stack
- Um único `index.html` com HTML, CSS e JavaScript inline, sem build e sem dependências
- Dados no `localStorage` do aparelho; service worker `sw.js` (cache `taskflow-300`)
- IA opcional para ler frases: função externa em `AI_URL` (Cloudflare Worker), vazia por padrão

## Comandos
- Servir local: `python3 -m http.server 8080` e abrir http://localhost:8080
- Não há testes automatizados nem build

## Contexto do Projeto
- Visão, propósito e o que o projeto não é → `docs/project.md`
- Requisitos e regras de negócio → `docs/requirements.md`
- Histórico e próximos passos → `docs/roadmap.md`
- Estado da última sessão → `docs/state.md`

## Regras Absolutas
- Nunca quebrar as chaves do `localStorage` (`taskflow`, `taskflow_alerted`, `taskflow_snoozed`,
  `taskflow_help`); mudança de formato exige migração que leia o formato antigo
- Ao mudar arquivos servidos, trocar a versão do cache em `sw.js` e a versão no `<title>`
- `AI_URL` nunca recebe chave secreta: a chave fica no Worker, não no HTML público
- Os arquivos `*_1.*` e `index_3.html` são cópias idênticas; não apague nem edite sem confirmar
  com o usuário (ver `docs/roadmap.md`)
- Texto da interface em português do Brasil

## Fluxo de Trabalho
1. Leia `docs/state.md` antes de qualquer ação
2. Ao concluir uma task, mova-a para `## Consolidado` em `docs/roadmap.md`
3. Ao encerrar a sessão, sobrescreva `docs/state.md` com o checkpoint
