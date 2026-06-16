/**
 * Player class - handles player movement, mining, and stats
 */
export class Player {
    constructor(x, y, inventory) {
        this.x = x;
        this.y = y;
        this.width = 32;
        this.height = 32;
        this.speed = 200;
        this.inventory = inventory;
        
        // Mining stats
        this.miningPower = 1;
        this.miningSpeed = 1;
        this.criticalChance = 0.05;
        
        // Economy
        this.money = 0;
        
        // Pickaxe tier
        this.pickaxeTier = 0;
        this.pickaxeNames = ['Wooden', 'Stone', 'Iron', 'Steel', 'Gold', 'Diamond', 'Mythic'];
    }
    
    update(dt, keys, world) {
        let dx = 0;
        let dy = 0;
        
        // WASD movement
        if (keys['w'] || keys['arrowup']) dy -= 1;
        if (keys['s'] || keys['arrowdown']) dy += 1;
        if (keys['a'] || keys['arrowleft']) dx -= 1;
        if (keys['d'] || keys['arrowright']) dx += 1;
        
        // Normalize diagonal movement
        if (dx !== 0 && dy !== 0) {
            dx *= 0.707;
            dy *= 0.707;
        }
        
        // Calculate new position
        const newX = this.x + dx * this.speed * dt;
        const newY = this.y + dy * this.speed * dt;
        
        // Check collisions
        if (!this.checkCollision(newX, this.y, world)) {
            this.x = newX;
        }
        if (!this.checkCollision(this.x, newY, world)) {
            this.y = newY;
        }
        
        // Keep player in world bounds
        this.x = Math.max(0, Math.min(this.x, world.width - this.width));
        this.y = Math.max(0, Math.min(this.y, world.height - this.height));
    }
    
    checkCollision(x, y, world) {
        // Check collision with world boundaries
        if (x < 0 || x + this.width > world.width ||
            y < 0 || y + this.height > world.height) {
            return true;
        }
        
        // Check collision with ores
        for (const ore of world.ores) {
            if (this.rectIntersect(x, y, this.width, this.height, 
                                   ore.x, ore.y, ore.width, ore.height)) {
                return true;
            }
        }
        
        return false;
    }
    
    rectIntersect(x1, y1, w1, h1, x2, y2, w2, h2) {
        return x2 < x1 + w1 && x2 + w2 > x1 && y2 < y1 + h1 && y2 + h2 > y1;
    }
    
    canMine(ore) {
        // Check if player is close enough to ore
        const distance = Math.hypot(
            (this.x + this.width / 2) - (ore.x + ore.width / 2),
            (this.y + this.height / 2) - (ore.y + ore.height / 2)
        );
        return distance < 100; // Mining range
    }
    
    mine(ore) {
        // Check if player can mine this ore
        if (this.miningPower < ore.requiredPower) {
            return false;
        }
        
        // Critical hit chance
        const isCritical = Math.random() < this.criticalChance;
        const multiplier = isCritical ? 2 : 1;
        
        // Return mined value
        return {
            type: ore.type,
            value: ore.value * multiplier,
            isCritical: isCritical
        };
    }
    
    upgradePickaxe() {
        if (this.pickaxeTier < this.pickaxeNames.length - 1) {
            this.pickaxeTier++;
            this.miningPower += 2;
            this.miningSpeed += 0.5;
            this.criticalChance += 0.02;
            return true;
        }
        return false;
    }
    
    render(ctx) {
        // Draw player
        ctx.fillStyle = '#3498db';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Draw pickaxe indicator
        ctx.fillStyle = '#f39c12';
        ctx.fillRect(this.x + 8, this.y - 10, 16, 8);
        
        // Draw player name/pickaxe tier
        ctx.fillStyle = '#ffffff';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(this.pickaxeNames[this.pickaxeTier], this.x + this.width / 2, this.y - 15);
    }
    
    toJSON() {
        return {
            x: this.x,
            y: this.y,
            money: this.money,
            miningPower: this.miningPower,
            miningSpeed: this.miningSpeed,
            criticalChance: this.criticalChance,
            pickaxeTier: this.pickaxeTier
        };
    }
    
    fromJSON(data) {
        this.x = data.x;
        this.y = data.y;
        this.money = data.money;
        this.miningPower = data.miningPower;
        this.miningSpeed = data.miningSpeed;
        this.criticalChance = data.criticalChance;
        this.pickaxeTier = data.pickaxeTier;
    }
}
