/**
 * Centralized pickaxe data system with equipment progression
 * Used across all systems for consistent equipment behavior
 */

// Pickaxe definitions
export const PICKAXES = {
    WOODEN: {
        id: 'wooden',
        name: 'Wooden Pickaxe',
        miningPower: 1,
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
        miningPower: 2,
        miningSpeed: 1.2,
        critChance: 0.07,
        critMultiplier: 2.2,
        cost: 100,
        color: '#808080',
        description: 'Sturdier stone pickaxe. Better mining speed.'
    },
    IRON: {
        id: 'iron',
        name: 'Iron Pickaxe',
        miningPower: 4,
        miningSpeed: 1.5,
        critChance: 0.10,
        critMultiplier: 2.5,
        cost: 500,
        color: '#A9A9A9',
        description: 'Durable iron pickaxe. Significant power boost.'
    },
    STEEL: {
        id: 'steel',
        name: 'Steel Pickaxe',
        miningPower: 7,
        miningSpeed: 1.8,
        critChance: 0.12,
        critMultiplier: 2.8,
        cost: 2000,
        color: '#4682B4',
        description: 'Reinforced steel pickaxe. Excellent mining efficiency.'
    },
    GOLD: {
        id: 'gold',
        name: 'Gold Pickaxe',
        miningPower: 12,
        miningSpeed: 2.2,
        critChance: 0.15,
        critMultiplier: 3.0,
        cost: 5000,
        color: '#FFD700',
        description: 'Golden pickaxe. High power and crit chance.'
    },
    DIAMOND: {
        id: 'diamond',
        name: 'Diamond Pickaxe',
        miningPower: 20,
        miningSpeed: 2.8,
        critChance: 0.18,
        critMultiplier: 3.5,
        cost: 15000,
        color: '#00BFFF',
        description: 'Diamond pickaxe. Ultimate mining power.'
    },
    MYTHIC: {
        id: 'mythic',
        name: 'Mythic Pickaxe',
        miningPower: 35,
        miningSpeed: 3.5,
        critChance: 0.22,
        critMultiplier: 4.0,
        cost: 50000,
        color: '#9B59B6',
        description: 'Legendary mythic pickaxe. God-tier mining power.'
    }
};

// Pickaxe progression order
export const PICKAXE_ORDER = ['wooden', 'stone', 'iron', 'steel', 'gold', 'diamond', 'mythic'];

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
