import { For, Show } from "solid-js";
import { createMemo, createSignal } from "solid-js";

import { ALL_CARDS, PARSED_COMBOS } from "../../../Logic/Abstracts/Card/Card.const";
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

const TEMPLATE_COLUMNS_BREAKDOWN = "repeat(1, minmax(120px, auto)) repeat(1, minmax(80px, auto)) 1fr";
const TEMPLATE_COLUMNS_BRIEF =
    "repeat(1, minmax(120px, auto)) repeat(4, minmax(40px, auto)) repeat(1, minmax(80px, auto))";

export const ScoresPage = () => {
    const [getScoreSortFields, setScoreSortFields] = createSignal<ScoreArrayFields[]>(["absoluteScore", "card"]);
    const [getScoreSortColIndex, setScoreSortColIndex] = createSignal(5);
    const [getScoreSortColDir, setScoreSortColDir] = createSignal<"🠋" | "🠉">("🠋");

    const [getShowScoreBreakdown, setShowScoreBreakdown] = createSignal(false);

    const getComputedData = createMemo(() => {
        const powerOpts = {
            bias: AppStore.getPowerBias(),
            exponent: AppStore.getPowerExponent(),
            level: AppStore.getCardLevel(),
        };
        const { comboMap } = CardUtils.getComboMap(PARSED_COMBOS, { cardCounts: AppStore.myCardCounts });
        const { byCard: comboCountsByCard, max: comboCountsMax } = CardUtils.getComboCounts(comboMap);
        const absoluteScores = CardUtils.getAbsoluteScores(comboMap, powerOpts);
        const scoreArray = CardUtils.getScoreArray(absoluteScores, comboCountsByCard);
        const result = sortArray(scoreArray, ...getScoreSortFields());

        return {
            scoreRows: getScoreSortColDir() === "🠋" ? result : result.reverse(),
            absoluteScores,
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
            <Surface>
                <SettingsGroup>
                    <label>
                        <input
                            type="checkbox"
                            value="showBreakdown"
                            checked={getShowScoreBreakdown()}
                            onChange={() => {
                                setShowScoreBreakdown((prev) => !prev);
                            }}
                        />
                        {"Breakdowns"}
                    </label>
                </SettingsGroup>
            </Surface>

            <Surface unpadded={() => true}>
                <Grid
                    templateColumns={() =>
                        getShowScoreBreakdown() ? TEMPLATE_COLUMNS_BREAKDOWN : TEMPLATE_COLUMNS_BRIEF
                    }
                >
                    <GridHeader>
                        <button onClick={() => handleScoreHeaderClick(0, "card")}>
                            {"Card " + (getScoreSortColIndex() === 0 ? getScoreSortColDir() : "")}
                        </button>
                        <Show when={!getShowScoreBreakdown()}>
                            <For each={CARD_RARITIES}>
                                {(rarity, getIndex) => (
                                    <button
                                        onClick={() =>
                                            handleScoreHeaderClick(getIndex() + 1, rarity, "absoluteScore", "card")
                                        }
                                    >
                                        {`${rarity.length < 5 ? rarity : rarity.slice(0, 3)} ` +
                                            (getScoreSortColIndex() === getIndex() + 1 ? getScoreSortColDir() : "")}
                                    </button>
                                )}
                            </For>
                        </Show>
                        <button onClick={() => handleScoreHeaderClick(5, "absoluteScore", "card")}>
                            {"Individual " + (getScoreSortColIndex() === 5 ? getScoreSortColDir() : "")}
                        </button>
                        <Show when={getShowScoreBreakdown()}>
                            <div>{"Breakdown"}</div>
                        </Show>
                    </GridHeader>

                    <For each={getComputedData().scoreRows}>
                        {(row, getIndex) => {
                            return row.absoluteScore ? (
                                <GridRow index={getIndex}>
                                    <RarityLabel rarity={() => ALL_CARDS[row.card].rarity}>
                                        {CardUtils.getCardNameAndExpansion(row.card)}
                                    </RarityLabel>
                                    <Show when={!getShowScoreBreakdown()}>
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
                                    </Show>
                                    <div>{CardUtils.formatScore(row.absoluteScore)}</div>
                                    <Show when={getShowScoreBreakdown()}>
                                        <div>
                                            <Grid templateColumns={() => "2fr 2fr minmax(80px, auto)"}>
                                                <For each={getComputedData().absoluteScores[row.card]}>
                                                    {(item) => (
                                                        <>
                                                            <RarityLabel rarity={() => ALL_CARDS[item.pair].rarity}>
                                                                {CardUtils.getCardNameAndExpansion(item.pair)}
                                                            </RarityLabel>
                                                            <RarityLabel rarity={() => ALL_CARDS[item.result].rarity}>
                                                                {item.result}
                                                            </RarityLabel>
                                                            <span>{CardUtils.formatScore(item.resultScore)}</span>
                                                        </>
                                                    )}
                                                </For>
                                            </Grid>
                                        </div>
                                    </Show>
                                </GridRow>
                            ) : null;
                        }}
                    </For>
                </Grid>
            </Surface>
        </>
    );
};
