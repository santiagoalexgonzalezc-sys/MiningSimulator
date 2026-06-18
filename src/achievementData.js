/**
 * Achievement Data Definitions
 * Data-driven achievement system for Phase 9
 */

// Achievement definitions
export const ACHIEVEMENTS = {
    // Mining achievements
    FIRST_ORE: {
        id: 'first_ore',
        name: 'First Steps',
        description: 'Mine your first ore',
        type: 'mining',
        requirement: { type: 'ores_mined', value: 1 },
        reward: { type: 'money', value: 100 },
        icon: '⛏️',
        color: '#f39c12'
    },
    ORE_MINER_100: {
        id: 'ore_miner_100',
        name: 'Ore Miner',
        description: 'Mine 100 ores',
        type: 'mining',
        requirement: { type: 'ores_mined', value: 100 },
        reward: { type: 'money', value: 500 },
        icon: '⛏️',
        color: '#f39c12'
    },
    ORE_MINER_1000: {
        id: 'ore_miner_1000',
        name: 'Master Miner',
        description: 'Mine 1,000 ores',
        type: 'mining',
        requirement: { type: 'ores_mined', value: 1000 },
        reward: { type: 'money', value: 2500 },
        icon: '⛏️',
        color: '#f39c12'
    },
    ORE_MINER_10000: {
        id: 'ore_miner_10000',
        name: 'Legendary Miner',
        description: 'Mine 10,000 ores',
        type: 'mining',
        requirement: { type: 'ores_mined', value: 10000 },
        reward: { type: 'money', value: 10000 },
        icon: '⛏️',
        color: '#f39c12'
    },
    
    // Money achievements
    WEALTHY: {
        id: 'wealthy',
        name: 'Wealthy',
        description: 'Earn $10,000',
        type: 'money',
        requirement: { type: 'total_money_earned', value: 10000 },
        reward: { type: 'boss_coins', value: 10 },
        icon: '💰',
        color: '#2ecc71'
    },
    MILLIONAIRE: {
        id: 'millionaire',
        name: 'Millionaire',
        description: 'Earn $1,000,000',
        type: 'money',
        requirement: { type: 'total_money_earned', value: 1000000 },
        reward: { type: 'boss_coins', value: 100 },
        icon: '💰',
        color: '#2ecc71'
    },
    
    // Boss achievements
    FIRST_BOSS: {
        id: 'first_boss',
        name: 'Boss Slayer',
        description: 'Defeat your first boss',
        type: 'boss',
        requirement: { type: 'bosses_defeated', value: 1 },
        reward: { type: 'boss_coins', value: 25 },
        icon: '⚔️',
        color: '#e74c3c'
    },
    BOSS_HUNTER: {
        id: 'boss_hunter',
        name: 'Boss Hunter',
        description: 'Defeat 10 bosses',
        type: 'boss',
        requirement: { type: 'bosses_defeated', value: 10 },
        reward: { type: 'boss_coins', value: 100 },
        icon: '⚔️',
        color: '#e74c3c'
    },
    BOSS_MASTER: {
        id: 'boss_master',
        name: 'Boss Master',
        description: 'Defeat 100 bosses',
        type: 'boss',
        requirement: { type: 'bosses_defeated', value: 100 },
        reward: { type: 'boss_coins', value: 500 },
        icon: '⚔️',
        color: '#e74c3c'
    },
    
    // Zone achievements
    VOID_EXPLORER: {
        id: 'void_explorer',
        name: 'Void Explorer',
        description: 'Enter the Void zone',
        type: 'zone',
        requirement: { type: 'zone_entered', value: 'void' },
        reward: { type: 'money', value: 1000 },
        icon: '🌌',
        color: '#9b59b6'
    },
    CELESTIAL_EXPLORER: {
        id: 'celestial_explorer',
        name: 'Celestial Explorer',
        description: 'Enter the Celestial zone',
        type: 'zone',
        requirement: { type: 'zone_entered', value: 'celestial' },
        reward: { type: 'money', value: 5000 },
        icon: '⭐',
        color: '#00bfff'
    },
    COSMIC_EXPLORER: {
        id: 'cosmic_explorer',
        name: 'Cosmic Explorer',
        description: 'Enter the Cosmic zone',
        type: 'zone',
        requirement: { type: 'zone_entered', value: 'cosmic' },
        reward: { type: 'money', value: 25000 },
        icon: '🌟',
        color: '#e6e6fa'
    },
    INFINITY_EXPLORER: {
        id: 'infinity_explorer',
        name: 'Infinity Explorer',
        description: 'Enter the Infinity zone',
        type: 'zone',
        requirement: { type: 'zone_entered', value: 'infinity' },
        reward: { type: 'boss_coins', value: 200 },
        icon: '♾️',
        color: '#ff0000'
    },
    
    // Rebirth achievements
    FIRST_REBIRTH: {
        id: 'first_rebirth',
        name: 'Reborn',
        description: 'Rebirth for the first time',
        type: 'rebirth',
        requirement: { type: 'rebirth_count', value: 1 },
        reward: { type: 'boss_coins', value: 50 },
        icon: '🔄',
        color: '#f1c40f'
    },
    REBIRTH_MASTER: {
        id: 'rebirth_master',
        name: 'Rebirth Master',
        description: 'Rebirth 10 times',
        type: 'rebirth',
        requirement: { type: 'rebirth_count', value: 10 },
        reward: { type: 'boss_coins', value: 500 },
        icon: '🔄',
        color: '#f1c40f'
    },
    
    // Rarity achievements
    RARE_FIND: {
        id: 'rare_find',
        name: 'Rare Find',
        description: 'Mine a Rare ore',
        type: 'rarity',
        requirement: { type: 'ore_rarity_mined', value: 'rare' },
        reward: { type: 'money', value: 200 },
        icon: '💎',
        color: '#3498db'
    },
    EPIC_FIND: {
        id: 'epic_find',
        name: 'Epic Discovery',
        description: 'Mine an Epic ore',
        type: 'rarity',
        requirement: { type: 'ore_rarity_mined', value: 'epic' },
        reward: { type: 'money', value: 500 },
        icon: '💎',
        color: '#9b59b6'
    },
    LEGENDARY_FIND: {
        id: 'legendary_find',
        name: 'Legendary Discovery',
        description: 'Mine a Legendary ore',
        type: 'rarity',
        requirement: { type: 'ore_rarity_mined', value: 'legendary' },
        reward: { type: 'boss_coins', value: 25 },
        icon: '💎',
        color: '#f39c12'
    },
    MYTHIC_FIND: {
        id: 'mythic_find',
        name: 'Mythic Discovery',
        description: 'Mine a Mythic ore',
        type: 'rarity',
        requirement: { type: 'ore_rarity_mined', value: 'mythic' },
        reward: { type: 'boss_coins', value: 50 },
        icon: '💎',
        color: '#e74c3c'
    },
    SECRET_FIND: {
        id: 'secret_find',
        name: 'Secret Discovery',
        description: 'Mine a Secret ore',
        type: 'rarity',
        requirement: { type: 'ore_rarity_mined', value: 'secret' },
        reward: { type: 'boss_coins', value: 100 },
        icon: '💎',
        color: '#9b59b6'
    },
    ULTRA_SECRET_FIND: {
        id: 'ultra_secret_find',
        name: 'Ultra Secret Discovery',
        description: 'Mine an Ultra Secret ore',
        type: 'rarity',
        requirement: { type: 'ore_rarity_mined', value: 'ultra_secret' },
        reward: { type: 'boss_coins', value: 250 },
        icon: '💎',
        color: '#ff69b4'
    },
    
    // Pickaxe achievements
    DIVINE_PICKAXE: {
        id: 'divine_pickaxe',
        name: 'Divine Power',
        description: 'Obtain the Divine Pickaxe',
        type: 'equipment',
        requirement: { type: 'pickaxe_obtained', value: 'divine' },
        reward: { type: 'money', value: 10000 },
        icon: '⚒️',
        color: '#FFD700'
    },
    COSMIC_PICKAXE: {
        id: 'cosmic_pickaxe',
        name: 'Cosmic Power',
        description: 'Obtain the Cosmic Pickaxe',
        type: 'equipment',
        requirement: { type: 'pickaxe_obtained', value: 'cosmic' },
        reward: { type: 'boss_coins', value: 200 },
        icon: '⚒️',
        color: '#00FFFF'
    },
    
    // Backpack achievements
    DIVINE_BACKPACK: {
        id: 'divine_backpack',
        name: 'Divine Storage',
        description: 'Obtain the Divine Backpack',
        type: 'equipment',
        requirement: { type: 'backpack_obtained', value: 'divine' },
        reward: { type: 'money', value: 5000 },
        icon: '🎒',
        color: '#FFA500'
    },
    COSMIC_BACKPACK: {
        id: 'cosmic_backpack',
        name: 'Cosmic Storage',
        description: 'Obtain the Cosmic Backpack',
        type: 'equipment',
        requirement: { type: 'backpack_obtained', value: 'cosmic' },
        reward: { type: 'boss_coins', value: 100 },
        icon: '🎒',
        color: '#00FFFF'
    },
    
    // Special achievements
    WORLDHEART_SLAYER: {
        id: 'worldheart_slayer',
        name: 'Worldheart Slayer',
        description: 'Defeat the Worldheart Titan',
        type: 'boss',
        requirement: { type: 'boss_defeated', value: 'worldheart_titan' },
        reward: { type: 'boss_coins', value: 1000 },
        icon: '🏆',
        color: '#ff0000'
    },
    COLLECTOR: {
        id: 'collector',
        name: 'Collector',
        description: 'Mine every type of ore',
        type: 'collection',
        requirement: { type: 'ores_collected', value: 'all' },
        reward: { type: 'boss_coins', value: 500 },
        icon: '📚',
        color: '#e67e22'
    },
    SPEED_MINER: {
        id: 'speed_miner',
        name: 'Speed Miner',
        description: 'Mine 100 ores in 1 minute',
        type: 'challenge',
        requirement: { type: 'ores_in_minute', value: 100 },
        reward: { type: 'boss_coins', value: 75 },
        icon: '⚡',
        color: '#f39c12'
    }
};

/**
 * Get achievement by ID
 */
export function getAchievement(achievementId) {
    return ACHIEVEMENTS[achievementId.toUpperCase()] || null;
}

/**
 * Get all achievements
 */
export function getAllAchievements() {
    return Object.values(ACHIEVEMENTS);
}

/**
 * Get achievements by type
 */
export function getAchievementsByType(type) {
    return Object.values(ACHIEVEMENTS).filter(a => a.type === type);
}

/**
 * Check if achievement requirement is met
 */
export function checkAchievementRequirement(achievement, stats) {
    const req = achievement.requirement;
    
    switch (req.type) {
        case 'ores_mined':
            return stats.totalOresMined >= req.value;
        case 'total_money_earned':
            return stats.totalMoneyEarned >= req.value;
        case 'bosses_defeated':
            return stats.totalBossesDefeated >= req.value;
        case 'zone_entered':
            return stats.zonesEntered.includes(req.value);
        case 'rebirth_count':
            return stats.rebirthCount >= req.value;
        case 'ore_rarity_mined':
            return stats.oreRaritiesMined.includes(req.value);
        case 'pickaxe_obtained':
            return stats.pickaxesObtained.includes(req.value);
        case 'backpack_obtained':
            return stats.backpacksObtained.includes(req.value);
        case 'boss_defeated':
            return stats.bossesDefeated.includes(req.value);
        case 'ores_collected':
            if (req.value === 'all') {
                return stats.uniqueOresCollected >= getAllOreTypes().length;
            }
            return false;
        case 'ores_in_minute':
            return stats.maxOresPerMinute >= req.value;
        default:
            return false;
    }
}

/**
 * Get all ore types
 */
export function getAllOreTypes() {
    // This would be imported from oreData.js
    return ['stone', 'copper', 'iron', 'coal', 'gold', 'diamond', 'emerald', 'ruby', 'mythic_ore', 'void_shard', 'ancient_relic', 'celestial_fragment', 'astral_gem', 'divine_essence', 'starrcore', 'cosmic_crystal', 'eternium', 'nebulite', 'quantum_core', 'infinity_stone', 'chrono_crystal', 'singularity_ore', 'genesis_crystal', 'reality_shard', 'primordial_essence', 'worldheart'];
}
