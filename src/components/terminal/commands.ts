import { resume } from "@/content/resume";
import { formatAbout, formatContact, formatEducation, formatSkills } from "./resumeFormatters";

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
      return { lines: formatAbout() };
    case "skills":
      return { lines: formatSkills() };
    case "experience":
      return {
        lines: resume.experience.flatMap((job) => [
          `${job.role} — ${job.company} (${job.period})`,
          ...job.bullets.map((bullet) => `  - ${bullet}`),
          "",
        ]),
      };
    case "education":
      return { lines: formatEducation() };
    case "contact":
      return { lines: formatContact() };
    case "clear":
      return { lines: [], clear: true };
    default:
      return { lines: [`command not found: ${input} — type 'help' to see available commands`] };
  }
}
