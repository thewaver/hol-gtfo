import { For, createSignal } from "solid-js";

import {
    CARD_COMBO_ARRAY,
    CARD_RANKS,
    CARD_RANK_DESC,
    CARD_SCORE_ARRAY,
    SYMMETRICAL_PAIR_COUNT,
} from "../Logic/Abstracts/Card/Card.const";
import { sortArray } from "./App.utils";

import "./App.css";

export const App = () => {
    const [getComboRows, setComboRows] = createSignal(sortArray(CARD_COMBO_ARRAY, "card1", "card2"));
    const [getComboSortColIndex, setComboSortColIndex] = createSignal(0);
    const [getComboSortColDir, setComboSortColDir] = createSignal<"🠋" | "🠉">("🠋");

    const [getScoreRows, setScoreRows] = createSignal(sortArray(CARD_SCORE_ARRAY, "card"));
    const [getScoreSortColIndex, setScoreSortColIndex] = createSignal(0);
    const [getScoreSortColDir, setScoreSortColDir] = createSignal<"🠋" | "🠉">("🠋");

    // I can't be arsed to write ArrayType for the putazillionth time
    const handleComboHeaderClick = (colIndex: number, col1: string, col2: string) => {
        const isSameColIndex = getComboSortColIndex() === colIndex;

        setComboSortColDir((prev) => (isSameColIndex ? (prev === "🠉" ? "🠋" : "🠉") : "🠋"));
        setComboSortColIndex(colIndex);
        setComboRows(
            isSameColIndex ? getComboRows().slice().reverse() : sortArray(getComboRows(), col1 as any, col2 as any),
        );
    };

    const handleScoreHeaderClick = (colIndex: number, col1: string, col2?: string) => {
        const isSameColIndex = getScoreSortColIndex() === colIndex;

        setScoreSortColDir((prev) => (isSameColIndex ? (prev === "🠉" ? "🠋" : "🠉") : "🠋"));
        setScoreSortColIndex(colIndex);
        setScoreRows(
            isSameColIndex ? getScoreRows().slice().reverse() : sortArray(getScoreRows(), col1 as any, col2 as any),
        );
    };

    return (
        <div id="app" class="app">
            <div class="title">{`Harem of Lust Combos\n${(getComboRows().length - SYMMETRICAL_PAIR_COUNT) / 2 + SYMMETRICAL_PAIR_COUNT} entries as of 13/07/2025`}</div>

            <div class="gridBody combos">
                <button class="gridCell header" onClick={() => handleComboHeaderClick(0, "card1", "card2")}>
                    {"Card 1 " + (getComboSortColIndex() === 0 ? getComboSortColDir() : "")}
                </button>
                <div class="gridCell header">{"Card 2"}</div>
                <button class="gridCell header" onClick={() => handleComboHeaderClick(2, "result", "card1")}>
                    {"Result " + (getComboSortColIndex() === 2 ? getComboSortColDir() : "")}
                </button>
                <button class="gridCell header" onClick={() => handleComboHeaderClick(3, "rarity", "result")}>
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
                <div class="gridCell header">{"Breakdown"}</div>
                <button class="gridCell header" onClick={() => handleScoreHeaderClick(3, "relativeScore", "card")}>
                    {"Comulative " + (getScoreSortColIndex() === 3 ? getScoreSortColDir() : "")}
                </button>
                <div class="gridCell header">{"Breakdown"}</div>

                <For each={getScoreRows()}>
                    {(row) => {
                        return row.absoluteScore ? (
                            <>
                                <div class={`gridCell ${CARD_RANKS[row.card]}`}>{row.card}</div>
                                <div class={`gridCell`}>{row.absoluteScore}</div>
                                <div class={`gridCell`}>{row.absoluteDesc}</div>
                                <div class={`gridCell`}>{row.relativeScore}</div>
                                <div class={`gridCell`}>{row.relativeDesc}</div>
                            </>
                        ) : null;
                    }}
                </For>
            </div>
        </div>
    );
};
