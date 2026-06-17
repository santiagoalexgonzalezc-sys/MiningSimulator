/**
 * Centralized rebirth system with rebirth definitions and upgrade calculations
 * Used across all systems for consistent rebirth behavior
 */

// Rebirth requirements
export const REBIRTH_REQUIREMENTS = {
    MIN_MONEY: 100000,
    MIN_LEVEL: 50,
    MIN_QUESTS_COMPLETED: 10
};

// Rebirth rewards
export const REBIRTH_REWARDS = {
    BASE_RP: 1,
    RP_SCALING: 1.5, // Each rebirth increases RP gained by 50%
    BASE_MINING_SPEED: 0.05, // 5% per rebirth
    BASE_ORE_VALUE: 0.05, // 5% per rebirth
    BASE_XP_GAIN: 0.05, // 5% per rebirth
    BASE_LUCK: 0.02 // 2% per rebirth
};

// Permanent upgrade definitions
export const PERMANENT_UPGRADES = {
    MINING_SPEED_BOOST: {
        id: 'mining_speed_boost',
        name: 'Mining Speed Boost',
        description: 'Permanently increase mining speed by 5%',
        baseCost: 1,
        costScaling: 1.5,
        maxLevel: 50,
        effect: 0.05, // 5% per level
        category: 'mining'
    },
    ORE_RARITY_LUCK: {
        id: 'ore_rarity_luck',
        name: 'Ore Rarity Luck',
        description: 'Increase chance for rare ore drops by 3%',
        baseCost: 2,
        costScaling: 1.6,
        maxLevel: 30,
        effect: 0.03, // 3% per level
        category: 'luck'
    },
    BACKPACK_CAPACITY_MULTIPLIER: {
        id: 'backpack_capacity_multiplier',
        name: 'Backpack Capacity',
        description: 'Increase backpack capacity by 10%',
        baseCost: 3,
        costScaling: 1.7,
        maxLevel: 20,
        effect: 0.10, // 10% per level
        category: 'inventory'
    },
    FASTER_PET_LEVELING: {
        id: 'faster_pet_leveling',
        name: 'Faster Pet Leveling',
        description: 'Pets gain XP 20% faster',
        baseCost: 2,
        costScaling: 1.5,
        maxLevel: 25,
        effect: 0.20, // 20% per level
        category: 'pets'
    },
    AUTO_SELL_IMPROVEMENT: {
        id: 'auto_sell_improvement',
        name: 'Auto Sell Bonus',
        description: 'Increase ore sell value by 5%',
        baseCost: 2,
        costScaling: 1.5,
        maxLevel: 30,
        effect: 0.05, // 5% per level
        category: 'economy'
    },
    STARTING_MONEY_BOOST: {
        id: 'starting_money_boost',
        name: 'Starting Money',
        description: 'Start with $500 more money after rebirth',
        baseCost: 1,
        costScaling: 1.4,
        maxLevel: 20,
        effect: 500, // $500 per level
        category: 'economy'
    },
    CRIT_CHANCE_BOOST: {
        id: 'crit_chance_boost',
        name: 'Crit Chance Boost',
        description: 'Increase critical hit chance by 2%',
        baseCost: 3,
        costScaling: 1.8,
        maxLevel: 25,
        effect: 0.02, // 2% per level
        category: 'mining'
    },
    ZONE_UNLOCK_SPEED: {
        id: 'zone_unlock_speed',
        name: 'Zone Unlock Speed',
        description: 'Reduce zone unlock cost by 5%',
        baseCost: 4,
        costScaling: 2.0,
        maxLevel: 15,
        effect: 0.05, // 5% per level
        category: 'progression'
    }
};

/**
 * Calculate Rebirth Points gained from a rebirth
 */
export function calculateRebirthPoints(rebirthCount) {
    return Math.floor(REBIRTH_REWARDS.BASE_RP * Math.pow(REBIRTH_REWARDS.RP_SCALING, rebirthCount));
}

/**
 * Calculate global multiplier from rebirth count
 */
export function calculateRebirthMultiplier(rebirthCount, type) {
    const baseMultiplier = 1 + (rebirthCount * 0.05); // 5% per rebirth
    
    switch (type) {
        case 'mining_speed':
            return 1 + (rebirthCount * REBIRTH_REWARDS.BASE_MINING_SPEED);
        case 'ore_value':
            return 1 + (rebirthCount * REBIRTH_REWARDS.BASE_ORE_VALUE);
        case 'xp_gain':
            return 1 + (rebirthCount * REBIRTH_REWARDS.BASE_XP_GAIN);
        case 'luck':
            return rebirthCount * REBIRTH_REWARDS.BASE_LUCK;
        default:
            return baseMultiplier;
    }
}

/**
 * Calculate upgrade cost
 */
export function calculateUpgradeCost(upgradeId, currentLevel) {
    const upgrade = PERMANENT_UPGRADES[upgradeId.toUpperCase()];
    if (!upgrade) return Infinity;
    
    if (currentLevel >= upgrade.maxLevel) return Infinity;
    
    return Math.floor(upgrade.baseCost * Math.pow(upgrade.costScaling, currentLevel));
}

/**
 * Calculate upgrade effect
 */
export function calculateUpgradeEffect(upgradeId, level) {
    const upgrade = PERMANENT_UPGRADES[upgradeId.toUpperCase()];
    if (!upgrade) return 0;
    
    return upgrade.effect * level;
}

/**
 * Get upgrade by ID
 */
export function getUpgrade(upgradeId) {
    return PERMANENT_UPGRADES[upgradeId.toUpperCase()] || null;
}

/**
 * Get upgrades by category
 */
export function getUpgradesByCategory(category) {
    return Object.values(PERMANENT_UPGRADES).filter(u => u.category === category);
}

/**
 * Check if player meets rebirth requirements
 */
export function canRebirth(player, questManager) {
    const moneyRequirement = player.money >= REBIRTH_REQUIREMENTS.MIN_MONEY;
    const levelRequirement = player.level >= REBIRTH_REQUIREMENTS.MIN_LEVEL;
    const questRequirement = questManager.getCompletedQuestCount() >= REBIRTH_REQUIREMENTS.MIN_QUESTS_COMPLETED;
    
    return moneyRequirement || levelRequirement || questRequirement;
}

/**
 * Get rebirth requirement status
 */
export function getRebirthRequirementStatus(player, questManager) {
    return {
        money: {
            met: player.money >= REBIRTH_REQUIREMENTS.MIN_MONEY,
            current: player.money,
            required: REBIRTH_REQUIREMENTS.MIN_MONEY
        },
        level: {
            met: player.level >= REBIRTH_REQUIREMENTS.MIN_LEVEL,
            current: player.level,
            required: REBIRTH_REQUIREMENTS.MIN_LEVEL
        },
        quests: {
            met: questManager.getCompletedQuestCount() >= REBIRTH_REQUIREMENTS.MIN_QUESTS_COMPLETED,
            current: questManager.getCompletedQuestCount(),
            required: REBIRTH_REQUIREMENTS.MIN_QUESTS_COMPLETED
        }
    };
}
