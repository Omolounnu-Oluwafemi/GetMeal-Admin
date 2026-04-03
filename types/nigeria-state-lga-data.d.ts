declare module "nigeria-state-lga-data" {
  export function getStates(): string[];
  export function getLgas(state: string): string[];
  export function getTowns(state: string, lga: string): string[];
  export function getStatesAndCapitals(): { state: string; capital: string }[];
  export function getCapital(state: string): string;
  export function getStatesData(): Record<string, unknown>;
}
