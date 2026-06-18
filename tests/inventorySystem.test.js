/**
 * Unit tests for inventorySystem.js
 * Tests backpack capacity, slot costs, and inventory calculations
 */

import { 
    RARITY_SLOTS,
    BACKPACKS,
    BACKPACK_ORDER,
    getSlotCost,
    getBackpack,
    getNextBackpack,
    calculateUsedSlots,
    canAddItem
} from '../src/inventorySystem.js';

describe('inventorySystem.js', () => {
    describe('RARITY_SLOTS', () => {
        test('should have increasing slot costs', () => {
            expect(RARITY_SLOTS.common).toBe(1);
            expect(RARITY_SLOTS.uncommon).toBe(1);
            expect(RARITY_SLOTS.rare).toBe(2);
            expect(RARITY_SLOTS.epic).toBe(3);
            expect(RARITY_SLOTS.legendary).toBe(4);
            expect(RARITY_SLOTS.mythic).toBe(5);
        });

        test('mythic ores should cost most slots', () => {
            expect(RARITY_SLOTS.mythic).toBeGreaterThan(RARITY_SLOTS.legendary);
            expect(RARITY_SLOTS.legendary).toBeGreaterThan(RARITY_SLOTS.epic);
            expect(RARITY_SLOTS.epic).toBeGreaterThan(RARITY_SLOTS.rare);
        });
    });

    describe('BACKPACKS', () => {
        test('should have all required backpack tiers', () => {
            expect(BACKPACKS).toHaveProperty('SMALL');
            expect(BACKPACKS).toHaveProperty('MEDIUM');
            expect(BACKPACKS).toHaveProperty('LARGE');
            expect(BACKPACKS).toHaveProperty('EPIC');
            expect(BACKPACKS).toHaveProperty('MYTHIC');
        });

        test('should have increasing capacity', () => {
            expect(BACKPACKS.SMALL.capacity).toBe(20);
            expect(BACKPACKS.MEDIUM.capacity).toBe(40);
            expect(BACKPACKS.LARGE.capacity).toBe(75);
            expect(BACKPACKS.EPIC.capacity).toBe(120);
            expect(BACKPACKS.MYTHIC.capacity).toBe(200);
        });

        test('should have increasing costs', () => {
            expect(BACKPACKS.SMALL.cost).toBe(0);
            expect(BACKPACKS.MEDIUM.cost).toBe(100);
            expect(BACKPACKS.LARGE.cost).toBe(500);
            expect(BACKPACKS.EPIC.cost).toBe(2500);
            expect(BACKPACKS.MYTHIC.cost).toBe(12500);
        });

        test('capacity should grow slower than pickaxes', () => {
            const firstCapacity = BACKPACKS.SMALL.capacity;
            const lastCapacity = BACKPACKS.MYTHIC.capacity;
            const growth = lastCapacity / firstCapacity;
            
            // 10x growth is reasonable (not 100x)
            expect(growth).toBeLessThan(15);
        });

        test('should not allow 1000-slot backpacks', () => {
            const maxCapacity = BACKPACKS.MYTHIC.capacity;
            expect(maxCapacity).toBeLessThan(1000);
        });

        test('all backpacks should have required properties', () => {
            Object.values(BACKPACKS).forEach(backpack => {
                expect(backpack).toHaveProperty('id');
                expect(backpack).toHaveProperty('name');
                expect(backpack).toHaveProperty('capacity');
                expect(backpack).toHaveProperty('cost');
                expect(backpack).toHaveProperty('color');
                expect(backpack).toHaveProperty('description');
            });
        });
    });

    describe('BACKPACK_ORDER', () => {
        test('should have correct progression order', () => {
            expect(BACKPACK_ORDER).toEqual(['small', 'medium', 'large', 'epic', 'mythic', 'divine', 'cosmic']);
        });

        test('should match BACKPACKS keys', () => {
            BACKPACK_ORDER.forEach(id => {
                expect(BACKPACKS[id.toUpperCase()]).toBeDefined();
            });
        });
    });

    describe('getSlotCost', () => {
        test('should return correct slot cost for each rarity', () => {
            expect(getSlotCost('common')).toBe(1);
            expect(getSlotCost('uncommon')).toBe(1);
            expect(getSlotCost('rare')).toBe(2);
            expect(getSlotCost('epic')).toBe(3);
            expect(getSlotCost('legendary')).toBe(4);
            expect(getSlotCost('mythic')).toBe(5);
            // Secret and Ultra Secret default to 1 (not implemented in slot costs)
            expect(getSlotCost('secret')).toBe(1);
            expect(getSlotCost('ultra_secret')).toBe(1);
        });

        test('should be case-insensitive', () => {
            expect(getSlotCost('common')).toBe(getSlotCost('COMMON'));
            expect(getSlotCost('rare')).toBe(getSlotCost('RARE'));
        });

        test('should default to 1 for invalid rarity', () => {
            expect(getSlotCost('invalid')).toBe(1);
        });
    });

    describe('getBackpack', () => {
        test('should return correct backpack by ID', () => {
            const backpack = getBackpack('medium');
            expect(backpack.id).toBe('medium');
            expect(backpack.name).toBe('Medium Backpack');
        });

        test('should be case-insensitive', () => {
            const backpack1 = getBackpack('medium');
            const backpack2 = getBackpack('MEDIUM');
            expect(backpack1).toEqual(backpack2);
        });

        test('should return small backpack for invalid ID', () => {
            const backpack = getBackpack('invalid');
            expect(backpack.id).toBe('small');
        });
    });

    describe('getNextBackpack', () => {
        test('should return next backpack in progression', () => {
            const next = getNextBackpack('small');
            expect(next.id).toBe('medium');
        });

        test('should return null for last backpack', () => {
            const next = getNextBackpack('cosmic');
            expect(next).toBeNull();
        });

        test('should return null for invalid backpack', () => {
            const next = getNextBackpack('invalid');
            expect(next).toBeNull();
        });

        test('should handle entire progression chain', () => {
            let current = 'small';
            const expectedOrder = ['medium', 'large', 'epic', 'mythic', 'divine', 'cosmic'];
            
            for (const expected of expectedOrder) {
                const next = getNextBackpack(current);
                expect(next.id).toBe(expected);
                current = expected;
            }
            
            expect(getNextBackpack('cosmic')).toBeNull();
        });
    });

    describe('calculateUsedSlots', () => {
        test('should calculate slots correctly for common items', () => {
            const items = {
                coal: { count: 10, rarity: 'common' }
            };
            expect(calculateUsedSlots(items)).toBe(10);
        });

        test('should calculate slots correctly for rare items', () => {
            const items = {
                diamond: { count: 5, rarity: 'rare' }
            };
            expect(calculateUsedSlots(items)).toBe(10); // 5 * 2
        });

        test('should calculate slots correctly for mixed rarities', () => {
            const items = {
                coal: { count: 10, rarity: 'common' },
                diamond: { count: 5, rarity: 'rare' },
                mythic: { count: 2, rarity: 'mythic' }
            };
            expect(calculateUsedSlots(items)).toBe(30); // 10*1 + 5*2 + 2*5
        });

        test('should handle empty items', () => {
            expect(calculateUsedSlots({})).toBe(0);
        });

        test('should default to common rarity if not specified', () => {
            const items = {
                coal: { count: 10 }
            };
            expect(calculateUsedSlots(items)).toBe(10);
        });
    });

    describe('canAddItem', () => {
        test('should allow adding if capacity not exceeded', () => {
            const items = {
                coal: { count: 10, rarity: 'common' }
            };
            const capacity = 20;
            expect(canAddItem(items, capacity, 'common')).toBe(true);
        });

        test('should deny adding if capacity exceeded', () => {
            const items = {
                coal: { count: 20, rarity: 'common' }
            };
            const capacity = 20;
            expect(canAddItem(items, capacity, 'common')).toBe(false);
        });

        test('should consider slot cost of new item', () => {
            const items = {
                coal: { count: 19, rarity: 'common' }
            };
            const capacity = 20;
            expect(canAddItem(items, capacity, 'rare')).toBe(false); // 19 + 2 = 21 > 20
        });

        test('should allow adding mythic if enough space', () => {
            const items = {
                coal: { count: 15, rarity: 'common' }
            };
            const capacity = 20;
            expect(canAddItem(items, capacity, 'mythic')).toBe(true); // 15 + 5 = 20
        });

        test('should handle empty inventory', () => {
            expect(canAddItem({}, 20, 'common')).toBe(true);
        });

        test('should handle full capacity', () => {
            const items = {
                coal: { count: 20, rarity: 'common' }
            };
            const capacity = 20;
            expect(canAddItem(items, capacity, 'common')).toBe(false);
        });
    });

    describe('Economy balance checks', () => {
        test('backpack costs should scale with rebalanced ore values', () => {
            const mediumCost = BACKPACKS.MEDIUM.cost;
            const coalValue = 5;
            
            // Should require mining ~20 coal for medium backpack
            expect(mediumCost).toBeGreaterThan(coalValue * 10);
            expect(mediumCost).toBeLessThan(coalValue * 30);
        });

        test('mythic backpack should be expensive but reachable', () => {
            const mythicCost = BACKPACKS.MYTHIC.cost;
            const mythicOreValue = 320;
            
            // Should require mining ~40 mythic ores
            expect(mythicCost).toBeGreaterThan(mythicOreValue * 30);
            expect(mythicCost).toBeLessThan(mythicOreValue * 50);
        });

        test('backpack progression should not outpace ore value scaling', () => {
            const firstCost = BACKPACKS.MEDIUM.cost; // Skip small (0 cost)
            const lastCost = BACKPACKS.MYTHIC.cost;
            const costGrowth = lastCost / firstCost;
            
            // Cost growth should be reasonable
            expect(costGrowth).toBeLessThan(200);
        });

        test('slot costs should make high-rarity ores valuable', () => {
            const mythicSlotCost = RARITY_SLOTS.mythic;
            const commonSlotCost = RARITY_SLOTS.common;
            
            // Mythic ores should take 5x the space
            expect(mythicSlotCost).toBe(commonSlotCost * 5);
        });

        test('capacity should grow slower than ore value scaling', () => {
            const firstCapacity = BACKPACKS.SMALL.capacity;
            const lastCapacity = BACKPACKS.MYTHIC.capacity;
            const capacityGrowth = lastCapacity / firstCapacity;
            
            // Capacity should grow slower than ore values (2x per tier)
            expect(capacityGrowth).toBeLessThan(15);
        });
    });
});
