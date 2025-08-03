import { createEffect, createSignal } from "solid-js";
import { createStore } from "solid-js/store";

import { PARSED_CARDS } from "../Logic/Abstracts/Card/Card.const";
import { CardCount, CardDeckOpts, CardName, ExpansionName } from "../Logic/Abstracts/Card/Card.types";

const CARD_COUNT_BY_RARITY: Record<CardName, CardCount> = { Common: 3, Uncommon: 2, Rare: 1, Epic: 0 };

const getStoredMyCards = (): Record<CardName, CardCount> => {
    const storedCards = localStorage.getItem("MY_CARDS");
    const result = storedCards
        ? (JSON.parse(storedCards) as Record<CardName, CardCount>)
        : Object.fromEntries(
              PARSED_CARDS.filter((card) => card.isBasic).map((card) => [card.name, CARD_COUNT_BY_RARITY[card.rarity]]),
          );

    return result;
};

const setStoredMyCards = (cards: Record<CardName, CardCount>) => {
    localStorage.setItem("MY_CARDS", JSON.stringify(cards));
};

export namespace AppStore {
    export const [getExpansions, setExpansuions] = createSignal<Set<ExpansionName>>(new Set(["Base Game"]));
    export const [getPowerBias, setPowerBias] = createSignal(60);
    export const [getPowerExponent, setPowerExponent] = createSignal(3);
    export const [getCardLevel, setCardLevel] = createSignal(4);
    export const [deckSettings, setDeckSettings] = createStore<CardDeckOpts>({
        maxCardsOfRarity: { Common: 30, Uncommon: 10, Rare: 5, Epic: 0 },
    });
    export const [myCardCounts, setMyCardCounts] = createStore(getStoredMyCards());

    createEffect(() => {
        setStoredMyCards(myCardCounts);
    });
}
