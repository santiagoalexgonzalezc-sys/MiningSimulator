import { canRebirth, calculateRebirthPoints, calculateRebirthMultiplier, getRebirthRequirementStatus, calculateUpgradeCost, calculateUpgradeEffect, getUpgrade, PERMANENT_UPGRADES } from './rebirthSystem.js';

/**
 * RebirthManager class - manages rebirth system and permanent upgrades
 */
export class RebirthManager {
    constructor() {
        this.rebirthCount = 0;
        this.rebirthPoints = 0;
        this.permanentUpgrades = {};
        
        // Initialize upgrades
        for (const upgradeId in PERMANENT_UPGRADES) {
            this.permanentUpgrades[upgradeId] = 0;
        }
    }
    
    /**
     * Check if player can rebirth
     */
    canRebirth(player, questManager) {
        return canRebirth(player, questManager);
    }
    
    /**
     * Get rebirth requirement status
     */
    getRequirementStatus(player, questManager) {
        return getRebirthRequirementStatus(player, questManager);
    }
    
    /**
     * Calculate RP gained from rebirth
     */
    calculateRebirthPointsGained() {
        return calculateRebirthPoints(this.rebirthCount);
    }
    
    /**
     * Get global multiplier from rebirth
     */
    getRebirthMultiplier(type) {
        return calculateRebirthMultiplier(this.rebirthCount, type);
    }
    
    /**
     * Perform rebirth
     */
    rebirth(player, inventory, world, questManager, petManager) {
        // Calculate RP gained
        const rpGained = this.calculateRebirthPointsGained();
        
        // Increment rebirth count
        this.rebirthCount++;
        
        // Add RP
        this.rebirthPoints += rpGained;
        
        // Reset player (keep level, reset money, pickaxe)
        player.money = this.getStartingMoney();
        player.pickaxeId = 'wooden';
        player.level = 1;
        player.xp = 0;
        player.xpToNextLevel = 100;
        
        // Reset inventory
        inventory.clear();
        inventory.backpackId = 'small';
        inventory.backpack = inventory.getBackpack(inventory.backpackId);
        
        // Reset zones (keep surface unlocked)
        world.resetZones();
        
        // Reset quests
        questManager.reset();
        
        // Keep pets (they are permanent)
        // Pets are not reset on rebirth
        
        return rpGained;
    }
    
    /**
     * Get starting money after rebirth
     */
    getStartingMoney() {
        const upgradeLevel = this.permanentUpgrades['STARTING_MONEY_BOOST'] || 0;
        const baseMoney = 0;
        const bonusMoney = calculateUpgradeEffect('STARTING_MONEY_BOOST', upgradeLevel);
        return baseMoney + bonusMoney;
    }
    
    /**
     * Purchase permanent upgrade
     */
    purchaseUpgrade(upgradeId) {
        const upgrade = getUpgrade(upgradeId);
        if (!upgrade) return false;
        
        const currentLevel = this.permanentUpgrades[upgradeId] || 0;
        if (currentLevel >= upgrade.maxLevel) return false;
        
        const cost = calculateUpgradeCost(upgradeId, currentLevel);
        if (this.rebirthPoints < cost) return false;
        
        this.rebirthPoints -= cost;
        this.permanentUpgrades[upgradeId] = currentLevel + 1;
        
        return true;
    }
    
    /**
     * Get upgrade level
     */
    getUpgradeLevel(upgradeId) {
        return this.permanentUpgrades[upgradeId] || 0;
    }
    
    /**
     * Get upgrade effect
     */
    getUpgradeEffect(upgradeId) {
        const level = this.getUpgradeLevel(upgradeId);
        return calculateUpgradeEffect(upgradeId, level);
    }
    
    /**
     * Get upgrade cost
     */
    getUpgradeCost(upgradeId) {
        const currentLevel = this.permanentUpgrades[upgradeId] || 0;
        return calculateUpgradeCost(upgradeId, currentLevel);
    }
    
    /**
     * Get all upgrades
     */
    getAllUpgrades() {
        const upgrades = [];
        for (const upgradeId in PERMANENT_UPGRADES) {
            const upgrade = PERMANENT_UPGRADES[upgradeId];
            const currentLevel = this.permanentUpgrades[upgradeId] || 0;
            const cost = calculateUpgradeCost(upgradeId, currentLevel);
            const canAfford = this.rebirthPoints >= cost;
            const isMaxed = currentLevel >= upgrade.maxLevel;
            
            upgrades.push({
                ...upgrade,
                currentLevel: currentLevel,
                cost: cost,
                canAfford: canAfford,
                isMaxed: isMaxed,
                effect: calculateUpgradeEffect(upgradeId, currentLevel)
            });
        }
        return upgrades;
    }
    
    /**
     * Calculate total global multiplier (rebirth + upgrades)
     */
    getTotalMultiplier(type) {
        let multiplier = 1;
        
        // Add rebirth multiplier
        multiplier *= this.getRebirthMultiplier(type);
        
        // Add upgrade multipliers
        switch (type) {
            case 'mining_speed':
                multiplier += this.getUpgradeEffect('MINING_SPEED_BOOST');
                multiplier += this.getUpgradeEffect('CRIT_CHANCE_BOOST');
                break;
            case 'ore_value':
                multiplier += this.getUpgradeEffect('AUTO_SELL_IMPROVEMENT');
                break;
            case 'xp_gain':
                multiplier += this.getUpgradeEffect('FASTER_PET_LEVELING');
                break;
            case 'luck':
                multiplier += this.getUpgradeEffect('ORE_RARITY_LUCK');
                break;
            case 'backpack_capacity':
                multiplier += this.getUpgradeEffect('BACKPACK_CAPACITY_MULTIPLIER');
                break;
        }
        
        return multiplier;
    }
    
    /**
     * Get zone unlock cost reduction
     */
    getZoneUnlockCostReduction() {
        return this.getUpgradeEffect('ZONE_UNLOCK_SPEED');
    }
    
    toJSON() {
        return {
            rebirthCount: this.rebirthCount,
            rebirthPoints: this.rebirthPoints,
            permanentUpgrades: this.permanentUpgrades
        };
    }
    
    fromJSON(data) {
        this.rebirthCount = data.rebirthCount || 0;
        this.rebirthPoints = data.rebirthPoints || 0;
        this.permanentUpgrades = data.permanentUpgrades || {};
        
        // Initialize missing upgrades
        for (const upgradeId in PERMANENT_UPGRADES) {
            if (this.permanentUpgrades[upgradeId] === undefined) {
                this.permanentUpgrades[upgradeId] = 0;
            }
        }
    }
}
