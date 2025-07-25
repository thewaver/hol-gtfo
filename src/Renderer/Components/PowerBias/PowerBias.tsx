import { AppStore } from "../../App.store";
import { PowerBiasProps } from "./PowerBias.types";

export const PowerBias = (props: PowerBiasProps) => {
    return (
        <label>
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
    );
};
