# Portfólio da Agata — Terminal Scrollytelling

**Status:** aprovado para planejamento
**Data:** 2026-07-23

## 1. Objetivo

Portfólio de página única para Agata Domingues (Backend Software Engineer). O visitante rola a página e vê um mockup de laptop com um terminal que "digita" sozinho o currículo dela — resumo, skills, experiência, formação, contato — sincronizado com a posição do scroll (scrubber, não autoplay solto). Ao final, o terminal vira interativo e aceita comandos reais.

Tema (terminal) escolhido deliberadamente por combinar com o perfil dela: backend engineer, forte em Go/Java, com destaque em AI-assisted engineering no currículo.

## 2. Stack & arquitetura

- **Next.js (App Router) + TypeScript + Tailwind CSS**
- **Framer Motion** (`useScroll` + `useTransform`) para ligar scroll ↔ progresso de digitação via motion values (evita re-render por pixel de scroll)
- Página única (`/`), sem rotas extras
- Restaurar o scaffold Next.js que existe no commit inicial (`584f03d`) mas foi apagado da working tree, e construir em cima dele
- Deploy alvo: Vercel

## 3. Fonte única de conteúdo

Todo o texto vem de `src/content/resume.ts`, tipado, reaproveitado tanto pelas cenas do scroll quanto pelo terminal interativo (conteúdo nunca diverge entre os dois modos) e pela seção de fallback em texto (§8).

```ts
type ExperienceEntry = {
  company: string;
  role: string;
  period: string;
  bullets: string[];
};

type ResumeData = {
  name: string;
  title: string;
  location: string;
  email: string;
  linkedinUrl: string; // placeholder até Agata enviar o link real
  githubUrl: string;   // placeholder até Agata enviar o link real
  summary: string;
  skills: { category: string; items: string[] }[];
  experience: ExperienceEntry[];
  education: { degree: string; school: string; period: string }[];
  certifications: string[];
  languages: { name: string; level: string }[];
};
```

- Telefone **não** entra no site público (risco de scraping/spam) — só email + LinkedIn/GitHub.
- LinkedIn e GitHub ficam como placeholder (`"#"` ou similar, com comentário `TODO`) até Agata fornecer as URLs reais.
- Conteúdo do site em **inglês**, igual ao CV original (mira recrutadores internacionais / Mercado Libre).

## 4. Cenas do scroll

7 cenas, cada uma um "comando" digitado no terminal:

| # | Cena | Comando | Conteúdo |
|---|------|---------|----------|
| 1 | Intro | `whoami` | Resumo profissional |
| 2 | Skills | `cat skills.txt` | Core competencies (linguagens, backend/arquitetura, AI-assisted engineering, cloud/dados, DBs, práticas) |
| 3 | Experience · Mercado Libre | `cat experience/mercado-libre.md` | Cargo atual, bullets |
| 4 | Experience · Conecta Marketplaces | `cat experience/conecta.md` | Bullets |
| 5 | Experience · Techmillen | `cat experience/techmillen.md` | Bullets |
| 6 | Background | `cat education.md` | Educação + certificações + idiomas juntos (fatos rápidos, não justificam cena própria cada um) |
| 7 | Contact | `cat contact.txt` | Email + LinkedIn + GitHub |

Ao fim da cena 7 o scroll "solta" o pin e o próximo bloco da página é o terminal interativo (§7).

## 5. Mecânica do scrubber

- Container alto (`steps.length * STEP_PX`, com `STEP_PX` uma constante ajustável, ponto de partida ~70–90px por step) envolve todas as 7 cenas; o mockup do laptop fica **sticky** centralizado na viewport enquanto esse container rola.
- O roteiro de cada cena é decomposto em **steps discretos**:
  1. Um step de "comando digitado" (o prompt, ex.: `whoami`) — anima caractere a caractere (strings curtas, barato).
  2. Um step por linha de output revelada (a resposta do comando) — cada linha aparece de uma vez (sem digitar caractere a caractere o corpo do currículo inteiro; mantém o scroll leve e o mapeamento simples).
- `scrollYProgress` do container (0→1) mapeia linearmente para o índice de step global (via `useTransform`); a parte fracionária do índice dirige a sub-animação do step atual (digitação do comando, ou fade/slide da linha de output).
- Sem `clear` no meio: o terminal se comporta como `tail -f` — mostra sempre as últimas ~10–12 linhas visíveis, empurrando as antigas pra fora. Isso faz o scroll pra trás ("undigitar") funcionar sem inconsistência de estado.
- Indicador lateral (desktop, oculto no mobile): lista as 7 cenas, destaca a atual (derivada do step index → scene id), clicável para pular direto pra cena (scroll programático até o offset correspondente).
- `prefers-reduced-motion: reduce`: desativa a digitação caractere-a-caractere e o stagger de linhas — cada cena mostra seu conteúdo já completo assim que entra no range de steps correspondente. A transição *entre* cenas continua acompanhando o scroll.

## 6. Visual

- **Mockup de laptop:** silhueta minimalista (moldura de tela + base/dobradiça simples), sem foto realista — leve e rápido, consistente com o estilo "moderno".
- **Terminal:** dark theme estilo VS Code/iTerm2 — fundo quase preto, texto cinza-claro, destaque sutil de sintaxe (prompt em azul, chaves/keys em roxo, valores/strings em laranja, comentários em cinza-esverdeado), cursor piscando no fim da linha ativa.
- Barra de título do terminal com os 3 pontos de semáforo (fechar/minimizar/maximizar) só decorativos.

## 7. Terminal interativo (pós-scroll)

Depois da cena "Contact", o prompt vira real (input controlado por teclado). Comandos:

- `help` — lista os comandos disponíveis
- `about` — resumo profissional
- `skills` — competências
- `experience` — as 3 experiências, condensadas
- `education` — educação + certificações + idiomas
- `contact` — email + LinkedIn + GitHub
- `clear` — limpa o buffer visível
- `sudo hire agata` — easter egg (resposta bem-humorada de confirmação)
- comando não reconhecido → `command not found: <cmd> — type 'help' to see available commands`

Reaproveita `resume.ts` — mesmo texto das cenas de scroll, só que sob demanda.

## 8. Mobile (< 768px)

- O mockup de laptop **some**; o terminal ocupa a tela cheia (sem moldura de PC ao redor), mantendo a mesma barra de título.
- A lógica de steps/scrubber é a mesma (component compartilhado) — só troca o wrapper visual (com laptop vs. sem laptop).
- Indicador lateral de cenas fica oculto (não cabe); a orientação de progresso nesse caso é só o próprio conteúdo do terminal.

## 9. Acessibilidade / fallback em texto

- Link discreto fixo (ex.: canto superior) — "Skip intro · view résumé as text" — pula via anchor (`#resume`) para uma seção no fim da mesma página com o currículo completo em HTML semântico (`h2`/`h3`/`ul`), sem animação, gerada a partir do mesmo `resume.ts`.
- Por ser Next.js com SSR, esse conteúdo já existe no HTML inicial independente de JS/animação — serve tanto como rede de segurança pra quem quer escanear rápido quanto como conteúdo acessível pra leitor de tela.
- `prefers-reduced-motion` tratado conforme §5.

## 10. Testes

- Ênfase em verificação manual: rodar `next dev`, conferir a jornada de scroll (scrub pra frente/trás), breakpoint mobile, `prefers-reduced-motion` ligado, navegação por teclado do terminal interativo e do link de skip.
- Unit test leve (Vitest) só pro parser de comandos do terminal interativo (`help`, `about`, comando desconhecido, etc.) — é lógica pura e barata de testar. Não vale a pena testar unitariamente a mecânica de scroll/animação (baixo valor, alto custo).

## 11. Fora de escopo (por ora)

- URLs reais de LinkedIn/GitHub — ficam como placeholder até Agata enviar.
- Telefone público.
- Rotas extras além da página única.
- Internacionalização (toggle EN/PT) — site fica só em inglês.
