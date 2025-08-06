import { For, createMemo, createSignal } from "solid-js";

import { ALL_CARDS, PARSED_COMBOS } from "../../../Logic/Abstracts/Card/Card.const";
import { CardName } from "../../../Logic/Abstracts/Card/Card.types";
import { CardUtils } from "../../../Logic/Abstracts/Card/Card.utils";
import { AppStore } from "../../App.store";
import { DeckSettings } from "../../Components/DeckSettings/DeckSettings";
import { PowerSettings } from "../../Components/PowerSettings/PowerSettings";
import { SettingsGroup } from "../../Components/SettingsGroup/SettingsGroup";
import { Grid } from "../../Fundamentals/Grid/Grid";
import { GridHeader } from "../../Fundamentals/Grid/GridHeader/GridHeader";
import { GridRow } from "../../Fundamentals/Grid/GridRow/GridRow";
import { RarityLabel } from "../../Fundamentals/RarityLabel/RarityLabel";
import { Surface } from "../../Fundamentals/Surface/Surface";
import { SubTitle, Title } from "../../Fundamentals/Title/Title";

import "./BestDeckPage.css";

const TEMPLATE_COLUMNS = "repeat(1, minmax(120px, auto)) repeat(1, minmax(40px, auto))";

export const BestDeckPage = () => {
    const [getAutoIncludedCards, setAutoIncludedCards] = createSignal<CardName[]>([]);

    const getComputedData = createMemo(() => {
        const powerOpts = {
            bias: AppStore.getPowerBias(),
            exponent: AppStore.getPowerExponent(),
            level: AppStore.getCardLevel(),
        };
        const { comboMap } = CardUtils.getComboMap(PARSED_COMBOS, { cardCounts: AppStore.myCardCounts });
        const absoluteScores = CardUtils.getAbsoluteScores(comboMap, powerOpts);
        const { deck, graph } = CardUtils.getBestDeck(comboMap, absoluteScores, AppStore.myCardCounts, {
            ...AppStore.deckSettings,
            autoIncludedCards: getAutoIncludedCards(),
        });

        return {
            deckRows: deck,
            graphNodes: graph,
        };
    });

    const handleCustomNodeSelection = (nodeIndex: number, card: CardName) => {
        const { graphNodes } = getComputedData();
        const selectedCards: CardName[] = [];

        for (let i = 0; i < Math.min(nodeIndex, graphNodes.length); i++) {
            selectedCards.push(graphNodes[i].pickedCard);
        }
        selectedCards.push(card);

        setAutoIncludedCards(selectedCards);
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
                    <DeckSettings />
                </SettingsGroup>
            </Surface>

            <Title>{`Deck composition`}</Title>

            <Surface unpadded={() => true}>
                <Grid templateColumns={() => TEMPLATE_COLUMNS}>
                    <GridHeader>
                        <div>{"Card"}</div>
                        <div>{"Count"}</div>
                    </GridHeader>

                    <For each={getComputedData().deckRows}>
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

            <Title>
                {`Card selection precedence\n`}
                <SubTitle>{`Changing any column will recalculate forward selections`}</SubTitle>
            </Title>

            <Surface unpadded={() => true}>
                <div class="graphNodes">
                    <For each={getComputedData().graphNodes}>
                        {(node, getNodeIndex) => {
                            return (
                                <div class="graphNode">
                                    <div class="graphNodeHeaderItem">{`Card ${getNodeIndex() + 1}`}</div>
                                    <For each={Object.entries(node.candidateScores).sort(([, a], [, b]) => b - a)}>
                                        {([name, score]) => {
                                            return (
                                                <button onClick={() => handleCustomNodeSelection(getNodeIndex(), name)}>
                                                    <div
                                                        class={`graphNodeItem ${name !== node.pickedCard ? "faded" : ""}`}
                                                    >
                                                        <RarityLabel rarity={() => ALL_CARDS[name].rarity}>
                                                            {CardUtils.getCardNameAndExpansion(name)}
                                                        </RarityLabel>
                                                        <span>{CardUtils.formatScore(score)}</span>
                                                    </div>
                                                </button>
                                            );
                                        }}
                                    </For>
                                </div>
                            );
                        }}
                    </For>
                </div>
            </Surface>
        </>
    );
};
