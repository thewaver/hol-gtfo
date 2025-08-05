import { For, createMemo, createSignal } from "solid-js";

import { ALL_CARDS, PARSED_COMBOS } from "../../../Logic/Abstracts/Card/Card.const";
import { CARD_RARITIES } from "../../../Logic/Abstracts/Card/Card.types";
import { CardUtils, ComboArrayFields } from "../../../Logic/Abstracts/Card/Card.utils";
import { sortArray } from "../../../Logic/Utils/array";
import { AppStore } from "../../App.store";
import { Expansions } from "../../Components/Expansions/Expansions";
import { PowerSettings } from "../../Components/PowerSettings/PowerSettings";
import { SettingsGroup } from "../../Components/SettingsGroup/SettingsGroup";
import { Grid } from "../../Fundamentals/Grid/Grid";
import { GridHeader } from "../../Fundamentals/Grid/GridHeader/GridHeader";
import { GridRow } from "../../Fundamentals/Grid/GridRow/GridRow";
import { RarityLabel } from "../../Fundamentals/RarityLabel/RarityLabel";
import { Surface } from "../../Fundamentals/Surface/Surface";
import { Title } from "../../Fundamentals/Title/Title";

const TEMPLATE_COLUMNS = "repeat(3, minmax(120px, auto)) repeat(3, minmax(40px, auto)) repeat(1, minmax(80px, auto))";

export const CombosPage = () => {
    const [getComboSortFields, setComboSortFields] = createSignal<ComboArrayFields[]>(["card1", "card2"]);
    const [getComboSortColIndex, setComboSortColIndex] = createSignal(0);
    const [getComboSortColDir, setComboSortColDir] = createSignal<"🠋" | "🠉">("🠋");

    const getComputedData = createMemo(() => {
        const powerOpts = {
            bias: AppStore.getPowerBias(),
            exponent: AppStore.getPowerExponent(),
            level: AppStore.getCardLevel(),
        };
        const { comboMap, symmetricalComboCount } = CardUtils.getComboMap(PARSED_COMBOS, {
            expansions: AppStore.getExpansions(),
        });
        const comboArray = CardUtils.getComboArray(comboMap, powerOpts);
        const result = sortArray(comboArray, ...getComboSortFields());

        return {
            comboRows: getComboSortColDir() === "🠋" ? result : result.reverse(),
            symmetricalComboCount,
        };
    });

    const handleComboHeaderClick = (colIndex: number, ...keys: ComboArrayFields[]) => {
        const isSameColIndex = getComboSortColIndex() === colIndex;

        setComboSortColDir((prev) => (isSameColIndex ? (prev === "🠉" ? "🠋" : "🠉") : "🠋"));
        setComboSortColIndex(colIndex);
        setComboSortFields(keys);
    };

    return (
        <>
            <Surface>
                <SettingsGroup>
                    <PowerSettings />
                </SettingsGroup>
            </Surface>
            <Surface>
                <SettingsGroup>
                    <Expansions />
                </SettingsGroup>
            </Surface>

            <Surface unpadded={() => true}>
                <Grid templateColumns={() => TEMPLATE_COLUMNS}>
                    <GridHeader>
                        <button onClick={() => handleComboHeaderClick(0, "card1", "card2")}>
                            {"Card " + (getComboSortColIndex() === 0 ? getComboSortColDir() : "")}
                        </button>
                        <div>{"Pair"}</div>
                        <button onClick={() => handleComboHeaderClick(2, "result", "card1")}>
                            {"Result " + (getComboSortColIndex() === 2 ? getComboSortColDir() : "")}
                        </button>
                        <button onClick={() => handleComboHeaderClick(3, "atk", "result", "card1")}>
                            {"Atk " + (getComboSortColIndex() === 3 ? getComboSortColDir() : "")}
                        </button>
                        <button onClick={() => handleComboHeaderClick(4, "def", "result", "card1")}>
                            {"Def " + (getComboSortColIndex() === 4 ? getComboSortColDir() : "")}
                        </button>
                        <button onClick={() => handleComboHeaderClick(5, "power", "result", "card1")}>
                            {"Pwr " + (getComboSortColIndex() === 5 ? getComboSortColDir() : "")}
                        </button>
                        <button onClick={() => handleComboHeaderClick(6, "rarityIndex", "result", "card1")}>
                            {"Rarity " + (getComboSortColIndex() === 6 ? getComboSortColDir() : "")}
                        </button>
                    </GridHeader>

                    <For each={getComputedData().comboRows}>
                        {(row, getIndex) => {
                            return (
                                <GridRow index={getIndex}>
                                    <RarityLabel rarity={() => ALL_CARDS[row.card1].rarity}>
                                        {CardUtils.getCardNameAndExpansion(row.card1)}
                                    </RarityLabel>
                                    <RarityLabel rarity={() => ALL_CARDS[row.card2].rarity}>
                                        {CardUtils.getCardNameAndExpansion(row.card2)}
                                    </RarityLabel>
                                    <RarityLabel rarity={() => ALL_CARDS[row.result].rarity}>{row.result}</RarityLabel>
                                    <div>{CardUtils.formatScore(row.atk)}</div>
                                    <div>{CardUtils.formatScore(row.def)}</div>
                                    <div>{CardUtils.formatScore(row.power)}</div>
                                    <RarityLabel rarity={() => ALL_CARDS[row.result].rarity}>
                                        {CARD_RARITIES[row.rarityIndex]}
                                    </RarityLabel>
                                </GridRow>
                            );
                        }}
                    </For>
                </Grid>
            </Surface>

            <Title>{`${(getComputedData().comboRows.length - getComputedData().symmetricalComboCount) / 2 + getComputedData().symmetricalComboCount} entries as of 05/08/2025\nCards shown are not affected by "My Deck"`}</Title>
        </>
    );
};
