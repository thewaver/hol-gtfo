import { For, createSignal } from "solid-js";

import { CARD_COMBO_ARRAY, CARD_RANKS, CARD_RARITY_DESK } from "../Logic/Abstracts/Card/Card.const";
import { sortArray } from "./App.utils";

import "./App.css";

export const App = () => {
    const [getRows, setRows] = createSignal(sortArray(CARD_COMBO_ARRAY, "card1", "card2"));
    const [getSortColIndex, setSortColIndex] = createSignal(0);
    const [getSortColDir, setSortColDir] = createSignal<"🠋" | "🠉">("🠋");

    // I can't be arsed to wryte ArrayType for the putazillionth time
    const handleClick = (colIndex: number, col1: string, col2: string) => {
        const isSameColIndex = getSortColIndex() === colIndex;

        setSortColDir((prev) => (isSameColIndex ? (prev === "🠉" ? "🠋" : "🠉") : "🠋"));
        setSortColIndex(colIndex);
        setRows(isSameColIndex ? getRows().slice().reverse() : sortArray(getRows(), col1 as any, col2 as any));
    };

    return (
        <div id="app" class="app">
            <div class="gridBody">
                <button class="gridCell header" onClick={() => handleClick(0, "card1", "card2")}>
                    {"Card 1 " + (getSortColIndex() === 0 ? getSortColDir() : "")}
                </button>
                <button class="gridCell header" onClick={() => handleClick(1, "card2", "card1")}>
                    {"Card 2 " + (getSortColIndex() === 1 ? getSortColDir() : "")}
                </button>
                <button class="gridCell header" onClick={() => handleClick(2, "result", "card1")}>
                    {"Result " + (getSortColIndex() === 2 ? getSortColDir() : "")}
                </button>
                <button class="gridCell header" onClick={() => handleClick(3, "rarity", "card1")}>
                    {"Rarity " + (getSortColIndex() === 3 ? getSortColDir() : "")}
                </button>

                <For each={getRows()}>
                    {(row) => {
                        return (
                            <>
                                <div class={`gridCell ${CARD_RANKS[row.card1]}`}>{row.card1}</div>
                                <div class={`gridCell ${CARD_RANKS[row.card2]}`}>{row.card2}</div>
                                <div class={`gridCell ${CARD_RANKS[row.result]}`}>{row.result}</div>
                                <div class={`gridCell ${row.rarity}`}>{CARD_RARITY_DESK[row.rarity]}</div>
                            </>
                        );
                    }}
                </For>
            </div>
        </div>
    );
};
