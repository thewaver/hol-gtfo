export type CardRarity = "Common" | "Uncommon" | "Rare" | "Epic";

export type CardName = string;

export type Card = {
    name: CardName;
    rarity: CardRarity;
    isBasic: boolean;
    isResult: boolean;
    baseAttack: number;
    baseDefense: number;
};

export type CardCombo = {
    card1: string;
    card2: string;
    result: string;
};
