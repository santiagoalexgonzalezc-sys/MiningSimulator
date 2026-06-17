/**
 * Centralized ore data system with rarity definitions
 * Used across all systems for consistent ore behavior
 */

// Rarity definitions
export const RARITY = {
    COMMON: {
        id: 'common',
        name: 'Common',
        valueMultiplier: 1.0,
        dropChance: 0.5,
        color: '#95a5a6',
        glowColor: null,
        glowIntensity: 0
    },
    UNCOMMON: {
        id: 'uncommon',
        name: 'Uncommon',
        valueMultiplier: 1.5,
        dropChance: 0.3,
        color: '#27ae60',
        glowColor: '#2ecc71',
        glowIntensity: 3
    },
    RARE: {
        id: 'rare',
        name: 'Rare',
        valueMultiplier: 2.5,
        dropChance: 0.12,
        color: '#3498db',
        glowColor: '#5dade2',
        glowIntensity: 5
    },
    EPIC: {
        id: 'epic',
        name: 'Epic',
        valueMultiplier: 4.0,
        dropChance: 0.05,
        color: '#9b59b6',
        glowColor: '#af7ac5',
        glowIntensity: 8
    },
    LEGENDARY: {
        id: 'legendary',
        name: 'Legendary',
        valueMultiplier: 7.0,
        dropChance: 0.02,
        color: '#f39c12',
        glowColor: '#f5b041',
        glowIntensity: 12
    },
    MYTHIC: {
        id: 'mythic',
        name: 'Mythic',
        valueMultiplier: 15.0,
        dropChance: 0.01,
        color: '#e74c3c',
        glowColor: '#ec7063',
        glowIntensity: 15
    }
};

// Ore type definitions with base values and properties
export const ORE_TYPES = {
    COAL: {
        id: 'coal',
        name: 'Coal',
        baseValue: 5,
        requiredPower: 1,
        health: 3,
        color: '#2c3e50',
        allowedRarities: ['common', 'uncommon', 'rare', 'epic']
    },
    IRON: {
        id: 'iron',
        name: 'Iron',
        baseValue: 10,
        requiredPower: 2,
        health: 5,
        color: '#95a5a6',
        allowedRarities: ['common', 'uncommon', 'rare', 'epic']
    },
    GOLD: {
        id: 'gold',
        name: 'Gold',
        baseValue: 20,
        requiredPower: 3,
        health: 8,
        color: '#f1c40f',
        allowedRarities: ['uncommon', 'rare', 'epic']
    },
    DIAMOND: {
        id: 'diamond',
        name: 'Diamond',
        baseValue: 40,
        requiredPower: 5,
        health: 12,
        color: '#3498db',
        allowedRarities: ['rare', 'epic', 'legendary']
    },
    EMERALD: {
        id: 'emerald',
        name: 'Emerald',
        baseValue: 80,
        requiredPower: 6,
        health: 15,
        color: '#27ae60',
        allowedRarities: ['epic', 'legendary']
    },
    RUBY: {
        id: 'ruby',
        name: 'Ruby',
        baseValue: 160,
        requiredPower: 7,
        health: 18,
        color: '#e74c3c',
        allowedRarities: ['legendary', 'mythic']
    },
    MYTHIC_ORE: {
        id: 'mythic_ore',
        name: 'Mythic',
        baseValue: 320,
        requiredPower: 10,
        health: 25,
        color: '#9b59b6',
        allowedRarities: ['mythic']
    }
};

// Zone bonus multipliers
export const ZONE_BONUS = {
    surface: 1.0,
    cave: 1.2,
    crystal: 1.5,
    lava: 2.0
};

/**
 * Calculate ore value based on type, rarity, and zone
 */
export function calculateOreValue(oreType, rarity, zoneId) {
    const ore = ORE_TYPES[oreType.toUpperCase()];
    const rarityData = RARITY[rarity.toUpperCase()];
    const zoneBonus = ZONE_BONUS[zoneId] || 1.0;
    
    return Math.floor(ore.baseValue * rarityData.valueMultiplier * zoneBonus);
}

/**
 * Get random rarity based on zone rarity weights
 */
export function getRandomRarity(zoneId) {
    const zoneRarityWeights = {
        surface: [0.7, 0.25, 0.05, 0, 0, 0],      // Mostly common/uncommon
        cave: [0.5, 0.35, 0.12, 0.03, 0, 0],       // Common/uncommon/rare
        crystal: [0.2, 0.3, 0.3, 0.15, 0.05, 0],    // Rare/epic/legendary
        lava: [0.1, 0.2, 0.3, 0.25, 0.12, 0.03]     // Epic/legendary/mythic
    };
    
    const weights = zoneRarityWeights[zoneId] || zoneRarityWeights.surface;
    const rand = Math.random();
    
    let cumulative = 0;
    const rarityKeys = Object.keys(RARITY);
    
    for (let i = 0; i < weights.length; i++) {
        cumulative += weights[i];
        if (rand <= cumulative) {
            return RARITY[rarityKeys[i]];
        }
    }
    
    return RARITY.COMMON;
}

/**
 * Get random ore type based on zone and rarity
 */
export function getRandomOreType(zoneId, rarity) {
    const zoneOreTypes = {
        surface: ['COAL', 'IRON'],
        cave: ['IRON', 'GOLD'],
        crystal: ['GOLD', 'DIAMOND', 'EMERALD'],
        lava: ['DIAMOND', 'RUBY', 'MYTHIC_ORE']
    };
    
    const availableTypes = zoneOreTypes[zoneId] || zoneOreTypes.surface;
    
    // Filter ores that allow this rarity
    const validTypes = availableTypes.filter(type => {
        const ore = ORE_TYPES[type];
        return ore.allowedRarities.includes(rarity.id);
    });
    
    // If no valid types, fallback to first available
    if (validTypes.length === 0) {
        return ORE_TYPES[availableTypes[0]];
    }
    
    // Random selection from valid types
    const randomType = validTypes[Math.floor(Math.random() * validTypes.length)];
    return ORE_TYPES[randomType];
}

/**
 * Generate complete ore data for spawning
 */
export function generateOre(zoneId, x, y) {
    const rarity = getRandomRarity(zoneId);
    const oreType = getRandomOreType(zoneId, rarity);
    const value = calculateOreValue(oreType.id, rarity.id, zoneId);
    const health = calculateOreHP(zoneId, rarity.id, oreType.health);
    
    return {
        x: x,
        y: y,
        width: 40,
        height: 40,
        type: oreType.name,
        typeId: oreType.id,
        rarity: rarity.name,
        rarityId: rarity.id,
        color: oreType.color,
        value: value,
        requiredPower: oreType.requiredPower,
        health: health,
        maxHealth: health,
        glowColor: rarity.glowColor,
        glowIntensity: rarity.glowIntensity
    };
}

/**
 * Calculate ore HP based on zone, rarity, and base health
 */
export function calculateOreHP(zoneId, rarityId, baseHealth) {
    const zoneMultipliers = {
        surface: 1.0,
        cave: 1.5,
        crystal: 2.0,
        lava: 3.0
    };
    
    const rarityMultipliers = {
        common: 1.0,
        uncommon: 1.2,
        rare: 1.5,
        epic: 2.0,
        legendary: 2.5,
        mythic: 3.5
    };
    
    const zoneMult = zoneMultipliers[zoneId] || 1.0;
    const rarityMult = rarityMultipliers[rarityId] || 1.0;
    
    return Math.floor(baseHealth * zoneMult * rarityMult);
}
