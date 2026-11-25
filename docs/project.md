# Projeto: North Star

## Objetivo
Organizar as tarefas do dia a dia de uma pessoa de forma rápida: registrar com uma frase, ver o que vence
hoje e amanhã, receber lembretes e não perder tarefas recorrentes.

## Para quem
Uso pessoal, no celular (app instalado, orientação retrato, atalho "Nova tarefa" no manifesto).

## Decisões arquiteturais já tomadas
- **Arquivo único** (`index.html`, ~1.300 linhas) com tudo inline; sem framework.
- **Dados locais**: tarefas, alertas disparados e adiamentos ficam no `localStorage`.
- **Leitura de frases em duas camadas**: `quickParse()` local sempre funciona; a IA (`askAI()`) só aparece
  quando `AI_URL` está preenchida e, se falhar, volta para a leitura local.
- **Offline-first**: `sw.js` busca na rede e guarda cópia; sem rede, serve do cache.

## O que o projeto NÃO é
- Não é multiusuário nem sincroniza entre aparelhos (o backup em JSON é a forma de levar os dados).
- Não tem servidor próprio; a IA, quando existir, é uma função externa opcional.
