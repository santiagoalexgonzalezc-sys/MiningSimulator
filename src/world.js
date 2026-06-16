/**
 * World class - manages the game world, ores, and zones
 */
export class World {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.ores = [];
        this.maxOres = 50;
        
        // Define sell zone
        this.sellZone = {
            x: 50,
            y: 50,
            width: 150,
            height: 100,
            color: '#27ae60'
        };
        
        // Ore types
        this.oreTypes = [
            { name: 'Coal', color: '#2c3e50', value: 10, requiredPower: 1, health: 3 },
            { name: 'Iron', color: '#95a5a6', value: 25, requiredPower: 2, health: 5 },
            { name: 'Gold', color: '#f1c40f', value: 50, requiredPower: 3, health: 8 },
            { name: 'Diamond', color: '#3498db', value: 100, requiredPower: 5, health: 12 }
        ];
        
        // Spawn initial ores
        this.spawnOres();
    }
    
    spawnOres() {
        while (this.ores.length < this.maxOres) {
            this.spawnRandomOre();
        }
    }
    
    spawnRandomOre() {
        // Random position (avoid sell zone)
        let x, y;
        let attempts = 0;
        
        do {
            x = Math.random() * (this.width - 100) + 50;
            y = Math.random() * (this.height - 100) + 50;
            attempts++;
        } while (this.isInSellZone(x, y) && attempts < 10);
        
        // Random ore type based on rarity
        const rand = Math.random();
        let oreType;
        if (rand < 0.5) oreType = this.oreTypes[0]; // Coal
        else if (rand < 0.8) oreType = this.oreTypes[1]; // Iron
        else if (rand < 0.95) oreType = this.oreTypes[2]; // Gold
        else oreType = this.oreTypes[3]; // Diamond
        
        const ore = {
            x: x,
            y: y,
            width: 40,
            height: 40,
            type: oreType.name,
            color: oreType.color,
            value: oreType.value,
            requiredPower: oreType.requiredPower,
            health: oreType.health,
            maxHealth: oreType.health
        };
        
        this.ores.push(ore);
    }
    
    isInSellZone(x, y) {
        return x > this.sellZone.x && x < this.sellZone.x + this.sellZone.width &&
               y > this.sellZone.y && y < this.sellZone.y + this.sellZone.height;
    }
    
    getOreAt(x, y) {
        for (const ore of this.ores) {
            if (x >= ore.x && x <= ore.x + ore.width &&
                y >= ore.y && y <= ore.y + ore.height) {
                return ore;
            }
        }
        return null;
    }
    
    removeOre(ore) {
        const index = this.ores.indexOf(ore);
        if (index > -1) {
            this.ores.splice(index, 1);
        }
    }
    
    update(dt) {
        // Respawn ores over time
        if (this.ores.length < this.maxOres && Math.random() < 0.01) {
            this.spawnRandomOre();
        }
    }
    
    render(ctx) {
        // Draw ground
        ctx.fillStyle = '#8b7355';
        ctx.fillRect(0, 0, this.width, this.height);
        
        // Draw grid pattern
        ctx.strokeStyle = '#7a6548';
        ctx.lineWidth = 1;
        for (let x = 0; x < this.width; x += 100) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, this.height);
            ctx.stroke();
        }
        for (let y = 0; y < this.height; y += 100) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(this.width, y);
            ctx.stroke();
        }
        
        // Draw sell zone
        ctx.fillStyle = this.sellZone.color;
        ctx.fillRect(this.sellZone.x, this.sellZone.y, this.sellZone.width, this.sellZone.height);
        ctx.fillStyle = '#ffffff';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('SELL ZONE', this.sellZone.x + this.sellZone.width / 2, this.sellZone.y + this.sellZone.height / 2);
        
        // Draw ores
        for (const ore of this.ores) {
            this.drawOre(ctx, ore);
        }
    }
    
    drawOre(ctx, ore) {
        // Draw ore body
        ctx.fillStyle = ore.color;
        ctx.fillRect(ore.x, ore.y, ore.width, ore.height);
        
        // Draw ore outline
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.strokeRect(ore.x, ore.y, ore.width, ore.height);
        
        // Draw ore name
        ctx.fillStyle = '#ffffff';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(ore.type, ore.x + ore.width / 2, ore.y + ore.height / 2 + 4);
        
        // Draw health bar
        const healthPercent = ore.health / ore.maxHealth;
        ctx.fillStyle = '#e74c3c';
        ctx.fillRect(ore.x, ore.y - 8, ore.width, 4);
        ctx.fillStyle = '#27ae60';
        ctx.fillRect(ore.x, ore.y - 8, ore.width * healthPercent, 4);
    }
    
    toJSON() {
        return {
            ores: this.ores
        };
    }
    
    fromJSON(data) {
        this.ores = data.ores;
    }
}
