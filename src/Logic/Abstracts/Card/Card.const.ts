import { parseCSV } from "../../Utils/csv";
import { Card, CardCombo, CardName, CardRarity } from "./Card.types";
import cardsCSV from "./cards.csv?raw";
import combosCSV from "./combos.csv?raw";

export const CARD_RANK_SCORES: Record<CardRarity, number> = {
    Common: 1,
    Uncommon: 4,
    Rare: 12,
    Epic: 24,
};

const PARSED_CARDS = parseCSV(cardsCSV) as unknown as Card[];

export const CARDS = PARSED_CARDS.reduce(
    (res, cur) => {
        res[cur.name] = cur;

        return res;
    },
    {} as Record<CardName, Card>,
);

const PARSED_COMBOS = parseCSV(combosCSV) as unknown as CardCombo[];

export const [CARD_COMBOS, SYMMETRICAL_PAIR_COUNT] = (() => {
    let symmetricalComboCount = 0;

    const comboMap: Partial<Record<CardName, Partial<Record<CardName, CardName>>>> = {};

    for (const combo of PARSED_COMBOS) {
        const { card1, card2, result } = combo;

        comboMap[card1] ??= {};
        comboMap[card1][card2] = result;
        comboMap[card2] ??= {};
        comboMap[card2][card1] = result;

        if (card1 === card2) {
            symmetricalComboCount += 1;
        }
    }

    return [comboMap, symmetricalComboCount];
})();

export const CARD_COMBO_ARRAY: Array<{
    card1: CardName;
    card2: CardName;
    result: CardName;
    rarity: CardRarity;
    atk: number;
    def: number;
    power: number;
}> = (Object.keys(CARD_COMBOS) as CardName[]).flatMap((card1) => {
    return (Object.keys(CARD_COMBOS[card1]!) as CardName[]).map((card2) => {
        const result = CARD_COMBOS[card1]![card2]!;
        const { rarity, baseAttack, baseDefense } = CARDS[result];

        return { card1, card2, result, rarity, atk: +baseAttack, def: +baseDefense, power: +baseAttack + +baseDefense };
    });
});

export const CARD_ABSOLUTE_SCORES = (Object.keys(CARDS) as CardName[]).reduce(
    (res, card1) => {
        res[card1] = (Object.keys(CARD_COMBOS[card1] ?? {}) as CardName[]).reduce(
            (sum, card2) => {
                const result = CARD_COMBOS[card1]![card2]!;
                const score = CARD_RANK_SCORES[CARDS[result].rarity];

                sum.push({ score, pair: card2, result });

                return sum;
            },
            [] as { score: number; pair: CardName; result: CardName }[],
        );

        return res;
    },
    {} as Record<CardName, { score: number; pair: CardName; result: CardName }[]>,
);

export const CARD_RELATIVE_SCORES = (Object.keys(CARDS) as CardName[]).reduce(
    (res, card1) => {
        res[card1] = (Object.keys(CARD_COMBOS[card1] ?? {}) as CardName[]).reduce(
            (sum, card2) => {
                const result = CARD_COMBOS[card1]![card2]!;
                const resultScore = CARD_RANK_SCORES[CARDS[result].rarity];
                const pairScore = CARD_ABSOLUTE_SCORES[card2].reduce((sum, { score }) => sum + score, 0);

                sum.push({ pairScore, resultScore, pair: card2, result });

                return sum;
            },
            [] as { pairScore: number; resultScore: number; pair: CardName; result: CardName }[],
        );

        return res;
    },
    {} as Record<CardName, { pairScore: number; resultScore: number; pair: CardName; result: CardName }[]>,
);

export const CARD_SCORE_ARRAY = (Object.keys(CARD_RELATIVE_SCORES) as CardName[]).map((card) => ({
    card,
    absoluteScore: CARD_ABSOLUTE_SCORES[card].reduce((sum, { score }) => sum + score, 0),
    relativeScore: CARD_RELATIVE_SCORES[card].reduce(
        (sum, { pairScore, resultScore }) => sum + pairScore * resultScore,
        0,
    ),
}));
