---
name: claude-md-index
description: >
  Estrutura o CLAUDE.md de um projeto como um Índice Modular em vez de um monolito de contexto.
  Use esta skill sempre que o usuário mencionar CLAUDE.md, contexto de projeto para Claude Code,
  escalabilidade de contexto em projetos de IA, "o Claude está esquecendo coisas entre sessões",
  "meu CLAUDE.md está ficando gigante", ou quiser organizar documentação de projeto para agentes
  de IA. Também acione quando o usuário pedir para estruturar, criar ou refatorar arquivos de
  contexto para Claude Code, Cursor, ou qualquer agente LLM que use arquivos Markdown como memória.
  Esta skill deve ser ativada agressivamente - qualquer menção a contexto de sessão, estado de
  projeto, ou documentação modular para agentes de IA é suficiente para acionar.
---

# CLAUDE.md como Índice Modular

## Conceito Central

O erro mais comum em projetos que escalam: usar o `CLAUDE.md` como um manual monolítico que cresce
indefinidamente. Isso degrada a qualidade do contexto, aumenta o custo de tokens e faz o agente
perder foco.

**A solução:** tratar o `CLAUDE.md` como um **roteador de informações** - um índice leve que aponta
para arquivos especializados. O agente lê o índice e navega apenas para o que precisa.

---

## Estrutura de Arquivos

```
projeto/
├── CLAUDE.md           ← Índice principal (roteador)
├── docs/
│   ├── project.md      ← Visão, propósito, North Star
│   ├── requirements.md ← Requisitos e lógica de negócio
│   ├── roadmap.md      ← Histórico consolidado + próximos passos
│   └── state.md        ← Estado atual da sessão
```

---

## Papel de Cada Arquivo

### `CLAUDE.md` - O Roteador
- Identidade do projeto em 3-5 linhas
- Stack técnico resumido
- Links explícitos para os demais arquivos com descrição de quando usar cada um
- Regras absolutas de comportamento do agente (nunca deletar dados, padrões de código, etc.)
- **Deve ser curto.** Alvo desta skill: 80 linhas. Limite oficial da doc do Claude Code: até 200
  linhas por CLAUDE.md (a adesão às instruções cai com o tamanho). Passou do alvo, mova algo para
  um arquivo filho ou para uma rule path-gated (ver "Mecanismos nativos" abaixo).

### `docs/project.md` - North Star
- Objetivo do produto/sistema em linguagem clara
- Problema que resolve e para quem
- Decisões arquiteturais de alto nível já tomadas
- O que o projeto **não** é (evita desvios de escopo)

### `docs/requirements.md` - Contratos
- Requisitos funcionais estruturados (pode usar user stories, AC, ou formato livre)
- Regras de negócio críticas com exemplos
- Integrações externas e seus contratos
- Validações obrigatórias
- **Atualizado sempre que um requisito muda ou é descoberto**

### `docs/roadmap.md` - Memória Histórica
- Seção `## Consolidado`: o que foi implementado e está estável
- Seção `## Em andamento`: features/tasks na sprint atual
- Seção `## Backlog`: próximos passos priorizados
- **Nunca apagar o consolidado** - é a memória do projeto

### `docs/state.md` - Checkpoint de Sessão
- Qual task estava em andamento quando a sessão foi encerrada
- Arquivos modificados na última sessão
- Decisões tomadas que ainda não estão em requirements.md
- Próximo passo imediato ao retomar
- **Sobrescrito a cada encerramento de sessão**

---

## Template: `CLAUDE.md` (Índice)

```markdown
# [Nome do Projeto]

[1-2 frases: o que é e qual problema resolve]

## Stack
- [tecnologia principal]
- [banco de dados]
- [infra/deploy]

## Contexto do Projeto
- Visão e propósito → `docs/project.md`
- Requisitos e regras de negócio → `docs/requirements.md`
- Histórico e roadmap → `docs/roadmap.md`
- Estado da sessão atual → `docs/state.md`

## Regras Absolutas
- [regra crítica 1, ex: nunca sobrescrever .env sem confirmação]
- [regra crítica 2, ex: sempre rodar testes antes de commitar]
- [padrão de código/arquitetura obrigatório]

## Fluxo de Trabalho
1. Leia `docs/state.md` antes de qualquer ação
2. Ao concluir uma task, atualize `docs/roadmap.md` (mova para Consolidado)
3. Ao encerrar sessão, atualize `docs/state.md` com checkpoint
```

---

## Template: `docs/state.md` (Checkpoint)

```markdown
# Estado da Sessão

**Última atualização:** [data/hora]

## Task em Andamento
[descrição da task que estava sendo executada]

## Arquivos Modificados
- `src/...` - [o que foi feito]
- `docs/...` - [o que foi atualizado]

## Decisões Tomadas (ainda não documentadas)
- [decisão 1]
- [decisão 2]

## Próximo Passo
[instrução direta para o agente ao retomar]
```

---

## Mecanismos Nativos do Claude Code

A doc oficial (`code.claude.com/docs/en/memory` + `/docs/en/claude-directory`) tem 4 mecanismos que
complementam o modelo roteador. Use-os em vez de reinventar:

### 1. `.claude/rules/*.md` com path-gating (lazy-loading nativo de regras)

Regras de tópico saem do CLAUDE.md e viram arquivos em `.claude/rules/` (1 tema por arquivo:
`testing.md`, `api.md`; descoberta recursiva, pode ter subpastas). Comportamento:

- **Sem frontmatter** → carrega no launch, mesma prioridade do CLAUDE.md (só organização).
- **Com frontmatter `paths:` (globs)** → carrega SÓ quando o Claude mexe em arquivo que casa.

```markdown
---
paths:
  - "src/api/**/*.ts"
  - "tests/api/**"
---
# Regras da API
- Toda rota nova valida a entrada antes de chegar no service
- Erro devolvido ao cliente nunca expõe stack nem SQL
```

Regra que só vale pra uma parte do codebase NÃO pertence ao bloco "Regras Absolutas" do
CLAUDE.md: vira rule path-gated e para de gastar contexto das sessões que não tocam o assunto.

### 2. `@import` vs ponteiro (a armadilha)

- `@docs/project.md` fora de backticks **IMPORTA o arquivo inteiro pro contexto no launch**
  (recursivo até 4 níveis). NÃO é link.
- `` `docs/project.md` `` entre backticks fica literal: o agente lê sob demanda. É o ponteiro
  desta skill.

**Padrão: ponteiro em backtick.** `@import` só pra arquivo pequeno que precisa estar sempre em
contexto (ex.: um `@docs/convencoes.md` de 20 linhas). Importar os docs filhos pesados destrói o
propósito do índice: tudo volta a carregar em toda sessão.

### 3. CLAUDE.md aninhado e `CLAUDE.local.md`

- CLAUDE.md **acima** do cwd carrega no launch; CLAUDE.md em **subdiretório** carrega sob demanda,
  quando o Claude lê arquivos dali. Em monorepo, cada subprojeto pode ter o seu (alternativa
  oficial ao ponteiro manual). `claudeMdExcludes` nas settings pula CLAUDE.md de outros times.
- `CLAUDE.local.md` (raiz do projeto, gitignored) = preferências pessoais, carrega junto do
  CLAUDE.md. Pessoal vai lá, nunca no CLAUDE.md do time.

### 4. Instruções específicas > genéricas (estilo oficial)

- "Rode `npm test` antes de commitar", não "teste suas mudanças"
- "Handlers vivem em `src/api/handlers/`", não "mantenha os arquivos organizados"
- Regras que se contradizem = o agente escolhe uma arbitrariamente; revise periodicamente
  CLAUDE.md, aninhados e `.claude/rules/`

---

## Quando Refatorar um CLAUDE.md Existente

Se o usuário tem um `CLAUDE.md` monolítico, siga esta ordem:

1. **Leia o arquivo completo** e identifique blocos de conteúdo por categoria
2. **Extraia para os arquivos filhos** respeitando as responsabilidades acima
3. **Reduza o CLAUDE.md** para apenas o índice + regras absolutas
4. **Atualize os links** no índice apontando para os novos arquivos
5. **Confirme com o usuário** a estrutura antes de finalizar

---

## Sinais de que a Estrutura Está Degradando

- `CLAUDE.md` passou de 100 linhas (200 é o teto oficial da doc; a adesão degrada antes disso)
- Regra que só vale pra uma parte do codebase morando no CLAUDE.md em vez de `.claude/rules/` path-gated
- `@import` apontando pra doc pesado (tudo carregando em toda sessão de novo)
- O agente está "esquecendo" contexto entre sessões
- Requisitos e estado estão misturados no mesmo arquivo
- O roadmap não tem seção de histórico consolidado
- `state.md` não existe ou nunca é atualizado

---

## Princípios de Manutenção

- **Imutabilidade do histórico:** seção `Consolidado` do roadmap nunca é deletada, apenas cresce
- **state.md é volátil:** único arquivo que pode ser sobrescrito completamente
- **requirements.md é contrato:** mudanças devem ser explícitas, com data se necessário
- **CLAUDE.md é estável:** raramente muda; reflete a identidade permanente do projeto
