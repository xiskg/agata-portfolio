# Agata Portfolio — Terminal Scrollytelling Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a single-page Next.js portfolio where scrolling scrubs a terminal (inside a laptop mockup) through Agata Domingues's résumé, then hands off to a real interactive terminal, with mobile and accessibility fallbacks.

**Architecture:** A tall, `position: sticky`-pinned scroll container maps `scrollYProgress` (Framer Motion) to a fractional "step index" over a flat list of typing/reveal steps generated from a single typed résumé data file. Pure, unit-tested functions do all the step math and line-rendering logic; React components only wire that output to JSX. Below the pinned section, a real interactive `<input>`-driven terminal and a plain-HTML résumé section reuse the same data file.

**Tech Stack:** Next.js 16 (App Router) + TypeScript + React 19, Tailwind CSS v4 (already configured via `@tailwindcss/postcss`, no `tailwind.config.ts` needed), Framer Motion (`useScroll`/`useTransform`), Vitest for unit tests, npm.

## Global Constraints

- Site content is in **English** (matches the source CV, targets international/LatAm recruiters).
- **No phone number** anywhere on the site — only email, LinkedIn, GitHub.
- LinkedIn and GitHub URLs are **placeholders** (`"#"`) with a `// TODO` comment until Agata provides the real links — every task that touches `resume.ts` must preserve this.
- Mobile breakpoint is **768px** — use Tailwind's `md:` prefix (not `lg:`) for every desktop/mobile split.
- Respect `prefers-reduced-motion`: no character-by-character typing or line-stagger when it's set.
- Package manager is **npm** (`package-lock.json` already present in the restored scaffold).
- Tailwind v4 config lives in CSS (`@theme inline` in `globals.css`) — do not create a `tailwind.config.ts`.
- Path alias `@/*` → `./src/*` already exists in `tsconfig.json` — use it in all new imports.

---

### Task 1: Restore the Next.js scaffold and set the dark terminal baseline

**Files:**
- Restore (via `git checkout`): `.gitignore`, `CLAUDE.md`, `README.md`, `eslint.config.mjs`, `next.config.ts`, `package-lock.json`, `package.json`, `postcss.config.mjs`, `public/favicon.ico`, `src/app/globals.css`, `src/app/layout.tsx`, `src/app/page.tsx`, `tsconfig.json`
- Delete: `public/file.svg`, `public/globe.svg`, `public/next.svg`, `public/vercel.svg`, `public/window.svg` (unused Create-Next-App boilerplate assets)
- Modify: `package.json`, `src/app/globals.css`
- Create: `vitest.config.ts`, `src/sanity.test.ts` (temporary smoke test, removed in Step 8)

**Interfaces:**
- Produces: a working `npm run dev` / `npm run build` / `npm test` toolchain that every later task depends on.

- [ ] **Step 1: Restore the deleted scaffold files from git history**

These files were deleted from the working tree but are still committed at `HEAD` (commit `584f03d`/`f19b459`), so a plain checkout brings them back:

```bash
git checkout HEAD -- .gitignore CLAUDE.md README.md eslint.config.mjs next.config.ts package-lock.json package.json postcss.config.mjs public/favicon.ico src/app/globals.css src/app/layout.tsx src/app/page.tsx tsconfig.json
git status
```

Expected: the 13 paths above show as staged (restored), no longer "deleted".

- [ ] **Step 2: Remove unused default assets**

```bash
git rm -f public/file.svg public/globe.svg public/next.svg public/vercel.svg public/window.svg
```

Expected: the 5 files are staged for deletion.

- [ ] **Step 3: Install dependencies and add the two new libraries**

```bash
npm install
npm install framer-motion
npm install -D vitest
```

Expected: `node_modules/` is populated, `package.json` now lists `framer-motion` under `dependencies` and `vitest` under `devDependencies`.

- [ ] **Step 4: Add a `test` script to `package.json`**

Open `package.json` and add `"test": "vitest run"` to the `scripts` block, so it reads:

```json
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint",
    "test": "vitest run"
  },
```

- [ ] **Step 5: Add `vitest.config.ts` with the `@/*` alias**

```ts
import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    environment: "node",
  },
});
```

- [ ] **Step 6: Add a temporary smoke test to verify the toolchain**

Create `src/sanity.test.ts`:

```ts
import { describe, expect, it } from "vitest";

describe("toolchain sanity check", () => {
  it("runs a basic assertion", () => {
    expect(1 + 1).toBe(2);
  });
});
```

Run: `npm test`
Expected: 1 file, 1 test, PASS.

- [ ] **Step 7: Set the fixed dark terminal theme**

Replace the contents of `src/app/globals.css`:

```css
@import "tailwindcss";

:root {
  --background: #0c0c10;
  --foreground: #d4d4dc;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
}

body {
  background: var(--background);
  color: var(--foreground);
  font-family: var(--font-sans), Arial, Helvetica, sans-serif;
}
```

This removes the old `prefers-color-scheme` light/dark toggle — the site is always dark, matching the terminal aesthetic, regardless of OS theme.

- [ ] **Step 8: Verify the build, then remove the temporary smoke test**

```bash
npm run build
rm src/sanity.test.ts
```

Expected: `npm run build` completes with no errors (still rendering the default Create-Next-App homepage — that's expected, it gets replaced in Task 13).

- [ ] **Step 9: Commit**

```bash
git add .gitignore CLAUDE.md README.md eslint.config.mjs next.config.ts package-lock.json package.json postcss.config.mjs public/favicon.ico src/app/globals.css src/app/layout.tsx src/app/page.tsx tsconfig.json vitest.config.ts
git commit -m "$(cat <<'EOF'
Restore Next.js scaffold, add framer-motion/vitest, set dark theme baseline

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 2: Résumé content data

**Files:**
- Create: `src/content/resume.ts`

**Interfaces:**
- Produces: `resume: ResumeData` and the types `ResumeData`, `SkillGroup`, `ExperienceEntry`, `EducationEntry`, `LanguageEntry` — every later task (`script.ts`, `commands.ts`, `ResumeFallback.tsx`) imports `resume` from `@/content/resume`.

- [ ] **Step 1: Create the typed résumé data file**

Create `src/content/resume.ts`:

```ts
export type SkillGroup = {
  category: string;
  items: string[];
};

export type ExperienceEntry = {
  company: string;
  role: string;
  period: string;
  bullets: string[];
};

export type EducationEntry = {
  degree: string;
  school: string;
  period: string;
};

export type LanguageEntry = {
  name: string;
  level: string;
};

export type ResumeData = {
  name: string;
  title: string;
  location: string;
  email: string;
  linkedinUrl: string;
  githubUrl: string;
  summary: string[];
  skills: SkillGroup[];
  experience: ExperienceEntry[];
  education: EducationEntry[];
  certifications: string[];
  languages: LanguageEntry[];
};

export const resume: ResumeData = {
  name: "Agata Domingues",
  title: "Backend Software Engineer",
  location: "Brazil",
  email: "agatadominguestech@gmail.com",
  linkedinUrl: "#", // TODO: replace with Agata's real LinkedIn URL
  githubUrl: "#", // TODO: replace with Agata's real GitHub URL
  summary: [
    "Backend Software Engineer with 3+ years of experience designing and maintaining scalable, high-availability systems for large-scale marketplace and B2B platforms.",
    "Currently building distributed services in Go and Java at Mercado Libre, Latin America's largest e-commerce and fintech company, integrating REST APIs, message-queue pipelines, and cloud data warehousing to support high-volume B2B operations.",
    "Embeds AI (Claude) across the full development lifecycle, from design and specs to implementation, code review, and CI/CD, to ship faster without compromising quality.",
    "Skilled in microservices architecture, API and SDK design, and relational database optimization, with a proven ability to improve system performance and reliability.",
  ],
  skills: [
    {
      category: "Languages & Frameworks",
      items: ["Go (Golang)", "Java", "C# / .NET", "Python", "JavaScript", "SQL"],
    },
    {
      category: "Backend & Architecture",
      items: [
        "Microservices",
        "Distributed Systems",
        "RESTful API Design & Integration",
        "SDK Development",
        "Event-Driven Architecture & Message Queues",
        "Authentication & Authorization",
      ],
    },
    {
      category: "AI-Assisted Engineering",
      items: [
        "LLM-integrated development workflows (Claude)",
        "AI-augmented code review & CI/CD",
        "AI-assisted technical writing (RFCs, PRDs, implementation specs)",
      ],
    },
    {
      category: "Cloud & Data",
      items: ["Google BigQuery", "Fury (internal PaaS)", "CI/CD Pipelines", "Docker", "Observability & Monitoring"],
    },
    {
      category: "Databases",
      items: ["MySQL", "SQL Server", "PostgreSQL"],
    },
    {
      category: "Practices & Collaboration",
      items: [
        "Agile / Scrum",
        "Git & GitHub",
        "Code Review",
        "Unit & Integration Testing",
        "Cross-Functional Collaboration",
      ],
    },
  ],
  experience: [
    {
      company: "Mercado Libre",
      role: "Backend Software Developer",
      period: "11/2024 – Present",
      bullets: [
        "Develop and maintain B2B backend services in Go and Java, supporting high-throughput operations across one of Latin America's largest technology ecosystems.",
        "Design and integrate RESTful APIs and SDKs consumed by internal teams and external partners, standardizing contracts and improving developer experience.",
        "Build event-driven data pipelines using message queues and Google BigQuery to process and analyze large-scale transactional data.",
        "Integrate AI (Claude) across the full software development lifecycle, from drafting RFCs, PRDs, and implementation specs to daily development, automated code review, and CI/CD pipelines.",
        "Deploy and operate services on Fury, Mercado Libre's internal microservices platform, ensuring scalability, observability, and reliability.",
        "Optimize MySQL queries and data-access layers, reducing average endpoint response times by ~25%.",
        "Work within an Agile squad, contributing to code reviews, sprint planning, and continuous delivery.",
      ],
    },
    {
      company: "Conecta Marketplaces",
      role: "Systems Analyst & Backend Developer",
      period: "05/2024 – 10/2024",
      bullets: [
        "Built a robust integration with the Mercado Libre API using Python and Flask, covering billing management, order search and tracking, and listing price consultation/updates.",
        "Implemented a secure user login and authentication system, strengthening platform security and usability.",
        "Automated listing maintenance and pricing workflows, contributing to a 10% increase in clients' daily revenue.",
      ],
    },
    {
      company: "Techmillen Consultoria e Projetos",
      role: "Systems Analyst & Developer",
      period: "06/2023 – 05/2024",
      bullets: [
        "Developed a full management application for beauty salons using C# and .NET, with a responsive Bootstrap interface and enhanced interactivity via jQuery.",
        "Delivered features for appointment scheduling, client and employee management, and service catalogs, streamlining day-to-day business operations.",
        "Reduced data-processing time by 15% through improved database management and optimized SQL queries.",
      ],
    },
  ],
  education: [
    {
      degree: "Postgraduate Specialization in Computer Engineering",
      school: "UNINTER",
      period: "04/2026 – 12/2026",
    },
    {
      degree: "Associate Degree (CST) in Systems Analysis and Development",
      school: "UNINTER",
      period: "03/2023 – 10/2025",
    },
  ],
  certifications: [
    "Mercado Libre API Integration",
    "C#: Object-Oriented Programming, MVC Development, Windows Forms",
    "Microsoft SQL Server 2022: SQL Fundamentals & CRUD Operations",
    "HTML & CSS: Web Accessibility, Mobile First, Development Environments",
    "Git & GitHub: Repositories, Commits & Version Control",
  ],
  languages: [
    { name: "Portuguese", level: "Native" },
    { name: "English", level: "Professional Working Proficiency" },
    { name: "Spanish", level: "Intermediate" },
  ],
};
```

- [ ] **Step 2: Verify it type-checks**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/content/resume.ts
git commit -m "$(cat <<'EOF'
Add typed résumé content data

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 3: Terminal step-script builder

**Files:**
- Create: `src/components/terminal/types.ts`
- Create: `src/components/terminal/script.ts`
- Test: `src/components/terminal/script.test.ts`

**Interfaces:**
- Consumes: `resume` from `@/content/resume` (Task 2).
- Produces: `Scene` and `Step` types; `buildScenes(): Scene[]`, `buildSteps(scenes: Scene[]): Step[]`, `getSceneStartOffsets(scenes: Scene[], stepPx: number): Record<string, number>` — consumed by Task 5 (`renderVisibleLines.ts`) and Task 9 (`ScrollTerminal.tsx`).

- [ ] **Step 1: Define the `Scene`/`Step` types**

Create `src/components/terminal/types.ts`:

```ts
export type Scene = {
  id: string;
  label: string;
  command: string;
  output: string[];
};

export type Step =
  | { kind: "command"; sceneId: string; command: string }
  | { kind: "output"; sceneId: string; line: string };
```

- [ ] **Step 2: Write the failing tests for `buildScenes`/`buildSteps`/`getSceneStartOffsets`**

Create `src/components/terminal/script.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { buildScenes, buildSteps, getSceneStartOffsets } from "./script";

describe("buildScenes", () => {
  it("returns the 7 scenes in spec order", () => {
    const scenes = buildScenes();
    expect(scenes.map((scene) => scene.id)).toEqual([
      "intro",
      "skills",
      "experience-mercado-libre",
      "experience-conecta-marketplaces",
      "experience-techmillen-consultoria-e-projetos",
      "background",
      "contact",
    ]);
  });

  it("gives every scene a non-empty command and at least one output line", () => {
    for (const scene of buildScenes()) {
      expect(scene.command.length).toBeGreaterThan(0);
      expect(scene.output.length).toBeGreaterThan(0);
    }
  });
});

describe("buildSteps", () => {
  it("emits one command step followed by one step per output line, per scene", () => {
    const scenes = buildScenes();
    const steps = buildSteps(scenes);
    const expectedTotal = scenes.reduce((sum, scene) => sum + 1 + scene.output.length, 0);
    expect(steps.length).toBe(expectedTotal);
    expect(steps[0]).toEqual({ kind: "command", sceneId: "intro", command: "whoami" });
  });
});

describe("getSceneStartOffsets", () => {
  it("places the first scene at offset 0 and the next scene right after its full step count", () => {
    const scenes = buildScenes();
    const offsets = getSceneStartOffsets(scenes, 80);
    expect(offsets.intro).toBe(0);
    const introStepCount = 1 + scenes[0].output.length;
    expect(offsets.skills).toBe(introStepCount * 80);
  });
});
```

- [ ] **Step 3: Run the tests to verify they fail**

Run: `npx vitest run src/components/terminal/script.test.ts`
Expected: FAIL — `Cannot find module './script'`.

- [ ] **Step 4: Implement `script.ts`**

Create `src/components/terminal/script.ts`:

```ts
import { resume } from "@/content/resume";
import type { Scene, Step } from "./types";

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function buildScenes(): Scene[] {
  const experienceScenes: Scene[] = resume.experience.map((job) => ({
    id: `experience-${slugify(job.company)}`,
    label: `Experience · ${job.company}`,
    command: `cat experience/${slugify(job.company)}.md`,
    output: [`${job.role} — ${job.company}`, job.period, "", ...job.bullets.map((bullet) => `- ${bullet}`)],
  }));

  return [
    {
      id: "intro",
      label: "Intro",
      command: "whoami",
      output: [`${resume.name} — ${resume.title}`, resume.location, "", ...resume.summary],
    },
    {
      id: "skills",
      label: "Skills",
      command: "cat skills.txt",
      output: resume.skills.flatMap((group) => [`${group.category}:`, `  ${group.items.join(", ")}`]),
    },
    ...experienceScenes,
    {
      id: "background",
      label: "Background",
      command: "cat education.md",
      output: [
        "education:",
        ...resume.education.map((entry) => `  - ${entry.degree}, ${entry.school} (${entry.period})`),
        "",
        "certifications:",
        ...resume.certifications.map((cert) => `  - ${cert}`),
        "",
        "languages:",
        ...resume.languages.map((lang) => `  - ${lang.name}: ${lang.level}`),
      ],
    },
    {
      id: "contact",
      label: "Contact",
      command: "cat contact.txt",
      output: [`email: ${resume.email}`, `linkedin: ${resume.linkedinUrl}`, `github: ${resume.githubUrl}`],
    },
  ];
}

export function buildSteps(scenes: Scene[]): Step[] {
  return scenes.flatMap((scene) => [
    { kind: "command", sceneId: scene.id, command: scene.command } as Step,
    ...scene.output.map((line) => ({ kind: "output", sceneId: scene.id, line }) as Step),
  ]);
}

export function getSceneStartOffsets(scenes: Scene[], stepPx: number): Record<string, number> {
  const offsets: Record<string, number> = {};
  let stepCount = 0;
  for (const scene of scenes) {
    offsets[scene.id] = stepCount * stepPx;
    stepCount += 1 + scene.output.length;
  }
  return offsets;
}
```

- [ ] **Step 5: Run the tests to verify they pass**

Run: `npx vitest run src/components/terminal/script.test.ts`
Expected: PASS, 4 tests.

- [ ] **Step 6: Commit**

```bash
git add src/components/terminal/types.ts src/components/terminal/script.ts src/components/terminal/script.test.ts
git commit -m "$(cat <<'EOF'
Add terminal step-script builder with scene/step generation

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 4: Step-progress math

**Files:**
- Create: `src/components/terminal/stepMath.ts`
- Test: `src/components/terminal/stepMath.test.ts`

**Interfaces:**
- Produces: `progressToStepIndex(progress: number, totalSteps: number): number` — consumed by Task 6 (`useScrollSteps.ts`).

- [ ] **Step 1: Write the failing tests**

Create `src/components/terminal/stepMath.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { progressToStepIndex } from "./stepMath";

describe("progressToStepIndex", () => {
  it("maps progress 0 to step 0", () => {
    expect(progressToStepIndex(0, 10)).toBe(0);
  });

  it("maps progress 1 to the total step count", () => {
    expect(progressToStepIndex(1, 10)).toBe(10);
  });

  it("maps progress 0.5 to half the steps", () => {
    expect(progressToStepIndex(0.5, 10)).toBe(5);
  });

  it("clamps progress below 0", () => {
    expect(progressToStepIndex(-0.2, 10)).toBe(0);
  });

  it("clamps progress above 1", () => {
    expect(progressToStepIndex(1.5, 10)).toBe(10);
  });

  it("returns 0 when there are no steps", () => {
    expect(progressToStepIndex(0.5, 0)).toBe(0);
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npx vitest run src/components/terminal/stepMath.test.ts`
Expected: FAIL — `Cannot find module './stepMath'`.

- [ ] **Step 3: Implement `stepMath.ts`**

Create `src/components/terminal/stepMath.ts`:

```ts
export function progressToStepIndex(progress: number, totalSteps: number): number {
  if (totalSteps <= 0) return 0;
  const clamped = Math.min(Math.max(progress, 0), 1);
  return clamped * totalSteps;
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `npx vitest run src/components/terminal/stepMath.test.ts`
Expected: PASS, 6 tests.

- [ ] **Step 5: Commit**

```bash
git add src/components/terminal/stepMath.ts src/components/terminal/stepMath.test.ts
git commit -m "$(cat <<'EOF'
Add scroll-progress-to-step-index math

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 5: Visible-lines rendering logic

**Files:**
- Create: `src/components/terminal/renderVisibleLines.ts`
- Test: `src/components/terminal/renderVisibleLines.test.ts`

**Interfaces:**
- Consumes: `Step` type (Task 3).
- Produces: `RenderedLine` type, `getVisibleLines(steps: Step[], stepIndex: number, reducedMotion: boolean): RenderedLine[]`, `currentSceneId(steps: Step[], stepIndex: number): string | undefined` — both consumed by Task 9 (`ScrollTerminal.tsx`).

- [ ] **Step 1: Write the failing tests**

Create `src/components/terminal/renderVisibleLines.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { currentSceneId, getVisibleLines } from "./renderVisibleLines";
import type { Step } from "./types";

const steps: Step[] = [
  { kind: "command", sceneId: "a", command: "whoami" },
  { kind: "output", sceneId: "a", line: "Agata" },
  { kind: "command", sceneId: "b", command: "cat skills.txt" },
  { kind: "output", sceneId: "b", line: "Go, Java" },
];

describe("getVisibleLines", () => {
  it("shows nothing before scrolling starts", () => {
    expect(getVisibleLines(steps, 0, false)).toEqual([]);
  });

  it("shows a partially typed command mid-step", () => {
    const lines = getVisibleLines(steps, 0.5, false);
    expect(lines).toHaveLength(1);
    expect(lines[0]).toMatchObject({ kind: "prompt", inProgress: true });
    expect(lines[0].text.length).toBeGreaterThan(0);
    expect(lines[0].text.length).toBeLessThan("whoami".length);
  });

  it("shows the full command once its step completes", () => {
    const lines = getVisibleLines(steps, 1, false);
    expect(lines[0]).toMatchObject({ kind: "prompt", text: "whoami", inProgress: false });
  });

  it("reveals output lines fully as soon as their step starts, even mid-step", () => {
    const lines = getVisibleLines(steps, 1.3, false);
    expect(lines[lines.length - 1]).toMatchObject({ kind: "output", text: "Agata", inProgress: false });
  });

  it("in reduced-motion mode, shows full text immediately without partial typing", () => {
    const lines = getVisibleLines(steps, 0.5, true);
    expect(lines).toHaveLength(1);
    expect(lines[0]).toMatchObject({ kind: "prompt", text: "whoami" });
  });
});

describe("currentSceneId", () => {
  it("returns the scene of the current step", () => {
    expect(currentSceneId(steps, 0)).toBe("a");
    expect(currentSceneId(steps, 2.5)).toBe("b");
  });

  it("clamps to the last scene when stepIndex exceeds total steps", () => {
    expect(currentSceneId(steps, 99)).toBe("b");
  });

  it("returns undefined for an empty step list", () => {
    expect(currentSceneId([], 0)).toBeUndefined();
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npx vitest run src/components/terminal/renderVisibleLines.test.ts`
Expected: FAIL — `Cannot find module './renderVisibleLines'`.

- [ ] **Step 3: Implement `renderVisibleLines.ts`**

Create `src/components/terminal/renderVisibleLines.ts`:

```ts
import type { Step } from "./types";

export type RenderedLine = {
  key: string;
  sceneId: string;
  kind: "prompt" | "output";
  text: string;
  inProgress: boolean;
};

export function getVisibleLines(steps: Step[], stepIndex: number, reducedMotion: boolean): RenderedLine[] {
  const completed = Math.floor(stepIndex);
  const fraction = stepIndex - completed;
  const upTo = reducedMotion ? Math.ceil(stepIndex) : completed;

  const lines: RenderedLine[] = [];
  for (let i = 0; i < steps.length && i < upTo; i++) {
    lines.push(toRenderedLine(steps[i], i, false, 1));
  }

  if (!reducedMotion && completed < steps.length && fraction > 0) {
    lines.push(toRenderedLine(steps[completed], completed, true, fraction));
  }

  return lines;
}

export function currentSceneId(steps: Step[], stepIndex: number): string | undefined {
  if (steps.length === 0) return undefined;
  const idx = Math.min(Math.max(Math.floor(stepIndex), 0), steps.length - 1);
  return steps[idx].sceneId;
}

function toRenderedLine(step: Step, index: number, inProgress: boolean, fraction: number): RenderedLine {
  if (step.kind === "command") {
    const text = inProgress ? step.command.slice(0, Math.round(step.command.length * fraction)) : step.command;
    return { key: `${step.sceneId}-cmd-${index}`, sceneId: step.sceneId, kind: "prompt", text, inProgress };
  }
  return { key: `${step.sceneId}-out-${index}`, sceneId: step.sceneId, kind: "output", text: step.line, inProgress: false };
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `npx vitest run src/components/terminal/renderVisibleLines.test.ts`
Expected: PASS, 8 tests.

- [ ] **Step 5: Commit**

```bash
git add src/components/terminal/renderVisibleLines.ts src/components/terminal/renderVisibleLines.test.ts
git commit -m "$(cat <<'EOF'
Add pure visible-lines rendering logic for the scroll-scrubbed terminal

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 6: Scroll-tracking hook

**Files:**
- Create: `src/components/terminal/useScrollSteps.ts`

**Interfaces:**
- Consumes: `progressToStepIndex` (Task 4).
- Produces: `useScrollSteps(totalSteps: number): { containerRef: React.RefObject<HTMLDivElement>; stepIndex: number }` — consumed by Task 9 (`ScrollTerminal.tsx`).

- [ ] **Step 1: Implement the hook**

Create `src/components/terminal/useScrollSteps.ts`:

```ts
"use client";

import { useRef, useState } from "react";
import { useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { progressToStepIndex } from "./stepMath";

export function useScrollSteps(totalSteps: number) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  const stepIndexMotion = useTransform(scrollYProgress, (progress) => progressToStepIndex(progress, totalSteps));

  const [stepIndex, setStepIndex] = useState(0);
  useMotionValueEvent(stepIndexMotion, "change", (latest) => setStepIndex(latest));

  return { containerRef, stepIndex };
}
```

This has no independently testable pure logic beyond `progressToStepIndex` (already tested in Task 4) — `useScroll`/`useTransform` require a real DOM and browser scroll events, so this hook is verified manually once it's wired into `ScrollTerminal` in Task 9.

- [ ] **Step 2: Verify it type-checks**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/terminal/useScrollSteps.ts
git commit -m "$(cat <<'EOF'
Add scroll-tracking hook mapping scrollYProgress to a step index

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 7: Terminal chrome and laptop mockup components

**Files:**
- Create: `src/components/terminal/TerminalWindow.tsx`
- Create: `src/components/terminal/LaptopMockup.tsx`

**Interfaces:**
- Produces: `TerminalWindow({ children, className? }): JSX.Element`, `LaptopMockup({ children }): JSX.Element` — both consumed by Task 9 (`ScrollTerminal.tsx`) and Task 11 (`InteractiveTerminal.tsx`, `TerminalWindow` only).

- [ ] **Step 1: Implement `TerminalWindow`**

Create `src/components/terminal/TerminalWindow.tsx`:

```tsx
type TerminalWindowProps = {
  children: React.ReactNode;
  className?: string;
};

export function TerminalWindow({ children, className }: TerminalWindowProps) {
  return (
    <div className={`overflow-hidden rounded-none bg-[#17171d] font-mono text-[13px] leading-relaxed md:rounded-md ${className ?? ""}`}>
      <div className="flex items-center gap-1.5 bg-[#0c0c10] px-3 py-2">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
      </div>
      <div className="min-h-[220px] px-4 py-3 text-[#d4d4dc]">{children}</div>
    </div>
  );
}
```

- [ ] **Step 2: Implement `LaptopMockup`**

Create `src/components/terminal/LaptopMockup.tsx`:

```tsx
type LaptopMockupProps = {
  children: React.ReactNode;
};

export function LaptopMockup({ children }: LaptopMockupProps) {
  return (
    <div className="w-full max-w-xl">
      <div className="md:rounded-t-xl md:rounded-b-sm md:bg-[#0a0a0c] md:p-2.5 md:pb-3.5 md:shadow-[inset_0_0_0_2px_#2a2a30]">
        <div className="mx-auto mb-2 hidden h-1.5 w-1.5 rounded-full bg-[#333] md:block" />
        {children}
      </div>
      <div className="relative hidden h-3 rounded-b-lg bg-gradient-to-b from-[#3a3a40] to-[#232327] md:block">
        <div className="absolute left-1/2 top-0 h-1.5 w-16 -translate-x-1/2 rounded-b-md bg-[#17171a]" />
      </div>
    </div>
  );
}
```

Below the 768px breakpoint, every `md:` bezel class drops out — no laptop chrome renders, only the terminal fills the width, per the mobile fallback in the spec.

- [ ] **Step 3: Verify it type-checks**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/terminal/TerminalWindow.tsx src/components/terminal/LaptopMockup.tsx
git commit -m "$(cat <<'EOF'
Add terminal chrome and responsive laptop mockup components

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 8: Scene progress nav

**Files:**
- Create: `src/components/terminal/SceneProgressNav.tsx`

**Interfaces:**
- Consumes: `Scene` type (Task 3).
- Produces: `SceneProgressNav({ scenes, activeSceneId? }): JSX.Element` — consumed by Task 9 (`ScrollTerminal.tsx`). Expects scene anchor elements with `id="scene-<sceneId>"` to exist in the DOM (provided by Task 9).

- [ ] **Step 1: Implement `SceneProgressNav`**

Create `src/components/terminal/SceneProgressNav.tsx`:

```tsx
"use client";

import type { Scene } from "./types";

type SceneProgressNavProps = {
  scenes: Scene[];
  activeSceneId?: string;
};

export function SceneProgressNav({ scenes, activeSceneId }: SceneProgressNavProps) {
  function scrollToScene(sceneId: string) {
    document.getElementById(`scene-${sceneId}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  return (
    <nav className="hidden flex-col gap-3 text-sm md:flex" aria-label="Résumé sections">
      {scenes.map((scene) => (
        <button
          key={scene.id}
          type="button"
          onClick={() => scrollToScene(scene.id)}
          className={
            scene.id === activeSceneId
              ? "text-left font-medium text-[#6ad3ff]"
              : "text-left text-[#6b6b73] transition-colors hover:text-[#a0a0a8]"
          }
        >
          {scene.label}
        </button>
      ))}
    </nav>
  );
}
```

- [ ] **Step 2: Verify it type-checks**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/terminal/SceneProgressNav.tsx
git commit -m "$(cat <<'EOF'
Add clickable scene progress nav for the scroll terminal

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 9: ScrollTerminal assembly

**Files:**
- Create: `src/components/terminal/ScrollTerminal.tsx`
- Modify: `src/app/page.tsx` (temporary — renders `<ScrollTerminal />` alone, so it's visible for manual verification; Task 13 replaces this with the full page)

**Interfaces:**
- Consumes: `buildScenes`, `buildSteps`, `getSceneStartOffsets` (Task 3); `getVisibleLines`, `currentSceneId` (Task 5); `useScrollSteps` (Task 6); `TerminalWindow`, `LaptopMockup` (Task 7); `SceneProgressNav` (Task 8).
- Produces: `ScrollTerminal(): JSX.Element` — consumed by Task 13 (`page.tsx`, final version).

- [ ] **Step 1: Implement `ScrollTerminal`**

Create `src/components/terminal/ScrollTerminal.tsx`:

```tsx
"use client";

import { useMemo } from "react";
import { useReducedMotion } from "framer-motion";
import { buildScenes, buildSteps, getSceneStartOffsets } from "./script";
import { currentSceneId, getVisibleLines } from "./renderVisibleLines";
import { useScrollSteps } from "./useScrollSteps";
import { TerminalWindow } from "./TerminalWindow";
import { LaptopMockup } from "./LaptopMockup";
import { SceneProgressNav } from "./SceneProgressNav";

const STEP_PX = 80;
const VISIBLE_LINES = 12;

export function ScrollTerminal() {
  const scenes = useMemo(() => buildScenes(), []);
  const steps = useMemo(() => buildSteps(scenes), [scenes]);
  const sceneOffsets = useMemo(() => getSceneStartOffsets(scenes, STEP_PX), [scenes]);
  const reducedMotion = useReducedMotion();

  const { containerRef, stepIndex } = useScrollSteps(steps.length);

  const visibleLines = getVisibleLines(steps, stepIndex, Boolean(reducedMotion)).slice(-VISIBLE_LINES);
  const activeSceneId = currentSceneId(steps, stepIndex);

  return (
    <div ref={containerRef} style={{ height: `${steps.length * STEP_PX}px` }} className="relative">
      {scenes.map((scene) => (
        <div
          key={scene.id}
          id={`scene-${scene.id}`}
          aria-hidden="true"
          style={{ position: "absolute", top: sceneOffsets[scene.id], height: 1, width: 1 }}
        />
      ))}
      <div className="sticky top-0 flex h-screen items-center justify-center gap-10 px-4">
        <LaptopMockup>
          <TerminalWindow>
            {visibleLines.map((line) => (
              <div key={line.key} className={line.kind === "prompt" ? "text-[#6ad3ff]" : "whitespace-pre-wrap"}>
                {line.kind === "prompt" ? `agata@portfolio:~$ ${line.text}` : line.text}
                {line.inProgress && <span className="ml-0.5 inline-block h-3 w-1.5 animate-pulse bg-[#d4d4dc] align-middle" />}
              </div>
            ))}
          </TerminalWindow>
        </LaptopMockup>
        <SceneProgressNav scenes={scenes} activeSceneId={activeSceneId} />
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Temporarily wire it into `page.tsx` for manual verification**

Replace the contents of `src/app/page.tsx`:

```tsx
import { ScrollTerminal } from "@/components/terminal/ScrollTerminal";

export default function Home() {
  return (
    <main>
      <ScrollTerminal />
    </main>
  );
}
```

- [ ] **Step 3: Run the dev server and manually verify the scrubber**

```bash
npm run dev
```

Open `http://localhost:3000` and confirm:
- The laptop mockup is centered and pinned while you scroll.
- Scrolling down "types" the `whoami` command, then reveals its output lines, then moves into `cat skills.txt`, and so on through all 7 scenes.
- Scrolling back up "untypes"/hides lines in reverse.
- The right-hand scene list highlights the current scene and clicking a scene label jumps the page to it.
- Resize the window below 768px width — the laptop bezel disappears and the terminal fills the width.
- In your OS/browser accessibility settings, enable "reduce motion", reload, and confirm each scene's text appears fully as soon as you scroll into it (no character-by-character typing).

Stop the dev server (Ctrl+C) once verified.

- [ ] **Step 4: Run the full build**

```bash
npm run build
```

Expected: builds with no errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/terminal/ScrollTerminal.tsx src/app/page.tsx
git commit -m "$(cat <<'EOF'
Assemble the scroll-scrubbed terminal with laptop mockup and scene nav

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 10: Interactive terminal command parser

**Files:**
- Create: `src/components/terminal/commands.ts`
- Test: `src/components/terminal/commands.test.ts`

**Interfaces:**
- Consumes: `resume` from `@/content/resume` (Task 2).
- Produces: `CommandResult` type, `runCommand(rawInput: string): CommandResult` — consumed by Task 11 (`InteractiveTerminal.tsx`).

- [ ] **Step 1: Write the failing tests**

Create `src/components/terminal/commands.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { runCommand } from "./commands";

describe("runCommand", () => {
  it("lists available commands for 'help'", () => {
    const result = runCommand("help");
    expect(result.lines[0]).toContain("help");
    expect(result.lines[0]).toContain("skills");
    expect(result.lines[0]).toContain("contact");
  });

  it("returns the summary for 'about'", () => {
    const result = runCommand("about");
    expect(result.lines[0]).toContain("Agata Domingues");
  });

  it("returns skill categories for 'skills'", () => {
    const result = runCommand("skills");
    expect(result.lines.join("\n")).toContain("Languages & Frameworks");
  });

  it("returns all three companies for 'experience'", () => {
    const result = runCommand("experience");
    const joined = result.lines.join("\n");
    expect(joined).toContain("Mercado Libre");
    expect(joined).toContain("Conecta Marketplaces");
    expect(joined).toContain("Techmillen Consultoria e Projetos");
  });

  it("returns education, certifications, and languages for 'education'", () => {
    const result = runCommand("education");
    const joined = result.lines.join("\n");
    expect(joined).toContain("UNINTER");
    expect(joined).toContain("Mercado Libre API Integration");
    expect(joined).toContain("Portuguese");
  });

  it("returns email and links for 'contact', with no phone number", () => {
    const result = runCommand("contact");
    const joined = result.lines.join("\n");
    expect(joined).toContain("agatadominguestech@gmail.com");
    expect(joined).not.toMatch(/\d{2,}-\d{4,}/);
  });

  it("signals a clear for 'clear'", () => {
    const result = runCommand("clear");
    expect(result.clear).toBe(true);
    expect(result.lines).toEqual([]);
  });

  it("returns the easter egg for 'sudo hire agata', case-insensitively", () => {
    const result = runCommand("Sudo Hire Agata");
    expect(result.lines[0]).toMatch(/hired/i);
  });

  it("returns a not-found message for unknown commands", () => {
    const result = runCommand("rm -rf /");
    expect(result.lines[0]).toContain("command not found: rm -rf /");
    expect(result.lines[0]).toContain("help");
  });

  it("returns no lines for empty input", () => {
    expect(runCommand("   ")).toEqual({ lines: [] });
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npx vitest run src/components/terminal/commands.test.ts`
Expected: FAIL — `Cannot find module './commands'`.

- [ ] **Step 3: Implement `commands.ts`**

Create `src/components/terminal/commands.ts`:

```ts
import { resume } from "@/content/resume";

export type CommandResult = {
  lines: string[];
  clear?: boolean;
};

const COMMAND_NAMES = ["help", "about", "skills", "experience", "education", "contact", "clear"] as const;

export function runCommand(rawInput: string): CommandResult {
  const input = rawInput.trim();
  const normalized = input.toLowerCase();

  if (normalized === "sudo hire agata") {
    return { lines: ["Permission granted. Agata is now hired.", "(reach out for real — type 'contact')"] };
  }

  switch (normalized) {
    case "":
      return { lines: [] };
    case "help":
      return { lines: [`Available commands: ${COMMAND_NAMES.join(", ")}`] };
    case "about":
      return { lines: [`${resume.name} — ${resume.title}`, resume.location, "", ...resume.summary] };
    case "skills":
      return {
        lines: resume.skills.flatMap((group) => [`${group.category}:`, `  ${group.items.join(", ")}`]),
      };
    case "experience":
      return {
        lines: resume.experience.flatMap((job) => [
          `${job.role} — ${job.company} (${job.period})`,
          ...job.bullets.map((bullet) => `  - ${bullet}`),
          "",
        ]),
      };
    case "education":
      return {
        lines: [
          "education:",
          ...resume.education.map((entry) => `  - ${entry.degree}, ${entry.school} (${entry.period})`),
          "",
          "certifications:",
          ...resume.certifications.map((cert) => `  - ${cert}`),
          "",
          "languages:",
          ...resume.languages.map((lang) => `  - ${lang.name}: ${lang.level}`),
        ],
      };
    case "contact":
      return {
        lines: [`email: ${resume.email}`, `linkedin: ${resume.linkedinUrl}`, `github: ${resume.githubUrl}`],
      };
    case "clear":
      return { lines: [], clear: true };
    default:
      return { lines: [`command not found: ${input} — type 'help' to see available commands`] };
  }
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `npx vitest run src/components/terminal/commands.test.ts`
Expected: PASS, 10 tests.

- [ ] **Step 5: Commit**

```bash
git add src/components/terminal/commands.ts src/components/terminal/commands.test.ts
git commit -m "$(cat <<'EOF'
Add interactive terminal command parser

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 11: Interactive terminal component

**Files:**
- Create: `src/components/terminal/InteractiveTerminal.tsx`

**Interfaces:**
- Consumes: `runCommand` (Task 10), `TerminalWindow` (Task 7).
- Produces: `InteractiveTerminal(): JSX.Element` — consumed by Task 13 (`page.tsx`).

- [ ] **Step 1: Implement `InteractiveTerminal`**

Create `src/components/terminal/InteractiveTerminal.tsx`:

```tsx
"use client";

import { useState } from "react";
import { runCommand } from "./commands";
import { TerminalWindow } from "./TerminalWindow";

type HistoryEntry = {
  command: string;
  lines: string[];
};

export function InteractiveTerminal() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [input, setInput] = useState("");

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const result = runCommand(input);
    setHistory((previous) => (result.clear ? [] : [...previous, { command: input, lines: result.lines }]));
    setInput("");
  }

  return (
    <TerminalWindow>
      {history.map((entry, index) => (
        <div key={index}>
          <div className="text-[#6ad3ff]">agata@portfolio:~$ {entry.command}</div>
          {entry.lines.map((line, lineIndex) => (
            <div key={lineIndex} className="whitespace-pre-wrap">
              {line}
            </div>
          ))}
        </div>
      ))}
      <form onSubmit={handleSubmit} className="flex items-center gap-1 text-[#6ad3ff]">
        <span>agata@portfolio:~$</span>
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          autoComplete="off"
          spellCheck={false}
          aria-label="Terminal command input"
          className="flex-1 bg-transparent text-[#d4d4dc] outline-none"
        />
      </form>
    </TerminalWindow>
  );
}
```

- [ ] **Step 2: Temporarily mount it below `ScrollTerminal` for manual verification**

In `src/app/page.tsx`, add the import and render it under `<ScrollTerminal />`:

```tsx
import { ScrollTerminal } from "@/components/terminal/ScrollTerminal";
import { InteractiveTerminal } from "@/components/terminal/InteractiveTerminal";

export default function Home() {
  return (
    <main>
      <ScrollTerminal />
      <section className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 py-24">
        <p className="max-w-md text-center text-sm text-[#a0a0a8]">
          Type a command to keep exploring — try &apos;help&apos;.
        </p>
        <div className="w-full max-w-xl">
          <InteractiveTerminal />
        </div>
      </section>
    </main>
  );
}
```

- [ ] **Step 3: Run the dev server and manually verify**

```bash
npm run dev
```

Scroll past the pinned terminal, then in the interactive terminal type `help`, `about`, `skills`, `experience`, `education`, `contact`, `sudo hire agata`, an unknown command, and `clear`. Confirm each behaves as expected and the input stays focused/usable after each submit. Stop the server once verified.

- [ ] **Step 4: Run the full build**

```bash
npm run build
```

Expected: builds with no errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/terminal/InteractiveTerminal.tsx src/app/page.tsx
git commit -m "$(cat <<'EOF'
Add interactive terminal that unlocks after the scroll journey

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 12: Résumé fallback and skip link

**Files:**
- Create: `src/components/ResumeFallback.tsx`
- Create: `src/components/SkipLink.tsx`

**Interfaces:**
- Consumes: `resume` from `@/content/resume` (Task 2).
- Produces: `ResumeFallback(): JSX.Element`, `SkipLink(): JSX.Element` — both consumed by Task 13 (`page.tsx`).

- [ ] **Step 1: Implement `ResumeFallback`**

Create `src/components/ResumeFallback.tsx`:

```tsx
import { resume } from "@/content/resume";

export function ResumeFallback() {
  return (
    <section id="resume" aria-label="Full résumé (text)" className="mx-auto max-w-2xl px-6 py-16 text-[#d4d4dc]">
      <h2 className="text-2xl font-semibold text-white">{resume.name}</h2>
      <p className="text-[#a0a0a8]">
        {resume.title} · {resume.location}
      </p>

      <h3 className="mt-8 text-lg font-semibold text-white">Summary</h3>
      {resume.summary.map((paragraph, index) => (
        <p key={index} className="mt-2">
          {paragraph}
        </p>
      ))}

      <h3 className="mt-8 text-lg font-semibold text-white">Skills</h3>
      <ul className="mt-2 space-y-1">
        {resume.skills.map((group) => (
          <li key={group.category}>
            <strong>{group.category}:</strong> {group.items.join(", ")}
          </li>
        ))}
      </ul>

      <h3 className="mt-8 text-lg font-semibold text-white">Experience</h3>
      {resume.experience.map((job) => (
        <div key={job.company} className="mt-4">
          <p className="font-medium text-white">
            {job.role} — {job.company}
          </p>
          <p className="text-sm text-[#a0a0a8]">{job.period}</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {job.bullets.map((bullet, index) => (
              <li key={index}>{bullet}</li>
            ))}
          </ul>
        </div>
      ))}

      <h3 className="mt-8 text-lg font-semibold text-white">Education</h3>
      <ul className="mt-2 space-y-1">
        {resume.education.map((entry) => (
          <li key={entry.degree}>
            {entry.degree}, {entry.school} ({entry.period})
          </li>
        ))}
      </ul>

      <h3 className="mt-8 text-lg font-semibold text-white">Certifications</h3>
      <ul className="mt-2 list-disc space-y-1 pl-5">
        {resume.certifications.map((cert) => (
          <li key={cert}>{cert}</li>
        ))}
      </ul>

      <h3 className="mt-8 text-lg font-semibold text-white">Languages</h3>
      <ul className="mt-2 space-y-1">
        {resume.languages.map((lang) => (
          <li key={lang.name}>
            {lang.name}: {lang.level}
          </li>
        ))}
      </ul>

      <h3 className="mt-8 text-lg font-semibold text-white">Contact</h3>
      <p className="mt-2">
        <a href={`mailto:${resume.email}`} className="underline">
          {resume.email}
        </a>
        {" · "}
        <a href={resume.linkedinUrl} className="underline">
          LinkedIn
        </a>
        {" · "}
        <a href={resume.githubUrl} className="underline">
          GitHub
        </a>
      </p>
    </section>
  );
}
```

- [ ] **Step 2: Implement `SkipLink`**

Create `src/components/SkipLink.tsx`:

```tsx
export function SkipLink() {
  return (
    <a
      href="#resume"
      className="fixed right-3 top-3 z-50 rounded border border-[#2a2a30] bg-[#101014]/90 px-3 py-1.5 text-xs text-[#a0a0a8] backdrop-blur hover:text-[#d4d4dc]"
    >
      Skip intro · view résumé as text
    </a>
  );
}
```

- [ ] **Step 3: Verify it type-checks**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/ResumeFallback.tsx src/components/SkipLink.tsx
git commit -m "$(cat <<'EOF'
Add plain-text résumé fallback and skip link for accessibility

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 13: Final page assembly and QA pass

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/app/layout.tsx`

**Interfaces:**
- Consumes: `ScrollTerminal` (Task 9), `InteractiveTerminal` (Task 11), `ResumeFallback`, `SkipLink` (Task 12).

- [ ] **Step 1: Assemble the final `page.tsx`**

Replace the contents of `src/app/page.tsx`:

```tsx
import { ScrollTerminal } from "@/components/terminal/ScrollTerminal";
import { InteractiveTerminal } from "@/components/terminal/InteractiveTerminal";
import { ResumeFallback } from "@/components/ResumeFallback";
import { SkipLink } from "@/components/SkipLink";

export default function Home() {
  return (
    <>
      <SkipLink />
      <main>
        <ScrollTerminal />
        <section className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 py-24">
          <p className="max-w-md text-center text-sm text-[#a0a0a8]">
            Type a command to keep exploring — try &apos;help&apos;.
          </p>
          <div className="w-full max-w-xl">
            <InteractiveTerminal />
          </div>
        </section>
        <ResumeFallback />
      </main>
    </>
  );
}
```

- [ ] **Step 2: Update the page metadata**

In `src/app/layout.tsx`, replace the `metadata` export:

```tsx
export const metadata: Metadata = {
  title: "Agata Domingues — Backend Software Engineer",
  description: "Backend software engineer portfolio — Go, Java, distributed systems, and AI-assisted engineering.",
};
```

Leave the rest of `layout.tsx` (font setup, `<html lang="en">`, body classes) unchanged.

- [ ] **Step 3: Run the full test suite and build**

```bash
npm test
npm run build
```

Expected: all tests PASS, build completes with no errors.

- [ ] **Step 4: Full manual QA pass**

```bash
npm run dev
```

Walk through the whole page at `http://localhost:3000` and confirm:
- Scroll journey: all 7 scenes play in order, forward and backward scrubbing both work, scene nav highlights/jumps correctly.
- After the last scene, the pinned laptop releases and the page scrolls normally into the interactive terminal section.
- Interactive terminal: every command from Task 10 works, unknown commands show the not-found message, `clear` empties the history.
- Below it, the plain-text résumé section (`#resume`) renders every field from `resume.ts` with no phone number and placeholder LinkedIn/GitHub links.
- The "Skip intro · view résumé as text" link jumps straight to that section.
- Resize below 768px width: laptop bezel disappears, terminal is full-bleed, scene nav is hidden, scroll scrubbing still works.
- Enable "reduce motion" in OS/browser settings and reload: no character-by-character typing or line-stagger, scenes still change with scroll.
- Tab through the page with the keyboard only: skip link, scene nav buttons, and the interactive terminal's input are all reachable and usable.

Stop the dev server once verified.

- [ ] **Step 5: Commit**

```bash
git add src/app/page.tsx src/app/layout.tsx
git commit -m "$(cat <<'EOF'
Wire up the final portfolio page: scroll terminal, interactive terminal, résumé fallback

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```
