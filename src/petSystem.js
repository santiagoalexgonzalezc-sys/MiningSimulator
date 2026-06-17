/**
 * Centralized pet system with pet definitions and bonus calculations
 * Used across all systems for consistent pet behavior
 */

// Pet rarity system
export const PET_RARITY = {
    COMMON: {
        name: 'Common',
        color: '#95a5a6',
        bonusMultiplier: 1.0,
        maxLevel: 10
    },
    UNCOMMON: {
        name: 'Uncommon',
        color: '#27ae60',
        bonusMultiplier: 1.2,
        maxLevel: 15
    },
    RARE: {
        name: 'Rare',
        color: '#3498db',
        bonusMultiplier: 1.5,
        maxLevel: 20
    },
    EPIC: {
        name: 'Epic',
        color: '#9b59b6',
        bonusMultiplier: 2.0,
        maxLevel: 25
    },
    LEGENDARY: {
        name: 'Legendary',
        color: '#f39c12',
        bonusMultiplier: 3.0,
        maxLevel: 30
    },
    MYTHIC: {
        name: 'Mythic',
        color: '#e74c3c',
        bonusMultiplier: 5.0,
        maxLevel: 50
    }
};

// Pet bonus types
export const PET_BONUS_TYPES = {
    MINING_SPEED: 'mining_speed',
    ORE_VALUE: 'ore_value',
    XP_GAIN: 'xp_gain',
    CRIT_CHANCE: 'crit_chance',
    BACKPACK_CAPACITY: 'backpack_capacity'
};

// Pet definitions
export const PETS = {
    // Common pets
    ROCKY: {
        id: 'rocky',
        name: 'Rocky',
        rarity: 'COMMON',
        description: 'A friendly rock that helps with mining.',
        bonusType: PET_BONUS_TYPES.MINING_SPEED,
        baseBonus: 0.05,
        emoji: '🪨'
    },
    SPARKY: {
        id: 'sparky',
        name: 'Sparky',
        rarity: 'COMMON',
        description: 'A small spark that increases ore value.',
        bonusType: PET_BONUS_TYPES.ORE_VALUE,
        baseBonus: 0.03,
        emoji: '⚡'
    },
    
    // Uncommon pets
    COALIE: {
        id: 'coalie',
        name: 'Coalie',
        rarity: 'UNCOMMON',
        description: 'A coal creature that boosts XP gain.',
        bonusType: PET_BONUS_TYPES.XP_GAIN,
        baseBonus: 0.05,
        emoji: '⬛'
    },
    GEMMY: {
        id: 'gemmy',
        name: 'Gemmy',
        rarity: 'UNCOMMON',
        description: 'A gem-loving creature that increases crit chance.',
        bonusType: PET_BONUS_TYPES.CRIT_CHANCE,
        baseBonus: 0.02,
        emoji: '💎'
    },
    
    // Rare pets
    CRYSTALFOX: {
        id: 'crystalfox',
        name: 'Crystal Fox',
        rarity: 'RARE',
        description: 'A mystical fox that significantly boosts mining speed.',
        bonusType: PET_BONUS_TYPES.MINING_SPEED,
        baseBonus: 0.10,
        emoji: '🦊'
    },
    GOLDENGOLEM: {
        id: 'goldengolem',
        name: 'Golden Golem',
        rarity: 'RARE',
        description: 'A golden construct that greatly increases ore value.',
        bonusType: PET_BONUS_TYPES.ORE_VALUE,
        baseBonus: 0.08,
        emoji: '🗿'
    },
    
    // Epic pets
    DRAGONWHELP: {
        id: 'dragonwhelp',
        name: 'Dragon Whelp',
        rarity: 'EPIC',
        description: 'A young dragon that massively boosts XP gain.',
        bonusType: PET_BONUS_TYPES.XP_GAIN,
        baseBonus: 0.15,
        emoji: '🐉'
    },
    PHOENIX: {
        id: 'phoenix',
        name: 'Phoenix',
        rarity: 'EPIC',
        description: 'A mythical bird that increases crit chance significantly.',
        bonusType: PET_BONUS_TYPES.CRIT_CHANCE,
        baseBonus: 0.05,
        emoji: '🔥'
    },
    
    // Legendary pets
    CELESTIALBEAR: {
        id: 'celestialbear',
        name: 'Celestial Bear',
        rarity: 'LEGENDARY',
        description: 'A cosmic bear with incredible mining speed.',
        bonusType: PET_BONUS_TYPES.MINING_SPEED,
        baseBonus: 0.20,
        emoji: '🐻'
    },
    RAINBOWUNICORN: {
        id: 'rainbowunicorn',
        name: 'Rainbow Unicorn',
        rarity: 'LEGENDARY',
        description: 'A magical unicorn that maximizes ore value.',
        bonusType: PET_BONUS_TYPES.ORE_VALUE,
        baseBonus: 0.15,
        emoji: '🦄'
    },
    
    // Mythic pets
    STARDRAGON: {
        id: 'stardragon',
        name: 'Star Dragon',
        rarity: 'MYTHIC',
        description: 'A legendary dragon from the stars. Ultimate power.',
        bonusType: PET_BONUS_TYPES.MINING_SPEED,
        baseBonus: 0.35,
        emoji: '🌟'
    },
    COSMICPHOENIX: {
        id: 'cosmicphoenix',
        name: 'Cosmic Phoenix',
        rarity: 'MYTHIC',
        description: 'A phoenix from another dimension. God-tier bonuses.',
        bonusType: PET_BONUS_TYPES.XP_GAIN,
        baseBonus: 0.25,
        emoji: '🌌'
    }
};

// Egg definitions for hatching
export const EGGS = {
    COMMON_EGG: {
        id: 'common_egg',
        name: 'Common Egg',
        rarity: 'COMMON',
        cost: 100,
        emoji: '🥚',
        hatchChances: {
            COMMON: 0.8,
            UNCOMMON: 0.2,
            RARE: 0,
            EPIC: 0,
            LEGENDARY: 0,
            MYTHIC: 0
        }
    },
    UNCOMMON_EGG: {
        id: 'uncommon_egg',
        name: 'Uncommon Egg',
        rarity: 'UNCOMMON',
        cost: 500,
        emoji: '🥚',
        hatchChances: {
            COMMON: 0.5,
            UNCOMMON: 0.4,
            RARE: 0.1,
            EPIC: 0,
            LEGENDARY: 0,
            MYTHIC: 0
        }
    },
    RARE_EGG: {
        id: 'rare_egg',
        name: 'Rare Egg',
        rarity: 'RARE',
        cost: 2000,
        emoji: '🥚',
        hatchChances: {
            COMMON: 0.2,
            UNCOMMON: 0.4,
            RARE: 0.3,
            EPIC: 0.1,
            LEGENDARY: 0,
            MYTHIC: 0
        }
    },
    EPIC_EGG: {
        id: 'epic_egg',
        name: 'Epic Egg',
        rarity: 'EPIC',
        cost: 10000,
        emoji: '🥚',
        hatchChances: {
            COMMON: 0,
            UNCOMMON: 0.2,
            RARE: 0.4,
            EPIC: 0.3,
            LEGENDARY: 0.1,
            MYTHIC: 0
        }
    },
    LEGENDARY_EGG: {
        id: 'legendary_egg',
        name: 'Legendary Egg',
        rarity: 'LEGENDARY',
        cost: 50000,
        emoji: '🥚',
        hatchChances: {
            COMMON: 0,
            UNCOMMON: 0,
            RARE: 0.2,
            EPIC: 0.4,
            LEGENDARY: 0.3,
            MYTHIC: 0.1
        }
    }
};

/**
 * Get pet by ID
 */
export function getPet(petId) {
    return PETS[petId.toUpperCase()] || null;
}

/**
 * Get egg by ID
 */
export function getEgg(eggId) {
    return EGGS[eggId.toUpperCase()] || null;
}

/**
 * Get rarity info
 */
export function getRarityInfo(rarity) {
    return PET_RARITY[rarity.toUpperCase()] || PET_RARITY.COMMON;
}

/**
 * Calculate pet bonus at specific level
 */
export function calculatePetBonus(pet, level) {
    const rarityInfo = getRarityInfo(pet.rarity);
    const levelBonus = 1 + (level - 1) * 0.05; // 5% increase per level
    return pet.baseBonus * rarityInfo.bonusMultiplier * levelBonus;
}

/**
 * Get pets by rarity
 */
export function getPetsByRarity(rarity) {
    return Object.values(PETS).filter(pet => pet.rarity === rarity);
}

/**
 * Hatch an egg and return a random pet
 */
export function hatchEgg(eggId) {
    const egg = getEgg(eggId);
    if (!egg) return null;
    
    const random = Math.random();
    let cumulative = 0;
    
    for (const [rarity, chance] of Object.entries(egg.hatchChances)) {
        cumulative += chance;
        if (random <= cumulative) {
            const petsOfRarity = getPetsByRarity(rarity);
            if (petsOfRarity.length > 0) {
                const randomPet = petsOfRarity[Math.floor(Math.random() * petsOfRarity.length)];
                return randomPet;
            }
        }
    }
    
    // Fallback to common pet
    const commonPets = getPetsByRarity('COMMON');
    return commonPets[Math.floor(Math.random() * commonPets.length)];
}

/**
 * Calculate total bonus from equipped pets
 */
export function calculateTotalBonus(equippedPets, bonusType) {
    let totalBonus = 0;
    for (const pet of equippedPets) {
        if (pet.bonusType === bonusType) {
            totalBonus += calculatePetBonus(pet, pet.level);
        }
    }
    return totalBonus;
}
