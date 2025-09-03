import { For, createMemo, createSignal } from "solid-js";

import { ALL_CARDS } from "../../../Logic/Abstracts/Card/Card.const";
import { CardCount, CardName } from "../../../Logic/Abstracts/Card/Card.types";
import { CardUtils } from "../../../Logic/Abstracts/Card/Card.utils";
import { binomial } from "../../../Logic/Utils/math";
import { AppStore } from "../../App.store";
import { PowerSettings } from "../../Components/PowerSettings/PowerSettings";
import { SettingsGroup } from "../../Components/SettingsGroup/SettingsGroup";
import { Grid } from "../../Fundamentals/Grid/Grid";
import { GridHeader } from "../../Fundamentals/Grid/GridHeader/GridHeader";
import { GridRow } from "../../Fundamentals/Grid/GridRow/GridRow";
import { RarityLabel } from "../../Fundamentals/RarityLabel/RarityLabel";
import { Surface } from "../../Fundamentals/Surface/Surface";
import { SubTitle, Title } from "../../Fundamentals/Title/Title";

import "./BruteForcePage.css";

const TEMPLATE_COLUMNS = "repeat(1, minmax(120px, auto)) repeat(1, minmax(40px, auto))";

export const BruteForcePage = () => {
    const [getDeckSize, setDeckSize] = createSignal(30);
    const [getBestComputedDeck, setBestComputedDeck] = createSignal<{ card: CardName; count: CardCount }[]>([]);
    const [getComputedSubsetCount, setComputedSubsetCount] = createSignal(0);
    const [getIsComputing, setIsComputing] = createSignal(false);
    const [getStartTime, setStartTime] = createSignal(0);
    const [getPace, setPace] = createSignal(0);

    const getComputedData = createMemo(() => {
        const powerOpts = {
            bias: AppStore.getPowerBias(),
            exponent: AppStore.getPowerExponent(),
            costRatio: AppStore.getCostRatio(),
            cardLevel: AppStore.getCardLevel(),
        };
        const variationCount = binomial(CardUtils.getUngroupedCards(AppStore.myCardCounts).length, getDeckSize());

        return {
            powerOpts,
            variationCount,
        };
    });

    const handleCompute = async () => {
        setIsComputing(true);
        setStartTime(Date.now());

        const callback = CardUtils.getBruteForceBestDeck(
            AppStore.myCardCounts,
            getDeckSize(),
            getComputedData().powerOpts,
        );

        let lastBestScore = 0;

        for await (const step of callback) {
            const timeElapsed = Date.now() - getStartTime();
            const pace = Math.floor((step.computedSubsetCount * 1000) / timeElapsed);

            if (step.bestScore > lastBestScore) {
                setBestComputedDeck(step.bestDeck);
                lastBestScore = step.bestScore;
            }
            setComputedSubsetCount(step.computedSubsetCount);
            setPace(pace);
        }

        setIsComputing(false);
    };

    return (
        <>
            <Surface>
                <SettingsGroup>
                    <PowerSettings />
                </SettingsGroup>
            </Surface>

            <Title>
                {"Brute Force Best Deck\n"}
                <SubTitle>{`This is definitely slow as it must compute an enormous number of variations\n`}</SubTitle>
                <SubTitle>{"Remove known low-value cards from your deck to greatly simplify the computation"}</SubTitle>
            </Title>

            <Surface>
                <SettingsGroup>
                    <label>
                        <span>{`Deck size`}</span>
                        <input
                            type="number"
                            min={1}
                            max={120}
                            step={1}
                            value={getDeckSize()}
                            disabled={getIsComputing()}
                            onChange={(e) => {
                                setDeckSize(Math.max(Math.min(Number(e.target.value), 120), 0));
                            }}
                        />
                    </label>
                    <button type="button" disabled={getIsComputing()} onClick={handleCompute}>
                        {getIsComputing()
                            ? `Computed ${getComputedSubsetCount()} of ${getComputedData().variationCount} variations (${getPace()} v/s)`
                            : `Compute ${getComputedData().variationCount} variations`}
                    </button>
                </SettingsGroup>
            </Surface>

            <Surface unpadded={() => true}>
                <Grid templateColumns={() => TEMPLATE_COLUMNS}>
                    <GridHeader>
                        <div>{"Card"}</div>
                        <div>{"Count"}</div>
                    </GridHeader>

                    <For each={getBestComputedDeck()}>
                        {(row, getIndex) => {
                            return (
                                <GridRow index={getIndex}>
                                    <RarityLabel rarity={() => ALL_CARDS[row.card].rarity}>
                                        {CardUtils.getCardNameAndExpansion(row.card)}
                                    </RarityLabel>
                                    <div>{row.count}</div>
                                </GridRow>
                            );
                        }}
                    </For>
                </Grid>
            </Surface>
        </>
    );
};
