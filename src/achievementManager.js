import { getAchievement, getAllAchievements, checkAchievementRequirement } from './achievementData.js';

/**
 * AchievementManager class - manages achievement tracking and completion
 */
export class AchievementManager {
    constructor(player, bossManager, rebirthManager) {
        this.player = player;
        this.bossManager = bossManager;
        this.rebirthManager = rebirthManager;
        
        this.completedAchievements = {};
        this.pendingAchievements = [];
        this.showPopupCallback = null;
        
        // Statistics tracking
        this.stats = {
            totalOresMined: 0,
            totalMoneyEarned: 0,
            totalBossesDefeated: 0,
            zonesEntered: [],
            rebirthCount: 0,
            oreRaritiesMined: [],
            pickaxesObtained: [],
            backpacksObtained: [],
            bossesDefeated: [],
            uniqueOresCollected: 0,
            maxOresPerMinute: 0,
            oresInCurrentMinute: 0,
            lastMinuteCheck: 0
        };
    }
    
    /**
     * Update achievement manager
     */
    update(deltaTime) {
        // Check ores per minute
        const now = Date.now();
        if (now - this.lastMinuteCheck >= 60000) {
            if (this.oresInCurrentMinute > this.stats.maxOresPerMinute) {
                this.stats.maxOresPerMinute = this.oresInCurrentMinute;
            }
            this.oresInCurrentMinute = 0;
            this.lastMinuteCheck = now;
        }
        
        // Check for new achievements
        this.checkAchievements();
        
        // Show pending achievement popups
        this.showPendingAchievements();
    }
    
    /**
     * Check all achievements for completion
     */
    checkAchievements() {
        const achievements = getAllAchievements();
        
        for (const achievement of achievements) {
            if (this.completedAchievements[achievement.id]) continue;
            
            if (checkAchievementRequirement(achievement, this.stats)) {
                this.completeAchievement(achievement);
            }
        }
    }
    
    /**
     * Complete an achievement
     */
    completeAchievement(achievement) {
        this.completedAchievements[achievement.id] = {
            completedAt: Date.now(),
            achievement: achievement
        };
        
        this.pendingAchievements.push(achievement);
        
        // Grant reward
        this.grantReward(achievement.reward);
    }
    
    /**
     * Grant achievement reward
     */
    grantReward(reward) {
        switch (reward.type) {
            case 'money':
                this.player.money += reward.value;
                break;
            case 'boss_coins':
                this.bossManager.addBossCoins(reward.value);
                break;
        }
    }
    
    /**
     * Show pending achievement popups
     */
    showPendingAchievements() {
        if (this.pendingAchievements.length === 0) return;
        
        const achievement = this.pendingAchievements.shift();
        if (this.showPopupCallback) {
            this.showPopupCallback(achievement);
        }
    }
    
    /**
     * Set popup callback
     */
    setPopupCallback(callback) {
        this.showPopupCallback = callback;
    }
    
    /**
     * Track ore mined
     */
    trackOreMined(ore) {
        this.stats.totalOresMined++;
        this.oresInCurrentMinute++;
        
        // Track rarity
        if (ore.rarity && !this.stats.oreRaritiesMined.includes(ore.rarity)) {
            this.stats.oreRaritiesMined.push(ore.rarity);
        }
        
        // Track unique ore types
        if (!this.stats.uniqueOresCollected) {
            this.stats.uniqueOresCollected = 0;
        }
        // This would require tracking ore types separately
    }
    
    /**
     * Track money earned
     */
    trackMoneyEarned(amount) {
        this.stats.totalMoneyEarned += amount;
    }
    
    /**
     * Track boss defeated
     */
    trackBossDefeated(bossId) {
        this.stats.totalBossesDefeated++;
        if (!this.stats.bossesDefeated.includes(bossId)) {
            this.stats.bossesDefeated.push(bossId);
        }
    }
    
    /**
     * Track zone entered
     */
    trackZoneEntered(zoneId) {
        if (!this.stats.zonesEntered.includes(zoneId)) {
            this.stats.zonesEntered.push(zoneId);
        }
    }
    
    /**
     * Track rebirth
     */
    trackRebirth() {
        this.stats.rebirthCount = this.rebirthManager.rebirthCount;
    }
    
    /**
     * Track pickaxe obtained
     */
    trackPickaxeObtained(pickaxeId) {
        if (!this.stats.pickaxesObtained.includes(pickaxeId)) {
            this.stats.pickaxesObtained.push(pickaxeId);
        }
    }
    
    /**
     * Track backpack obtained
     */
    trackBackpackObtained(backpackId) {
        if (!this.stats.backpacksObtained.includes(backpackId)) {
            this.stats.backpacksObtained.push(backpackId);
        }
    }
    
    /**
     * Get completed achievements
     */
    getCompletedAchievements() {
        return Object.values(this.completedAchievements);
    }
    
    /**
     * Get achievement progress
     */
    getAchievementProgress(achievementId) {
        const achievement = getAchievement(achievementId);
        if (!achievement) return null;
        
        const req = achievement.requirement;
        let current = 0;
        let total = req.value;
        
        switch (req.type) {
            case 'ores_mined':
                current = this.stats.totalOresMined;
                break;
            case 'total_money_earned':
                current = this.stats.totalMoneyEarned;
                break;
            case 'bosses_defeated':
                current = this.stats.totalBossesDefeated;
                break;
            case 'rebirth_count':
                current = this.stats.rebirthCount;
                break;
            case 'ores_in_minute':
                current = this.stats.maxOresPerMinute;
                break;
            default:
                // For boolean requirements, return 1 or 0
                if (checkAchievementRequirement(achievement, this.stats)) {
                    current = 1;
                    total = 1;
                }
        }
        
        return {
            current: current,
            total: total,
            completed: this.completedAchievements[achievementId] !== undefined
        };
    }
    
    /**
     * Get achievement completion percentage
     */
    getCompletionPercentage() {
        const total = getAllAchievements().length;
        const completed = Object.keys(this.completedAchievements).length;
        return Math.floor((completed / total) * 100);
    }
    
    /**
     * Serialize achievement manager state
     */
    toJSON() {
        return {
            completedAchievements: this.completedAchievements,
            stats: this.stats
        };
    }
    
    /**
     * Deserialize achievement manager state
     */
    fromJSON(data) {
        this.completedAchievements = data.completedAchievements || {};
        this.stats = data.stats || {
            totalOresMined: 0,
            totalMoneyEarned: 0,
            totalBossesDefeated: 0,
            zonesEntered: [],
            rebirthCount: 0,
            oreRaritiesMined: [],
            pickaxesObtained: [],
            backpacksObtained: [],
            bossesDefeated: [],
            uniqueOresCollected: 0,
            maxOresPerMinute: 0,
            oresInCurrentMinute: 0,
            lastMinuteCheck: 0
        };
    }
}
