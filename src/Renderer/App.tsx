import { For, Show, createSignal } from "solid-js";

import {
    CARD_ABSOLUTE_SCORES,
    CARD_COMBO_ARRAY,
    CARD_RANKS,
    CARD_RANK_DESC,
    CARD_RELATIVE_SCORES,
    CARD_SCORE_ARRAY,
    SYMMETRICAL_PAIR_COUNT,
} from "../Logic/Abstracts/Card/Card.const";
import { ArrayType } from "./App.types";
import { sortArray } from "./App.utils";

import "./App.css";

export const App = () => {
    const [getComboRows, setComboRows] = createSignal(sortArray(CARD_COMBO_ARRAY, "card1", "card2"));
    const [getComboSortColIndex, setComboSortColIndex] = createSignal(0);
    const [getComboSortColDir, setComboSortColDir] = createSignal<"🠋" | "🠉">("🠋");

    const [getScoreRows, setScoreRows] = createSignal(sortArray(CARD_SCORE_ARRAY, "absoluteScore"));
    const [getScoreSortColIndex, setScoreSortColIndex] = createSignal(1);
    const [getScoreSortColDir, setScoreSortColDir] = createSignal<"🠋" | "🠉">("🠋");

    const handleComboHeaderClick = (colIndex: number, ...keys: (keyof ArrayType<typeof CARD_COMBO_ARRAY>)[]) => {
        const isSameColIndex = getComboSortColIndex() === colIndex;

        setComboSortColDir((prev) => (isSameColIndex ? (prev === "🠉" ? "🠋" : "🠉") : "🠋"));
        setComboSortColIndex(colIndex);
        setComboRows(isSameColIndex ? getComboRows().slice().reverse() : sortArray(getComboRows(), ...keys));
    };

    const handleScoreHeaderClick = (colIndex: number, ...keys: (keyof ArrayType<typeof CARD_SCORE_ARRAY>)[]) => {
        const isSameColIndex = getScoreSortColIndex() === colIndex;

        setScoreSortColDir((prev) => (isSameColIndex ? (prev === "🠉" ? "🠋" : "🠉") : "🠋"));
        setScoreSortColIndex(colIndex);
        setScoreRows(isSameColIndex ? getScoreRows().slice().reverse() : sortArray(getScoreRows(), ...keys));
    };

    return (
        <div id="app" class="app">
            <div class="title">{`Harem of Lust Combos\n${(getComboRows().length - SYMMETRICAL_PAIR_COUNT) / 2 + SYMMETRICAL_PAIR_COUNT} entries as of 18/07/2025`}</div>

            <div class="gridBody combos">
                <button class="gridCell header" onClick={() => handleComboHeaderClick(0, "card1", "card2")}>
                    {"Card " + (getComboSortColIndex() === 0 ? getComboSortColDir() : "")}
                </button>
                <div class="gridCell header">{"Pair"}</div>
                <button class="gridCell header" onClick={() => handleComboHeaderClick(2, "result", "card1")}>
                    {"Result " + (getComboSortColIndex() === 2 ? getComboSortColDir() : "")}
                </button>
                <button class="gridCell header" onClick={() => handleComboHeaderClick(3, "rarity", "result", "card1")}>
                    {"Rarity " + (getComboSortColIndex() === 3 ? getComboSortColDir() : "")}
                </button>

                <For each={getComboRows()}>
                    {(row) => {
                        return (
                            <>
                                <div class={`gridCell ${CARD_RANKS[row.card1]}`}>{row.card1}</div>
                                <div class={`gridCell ${CARD_RANKS[row.card2]}`}>{row.card2}</div>
                                <div class={`gridCell ${CARD_RANKS[row.result]}`}>{row.result}</div>
                                <div class={`gridCell ${row.rarity}`}>{CARD_RANK_DESC[row.rarity]}</div>
                            </>
                        );
                    }}
                </For>
            </div>

            <div class="title">{`Subjective scores based on combos\nCommon = 1pt, Uncommon = 4pt, Rare = 12pt, Epic = 24pt\nIndividual = own combo potential, Comulative = pair combo potential`}</div>

            <div class="gridBody scores">
                <button class="gridCell header" onClick={() => handleScoreHeaderClick(0, "card")}>
                    {"Card " + (getScoreSortColIndex() === 0 ? getScoreSortColDir() : "")}
                </button>
                <button class="gridCell header" onClick={() => handleScoreHeaderClick(1, "absoluteScore", "card")}>
                    {"Individual " + (getScoreSortColIndex() === 1 ? getScoreSortColDir() : "")}
                </button>
                <div class="gridCell header">{"Breakdown (Results)"}</div>
                <button class="gridCell header" onClick={() => handleScoreHeaderClick(3, "relativeScore", "card")}>
                    {"Comulative " + (getScoreSortColIndex() === 3 ? getScoreSortColDir() : "")}
                </button>
                <div class="gridCell header">{"Breakdown (Pair Score * Result)"}</div>

                <For each={getScoreRows()}>
                    {(row) => {
                        return row.absoluteScore ? (
                            <>
                                <div class={`gridCell ${CARD_RANKS[row.card]}`}>{row.card}</div>
                                <div class={`gridCell`}>{row.absoluteScore}</div>
                                <div class={`gridCell`}>
                                    <For each={CARD_ABSOLUTE_SCORES[row.card]}>
                                        {(item, getItemIndex) => (
                                            <span>
                                                <span
                                                    class={`gridCell ${CARD_RANKS[item.result]}`}
                                                >{`${item.score} (${item.result})`}</span>
                                                <Show when={getItemIndex() < CARD_ABSOLUTE_SCORES[row.card].length - 1}>
                                                    <span>{" + "}</span>
                                                </Show>
                                            </span>
                                        )}
                                    </For>
                                </div>
                                <div class={`gridCell`}>{row.relativeScore}</div>
                                <div class={`gridCell`}>
                                    <For each={CARD_RELATIVE_SCORES[row.card]}>
                                        {(item, getItemIndex) => (
                                            <span>
                                                <span
                                                    class={`gridCell ${CARD_RANKS[item.pair]}`}
                                                >{`${item.pairScore} (${item.pair})`}</span>
                                                <span>{" * "}</span>
                                                <span
                                                    class={`gridCell ${CARD_RANKS[item.result]}`}
                                                >{`${item.resultScore} (${item.result})`}</span>
                                                <Show when={getItemIndex() < CARD_ABSOLUTE_SCORES[row.card].length - 1}>
                                                    <span>{" + "}</span>
                                                </Show>
                                            </span>
                                        )}
                                    </For>
                                </div>
                            </>
                        ) : null;
                    }}
                </For>
            </div>
        </div>
    );
};
