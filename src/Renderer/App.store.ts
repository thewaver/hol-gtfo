import { createEffect, createSignal } from "solid-js";
import { createStore } from "solid-js/store";

import { ALL_CARDS, PARSED_CARDS } from "../Logic/Abstracts/Card/Card.const";
import { CardCount, CardDeckOpts, CardName, ExpansionName } from "../Logic/Abstracts/Card/Card.types";

const CARD_COUNT_BY_RARITY: Record<CardName, CardCount> = { Common: 3, Uncommon: 2, Rare: 1, Epic: 0 };

const getStoredMyCards = (): Record<CardName, CardCount> => {
    const allCards = Object.fromEntries(
        PARSED_CARDS.filter((card) => card.isBasic).map((card) => [card.name, CARD_COUNT_BY_RARITY[card.rarity]]),
    );
    const userCards = localStorage.getItem("MY_CARDS");
    const parsedUserCards = userCards ? (JSON.parse(userCards) as Record<CardName, CardCount>) : {};

    return {
        ...allCards,
        ...Object.fromEntries(
            Object.keys(parsedUserCards)
                .filter((card) => ALL_CARDS[card].isBasic)
                .map((card) => [card, parsedUserCards[card]]),
        ),
    };
};

const setStoredMyCards = (cards: Record<CardName, CardCount>) => {
    localStorage.setItem("MY_CARDS", JSON.stringify(cards));
};

export namespace AppStore {
    export const [getExpansions, setExpansuions] = createSignal<Set<ExpansionName>>(new Set(["Base Game"]));
    export const [getPowerBias, setPowerBias] = createSignal(60);
    export const [getPowerExponent, setPowerExponent] = createSignal(3);
    export const [getCostRatio, setCostRatio] = createSignal(0.1);
    export const [getCardLevel, setCardLevel] = createSignal(4);
    export const [deckSettings, setDeckSettings] = createStore<CardDeckOpts>({
        deckSize: 30,
        maxCardsOfRarity: { Common: 30, Uncommon: 30, Rare: 10, Epic: 0 },
    });
    export const [myCardCounts, setMyCardCounts] = createStore(getStoredMyCards());

    createEffect(() => {
        setStoredMyCards(myCardCounts);
    });
}
