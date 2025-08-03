import { For, createMemo } from "solid-js";

import { CARD_RARITIES } from "../../../Logic/Abstracts/Card/Card.types";
import { AppStore } from "../../App.store";
import { DeckSettingsProps } from "./DeckSettings.types";

export const DeckSettings = (props: DeckSettingsProps) => {
    const getCardRarities = createMemo(() => {
        const result = [...CARD_RARITIES];
        result.pop();

        return result;
    });

    return (
        <>
            <span>{"Max total cards by rarity"}</span>
            <For each={getCardRarities()}>
                {(rarity) => (
                    <label>
                        <span>{rarity}</span>
                        <input
                            type="number"
                            min={0}
                            max={30}
                            step={1}
                            value={AppStore.deckSettings.maxCardsOfRarity[rarity]}
                            onChange={(e) => {
                                AppStore.setDeckSettings("maxCardsOfRarity", rarity, Number(e.target.value));
                            }}
                        />
                    </label>
                )}
            </For>
        </>
    );
};
