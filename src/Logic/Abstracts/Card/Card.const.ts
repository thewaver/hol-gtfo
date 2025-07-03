import { CardName, CardRarity } from "./Card.types";

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
    "Blue Knight": "CR2",
    "Bone": "CR1",
    "Colossus": "CR3",
    "Death": "CR1",
    "Death Sprite": "CR2",
    "Demon": "CR1",
    "Demonologist": "CR3",
    "Devil": "CR3",
    "Dirigible": "CR2",
    "Dragon": "CR2",
    "Druid": "CR3",
    "Dryad": "CR2",
    "Earth": "CR1",
    "Enraged Beast": "CR2",
    "Enraged Demon": "CR2",
    "Fairy": "CR1",
    "Fallen Angel": "CR3",
    "Fire": "CR1",
    "Fire Giant": "CR3",
    "Fire Golem": "CR3",
    "Fire Sprite": "CR2",
    "Fireball": "CR2",
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
    "Ice Imp": "CR2",
    "Knight": "CR2",
    "Living Skeleton": "CR2",
    "Magic": "CR2",
    "Mechanical Angel": "CR3",
    "Mechanical Beast": "CR3",
    "Mechanical Golem": "CR2",
    "Mechanical Dragon": "CR2",
    "Mechanism": "CR2",
    "Mermaid": "CR3",
    "Metal": "CR1",
    "Necromancer": "CR2",
    "Obsession": "CR3",
    "Poison": "CR1",
    "Pyromancer": "CR2",
    "Red Knight": "CR2",
    "Sand Storm": "CR2",
    "Scrap Metal": "CR1",
    "Skeletal Dragon": "CR3",
    "Skeletal Snake": "CR2",
    "Snake": "CR1",
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
    "Wings": "CR1",
    "Wizard": "CR2",
    "Wooden Golem": "CR3",
    "Wraith": "CR3",
    "Wyvern": "CR1",
};

const SINGLE_DIR_CARD_COMBOS: Partial<Record<CardName, Partial<Record<CardName, CardName>>>> = {
    Air: {
        Angel: "Archangel",
        Ash: "Sand Storm",
        Beast: "Bird",
        Bone: "Death Sprite",
        Death: "Harpy",
        Dragon: "Wyvern",
        Fairy: "Ghost",
        Fire: "Fireball",
        Giant: "Air Elemental",
        Knight: "Warrior Angel",
        Magic: "Aeromancer",
        Metal: "Dirigible",
        Snake: "Wyvern",
        Undead: "Harpy",
        Wizard: "Aeromancer",
    },
    Angel: {
        Angel: "Archangel",
        Ash: "Fallen Angel",
        Death: "Fallen Angel",
        Demon: "Fallen Angel",
        Fairy: "Archangel",
        Knight: "Warrior Angel",
        Magic: "Archangel",
        Metal: "Mechanical Angel",
        Undead: "Fallen Angel",
        Vampire: "Fallen Angel",
        Wings: "Archangel",
        Wizard: "Archangel",
    },
    Ash: {
        Fairy: "Death Sprite",
        Fire: "Ash",
        Magic: "Geomancer",
        Tree: "Ash",
        Vampire: "Ash",
        Water: "Earth",
    },
    Beast: {
        Bone: "Undead Beast",
        Giant: "Enraged Beast",
        Magic: "Unicorn",
        Metal: "Mechanical Beast",
        Snake: "Huge Snake",
        Tree: "Basilisk",
        Vampire: "Enraged Beast",
        Wizard: "Druid",
    },
    Bone: {
        Bone: "Living Skeleton",
        Demon: "Wraith",
        Fairy: "Death Sprite",
        Giant: "Undead Giant",
        Golem: "Undead Giant",
        Human: "Living Skeleton",
        Knight: "Undead Knight",
        Magic: "Living Skeleton",
        Snake: "Skeletal Snake",
        Undead: "Living Skeleton",
        Wings: "Death Sprite",
    },
    Death: {
        Demon: "Skeletal Dragon",
        Dragon: "Skeletal Dragon",
        Giant: "Undead Giant",
        Human: "Undead",
        Knight: "Undead Knight",
        Magic: "Undead",
        Poison: "Snake",
        Spirit: "Ghost",
        Vampire: "Ash",
        Water: "Poison",
        Wings: "Harpy",
    },
    Demon: {
        Fairy: "Ice Imp",
        Fire: "Enraged Demon",
        Giant: "Devil",
        Golem: "Undead Giant",
        Human: "Obsession",
        Knight: "Undead Knight",
        Magic: "Devil",
        Vampire: "High Vampire",
        Water: "Ice Imp",
    },
    Dragon: {
        Fire: "Dragon",
        Human: "Ash",
        Metal: "Mechanical Dragon",
        Spirit: "Astral Dragon",
        Water: "Water Dragon",
    },
    Earth: {
        Fairy: "Dryad",
        Golem: "Golem",
        Human: "Golem",
        Knight: "Green Knight",
        Magic: "Geomancer",
        Tree: "Tree",
        Water: "Waterfall",
        Wizard: "Geomancer",
    },
    Fairy: {
        Fire: "Fire Sprite",
        Giant: "Angel",
        Human: "Dryad",
        Metal: "Dirigible",
        Tree: "Dryad",
        Undead: "Death Sprite",
        Vampire: "Death Sprite",
    },
    Fire: {
        Giant: "Fire Giant",
        Golem: "Fire Golem",
        Human: "Ash",
        Knight: "Red Knight",
        Magic: "Pyromancer",
        Tree: "Ash",
        Vampire: "Ash",
        Water: "Ash",
    },
    Giant: {
        Golem: "Colossus",
        Human: "Giant",
        Snake: "Huge Snake",
    },
    Golem: {
        Magic: "Colossus",
        Metal: "Mechanical Golem",
        Tree: "Wooden Golem",
        Undead: "Undead Giant",
        Vampire: "Undead Giant",
    },
    Human: {
        Knight: "Blue Knight",
        Magic: "Wizard",
        Metal: "Knight",
        Poison: "Death",
        Snake: "Death",
        Spirit: "Ghost",
        Tree: "Druid",
        Undead: "Undead",
        Vampire: "Vampire",
        Water: "Mermaid",
        Wings: "Angel",
    },
    Knight: {
        Tree: "Green Knight",
        Undead: "Undead Knight",
        Water: "Blue Knight",
        Wings: "Warrior Angel",
        Wizard: "Battle Mage",
    },
    Magic: {
        Metal: "Mechanism",
        Undead: "Undead Mage",
        Vampire: "High Vampire",
        Water: "Hydromancer",
        Wizard: "Archmage",
    },
    Metal: {
        Undead: "Undead Knight",
        Vampire: "Undead Giant",
        Water: "Scrap Metal",
    },
    Poison: {
        Snake: "Poison",
    },
    Snake: {
        Undead: "Skeletal Snake",
        Water: "Hydra",
        Wings: "Wyvern",
    },
    Undead: {
        Wings: "Harpy",
    },
};

const addedPairs = new Set<string>();

export const CARD_COMBO_ARRAY: Array<{ card1: CardName; card2: CardName; result: CardName; rarity: CardRarity }> = (
    Object.keys(SINGLE_DIR_CARD_COMBOS) as CardName[]
).flatMap((card1) => {
    return (Object.keys(SINGLE_DIR_CARD_COMBOS[card1]!) as CardName[]).flatMap((card2) => {
        const result = SINGLE_DIR_CARD_COMBOS[card1]![card2]!;
        const rarity = CARD_RANKS[SINGLE_DIR_CARD_COMBOS[card1]![card2]!]!;
        const pair1 = `${card1}|${card2}`;
        const pair2 = `${card2}|${card1}`;
        const newCombos = [];

        if (!addedPairs.has(pair1)) {
            newCombos.push({ card1, card2, result, rarity });
            addedPairs.add(pair1);
        }

        if (!addedPairs.has(pair2)) {
            newCombos.push({ card1: card2, card2: card1, result, rarity });
            addedPairs.add(pair2);
        }

        return newCombos;
    });
});

export const CARD_COMBOS: Partial<Record<CardName, Partial<Record<CardName, CardName>>>> = CARD_COMBO_ARRAY.reduce(
    (res, cur) => {
        res[cur.card1] = { ...res[cur.card1], [cur.card2]: cur.result };
        res[cur.card2] = { ...res[cur.card2], [cur.card1]: cur.result };

        return res;
    },
    {} as Partial<Record<CardName, Partial<Record<CardName, CardName>>>>,
);

export const CARD_RARITY_DESK: Record<CardRarity, string> = {
    CR1: "Common",
    CR2: "Uncommon",
    CR3: "Rare",
    CR4: "Epic",
};

console.log(CARD_COMBOS);
