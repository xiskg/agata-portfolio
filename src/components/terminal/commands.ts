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
