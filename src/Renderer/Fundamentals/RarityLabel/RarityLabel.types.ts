import { Accessor } from "solid-js";

import { CardRarity } from "../../../Logic/Abstracts/Card/Card.types";

export type RarityLabelProps = {
    rarity: Accessor<CardRarity>;
};
