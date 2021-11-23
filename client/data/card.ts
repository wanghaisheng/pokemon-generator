import { BASIC } from "~constants";
import { Card } from "~@types/Card";

export const CARD_DEFAULT_STATE: Card = {
  type: {
    label: "water",
    value: "water",
  },
  stage: {
    label: BASIC,
    value: BASIC,
  },
  name: "",
  nameEvolution: "",
  mainImage: null,
  mainImageX: -2,
  mainImageY: 0,
  mainImageRotation: 0,
  mainImageScaleX: 1,
  mainImageScaleY: 1,
  mainImageWidth: null,
  mainImageHeight: null,
  evolvePicture: null,
  evolvePictureX: 0,
  evolvePictureY: 0,
  evolvePictureRotation: 0,
  evolvePictureScaleX: 1,
  evolvePictureScaleY: 1,
  evolvePictureWidth: null,
  evolvePictureHeight: null,
  hp: null,
  weaknessType: null,
  weaknessAmount: null,
  resistanceType: null,
  resistanceAmount: null,
  retreat: null,
  description: "",
  illustrator: "",
  cardNumber: "",
  totalCollection: "",
  rarity: null,
  species: "",
  length: "",
  weight: "",
  bgColor: { r: 233, g: 233, b: 233, a: 1 },
  attack1Name: "",
  attack1Damage: null,
  attack1Info: "",
  attack1Type: null,
  attack1Amount: {
    label: "1",
    value: 1,
  },
  attack2Name: "",
  attack2Damage: null,
  attack2Info: "",
  attack2Type: null,
  attack2Amount: {
    label: "1",
    value: 1,
  },
  firstEdition: false,
};
