import { ArrayType } from "../../Utils/utilityTypes";
import { ALL_CARDS, RARITY_INDEXES } from "./Card.const";
import { Card, CardCombo, CardMap, CardName, CardPowerOpts, CardRarity, ComboMap, ExpansionName } from "./Card.types";

export type ComboArrayFields = keyof ArrayType<ReturnType<typeof CardUtils.getComboArray>>;
export type ScoreArrayFields = keyof ArrayType<ReturnType<typeof CardUtils.getScoreArray>>;

export namespace CardUtils {
    export const getResultCardStats = (
        result: CardName,
        card1Rarity: CardRarity,
        card2Rarity: CardRarity,
        level: number,
    ) => {
        const { baseAttack, baseDefense, rarity } = ALL_CARDS[result];
        const adjutedLevel = RARITY_INDEXES[rarity] >= 2 ? level + 1 : level;
        const highestBasicCardRarityIndex = Math.max(RARITY_INDEXES[card1Rarity], RARITY_INDEXES[card2Rarity]) + 1;
        const bonus = (adjutedLevel - 1) * highestBasicCardRarityIndex;

        return {
            def: Number(baseDefense) + bonus,
            atk: Number(baseAttack) + bonus,
        };
    };

    export const getResultCardPower = (
        result: CardName,
        card1Rarity: CardRarity,
        card2Rarity: CardRarity,
        powerOpts: CardPowerOpts,
    ) => {
        const { atk, def } = getResultCardStats(result, card1Rarity, card2Rarity, powerOpts.level);

        return Math.round(
            Math.pow(atk * 2 * powerOpts.bias * 0.01 + def * 2 * (1 - powerOpts.bias * 0.01), powerOpts.exponent) /
                Math.pow(10, powerOpts.exponent - 1),
        );
    };

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

    export const getComboArray = (comboMap: ComboMap, powerOpts: CardPowerOpts) =>
        (Object.keys(comboMap ?? {}) as CardName[]).flatMap((card1) => {
            return (Object.keys(comboMap[card1] ?? {}) as CardName[]).map((card2) => {
                const result = comboMap[card1][card2];

                return {
                    card1,
                    card2,
                    result,
                    rarityIndex: RARITY_INDEXES[ALL_CARDS[result].rarity],
                    ...getResultCardStats(result, ALL_CARDS[card1].rarity, ALL_CARDS[card2].rarity, powerOpts.level),
                    power: getResultCardPower(result, ALL_CARDS[card1].rarity, ALL_CARDS[card2].rarity, powerOpts),
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

    export const getComboCounts = (comboMap: ComboMap) => {
        const totals = { ...EMPTY_COUNTS };
        const max = { ...EMPTY_COUNTS };
        const byCard = (Object.keys(ALL_CARDS ?? {}) as CardName[]).reduce(
            (res, card1) => {
                res[card1] = (Object.keys(comboMap[card1] ?? {}) as CardName[]).reduce(
                    (counts, card2) => {
                        const result = comboMap[card1][card2];
                        const { rarity } = ALL_CARDS[result];

                        counts[rarity] += 1;
                        totals[rarity] += 1;
                        max[rarity] = Math.max(max[rarity], counts[rarity]);

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

    type AbsoluteScore = { pair: CardName; result: CardName; resultScore: number };

    export const getAbsoluteScores = (comboMap: ComboMap, powerOpts: CardPowerOpts) =>
        (Object.keys(ALL_CARDS ?? {}) as CardName[]).reduce(
            (res, card1) => {
                res[card1] = (Object.keys(comboMap[card1] ?? {}) as CardName[]).reduce((sum, card2) => {
                    const result = comboMap[card1][card2];
                    const score = getResultCardPower(
                        result,
                        ALL_CARDS[card1].rarity,
                        ALL_CARDS[card2].rarity,
                        powerOpts,
                    );

                    sum.push({ resultScore: score, pair: card2, result });

                    return sum;
                }, [] as AbsoluteScore[]);

                return res;
            },
            {} as Record<CardName, AbsoluteScore[]>,
        );

    export const getScoreArray = (
        absoluteScores: ReturnType<typeof getAbsoluteScores>,
        comboCounts: ReturnType<typeof getComboCounts>["byCard"],
    ) =>
        (Object.keys(absoluteScores ?? {}) as CardName[]).map((card) => ({
            card,
            ...comboCounts[card],
            absoluteScore: absoluteScores[card].reduce((sum, { resultScore: score }) => sum + score, 0),
        }));

    export const getBestDeck = (
        comboMap: ComboMap,
        absoluteScores: ReturnType<typeof getAbsoluteScores>,
        deckSize: number = 30,
    ) => {
        const absoluteScoreSums = Object.fromEntries(
            Object.keys(absoluteScores).map((card) => [
                card,
                absoluteScores[card].reduce((sum, { resultScore: score }) => sum + score, 0),
            ]),
        );

        const sortedCardNames = Object.keys(comboMap)
            .sort((a, b) => absoluteScoreSums[b] - absoluteScoreSums[a])
            .flatMap((card) => new Array<CardName>(3 - RARITY_INDEXES[ALL_CARDS[card].rarity]).fill(card));

        let currentCard = sortedCardNames.shift()!;

        const deck: CardName[] = [currentCard];

        while (sortedCardNames.length > 0 && deck.length < deckSize) {
            const candidates = comboMap[currentCard];

            let foundCard = false;

            for (let i = 0; i < sortedCardNames.length; i++) {
                const cardName = sortedCardNames[i];

                if (candidates[cardName]) {
                    foundCard = true;
                    currentCard = cardName;
                    deck.push(cardName);
                    sortedCardNames.splice(i, 1);

                    break;
                }
            }

            if (!foundCard) break;
        }

        return deck.sort();
    };
}
