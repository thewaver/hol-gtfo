import { createMemo, createSignal } from "solid-js";

import { PARSED_COMBOS } from "../Logic/Abstracts/Card/Card.const";
import { ExpansionName } from "../Logic/Abstracts/Card/Card.types";
import { CardUtils } from "../Logic/Abstracts/Card/Card.utils";

export namespace AppStore {
    export const [getExpansions, setExpansuions] = createSignal<Set<ExpansionName>>(new Set(["Base"]));
    export const [getPowerBias, setPowerBias] = createSignal(50);
    export const [getPowerExponent, setPowerExponent] = createSignal(3);
    export const [getCardLevel, setCardLevel] = createSignal(4);

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
        const bestDeck = CardUtils.getBestDeck(comboMap, absoluteScores);

        console.log(bestDeck);

        return {
            comboMap,
            symmetricalComboCount,
            comboCountsByCard: byCard,
            comboCountsTotal: totals,
            comboCountsMax: max,
            absoluteScores,
            bestDeck,
        };
    });
}
