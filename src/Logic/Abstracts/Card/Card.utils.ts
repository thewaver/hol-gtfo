import { binomial, generateAllSubsets } from "../../Utils/math";
import { ArrayType } from "../../Utils/utilityTypes";
import { ALL_CARDS, EXPANSION_ACRONYMMS, PARSED_COMBOS, RARITY_INDEXES } from "./Card.const";
import {
    Card,
    CardCombo,
    CardCount,
    CardDeckOpts,
    CardMap,
    CardName,
    CardPowerOpts,
    CardRarity,
    ComboMap,
    ExpansionName,
} from "./Card.types";

export type ComboArrayFields = keyof ArrayType<ReturnType<typeof CardUtils.getComboArray>>;
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

    export const getResultCardPower = (
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
        comboArray: CardCombo[],
        opts?: { cardCounts?: Record<CardName, CardCount>; expansions?: Set<ExpansionName> },
    ) => {
        let symmetricalComboCount = 0;

        const comboMap: ComboMap = {};

        for (const combo of comboArray) {
            const { card1, card2, result } = combo;

            if (
                opts?.expansions &&
                (!opts.expansions.has(ALL_CARDS[card1].expansion) || !opts.expansions.has(ALL_CARDS[card2].expansion))
            )
                continue;

            if (
                opts?.cardCounts &&
                (!opts.cardCounts[card1] || !opts.cardCounts[card2] || (card1 === card2 && opts.cardCounts[card1] < 2))
            )
                continue;

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
        cardCounts: Record<CardName, CardCount>,
        deckOpts: CardDeckOpts,
    ) => {
        const rarityCounts = { ...deckOpts.maxCardsOfRarity };
        const absoluteScoreSums = Object.fromEntries(
            Object.keys(absoluteScores).map((card) => [
                card,
                absoluteScores[card].reduce((sum, { resultScore: score }) => sum + score, 0),
            ]),
        );
        const sortedCardNames = Object.keys(comboMap)
            .sort((a, b) => absoluteScoreSums[b] - absoluteScoreSums[a])
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
                    for (const card2 in comboMap[card1]) {
                        if (!availableSet.has(card2) || !(rarityCounts[ALL_CARDS[card2].rarity] > 0)) continue;

                        res[card2] = (res[card2] ?? 0) + (absoluteScoreSums[card2] ?? 0);
                    }

                    return res;
                },
                {} as Record<CardName, number>,
            );
        };

        startingCards.forEach((card) => {
            const candidateScores = deck.length
                ? getCandidateScores(deck)
                : { [card]: absoluteScoreSums[card], ...getCandidateScores([card]) };

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
        cards: Record<CardName, CardCount>,
        deckSize: number = 30,
        powerOpts: CardPowerOpts,
        yieldInterval: number = 10000,
    ) {
        const cardArray = getUngroupedCards(cards);
        const setSize = cardArray.length;
        const allSubsets = generateAllSubsets(setSize, deckSize);
        const totalSubsetCount = binomial(setSize, deckSize);

        let bestDeck: { card: CardName; count: CardCount }[] = [];
        let bestScore = 0;
        let computedSubsetCount = 0;

        do {
            const { value, done } = allSubsets.next();

            if (done) break;

            computedSubsetCount++;

            const deck = value.map((index) => cardArray[index]);
            const cardCounts = getGroupedCards(deck);
            const { comboMap } = getComboMap(PARSED_COMBOS, { cardCounts });
            const absoluteScores = getAbsoluteScores(comboMap, powerOpts);
            const totalScore = Object.values(absoluteScores).reduce(
                (totalSum, scores) =>
                    totalSum + scores.reduce((currentSum, score) => currentSum + score.resultScore, 0),
                0,
            );

            if (totalScore > bestScore) {
                bestDeck = Object.entries(cardCounts).map(([card, count]) => ({ card, count }));
                bestScore = totalScore;

                yield { bestDeck, bestScore, computedSubsetCount, totalSubsetCount };
            } else if (computedSubsetCount % yieldInterval === 0) {
                yield { bestDeck, bestScore, computedSubsetCount, totalSubsetCount };
            }
        } while (true);

        yield { bestDeck, bestScore, computedSubsetCount, totalSubsetCount };
    }
}
