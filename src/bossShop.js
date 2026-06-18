/**
 * Boss Shop - allows players to spend boss coins on special items
 */

// Boss shop items
export const BOSS_SHOP_ITEMS = {
    // Pickaxe upgrades
    BOSS_PICKAXE_UPGRADE: {
        id: 'boss_pickaxe_upgrade',
        name: 'Boss Pickaxe Upgrade',
        description: 'Permanently increase mining power by 10%',
        cost: 100,
        type: 'upgrade',
        effect: { type: 'mining_power', value: 0.1 }
    },
    BOSS_LUCK_UPGRADE: {
        id: 'boss_luck_upgrade',
        name: 'Boss Luck Upgrade',
        description: 'Permanently increase critical chance by 5%',
        cost: 150,
        type: 'upgrade',
        effect: { type: 'crit_chance', value: 0.05 }
    },
    BOSS_SPEED_UPGRADE: {
        id: 'boss_speed_upgrade',
        name: 'Boss Speed Upgrade',
        description: 'Permanently increase mining speed by 15%',
        cost: 200,
        type: 'upgrade',
        effect: { type: 'mining_speed', value: 0.15 }
    },
    
    // Special materials
    VOID_SHARD_PACK: {
        id: 'void_shard_pack',
        name: 'Void Shard Pack',
        description: 'Receive 5 Void Shards',
        cost: 50,
        type: 'material',
        material: 'void_shard',
        amount: 5
    },
    CELESTIAL_FRAGMENT_PACK: {
        id: 'celestial_fragment_pack',
        name: 'Celestial Fragment Pack',
        description: 'Receive 3 Celestial Fragments',
        cost: 100,
        type: 'material',
        material: 'celestial_fragment',
        amount: 3
    },
    DIVINE_ESSENCE_PACK: {
        id: 'divine_essence_pack',
        name: 'Divine Essence Pack',
        description: 'Receive 2 Divine Essences',
        cost: 200,
        type: 'material',
        material: 'divine_essence',
        amount: 2
    },
    
    // Special eggs
    LEGENDARY_EGG: {
        id: 'legendary_egg',
        name: 'Legendary Egg',
        description: 'Guaranteed Legendary or better pet',
        cost: 300,
        type: 'egg',
        rarity: 'legendary'
    },
    MYTHIC_EGG: {
        id: 'mythic_egg',
        name: 'Mythic Egg',
        description: 'Guaranteed Mythic or better pet',
        cost: 500,
        type: 'egg',
        rarity: 'mythic'
    },
    
    // Special items
    BOSS_KEY: {
        id: 'boss_key',
        name: 'Boss Key',
        description: 'Instantly respawn any defeated boss',
        cost: 250,
        type: 'consumable',
        effect: 'respawn_boss'
    },
    LUCKY_CHARM: {
        id: 'lucky_charm',
        name: 'Lucky Charm',
        description: 'Double boss coin rewards for 1 hour',
        cost: 150,
        type: 'consumable',
        effect: 'double_coins',
        duration: 3600000 // 1 hour in ms
    }
};

/**
 * BossShop class
 */
export class BossShop {
    constructor(bossManager) {
        this.bossManager = bossManager;
        this.isOpen = false;
        this.purchasedUpgrades = {};
        this.activeEffects = {};
    }
    
    /**
     * Open the boss shop
     */
    open() {
        this.isOpen = true;
        this.render();
    }
    
    /**
     * Close the boss shop
     */
    close() {
        this.isOpen = false;
        const modal = document.getElementById('bossShopModal');
        if (modal) {
            modal.remove();
        }
    }
    
    /**
     * Render the boss shop UI
     */
    render() {
        // Remove existing modal
        const existingModal = document.getElementById('bossShopModal');
        if (existingModal) {
            existingModal.remove();
        }
        
        // Create modal
        const modal = document.createElement('div');
        modal.id = 'bossShopModal';
        modal.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(44, 62, 80, 0.98);
            color: white;
            padding: 30px;
            border-radius: 15px;
            z-index: 2000;
            min-width: 600px;
            max-width: 800px;
            max-height: 80vh;
            overflow-y: auto;
            border: 3px solid #e74c3c;
            box-shadow: 0 0 30px rgba(231, 76, 60, 0.5);
        `;
        
        // Header
        const header = document.createElement('div');
        header.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 2px solid #e74c3c;
        `;
        
        const title = document.createElement('h2');
        title.textContent = 'Boss Shop';
        title.style.margin = '0';
        title.style.color = '#e74c3c';
        
        const bossCoinsDisplay = document.createElement('div');
        bossCoinsDisplay.textContent = `Boss Coins: ${this.bossManager.getBossCoins()}`;
        bossCoinsDisplay.style.cssText = `
            font-size: 18px;
            font-weight: bold;
            color: #f39c12;
        `;
        
        const closeButton = document.createElement('button');
        closeButton.textContent = 'X';
        closeButton.style.cssText = `
            background: #e74c3c;
            color: white;
            border: none;
            padding: 8px 15px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            font-weight: bold;
        `;
        closeButton.onclick = () => this.close();
        
        header.appendChild(title);
        header.appendChild(bossCoinsDisplay);
        header.appendChild(closeButton);
        
        // Items grid
        const itemsGrid = document.createElement('div');
        itemsGrid.style.cssText = `
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 15px;
        `;
        
        // Add items
        for (const itemId in BOSS_SHOP_ITEMS) {
            const item = BOSS_SHOP_ITEMS[itemId];
            const itemCard = this.createItemCard(item);
            itemsGrid.appendChild(itemCard);
        }
        
        modal.appendChild(header);
        modal.appendChild(itemsGrid);
        
        document.body.appendChild(modal);
    }
    
    /**
     * Create an item card
     */
    createItemCard(item) {
        const card = document.createElement('div');
        card.style.cssText = `
            background: rgba(52, 73, 94, 0.8);
            padding: 15px;
            border-radius: 10px;
            border: 2px solid #34495e;
            transition: all 0.3s;
            cursor: pointer;
        `;
        
        card.onmouseover = () => {
            card.style.borderColor = '#e74c3c';
            card.style.background = 'rgba(62, 83, 104, 0.9)';
        };
        
        card.onmouseout = () => {
            card.style.borderColor = '#34495e';
            card.style.background = 'rgba(52, 73, 94, 0.8)';
        };
        
        const itemName = document.createElement('div');
        itemName.textContent = item.name;
        itemName.style.cssText = `
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 8px;
            color: #ecf0f1;
        `;
        
        const itemDescription = document.createElement('div');
        itemDescription.textContent = item.description;
        itemDescription.style.cssText = `
            font-size: 13px;
            color: #bdc3c7;
            margin-bottom: 10px;
        `;
        
        const itemCost = document.createElement('div');
        itemCost.textContent = `${item.cost} Boss Coins`;
        itemCost.style.cssText = `
            font-size: 14px;
            font-weight: bold;
            color: #f39c12;
        `;
        
        const purchaseButton = document.createElement('button');
        purchaseButton.textContent = 'Purchase';
        purchaseButton.style.cssText = `
            width: 100%;
            padding: 8px;
            margin-top: 10px;
            background: #27ae60;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-weight: bold;
        `;
        
        purchaseButton.onclick = () => this.purchaseItem(item);
        
        // Check if already purchased (for upgrades)
        if (item.type === 'upgrade' && this.purchasedUpgrades[item.id]) {
            purchaseButton.textContent = 'Purchased';
            purchaseButton.disabled = true;
            purchaseButton.style.background = '#7f8c8d';
        }
        
        card.appendChild(itemName);
        card.appendChild(itemDescription);
        card.appendChild(itemCost);
        card.appendChild(purchaseButton);
        
        return card;
    }
    
    /**
     * Purchase an item
     */
    purchaseItem(item) {
        const bossCoins = this.bossManager.getBossCoins();
        
        if (bossCoins < item.cost) {
            alert('Not enough Boss Coins!');
            return;
        }
        
        // Spend coins
        this.bossManager.spendBossCoins(item.cost);
        
        // Apply item effect
        this.applyItemEffect(item);
        
        // Show purchase feedback
        this.showPurchaseFeedback(item.name);
        
        // Refresh shop
        this.render();
    }
    
    /**
     * Apply item effect
     */
    applyItemEffect(item) {
        switch (item.type) {
            case 'upgrade':
                this.purchasedUpgrades[item.id] = true;
                break;
            case 'material':
                // Add material to inventory (would need inventory integration)
                console.log(`Received ${item.amount} ${item.material}`);
                break;
            case 'egg':
                // Add egg to pet manager (would need pet manager integration)
                console.log(`Received ${item.rarity} egg`);
                break;
            case 'consumable':
                if (item.effect === 'respawn_boss') {
                    // Reset all boss respawn timers
                    this.bossManager.bossRespawns = {};
                } else if (item.effect === 'double_coins') {
                    this.activeEffects.doubleCoins = Date.now() + item.duration;
                }
                break;
        }
    }
    
    /**
     * Show purchase feedback
     */
    showPurchaseFeedback(itemName) {
        const feedback = document.createElement('div');
        feedback.textContent = `Purchased ${itemName}!`;
        feedback.style.cssText = `
            position: fixed;
            top: 20%;
            left: 50%;
            transform: translateX(-50%);
            background: #27ae60;
            color: white;
            padding: 15px 30px;
            border-radius: 10px;
            font-size: 16px;
            font-weight: bold;
            z-index: 2001;
            border: 2px solid #2ecc71;
        `;
        
        document.body.appendChild(feedback);
        setTimeout(() => {
            feedback.remove();
        }, 2000);
    }
    
    /**
     * Check if double coins effect is active
     */
    isDoubleCoinsActive() {
        if (!this.activeEffects.doubleCoins) return false;
        return Date.now() < this.activeEffects.doubleCoins;
    }
    
    /**
     * Get upgrade bonus
     */
    getUpgradeBonus(type) {
        let totalBonus = 0;
        
        for (const itemId in this.purchasedUpgrades) {
            const item = BOSS_SHOP_ITEMS[itemId];
            if (item && item.effect && item.effect.type === type) {
                totalBonus += item.effect.value;
            }
        }
        
        return totalBonus;
    }
    
    /**
     * Serialize boss shop state
     */
    toJSON() {
        return {
            purchasedUpgrades: this.purchasedUpgrades,
            activeEffects: this.activeEffects
        };
    }
    
    /**
     * Deserialize boss shop state
     */
    fromJSON(data) {
        this.purchasedUpgrades = data.purchasedUpgrades || {};
        this.activeEffects = data.activeEffects || {};
    }
}
