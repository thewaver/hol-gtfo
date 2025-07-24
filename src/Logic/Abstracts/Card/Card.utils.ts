import { ALL_CARDS } from "./Card.const";
import { Card, CardCombo, CardMap, CardName, CardRarity, ComboMap, ExpansionName } from "./Card.types";

export const getCardPower = (card: Card, powerBias: number) =>
    Math.round(Math.pow(card.baseAttack * powerBias * 0.01 + card.baseDefense * (1 - powerBias * 0.01), 2));

export const getCardMap = (cardArray: Card[], expansions: Set<ExpansionName>) =>
    cardArray.reduce((res, cur) => {
        if (expansions.has(cur.expansion)) {
            res[cur.name] = cur;
        }

        return res;
    }, {} as CardMap);

export const getComboMap = (comboArray: CardCombo[], expansions: Set<ExpansionName>) => {
    let symmetricalComboCount = 0;

    const comboMap: ComboMap = {};
    const comboCounts: Record<CardName, ComboCounts> = {};

    for (const combo of comboArray) {
        const { card1, card2, result } = combo;

        if (!expansions.has(ALL_CARDS[card1].expansion) || !expansions.has(ALL_CARDS[card2].expansion)) continue;

        comboMap[card1] ??= {};
        comboMap[card1][card2] = result;
        comboMap[card2] ??= {};
        comboMap[card2][card1] = result;

        if (card1 === card2) {
            symmetricalComboCount += 1;
        }
    }

    return { comboMap, symmetricalComboCount };
};

export const getComboArray = (comboMap: ComboMap, powerBias: number) =>
    (Object.keys(comboMap ?? {}) as CardName[]).flatMap((card1) => {
        return (Object.keys(comboMap[card1] ?? {}) as CardName[]).map((card2) => {
            const result = comboMap[card1][card2];
            const cardProps = ALL_CARDS[result];
            const { rarity, baseAttack, baseDefense } = cardProps;

            return {
                card1,
                card2,
                result,
                rarity,
                atk: +baseAttack,
                def: +baseDefense,
                power: getCardPower(cardProps, powerBias),
            };
        });
    });

type ComboCounts = { [k in CardRarity]: number };

const EMPTY_COUNTS: ComboCounts = {
    Common: 0,
    Uncommon: 0,
    Rare: 0,
    Epic: 0,
};

export const getComboCounts = (comboMap: ComboMap, expansions: Set<ExpansionName>) => {
    const totals = { ...EMPTY_COUNTS };
    const max = { ...EMPTY_COUNTS };
    const byCard = (Object.keys(ALL_CARDS ?? {}) as CardName[]).reduce(
        (res, card1) => {
            res[card1] = (Object.keys(comboMap[card1] ?? {}) as CardName[]).reduce(
                (counts, card2) => {
                    if (expansions.has(ALL_CARDS[card1].expansion) && expansions.has(ALL_CARDS[card2].expansion)) {
                        const result = comboMap[card1][card2];
                        const { rarity } = ALL_CARDS[result];

                        counts[rarity] += 1;
                        totals[rarity] += 1;
                        max[rarity] = Math.max(max[rarity], counts[rarity]);
                    }

                    return counts;
                },
                { ...EMPTY_COUNTS } as ComboCounts,
            );

            return res;
        },
        {} as Record<CardName, ComboCounts>,
    );

    return { byCard, totals, max };
};

type AbsoluteScore = { score: number; pair: CardName; result: CardName };

export const getAbsoluteScores = (comboMap: ComboMap, expansions: Set<ExpansionName>, powerBias: number) =>
    (Object.keys(ALL_CARDS ?? {}) as CardName[]).reduce(
        (res, card1) => {
            res[card1] = (Object.keys(comboMap[card1] ?? {}) as CardName[]).reduce((sum, card2) => {
                if (expansions.has(ALL_CARDS[card1].expansion) && expansions.has(ALL_CARDS[card2].expansion)) {
                    const result = comboMap[card1][card2];
                    const cardProps = ALL_CARDS[result];
                    const score = getCardPower(cardProps, powerBias);

                    sum.push({ score, pair: card2, result });
                }

                return sum;
            }, [] as AbsoluteScore[]);

            return res;
        },
        {} as Record<CardName, AbsoluteScore[]>,
    );

type RelativeScore = { pairScore: number; resultScore: number; pair: CardName; result: CardName };

export const getRelativeScores = (
    comboMap: ComboMap,
    expansions: Set<ExpansionName>,
    powerBias: number,
    absoluteScores: ReturnType<typeof getAbsoluteScores>,
) =>
    (Object.keys(ALL_CARDS ?? {}) as CardName[]).reduce(
        (res, card1) => {
            res[card1] = (Object.keys(comboMap[card1] ?? {}) as CardName[]).reduce((sum, card2) => {
                if (expansions.has(ALL_CARDS[card1].expansion) && expansions.has(ALL_CARDS[card2].expansion)) {
                    const result = comboMap[card1][card2];
                    const resultScore = getCardPower(ALL_CARDS[result], powerBias);
                    const pairScore = absoluteScores[card2].reduce((sum, { score }) => sum + score, 0);

                    sum.push({ pairScore, resultScore, pair: card2, result });
                }

                return sum;
            }, [] as RelativeScore[]);

            return res;
        },
        {} as Record<CardName, RelativeScore[]>,
    );

export const getScoreArray = (
    absoluteScores: ReturnType<typeof getAbsoluteScores>,
    relativeScores: ReturnType<typeof getRelativeScores>,
    comboCounts: ReturnType<typeof getComboCounts>["byCard"],
) =>
    (Object.keys(relativeScores ?? {}) as CardName[]).map((card) => ({
        card,
        ...comboCounts[card],
        absoluteScore: absoluteScores[card].reduce((sum, { score }) => sum + score, 0),
        relativeScore: relativeScores[card].reduce(
            (sum, { pairScore, resultScore }) => sum + pairScore * resultScore,
            0,
        ),
    }));
