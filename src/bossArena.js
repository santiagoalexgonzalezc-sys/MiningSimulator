import { getArena, getArenaByZone, ARENAS } from './bossData.js';

/**
 * BossArena class - manages boss arena instances
 */
export class BossArena {
    constructor(arenaId) {
        const arenaData = getArena(arenaId);
        if (!arenaData) {
            throw new Error(`Arena ${arenaId} not found`);
        }
        
        this.id = arenaData.id;
        this.name = arenaData.name;
        this.zone = arenaData.zone;
        this.backgroundColor = arenaData.backgroundColor;
        this.gridColor = arenaData.gridColor;
        this.entrancePosition = arenaData.entrancePosition;
        this.bossSpawnPosition = arenaData.bossSpawnPosition;
        this.exitPosition = arenaData.exitPosition;
        
        // Arena state
        this.isActive = false;
        this.playerInArena = false;
        this.bossSpawned = false;
        
        // Dimensions
        this.width = 1600;
        this.height = 900;
    }
    
    /**
     * Activate arena
     */
    activate() {
        this.isActive = true;
        this.playerInArena = false;
        this.bossSpawned = false;
    }
    
    /**
     * Deactivate arena
     */
    deactivate() {
        this.isActive = false;
        this.playerInArena = false;
        this.bossSpawned = false;
    }
    
    /**
     * Check if player is in arena entrance area
     */
    isPlayerAtEntrance(player) {
        const dx = player.x - this.entrancePosition.x;
        const dy = player.y - this.entrancePosition.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < 50;
    }
    
    /**
     * Check if player is in arena exit area
     */
    isPlayerAtExit(player) {
        const dx = player.x - this.exitPosition.x;
        const dy = player.y - this.exitPosition.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < 50;
    }
    
    /**
     * Enter arena
     */
    enter() {
        this.playerInArena = true;
    }
    
    /**
     * Exit arena
     */
    exit() {
        this.playerInArena = false;
        this.bossSpawned = false;
    }
    
    /**
     * Mark boss as spawned
     */
    setBossSpawned() {
        this.bossSpawned = true;
    }
    
    /**
     * Render arena background
     */
    renderBackground(ctx, camera) {
        if (!this.isActive || !this.playerInArena) return;
        
        // Calculate visible area
        const startX = Math.floor(camera.x / 50) * 50;
        const startY = Math.floor(camera.y / 50) * 50;
        const endX = startX + camera.width + 50;
        const endY = startY + camera.height + 50;
        
        // Draw background
        ctx.fillStyle = this.backgroundColor;
        ctx.fillRect(camera.x, camera.y, camera.width, camera.height);
        
        // Draw grid
        ctx.strokeStyle = this.gridColor;
        ctx.lineWidth = 1;
        
        for (let x = startX; x < endX; x += 50) {
            ctx.beginPath();
            ctx.moveTo(x, startY);
            ctx.lineTo(x, endY);
            ctx.stroke();
        }
        
        for (let y = startY; y < endY; y += 50) {
            ctx.beginPath();
            ctx.moveTo(startX, y);
            ctx.lineTo(endX, y);
            ctx.stroke();
        }
        
        // Draw arena border
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 4;
        ctx.strokeRect(0, 0, this.width, this.height);
        
        // Draw entrance portal
        this.drawPortal(ctx, this.entrancePosition, '#00ff00', 'ENTRANCE');
        
        // Draw exit portal
        this.drawPortal(ctx, this.exitPosition, '#ff0000', 'EXIT');
        
        // Draw boss spawn area indicator
        if (!this.bossSpawned) {
            ctx.fillStyle = 'rgba(255, 255, 0, 0.3)';
            ctx.beginPath();
            ctx.arc(
                this.bossSpawnPosition.x,
                this.bossSpawnPosition.y,
                100,
                0,
                Math.PI * 2
            );
            ctx.fill();
            
            ctx.fillStyle = '#ffff00';
            ctx.font = 'bold 14px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('BOSS SPAWN', this.bossSpawnPosition.x, this.bossSpawnPosition.y);
        }
    }
    
    /**
     * Draw portal
     */
    drawPortal(ctx, position, color, label) {
        // Portal glow
        ctx.shadowColor = color;
        ctx.shadowBlur = 20;
        
        // Portal circle
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(position.x, position.y, 30, 0, Math.PI * 2);
        ctx.fill();
        
        // Portal inner
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(position.x, position.y, 20, 0, Math.PI * 2);
        ctx.fill();
        
        // Reset shadow
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        
        // Label
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(label, position.x, position.y + 50);
    }
    
    /**
     * Get arena info
     */
    getInfo() {
        return {
            id: this.id,
            name: this.name,
            zone: this.zone,
            isActive: this.isActive,
            playerInArena: this.playerInArena,
            bossSpawned: this.bossSpawned
        };
    }
    
    /**
     * Serialize arena state
     */
    toJSON() {
        return {
            id: this.id,
            isActive: this.isActive,
            playerInArena: this.playerInArena,
            bossSpawned: this.bossSpawned
        };
    }
    
    /**
     * Deserialize arena state
     */
    fromJSON(data) {
        if (data.id !== this.id) return;
        this.isActive = data.isActive || false;
        this.playerInArena = data.playerInArena || false;
        this.bossSpawned = data.bossSpawned || false;
    }
}

/**
 * ArenaManager class - manages all arenas
 */
export class ArenaManager {
    constructor() {
        this.arenas = {};
        this.activeArena = null;
        
        // Initialize all arenas
        for (const arenaId in ARENAS) {
            this.arenas[arenaId] = new BossArena(arenaId);
        }
    }
    
    /**
     * Get arena by ID
     */
    getArena(arenaId) {
        return this.arenas[arenaId] || null;
    }
    
    /**
     * Get arena by zone
     */
    getArenaByZone(zoneId) {
        const arenaData = getArenaByZone(zoneId);
        if (!arenaData) return null;
        return this.arenas[arenaData.id] || null;
    }
    
    /**
     * Activate arena for zone
     */
    activateArena(zoneId) {
        const arena = this.getArenaByZone(zoneId);
        if (!arena) return false;
        
        // Deactivate current arena
        if (this.activeArena) {
            this.activeArena.deactivate();
        }
        
        // Activate new arena
        arena.activate();
        this.activeArena = arena;
        
        return true;
    }
    
    /**
     * Deactivate current arena
     */
    deactivateCurrentArena() {
        if (this.activeArena) {
            this.activeArena.deactivate();
            this.activeArena = null;
        }
    }
    
    /**
     * Get active arena
     */
    getActiveArena() {
        return this.activeArena;
    }
    
    /**
     * Update arenas
     */
    update(player) {
        if (!this.activeArena) return;
        
        // Check if player entered arena
        if (this.activeArena.isPlayerAtEntrance(player) && !this.activeArena.playerInArena) {
            this.activeArena.enter();
        }
        
        // Check if player exited arena
        if (this.activeArena.isPlayerAtExit(player) && this.activeArena.playerInArena) {
            this.activeArena.exit();
        }
    }
    
    /**
     * Render active arena
     */
    render(ctx, camera) {
        if (this.activeArena) {
            this.activeArena.renderBackground(ctx, camera);
        }
    }
    
    /**
     * Get boss spawn position for active arena
     */
    getBossSpawnPosition() {
        if (!this.activeArena) return null;
        return this.activeArena.bossSpawnPosition;
    }
    
    /**
     * Mark boss as spawned in active arena
     */
    setBossSpawned() {
        if (this.activeArena) {
            this.activeArena.setBossSpawned();
        }
    }
    
    /**
     * Serialize arena manager state
     */
    toJSON() {
        const arenaStates = {};
        for (const arenaId in this.arenas) {
            arenaStates[arenaId] = this.arenas[arenaId].toJSON();
        }
        
        return {
            activeArenaId: this.activeArena ? this.activeArena.id : null,
            arenaStates: arenaStates
        };
    }
    
    /**
     * Deserialize arena manager state
     */
    fromJSON(data) {
        // Restore arena states
        if (data.arenaStates) {
            for (const arenaId in data.arenaStates) {
                const arena = this.arenas[arenaId];
                if (arena) {
                    arena.fromJSON(data.arenaStates[arenaId]);
                }
            }
        }
        
        // Restore active arena
        if (data.activeArenaId && this.arenas[data.activeArenaId]) {
            this.activeArena = this.arenas[data.activeArenaId];
        }
    }
}
