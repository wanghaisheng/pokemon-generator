export type Element =
  | "fire"
  | "grass"
  | "water"
  | "electric"
  | "psychic"
  | "fighting"
  | "normal";

export type Rarity = "common" | "uncommon" | "rare";

export interface Attack {
  name: string;
  damage: string;
  info: string;
  type: Element;
  amount: number;
}

export interface Card {
  type: Element;
  stage: BASIC;
  name: string;
  nameEvolution: string;
  mainImage: string;
  mainImageX: number;
  mainImageY: number;
  evolvePicture: string;
  evolvePictureX: number;
  evolvePictureY: number;
  hp: string | number;
  weaknessType: Element;
  weaknessAmount: number;
  resistanceType: Element;
  resistanceAmount: number;
  retreat: number;
  description: string;
  illustrator: string;
  cardNumber: string;
  totalCollection: string;
  rarity: RARITY;
  species: string;
  length: string;
  weight: string;
  attack1: Attack;
  attack2: Attack;
}
