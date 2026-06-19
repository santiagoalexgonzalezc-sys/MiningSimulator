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
    },
    SECRET: {
        id: 'secret',
        name: 'Secret',
        valueMultiplier: 30.0,
        dropChance: 0.005,
        color: '#ff00ff',
        glowColor: '#ff66ff',
        glowIntensity: 20
    },
    ULTRA_SECRET: {
        id: 'ultra_secret',
        name: 'Ultra Secret',
        valueMultiplier: 60.0,
        dropChance: 0.001,
        color: '#00ffff',
        glowColor: '#66ffff',
        glowIntensity: 25
    }
};

// Ore type definitions with base values and properties
export const ORE_TYPES = {
    COAL: {
        id: 'coal',
        name: 'Coal',
        baseValue: 5,
        requiredPower: 1,
        health: 5,
        color: '#2c3e50',
        allowedRarities: ['common', 'uncommon', 'rare', 'epic']
    },
    IRON: {
        id: 'iron',
        name: 'Iron',
        baseValue: 10,
        requiredPower: 2,
        health: 10,
        color: '#95a5a6',
        allowedRarities: ['common', 'uncommon', 'rare', 'epic']
    },
    GOLD: {
        id: 'gold',
        name: 'Gold',
        baseValue: 20,
        requiredPower: 3,
        health: 20,
        color: '#f1c40f',
        allowedRarities: ['uncommon', 'rare', 'epic']
    },
    DIAMOND: {
        id: 'diamond',
        name: 'Diamond',
        baseValue: 40,
        requiredPower: 5,
        health: 30,
        color: '#3498db',
        allowedRarities: ['rare', 'epic', 'legendary']
    },
    EMERALD: {
        id: 'emerald',
        name: 'Emerald',
        baseValue: 80,
        requiredPower: 6,
        health: 40,
        color: '#27ae60',
        allowedRarities: ['epic', 'legendary']
    },
    RUBY: {
        id: 'ruby',
        name: 'Ruby',
        baseValue: 160,
        requiredPower: 7,
        health: 50,
        color: '#e74c3c',
        allowedRarities: ['legendary', 'mythic']
    },
    MYTHIC_ORE: {
        id: 'mythic_ore',
        name: 'Mythic',
        baseValue: 320,
        requiredPower: 10,
        health: 60,
        color: '#9b59b6',
        allowedRarities: ['mythic']
    },
    // Void Tier
    VOID_SHARD: {
        id: 'void_shard',
        name: 'Void Shard',
        baseValue: 1280,
        requiredPower: 12,
        health: 70,
        color: '#4b0082',
        allowedRarities: ['legendary']
    },
    ANCIENT_RELIC: {
        id: 'ancient_relic',
        name: 'Ancient Relic',
        baseValue: 1600,
        requiredPower: 13,
        health: 80,
        color: '#800080',
        allowedRarities: ['legendary']
    },
    CELESTIAL_FRAGMENT: {
        id: 'celestial_fragment',
        name: 'Celestial Fragment',
        baseValue: 2560,
        requiredPower: 14,
        health: 90,
        color: '#00bfff',
        allowedRarities: ['mythic']
    },
    ASTRAL_GEM: {
        id: 'astral_gem',
        name: 'Astral Gem',
        baseValue: 3000,
        requiredPower: 15,
        health: 100,
        color: '#7b68ee',
        allowedRarities: ['mythic']
    },
    // Divine Tier
    DIVINE_ESSENCE: {
        id: 'divine_essence',
        name: 'Divine Essence',
        baseValue: 5120,
        requiredPower: 18,
        health: 110,
        color: '#ffd700',
        allowedRarities: ['mythic']
    },
    STARCORE: {
        id: 'starcore',
        name: 'Starcore',
        baseValue: 7500,
        requiredPower: 20,
        health: 120,
        color: '#fff8dc',
        allowedRarities: ['mythic']
    },
    COSMIC_CRYSTAL: {
        id: 'cosmic_crystal',
        name: 'Cosmic Crystal',
        baseValue: 10240,
        requiredPower: 22,
        health: 130,
        color: '#e6e6fa',
        allowedRarities: ['mythic']
    },
    ETHERNIUM: {
        id: 'eternium',
        name: 'Eternium',
        baseValue: 15000,
        requiredPower: 25,
        health: 140,
        color: '#f0e68c',
        allowedRarities: ['mythic']
    },
    // Transcendent Tier
    NEBULITE: {
        id: 'nebulite',
        name: 'Nebulite',
        baseValue: 20480,
        requiredPower: 30,
        health: 150,
        color: '#ff69b4',
        allowedRarities: ['secret']
    },
    QUANTUM_CORE: {
        id: 'quantum_core',
        name: 'Quantum Core',
        baseValue: 30000,
        requiredPower: 35,
        health: 160,
        color: '#00ff00',
        allowedRarities: ['secret']
    },
    INFINITY_STONE: {
        id: 'infinity_stone',
        name: 'Infinity Stone',
        baseValue: 40960,
        requiredPower: 40,
        health: 170,
        color: '#ff4500',
        allowedRarities: ['secret']
    },
    CHRONO_CRYSTAL: {
        id: 'chrono_crystal',
        name: 'Chrono Crystal',
        baseValue: 60000,
        requiredPower: 45,
        health: 180,
        color: '#00ffff',
        allowedRarities: ['secret']
    },
    SINGULARITY_ORE: {
        id: 'singularity_ore',
        name: 'Singularity Ore',
        baseValue: 80000,
        requiredPower: 50,
        health: 190,
        color: '#1a1a1a',
        allowedRarities: ['secret']
    },
    // Ultra-Rare Tier
    GENESIS_CRYSTAL: {
        id: 'genesis_crystal',
        name: 'Genesis Crystal',
        baseValue: 120000,
        requiredPower: 60,
        health: 500,
        color: '#ffffff',
        allowedRarities: ['ultra_secret']
    },
    REALITY_SHARD: {
        id: 'reality_shard',
        name: 'Reality Shard',
        baseValue: 180000,
        requiredPower: 70,
        health: 600,
        color: '#ff1493',
        allowedRarities: ['ultra_secret']
    },
    PRIMORDIAL_ESSENCE: {
        id: 'primordial_essence',
        name: 'Primordial Essence',
        baseValue: 250000,
        requiredPower: 80,
        health: 700,
        color: '#ffdead',
        allowedRarities: ['ultra_secret']
    },
    WORLDHEART: {
        id: 'worldheart',
        name: 'Worldheart',
        baseValue: 500000,
        requiredPower: 100,
        health: 800,
        color: '#ff0000',
        allowedRarities: ['ultra_secret']
    }
};

// Zone bonus multipliers
export const ZONE_BONUS = {
    surface: 1.0,
    cave: 1.2,
    crystal: 1.5,
    lava: 2.0,
    void: 3.0,
    celestial: 4.0,
    cosmic: 6.0,
    infinity: 10.0
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
        surface: [0.7, 0.25, 0.05, 0, 0, 0, 0, 0],      // Mostly common/uncommon
        cave: [0.5, 0.35, 0.12, 0.03, 0, 0, 0, 0],       // Common/uncommon/rare
        crystal: [0.2, 0.3, 0.3, 0.15, 0.05, 0, 0, 0],    // Rare/epic/legendary
        lava: [0.1, 0.2, 0.3, 0.25, 0.12, 0.03, 0, 0],    // Epic/legendary/mythic
        void: [0.05, 0.15, 0.3, 0.25, 0.15, 0.08, 0.02, 0],    // Legendary/mythic focus
        celestial: [0.02, 0.1, 0.2, 0.25, 0.25, 0.12, 0.05, 0.01],  // Mythic/secret focus
        cosmic: [0, 0.05, 0.15, 0.2, 0.3, 0.2, 0.08, 0.02],       // Secret focus
        infinity: [0, 0, 0.1, 0.15, 0.25, 0.3, 0.15, 0.05]         // Ultra secret focus
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
        lava: ['DIAMOND', 'RUBY', 'MYTHIC_ORE'],
        void: ['VOID_SHARD', 'ANCIENT_RELIC', 'CELESTIAL_FRAGMENT', 'ASTRAL_GEM'],
        celestial: ['CELESTIAL_FRAGMENT', 'ASTRAL_GEM', 'DIVINE_ESSENCE', 'STARCORE'],
        cosmic: ['COSMIC_CRYSTAL', 'ETERNIUM', 'NEBULITE', 'QUANTUM_CORE'],
        infinity: ['INFINITY_STONE', 'CHRONO_CRYSTAL', 'SINGULARITY_ORE', 'GENESIS_CRYSTAL', 'REALITY_SHARD', 'PRIMORDIAL_ESSENCE', 'WORLDHEART']
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
        lava: 3.0,
        void: 4.0,
        celestial: 5.0,
        cosmic: 6.0,
        infinity: 8.0
    };
    
    const rarityMultipliers = {
        common: 1.0,
        uncommon: 1.2,
        rare: 1.5,
        epic: 2.0,
        legendary: 2.5,
        mythic: 3.5,
        secret: 5.0,
        ultra_secret: 8.0
    };
    
    const zoneMult = zoneMultipliers[zoneId] || 1.0;
    const rarityMult = rarityMultipliers[rarityId] || 1.0;
    
    return Math.floor(baseHealth * zoneMult * rarityMult);
}
