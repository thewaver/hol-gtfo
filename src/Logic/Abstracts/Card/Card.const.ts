import { parseCSV } from "../../Utils/csv";
import { CARD_RARITIES, Card, CardCombo, CardMap, ExpansionName } from "./Card.types";
import cardsCSV from "./cards.csv?raw";
import combosCSV from "./combos.csv?raw";

export const RARITY_INDEXES = Object.fromEntries(CARD_RARITIES.map((value, index) => [value, index]));

export const PARSED_CARDS = parseCSV<Card>(cardsCSV, {
    isBasic: (v) => v === "1",
    isResult: (v) => v === "1",
    baseAttack: (v) => Number(v),
    baseDefense: (v) => Number(v),
});

export const ALL_CARDS = PARSED_CARDS.reduce((res, cur) => {
    res[cur.name] = cur;

    return res;
}, {} as CardMap);

export const ALL_EXPANSIONS = new Set(PARSED_CARDS.map((card) => card.expansion));

export const PARSED_COMBOS = parseCSV<CardCombo>(combosCSV);

export const EXPANSION_ACRONYMMS: Record<ExpansionName, string> = {
    "Base Game": "BG",
    "Forbidden Depths": "FD",
    "Masquerade of Lust": "MoL",
    "Cupid on Vacation": "CoV",
    "Spring Break": "SB",
    "Game Fest": "GF",
    "Deeper Into the Tale": "DIT",
};
