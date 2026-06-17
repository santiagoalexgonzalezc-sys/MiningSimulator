import { getPickaxe, getNextPickaxe } from './pickaxeData.js';

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
        
        // Economy
        this.money = 0;
        
        // Pickaxe system
        this.pickaxeId = 'wooden';
        
        // Level system
        this.level = 1;
        this.xp = 0;
        this.xpToNextLevel = 100;
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
    
    getPickaxe() {
        return getPickaxe(this.pickaxeId);
    }
    
    mine(ore) {
        const pickaxe = this.getPickaxe();
        
        // Check if player can mine this ore
        if (pickaxe.miningPower < ore.requiredPower) {
            return false;
        }
        
        // Critical hit chance
        const isCritical = Math.random() < pickaxe.critChance;
        const multiplier = isCritical ? pickaxe.critMultiplier : 1;
        
        // Add XP based on ore value
        this.addXP(Math.floor(ore.value / 10));
        
        // Return mined value
        return {
            type: ore.type,
            value: ore.value * multiplier,
            isCritical: isCritical,
            damage: pickaxe.miningPower * (isCritical ? pickaxe.critMultiplier : 1)
        };
    }
    
    addXP(amount) {
        this.xp += amount;
        
        // Check for level up
        while (this.xp >= this.xpToNextLevel) {
            this.xp -= this.xpToNextLevel;
            this.level++;
            this.xpToNextLevel = Math.floor(this.xpToNextLevel * 1.5);
        }
    }
    
    upgradePickaxe() {
        const nextPickaxe = getNextPickaxe(this.pickaxeId);
        if (!nextPickaxe) {
            return false; // Already at max tier
        }
        
        if (this.money >= nextPickaxe.cost) {
            this.money -= nextPickaxe.cost;
            this.pickaxeId = nextPickaxe.id;
            return true;
        }
        
        return false;
    }
    
    render(ctx) {
        const pickaxe = this.getPickaxe();
        
        // Draw player
        ctx.fillStyle = '#3498db';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Draw pickaxe indicator with pickaxe color
        ctx.fillStyle = pickaxe.color;
        ctx.fillRect(this.x + 8, this.y - 10, 16, 8);
        
        // Draw player name/pickaxe
        ctx.fillStyle = '#ffffff';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(pickaxe.name, this.x + this.width / 2, this.y - 15);
    }
    
    toJSON() {
        return {
            x: this.x,
            y: this.y,
            money: this.money,
            pickaxeId: this.pickaxeId,
            level: this.level,
            xp: this.xp,
            xpToNextLevel: this.xpToNextLevel
        };
    }
    
    fromJSON(data) {
        this.x = data.x;
        this.y = data.y;
        this.money = data.money;
        this.pickaxeId = data.pickaxeId || 'wooden';
        this.level = data.level || 1;
        this.xp = data.xp || 0;
        this.xpToNextLevel = data.xpToNextLevel || 100;
    }
}
