/**
 * Zone class - represents a mining zone with unique properties
 */
export class Zone {
    constructor(config) {
        this.id = config.id;
        this.name = config.name;
        this.backgroundColor = config.backgroundColor;
        this.gridColor = config.gridColor;
        this.oreTable = config.oreTable;
        this.unlockRequirement = config.unlockRequirement;
        this.unlockMessage = config.unlockMessage;
        this.startPosition = config.startPosition || { x: 400, y: 300 };
        this.portalPosition = config.portalPosition || { x: 1800, y: 900 };
        this.portalTarget = config.portalTarget || null;
        this.rockStyle = config.rockStyle || 'square';
    }
    
    canUnlock(player) {
        if (!this.unlockRequirement) return true;
        
        if (this.unlockRequirement.type === 'money') {
            return player.money >= this.unlockRequirement.value;
        } else if (this.unlockRequirement.type === 'level') {
            return player.level >= this.unlockRequirement.value;
        } else if (this.unlockRequirement.type === 'pickaxe') {
            return player.pickaxeTier >= this.unlockRequirement.value;
        }
        
        return false;
    }
    
    getRandomOre() {
        const rand = Math.random();
        let cumulative = 0;
        
        for (const ore of this.oreTable) {
            cumulative += ore.chance;
            if (rand <= cumulative) {
                return {
                    type: ore.name,
                    color: ore.color,
                    value: ore.value,
                    requiredPower: ore.requiredPower,
                    health: ore.health,
                    maxHealth: ore.health
                };
            }
        }
        
        // Fallback to first ore
        return {
            type: this.oreTable[0].name,
            color: this.oreTable[0].color,
            value: this.oreTable[0].value,
            requiredPower: this.oreTable[0].requiredPower,
            health: this.oreTable[0].health,
            maxHealth: this.oreTable[0].health
        };
    }
    
    toJSON() {
        return {
            id: this.id,
            unlocked: this.unlocked
        };
    }
    
    fromJSON(data) {
        this.unlocked = data.unlocked;
    }
}

// Zone definitions
export const ZONE_DEFINITIONS = [
    {
        id: 'surface',
        name: 'Surface Mine',
        backgroundColor: '#8b7355',
        gridColor: '#7a6548',
        rockStyle: 'square',
        startPosition: { x: 400, y: 300 },
        portalPosition: { x: 1800, y: 900 },
        portalTarget: 'cave',
        unlockRequirement: null,
        unlockMessage: null,
        oreTable: [
            { name: 'Coal', color: '#2c3e50', value: 10, requiredPower: 1, health: 3, chance: 0.6 },
            { name: 'Iron', color: '#95a5a6', value: 25, requiredPower: 2, health: 5, chance: 0.4 }
        ]
    },
    {
        id: 'cave',
        name: 'Cave Mine',
        backgroundColor: '#4a4a4a',
        gridColor: '#3a3a3a',
        rockStyle: 'circle',
        startPosition: { x: 100, y: 100 },
        portalPosition: { x: 1800, y: 900 },
        portalTarget: 'crystal',
        unlockRequirement: { type: 'money', value: 500 },
        unlockMessage: 'Requires $500 to unlock',
        oreTable: [
            { name: 'Iron', color: '#95a5a6', value: 25, requiredPower: 2, health: 5, chance: 0.5 },
            { name: 'Gold', color: '#f1c40f', value: 50, requiredPower: 3, health: 8, chance: 0.5 }
        ]
    },
    {
        id: 'crystal',
        name: 'Crystal Mine',
        backgroundColor: '#2c3e50',
        gridColor: '#1a252f',
        rockStyle: 'diamond',
        startPosition: { x: 100, y: 100 },
        portalPosition: { x: 1800, y: 900 },
        portalTarget: 'lava',
        unlockRequirement: { type: 'money', value: 2000 },
        unlockMessage: 'Requires $2000 to unlock',
        oreTable: [
            { name: 'Gold', color: '#f1c40f', value: 50, requiredPower: 3, health: 8, chance: 0.4 },
            { name: 'Diamond', color: '#3498db', value: 100, requiredPower: 5, health: 12, chance: 0.4 },
            { name: 'Emerald', color: '#27ae60', value: 150, requiredPower: 6, health: 15, chance: 0.2 }
        ]
    },
    {
        id: 'lava',
        name: 'Lava Mine',
        backgroundColor: '#5a2d2d',
        gridColor: '#4a1d1d',
        rockStyle: 'hexagon',
        startPosition: { x: 100, y: 100 },
        portalPosition: { x: 1800, y: 900 },
        portalTarget: 'surface',
        unlockRequirement: { type: 'money', value: 5000 },
        unlockMessage: 'Requires $5000 to unlock',
        oreTable: [
            { name: 'Diamond', color: '#3498db', value: 100, requiredPower: 5, health: 12, chance: 0.3 },
            { name: 'Ruby', color: '#e74c3c', value: 200, requiredPower: 7, health: 18, chance: 0.2 },
            { name: 'Mythic', color: '#9b59b6', value: 500, requiredPower: 10, health: 25, chance: 0.05 }
        ]
    }
];
