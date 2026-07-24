import { resume } from "@/content/resume";
import { formatAbout, formatContact, formatEducation, formatSkills } from "./resumeFormatters";

export type CommandResult = {
  lines: string[];
  clear?: boolean;
};

const COMMAND_NAMES = ["help", "about", "skills", "experience", "education", "contact", "clear"] as const;
const EXTRA_COMMAND_NAMES = ["neofetch", "cats", "fortune"] as const;

const NEOFETCH_LINES = [
  "      /\\_/\\",
  "     ( o.o )",
  "      > ^ <",
  "",
  "OS: AgataOS (Backend Edition)",
  "Shell: Go / Java / bash",
  "Uptime: 3+ years in production",
  "Pets: Pimpi & Cora (2 cats)",
  "Hobbies: reading, gaming, board games, travel",
  "Countries visited: 3 (and counting)",
  "Catan win rate: suspiciously high",
];

const CATS_LINES = [
  "pimpi.cat — probably asleep right now",
  "cora.cat  — supervising this deploy",
  "2 cats, 0 production incidents caused by either of them (yet)",
];

const FORTUNES = [
  "You will win at Catan today. (Agata usually does.)",
  "3 countries visited so far. The travel backlog is long.",
  "A good book and a quiet weekend > a noisy production incident.",
  "Pimpi and Cora approve this deploy.",
];

function pickFortune(): string {
  return FORTUNES[Math.floor(Math.random() * FORTUNES.length)];
}

export function runCommand(rawInput: string): CommandResult {
  const input = rawInput.trim();
  const normalized = input.toLowerCase();

  if (normalized === "sudo hire agata") {
    return { lines: ["Permission granted. Agata is now hired.", "(reach out for real — type 'contact')"] };
  }

  switch (normalized) {
    case "neofetch":
      return { lines: NEOFETCH_LINES };
    case "cats":
      return { lines: CATS_LINES };
    case "fortune":
      return { lines: [pickFortune()] };
    case "":
      return { lines: [] };
    case "help":
      return {
        lines: [
          `Available commands: ${COMMAND_NAMES.join(", ")}`,
          `Extras: ${EXTRA_COMMAND_NAMES.join(", ")}`,
        ],
      };
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
