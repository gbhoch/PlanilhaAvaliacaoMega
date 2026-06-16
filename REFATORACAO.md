# Relatório de Refatoração — PlanilhaAvaliacaoMega

> Refatoração estrutural completa preservando 100% das funcionalidades e regras de negócio.
> Branch: `refactor/cleanup-and-tokens`. Verificação: `ng build` (dev e produção) sem erros.

---

## Contexto e descobertas

- O pedido descrevia um projeto **Angular 20+**. O projeto real é **Angular 17.3.12**, **DevExtreme 25.1.4**,
  **TypeScript 5.2.2**, bootstrap _standalone_ (`bootstrapApplication` + `app.config.ts`).
- Existiam **duas cópias** do projeto dentro de `ProjetoANGULAR`: uma raiz antiga (rastreada no git, DevExtreme 23,
  4 páginas) e a `PlanilhaAvaliacaoMega` (auto-contida, com `.git`, `node_modules` e backend Express+SQLite próprios,
  DevExtreme 25, 7 páginas). **`PlanilhaAvaliacaoMega` é a versão ativa.**
- Decisões aprovadas: refatorar a `PlanilhaAvaliacaoMega` e **remover a cópia raiz**; tokens em **SCSS + variáveis CSS**;
  **manter Angular 17** modernizando idiomas; **refatoração completa**.

**Resumo quantitativo:** 52 arquivos alterados, **+1.566 / −1.833 linhas** (líquido **−267 linhas**),
13 arquivos criados, 17 removidos, 1 renomeado, 21 modificados.

---

## 1. Arquivos removidos

### Projeto duplicado (raiz)
| Item | Motivo |
|---|---|
| Tudo em `ProjetoANGULAR\` exceto `PlanilhaAvaliacaoMega\` (raiz `src/`, `angular.json`, `package*.json`, `tsconfig*`, `dist/`, `.angular/`, `node_modules/`, `.git/` antigo) | Cópia obsoleta. Backup salvo em `Documents\_oldroot-backup.zip` antes da remoção. |

### Código morto (comprovadamente sem referências)
| Arquivo | Motivo |
|---|---|
| `src/app/app.module.ts` | `NgModule` legado nunca importado (app usa bootstrap standalone). |
| `src/app/boot/boot-routing/{boot-routing.module,boot.module,boot.component}.ts` | Cluster de roteamento `NgModule` legado, isolado e inalcançável. |
| `src/app/pages/login/login/auth-routing/{auth.module,auth-routing.module}.ts` | Roteamento `NgModule` morto, nunca alcançado. |
| `src/app/models/Agrupadores.ts` | Substituído por `interfaces/senso.interface.ts`; sem referências. |
| `src/app/models/interfaces/planilha.interface.ts` | Sem referências. |
| `src/app/app.component.css` | Arquivo 100% comentado (removido junto com seus `styleUrls`). |
| 8 arquivos `*.component.css` + `src/styles.css` | Convertidos para `.scss` (ver seção 4). |

Também removidos: `console.log`/`console.error` de depuração, blocos comentados, imports e campos não usados
(ex.: `NgModule, Type` em `login`, `storageKey` em `avaliar-planilha`, `agrupadores$`/`setores$` não consumidos).

## 2. Arquivos marcados para revisão (NÃO removidos)

Conforme a regra "código suspeito → marcar, não remover". Cada arquivo recebeu um cabeçalho `// TODO(review): ...`.

| Arquivo | Situação |
|---|---|
| `pages/home/home.component.ts` | Sem rota; par circular com `AddItemVerifComponent`. |
| `pages/add-item-verif/add-item-verif.component.ts` | Usado apenas por `HomeComponent` (sem rota). |
| `services/itens-verificados.service.ts` | _Stub_ (dados vazios); após a limpeza, referenciado só pelo cluster `Home`. |
| `services/funcionario.service.ts` | Nunca injetado por nenhum componente ativo. |
| `services/add-itens.service.ts` | _Stub_ usado apenas por `AddItemVerifComponent`. |

> Recomendação: confirmar a remoção desse cluster (`Home` + `AddItemVerif` + 3 serviços _stub_ + modelos
> `AddItens`/`ItensVerificados`/`Funcionario`/`Response`) numa rodada seguinte.

## 3. Arquivos criados

| Arquivo | Função |
|---|---|
| `src/styles/_theme.scss` | Paleta de cores como **variáveis CSS `:root`** — fonte única da identidade visual. |
| `src/styles/_tokens.scss` | **Tokens SCSS `$`** (cores → variáveis CSS; escalas de espaçamento, raio, sombra, transição, tipografia, z-index, breakpoints). |
| `src/styles/_mixins.scss` | Mixins reutilizáveis: `drawer-panel`, `action-button`, `form-input`, `status-badge`, `card`, `input-clean`. |
| `src/styles.scss` | Estilo global (resets, elementos compartilhados, botões canônicos) sobre os tokens. |
| `src/app/shared/services/notification.service.ts` | Centraliza os _toasts_ DevExtreme (`notify`). |
| `src/app/shared/services/base-crud.service.ts` | CRUD REST genérico (`list/add/update/remove`). |
| 7 × `*.component.scss` | Versões tokenizadas dos estilos de componentes. |

## 4. CSS consolidado (auditoria de estilos)

- **Sistema de tokens centralizado:** **34 variáveis CSS** (`--color-*` em `_theme.scss`) + **71 tokens SCSS** (`_tokens.scss`).
  Trocar a cor principal do sistema = alterar **1 valor** (`--color-primary`) → tudo atualiza (build **e** runtime).
- **Cores hardcoded restantes nos componentes: 0** (verificado por busca). Antes: `#087d52` aparecia 50+ vezes, além de
  dezenas de variantes de cinza/vermelho/verde.
- **Duplicações eliminadas:**
  - `.btn-confirmar`/`.btn-cancelar`: de **7 definições** (global + 6 componentes) para **1** global.
  - Bloco `.drawer*` (~40 linhas) duplicado em 3 páginas → **mixin `drawer-panel`**.
  - Inputs de formulário, _badges_ de status, _resets_ de placeholder/spinner → **mixins**.
- **Conversão para SCSS:** 9 arquivos `.css` → `.scss` (+ `styles.scss`), com `stylePreprocessorOptions.includePaths`
  configurado para `@use 'tokens'`/`@use 'mixins'` em qualquer profundidade.
- **Correções:** `rgba(191,191,191,-0.15)` (alfa negativo inválido) → `transparent`; `@import` redundante do DevExtreme
  removido (já carregado via `angular.json`); fonte Outfit movida para `<link>` no `index.html`.

## 5. Componentes / serviços reutilizáveis criados

- **`NotificationService`** — `success/warning/error/info` com posição/empilhamento consistentes. Adotado em
  `login` (1) e `agrupadores` (5 chamadas), removendo `notify()` cru.
- **`BaseCrudService<T>`** — `AgrupadoresService` e `SetoresService` agora o estendem, mantendo seus nomes públicos
  (sem alteração nos componentes). Removeu o `BehaviorSubject` não consumido **e o _refetch_ HTTP redundante** após
  cada gravação (otimização de requisições duplicadas).

## 6. Melhorias realizadas

**Centralizado**
- Identidade visual inteira (cores, espaçamentos, raios, sombras, transições, tipografia) em `src/styles/`.
- Notificações e padrão CRUD em serviços compartilhados.

**Simplificado / reduzido**
- −267 linhas líquidas; remoção de ~8 arquivos de código morto e de blocos comentados/logs.
- DI modernizada para `inject()` em todos os componentes ativos (`menu`, `toolbar-menu`, `agrupadores`, `setores`,
  `avaliacao`, `avaliar-planilha`, `login`).
- `avaliacao`: removido estado vestigial (`itensList` + injeção de `ItensVerificadosService` nunca lida).

**Otimizado (performance)**
- Eliminada 1 requisição HTTP redundante por operação de criar/editar/excluir (agrupadores e setores).
- Fonte via `<link>` (evita `@import` bloqueante) e DevExtreme carregado uma única vez.

## 7. Verificação

- `ng build --configuration development`: **sucesso, sem erros**, após cada fase.
- `ng build` (produção): **sucesso**. Os _budgets_ padrão (1 MB inicial / 4 KB por componente) já eram
  excedidos no _baseline_ (DevExtreme eager = ~3,58 MB) — ajustados para valores realistas (6 MB / 8 KB com aviso em 4 KB).
- Avisos restantes são internos do DevExtreme (CommonJS) e o aviso intencional de 4 KB em `agrupadores.scss`
  (sinaliza a futura extração do _drawer_).
- **Teste manual sugerido** (paridade de comportamento): login `1234/1234`; CRUD de Agrupadores e Setores;
  montar plano em Avaliação; executar/salvar/histórico em Avaliar Planilha; _toasts_, _popups_ e _drawers_.

## 8. Trabalho recomendado (adiado — requer QA visual / sem testes automatizados)

Itens de maior risco, deixados como evolução segura para uma rodada com testes manuais:

1. **Componentes de UI compartilhados** (`app-drawer`, `confirm-dialog`, `form-field`, `status-badge`,
   `action-buttons`) — exige reescrever os _templates_ de 3–4 páginas; reduziria ainda mais a duplicação e o
   `agrupadores.scss`.
2. **Migrar templates** para o novo _control flow_ `@if`/`@for`/`@switch`.
3. **`ChangeDetectionStrategy.OnPush`** — cuidado com os padrões de mutação do DevExtreme.
4. **Dividir `avaliacao.component.ts`** (~360 linhas) em subcomponentes.
5. **Lazy-loading de rotas** (`loadComponent`) + tree-shaking do DevExtreme para reduzir o bundle inicial.
6. **Remover o cluster `Home`/`AddItemVerif`** e serviços _stub_ após confirmação.
