export type TheoryStatus =
  | "established"
  | "active-research"
  | "working-model"
  | "speculative";

export type Locale = "zh-CN" | "en-US";

export type LensId =
  | "all"
  | "spacetime"
  | "quantum"
  | "information"
  | "cosmology"
  | "hypothesis";

export type LocalizedTheoryContent = {
  name: string;
  family: string;
  summary: string;
  dimensions: string[];
  openQuestions: string[];
};

export type TheoryNode = {
  id: string;
  status: TheoryStatus;
  lenses: LensId[];
  scale: number;
  x: number;
  y: number;
  demoHook: string;
  content: Record<Locale, LocalizedTheoryContent>;
};
