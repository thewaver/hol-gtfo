import { createMemo, createSignal } from "solid-js";

import { PARSED_COMBOS } from "../Logic/Abstracts/Card/Card.const";
import { CardDeckOpts, ExpansionName } from "../Logic/Abstracts/Card/Card.types";
import { CardUtils } from "../Logic/Abstracts/Card/Card.utils";

export namespace AppStore {
    export const [getExpansions, setExpansuions] = createSignal<Set<ExpansionName>>(new Set(["Base Game"]));
    export const [getPowerBias, setPowerBias] = createSignal(65);
    export const [getPowerExponent, setPowerExponent] = createSignal(3);
    export const [getCardLevel, setCardLevel] = createSignal(4);
    export const [getDeckSettings, setDeckSettings] = createSignal<CardDeckOpts>({
        cardsOfRarity: { Common: 30, Uncommon: 10, Rare: 5, Epic: 0 },
        copiesOfCard: { Common: 3, Uncommon: 2, Rare: 1, Epic: 0 },
    });

    export const getComputedData = createMemo(() => {
        const expansions = getExpansions();
        const powerOpts = {
            bias: getPowerBias(),
            exponent: getPowerExponent(),
            level: getCardLevel(),
        };

        const { comboMap, symmetricalComboCount } = CardUtils.getComboMap(PARSED_COMBOS, expansions);
        const { byCard, totals, max } = CardUtils.getComboCounts(comboMap);
        const absoluteScores = CardUtils.getAbsoluteScores(comboMap, powerOpts);

        return {
            comboMap,
            symmetricalComboCount,
            comboCountsByCard: byCard,
            comboCountsTotal: totals,
            comboCountsMax: max,
            absoluteScores,
        };
    });
}
