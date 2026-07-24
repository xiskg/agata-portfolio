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
