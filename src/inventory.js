import { getSlotCost, calculateUsedSlots, canAddItem, getBackpack, getNextBackpack } from './inventorySystem.js';

/**
 * Inventory class - manages player inventory and items
 */
export class Inventory {
    constructor(petManager, rebirthManager) {
        this.items = {};
        this.backpackId = 'small';
        this.backpack = getBackpack(this.backpackId);
        this.petManager = petManager;
        this.rebirthManager = rebirthManager;
    }
    
    add(type, value, rarity = 'Common') {
        if (!this.canAdd(rarity)) {
            return false; // Backpack full
        }
        
        if (!this.items[type]) {
            this.items[type] = { count: 0, value: value, rarity: rarity };
        }
        this.items[type].count++;
        // Update to highest rarity found
        const rarityOrder = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary', 'Mythic'];
        const currentRarityIndex = rarityOrder.indexOf(this.items[type].rarity);
        const newRarityIndex = rarityOrder.indexOf(rarity);
        if (newRarityIndex > currentRarityIndex) {
            this.items[type].rarity = rarity;
        }
        return true;
    }
    
    remove(type, amount = 1) {
        if (this.items[type] && this.items[type].count >= amount) {
            this.items[type].count -= amount;
            if (this.items[type].count <= 0) {
                delete this.items[type];
            }
            return true;
        }
        return false;
    }
    
    sellAll() {
        let total = 0;
        
        // Apply pet bonus to ore value
        const oreValueMultiplier = this.petManager ? this.petManager.getOreValueMultiplier() : 1;
        
        // Apply rebirth bonus to ore value
        const rebirthOreMultiplier = this.rebirthManager ? this.rebirthManager.getTotalMultiplier('ore_value') : 1;
        
        for (const type in this.items) {
            total += this.items[type].count * this.items[type].value * oreValueMultiplier * rebirthOreMultiplier;
        }
        this.items = {};
        return total;
    }
    
    sellType(type) {
        if (this.items[type]) {
            const total = this.items[type].count * this.items[type].value;
            delete this.items[type];
            return total;
        }
        return 0;
    }
    
    getCount(type) {
        return this.items[type] ? this.items[type].count : 0;
    }
    
    getCapacity() {
        const baseCapacity = this.backpack.capacity;
        
        // Apply pet bonus to backpack capacity
        const capacityBonus = this.petManager ? this.petManager.getBackpackCapacityBonus() : 0;
        
        return Math.floor(baseCapacity * (1 + capacityBonus));
    }
    
    getUsedSlots() {
        return calculateUsedSlots(this.items);
    }
    
    canAdd(rarity) {
        return canAddItem(this.items, this.getCapacity(), rarity);
    }
    
    isFull() {
        return this.getUsedSlots() >= this.getCapacity();
    }
    
    getCapacityPercent() {
        return (this.getUsedSlots() / this.getCapacity()) * 100;
    }
    
    upgradeBackpack() {
        const nextBackpack = getNextBackpack(this.backpackId);
        if (!nextBackpack) {
            return false; // Already at max tier
        }
        this.backpackId = nextBackpack.id;
        this.backpack = nextBackpack;
        return true;
    }
    
    clear() {
        this.items = {};
    }
    
    getBackpack(backpackId) {
        return getBackpack(backpackId);
    }
    
    render() {
        const usedSlots = this.getUsedSlots();
        const capacity = this.backpack.capacity;
        const capacityPercent = this.getCapacityPercent();
        
        // Determine capacity bar color
        let capacityColor = '#27ae60';
        if (capacityPercent >= 90) {
            capacityColor = '#e74c3c';
        } else if (capacityPercent >= 70) {
            capacityColor = '#f39c12';
        }
        
        let html = '<h3>Inventory</h3>';
        html += `<p>Backpack: ${this.backpack.name}</p>`;
        html += `<p>Slots: ${usedSlots}/${capacity}</p>`;
        
        // Capacity bar
        html += `<div style="width: 100%; height: 20px; background: #34495e; border-radius: 10px; margin: 10px 0; overflow: hidden;">`;
        html += `<div style="width: ${capacityPercent}%; height: 100%; background: ${capacityColor}; transition: width 0.3s;"></div>`;
        html += '</div>';
        
        if (Object.keys(this.items).length === 0) {
            html += '<p>Empty</p>';
        } else {
            html += '<ul>';
            // Sort by rarity then value
            const sortedItems = Object.entries(this.items).sort((a, b) => {
                const rarityOrder = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary', 'Mythic'];
                const rarityA = rarityOrder.indexOf(a[1].rarity);
                const rarityB = rarityOrder.indexOf(b[1].rarity);
                if (rarityA !== rarityB) return rarityB - rarityA;
                return b[1].value - a[1].value;
            });
            
            for (const [type, item] of sortedItems) {
                const rarityColor = this.getRarityColor(item.rarity);
                const slotCost = getSlotCost(item.rarity);
                const totalSlots = item.count * slotCost;
                const rarityStyle = item.rarity !== 'Common' ? `color: ${rarityColor}; font-weight: bold;` : '';
                html += `<li style="${rarityStyle}">${type}: ${item.count} ($${item.value} each) [${item.rarity}] (${totalSlots} slots)</li>`;
            }
            html += '</ul>';
        }
        
        return html;
    }
    
    getRarityColor(rarity) {
        const colors = {
            'Common': '#95a5a6',
            'Uncommon': '#27ae60',
            'Rare': '#3498db',
            'Epic': '#9b59b6',
            'Legendary': '#f39c12',
            'Mythic': '#e74c3c'
        };
        return colors[rarity] || '#ffffff';
    }
    
    toJSON() {
        return {
            items: this.items,
            backpackId: this.backpackId
        };
    }
    
    fromJSON(data) {
        this.items = data.items || {};
        this.backpackId = data.backpackId || 'small';
        this.backpack = getBackpack(this.backpackId);
    }
}
