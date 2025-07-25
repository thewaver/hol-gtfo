import { AppStore } from "../../App.store";
import { PowerSettingsProps } from "./PowerSettings.types";

export const PowerSettings = (props: PowerSettingsProps) => {
    return (
        <>
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
            <label>
                <span>{"Power scale"}</span>
                <input
                    type="range"
                    min={1}
                    max={5}
                    step={1}
                    value={AppStore.getPowerScale()}
                    onChange={(e) => {
                        AppStore.setPowerScale(parseFloat(e.target.value));
                    }}
                />
                <span>{`${AppStore.getPowerScale()}`}</span>
            </label>
        </>
    );
};
