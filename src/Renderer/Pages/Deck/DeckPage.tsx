import { For, createMemo } from "solid-js";

import { ALL_CARDS } from "../../../Logic/Abstracts/Card/Card.const";
import { CardUtils } from "../../../Logic/Abstracts/Card/Card.utils";
import { AppStore } from "../../App.store";
import { DeckSettings } from "../../Components/DeckSettings/DeckSettings";
import { Expansions } from "../../Components/Expansions/Expansions";
import { PowerSettings } from "../../Components/PowerSettings/PowerSettings";
import { SettingsGroup } from "../../Components/SettingsGroup/SettingsGroup";
import { Grid } from "../../Fundamentals/Grid/Grid";
import { GridHeader } from "../../Fundamentals/Grid/GridHeader/GridHeader";
import { RarityLabel } from "../../Fundamentals/RarityLabel/RarityLabel";
import { Surface } from "../../Fundamentals/Surface/Surface";
import { Title } from "../../Fundamentals/Title/Title";
import { DeckPageProps } from "./DeckPages.types";

const TEMPLATE_COLUMNS = "repeat(1, minmax(120px, auto)) repeat(1, minmax(40px, auto))";

export const DeckPage = (props: DeckPageProps) => {
    const getDeckRows = createMemo(() => {
        const data = AppStore.getComputedData();

        return CardUtils.getBestDeck(data.comboMap, data.absoluteScores, AppStore.getDeckSettings());
    });

    return (
        <>
            <Surface>
                <SettingsGroup>
                    <Expansions />
                </SettingsGroup>
            </Surface>
            <Surface>
                <SettingsGroup>
                    <PowerSettings />
                </SettingsGroup>
            </Surface>
            <Surface>
                <Grid templateColumns={() => "repeat(1, minmax(240px, auto)) repeat(3, minmax(120px, auto))"}>
                    <DeckSettings />
                </Grid>
            </Surface>

            <Surface>
                <Grid templateColumns={() => TEMPLATE_COLUMNS}>
                    <GridHeader>
                        <div>{"Card"}</div>
                        <div>{"Count"}</div>
                    </GridHeader>

                    <For each={getDeckRows()}>
                        {(row) => {
                            return (
                                <>
                                    <RarityLabel rarity={() => ALL_CARDS[row.card].rarity}>{row.card}</RarityLabel>
                                    <div>{row.count}</div>
                                </>
                            );
                        }}
                    </For>
                </Grid>
            </Surface>

            <Title>{`Currently based on shallow node comparison - interpret results with caution`}</Title>
        </>
    );
};
