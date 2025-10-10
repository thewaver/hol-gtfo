export const CARD_RARITIES = ["Common", "Uncommon", "Rare", "Epic"] as const;
export type CardRarity = (typeof CARD_RARITIES)[number];

export type CardName = string;

export type ExpansionName =
    | "Base Game"
    | "Forbidden Depths"
    | "Masquerade of Lust"
    | "Cupid on Vacation"
    | "Spring Break"
    | "Game Fest"
    | "Deeper Into the Tale"
    | "Clinic of Pleasures"
    | "Path to Ecstasy";

export type Card = {
    name: CardName;
    rarity: CardRarity;
    isBasic: boolean;
    isResult: boolean;
    baseAttack: number;
    baseDefense: number;
    expansion: ExpansionName;
};

export type CardStats = {
    atk: number;
    def: number;
};

export type CardMap = Record<CardName, Card>;

export type CardCombo = {
    card1: string;
    card2: string;
    result: string;
};

export type ComboMap = Record<
    CardName,
    {
        pairs: Record<
            CardName,
            {
                result: CardName;
                resultStats: CardStats;
                resultScore: number;
                resultRarityIndex: number;
            }
        >;
        totalScore: number;
    }
>;

export type CardPowerOpts = {
    bias: number;
    exponent: number;
    costRatio: number;
    cardLevel: number;
};

export type CardCount = 0 | 1 | 2 | 3;

export type CardDeckOpts = {
    deckSize: number;
    maxCardsOfRarity: Record<CardRarity, number>;
    autoIncludedCards?: CardName[];
};
