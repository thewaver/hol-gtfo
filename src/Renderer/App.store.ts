import { createMemo, createSignal } from "solid-js";

import { PARSED_COMBOS } from "../Logic/Abstracts/Card/Card.const";
import { ExpansionName } from "../Logic/Abstracts/Card/Card.types";
import { CardUtils } from "../Logic/Abstracts/Card/Card.utils";

export namespace AppStore {
    export const [getExpansions, setExpansuions] = createSignal<Set<ExpansionName>>(new Set(["Base"]));
    export const [getPowerBias, setPowerBias] = createSignal(65);

    export const getComputedData = createMemo(() => {
        const expansions = getExpansions();
        const powerBias = getPowerBias();

        const { comboMap, symmetricalComboCount } = CardUtils.getComboMap(PARSED_COMBOS, expansions);
        const { byCard, totals, max } = CardUtils.getComboCounts(comboMap, expansions);
        const absoluteScores = CardUtils.getAbsoluteScores(comboMap, expansions, powerBias);
        const relativeScores = CardUtils.getRelativeScores(comboMap, expansions, powerBias, absoluteScores);

        return {
            comboMap,
            symmetricalComboCount,
            comboCountsByCard: byCard,
            comboCountsTotal: totals,
            comboCountsMax: max,
            absoluteScores,
            relativeScores,
        };
    });
}
