export type Scene = {
  id: string;
  label: string;
  command: string;
  output: string[];
};

export type Step =
  | { kind: "command"; sceneId: string; command: string }
  | { kind: "output"; sceneId: string; line: string };
