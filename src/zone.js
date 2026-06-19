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
        this.backPortalPosition = config.backPortalPosition || null;
        this.backPortalTarget = config.backPortalTarget || null;
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
        backPortalPosition: { x: 100, y: 100 },
        backPortalTarget: 'infinity',
        unlockRequirement: null,
        unlockMessage: null
    },
    {
        id: 'cave',
        name: 'Cave Mine',
        backgroundColor: '#4a4a4a',
        gridColor: '#3a3a3a',
        rockStyle: 'circle',
        startPosition: { x: 250, y: 200 },
        portalPosition: { x: 1800, y: 900 },
        portalTarget: 'crystal',
        backPortalPosition: { x: 100, y: 100 },
        backPortalTarget: 'surface',
        unlockRequirement: { type: 'money', value: 2000 },
        unlockMessage: 'Requires $250 to unlock'
    },
    {
        id: 'crystal',
        name: 'Crystal Mine',
        backgroundColor: '#2c3e50',
        gridColor: '#1a252f',
        rockStyle: 'diamond',
        startPosition: { x: 250, y: 200 },
        portalPosition: { x: 1800, y: 900 },
        portalTarget: 'lava',
        backPortalPosition: { x: 100, y: 100 },
        backPortalTarget: 'cave',
        unlockRequirement: { type: 'money', value: 5000 },
        unlockMessage: 'Requires $1000 to unlock'
    },
    {
        id: 'lava',
        name: 'Lava Mine',
        backgroundColor: '#5a2d2d',
        gridColor: '#4a1d1d',
        rockStyle: 'hexagon',
        startPosition: { x: 250, y: 200 },
        portalPosition: { x: 1800, y: 900 },
        portalTarget: 'void',
        backPortalPosition: { x: 100, y: 100 },
        backPortalTarget: 'crystal',
        unlockRequirement: { type: 'money', value: 15000 },
        unlockMessage: 'Requires $2500 to unlock'
    },
    {
        id: 'void',
        name: 'Void Mine',
        backgroundColor: '#1a0a2e',
        gridColor: '#0d0518',
        rockStyle: 'star',
        startPosition: { x: 250, y: 200 },
        portalPosition: { x: 1800, y: 900 },
        portalTarget: 'celestial',
        backPortalPosition: { x: 100, y: 100 },
        backPortalTarget: 'lava',
        unlockRequirement: { type: 'money', value: 50000 },
        unlockMessage: 'Requires $10,000 to unlock'
    },
    {
        id: 'celestial',
        name: 'Celestial Mine',
        backgroundColor: '#0f2040',
        gridColor: '#0a1525',
        rockStyle: 'octagon',
        startPosition: { x: 250, y: 200 },
        portalPosition: { x: 1800, y: 900 },
        portalTarget: 'cosmic',
        backPortalPosition: { x: 100, y: 100 },
        backPortalTarget: 'void',
        unlockRequirement: { type: 'money', value: 100000 },
        unlockMessage: 'Requires $50,000 to unlock'
    },
    {
        id: 'cosmic',
        name: 'Cosmic Mine',
        backgroundColor: '#0a0a1a',
        gridColor: '#050510',
        rockStyle: 'spiral',
        startPosition: { x: 250, y: 200 },
        portalPosition: { x: 1800, y: 900 },
        portalTarget: 'infinity',
        backPortalPosition: { x: 100, y: 100 },
        backPortalTarget: 'celestial',
        unlockRequirement: { type: 'money', value: 500000 },
        unlockMessage: 'Requires $250,000 to unlock'
    },
    {
        id: 'infinity',
        name: 'Infinity Mine',
        backgroundColor: '#000000',
        gridColor: '#1a1a1a',
        rockStyle: 'infinity',
        startPosition: { x: 250, y: 200 },
        portalPosition: { x: 1800, y: 900 },
        portalTarget: 'surface',
        backPortalPosition: { x: 100, y: 100 },
        backPortalTarget: 'cosmic',
        unlockRequirement: { type: 'money', value: 1000000 },
        unlockMessage: 'Requires $1,000,000 to unlock'
    }
];
