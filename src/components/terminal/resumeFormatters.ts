import { resume } from "@/content/resume";

export function formatAbout(): string[] {
  return [`${resume.name} — ${resume.title}`, resume.location, "", ...resume.summary];
}

export function formatIntroTeaser(): string[] {
  return [`${resume.name} — ${resume.title}`, resume.location, "", ...resume.summaryShort];
}

export function formatSkills(): string[] {
  return resume.skills.flatMap((group) => [`${group.category}:`, `  ${group.items.join(", ")}`]);
}

export function formatEducation(): string[] {
  return [
    "education:",
    ...resume.education.map((entry) => `  - ${entry.degree}, ${entry.school} (${entry.period})`),
    "",
    "certifications:",
    ...resume.certifications.map((cert) => `  - ${cert}`),
    "",
    "languages:",
    ...resume.languages.map((lang) => `  - ${lang.name}: ${lang.level}`),
  ];
}

export function formatContact(): string[] {
  return [`email: ${resume.email}`, `linkedin: ${resume.linkedinUrl}`, `github: ${resume.githubUrl}`];
}
