import { Zone, ZONE_DEFINITIONS } from './zone.js';
import { NPCS } from './questSystem.js';

/**
 * World class - manages the game world, ores, and zones
 */
export class World {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.ores = [];
        this.maxOres = 50;
        this.npcs = [];
        
        // Define sell zone
        this.sellZone = {
            x: 50,
            y: 50,
            width: 150,
            height: 100,
            color: '#27ae60'
        };
        
        // Initialize zones
        this.zones = new Map();
        this.currentZone = null;
        this.initializeZones();
        
        // Initialize NPCs
        this.initializeNPCs();
        
        // Spawn initial ores
        this.spawnOres();
    }
    
    initializeZones() {
        for (const def of ZONE_DEFINITIONS) {
            const zone = new Zone(def);
            zone.unlocked = def.id === 'surface'; // Surface is unlocked by default
            this.zones.set(def.id, zone);
        }
        this.currentZone = this.zones.get('surface');
    }
    
    resetZones() {
        // Reset all zones except surface
        for (const [zoneId, zone] of this.zones) {
            if (zoneId !== 'surface') {
                zone.unlocked = false;
            }
        }
        this.currentZone = this.zones.get('surface');
        // Clear ores
        this.ores = [];
        this.spawnOres();
    }
    
    initializeNPCs() {
        for (const npcId in NPCS) {
            const npc = NPCS[npcId];
            this.npcs.push({
                ...npc,
                width: 40,
                height: 40
            });
        }
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
        
        // Get random ore from current zone's ore table using new system
        const ore = this.currentZone.getRandomOre(x, y);
        ore.rockStyle = this.currentZone.rockStyle;
        
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
        // Draw ground with current zone's background color
        ctx.fillStyle = this.currentZone.backgroundColor;
        ctx.fillRect(0, 0, this.width, this.height);
        
        // Draw grid pattern with current zone's grid color
        ctx.strokeStyle = this.currentZone.gridColor;
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
        
        // Draw portal
        this.drawPortal(ctx);
        
        // Draw ores
        for (const ore of this.ores) {
            this.drawOre(ctx, ore);
        }
        
        // Draw NPCs
        this.drawNPCs(ctx);
    }
    
    drawOre(ctx, ore) {
        const style = ore.rockStyle || 'square';
        
        // Draw glow effect for rare ores
        if (ore.glowColor && ore.glowIntensity > 0) {
            ctx.shadowColor = ore.glowColor;
            ctx.shadowBlur = ore.glowIntensity;
        }
        
        // Draw ore body based on rock style
        ctx.fillStyle = ore.color;
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        
        if (style === 'circle') {
            ctx.beginPath();
            ctx.arc(ore.x + ore.width / 2, ore.y + ore.height / 2, ore.width / 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
        } else if (style === 'diamond') {
            ctx.beginPath();
            ctx.moveTo(ore.x + ore.width / 2, ore.y);
            ctx.lineTo(ore.x + ore.width, ore.y + ore.height / 2);
            ctx.lineTo(ore.x + ore.width / 2, ore.y + ore.height);
            ctx.lineTo(ore.x, ore.y + ore.height / 2);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        } else if (style === 'hexagon') {
            const cx = ore.x + ore.width / 2;
            const cy = ore.y + ore.height / 2;
            const size = ore.width / 2;
            ctx.beginPath();
            for (let i = 0; i < 6; i++) {
                const angle = (Math.PI / 3) * i - Math.PI / 6;
                const px = cx + size * Math.cos(angle);
                const py = cy + size * Math.sin(angle);
                if (i === 0) ctx.moveTo(px, py);
                else ctx.lineTo(px, py);
            }
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        } else if (style === 'star') {
            const cx = ore.x + ore.width / 2;
            const cy = ore.y + ore.height / 2;
            const outerRadius = ore.width / 2;
            const innerRadius = ore.width / 4;
            ctx.beginPath();
            for (let i = 0; i < 10; i++) {
                const angle = (Math.PI / 5) * i - Math.PI / 2;
                const radius = i % 2 === 0 ? outerRadius : innerRadius;
                const px = cx + radius * Math.cos(angle);
                const py = cy + radius * Math.sin(angle);
                if (i === 0) ctx.moveTo(px, py);
                else ctx.lineTo(px, py);
            }
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        } else if (style === 'octagon') {
            const cx = ore.x + ore.width / 2;
            const cy = ore.y + ore.height / 2;
            const size = ore.width / 2;
            ctx.beginPath();
            for (let i = 0; i < 8; i++) {
                const angle = (Math.PI / 4) * i - Math.PI / 8;
                const px = cx + size * Math.cos(angle);
                const py = cy + size * Math.sin(angle);
                if (i === 0) ctx.moveTo(px, py);
                else ctx.lineTo(px, py);
            }
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        } else if (style === 'spiral') {
            const cx = ore.x + ore.width / 2;
            const cy = ore.y + ore.height / 2;
            ctx.beginPath();
            for (let i = 0; i < 100; i++) {
                const angle = i * 0.2;
                const radius = i * 0.3;
                const px = cx + radius * Math.cos(angle);
                const py = cy + radius * Math.sin(angle);
                if (i === 0) ctx.moveTo(px, py);
                else ctx.lineTo(px, py);
            }
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(cx, cy, ore.width / 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
        } else if (style === 'infinity') {
            const cx = ore.x + ore.width / 2;
            const cy = ore.y + ore.height / 2;
            const scale = ore.width / 40;
            ctx.beginPath();
            ctx.moveTo(cx - 20 * scale, cy);
            ctx.bezierCurveTo(cx - 20 * scale, cy - 15 * scale, cx - 10 * scale, cy - 15 * scale, cx, cy);
            ctx.bezierCurveTo(cx + 10 * scale, cy + 15 * scale, cx + 20 * scale, cy + 15 * scale, cx + 20 * scale, cy);
            ctx.bezierCurveTo(cx + 20 * scale, cy - 15 * scale, cx + 10 * scale, cy - 15 * scale, cx, cy);
            ctx.bezierCurveTo(cx - 10 * scale, cy + 15 * scale, cx - 20 * scale, cy + 15 * scale, cx - 20 * scale, cy);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(cx, cy, ore.width / 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
        } else {
            // Default square
            ctx.fillRect(ore.x, ore.y, ore.width, ore.height);
            ctx.strokeRect(ore.x, ore.y, ore.width, ore.height);
        }
        
        // Reset shadow
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        
        // Draw ore name with rarity color
        ctx.fillStyle = ore.glowColor || '#ffffff';
        ctx.font = ore.glowIntensity > 5 ? 'bold 11px Arial' : '10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(ore.type, ore.x + ore.width / 2, ore.y + ore.height / 2 + 4);
        
        // Draw rarity indicator for rare ores
        if (ore.rarity && ore.rarity !== 'Common') {
            ctx.fillStyle = ore.glowColor;
            ctx.font = '8px Arial';
            ctx.fillText(ore.rarity, ore.x + ore.width / 2, ore.y + ore.height / 2 + 16);
        }
        
        // Draw health bar
        const healthPercent = ore.health / ore.maxHealth;
        ctx.fillStyle = '#e74c3c';
        ctx.fillRect(ore.x, ore.y - 8, ore.width, 4);
        ctx.fillStyle = '#27ae60';
        ctx.fillRect(ore.x, ore.y - 8, ore.width * healthPercent, 4);
    }
    
    drawPortal(ctx) {
        const portal = this.currentZone.portalPosition;
        const targetZone = this.zones.get(this.currentZone.portalTarget);
        
        if (!targetZone) return;
        
        // Draw portal
        ctx.fillStyle = targetZone.unlocked ? '#9b59b6' : '#7f8c8d';
        ctx.beginPath();
        ctx.arc(portal.x, portal.y, 40, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw portal glow
        ctx.strokeStyle = targetZone.unlocked ? '#8e44ad' : '#95a5a6';
        ctx.lineWidth = 3;
        ctx.stroke();
        
        // Draw portal text
        ctx.fillStyle = '#ffffff';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(targetZone.unlocked ? `To ${targetZone.name}` : 'Locked', portal.x, portal.y + 5);
        
        if (!targetZone.unlocked) {
            ctx.font = '10px Arial';
            ctx.fillText(targetZone.unlockMessage, portal.x, portal.y + 20);
        }
    }
    
    drawNPCs(ctx) {
        for (const npc of this.npcs) {
            // Draw NPC body
            ctx.fillStyle = npc.color;
            ctx.fillRect(npc.position.x, npc.position.y, npc.width, npc.height);
            
            // Draw NPC border
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.strokeRect(npc.position.x, npc.position.y, npc.width, npc.height);
            
            // Draw NPC name
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(npc.name, npc.position.x + npc.width / 2, npc.position.y - 10);
        }
    }
    
    getNPCAt(x, y) {
        for (const npc of this.npcs) {
            if (x >= npc.position.x && x <= npc.position.x + npc.width &&
                y >= npc.position.y && y <= npc.position.y + npc.height) {
                return npc;
            }
        }
        return null;
    }
    
    checkPortalCollision(player) {
        const portal = this.currentZone.portalPosition;
        const dx = (player.x + player.width / 2) - portal.x;
        const dy = (player.y + player.height / 2) - portal.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 50) {
            return this.currentZone.portalTarget;
        }
        return null;
    }
    
    switchZone(zoneId, player) {
        const targetZone = this.zones.get(zoneId);
        if (!targetZone) return false;
        
        if (!targetZone.unlocked) {
            return false;
        }
        
        this.currentZone = targetZone;
        this.ores = []; // Clear ores
        this.spawnOres(); // Spawn new ores for this zone
        
        // Reset player position
        player.x = targetZone.startPosition.x;
        player.y = targetZone.startPosition.y;
        
        return true;
    }
    
    unlockZone(zoneId, player) {
        const zone = this.zones.get(zoneId);
        if (!zone) return false;
        
        if (zone.unlocked) return true;
        
        if (zone.canUnlock(player)) {
            zone.unlocked = true;
            return true;
        }
        
        return false;
    }
    
    getCurrentZone() {
        return this.currentZone;
    }
    
    getZone(zoneId) {
        return this.zones.get(zoneId);
    }
    
    toJSON() {
        const zoneData = {};
        for (const [id, zone] of this.zones) {
            zoneData[id] = zone.toJSON();
        }
        
        return {
            ores: this.ores,
            currentZoneId: this.currentZone.id,
            zones: zoneData
        };
    }
    
    fromJSON(data) {
        this.ores = data.ores;
        
        if (data.currentZoneId) {
            this.currentZone = this.zones.get(data.currentZoneId);
        }
        
        if (data.zones) {
            for (const [id, zoneData] of Object.entries(data.zones)) {
                const zone = this.zones.get(id);
                if (zone) {
                    zone.fromJSON(zoneData);
                }
            }
        }
    }
}
