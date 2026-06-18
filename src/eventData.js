/**
 * Event Data Definitions
 * Data-driven world event system for Phase 9
 */

// Event definitions
export const EVENTS = {
    ORE_RUSH: {
        id: 'ore_rush',
        name: 'Ore Rush',
        description: '2x ore spawn rate for 10 minutes',
        duration: 600, // 10 minutes in seconds
        cooldown: 3600, // 1 hour in seconds
        icon: '⚡',
        color: '#f39c12',
        effects: {
            oreSpawnRate: 2.0
        }
    },
    LUCKY_HOUR: {
        id: 'lucky_hour',
        name: 'Lucky Hour',
        description: '2x critical chance for 15 minutes',
        duration: 900, // 15 minutes in seconds
        cooldown: 3600, // 1 hour in seconds
        icon: '🍀',
        color: '#2ecc71',
        effects: {
            critChance: 2.0
        }
    },
    GOLD_STORM: {
        id: 'gold_storm',
        name: 'Gold Storm',
        description: '2x ore value for 10 minutes',
        duration: 600, // 10 minutes in seconds
        cooldown: 3600, // 1 hour in seconds
        icon: '💰',
        color: '#f1c40f',
        effects: {
            oreValue: 2.0
        }
    },
    CRYSTAL_RAIN: {
        id: 'crystal_rain',
        name: 'Crystal Rain',
        description: '3x crystal ore spawn rate for 15 minutes',
        duration: 900, // 15 minutes in seconds
        cooldown: 7200, // 2 hours in seconds
        icon: '💎',
        color: '#9b59b6',
        effects: {
            oreSpawnRate: 3.0,
            zoneBonus: { crystal: 2.0 }
        }
    },
    BOSS_FRENZY: {
        id: 'boss_frenzy',
        name: 'Boss Frenzy',
        description: '2x boss coin rewards for 20 minutes',
        duration: 1200, // 20 minutes in seconds
        cooldown: 7200, // 2 hours in seconds
        icon: '⚔️',
        color: '#e74c3c',
        effects: {
            bossCoinRewards: 2.0
        }
    },
    VOID_SURGE: {
        id: 'void_surge',
        name: 'Void Surge',
        description: '2x void ore spawn rate for 15 minutes',
        duration: 900, // 15 minutes in seconds
        cooldown: 7200, // 2 hours in seconds
        icon: '🌌',
        color: '#4b0082',
        effects: {
            oreSpawnRate: 2.0,
            zoneBonus: { void: 2.0 }
        }
    },
    CELESTIAL_ALIGNMENT: {
        id: 'celestial_alignment',
        name: 'Celestial Alignment',
        description: '3x celestial ore spawn rate for 20 minutes',
        duration: 1200, // 20 minutes in seconds
        cooldown: 10800, // 3 hours in seconds
        icon: '⭐',
        color: '#00bfff',
        effects: {
            oreSpawnRate: 3.0,
            zoneBonus: { celestial: 2.0 }
        }
    },
    COSMIC_CONVERGENCE: {
        id: 'cosmic_convergence',
        name: 'Cosmic Convergence',
        description: 'All bonuses active for 30 minutes',
        duration: 1800, // 30 minutes in seconds
        cooldown: 21600, // 6 hours in seconds
        icon: '🌟',
        color: '#ff69b4',
        effects: {
            oreSpawnRate: 2.0,
            critChance: 2.0,
            oreValue: 2.0,
            bossCoinRewards: 2.0
        }
    }
};

// Event progression order (rare to common)
export const EVENT_ORDER = ['cosmic_convergence', 'celestial_alignment', 'crystal_rain', 'void_surge', 'boss_frenzy', 'gold_storm', 'lucky_hour', 'ore_rush'];

/**
 * Get event by ID
 */
export function getEvent(eventId) {
    return EVENTS[eventId.toUpperCase()] || null;
}

/**
 * Get all events
 */
export function getAllEvents() {
    return Object.values(EVENTS);
}

/**
 * Get random event weighted by rarity
 */
export function getRandomEvent() {
    // Weight events by rarity (cosmic_convergence is rarest)
    const weights = {
        cosmic_convergence: 0.05,
        celestial_alignment: 0.1,
        crystal_rain: 0.1,
        void_surge: 0.1,
        boss_frenzy: 0.15,
        gold_storm: 0.15,
        lucky_hour: 0.2,
        ore_rush: 0.15
    };
    
    const rand = Math.random();
    let cumulative = 0;
    
    for (const eventId in weights) {
        cumulative += weights[eventId];
        if (rand <= cumulative) {
            return getEvent(eventId);
        }
    }
    
    return getEvent('ore_rush');
}

/**
 * Check if event can activate
 */
export function canEventActivate(eventId, activeEvents, lastEventTimes) {
    const event = getEvent(eventId);
    if (!event) return false;
    
    // Check if event is already active
    if (activeEvents[eventId]) return false;
    
    // Check cooldown
    if (lastEventTimes[eventId]) {
        const now = Date.now();
        const cooldownMs = event.cooldown * 1000;
        if (now - lastEventTimes[eventId] < cooldownMs) {
            return false;
        }
    }
    
    return true;
}

/**
 * Get event effect value
 */
export function getEventEffect(eventId, effectType) {
    const event = getEvent(eventId);
    if (!event || !event.effects) return 1.0;
    
    if (event.effects[effectType]) {
        return event.effects[effectType];
    }
    
    return 1.0;
}

/**
 * Get zone bonus from event
 */
export function getEventZoneBonus(eventId, zoneId) {
    const event = getEvent(eventId);
    if (!event || !event.effects || !event.effects.zoneBonus) return 1.0;
    
    return event.effects.zoneBonus[zoneId] || 1.0;
}

/**
 * Calculate total event bonus for a specific effect
 */
export function calculateTotalEventBonus(activeEvents, effectType) {
    let totalBonus = 1.0;
    
    for (const eventId in activeEvents) {
        const bonus = getEventEffect(eventId, effectType);
        totalBonus *= bonus;
    }
    
    return totalBonus;
}

/**
 * Calculate total zone bonus from events
 */
export function calculateTotalZoneBonus(activeEvents, zoneId) {
    let totalBonus = 1.0;
    
    for (const eventId in activeEvents) {
        const bonus = getEventZoneBonus(eventId, zoneId);
        totalBonus *= bonus;
    }
    
    return totalBonus;
}
