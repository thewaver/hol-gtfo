import { CardName, CardRarity } from "./Card.types";

export const CARD_RANKS: Record<CardName, CardRarity> = {
    "Aeromancer": "CR2",
    "Air": "CR1",
    "Air Elemental": "CR2",
    "Angel": "CR2",
    "Archangel": "CR3",
    "Archmage": "CR3",
    "Ash": "CR1",
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
        Magic: "Geomancer",
    },
    Beast: {
        Giant: "Enraged Beast",
        Metal: "Mechanical Beast",
        Snake: "Huge Snake",
        Tree: "Basilisk",
        Vampire: "Enraged Beast",
        Wizard: "Dryad",
    },
    Bone: {
        Bone: "Living Skeleton",
        Demon: "Wraith",
        Fairy: "Death Sprite",
        Golem: "Undead Giant",
        Human: "Living Skeleton",
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
        Vampire: "Ash",
        Water: "Poison",
        Wings: "Harpy",
    },
    Fairy: {
        Air: "Ghost",
        Ash: "Death Sprite",
        Demon: "Ice Imp",
        Earth: "Dryad",
        Fire: "Fire Sprite",
        Human: "Dryad",
        Metal: "Dirigible",
        Tree: "Dryad",
        Undead: "Death Sprite",
        Vampire: "Death Sprite",
    },
    Fire: {
        Air: "Fireball",
        Dragon: "Dragon",
        Golem: "Fire Golem",
        Human: "Ash",
        Magic: "Pyromancer",
        Tree: "Ash",
        Vampire: "Ash",
        Water: "Ash",
    },
    Giant: {
        Air: "Air Elemental",
        Beast: "Enraged Beast",
        Bone: "Undead Giant",
        Death: "Undead Giant",
        Demon: "Devil",
        Fairy: "Angel",
        Fire: "Fire Giant",
        Golem: "Colossus",
        Human: "Giant",
        Snake: "Huge Snake",
    },
    Golem: {
        Demon: "Undead Giant",
        Earth: "Golem",
        Fire: "Fire Golem",
        Giant: "Colossus",
        Magic: "Colossus",
        Metal: "Mechanical Golem",
        Tree: "Wooden Golem",
        Undead: "Undead Giant",
        Vampire: "Undead Giant",
    },
    Human: {
        Earth: "Golem",
        Fairy: "Dryad",
        Fire: "Ash",
        Knight: "Blue Knight",
        Metal: "Knight",
        Poison: "Death",
        Snake: "Death",
        Undead: "Undead",
        Vampire: "Vampire",
        Wings: "Angel",
    },
    Knight: {
        Bone: "Undead Knight",
        Demon: "Undead Knight",
        Earth: "Green Knight",
        Fire: "Red Knight",
        Tree: "Green Knight",
        Undead: "Undead Knight",
        Water: "Blue Knight",
        Wings: "Warrior Angel",
        Wizard: "Battle Mage",
    },
    Magic: {
        Air: "Aeromancer",
        Ash: "Geomancer",
        Beast: "Unicorn",
        Bone: "Living Skeleton",
        Death: "Undead",
        Demon: "Devil",
        Earth: "Geomancer",
        Fire: "Pyromancer",
        Golem: "Colossus",
        Human: "Wizard",
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
        Air: "Wyvern",
        Bone: "Skeletal Snake",
        Death: "Poison",
        Human: "Death",
        Water: "Hydra",
        Wings: "Wyvern",
    },
    Undead: {
        Metal: "Undead Knight",
        Snake: "Skeletal Snake",
        Wings: "Harpy",
    },
    Vampire: {
        Death: "Ash",
        Demon: "High Vampire",
        Fairy: "Death Sprite",
    },
    Water: {
        Ash: "Earth",
        Poison: "Poison",
    },
    Wings: {
        Death: "Harpy",
    },
    Wizard: {
        Air: "Aeromancer",
        Beast: "Dryad",
        Bone: "Necromancer",
        Death: "Necromancer",
        Demon: "Demonologist",
        Earth: "Geomancer",
        Knight: "Battle Mage",
        Tree: "Geomancer",
        Undead: "Undead Mage",
        Water: "Hydromancer",
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
