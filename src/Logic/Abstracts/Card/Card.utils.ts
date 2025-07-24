import { ALL_CARDS, CARD_RANK_SCORES } from "./Card.const";
import { Card, CardCombo, CardMap, CardName, ComboMap, ExpansionName } from "./Card.types";

export const getCardPower = (card: Card, powerBias: number) =>
    Math.round(card.baseAttack * 2 * powerBias * 0.01 + card.baseDefense * 2 * (1 - powerBias * 0.01));

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

export const getAbsoluteCardScores = (comboMap: ComboMap, expansions: Set<ExpansionName>, powerBias: number) =>
    (Object.keys(ALL_CARDS ?? {}) as CardName[]).reduce(
        (res, card1) => {
            res[card1] = (Object.keys(comboMap[card1] ?? {}) as CardName[]).reduce(
                (sum, card2) => {
                    if (expansions.has(ALL_CARDS[card1].expansion) && expansions.has(ALL_CARDS[card2].expansion)) {
                        const result = comboMap[card1][card2];
                        const cardProps = ALL_CARDS[result];
                        const score = CARD_RANK_SCORES[cardProps.rarity] * getCardPower(cardProps, powerBias);

                        sum.push({ score, pair: card2, result });
                    }

                    return sum;
                },
                [] as { score: number; pair: CardName; result: CardName }[],
            );

            return res;
        },
        {} as Record<CardName, { score: number; pair: CardName; result: CardName }[]>,
    );

export const getCardRelativeScores = (
    comboMap: ComboMap,
    expansions: Set<ExpansionName>,
    absoluteScores: ReturnType<typeof getAbsoluteCardScores>,
) =>
    (Object.keys(ALL_CARDS ?? {}) as CardName[]).reduce(
        (res, card1) => {
            res[card1] = (Object.keys(comboMap[card1] ?? {}) as CardName[]).reduce(
                (sum, card2) => {
                    if (expansions.has(ALL_CARDS[card1].expansion) && expansions.has(ALL_CARDS[card2].expansion)) {
                        const result = comboMap[card1][card2];
                        const resultScore = CARD_RANK_SCORES[ALL_CARDS[result].rarity];
                        const pairScore = absoluteScores[card2].reduce((sum, { score }) => sum + score, 0);

                        sum.push({ pairScore, resultScore, pair: card2, result });
                    }

                    return sum;
                },
                [] as { pairScore: number; resultScore: number; pair: CardName; result: CardName }[],
            );

            return res;
        },
        {} as Record<CardName, { pairScore: number; resultScore: number; pair: CardName; result: CardName }[]>,
    );

export const getScoreArray = (
    absoluteScores: ReturnType<typeof getAbsoluteCardScores>,
    relativeScores: ReturnType<typeof getCardRelativeScores>,
) =>
    (Object.keys(relativeScores ?? {}) as CardName[]).map((card) => ({
        card,
        absoluteScore: absoluteScores[card].reduce((sum, { score }) => sum + score, 0),
        relativeScore: relativeScores[card].reduce(
            (sum, { pairScore, resultScore }) => sum + pairScore * resultScore,
            0,
        ),
    }));
