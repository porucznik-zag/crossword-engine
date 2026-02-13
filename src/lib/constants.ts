export const LETTERS: readonly string[] = [
  "A",
  "Ą",
  "B",
  "C",
  "Ć",
  "D",
  "E",
  "Ę",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "Ł",
  "M",
  "N",
  "Ń",
  "O",
  "Ó",
  "P",
  "R",
  "S",
  "Ś",
  "T",
  "U",
  "W",
  "Y",
  "Z",
  "Ź",
  "Ż",
];

export const VOWELS: readonly string[] = ["A", "Ą", "E", "Ę", "I", "O", "Ó", "U", "Y"];

export enum ConstraintType {
    NONE = "NONE",
    VOWEL = "VOWEL",         // Samogłoska
    CONSONANT = "CONSONANT", // Spółgłoska
}

export enum AlertType {
  INFO = "INFO",
  WARNING = "WARNING",
  ERROR = "ERROR",
}

export interface WordResult {
  word: string;
  definitions: string[];
}
