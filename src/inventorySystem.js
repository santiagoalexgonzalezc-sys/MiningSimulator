/**
 * Centralized inventory system with slot-based capacity rules
 * Used across all systems for consistent inventory behavior
 */

// Slot costs per rarity
export const RARITY_SLOTS = {
    common: 1,
    uncommon: 1,
    rare: 2,
    epic: 3,
    legendary: 4,
    mythic: 5
};

// Backpack definitions
export const BACKPACKS = {
    SMALL: {
        id: 'small',
        name: 'Small Backpack',
        capacity: 20,
        cost: 0,
        color: '#8B4513',
        description: 'Basic backpack for starting miners.'
    },
    MEDIUM: {
        id: 'medium',
        name: 'Medium Backpack',
        capacity: 40,
        cost: 200,
        color: '#A0522D',
        description: 'Spacious backpack for serious mining.'
    },
    LARGE: {
        id: 'large',
        name: 'Large Backpack',
        capacity: 75,
        cost: 1000,
        color: '#CD853F',
        description: 'Large backpack for extended mining sessions.'
    },
    EPIC: {
        id: 'epic',
        name: 'Epic Backpack',
        capacity: 120,
        cost: 5000,
        color: '#DAA520',
        description: 'Epic backpack for professional miners.'
    },
    MYTHIC: {
        id: 'mythic',
        name: 'Mythic Backpack',
        capacity: 200,
        cost: 25000,
        color: '#FFD700',
        description: 'Legendary backpack with massive capacity.'
    }
};

// Backpack progression order
export const BACKPACK_ORDER = ['small', 'medium', 'large', 'epic', 'mythic'];

/**
 * Get slot cost for a rarity
 */
export function getSlotCost(rarity) {
    return RARITY_SLOTS[rarity.toLowerCase()] || 1;
}

/**
 * Get backpack by ID
 */
export function getBackpack(id) {
    return BACKPACKS[id.toUpperCase()] || BACKPACKS.SMALL;
}

/**
 * Get next backpack in progression
 */
export function getNextBackpack(currentId) {
    const currentIndex = BACKPACK_ORDER.indexOf(currentId);
    if (currentIndex === -1 || currentIndex >= BACKPACK_ORDER.length - 1) {
        return null;
    }
    return getBackpack(BACKPACK_ORDER[currentIndex + 1]);
}

/**
 * Calculate total slots used by inventory items
 */
export function calculateUsedSlots(items) {
    let totalSlots = 0;
    for (const type in items) {
        const item = items[type];
        const slotCost = getSlotCost(item.rarity || 'common');
        totalSlots += item.count * slotCost;
    }
    return totalSlots;
}

/**
 * Check if inventory can add an item
 */
export function canAddItem(items, capacity, rarity) {
    const slotCost = getSlotCost(rarity);
    const usedSlots = calculateUsedSlots(items);
    return (usedSlots + slotCost) <= capacity;
}
