# Projeto: North Star

## Objetivo
Organizar as tarefas do dia a dia de uma pessoa de forma rápida: registrar com uma frase, ver o que vence
hoje e amanhã, receber lembretes e não perder tarefas recorrentes.

## Para quem
Uso pessoal do dono (João), no iPhone com o app instalado na tela inicial (orientação retrato, atalho "Nova tarefa").

## Decisões arquiteturais já tomadas
- **Arquivo único** (`index.html`, ~2.500 linhas) com tudo inline; sem framework e sem build. Fontes em `fonts/`.
- **Mapa como visão principal** (v5): tarefas em órbita do centro por prazo, com WebGL (e reserva em canvas 2D),
  painel "Resumo" e lista clássica. O prompt do dono em `PROMPT-claude-code-taskflow-v5.md` registra o que não pode quebrar.
- **Dados locais**: tarefas, alertas, adiamentos e preferências ficam no `localStorage`.
- **Leitura de frases em duas camadas**: `quickParse()` local sempre funciona; a IA (`askAI()`) só aparece
  quando `AI_URL` está preenchida e, se falhar, volta para a leitura local. A IA está fora de escopo das mudanças recentes.
- **Offline-first**: `sw.js` busca na rede e guarda cópia; sem rede, serve do cache.
- **Calendário em vez de push**: o aviso com o app fechado vem do alarme do Calendário do iPhone (arquivo `.ics`),
  porque não há servidor para push.
- **Publicação por upload de arquivos inteiros** no GitHub; por isso cada entrega lista os arquivos a enviar.

## O que o projeto NÃO é
- Não é multiusuário nem sincroniza entre aparelhos (o backup em JSON é a forma de levar os dados).
- Não tem servidor próprio; a IA, quando existir, é uma função externa opcional.
- Não envia notificação push com o app fechado (fora de escopo declarado no prompt do v5).
