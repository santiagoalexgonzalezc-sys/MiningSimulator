/**
 * Inventory class - manages player inventory and items
 */
export class Inventory {
    constructor() {
        this.items = {};
        this.capacity = 100;
        this.used = 0;
    }
    
    add(type, value) {
        if (!this.items[type]) {
            this.items[type] = { count: 0, value: value };
        }
        this.items[type].count++;
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
            for (const type in this.items) {
                const item = this.items[type];
                html += `<li>${type}: ${item.count} ($${item.value} each)</li>`;
            }
            html += '</ul>';
        }
        
        return html;
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
