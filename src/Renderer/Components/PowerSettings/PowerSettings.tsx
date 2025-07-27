import { AppStore } from "../../App.store";
import { PowerSettingsProps } from "./PowerSettings.types";

export const PowerSettings = (props: PowerSettingsProps) => {
    return (
        <>
            <label title="Higher values put more weight on ATK than DEF">
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
            <label title="Higher values put more weight in stronger combos than total combo count">
                <span>{"Power exponent"}</span>
                <input
                    type="number"
                    min={1}
                    max={5}
                    step={1}
                    value={AppStore.getPowerExponent()}
                    onChange={(e) => {
                        AppStore.setPowerExponent(parseFloat(e.target.value));
                    }}
                />
            </label>
            <label title="Determines ATK and DEF in conjunction with rarity">
                <span>{"Card level"}</span>
                <input
                    type="number"
                    min={1}
                    max={5}
                    step={1}
                    value={AppStore.getCardLevel()}
                    onChange={(e) => {
                        AppStore.setCardLevel(parseFloat(e.target.value));
                    }}
                />
            </label>
        </>
    );
};
