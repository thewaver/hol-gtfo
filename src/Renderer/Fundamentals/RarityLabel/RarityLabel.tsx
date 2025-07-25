import { ParentProps } from "solid-js";

import { RarityLabelProps } from "./RarityLabel.types";

import "./RarityLabel.css";

export const RarityLabel = (props: ParentProps<RarityLabelProps>) => {
    return <div class={`rarityLabel ${props.rarity()}`}>{props.children}</div>;
};
