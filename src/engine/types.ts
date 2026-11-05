export type Dimension = "EI" | "SN" | "TF" | "JP" | "AT";
export type CoreDimension = Exclude<Dimension, "AT">;
export type Scene = "cafe" | "studio" | "station" | "cabin";
export interface Option {
  id: string;
  text: string;
  score: number;
  explanation: string;
}
export interface Trigger {
  questionId: string;
  optionIds: string[];
}
export interface Question {
  id: string;
  kind: "base" | "branch" | "extension";
  dimension: Dimension;
  scene: Scene;
  context: string;
  npc: string;
  text: string;
  options: Option[];
  eventId: string;
  weight: number;
  target: string;
  rationale: string;
  trigger?: Trigger;
  purpose?: "motivation" | "crosscheck";
  crossChecks: string[];
}
export interface Answer {
  questionId: string;
  optionId: string;
  note?: string;
}
export interface Session {
  schema: number;
  bankVersion: string;
  scoringVersion: string;
  extension: boolean;
  answers: Answer[];
  updatedAt: string;
}
export interface Evidence {
  questionId: string;
  eventId: string;
  scene: Scene;
  context: string;
  question: string;
  answer: string;
  explanation: string;
  value: number;
}
export interface DimensionResult {
  dimension: Dimension;
  value: number;
  strength: number;
  eventCount: number;
  sufficient: boolean;
  uncertain: boolean;
  conflict: boolean;
  evidence: Evidence[];
}
export interface Candidate {
  type: string;
  distance: number;
  differences: string[];
}
export interface Report {
  dimensions: DimensionResult[];
  candidates: Candidate[];
  bestType: string | null;
  pattern: string;
  extension: DimensionResult | null;
  reachedCap: boolean;
  answerCount: number;
}
