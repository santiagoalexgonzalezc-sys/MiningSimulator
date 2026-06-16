/**
 * Inventory class - manages player inventory and items
 */
export class Inventory {
    constructor() {
        this.items = {};
        this.capacity = 100;
        this.used = 0;
    }
    
    add(type, value, rarity = 'Common') {
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
        this.used++;
    }
    
    remove(type, amount = 1) {
        if (this.items[type] && this.items[type].count >= amount) {
            this.items[type].count -= amount;
            this.used -= amount;
            if (this.items[type].count <= 0) {
                delete this.items[type];
            }
            return true;
        }
        return false;
    }
    
    sellAll() {
        let total = 0;
        for (const type in this.items) {
            total += this.items[type].count * this.items[type].value;
        }
        this.items = {};
        this.used = 0;
        return total;
    }
    
    sellType(type) {
        if (this.items[type]) {
            const total = this.items[type].count * this.items[type].value;
            this.used -= this.items[type].count;
            delete this.items[type];
            return total;
        }
        return 0;
    }
    
    getCount(type) {
        return this.items[type] ? this.items[type].count : 0;
    }
    
    isFull() {
        return this.used >= this.capacity;
    }
    
    render() {
        let html = '<h3>Inventory</h3>';
        html += `<p>Used: ${this.used}/${this.capacity}</p>`;
        
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
                const rarityStyle = item.rarity !== 'Common' ? `color: ${rarityColor}; font-weight: bold;` : '';
                html += `<li style="${rarityStyle}">${type}: ${item.count} ($${item.value} each) [${item.rarity}]</li>`;
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
            capacity: this.capacity,
            used: this.used
        };
    }
    
    fromJSON(data) {
        this.items = data.items;
        this.capacity = data.capacity;
        this.used = data.used;
    }
}
