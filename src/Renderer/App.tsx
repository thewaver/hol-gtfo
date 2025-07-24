import { For, Show, createMemo, createSignal } from "solid-js";

import { ALL_CARDS, ALL_EXPANSIONS, PARSED_COMBOS } from "../Logic/Abstracts/Card/Card.const";
import { CARD_RARITIES, ExpansionName } from "../Logic/Abstracts/Card/Card.types";
import {
    getAbsoluteScores,
    getComboArray,
    getComboCounts,
    getComboMap,
    getRelativeScores,
    getScoreArray,
} from "../Logic/Abstracts/Card/Card.utils";
import { sortArray } from "../Logic/Utils/array";
import { ArrayType } from "../Logic/Utils/utilityTypes";

import "./App.css";

type ComboArrayFields = keyof ArrayType<ReturnType<typeof getComboArray>>;
type ScoreArrayFields = keyof ArrayType<ReturnType<typeof getScoreArray>>;

export const App = () => {
    const [getExpansions, setExpansuions] = createSignal<Set<ExpansionName>>(new Set(["Base"]));

    const [getComboSortFields, setComboSortFields] = createSignal<ComboArrayFields[]>(["card1", "card2"]);
    const [getComboSortColIndex, setComboSortColIndex] = createSignal(0);
    const [getComboSortColDir, setComboSortColDir] = createSignal<"🠋" | "🠉">("🠋");

    const [getScoreSortFields, setScoreSortFields] = createSignal<ScoreArrayFields[]>(["absoluteScore", "card"]);
    const [getScoreSortColIndex, setScoreSortColIndex] = createSignal(5);
    const [getScoreSortColDir, setScoreSortColDir] = createSignal<"🠋" | "🠉">("🠋");

    const [getShowScoreBreakdown, setShowScoreBreakdown] = createSignal(false);
    const [getPowerBias, setPowerBias] = createSignal(65);

    const getData = createMemo(() => {
        const expansions = getExpansions();
        const powerBias = getPowerBias();
        const { comboMap, symmetricalComboCount } = getComboMap(PARSED_COMBOS, expansions);
        const { byCard, totals, max } = getComboCounts(comboMap, expansions);
        const absoluteScores = getAbsoluteScores(comboMap, expansions, powerBias);
        const relativeScores = getRelativeScores(comboMap, expansions, powerBias, absoluteScores);

        console.log(max);

        return {
            comboMap,
            symmetricalComboCount,
            comboCountsByCard: byCard,
            comboCountsTotal: totals,
            comboCountsMax: max,
            absoluteScores,
            relativeScores,
        };
    });

    const getComboRows = createMemo(() => {
        const data = getData();
        const comboArray = getComboArray(data.comboMap, getPowerBias());
        const result = sortArray(comboArray, ...getComboSortFields());

        return getComboSortColDir() === "🠋" ? result : result.reverse();
    });

    const getScoreRows = createMemo(() => {
        const data = getData();
        const scoreArray = getScoreArray(data.absoluteScores, data.relativeScores, data.comboCountsByCard);
        const result = sortArray(scoreArray, ...getScoreSortFields());

        return getScoreSortColDir() === "🠋" ? result : result.reverse();
    });

    const handleComboHeaderClick = (colIndex: number, ...keys: ComboArrayFields[]) => {
        const isSameColIndex = getComboSortColIndex() === colIndex;

        setComboSortColDir((prev) => (isSameColIndex ? (prev === "🠉" ? "🠋" : "🠉") : "🠋"));
        setComboSortColIndex(colIndex);
        setComboSortFields(keys);
    };

    const handleScoreHeaderClick = (colIndex: number, ...keys: ScoreArrayFields[]) => {
        const isSameColIndex = getScoreSortColIndex() === colIndex;

        setScoreSortColDir((prev) => (isSameColIndex ? (prev === "🠉" ? "🠋" : "🠉") : "🠋"));
        setScoreSortColIndex(colIndex);
        setScoreSortFields(keys);
    };

    return (
        <div id="app" class="app">
            <div class="title">{`Harem of Lust Combos\n${(getComboRows().length - getData().symmetricalComboCount) / 2 + getData().symmetricalComboCount} entries as of 24/07/2025`}</div>

            <div class="panel filters">
                <label class="range">
                    <span>{"Power bias"}</span>
                    <span>{`DEF ${100 - getPowerBias()}`}</span>
                    <input
                        type="range"
                        min={0}
                        max={100}
                        step={5}
                        value={getPowerBias()}
                        onChange={(e) => {
                            setPowerBias(parseFloat(e.target.value));
                        }}
                    />
                    <span>{`ATK ${getPowerBias()}`}</span>
                </label>
            </div>

            <div class="panel filters">
                <For each={[...ALL_EXPANSIONS.keys()]}>
                    {(expansion) => (
                        <label class="option">
                            <input
                                type="checkbox"
                                value={expansion}
                                checked={getExpansions().has(expansion)}
                                onChange={() =>
                                    setExpansuions((prev) => {
                                        const next = new Set(prev);

                                        if (next.has(expansion)) {
                                            next.delete(expansion);
                                        } else {
                                            next.add(expansion);
                                        }

                                        return next;
                                    })
                                }
                            />
                            {expansion}
                        </label>
                    )}
                </For>
            </div>

            <div class="panel gridBody combos">
                <button class="gridCell header" onClick={() => handleComboHeaderClick(0, "card1", "card2")}>
                    {"Card " + (getComboSortColIndex() === 0 ? getComboSortColDir() : "")}
                </button>
                <div class="gridCell header">{"Pair"}</div>
                <button class="gridCell header" onClick={() => handleComboHeaderClick(2, "result", "card1")}>
                    {"Result " + (getComboSortColIndex() === 2 ? getComboSortColDir() : "")}
                </button>
                <button class="gridCell header" onClick={() => handleComboHeaderClick(3, "atk", "result", "card1")}>
                    {"Atk " + (getComboSortColIndex() === 3 ? getComboSortColDir() : "")}
                </button>
                <button class="gridCell header" onClick={() => handleComboHeaderClick(4, "def", "result", "card1")}>
                    {"Def " + (getComboSortColIndex() === 4 ? getComboSortColDir() : "")}
                </button>
                <button class="gridCell header" onClick={() => handleComboHeaderClick(5, "power", "result", "card1")}>
                    {"Pwr " + (getComboSortColIndex() === 5 ? getComboSortColDir() : "")}
                </button>
                <button class="gridCell header" onClick={() => handleComboHeaderClick(6, "rarity", "result", "card1")}>
                    {"Rarity " + (getComboSortColIndex() === 6 ? getComboSortColDir() : "")}
                </button>

                <For each={getComboRows()}>
                    {(row) => {
                        return (
                            <>
                                <div class={`gridCell ${ALL_CARDS[row.card1].rarity}`}>{row.card1}</div>
                                <div class={`gridCell ${ALL_CARDS[row.card2].rarity}`}>{row.card2}</div>
                                <div class={`gridCell ${ALL_CARDS[row.result].rarity}`}>{row.result}</div>
                                <div class={`gridCell`}>{row.atk}</div>
                                <div class={`gridCell`}>{row.def}</div>
                                <div class={`gridCell`}>{row.power}</div>
                                <div class={`gridCell ${ALL_CARDS[row.result].rarity}`}>{row.rarity}</div>
                            </>
                        );
                    }}
                </For>
            </div>

            <div class="title">{`Subjective scores based on combos\nIndividual = Sum( result power ), Cumulative = Sum( pair individual * result power )`}</div>

            <div class="panel filters">
                <label class="option">
                    <input
                        type="checkbox"
                        value="showBreakdown"
                        checked={getShowScoreBreakdown()}
                        onChange={() => {
                            setShowScoreBreakdown((prev) => !prev);
                        }}
                    />
                    {"Show breakdown"}
                </label>
            </div>

            <div class={`panel gridBody scores ${getShowScoreBreakdown() ? "full" : "brief"}`}>
                <button class="gridCell header" onClick={() => handleScoreHeaderClick(0, "card")}>
                    {"Card " + (getScoreSortColIndex() === 0 ? getScoreSortColDir() : "")}
                </button>
                <Show when={!getShowScoreBreakdown()}>
                    <For each={CARD_RARITIES}>
                        {(rarity, getIndex) => (
                            <button
                                class="gridCell header"
                                onClick={() => handleScoreHeaderClick(getIndex() + 1, rarity, "absoluteScore", "card")}
                            >
                                {`${rarity.length < 5 ? rarity : rarity.slice(0, 3)} ` +
                                    (getScoreSortColIndex() === getIndex() + 1 ? getScoreSortColDir() : "")}
                            </button>
                        )}
                    </For>
                </Show>
                <button
                    class="gridCell header"
                    onClick={() => handleScoreHeaderClick(5, "absoluteScore", "relativeScore", "card")}
                >
                    {"Individual " + (getScoreSortColIndex() === 5 ? getScoreSortColDir() : "")}
                </button>
                <button
                    class="gridCell header"
                    onClick={() => handleScoreHeaderClick(6, "relativeScore", "absoluteScore", "card")}
                >
                    {"Cumulative " + (getScoreSortColIndex() === 6 ? getScoreSortColDir() : "")}
                </button>
                <Show when={getShowScoreBreakdown()}>
                    <div class="gridCell header">{"Result Scores"}</div>
                    <div class="gridCell header">{"Pair Scores"}</div>
                </Show>

                <For each={getScoreRows()}>
                    {(row) => {
                        return row.absoluteScore ? (
                            <>
                                <div class={`gridCell ${ALL_CARDS[row.card].rarity}`}>{row.card}</div>
                                <Show when={!getShowScoreBreakdown()}>
                                    <For each={CARD_RARITIES}>
                                        {(rarity) => {
                                            const mean = getData().comboCountsMax[rarity] / 2;
                                            const distFromMean = row[rarity] - mean;

                                            return (
                                                <div
                                                    class={`gridCell`}
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
                                <div class={`gridCell`}>{row.absoluteScore}</div>
                                <div class={`gridCell`}>{row.relativeScore}</div>
                                <Show when={getShowScoreBreakdown()}>
                                    <div class={`gridCell`}>
                                        <For each={getData().absoluteScores[row.card]}>
                                            {(item) => (
                                                <div
                                                    class={`gridCell ${ALL_CARDS[item.result].rarity}`}
                                                >{`${item.score} (${item.result})`}</div>
                                            )}
                                        </For>
                                    </div>
                                    <div class={`gridCell`}>
                                        <For each={getData().relativeScores[row.card]}>
                                            {(item) => (
                                                <div
                                                    class={`gridCell ${ALL_CARDS[item.pair].rarity}`}
                                                >{`${item.pairScore} (${item.pair})`}</div>
                                            )}
                                        </For>
                                    </div>
                                </Show>
                            </>
                        ) : null;
                    }}
                </For>
            </div>
        </div>
    );
};
