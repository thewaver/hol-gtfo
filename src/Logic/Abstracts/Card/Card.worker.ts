import { CardCount, CardName } from "./Card.types";

type WorkerData = {
    sets: number[][];
    comboArray: {
        card1: CardName;
        card2: CardName;
        resultScore: number;
    }[];
    sortedCards: CardName[];
    bestScore: number;
};

function getGroupedCards(cards: CardName[]) {
    return [...cards].sort().reduce(
        (res, cur) => {
            res[cur] = ((res[cur] ?? 0) + 1) as CardCount;

            return res;
        },
        {} as Record<CardName, CardCount>,
    );
}

self.onmessage = (e: MessageEvent<WorkerData>) => {
    const { sets, comboArray, sortedCards } = e.data;

    let bestDeck: { card: CardName; count: CardCount }[] = [];
    let bestScore = e.data.bestScore;

    for (let set of sets) {
        const deck = set.map((index) => sortedCards[index - 1]);
        const groupedCards = getGroupedCards(deck);
        const differentCardCount = Object.keys(groupedCards).length;
        const scoredCards = new Set<CardName>();

        let totalScore = 0;

        for (let { card1, card2, resultScore } of comboArray) {
            if (groupedCards[card1] && groupedCards[card2]) {
                totalScore += Math.min(groupedCards[card1], groupedCards[card2]) * resultScore;
                scoredCards.add(card1);
                scoredCards.add(card2);

                if (scoredCards.size >= differentCardCount) break;
            }
        }

        if (totalScore > bestScore) {
            bestDeck = Object.entries(groupedCards).map(([card, count]) => ({ card, count }));
            bestScore = totalScore;
        }
    }

    self.postMessage({ bestScore, bestDeck });
};
