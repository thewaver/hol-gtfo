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

    export const getCardStatsRatio = (atk: number, def: number) => {
        return atk / Math.max(atk + def, 1);
    };

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

    export const getResultCardRarityCost = (card1Rarity: CardRarity, card2Rarity: CardRarity) => {
        const rarityIndex1 = RARITY_INDEXES[card1Rarity];
        const rarityIndex2 = RARITY_INDEXES[card2Rarity];

        return Math.min(rarityIndex1, rarityIndex2);
    };

    export const getResultCardScore = (
        result: CardName,
        card1Rarity: CardRarity,
        card2Rarity: CardRarity,
        powerOpts: CardPowerOpts,
    ) => {
        const { atk, def } = getResultCardStats(result, card1Rarity, card2Rarity, powerOpts.cardLevel);
        const biasRatio = powerOpts.bias / 100;
        const statsRatio = getCardStatsRatio(atk, def);
        const scoreRatio = 1 - Math.abs(biasRatio - statsRatio) * (1 / Math.max(biasRatio, 1 - biasRatio));
        const costRatio = 1 - getResultCardRarityCost(card1Rarity, card2Rarity) * powerOpts.costRatio;

        return Math.round(
            (Math.pow(atk + def, powerOpts.exponent) * scoreRatio * costRatio) / Math.pow(10, powerOpts.exponent - 1),
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

        for (const { card1, card2, result } of PARSED_COMBOS) {
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
                powerOpts.cardLevel,
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

    export async function* getBruteForceBestDeck(
        cardCounts: Record<CardName, CardCount>,
        deckSize: number,
        powerOpts: CardPowerOpts,
        yieldInterval: number = 24999,
        workerCount: number = navigator.hardwareConcurrency,
    ) {
        const { comboMap } = getComboMap(powerOpts, { cardCounts });
        const sortedComboMapKeys = Object.keys(comboMap).sort(
            (a, b) => comboMap[b].totalScore - comboMap[a].totalScore,
        );
        const comboArray = sortedComboMapKeys
            .flatMap((key) =>
                Object.keys(comboMap[key].pairs).map((pair) => ({
                    card1: key,
                    card2: pair,
                    resultScore: comboMap[key].pairs[pair].resultScore,
                })),
            )
            .filter(({ card1, card2 }) => card1 <= card2);
        const sortedCards = sortedComboMapKeys.flatMap((card) => new Array<CardName>(cardCounts[card]).fill(card));
        const setSize = sortedCards.length;
        const allSubsets = generateAllSubsets(setSize, deckSize);
        const totalSubsetCount = binomial(setSize, deckSize);
        const workers = [] as Worker[];

        let bestDeck: { card: CardName; count: CardCount }[] = [];
        let bestScore = 0;
        let computedSubsetCount = 0;

        for (let i = 0; i < workerCount; i++) {
            const worker = new Worker(new URL("./Card.worker.ts", import.meta.url));
            workers.push(worker);
        }

        function dispatchTask(worker: Worker, sets: number[][]) {
            return new Promise<void>((resolve) => {
                const handler = (
                    e: MessageEvent<{
                        bestDeck: { card: CardName; count: CardCount }[];
                        bestScore: number;
                    }>,
                ) => {
                    if (e.data.bestScore > bestScore) {
                        bestDeck = e.data.bestDeck;
                        bestScore = e.data.bestScore;
                    }

                    computedSubsetCount += sets.length;
                    worker.removeEventListener("message", handler);
                    resolve();
                };

                worker.addEventListener("message", handler);
                worker.postMessage({ sortedCards, comboArray, sets, bestScore });
            });
        }

        let isDone = false;

        do {
            await Promise.allSettled(
                workers.map((worker) => {
                    const values = Array.from({ length: yieldInterval })
                        .map(() => {
                            const { value, done } = allSubsets.next();

                            if (!done) {
                                return value;
                            } else {
                                isDone = true;
                            }
                        })
                        .filter(Boolean) as number[][];

                    return dispatchTask(worker, values);
                }),
            );

            yield { bestDeck, bestScore, computedSubsetCount, totalSubsetCount };
        } while (!isDone);

        yield { bestDeck, bestScore, computedSubsetCount, totalSubsetCount };
    }
}
