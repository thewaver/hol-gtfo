import { For, Show, createMemo, createSignal } from "solid-js";

import { ALL_CARDS, ALL_EXPANSIONS } from "../../../Logic/Abstracts/Card/Card.const";
import { CARD_RARITIES, CardCount, CardRarity, ExpansionName } from "../../../Logic/Abstracts/Card/Card.types";
import { AppStore } from "../../App.store";
import { SettingsGroup } from "../../Components/SettingsGroup/SettingsGroup";
import { Grid } from "../../Fundamentals/Grid/Grid";
import { GridHeader } from "../../Fundamentals/Grid/GridHeader/GridHeader";
import { RarityLabel } from "../../Fundamentals/RarityLabel/RarityLabel";
import { Surface } from "../../Fundamentals/Surface/Surface";
import { Title } from "../../Fundamentals/Title/Title";

const TEMPLATE_COLUMNS = "repeat(1, minmax(120px, auto)) repeat(1, minmax(40px, auto))";
const LONG_EXPANSIONS: ExpansionName[] = ["Base Game", "Forbidden Depths"] as const;

export const MyCardsPage = () => {
    const [getExpansionCardCount, setExpansionCardCount] = createSignal<CardCount>(3);
    const [getExpansionCardRarity, setExpansionCardRarity] = createSignal<CardRarity | "All">("All");

    const getCardRarities = createMemo(() => {
        const result = [...CARD_RARITIES];
        result.pop();

        return result;
    });

    return (
        <For each={Array.from(ALL_EXPANSIONS)}>
            {(expansion) => {
                return (
                    <>
                        <Title>{expansion}</Title>

                        <Show when={LONG_EXPANSIONS.includes(expansion)}>
                            <Surface>
                                <SettingsGroup>
                                    <span>{"Set"}</span>
                                    <select
                                        value={getExpansionCardRarity()}
                                        onChange={(e) => setExpansionCardRarity(e.target.value as CardRarity)}
                                    >
                                        <option value={"All"}>{"All"}</option>
                                        <For each={getCardRarities()}>
                                            {(rarity) => <option value={rarity}>{rarity}</option>}
                                        </For>
                                    </select>
                                    <span>{"to"}</span>
                                    <label title="count">
                                        <input
                                            type="number"
                                            min={0}
                                            max={3}
                                            step={1}
                                            value={getExpansionCardCount()}
                                            onChange={(e) => {
                                                setExpansionCardCount(
                                                    Math.max(Math.min(Number(e.target.value), 3), 0) as CardCount,
                                                );
                                            }}
                                        />
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            AppStore.setMyCardCounts((prev) =>
                                                Object.fromEntries(
                                                    Object.entries(prev).map(([key, value]) => {
                                                        if (
                                                            ALL_CARDS[key].expansion !== expansion ||
                                                            (getExpansionCardRarity() !== "All" &&
                                                                getExpansionCardRarity() !== ALL_CARDS[key].rarity)
                                                        )
                                                            return [key, value];
                                                        return [key, getExpansionCardCount()];
                                                    }),
                                                ),
                                            );
                                        }}
                                    >
                                        {"Apply"}
                                    </button>
                                </SettingsGroup>
                            </Surface>
                        </Show>

                        <Surface>
                            <Grid templateColumns={() => TEMPLATE_COLUMNS} center={() => true}>
                                <GridHeader>
                                    <div>{"Card"}</div>
                                    <div>{"Count"}</div>
                                </GridHeader>

                                <For each={Object.entries(AppStore.myCardCounts)}>
                                    {([card, count]) => {
                                        return ALL_CARDS[card].expansion === expansion && ALL_CARDS[card].isBasic ? (
                                            <>
                                                <RarityLabel rarity={() => ALL_CARDS[card].rarity}>{card}</RarityLabel>
                                                <label title="Determines ATK and DEF in conjunction with rarity">
                                                    <input
                                                        type="number"
                                                        min={0}
                                                        max={3}
                                                        step={1}
                                                        value={count}
                                                        onChange={(e) => {
                                                            AppStore.setMyCardCounts(
                                                                card,
                                                                Math.max(
                                                                    Math.min(Number(e.target.value), 3),
                                                                    0,
                                                                ) as CardCount,
                                                            );
                                                        }}
                                                    />
                                                </label>
                                            </>
                                        ) : null;
                                    }}
                                </For>
                            </Grid>
                        </Surface>
                    </>
                );
            }}
        </For>
    );
};
