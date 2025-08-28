import { For } from "solid-js";
import { createMemo, createSignal } from "solid-js";

import { ALL_CARDS } from "../../../Logic/Abstracts/Card/Card.const";
import { CARD_RARITIES } from "../../../Logic/Abstracts/Card/Card.types";
import { CardUtils, ScoreArrayFields } from "../../../Logic/Abstracts/Card/Card.utils";
import { sortArray } from "../../../Logic/Utils/array";
import { AppStore } from "../../App.store";
import { PowerSettings } from "../../Components/PowerSettings/PowerSettings";
import { SettingsGroup } from "../../Components/SettingsGroup/SettingsGroup";
import { Grid } from "../../Fundamentals/Grid/Grid";
import { GridHeader } from "../../Fundamentals/Grid/GridHeader/GridHeader";
import { GridRow } from "../../Fundamentals/Grid/GridRow/GridRow";
import { RarityLabel } from "../../Fundamentals/RarityLabel/RarityLabel";
import { Surface } from "../../Fundamentals/Surface/Surface";

const TEMPLATE_COLUMNS = "repeat(1, minmax(120px, auto)) repeat(4, minmax(40px, auto)) repeat(1, minmax(80px, auto))";

export const ScoresPage = () => {
    const [getScoreSortFields, setScoreSortFields] = createSignal<ScoreArrayFields[]>(["totalScore", "card"]);
    const [getScoreSortColIndex, setScoreSortColIndex] = createSignal(5);
    const [getScoreSortColDir, setScoreSortColDir] = createSignal<"🠋" | "🠉">("🠋");

    const getComputedData = createMemo(() => {
        const powerOpts = {
            bias: AppStore.getPowerBias(),
            exponent: AppStore.getPowerExponent(),
            level: AppStore.getCardLevel(),
        };
        const { comboMap } = CardUtils.getComboMap(powerOpts, { cardCounts: AppStore.myCardCounts });
        const { max: comboCountsMax } = CardUtils.getComboCounts(comboMap);
        const scoreArray = CardUtils.getScoreArray(comboMap);
        const result = sortArray(scoreArray, ...getScoreSortFields());

        return {
            scoreRows: getScoreSortColDir() === "🠋" ? result : result.reverse(),
            comboCountsMax,
        };
    });

    const handleScoreHeaderClick = (colIndex: number, ...keys: ScoreArrayFields[]) => {
        const isSameColIndex = getScoreSortColIndex() === colIndex;

        setScoreSortColDir((prev) => (isSameColIndex ? (prev === "🠉" ? "🠋" : "🠉") : "🠋"));
        setScoreSortColIndex(colIndex);
        setScoreSortFields(keys);
    };

    return (
        <>
            <Surface>
                <SettingsGroup>
                    <PowerSettings />
                </SettingsGroup>
            </Surface>

            <Surface unpadded={() => true}>
                <Grid templateColumns={() => TEMPLATE_COLUMNS}>
                    <GridHeader>
                        <button onClick={() => handleScoreHeaderClick(0, "card")}>
                            {"Card " + (getScoreSortColIndex() === 0 ? getScoreSortColDir() : "")}
                        </button>
                        <For each={CARD_RARITIES}>
                            {(rarity, getIndex) => (
                                <button
                                    onClick={() => handleScoreHeaderClick(getIndex() + 1, rarity, "totalScore", "card")}
                                >
                                    {`${rarity.length < 5 ? rarity : rarity.slice(0, 3)} ` +
                                        (getScoreSortColIndex() === getIndex() + 1 ? getScoreSortColDir() : "")}
                                </button>
                            )}
                        </For>
                        <button onClick={() => handleScoreHeaderClick(5, "totalScore", "card")}>
                            {"Individual " + (getScoreSortColIndex() === 5 ? getScoreSortColDir() : "")}
                        </button>
                    </GridHeader>

                    <For each={getComputedData().scoreRows}>
                        {(row, getIndex) => {
                            return row.totalScore ? (
                                <GridRow index={getIndex}>
                                    <RarityLabel rarity={() => ALL_CARDS[row.card].rarity}>
                                        {CardUtils.getCardNameAndExpansion(row.card)}
                                    </RarityLabel>
                                    <For each={CARD_RARITIES}>
                                        {(rarity) => {
                                            const mean = getComputedData().comboCountsMax[rarity] / 2;
                                            const distFromMean = row[rarity] - mean;

                                            return (
                                                <div
                                                    style={{
                                                        color: `hsl(${distFromMean > 0 ? 120 : 0} 100% ${100 - (Math.abs(distFromMean) * 50) / mean}%)`,
                                                    }}
                                                >
                                                    {row[rarity]}
                                                </div>
                                            );
                                        }}
                                    </For>
                                    <div>{CardUtils.formatScore(row.totalScore)}</div>
                                </GridRow>
                            ) : null;
                        }}
                    </For>
                </Grid>
            </Surface>
        </>
    );
};
