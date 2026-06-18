/**
 * Boss Data Definitions
 * Data-driven boss system for Phase 9
 */

// Boss definitions
export const BOSSES = {
    CRYSTAL_GOLEM: {
        id: 'crystal_golem',
        name: 'Crystal Golem',
        description: 'A massive construct of living crystal',
        hp: 5000,
        level: 25,
        requiredZone: 'crystal',
        arena: 'crystal_arena',
        respawnTime: 300, // 5 minutes in seconds
        color: '#9b59b6',
        rewards: {
            bossCoins: { min: 10, max: 25 },
            materials: ['diamond', 'emerald', 'mythic_ore'],
            eggs: ['common', 'uncommon', 'rare'],
            xp: 500
        },
        attackPatterns: ['slam', 'crystal_shard', 'ground_pound']
    },
    LAVA_TITAN: {
        id: 'lava_titan',
        name: 'Lava Titan',
        description: 'Ancient titan forged in molten rock',
        hp: 20000,
        level: 50,
        requiredZone: 'lava',
        arena: 'lava_arena',
        respawnTime: 600, // 10 minutes in seconds
        color: '#e74c3c',
        rewards: {
            bossCoins: { min: 25, max: 50 },
            materials: ['ruby', 'mythic_ore', 'void_shard'],
            eggs: ['rare', 'epic'],
            xp: 2000
        },
        attackPatterns: ['lava_burst', 'fire_wave', 'magma_fist']
    },
    VOID_GUARDIAN: {
        id: 'void_guardian',
        name: 'Void Guardian',
        description: 'Eternal sentinel of the void',
        hp: 75000,
        level: 100,
        requiredZone: 'void',
        arena: 'void_arena',
        respawnTime: 900, // 15 minutes in seconds
        color: '#4b0082',
        rewards: {
            bossCoins: { min: 50, max: 100 },
            materials: ['void_shard', 'ancient_relic', 'celestial_fragment'],
            eggs: ['epic', 'legendary'],
            xp: 5000
        },
        attackPatterns: ['void_beam', 'dark_pulse', 'dimensional_rift']
    },
    CELESTIAL_OVERLORD: {
        id: 'celestial_overlord',
        name: 'Celestial Overlord',
        description: 'Master of the celestial realm',
        hp: 200000,
        level: 150,
        requiredZone: 'celestial',
        arena: 'celestial_arena',
        respawnTime: 1200, // 20 minutes in seconds
        color: '#00bfff',
        rewards: {
            bossCoins: { min: 100, max: 200 },
            materials: ['celestial_fragment', 'astral_gem', 'divine_essence'],
            eggs: ['legendary', 'mythic'],
            xp: 15000
        },
        attackPatterns: ['starfall', 'cosmic_ray', 'lightning_storm']
    },
    COSMIC_EMPEROR: {
        id: 'cosmic_emperor',
        name: 'Cosmic Emperor',
        description: 'Ruler of the cosmic domain',
        hp: 500000,
        level: 250,
        requiredZone: 'cosmic',
        arena: 'cosmic_arena',
        respawnTime: 1800, // 30 minutes in seconds
        color: '#e6e6fa',
        rewards: {
            bossCoins: { min: 200, max: 400 },
            materials: ['cosmic_crystal', 'eternium', 'nebulite'],
            eggs: ['mythic'],
            xp: 50000
        },
        attackPatterns: ['black_hole', 'time_warp', 'reality_tear']
    },
    WORLDHEART_TITAN: {
        id: 'worldheart_titan',
        name: 'Worldheart Titan',
        description: 'Guardian of the Worldheart itself',
        hp: 1500000,
        level: 500,
        requiredZone: 'infinity',
        arena: 'infinity_arena',
        respawnTime: 3600, // 1 hour in seconds
        color: '#ff0000',
        rewards: {
            bossCoins: { min: 500, max: 1000 },
            materials: ['quantum_core', 'infinity_stone', 'genesis_crystal', 'reality_shard'],
            eggs: ['mythic', 'secret'],
            xp: 200000
        },
        attackPatterns: ['world_shatter', 'existence_erasure', 'ultimate_cataclysm']
    }
};

// Boss progression order
export const BOSS_ORDER = ['crystal_golem', 'lava_titan', 'void_guardian', 'celestial_overlord', 'cosmic_emperor', 'worldheart_titan'];

/**
 * Get boss by ID
 */
export function getBoss(bossId) {
    return BOSSES[bossId.toUpperCase()] || null;
}

/**
 * Get boss by zone
 */
export function getBossByZone(zoneId) {
    for (const bossId in BOSSES) {
        const boss = BOSSES[bossId];
        if (boss.requiredZone === zoneId) {
            return boss;
        }
    }
    return null;
}

/**
 * Get all bosses
 */
export function getAllBosses() {
    return Object.values(BOSSES);
}

/**
 * Get bosses available for a given level
 */
export function getBossesForLevel(level) {
    return Object.values(BOSSES).filter(boss => boss.level <= level);
}

/**
 * Get next boss in progression
 */
export function getNextBoss(currentBossId) {
    const currentIndex = BOSS_ORDER.indexOf(currentBossId);
    if (currentIndex === -1 || currentIndex >= BOSS_ORDER.length - 1) {
        return null;
    }
    return getBoss(BOSS_ORDER[currentIndex + 1]);
}

/**
 * Check if player can fight boss
 */
export function canFightBoss(bossId, player) {
    const boss = getBoss(bossId);
    if (!boss) return false;
    
    return player.level >= boss.level;
}

/**
 * Calculate boss HP scaling with rebirth
 */
export function calculateBossHP(baseHP, rebirthCount) {
    const scaling = 1 + (rebirthCount * 0.1); // 10% HP increase per rebirth
    return Math.floor(baseHP * scaling);
}

/**
 * Calculate boss rewards with rebirth multiplier
 */
export function calculateBossRewards(baseRewards, rebirthCount) {
    const multiplier = 1 + (rebirthCount * 0.05); // 5% reward increase per rebirth
    const scaledRewards = {};
    
    for (const key in baseRewards) {
        if (typeof baseRewards[key] === 'object' && baseRewards[key].min !== undefined) {
            scaledRewards[key] = {
                min: Math.floor(baseRewards[key].min * multiplier),
                max: Math.floor(baseRewards[key].max * multiplier)
            };
        } else if (typeof baseRewards[key] === 'number') {
            scaledRewards[key] = Math.floor(baseRewards[key] * multiplier);
        } else {
            scaledRewards[key] = baseRewards[key];
        }
    }
    
    return scaledRewards;
}

/**
 * Get boss arena data
 */
export const ARENAS = {
    crystal_arena: {
        id: 'crystal_arena',
        name: 'Crystal Arena',
        zone: 'crystal',
        backgroundColor: '#2c3e50',
        gridColor: '#1a252f',
        entrancePosition: { x: 500, y: 300 },
        bossSpawnPosition: { x: 800, y: 400 },
        exitPosition: { x: 1100, y: 300 }
    },
    lava_arena: {
        id: 'lava_arena',
        name: 'Lava Arena',
        zone: 'lava',
        backgroundColor: '#5a2d2d',
        gridColor: '#4a1d1d',
        entrancePosition: { x: 500, y: 300 },
        bossSpawnPosition: { x: 800, y: 400 },
        exitPosition: { x: 1100, y: 300 }
    },
    void_arena: {
        id: 'void_arena',
        name: 'Void Arena',
        zone: 'void',
        backgroundColor: '#1a0a2e',
        gridColor: '#0d0518',
        entrancePosition: { x: 500, y: 300 },
        bossSpawnPosition: { x: 800, y: 400 },
        exitPosition: { x: 1100, y: 300 }
    },
    celestial_arena: {
        id: 'celestial_arena',
        name: 'Celestial Arena',
        zone: 'celestial',
        backgroundColor: '#0f2040',
        gridColor: '#0a1525',
        entrancePosition: { x: 500, y: 300 },
        bossSpawnPosition: { x: 800, y: 400 },
        exitPosition: { x: 1100, y: 300 }
    },
    cosmic_arena: {
        id: 'cosmic_arena',
        name: 'Cosmic Arena',
        zone: 'cosmic',
        backgroundColor: '#0a0a1a',
        gridColor: '#050510',
        entrancePosition: { x: 500, y: 300 },
        bossSpawnPosition: { x: 800, y: 400 },
        exitPosition: { x: 1100, y: 300 }
    },
    infinity_arena: {
        id: 'infinity_arena',
        name: 'Infinity Arena',
        zone: 'infinity',
        backgroundColor: '#000000',
        gridColor: '#1a1a1a',
        entrancePosition: { x: 500, y: 300 },
        bossSpawnPosition: { x: 800, y: 400 },
        exitPosition: { x: 1100, y: 300 }
    }
};

/**
 * Get arena by ID
 */
export function getArena(arenaId) {
    return ARENAS[arenaId] || null;
}

/**
 * Get arena by zone
 */
export function getArenaByZone(zoneId) {
    for (const arenaId in ARENAS) {
        const arena = ARENAS[arenaId];
        if (arena.zone === zoneId) {
            return arena;
        }
    }
    return null;
}
