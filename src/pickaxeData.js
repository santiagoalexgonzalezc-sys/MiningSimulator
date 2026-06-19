/**
 * Centralized pickaxe data system with equipment progression
 * Used across all systems for consistent equipment behavior
 */

// Pickaxe definitions
export const PICKAXES = {
    WOODEN: {
        id: 'wooden',
        name: 'Wooden Pickaxe',
        miningPower: 10,
        miningSpeed: 1.0,
        critChance: 0.05,
        critMultiplier: 2.0,
        cost: 0,
        color: '#8B4513',
        description: 'Basic wooden pickaxe. Slow but reliable.'
    },
    STONE: {
        id: 'stone',
        name: 'Stone Pickaxe',
        miningPower: 15,
        miningSpeed: 1.1,
        critChance: 0.06,
        critMultiplier: 2.1,
        cost: 500,
        color: '#808080',
        description: 'Sturdier stone pickaxe. Better mining speed.'
    },
    IRON: {
        id: 'iron',
        name: 'Iron Pickaxe',
        miningPower: 22,
        miningSpeed: 1.2,
        critChance: 0.07,
        critMultiplier: 2.2,
        cost: 5000,
        color: '#A9A9A9',
        description: 'Durable iron pickaxe. Significant power boost.'
    },
    STEEL: {
        id: 'steel',
        name: 'Steel Pickaxe',
        miningPower: 33,
        miningSpeed: 1.3,
        critChance: 0.08,
        critMultiplier: 2.3,
        cost: 50000,
        color: '#4682B4',
        description: 'Reinforced steel pickaxe. Excellent mining efficiency.'
    },
    GOLD: {
        id: 'gold',
        name: 'Gold Pickaxe',
        miningPower: 48,
        miningSpeed: 1.4,
        critChance: 0.09,
        critMultiplier: 2.4,
        cost: 100000,
        color: '#FFD700',
        description: 'Golden pickaxe. High power and crit chance.'
    },
    DIAMOND: {
        id: 'diamond',
        name: 'Diamond Pickaxe',
        miningPower: 70,
        miningSpeed: 1.5,
        critChance: 0.10,
        critMultiplier: 2.5,
        cost: 500000,
        color: '#00BFFF',
        description: 'Diamond pickaxe. Ultimate mining power.'
    },
    MYTHIC: {
        id: 'mythic',
        name: 'Mythic Pickaxe',
        miningPower: 100,
        miningSpeed: 1.6,
        critChance: 0.11,
        critMultiplier: 2.6,
        cost: 10000000,
        color: '#9B59B6',
        description: 'Legendary mythic pickaxe. God-tier mining power.'
    },
    DIVINE: {
        id: 'divine',
        name: 'Divine Pickaxe',
        miningPower: 170,
        miningSpeed: 1.8,
        critChance: 0.16,
        critMultiplier: 2.8,
        cost: 100000000,
        color: '#FFD700',
        description: 'Divine pickaxe with golden aura and white glow. Ultimate power.'
    },
    COSMIC: {
        id: 'cosmic',
        name: 'Cosmic Pickaxe',
        miningPower: 250,
        miningSpeed: 2.1,
        critChance: 0.21,
        critMultiplier: 3.0,
        cost: 1000000000,
        color: '#00FFFF',
        description: 'Cosmic pickaxe with galaxy effects. Beyond divine power.'
    }
};

// Pickaxe progression order
export const PICKAXE_ORDER = ['wooden', 'stone', 'iron', 'steel', 'gold', 'diamond', 'mythic', 'divine', 'cosmic'];

/**
 * Get pickaxe by ID
 */
export function getPickaxe(id) {
    return PICKAXES[id.toUpperCase()] || PICKAXES.WOODEN;
}

/**
 * Get next pickaxe in progression
 */
export function getNextPickaxe(currentId) {
    const currentIndex = PICKAXE_ORDER.indexOf(currentId);
    if (currentIndex === -1 || currentIndex >= PICKAXE_ORDER.length - 1) {
        return null;
    }
    return getPickaxe(PICKAXE_ORDER[currentIndex + 1]);
}

/**
 * Calculate ore HP based on zone, ore rarity, and base health
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

/**
 * Calculate mining damage with pickaxe and critical hit
 */
export function calculateMiningDamage(pickaxe, isCritical) {
    let damage = pickaxe.miningPower;
    
    if (isCritical) {
        damage = Math.floor(damage * pickaxe.critMultiplier);
    }
    
    return damage;
}

/**
 * Check if mining is critical hit
 */
export function isCriticalHit(pickaxe) {
    return Math.random() < pickaxe.critChance;
}
