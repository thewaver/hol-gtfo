import { AppStore } from "../../App.store";
import { PowerSettingsProps } from "./PowerSettings.types";

export const PowerSettings = (props: PowerSettingsProps) => {
    return (
        <>
            <label
                title={`Set the ideal ATK / DEF ratio of a result card. The more a card's stats deviate from this ratio, the lower its score.`}
            >
                <span>{"Power bias"}</span>
                <span>{`DEF ${100 - AppStore.getPowerBias()}`}</span>
                <input
                    type="range"
                    min={0}
                    max={100}
                    step={5}
                    value={AppStore.getPowerBias()}
                    onChange={(e) => {
                        AppStore.setPowerBias(parseFloat(e.target.value));
                    }}
                />
                <span>{`ATK ${AppStore.getPowerBias()}`}</span>
            </label>
            <label title="Higher values result in higher aggregated scores for cards that produce stronger combos instead of higher combo counts.">
                <span>{"Combo bias"}</span>
                <span>{`CNT ${5 - AppStore.getPowerExponent()}`}</span>
                <input
                    type="range"
                    min={1}
                    max={5}
                    step={1}
                    value={AppStore.getPowerExponent()}
                    onChange={(e) => {
                        AppStore.setPowerExponent(parseFloat(e.target.value));
                    }}
                />
                <span>{`PWR ${AppStore.getPowerExponent()}`}</span>
            </label>
            <label title="A percentual penalty applied to result card scores based on the rarity of the 2 base cards required to create it.">
                <span>{"Rarity cost"}</span>
                <input
                    type="number"
                    min={0}
                    max={0.5}
                    step={0.05}
                    value={AppStore.getCostRatio()}
                    onChange={(e) => {
                        AppStore.setCostRatio(Math.min(Math.max(Number(e.target.value), 0), 0.5));
                    }}
                />
            </label>
            <label title="The level of the deck's base cards. Combined with the base card's rarity to determine a result card's ATK and DEF.">
                <span>{"Card level"}</span>
                <input
                    type="number"
                    min={1}
                    max={5}
                    step={1}
                    value={AppStore.getCardLevel()}
                    onChange={(e) => {
                        AppStore.setCardLevel(Math.min(Math.max(Number(e.target.value), 1), 5));
                    }}
                />
            </label>
        </>
    );
};
