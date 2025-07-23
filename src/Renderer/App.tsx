import { For, createSignal } from "solid-js";

import {
    CARDS,
    CARD_ABSOLUTE_SCORES,
    CARD_COMBO_ARRAY,
    CARD_RELATIVE_SCORES,
    CARD_SCORE_ARRAY,
    SYMMETRICAL_PAIR_COUNT,
} from "../Logic/Abstracts/Card/Card.const";
import { sortArray } from "../Logic/Utils/array";
import { ArrayType } from "../Logic/Utils/utilityTypes";

import "./App.css";

export const App = () => {
    const [getComboRows, setComboRows] = createSignal(sortArray(CARD_COMBO_ARRAY, "card1", "card2"));
    const [getComboSortColIndex, setComboSortColIndex] = createSignal(0);
    const [getComboSortColDir, setComboSortColDir] = createSignal<"🠋" | "🠉">("🠋");

    const [getScoreRows, setScoreRows] = createSignal(sortArray(CARD_SCORE_ARRAY, "absoluteScore", "card"));
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
            <div class="title">{`Harem of Lust Combos\n${(getComboRows().length - SYMMETRICAL_PAIR_COUNT) / 2 + SYMMETRICAL_PAIR_COUNT} entries as of 22/07/2025`}</div>

            <div class="gridBody combos">
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
                                <div class={`gridCell ${CARDS[row.card1].rarity}`}>{row.card1}</div>
                                <div class={`gridCell ${CARDS[row.card2].rarity}`}>{row.card2}</div>
                                <div class={`gridCell ${CARDS[row.result].rarity}`}>{row.result}</div>
                                <div class={`gridCell`}>{row.atk}</div>
                                <div class={`gridCell`}>{row.def}</div>
                                <div class={`gridCell`}>{row.power}</div>
                                <div class={`gridCell ${CARDS[row.result].rarity}`}>{row.rarity}</div>
                            </>
                        );
                    }}
                </For>
            </div>

            <div class="title">{`Subjective scores based on combos\nCommon = 1, Uncommon = 4, Rare = 12, Epic = 24\nIndividual = result score sum, Comulative = pair * result score sum`}</div>

            <div class="gridBody scores">
                <button class="gridCell header" onClick={() => handleScoreHeaderClick(0, "card")}>
                    {"Card " + (getScoreSortColIndex() === 0 ? getScoreSortColDir() : "")}
                </button>
                <button class="gridCell header" onClick={() => handleScoreHeaderClick(1, "absoluteScore", "card")}>
                    {"Individual " + (getScoreSortColIndex() === 1 ? getScoreSortColDir() : "")}
                </button>
                <button class="gridCell header" onClick={() => handleScoreHeaderClick(2, "relativeScore", "card")}>
                    {"Comulative " + (getScoreSortColIndex() === 2 ? getScoreSortColDir() : "")}
                </button>
                <div class="gridCell header">{"Result Scores"}</div>
                <div class="gridCell header">{"Pair Scores"}</div>

                <For each={getScoreRows()}>
                    {(row) => {
                        return row.absoluteScore ? (
                            <>
                                <div class={`gridCell ${CARDS[row.card].rarity}`}>{row.card}</div>
                                <div class={`gridCell`}>{row.absoluteScore}</div>
                                <div class={`gridCell`}>{row.relativeScore}</div>
                                <div class={`gridCell`}>
                                    <For each={CARD_ABSOLUTE_SCORES[row.card]}>
                                        {(item) => (
                                            <div
                                                class={`gridCell ${CARDS[item.result].rarity}`}
                                            >{`${item.score} (${item.result})`}</div>
                                        )}
                                    </For>
                                </div>
                                <div class={`gridCell`}>
                                    <For each={CARD_RELATIVE_SCORES[row.card]}>
                                        {(item) => (
                                            <div
                                                class={`gridCell ${CARDS[item.pair].rarity}`}
                                            >{`${item.pairScore} (${item.pair})`}</div>
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
