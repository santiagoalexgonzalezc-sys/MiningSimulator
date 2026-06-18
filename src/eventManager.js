import { getEvent, getRandomEvent, canEventActivate, calculateTotalEventBonus, calculateTotalZoneBonus } from './eventData.js';

/**
 * EventManager class - manages world event lifecycle
 */
export class EventManager {
    constructor() {
        this.activeEvents = {}; // eventId -> { startTime, endTime }
        this.lastEventTimes = {}; // eventId -> timestamp
        this.nextEventCheck = 0;
        this.eventCheckInterval = 60000; // Check for new events every minute
        this.totalEventsTriggered = 0;
    }
    
    /**
     * Update event manager
     */
    update(deltaTime) {
        const now = Date.now();
        
        // Check for expired events
        this.checkExpiredEvents(now);
        
        // Check for new events
        if (now >= this.nextEventCheck) {
            this.tryTriggerEvent(now);
            this.nextEventCheck = now + this.eventCheckInterval;
        }
    }
    
    /**
     * Check for expired events
     */
    checkExpiredEvents(now) {
        for (const eventId in this.activeEvents) {
            const eventData = this.activeEvents[eventId];
            if (now >= eventData.endTime) {
                this.endEvent(eventId);
            }
        }
    }
    
    /**
     * Try to trigger a random event
     */
    tryTriggerEvent(now) {
        // 10% chance to trigger an event each check
        if (Math.random() > 0.1) return;
        
        const event = getRandomEvent();
        if (!event) return;
        
        if (canEventActivate(event.id, this.activeEvents, this.lastEventTimes)) {
            this.startEvent(event.id, now);
        }
    }
    
    /**
     * Start an event
     */
    startEvent(eventId, now = Date.now()) {
        const event = getEvent(eventId);
        if (!event) return false;
        
        const startTime = now;
        const endTime = now + (event.duration * 1000);
        
        this.activeEvents[eventId] = {
            startTime: startTime,
            endTime: endTime
        };
        
        this.lastEventTimes[eventId] = startTime;
        this.totalEventsTriggered++;
        
        return true;
    }
    
    /**
     * End an event
     */
    endEvent(eventId) {
        delete this.activeEvents[eventId];
    }
    
    /**
     * Get active events
     */
    getActiveEvents() {
        return this.activeEvents;
    }
    
    /**
     * Check if an event is active
     */
    isEventActive(eventId) {
        return !!this.activeEvents[eventId];
    }
    
    /**
     * Get remaining time for an event
     */
    getEventRemainingTime(eventId) {
        if (!this.activeEvents[eventId]) return 0;
        const now = Date.now();
        return Math.max(0, this.activeEvents[eventId].endTime - now);
    }
    
    /**
     * Get remaining time formatted
     */
    getEventRemainingTimeFormatted(eventId) {
        const remainingMs = this.getEventRemainingTime(eventId);
        if (remainingMs <= 0) return 'Ended';
        
        const minutes = Math.floor(remainingMs / 60000);
        const seconds = Math.floor((remainingMs % 60000) / 1000);
        return `${minutes}m ${seconds}s`;
    }
    
    /**
     * Get total bonus for an effect type
     */
    getTotalBonus(effectType) {
        return calculateTotalEventBonus(this.activeEvents, effectType);
    }
    
    /**
     * Get zone bonus
     */
    getZoneBonus(zoneId) {
        return calculateTotalZoneBonus(this.activeEvents, zoneId);
    }
    
    /**
     * Get ore spawn rate bonus
     */
    getOreSpawnRateBonus() {
        return this.getTotalBonus('oreSpawnRate');
    }
    
    /**
     * Get critical chance bonus
     */
    getCritChanceBonus() {
        return this.getTotalBonus('critChance');
    }
    
    /**
     * Get ore value bonus
     */
    getOreValueBonus() {
        return this.getTotalBonus('oreValue');
    }
    
    /**
     * Get boss coin rewards bonus
     */
    getBossCoinRewardsBonus() {
        return this.getTotalBonus('bossCoinRewards');
    }
    
    /**
     * Get event status for UI
     */
    getEventStatus(eventId) {
        const event = getEvent(eventId);
        if (!event) return null;
        
        const isActive = this.isEventActive(eventId);
        const remainingTime = this.getEventRemainingTime(eventId);
        
        return {
            id: event.id,
            name: event.name,
            description: event.description,
            icon: event.icon,
            color: event.color,
            isActive: isActive,
            remainingTime: remainingTime,
            remainingTimeFormatted: this.getEventRemainingTimeFormatted(eventId),
            effects: event.effects
        };
    }
    
    /**
     * Get all event statuses
     */
    getAllEventStatuses() {
        const statuses = [];
        
        for (const eventId in this.activeEvents) {
            const status = this.getEventStatus(eventId);
            if (status) {
                statuses.push(status);
            }
        }
        
        return statuses;
    }
    
    /**
     * Get total events triggered
     */
    getTotalEventsTriggered() {
        return this.totalEventsTriggered;
    }
    
    /**
     * Serialize event manager state
     */
    toJSON() {
        return {
            activeEvents: this.activeEvents,
            lastEventTimes: this.lastEventTimes,
            totalEventsTriggered: this.totalEventsTriggered
        };
    }
    
    /**
     * Deserialize event manager state
     */
    fromJSON(data) {
        this.activeEvents = data.activeEvents || {};
        this.lastEventTimes = data.lastEventTimes || {};
        this.totalEventsTriggered = data.totalEventsTriggered || 0;
        
        // Reset expired events on load
        const now = Date.now();
        for (const eventId in this.activeEvents) {
            if (now >= this.activeEvents[eventId].endTime) {
                this.endEvent(eventId);
            }
        }
    }
}
