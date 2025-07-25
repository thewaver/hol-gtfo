import { parseCSV } from "../../Utils/csv";
import { CARD_RARITIES, Card, CardCombo, CardMap } from "./Card.types";
import cardsCSV from "./cards.csv?raw";
import combosCSV from "./combos.csv?raw";

export const RARITY_INDEXES = Object.fromEntries(CARD_RARITIES.map((value, index) => [value, index]));

export const PARSED_CARDS = parseCSV(cardsCSV) as unknown as Card[];

export const ALL_CARDS = PARSED_CARDS.reduce((res, cur) => {
    res[cur.name] = cur;

    return res;
}, {} as CardMap);

export const ALL_EXPANSIONS = new Set(PARSED_CARDS.map((card) => card.expansion));

export const PARSED_COMBOS = parseCSV(combosCSV) as unknown as CardCombo[];
