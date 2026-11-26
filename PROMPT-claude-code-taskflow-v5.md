# TaskFlow v5: prompt para o Claude Code

Cole a instrução curta (no fim da conversa com o Claude) no Claude Code, dentro da pasta do TaskFlow que já tem a v4.0.1. Este arquivo deve estar na mesma pasta que o `index.html`.

---

## Papel e objetivo

Você vai evoluir o TaskFlow da v4.0.1 para a v5.0.0. O app é um PWA mobile em um único `index.html` com JavaScript puro, sem build, publicado no GitHub Pages. O dono, João, usa em um iPhone.

A v5 muda a cena central do app, inspirada em um vídeo de referência (um app de grafo de conhecimento chamado "Second Brain"). Pontos do vídeo que devem guiar o resultado:

- No centro, um **buraco negro extremamente realista**, no estilo do filme Interstellar: disco de acreção dourado e branco, luz curvada em arco por cima e por baixo, anel de fótons, lado do disco mais brilhante que o outro.
- Fundo com **muitas estrelinhas ligadas por linhas finíssimas**, como constelações, mais **fumaça cinza-quente** bem sutil.
- **Arcos longos e finos** de luz, como rastros de cometa, cruzando a tela devagar.
- Rótulos pequenos em branco, com a contagem em cinza embaixo.
- Bloco de saudação no canto, com a lista "Próximas".
- Um painel "Resumo" em vidro escuro, aberto por um mergulho da câmera no buraco negro.
- Uma pílula de controles flutuante embaixo e botões discretos no topo.

Mudança pedida pelo João: **as tarefas deixam de ser planetas e passam a ser estrelas pequenas**. No celular, quem dá zoom com os dedos vê a estrela crescer, como se estivesse se aproximando dela, com mais detalhe quanto mais perto.

A lógica das tarefas não muda. Não use cores laranja, verde, azul ou roxo do vídeo: a paleta continua preto, branco e dourado.

## Skills a usar, nesta ordem

1. `emil-design-eng`: decisões de animação, de zoom, de toque e de acabamento.
2. `impeccable-design-polish`: depois de cada fase, nos modos auditar, criticar, polir e reforçar. Escreva a crítica, não só aplique.
3. `web-design-guidelines`: revisão final de acessibilidade e boas práticas.

Se alguma skill não estiver disponível, diga no começo e siga os mesmos princípios.

## Antes de começar

1. Rode `git status`, confira que a branch atual tem a v4.0.1 e crie a branch `v5-universo` a partir dela.
2. Leia `index.html`, `sw.js` e `manifest.json` por inteiro.
3. Escreva o plano por fase em poucas linhas e siga sem pedir aprovação. Registre os desvios no fim.

## O que não pode quebrar

- Dados do usuário: chaves `taskflow`, `taskflow_alerted`, `taskflow_snoozed`, `taskflow_help`, `taskflow_ui`, `taskflow_calm`, `taskflow_name`. Só pode adicionar chaves novas. O formato das tarefas não muda: `{id,title,description,category,priority,due,reminder,done,repeat,subs,spawned,doneAt}`. Backups da v3 e da v4 precisam continuar abrindo.
- Funções: adição por frase (`quickParse`), recorrência, subtarefas, lembretes com o app aberto, exportar e importar backup, exportar para o calendário, arrastar entre órbitas, segurar no espaço vazio para criar, lista clássica, menu, ajuda, tela de entrada com o nome.
- Acessibilidade da v3.1 e da v4: teclado no mapa (setas, Enter, `+`, `-`, `0`, Esc, sem animação), foco que entra e volta do painel, `aria-pressed`, alvos de toque de 44 px, `prefers-reduced-motion`, botão "Animações do fundo", contraste mínimo de 4,5:1 em textos.
- Funcionar offline, sem CDN e sem biblioteca externa. Tudo inline ou em arquivos locais listados no cache do `sw.js`.
- Áreas seguras do iPhone, 60 quadros por segundo em iPhone de gama média, pouca bateria (pausar o desenho com o app em segundo plano).

## Fase 1: buraco negro realista no centro

Substitua o sol por um buraco negro. O contador do dia ("2/5 feitas") fica numa etiqueta pequena logo abaixo ou ao lado, nunca por cima do disco.

Implementação recomendada:

- Um `<canvas>` WebGL pequeno, atrás do canvas 2D das estrelas, com um fragment shader que simula o buraco negro por traçado de raios aproximado: lente gravitacional do disco (a parte de trás aparece curvada por cima e por baixo), anel de fótons, sombra preta, disco fino em rotação com turbulência (ruído) e efeito Doppler (um lado do disco mais brilhante e mais quente que o outro).
- Cores: dourado `#C9A24B` e champanhe `#E8D5A3` nas bordas, branco quente `#F5F1E8` no ponto mais forte, preto `#050505` na sombra. Sem azul, sem roxo.
- Desempenho: renderizar em resolução reduzida (por exemplo 0,5 a 0,7 do tamanho da tela, respeitando o pixel ratio), limitar a 30 quadros por segundo, pausar com o app em segundo plano e quando o buraco negro estiver fora da tela com zoom. Sem `preserveDrawingBuffer`.
- Fallbacks: se WebGL não estiver disponível ou falhar, desenhe uma versão em canvas 2D com sprites (disco em elipse com brilho, anel de luz, sombra). Com movimento reduzido ou modo calmo, mostre um quadro estático.
- Teste o resultado em capturas de tela ampliadas e compare com o vídeo de referência: o João quer o mesmo nível de realismo. Se o shader não chegar lá, melhore antes de seguir.

## Fase 2: fundo de constelação, fumaça e arcos

- Rede de estrelinhas ligadas por linhas finas (opacidade baixa), com paralaxe leve ao arrastar o mapa e à inclinação do aparelho. Limite no iPhone: algumas centenas de pontos e algumas centenas de linhas. Desenhe a rede em uma camada fora da tela (offscreen) e só redesenhe quando a câmera se mover, e não a cada quadro.
- Fumaça: 2 a 3 sprites grandes de cinza-quente com opacidade muito baixa, derivando devagar.
- Arcos longos e finos de luz (3 a 5), cruzando devagar e sumindo, no estilo dos arcos do vídeo.
- Nada de gradiente novo criado a cada quadro.

## Fase 3: tarefas viram estrelas

Cada tarefa pendente é uma estrela em órbita do buraco negro. As órbitas por prazo continuam (atrasada, hoje, amanhã, semana, depois, sem prazo). O significado, que antes vinha dos planetas, passa a vir das estrelas:

| Informação | Como aparece na estrela |
| --- | --- |
| Prioridade | Tamanho e brilho. Alta: maior, mais forte, com pulsação lenta. Baixa: pequena e discreta |
| Categoria | Pessoal: luz dourada quente. Trabalho: luz branca. Sem outras cores |
| Repetição | Estrela dupla: duas estrelas orbitando uma à outra |
| Atrasada | Estrela avermelhada (`#B5483A`) com cauda de cometa |
| Sem prazo ou "depois" | Estrela distante, mais fraca, na órbita externa |
| Subtarefas | Pontinhos de luz girando ao redor da estrela, visíveis só com zoom |
| Concluída | Supernova curta e a estrela segue para a galáxia de concluídas |

Atualize a legenda de "Como usar o mapa" para esta tabela. Os filtros "Pessoal" e "Trabalho" destacam as estrelas da categoria e escurecem as outras, com a contagem no rótulo.

### Zoom que aproxima de verdade

- O zoom por pinça (e roda do mouse) vai de visão geral até muito perto. Quanto maior o zoom, maior e mais detalhada fica a estrela, e ela cresce além do que a escala geométrica daria, para dar a sensação de aproximação.
- Níveis de detalhe (LOD), com sprites desenhados uma vez em canvas fora da tela e reaproveitados:
  1. Longe: ponto de luz com um brilho leve e, nas maiores, pequenos raios de difração.
  2. Médio: disco brilhante com halo.
  3. Perto: superfície com textura de granulação e manchas (ruído procedural), borda mais escura, coroa, pequenas labaredas que se movem devagar.
- A transição entre níveis deve ser suave (mistura de opacidade), sem saltos. A câmera segue o ponto sob os dedos durante a pinça.
- Tocar na estrela abre o painel da tarefa como hoje, e a câmera voa até ela. Os gestos existentes continuam: arrastar para mover a vista, pinça, tocar, segurar e arrastar para reagendar, segurar no vazio para criar.
- Limite de custo: com 40 tarefas, 60 quadros por segundo. Simplifique estrelas fora da tela.

## Fase 4: saudação, "Próximas" e controles

- Cabeçalho com a data e a saudação com o nome ("Boa noite, João"), como na v4. Logo abaixo, uma linha de apoio curta, por exemplo "Desde a última vez, há 6 horas." e uma frase calma ("Tudo está onde você deixou." quando nada mudou).
- Cartão **Próximas**: as 2 ou 3 próximas tarefas por prazo, com a data em dourado e o título. Toque abre a tarefa. No celular, aparece na entrada e some ao mexer no mapa, e volta pelo botão do topo.
- Botões discretos no topo: "Resumo" no centro (em vez de Home) e o menu à direita.
- Pílula flutuante embaixo, com alvos de 44 px: lista, nova tarefa (foguete dourado, destaque principal), centralizar, e zoom `+` e `-`. Rótulos de acessibilidade em todos.

## Fase 5: painel "Resumo"

Ao tocar em "Resumo", a câmera mergulha no buraco negro (animação curta, pulada com movimento reduzido) e abre um painel de vidro escuro (`#0E0E0F` com borda fina) em tela cheia no celular:

- Campo de busca no topo ("Buscar tarefas…"), que filtra por título, descrição e subtarefas e leva até a estrela.
- Quatro cartões com número grande e mini gráfico de barras: Abertas, Para hoje, Atrasadas, Feitas nos últimos 7 dias. Barras em dourado e branco, sem outras cores. Números com contagem animada.
- Lista "Por categoria" com barras de progresso finas.
- Lista "Mais atrasadas" e "Atividade recente" (últimas concluídas).
- Botão de fechar e Esc, com foco que entra e volta, como no painel da tarefa.

## Fase 6: animação e entrada

- Entrada do app: o buraco negro acende, as estrelas de fundo aparecem, as estrelas das tarefas nascem em sequência com leve rebote, os arcos cruzam, a saudação surge. Toque pula.
- Mergulho e volta da câmera ao abrir e fechar o Resumo e ao focar uma estrela, com curva suave.
- Concluir: supernova curta e a estrela segue até a galáxia.
- Tudo respeita `prefers-reduced-motion`, o modo calmo e o botão "Animações do fundo".

## Fase 7: acabamento e versão

- Rode `impeccable-design-polish` (auditar, criticar por escrito, polir, reforçar) e depois `web-design-guidelines`. Registre os achados.
- Versão `5.0.0`, build 500: título da página, rodapé do menu, versão do backup e cache `taskflow-500` no `sw.js`. Atualize o `manifest.json` e os ícones só se mudarem.
- Atualize "Como usar o mapa" com a nova legenda e o Resumo.

## Testes obrigatórios

Playwright com viewport 390x844 e 375x667, `hasTouch` e `isMobile` ligados, e também com movimento reduzido. Olhe as capturas de tela de verdade:

1. Entrada com e sem nome salvo. Mapa vazio, com 5 e com 40 tarefas.
2. Zoom em três níveis sobre uma estrela e sobre uma estrela dupla (repetição), e a transição entre eles.
3. Buraco negro: captura ampliada, comparada com a descrição do vídeo, e o fallback sem WebGL.
4. Tocar, concluir, desfazer, adiar, editar, arrastar para outra órbita, segurar no vazio e criar.
5. Resumo: busca, cartões, abrir e fechar, teclado e foco.
6. Lista, filtros, backup exportar e importar, abrir backup antigo (v3 e v4).
7. Teclado no mapa, console sem erros, tempo médio de quadro (entrada e com 40 tarefas) e consumo de memória estável após 2 minutos de uso.

Diga com franqueza o que não foi testado (iPhone real e Safari/WebKit de verdade, bateria) e o que ficou aquém do vídeo.

## Fora de escopo

Notificação push com o app fechado, a IA (`worker.js`, `AI_URL`), login e sincronização. Não mexa, só não quebre.

## Entrega

1. Um commit pequeno por fase, em português, na branch `v5-universo`. Sem push.
2. Resumo final: o que mudou, os desvios deste documento, o que o João precisa conferir no iPhone, e a lista exata dos arquivos alterados e novos para enviar ao GitHub Pages.
