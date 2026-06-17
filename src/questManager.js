import { QUESTS, QUEST_TYPES, getQuest, isQuestCompleted, getQuestProgress } from './questSystem.js';

/**
 * QuestManager class - manages quest progress and rewards
 */
export class QuestManager {
    constructor(player) {
        this.player = player;
        this.activeQuests = {};
        this.completedQuests = {};
        this.questProgress = {};
    }
    
    /**
     * Accept a quest
     */
    acceptQuest(questId) {
        const quest = getQuest(questId);
        if (!quest) return false;
        
        if (this.completedQuests[questId]) return false; // Already completed
        if (this.activeQuests[questId]) return false; // Already active
        
        this.activeQuests[questId] = true;
        this.questProgress[questId] = 0;
        return true;
    }
    
    /**
     * Update quest progress based on event type
     */
    updateProgress(eventType, data) {
        for (const questId in this.activeQuests) {
            const quest = getQuest(questId);
            if (!quest) continue;
            
            let shouldUpdate = false;
            let progressIncrement = 0;
            
            switch (quest.type) {
                case QUEST_TYPES.MINE_ORE:
                    if (eventType === 'mine') {
                        if (quest.target === data.oreType || quest.target === data.rarity) {
                            progressIncrement = 1;
                            shouldUpdate = true;
                        }
                    }
                    break;
                    
                case QUEST_TYPES.EARN_MONEY:
                    if (eventType === 'earn_money') {
                        progressIncrement = data.amount;
                        shouldUpdate = true;
                    }
                    break;
                    
                case QUEST_TYPES.UPGRADE_PICKAXE:
                    if (eventType === 'upgrade') {
                        if (quest.target === data.type) {
                            progressIncrement = 1;
                            shouldUpdate = true;
                        }
                    }
                    break;
                    
                case QUEST_TYPES.REACH_ZONE:
                    if (eventType === 'zone_change') {
                        if (quest.target === data.zoneId) {
                            progressIncrement = 1;
                            shouldUpdate = true;
                        }
                    }
                    break;
                    
                case QUEST_TYPES.SELL_ORE:
                    if (eventType === 'sell') {
                        if (quest.target === data.oreType) {
                            progressIncrement = data.amount;
                            shouldUpdate = true;
                        }
                    }
                    break;
            }
            
            if (shouldUpdate) {
                this.questProgress[questId] += progressIncrement;
                
                // Check if quest is completed
                if (isQuestCompleted(quest, this.questProgress[questId])) {
                    this.completeQuest(questId);
                }
            }
        }
    }
    
    /**
     * Complete a quest and grant rewards
     */
    completeQuest(questId) {
        const quest = getQuest(questId);
        if (!quest) return;
        
        // Grant rewards
        if (quest.rewards.money) {
            this.player.money += quest.rewards.money;
        }
        
        if (quest.rewards.xp) {
            this.player.addXP(quest.rewards.xp);
        }
        
        // Move from active to completed
        delete this.activeQuests[questId];
        this.completedQuests[questId] = true;
    }
    
    /**
     * Get quest progress for a specific quest
     */
    getQuestProgress(questId) {
        return this.questProgress[questId] || 0;
    }
    
    /**
     * Check if a quest is active
     */
    isQuestActive(questId) {
        return !!this.activeQuests[questId];
    }
    
    /**
     * Check if a quest is completed
     */
    isQuestCompleted(questId) {
        return !!this.completedQuests[questId];
    }
    
    /**
     * Get all active quests
     */
    getActiveQuests() {
        const quests = [];
        for (const questId in this.activeQuests) {
            const quest = getQuest(questId);
            if (quest) {
                quests.push({
                    ...quest,
                    progress: this.questProgress[questId],
                    progressPercent: getQuestProgress(quest, this.questProgress[questId])
                });
            }
        }
        return quests;
    }
    
    /**
     * Get all completed quests
     */
    getCompletedQuests() {
        const quests = [];
        for (const questId in this.completedQuests) {
            const quest = getQuest(questId);
            if (quest) {
                quests.push(quest);
            }
        }
        return quests;
    }
    
    /**
     * Accept all quests from an NPC
     */
    acceptNPCQuests(npcId) {
        const accepted = [];
        for (const questId in QUESTS) {
            const quest = QUESTS[questId];
            if (quest.npcId === npcId) {
                if (this.acceptQuest(questId)) {
                    accepted.push(quest);
                }
            }
        }
        return accepted;
    }
    
    toJSON() {
        return {
            activeQuests: this.activeQuests,
            completedQuests: this.completedQuests,
            questProgress: this.questProgress
        };
    }
    
    fromJSON(data) {
        this.activeQuests = data.activeQuests || {};
        this.completedQuests = data.completedQuests || {};
        this.questProgress = data.questProgress || {};
    }
    
    reset() {
        this.activeQuests = {};
        this.completedQuests = {};
        this.questProgress = {};
    }
    
    getCompletedQuestCount() {
        return Object.keys(this.completedQuests).length;
    }
}
