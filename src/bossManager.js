import { Boss } from './boss.js';
import { getBoss, getBossByZone, getBossesForLevel, getAllBosses } from './bossData.js';

/**
 * BossManager class - manages boss lifecycle, respawns, and state
 */
export class BossManager {
    constructor(rebirthManager) {
        this.rebirthManager = rebirthManager;
        this.activeBosses = {};
        this.bossRespawns = {};
        this.defeatedBosses = {};
        this.bossCoins = 0;
        this.bossDefeatCount = 0;
        this.totalBossDamage = 0;
    }
    
    /**
     * Spawn a boss in a zone
     */
    spawnBoss(bossId) {
        const bossData = getBoss(bossId);
        if (!bossData) return null;
        
        const rebirthCount = this.rebirthManager ? this.rebirthManager.rebirthCount : 0;
        const boss = new Boss(bossId, rebirthCount);
        
        // Set boss position based on arena
        boss.x = 700;
        boss.y = 350;
        
        this.activeBosses[bossId] = boss;
        return boss;
    }
    
    /**
     * Get active boss by ID
     */
    getActiveBoss(bossId) {
        return this.activeBosses[bossId] || null;
    }
    
    /**
     * Get active boss by zone
     */
    getActiveBossByZone(zoneId) {
        const bossData = getBossByZone(zoneId);
        if (!bossData) return null;
        return this.activeBosses[bossData.id] || null;
    }
    
    /**
     * Check if boss is currently active
     */
    isBossActive(bossId) {
        return !!this.activeBosses[bossId];
    }
    
    /**
     * Check if boss can be spawned
     */
    canSpawnBoss(bossId, player) {
        const bossData = getBoss(bossId);
        if (!bossData) {
            console.log(`Boss ${bossId} not found`);
            return false;
        }
        
        // Check if already active
        if (this.activeBosses[bossId]) {
            console.log(`Boss ${bossId} already active`);
            return false;
        }
        
        // Check respawn timer
        if (this.bossRespawns[bossId]) {
            const now = Date.now();
            if (now < this.bossRespawns[bossId]) {
                return false;
            }
        }
        
        // Check player level
        if (player.level < bossData.level) {
            console.log(`Player level ${player.level} < boss level ${bossData.level}`);
            return false;
        }
        
        // Check if player is in correct zone
        if (player.currentZone !== bossData.requiredZone) {
            console.log(`Player zone ${player.currentZone} != boss zone ${bossData.requiredZone}`);
            return false;
        }
        
        return true;
    }
    
    /**
     * Handle boss defeat
     */
    handleBossDefeat(bossId) {
        const boss = this.activeBosses[bossId];
        if (!boss) return null;
        
        // Get rewards
        const rebirthCount = this.rebirthManager ? this.rebirthManager.rebirthCount : 0;
        const rewards = boss.getRewards(rebirthCount);
        
        // Add boss coins
        if (rewards.bossCoins) {
            const coinAmount = Math.floor(Math.random() * (rewards.bossCoins.max - rewards.bossCoins.min + 1)) + rewards.bossCoins.min;
            this.bossCoins += coinAmount;
        }
        
        // Update statistics
        this.bossDefeatCount++;
        this.defeatedBosses[bossId] = (this.defeatedBosses[bossId] || 0) + 1;
        
        // Set respawn timer
        const bossData = getBoss(bossId);
        if (bossData) {
            this.bossRespawns[bossId] = Date.now() + (bossData.respawnTime * 1000);
        }
        
        // Remove from active bosses
        delete this.activeBosses[bossId];
        
        return rewards;
    }
    
    /**
     * Get respawn time for boss
     */
    getBossRespawnTime(bossId) {
        if (!this.bossRespawns[bossId]) return 0;
        const now = Date.now();
        return Math.max(0, this.bossRespawns[bossId] - now);
    }
    
    /**
     * Get respawn time formatted
     */
    getBossRespawnTimeFormatted(bossId) {
        const remainingMs = this.getBossRespawnTime(bossId);
        if (remainingMs <= 0) return 'Ready';
        
        const minutes = Math.floor(remainingMs / 60000);
        const seconds = Math.floor((remainingMs % 60000) / 1000);
        return `${minutes}m ${seconds}s`;
    }
    
    /**
     * Update all active bosses
     */
    update(deltaTime, player) {
        for (const bossId in this.activeBosses) {
            const boss = this.activeBosses[bossId];
            boss.update(deltaTime, player);
            
            // Check if boss was defeated
            if (!boss.isAlive && boss.isDefeated && boss.defeatAnimationProgress >= 1) {
                this.handleBossDefeat(bossId);
            }
        }
    }
    
    /**
     * Render all active bosses
     */
    render(ctx) {
        for (const bossId in this.activeBosses) {
            const boss = this.activeBosses[bossId];
            boss.render(ctx);
        }
    }
    
    /**
     * Get all available bosses for player level
     */
    getAvailableBosses(playerLevel) {
        return getBossesForLevel(playerLevel);
    }
    
    /**
     * Get boss defeat count
     */
    getBossDefeatCount(bossId) {
        return this.defeatedBosses[bossId] || 0;
    }
    
    /**
     * Get total boss defeats
     */
    getTotalBossDefeats() {
        return this.bossDefeatCount;
    }
    
    /**
     * Get boss coins
     */
    getBossCoins() {
        return this.bossCoins;
    }
    
    /**
     * Spend boss coins
     */
    spendBossCoins(amount) {
        if (this.bossCoins >= amount) {
            this.bossCoins -= amount;
            return true;
        }
        return false;
    }
    
    /**
     * Add boss coins
     */
    addBossCoins(amount) {
        this.bossCoins += amount;
    }
    
    /**
     * Get total damage dealt to bosses
     */
    getTotalDamage() {
        return this.totalBossDamage;
    }
    
    /**
     * Add damage to total
     */
    addDamage(amount) {
        this.totalBossDamage += amount;
    }
    
    /**
     * Reset boss system (for rebirth)
     */
    reset() {
        // Keep boss coins (they persist through rebirths)
        // Reset active bosses
        this.activeBosses = {};
        // Keep respawn timers
        // Keep defeat counts for statistics
    }
    
    /**
     * Get boss status for UI
     */
    getBossStatus(bossId) {
        const bossData = getBoss(bossId);
        if (!bossData) return null;
        
        const isActive = this.isBossActive(bossId);
        const respawnTime = this.getBossRespawnTime(bossId);
        const defeatCount = this.getBossDefeatCount(bossId);
        
        return {
            id: bossData.id,
            name: bossData.name,
            description: bossData.description,
            level: bossData.level,
            requiredZone: bossData.requiredZone,
            isActive: isActive,
            respawnTime: respawnTime,
            respawnTimeFormatted: this.getBossRespawnTimeFormatted(bossId),
            defeatCount: defeatCount,
            canSpawn: respawnTime <= 0
        };
    }
    
    /**
     * Get all boss statuses
     */
    getAllBossStatuses() {
        const bosses = getAllBosses();
        return bosses.map(boss => this.getBossStatus(boss.id));
    }
    
    /**
     * Serialize boss manager state
     */
    toJSON() {
        return {
            bossCoins: this.bossCoins,
            bossDefeatCount: this.bossDefeatCount,
            totalBossDamage: this.totalBossDamage,
            defeatedBosses: this.defeatedBosses,
            bossRespawns: this.bossRespawns
        };
    }
    
    /**
     * Deserialize boss manager state
     */
    fromJSON(data) {
        this.bossCoins = data.bossCoins || 0;
        this.bossDefeatCount = data.bossDefeatCount || 0;
        this.totalBossDamage = data.totalBossDamage || 0;
        this.defeatedBosses = data.defeatedBosses || {};
        this.bossRespawns = data.bossRespawns || {};
        
        // Clear active bosses on load (they need to be respawned)
        this.activeBosses = {};
    }
}
