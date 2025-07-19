import { CardName, CardRarity } from "./Card.types";

export const CARD_RANK_SCORES: Record<CardRarity, number> = {
    CR0: 0,
    CR1: 1,
    CR2: 4,
    CR3: 12,
    CR4: 24,
};

export const CARD_RANK_DESC: Record<CardRarity, string> = {
    CR0: "__UNKNOWN__",
    CR1: "Common",
    CR2: "Uncommon",
    CR3: "Rare",
    CR4: "Epic",
};

export const CARD_RANKS: Record<CardName, CardRarity> = {
    "Aeromancer": "CR2",
    "Air": "CR1",
    "Air Elemental": "CR2",
    "Angel": "CR2",
    "Archangel": "CR3",
    "Archmage": "CR3",
    "Ash": "CR1",
    "Astral Dragon": "CR3",
    "Basilisk": "CR3",
    "Battle Mage": "CR2",
    "Beast": "CR1",
    "Bird": "CR2",
    "Blizzard": "CR3",
    "Blue Knight": "CR2",
    "Bone": "CR1",
    "Colossus": "CR3",
    "Death": "CR1",
    "Death Sprite": "CR2",
    "Decay Demon": "CR3",
    "Demon": "CR1",
    "Demonologist": "CR3",
    "Devil": "CR3",
    "Dirigible": "CR2",
    "Dragon": "CR2",
    "Druid": "CR3",
    "Dryad": "CR2",
    "Earth": "CR1",
    "Earthquake": "CR1",
    "Enraged Beast": "CR2",
    "Enraged Demon": "CR2",
    "Entropic Magic": "CR3",
    "Explosion": "CR3",
    "Fairy": "CR1",
    "Fallen Angel": "CR3",
    "Fire": "CR1",
    "Fire Giant": "CR3",
    "Fire Golem": "CR3",
    "Fire Sprite": "CR2",
    "Fireball": "CR2",
    "Jackpot": "CR3",
    "Game": "CR3",
    "Geomancer": "CR2",
    "Ghost": "CR3",
    "Giant": "CR2",
    "Giant Snake": "CR3",
    "Golem": "CR1",
    "Green Knight": "CR2",
    "Harpy": "CR1",
    "High Vampire": "CR3",
    "Huge Snake": "CR3",
    "Human": "CR1",
    "Hydra": "CR2",
    "Hydromancer": "CR2",
    "Ice": "CR3",
    "Ice Imp": "CR2",
    "Infectious": "CR3",
    "Knight": "CR2",
    "Lava": "CR1",
    "Living Skeleton": "CR2",
    "Lich": "CR3",
    "Magic": "CR2",
    "Mechanical Angel": "CR3",
    "Mechanical Beast": "CR3",
    "Mechanical Golem": "CR2",
    "Mechanical Dragon": "CR2",
    "Mechanism": "CR2",
    "Mermaid": "CR3",
    "Metal": "CR1",
    "Mind Control": "CR2",
    "Mutation": "CR3",
    "Necromancer": "CR2",
    "Obsession": "CR3",
    "Plague": "CR3",
    "Playing Cards": "CR3",
    "Poison": "CR1",
    "Poisoner": "CR3",
    "Poisonous Dragon": "CR3",
    "Pyromancer": "CR2",
    "Red Knight": "CR2",
    "Sand Storm": "CR2",
    "Scrap Metal": "CR1",
    "Skeletal Dragon": "CR3",
    "Skeletal Snake": "CR2",
    "Snake": "CR1",
    "Spin the Bottle": "CR3",
    "Spirit": "CR3",
    "Tree": "CR1",
    "Undead": "CR1",
    "Undead Beast": "CR3",
    "Undead Giant": "CR2",
    "Undead Knight": "CR3",
    "Undead Mage": "CR3",
    "Unicorn": "CR3",
    "Vampire": "CR1",
    "Warrior Angel": "CR2",
    "Water": "CR1",
    "Water Dragon": "CR3",
    "Waterfall": "CR2",
    "Wind": "CR2",
    "Wind Demon": "CR2",
    "Wings": "CR1",
    "Wizard": "CR2",
    "Wooden Golem": "CR3",
    "Wraith": "CR3",
    "Wyvern": "CR1",
    "__UNKNOWN__": "CR0",
};

const SINGLE_DIR_CARD_COMBOS: Partial<Record<CardName, Partial<Record<CardName, CardName>>>> = {
    "Air": {
        Air: "__UNKNOWN__",
        Ash: "Sand Storm",
        Beast: "Bird",
        Bone: "Death Sprite",
        Death: "Harpy",
        Demon: "Wind Demon",
        Dragon: "Wyvern",
        Earth: "Ash",
        Fairy: "Ghost",
        Fire: "Fireball",
        Giant: "Air Elemental",
        Ice: "Blizzard",
        Knight: "Warrior Angel",
        Magic: "Aeromancer",
        Metal: "Dirigible",
        Snake: "Wyvern",
        Spirit: "Air Elemental",
        Undead: "Harpy",
        Vampire: "High Vampire",
        Wizard: "Aeromancer",
    },
    "Angel": {
        "Angel": "Archangel",
        "Ash": "Fallen Angel",
        "Death": "Fallen Angel",
        "Demon": "Fallen Angel",
        "Entropic Magic": "Fallen Angel",
        "Fairy": "Archangel",
        "Knight": "Warrior Angel",
        "Magic": "Archangel",
        "Metal": "Mechanical Angel",
        "Undead": "Fallen Angel",
        "Vampire": "Fallen Angel",
        "Wings": "Archangel",
        "Wizard": "Archangel",
    },
    "Ash": {
        "Ash": "__UNKNOWN__",
        "Death": "Sand Storm",
        "Dragon": "Skeletal Dragon",
        "Entropic Magic": "Sand Storm",
        "Fairy": "Death Sprite",
        "Game": "Earthquake",
        "Magic": "Geomancer",
        "Spirit": "Air Elemental",
        "Water": "Earth",
        "Wind": "Sand Storm",
        "Wizard": "Geomancer",
    },
    "Beast": {
        Bone: "Undead Beast",
        Death: "Undead Beast",
        Demon: "Enraged Beast",
        Game: "Druid",
        Giant: "Enraged Beast",
        Magic: "Unicorn",
        Metal: "Mechanical Beast",
        Snake: "Huge Snake",
        Tree: "Basilisk",
        Undead: "Undead Beast",
        Vampire: "Enraged Beast",
        Wind: "Bird",
        Wings: "Bird",
        Wizard: "Druid",
    },
    "Bone": {
        "Bone": "Living Skeleton",
        "Demon": "Wraith",
        "Dragon": "Skeletal Dragon",
        "Entropic Magic": "Necromancer",
        "Fairy": "Death Sprite",
        "Fire": "Ash",
        "Giant": "Undead Giant",
        "Golem": "Undead Giant",
        "Human": "Living Skeleton",
        "Knight": "Undead Knight",
        "Magic": "Living Skeleton",
        "Snake": "Skeletal Snake",
        "Spirit": "Living Skeleton",
        "Undead": "Living Skeleton",
        "Wings": "Death Sprite",
        "Wizard": "Necromancer",
    },
    "Death": {
        "Demon": "Skeletal Dragon",
        "Dragon": "Skeletal Dragon",
        "Earth": "Earthquake",
        "Entropic Magic": "Necromancer",
        "Fairy": "Death Sprite",
        "Fire": "Lava",
        "Game": "Necromancer",
        "Giant": "Undead Giant",
        "Human": "Undead",
        "Ice": "Blizzard",
        "Knight": "Undead Knight",
        "Magic": "Undead",
        "Mutation": "Undead",
        "Poison": "Snake",
        "Snake": "Poison",
        "Spirit": "Ghost",
        "Vampire": "Ash",
        "Water": "Poison",
        "Wind": "Sand Storm",
        "Wings": "Harpy",
        "Wizard": "Necromancer",
    },
    "Demon": {
        "Fairy": "Ice Imp",
        "Fire": "Enraged Demon",
        "Entropic Magic": "Enraged Demon",
        "Game": "Playing Cards",
        "Giant": "Devil",
        "Golem": "Undead Giant",
        "Human": "Obsession",
        "Ice": "Ice Imp",
        "Knight": "Undead Knight",
        "Magic": "Devil",
        "Mind Control": "Devil",
        "Poison": "Decay Demon",
        "Vampire": "High Vampire",
        "Water": "Ice Imp",
        "Wind": "Wind Demon",
        "Wizard": "Demonologist",
    },
    "Dragon": {
        "Fire": "Dragon",
        "Human": "Ash",
        "Magic": "Astral Dragon",
        "Metal": "Mechanical Dragon",
        "Mind Control": "Astral Dragon",
        "Poison": "Poisonous Dragon",
        "Snake": "Hydra",
        "Spirit": "Astral Dragon",
        "Undead": "Skeletal Dragon",
        "Water": "Water Dragon",
    },
    "Earth": {
        "Earth": "__UNKNOWN__",
        "Entropic Magic": "Earthquake",
        "Fairy": "Dryad",
        "Fire": "Lava",
        "Game": "Spin the Bottle",
        "Giant": "Golem",
        "Golem": "Golem",
        "Human": "Golem",
        "Ice": "Blizzard",
        "Knight": "Green Knight",
        "Magic": "Geomancer",
        "Water": "Waterfall",
        "Wind": "Sand Storm",
        "Wizard": "Geomancer",
    },
    "Entropic Magic": {
        Fire: "Lava",
        Giant: "Undead Giant",
        Human: "Undead",
        Knight: "Undead Knight",
        Magic: "Explosion",
        Metal: "Scrap Metal",
        Undead: "Lich",
        Vampire: "High Vampire",
    },
    "Fairy": {
        Fire: "Fire Sprite",
        Giant: "Angel",
        Human: "Dryad",
        Ice: "Ice Imp",
        Metal: "Dirigible",
        Tree: "Dryad",
        Undead: "Death Sprite",
        Vampire: "Death Sprite",
        Water: "Ice Imp",
    },
    "Fire": {
        Fire: "__UNKNOWN__",
        Game: "Pyromancer",
        Giant: "Fire Giant",
        Golem: "Fire Golem",
        Human: "Ash",
        Ice: "Water",
        Knight: "Red Knight",
        Magic: "Pyromancer",
        Spirit: "Fire Sprite",
        Tree: "Ash",
        Undead: "Ash",
        Vampire: "Ash",
        Water: "Ash",
        Wind: "Fireball",
        Wizard: "Pyromancer",
    },
    "Game": {
        Ice: "Blizzard",
        Metal: "Jackpot",
        Poison: "Poisoner",
        Tree: "Playing Cards",
        Undead: "Infectious",
        Vampire: "Spin the Bottle",
        Water: "Spin the Bottle",
        Wind: "Aeromancer",
    },
    "Giant": {
        Golem: "Colossus",
        Human: "Giant",
        Metal: "Colossus",
        Snake: "Huge Snake",
        Tree: "Wooden Golem",
        Undead: "Undead Giant",
        Wind: "Wind Demon",
    },
    "Golem": {
        Magic: "Colossus",
        Metal: "Mechanical Golem",
        Tree: "Wooden Golem",
        Undead: "Undead Giant",
        Vampire: "Undead Giant",
    },
    "Human": {
        "Magic": "Wizard",
        "Metal": "Knight",
        "Mind Control": "Obsession",
        "Poison": "Death",
        "Snake": "Death",
        "Spirit": "Ghost",
        "Tree": "Druid",
        "Undead": "Undead",
        "Vampire": "Vampire",
        "Water": "Mermaid",
        "Wings": "Angel",
    },
    "Ice": {
        Knight: "Blue Knight",
        Magic: "Hydromancer",
        Water: "Ice",
        Wind: "Blizzard",
        Wings: "Ice Imp",
        Wizard: "Hydromancer",
    },
    "Knight": {
        Magic: "Battle Mage",
        Poison: "Green Knight",
        Tree: "Green Knight",
        Undead: "Undead Knight",
        Water: "Blue Knight",
        Wind: "Blue Knight",
        Wings: "Warrior Angel",
        Wizard: "Battle Mage",
    },
    "Magic": {
        Metal: "Mechanism",
        Tree: "Wooden Golem",
        Undead: "Undead Mage",
        Vampire: "High Vampire",
        Water: "Hydromancer",
        Wizard: "Archmage",
    },
    "Metal": {
        Metal: "__UNKNOWN__",
        Undead: "Undead Knight",
        Water: "Scrap Metal",
    },
    "Mind Control": {
        Undead: "Ghost",
        Vampire: "High Vampire",
    },
    "Poison": {
        Snake: "Poison",
        Undead: "Infectious",
        Water: "Poison",
        Wizard: "Poisoner",
    },
    "Snake": {
        Undead: "Skeletal Snake",
        Water: "Hydra",
        Wind: "Wyvern",
        Wings: "Wyvern",
    },
    "Spirit": {
        Tree: "Dryad",
        Wind: "Air Elemental",
    },
    "Tree": {
        Wizard: "Geomancer",
    },
    "Undead": {
        Undead: "Plague",
        Wind: "Harpy",
        Wings: "Harpy",
        Wizard: "Undead Mage",
    },
    "Vampire": {
        Wings: "High Vampire",
    },
    "Water": {
        Water: "__UNKNOWN__",
        Wings: "Ice Imp",
        Wizard: "Hydromancer",
    },
    "Wind": {
        Wizard: "Aeromancer",
    },
};

export const [CARD_COMBOS, SYMMETRICAL_PAIR_COUNT] = (() => {
    let symmetricalComboCount = 0;

    const comboMap: Partial<Record<CardName, Partial<Record<CardName, CardName>>>> = {};

    for (const a in SINGLE_DIR_CARD_COMBOS) {
        const card1 = a as CardName;

        for (const b in SINGLE_DIR_CARD_COMBOS[card1]) {
            const card2 = b as CardName;
            const cardResult = SINGLE_DIR_CARD_COMBOS[card1][card2];

            comboMap[card1] ??= {};
            comboMap[card1][card2] = cardResult;
            comboMap[card2] ??= {};
            comboMap[card2][card1] = cardResult;

            if (card1 === card2) {
                symmetricalComboCount += 1;
            }
        }
    }

    return [comboMap, symmetricalComboCount];
})();

export const CARD_COMBO_ARRAY: Array<{ card1: CardName; card2: CardName; result: CardName; rarity: CardRarity }> = (
    Object.keys(CARD_COMBOS) as CardName[]
).flatMap((card1) => {
    return (Object.keys(CARD_COMBOS[card1]!) as CardName[]).map((card2) => {
        const result = CARD_COMBOS[card1]![card2]!;
        const rarity = CARD_RANKS[CARD_COMBOS[card1]![card2]!]!;

        return { card1, card2, result, rarity };
    });
});

export const CARD_ABSOLUTE_SCORES = (Object.keys(CARD_RANKS) as CardName[]).reduce(
    (res, card1) => {
        res[card1] = (Object.keys(CARD_COMBOS[card1] ?? {}) as CardName[]).reduce(
            (sum, card2) => {
                const result = CARD_COMBOS[card1]![card2];

                if (!result || result === "__UNKNOWN__") {
                    return sum;
                }

                const score = CARD_RANK_SCORES[CARD_RANKS[result]];

                sum.push({ score, pair: card2, result });

                return sum;
            },
            [] as { score: number; pair: CardName; result: CardName }[],
        );

        return res;
    },
    {} as Record<CardName, { score: number; pair: CardName; result: CardName }[]>,
);

export const CARD_RELATIVE_SCORES = (Object.keys(CARD_RANKS) as CardName[]).reduce(
    (res, card1) => {
        res[card1] = (Object.keys(CARD_COMBOS[card1] ?? {}) as CardName[]).reduce(
            (sum, card2) => {
                const result = CARD_COMBOS[card1]![card2];

                if (!result || result === "__UNKNOWN__") {
                    return sum;
                }

                const resultScore = CARD_RANK_SCORES[CARD_RANKS[result]];
                const pairScore = CARD_ABSOLUTE_SCORES[card2].reduce((sum, { score }) => sum + score, 0);

                sum.push({ pairScore, resultScore, pair: card2, result });

                return sum;
            },
            [] as { pairScore: number; resultScore: number; pair: CardName; result: CardName }[],
        );

        return res;
    },
    {} as Record<CardName, { pairScore: number; resultScore: number; pair: CardName; result: CardName }[]>,
);

export const CARD_SCORE_ARRAY = (Object.keys(CARD_RELATIVE_SCORES) as CardName[]).map((card) => ({
    card,
    absoluteScore: CARD_ABSOLUTE_SCORES[card].reduce((sum, { score }) => sum + score, 0),
    relativeScore: CARD_RELATIVE_SCORES[card].reduce(
        (sum, { pairScore, resultScore }) => sum + pairScore * resultScore,
        0,
    ),
}));
