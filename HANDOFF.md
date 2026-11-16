# Handoff: Terminal scrollytelling portfolio for Agata — built, public, ready to deploy

**Data:** 2026-07-24
**Status:** Em andamento (falta só conectar o deploy na Cloudflare)

---

## 1. Objetivo

Construir um portfólio de página única para Agata Domingues (Backend Software
Engineer) com uma pegada bem ambiciosa: um mockup de laptop (celular no
mobile) com um terminal dentro que "digita" o currículo dela sincronizado ao
scroll, depois vira um terminal interativo de verdade. O tema terminal foi
escolhido porque combina com o perfil dela (backend, Go, forte em
AI-assisted engineering). O repo está público e o site já builda 100%
estático — falta só ligar no Cloudflare.

## 2. Contexto essencial

**Stack técnica:**
- Next.js 16 (App Router) + TypeScript + React 19
- Tailwind CSS v4 (config 100% em CSS, `@theme inline` em `globals.css` — **não** existe `tailwind.config.ts`, não criar um)
- Framer Motion (`useScroll`/`useTransform`) para o scroll-scrubbing
- Vitest para os testes (43 passando)
- npm como package manager
- `output: "export"` no `next.config.ts` — o site inteiro é estático (sem SSR/API routes), builda pra pasta `out/`

**Repositórios:**
- Este projeto: `/Users/xiskg/git-projects/agata-portfolio`, público em **https://github.com/xiskg/agata-portfolio**, branch `main`
- Portfólio pessoal do usuário (referência de convenção de deploy): `~/git-projects/portfolio-react` → repo `xiskg/personal-website`, Vite+React, deploy via Cloudflare Workers Static Assets (`wrangler.jsonc`, sem CLI wrangler instalado, sem script de deploy no `package.json` — deploy provavelmente via dashboard da Cloudflare com git integration)

**Decisões já tomadas e por quê:**
- **Sem telefone público** — `cv_agata.pdf` (o PDF original, tem o telefone dela) está no `.gitignore`, nunca foi commitado. Se receber um PDF de currículo atualizado, não commitar.
- **Java removido de tudo** — a Agata vai atualizar isso no currículo real também. Não reintroduzir menções a "Java" (mas "JavaScript" é outra coisa, não mexer).
- **Inglês no conteúdo do site**, conversa com o usuário em português — decisão deliberada, currículo original já era em inglês.
- **CRT vibe em CSS puro, não WebGL** — o usuário usa 3 shaders `.glsl` empilhados no Ghostty dele (`~/.config/ghostty/shaders/bettercrt.glsl`, `glow-rgbsplit-twitchy.glsl`, `retro-tint.glsl`). Ele escolheu explicitamente (via pergunta com trade-off) recriar a "vibe" em CSS (scanlines, vinheta, glow, glitch RGB periódico) em vez de portar os shaders reais pra WebGL, pra manter o texto do currículo legível/selecionável/acessível.
- **Fundir o terminal interativo no MESMO mockup** em vez de um card separado abaixo — o usuário achou a versão anterior (terminal solto) menos imersiva.
- **Lowercase só no screensaver, não no currículo** — tentei `text-transform: lowercase` no `body` inteiro primeiro, o usuário corrigiu: só o screensaver (gatinho ASCII/Catan/viagem) deve ficar em minúsculo, o currículo mantém capitalização normal.
- **Celular no mobile em vez de layout "sem chrome"** — o usuário pediu um mockup de celular de verdade (bordas arredondadas, notch, home indicator) centralizado, maior (340px), já que no mobile não tem menu lateral disputando espaço.

**Preferências de trabalho do usuário:**
- Prefere que eu implemente direto com bom senso e mostre o resultado, em vez de ficar perguntando demais em pedidos criativos pequenos — só pergunta quando há trade-off real e não óbvio (ex: CSS vs WebGL).
- Sempre testar visualmente com Playwright antes de dizer que algo funciona — esse foi o padrão da sessão inteira (não tem `chromium-cli` disponível neste ambiente).
- Comunicação em português, tom casual-direto ("chefe", "Boa!"), respostas concisas.

## 3. O que já foi feito

- ✅ Brainstorming → spec (`docs/superpowers/specs/2026-07-23-terminal-portfolio-design.md`) → plano de 13 tarefas (`docs/superpowers/plans/2026-07-23-terminal-portfolio-plan.md`) → execução via subagentes, revisão final de branch, merge pra `main`.
- ✅ Arquitetura base: `resume.ts` (fonte única de conteúdo) → `script.ts` (7 cenas → lista de steps) → `stepMath.ts` (progresso de scroll → step index) → `renderVisibleLines.ts` (step index → linhas visíveis) → componentes React.
- ✅ Terminal interativo (`commands.ts`): `help`, `about`, `skills`, `experience`, `education`, `contact`, `clear` + easter eggs `sudo hire agata`, `neofetch` (gatinha ASCII + specs pessoais), `cats` (Pimpi & Cora), `fortune` — todos listados no `help` como "Extras".
- ✅ Links reais preenchidos: LinkedIn `https://www.linkedin.com/in/agatadominguesfarias/`, GitHub `https://github.com/htadmg` (abrem em nova aba no fallback de texto).
- ✅ Digitação caractere-a-caractere contínua em TODAS as linhas (não só o comando) — corrigiu sensação de scroll "travado".
- ✅ Rich text no terminal (`classifyLine.ts` + `TerminalOutputLine.tsx`): headers/campos/bullets/texto secundário com cores tipo syntax-highlight (roxo/laranja/azul) — resolveu a "parede de texto branco".
- ✅ Altura do mockup fixa (320px, `overflow-hidden` + `flex-col justify-end`) — parava de esticar.
- ✅ Intro resumida (`summaryShort` em `resume.ts`) só pra cena de scroll — o comando `about` e o fallback em texto continuam com o resumo completo.
- ✅ Terminal interativo fundido no MESMO mockup (removido `InteractiveTerminal.tsx` avulso) — zona de "dwell" extra no fim do scroll onde o laptop continua fixo aceitando input; hint "Type a command..." também digita caractere a caractere (step virtual extra).
- ✅ Auto-focus no input ao entrar na fase interativa (só em telas ≥768px, não no mobile pra não abrir teclado no meio do scroll).
- ✅ Animação de abertura: laptop fechado + centralizado no load, "Scroll to begin" + seta com nudge suave (não bounce — trocado por pedido do hook de design), screensaver cicla 4 quadros ASCII (gatinha acordada/dormindo, Catan, viagem) a cada 3.5s.
- ✅ CRT vibe em CSS (`crt-glow` + `crt-glow-glitch` em `globals.css`, overlays de scanline/vinheta/tint em `TerminalWindow.tsx`) inspirado nos shaders reais do Ghostty do usuário.
- ✅ Lowercase só no screensaver (não no currículo — corrigido depois de um primeiro try errado no `body` inteiro).
- ✅ Repo público criado e populado: **https://github.com/xiskg/agata-portfolio**.
- ✅ Deploy prep: `output: "export"` + `wrangler.jsonc` (Cloudflare Workers Static Assets, `assets.directory: "out"`) — testado localmente (build + `serve out` + Playwright, hidrata e funciona).
- ✅ Mobile: mockup de celular de verdade (não só "sem chrome") — laptop bezel em `md:`, celular abaixo disso — centralizado, 340px, com bug de centralização corrigido (a margem reservada pro menu lateral aplicava até no mobile onde o menu nem aparece).
- ✅ Java removido de todo o conteúdo (resume.ts, neofetch, metadata) — JavaScript intacto.
- ✅ Favicon SVG com gatinha ASCII (`src/app/icon.svg`), testado legível até 16x16. Metadados Open Graph + Twitter Card + `theme-color` escuro adicionados.
- ❌ Nada foi descartado de fato — a única "não-escolha" foi o WebGL/GLSL real pros shaders (o usuário escolheu explicitamente a via CSS em vez disso, não é um descarte de trabalho feito, é uma decisão de escopo).

## 4. Estado atual

- **O que funciona:** tudo. 43 testes passando, `npm run build` limpo, export estático (`out/`) verificado rodando local (hidratação, scroll-scrub, terminal interativo, tudo ok, zero erros de console).
- **O que está incompleto:** o deploy em si na Cloudflare **não foi feito** — só preparado (`wrangler.jsonc` + export estático prontos). Ninguém rodou `wrangler deploy` nem conectou o repo no dashboard da Cloudflare ainda.
- **Última ação tomada:** commit `31e4579` ("Replace favicon with an ASCII-cat SVG; round out site metadata") — pushed pra `main`. Working tree limpo, só `cv_agata.pdf` untracked (propositalmente, está no `.gitignore`).
- **Servidor de dev:** não está rodando (matei o processo na porta 3000 antes do último commit).

## 5. Próximos passos

1. **Decidir e executar o deploy na Cloudflare.** Duas opções, perguntar ao usuário qual prefere:
   - Conectar `xiskg/agata-portfolio` no dashboard da Cloudflare (Workers & Pages → conectar ao Git), build command `npm run build`, usando o `wrangler.jsonc` já commitado — igual ao fluxo do `personal-website` dele.
   - Ou rodar `npx wrangler deploy` direto daqui (precisa confirmar se há autenticação Cloudflare disponível neste ambiente — `wrangler` não está instalado nem localmente nem globalmente, e não foi testado se há credenciais).
2. Se quiser, considerar `metadataBase` em `layout.tsx` (só necessário se algum dia adicionarem uma imagem de Open Graph — hoje o OG é só título/descrição, sem imagem).
3. Nenhum outro pedido de feature está pendente — todos os pedidos explícitos da sessão foram implementados e confirmados visualmente.

## 6. Perguntas em aberto

- [ ] Deploy via dashboard da Cloudflare (git integration) ou via `wrangler deploy` direto desta sessão?
- [ ] Quer um domínio customizado depois de deployado, ou fica no subdomínio padrão `*.workers.dev`?
- [ ] Vale a pena criar uma imagem de Open Graph (preview visual ao compartilhar o link) ou o card só-texto atual já resolve?

## 7. Artefatos relevantes

### Arquivos-chave da arquitetura

- `src/content/resume.ts` — fonte única do conteúdo (nome, `summary` completo, `summaryShort` pra intro, skills, experience, education, certifications, languages, `linkedinUrl`/`githubUrl` reais, **sem campo de telefone**)
- `src/components/terminal/script.ts` — `buildScenes`/`buildSteps`/`getSceneStartOffsets` (7 cenas do currículo → lista plana de steps)
- `src/components/terminal/stepMath.ts` — `progressToStepIndex` (scroll progress → step index, puro)
- `src/components/terminal/renderVisibleLines.ts` — `getVisibleLines`/`currentSceneId` (agora digita comando E output caractere a caractere)
- `src/components/terminal/classifyLine.ts` + `TerminalOutputLine.tsx` — classificador de rich text (header/field/bullet/meta/text) + renderização colorida
- `src/components/terminal/commands.ts` — parser do terminal interativo (`runCommand`), inclui os easter eggs
- `src/components/terminal/ScrollTerminal.tsx` — orquestrador principal: fase de abertura (`OPEN_STEPS`), playback do currículo, step do hint, terminal interativo fundido, revelação do menu lateral, auto-focus
- `src/components/terminal/LaptopMockup.tsx` — chrome responsivo (laptop em `md:`, celular abaixo disso)
- `src/components/terminal/TerminalWindow.tsx` — chrome compartilhado do terminal (altura fixa 320px, overlay de CRT)
- `src/components/terminal/LandingCover.tsx` — screensaver do laptop fechado (4 quadros ASCII cíclicos)
- `src/components/terminal/ScrollHint.tsx` — "Scroll to begin" + seta
- `src/components/ResumeFallback.tsx` + `src/components/SkipLink.tsx` — fallback acessível em texto puro
- `src/app/layout.tsx` — metadata (OG/Twitter/theme-color)
- `src/app/icon.svg` — favicon da gatinha ASCII
- `wrangler.jsonc` + `next.config.ts` — prep de deploy Cloudflare

### Comandos relevantes

Criação do repo público (já executado):
```bash
gh repo create agata-portfolio --public --source=. --remote=origin \
  --description "Terminal scrollytelling portfolio for Agata Domingues — Backend Software Engineer" \
  --push
```

Rodar localmente:
```bash
npm run dev              # dev server
npm test                 # 43 testes (vitest)
npm run build             # gera out/ (static export)
npx serve out -l 4173     # servir o export estático localmente pra testar
```

Matar servidor preso na porta 3000 antes de reiniciar:
```bash
lsof -ti:3000 -sTCP:LISTEN | xargs -r kill
```

### `wrangler.jsonc` (deploy Cloudflare, já commitado)

```jsonc
{
  // Cloudflare Workers (Static Assets) — deploy do portfólio estático da Agata.
  // Next.js roda com `output: "export"` (next.config.ts), sem SSR/servidor Node;
  // é só HTML/CSS/JS estático, igual ao personal-website.
  "name": "agata-portfolio",
  "compatibility_date": "2026-07-24",
  "compatibility_flags": ["nodejs_compat"],
  "assets": {
    "directory": "out",
    "not_found_handling": "404-page"
  }
}
```

### `next.config.ts`

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
};

export default nextConfig;
```

## 8. Instruções pra próxima sessão

- **Tom:** direto, técnico mas casual-amigável (o usuário chama de "chefe", usa "Boa!" com frequência). Respostas curtas, sem cerimônia, sem repetir de volta o que ele já disse.
- **Nível técnico do usuário:** alto — entende trade-offs de engenharia (CSS vs WebGL, git worktrees, Cloudflare Workers vs Pages), não precisa de explicações básicas.
- **Armadilhas a evitar:**
  - Não reintroduzir "Java" no conteúdo (mas não mexer em "JavaScript").
  - Não commitar `cv_agata.pdf` nem qualquer PDF de currículo com dados pessoais sensíveis (telefone).
  - Não aplicar `text-transform: lowercase` fora do escopo do screensaver (`LandingCover.tsx`) — já foi tentado global e revertido a pedido do usuário.
  - Sempre matar o processo na porta 3000 antes de reiniciar `npm run dev`.
  - `playwright` não está instalado no projeto — os scripts de QA rodam a partir da pasta scratchpad da sessão (instalado ali via `npm install playwright` local). Numa sessão nova, provavelmente precisa reinstalar lá ou achar outro jeito de testar visualmente.
- **Contexto útil:** o usuário tem um portfólio pessoal (`~/git-projects/portfolio-react`, repo `xiskg/personal-website`) que serviu de referência pro esquema de deploy Cloudflare — útil consultar se precisar confirmar alguma convenção (ele não tem `wrangler` CLI instalado nem local nem global, então o deploy dele provavelmente é via dashboard/git-integration, não CLI manual).
- Se o usuário disser que atualizou o CV real, oferecer pra reler o PDF novo e sincronizar `resume.ts` (mas lembrar de não deixar o PDF no repo).
