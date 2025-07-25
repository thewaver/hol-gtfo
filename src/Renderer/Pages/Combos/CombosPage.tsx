import { For, createMemo, createSignal } from "solid-js";

import { ALL_CARDS } from "../../../Logic/Abstracts/Card/Card.const";
import { CardUtils, ComboArrayFields } from "../../../Logic/Abstracts/Card/Card.utils";
import { sortArray } from "../../../Logic/Utils/array";
import { AppStore } from "../../App.store";
import { Expansions } from "../../Components/Expansions/Expansions";
import { PowerBias } from "../../Components/PowerBias/PowerBias";
import { SettingsGroup } from "../../Components/SettingsGroup/SettingsGroup";
import { Grid } from "../../Fundamentals/Grid/Grid";
import { GridHeader } from "../../Fundamentals/Grid/GridHeader/GridHeader";
import { RarityLabel } from "../../Fundamentals/RarityLabel/RarityLabel";
import { Surface } from "../../Fundamentals/Surface/Surface";
import { Title } from "../../Fundamentals/Title/Title";
import { CombosPageProps } from "./CombosPage.types";

const TEMPLATE_COLUMNS = "repeat(3, minmax(120px, auto)) repeat(3, minmax(40px, auto)) repeat(1, minmax(120px, auto))";

export const CombosPage = (props: CombosPageProps) => {
    const [getComboSortFields, setComboSortFields] = createSignal<ComboArrayFields[]>(["card1", "card2"]);
    const [getComboSortColIndex, setComboSortColIndex] = createSignal(0);
    const [getComboSortColDir, setComboSortColDir] = createSignal<"🠋" | "🠉">("🠋");

    const getComboRows = createMemo(() => {
        const data = AppStore.getComputedData();
        const comboArray = CardUtils.getComboArray(data.comboMap, AppStore.getPowerBias());
        const result = sortArray(comboArray, ...getComboSortFields());

        return getComboSortColDir() === "🠋" ? result : result.reverse();
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
                    <Expansions />
                </SettingsGroup>
            </Surface>
            <Surface>
                <SettingsGroup>
                    <PowerBias />
                </SettingsGroup>
            </Surface>

            <Surface>
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
                        <button onClick={() => handleComboHeaderClick(6, "rarity", "result", "card1")}>
                            {"Rarity " + (getComboSortColIndex() === 6 ? getComboSortColDir() : "")}
                        </button>
                    </GridHeader>

                    <For each={getComboRows()}>
                        {(row) => {
                            return (
                                <>
                                    <RarityLabel rarity={() => ALL_CARDS[row.card1].rarity}>{row.card1}</RarityLabel>
                                    <RarityLabel rarity={() => ALL_CARDS[row.card2].rarity}>{row.card2}</RarityLabel>
                                    <RarityLabel rarity={() => ALL_CARDS[row.result].rarity}>{row.result}</RarityLabel>
                                    <div>{row.atk}</div>
                                    <div>{row.def}</div>
                                    <div>{row.power}</div>
                                    <RarityLabel rarity={() => ALL_CARDS[row.result].rarity}>{row.rarity}</RarityLabel>
                                </>
                            );
                        }}
                    </For>
                </Grid>
            </Surface>

            <Title>{`${(getComboRows().length - AppStore.getComputedData().symmetricalComboCount) / 2 + AppStore.getComputedData().symmetricalComboCount} entries as of 25/07/2025`}</Title>
        </>
    );
};
