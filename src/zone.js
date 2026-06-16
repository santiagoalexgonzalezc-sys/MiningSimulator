import { generateOre } from './oreData.js';

/**
 * Zone class - represents a mining zone with unique properties
 */
export class Zone {
    constructor(config) {
        this.id = config.id;
        this.name = config.name;
        this.backgroundColor = config.backgroundColor;
        this.gridColor = config.gridColor;
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
    
    getRandomOre(x, y) {
        return generateOre(this.id, x, y);
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
        unlockMessage: null
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
        unlockMessage: 'Requires $500 to unlock'
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
        unlockMessage: 'Requires $2000 to unlock'
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
        unlockMessage: 'Requires $5000 to unlock'
    }
];
