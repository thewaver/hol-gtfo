import { binomial, generateAllSubsets } from "../../Utils/math";
import { ArrayType } from "../../Utils/utilityTypes";
import { ALL_CARDS, EXPANSION_ACRONYMMS, PARSED_COMBOS, RARITY_INDEXES } from "./Card.const";
import {
    Card,
    CardCount,
    CardDeckOpts,
    CardMap,
    CardName,
    CardPowerOpts,
    CardRarity,
    ComboMap,
    ExpansionName,
} from "./Card.types";

export type ComboArrayFields = keyof ArrayType<ReturnType<typeof CardUtils.getComboArrayFromMap>>;
export type ScoreArrayFields = keyof ArrayType<ReturnType<typeof CardUtils.getScoreArray>>;

export namespace CardUtils {
    export const formatScore = (num: number) => {
        const str = num.toLocaleString("en", {
            notation: "compact",
            maximumSignificantDigits: 4,
        });

        return str.replace(/^([\d.,]+)([^\d\s]+)$/, "$1 $2");
    };

    export const getCardNameAndExpansion = (card: CardName) =>
        `[${EXPANSION_ACRONYMMS[ALL_CARDS[card].expansion]}] ${card}`;

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
            def: baseDefense + bonus,
            atk: baseAttack + bonus,
        };
    };

    export const getResultCardScore = (
        result: CardName,
        card1Rarity: CardRarity,
        card2Rarity: CardRarity,
        powerOpts: CardPowerOpts,
    ) => {
        const { atk, def } = getResultCardStats(result, card1Rarity, card2Rarity, powerOpts.level);
        /*
        return Math.round(
            Math.pow(atk * 2 * powerOpts.bias * 0.01 + def * 2 * (1 - powerOpts.bias * 0.01), powerOpts.exponent),
        );
        */
        return Math.round(
            Math.pow(atk * 2 * powerOpts.bias * 0.01 + def * 2 * (1 - powerOpts.bias * 0.01), powerOpts.exponent) /
                Math.pow(10, powerOpts.exponent - 1),
        );
    };

    export const getUngroupedCards = (cards: Record<CardName, CardCount>) =>
        Object.entries(cards).flatMap(([card, count]) => new Array<CardName>(count).fill(card));

    export const getGroupedCards = (cards: CardName[]) =>
        [...cards].sort().reduce(
            (res, cur) => {
                res[cur] = ((res[cur] ?? 0) + 1) as CardCount;

                return res;
            },
            {} as Record<CardName, CardCount>,
        );

    export const getCardMap = (cardArray: Card[], expansions: Set<ExpansionName>) =>
        cardArray.reduce((res, cur) => {
            if (expansions.has(cur.expansion)) {
                res[cur.name] = cur;
            }

            return res;
        }, {} as CardMap);

    export const getComboMap = (
        powerOpts: CardPowerOpts,
        inclusionOpts?: { cardCounts?: Record<CardName, CardCount>; expansions?: Set<ExpansionName> },
    ) => {
        let symmetricalComboCount = 0;

        const comboMap: ComboMap = {};

        for (const combo of PARSED_COMBOS) {
            const { card1, card2, result } = combo;

            if (
                inclusionOpts?.expansions &&
                (!inclusionOpts.expansions.has(ALL_CARDS[card1].expansion) ||
                    !inclusionOpts.expansions.has(ALL_CARDS[card2].expansion))
            )
                continue;

            if (
                inclusionOpts?.cardCounts &&
                (!inclusionOpts.cardCounts[card1] ||
                    !inclusionOpts.cardCounts[card2] ||
                    (card1 === card2 && inclusionOpts.cardCounts[card1] < 2))
            )
                continue;

            const resultScore = getResultCardScore(result, ALL_CARDS[card1].rarity, ALL_CARDS[card2].rarity, powerOpts);
            const resultStats = getResultCardStats(
                result,
                ALL_CARDS[card1].rarity,
                ALL_CARDS[card2].rarity,
                powerOpts.level,
            );
            const resultRarityIndex = RARITY_INDEXES[ALL_CARDS[result].rarity];
            const newEntry = { result, resultScore, resultStats, resultRarityIndex };

            comboMap[card1] ??= {
                pairs: {},
                totalScore: 0,
            };
            comboMap[card1].pairs = { ...comboMap[card1].pairs, [card2]: newEntry };
            comboMap[card1].totalScore += resultScore;

            comboMap[card2] ??= {
                pairs: {},
                totalScore: 0,
            };
            comboMap[card2].pairs = { ...comboMap[card2].pairs, [card1]: newEntry };
            comboMap[card2].totalScore += resultScore;

            if (card1 === card2) {
                symmetricalComboCount += 1;
            }
        }

        return { comboMap, symmetricalComboCount };
    };

    export const getComboArrayFromMap = (comboMap: ComboMap) =>
        (Object.keys(comboMap ?? {}) as CardName[]).flatMap((card1) => {
            return (Object.keys(comboMap[card1].pairs ?? {}) as CardName[]).map((card2) => {
                const { resultStats, ...rest } = comboMap[card1].pairs[card2];

                return {
                    card1,
                    card2,
                    ...resultStats,
                    ...rest,
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
        const byCard = (Object.keys(comboMap) as CardName[]).reduce(
            (res, card1) => {
                res[card1] = (Object.keys(comboMap[card1].pairs ?? {}) as CardName[]).reduce(
                    (counts, card2) => {
                        const { result } = comboMap[card1].pairs[card2];
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

    export const getScoreArray = (comboMap: ComboMap) => {
        const comboCounts = getComboCounts(comboMap);

        return (Object.keys(comboMap) as CardName[]).map((card) => ({
            card,
            ...comboCounts.byCard[card],
            totalScore: comboMap[card].totalScore,
        }));
    };

    export const getBestDeck = (
        comboMap: ComboMap,
        cardCounts: Record<CardName, CardCount>,
        deckOpts: CardDeckOpts,
    ) => {
        const rarityCounts = { ...deckOpts.maxCardsOfRarity };
        const sortedCardNames = Object.keys(comboMap)
            .sort((a, b) => comboMap[b].totalScore - comboMap[a].totalScore)
            .flatMap((card) => new Array<CardName>(cardCounts[card]).fill(card));
        const deck: CardName[] = [];
        const graph: { pickedCard: CardName; candidateScores: Record<CardName, number> }[] = [];
        const startingCards: CardName[] = deckOpts.autoIncludedCards?.length
            ? deckOpts.autoIncludedCards
            : [sortedCardNames[0]];

        const addToDeck = (pickedCard: CardName, candidateScores: Record<CardName, number>) => {
            deck.push(pickedCard);
            graph.push({ pickedCard, candidateScores });
            sortedCardNames.splice(
                sortedCardNames.findIndex((e) => e === pickedCard),
                1,
            );
            rarityCounts[ALL_CARDS[pickedCard].rarity] -= 1;
        };

        const getCandidateScores = (pickedCards: CardName[]) => {
            const availableSet = new Set(sortedCardNames);
            const pickedSet = new Set(pickedCards);

            return Array.from(pickedSet).reduce(
                (res, card1) => {
                    for (const card2 in comboMap[card1].pairs) {
                        if (!availableSet.has(card2) || !(rarityCounts[ALL_CARDS[card2].rarity] > 0)) continue;

                        res[card2] = (res[card2] ?? 0) + (comboMap[card2].totalScore ?? 0);
                    }

                    return res;
                },
                {} as Record<CardName, number>,
            );
        };

        startingCards.forEach((card) => {
            const candidateScores = deck.length
                ? getCandidateScores(deck)
                : { [card]: comboMap[card].totalScore, ...getCandidateScores([card]) };

            addToDeck(card, candidateScores);
        });

        while (
            deck.length < deckOpts.deckSize &&
            sortedCardNames.length > 0 &&
            Object.values(rarityCounts).reduce((res, cur) => res + cur, 0) > 0
        ) {
            const candidateScores = getCandidateScores(deck);

            let cardName: CardName | undefined;
            let cardScore = 0;

            for (const [candidateName, candidateScore] of Object.entries(candidateScores)) {
                if (candidateScore >= cardScore) {
                    cardScore = candidateScore;
                    cardName = candidateName;
                }
            }

            if (!cardName) break;

            addToDeck(cardName, candidateScores);
        }

        return {
            deck: Object.entries(getGroupedCards(deck)).map(([card, count]) => ({ card, count })),
            graph,
        };
    };

    export function* getBruteForceBestDeck(
        cardCounts: Record<CardName, CardCount>,
        deckSize: number = 30,
        powerOpts: CardPowerOpts,
        yieldInterval: number = 14999,
    ) {
        const ungroupedCards = getUngroupedCards(cardCounts);
        const setSize = ungroupedCards.length;
        const allSubsets = generateAllSubsets(setSize, deckSize);
        const totalSubsetCount = binomial(setSize, deckSize);
        const { comboMap } = getComboMap(powerOpts, { cardCounts });
        const comboArray = Object.keys(comboMap)
            .sort((a, b) => comboMap[b].totalScore - comboMap[a].totalScore)
            .flatMap((key) =>
                Object.keys(comboMap[key].pairs).map((pair) => ({
                    card1: key,
                    card2: pair,
                    resultScore: comboMap[key].pairs[pair].resultScore,
                })),
            )
            .filter(({ card1, card2 }) => card1 <= card2);

        let bestDeck: { card: CardName; count: CardCount }[] = [];
        let bestScore = 0;
        let computedSubsetCount = 0;

        do {
            const { value, done } = allSubsets.next();

            if (done) break;

            computedSubsetCount++;

            const deck = value.map((index) => ungroupedCards[index]);
            const groupedCards = getGroupedCards(deck);
            const totalScore = comboArray.reduce((res, { card1, card2, resultScore }) => {
                if (groupedCards[card1] && groupedCards[card2])
                    return res + Math.min(groupedCards[card1], groupedCards[card2]) * resultScore;
                return res;
            }, 0);

            if (totalScore > bestScore) {
                bestDeck = Object.entries(groupedCards).map(([card, count]) => ({ card, count }));
                bestScore = totalScore;
            }

            if (computedSubsetCount % yieldInterval === 0) {
                yield { bestDeck, bestScore, computedSubsetCount, totalSubsetCount };
            }
        } while (true);

        yield { bestDeck, bestScore, computedSubsetCount, totalSubsetCount };
    }
}
