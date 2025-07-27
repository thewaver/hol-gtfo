export const CARD_RARITIES = ["Common", "Uncommon", "Rare", "Epic"] as const;
export type CardRarity = (typeof CARD_RARITIES)[number];

export type CardName = string;

export type ExpansionName = string;

export type Card = {
    name: CardName;
    rarity: CardRarity;
    isBasic: boolean;
    isResult: boolean;
    baseAttack: number;
    baseDefense: number;
    expansion: ExpansionName;
};

export type CardMap = Record<CardName, Card>;

export type CardCombo = {
    card1: string;
    card2: string;
    result: string;
};

export type ComboMap = Record<CardName, Record<CardName, CardName>>;

export type CardPowerOpts = {
    bias: number;
    exponent: number;
    level: number;
};

export type CardDeckOpts = {
    copiesOfCard: Record<CardRarity, 0 | 1 | 2 | 3>;
    cardsOfRarity: Record<CardRarity, number>;
};
