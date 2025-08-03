import { For, createMemo } from "solid-js";

import { ALL_CARDS, PARSED_COMBOS } from "../../../Logic/Abstracts/Card/Card.const";
import { CardUtils } from "../../../Logic/Abstracts/Card/Card.utils";
import { AppStore } from "../../App.store";
import { DeckSettings } from "../../Components/DeckSettings/DeckSettings";
import { PowerSettings } from "../../Components/PowerSettings/PowerSettings";
import { SettingsGroup } from "../../Components/SettingsGroup/SettingsGroup";
import { Grid } from "../../Fundamentals/Grid/Grid";
import { GridHeader } from "../../Fundamentals/Grid/GridHeader/GridHeader";
import { RarityLabel } from "../../Fundamentals/RarityLabel/RarityLabel";
import { Surface } from "../../Fundamentals/Surface/Surface";
import { Title } from "../../Fundamentals/Title/Title";

const TEMPLATE_COLUMNS = "repeat(1, minmax(120px, auto)) repeat(1, minmax(40px, auto))";

export const BestDeckPage = () => {
    const getComputedData = createMemo(() => {
        const powerOpts = {
            bias: AppStore.getPowerBias(),
            exponent: AppStore.getPowerExponent(),
            level: AppStore.getCardLevel(),
        };
        const { comboMap } = CardUtils.getComboMap(PARSED_COMBOS, { cardCounts: AppStore.myCardCounts });
        const absoluteScores = CardUtils.getAbsoluteScores(comboMap, powerOpts);

        return {
            deckRows: CardUtils.getBestDeck(comboMap, absoluteScores, AppStore.myCardCounts, AppStore.deckSettings),
        };
    });

    return (
        <>
            <Surface>
                <SettingsGroup>
                    <PowerSettings />
                </SettingsGroup>
            </Surface>
            <Surface>
                <SettingsGroup>
                    <DeckSettings />
                </SettingsGroup>
            </Surface>

            <Surface>
                <Grid templateColumns={() => TEMPLATE_COLUMNS}>
                    <GridHeader>
                        <div>{"Card"}</div>
                        <div>{"Count"}</div>
                    </GridHeader>

                    <For each={getComputedData().deckRows}>
                        {(row) => {
                            return (
                                <>
                                    <RarityLabel rarity={() => ALL_CARDS[row.card].rarity}>
                                        {CardUtils.getCardNameAndExpansion(row.card)}
                                    </RarityLabel>
                                    <div>{row.count}</div>
                                </>
                            );
                        }}
                    </For>
                </Grid>
            </Surface>

            <Title>{`Currently based on shallow graph node comparison\nInterpret results with caution`}</Title>
        </>
    );
};
