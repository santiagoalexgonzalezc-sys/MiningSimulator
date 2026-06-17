/**
 * Centralized quest system with NPC definitions and quest tracking
 * Used across all systems for consistent quest behavior
 */

// Quest types
export const QUEST_TYPES = {
    MINE_ORE: 'mine_ore',
    EARN_MONEY: 'earn_money',
    UPGRADE_PICKAXE: 'upgrade_pickaxe',
    REACH_ZONE: 'reach_zone',
    SELL_ORE: 'sell_ore'
};

// NPC definitions
export const NPCS = {
    MINER_JOE: {
        id: 'miner_joe',
        name: 'Miner Joe',
        dialogue: 'Hey there, rookie! I can teach you the basics of mining. Check out my quests to get started!',
        color: '#8B4513',
        position: { x: 300, y: 300 },
        quests: ['first_ore', 'earn_first_money', 'upgrade_pickaxe_1']
    },
    GEM_COLLECTOR: {
        id: 'gem_collector',
        name: 'Gem Collector',
        dialogue: 'I collect rare gems from all over the world. Can you help me find some?',
        color: '#9B59B6',
        position: { x: 800, y: 600 },
        quests: ['mine_rare_ores', 'mine_epic_ores', 'mine_legendary']
    },
    ENGINEER: {
        id: 'engineer',
        name: 'Engineer',
        dialogue: 'I specialize in equipment upgrades. My quests will help you become a master miner!',
        color: '#3498DB',
        position: { x: 1200, y: 900 },
        quests: ['upgrade_pickaxe_2', 'upgrade_pickaxe_3', 'upgrade_backpack']
    }
};

// Quest definitions
export const QUESTS = {
    // Miner Joe quests
    first_ore: {
        id: 'first_ore',
        title: 'First Steps',
        description: 'Mine 10 Coal to get started',
        type: QUEST_TYPES.MINE_ORE,
        target: 'Coal',
        required: 10,
        rewards: {
            money: 50,
            xp: 25
        },
        npcId: 'miner_joe'
    },
    earn_first_money: {
        id: 'earn_first_money',
        title: 'First Earnings',
        description: 'Earn $200 by selling ores',
        type: QUEST_TYPES.EARN_MONEY,
        required: 200,
        rewards: {
            money: 100,
            xp: 50
        },
        npcId: 'miner_joe'
    },
    upgrade_pickaxe_1: {
        id: 'upgrade_pickaxe_1',
        title: 'Better Tools',
        description: 'Upgrade to Stone Pickaxe',
        type: QUEST_TYPES.UPGRADE_PICKAXE,
        target: 'stone',
        required: 1,
        rewards: {
            money: 150,
            xp: 75
        },
        npcId: 'miner_joe'
    },
    
    // Gem Collector quests
    mine_rare_ores: {
        id: 'mine_rare_ores',
        title: 'Rare Collector',
        description: 'Mine 5 Rare ores',
        type: QUEST_TYPES.MINE_ORE,
        target: 'Rare',
        required: 5,
        rewards: {
            money: 500,
            xp: 200
        },
        npcId: 'gem_collector'
    },
    mine_epic_ores: {
        id: 'mine_epic_ores',
        title: 'Epic Hunter',
        description: 'Mine 3 Epic ores',
        type: QUEST_TYPES.MINE_ORE,
        target: 'Epic',
        required: 3,
        rewards: {
            money: 1000,
            xp: 400
        },
        npcId: 'gem_collector'
    },
    mine_legendary: {
        id: 'mine_legendary',
        title: 'Legendary Seeker',
        description: 'Mine 1 Legendary ore',
        type: QUEST_TYPES.MINE_ORE,
        target: 'Legendary',
        required: 1,
        rewards: {
            money: 2500,
            xp: 800
        },
        npcId: 'gem_collector'
    },
    
    // Engineer quests
    upgrade_pickaxe_2: {
        id: 'upgrade_pickaxe_2',
        title: 'Iron Age',
        description: 'Upgrade to Iron Pickaxe',
        type: QUEST_TYPES.UPGRADE_PICKAXE,
        target: 'iron',
        required: 1,
        rewards: {
            money: 300,
            xp: 150
        },
        npcId: 'engineer'
    },
    upgrade_pickaxe_3: {
        id: 'upgrade_pickaxe_3',
        title: 'Steel Strength',
        description: 'Upgrade to Steel Pickaxe',
        type: QUEST_TYPES.UPGRADE_PICKAXE,
        target: 'steel',
        required: 1,
        rewards: {
            money: 800,
            xp: 350
        },
        npcId: 'engineer'
    },
    upgrade_backpack: {
        id: 'upgrade_backpack',
        title: 'More Space',
        description: 'Upgrade to Medium Backpack',
        type: QUEST_TYPES.UPGRADE_PICKAXE,
        target: 'medium_backpack',
        required: 1,
        rewards: {
            money: 200,
            xp: 100
        },
        npcId: 'engineer'
    }
};

/**
 * Get quest by ID
 */
export function getQuest(questId) {
    return QUESTS[questId];
}

/**
 * Get NPC by ID
 */
export function getNPC(npcId) {
    return Object.values(NPCS).find(npc => npc.id === npcId);
}

/**
 * Check if quest is completed
 */
export function isQuestCompleted(quest, progress) {
    return progress >= quest.required;
}

/**
 * Calculate quest progress percentage
 */
export function getQuestProgress(quest, progress) {
    return Math.min((progress / quest.required) * 100, 100);
}
