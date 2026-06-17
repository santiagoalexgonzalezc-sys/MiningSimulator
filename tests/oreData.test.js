/**
 * Unit tests for oreData.js
 * Tests ore value calculations, rarity generation, and zone bonuses
 */

import { 
    RARITY, 
    ORE_TYPES, 
    ZONE_BONUS, 
    calculateOreValue, 
    getRandomRarity, 
    getRandomOreType,
    generateOre,
    calculateOreHP
} from '../src/oreData.js';

describe('oreData.js', () => {
    describe('RARITY definitions', () => {
        test('should have all required rarity tiers', () => {
            expect(RARITY).toHaveProperty('COMMON');
            expect(RARITY).toHaveProperty('UNCOMMON');
            expect(RARITY).toHaveProperty('RARE');
            expect(RARITY).toHaveProperty('EPIC');
            expect(RARITY).toHaveProperty('LEGENDARY');
            expect(RARITY).toHaveProperty('MYTHIC');
        });

        test('should have increasing value multipliers', () => {
            expect(RARITY.COMMON.valueMultiplier).toBe(1.0);
            expect(RARITY.UNCOMMON.valueMultiplier).toBe(1.5);
            expect(RARITY.RARE.valueMultiplier).toBe(2.5);
            expect(RARITY.EPIC.valueMultiplier).toBe(4.0);
            expect(RARITY.LEGENDARY.valueMultiplier).toBe(7.0);
            expect(RARITY.MYTHIC.valueMultiplier).toBe(15.0);
        });

        test('should have decreasing drop chances for higher rarities', () => {
            expect(RARITY.COMMON.dropChance).toBeGreaterThan(RARITY.UNCOMMON.dropChance);
            expect(RARITY.UNCOMMON.dropChance).toBeGreaterThan(RARITY.RARE.dropChance);
            expect(RARITY.RARE.dropChance).toBeGreaterThan(RARITY.EPIC.dropChance);
            expect(RARITY.EPIC.dropChance).toBeGreaterThan(RARITY.LEGENDARY.dropChance);
            expect(RARITY.LEGENDARY.dropChance).toBeGreaterThan(RARITY.MYTHIC.dropChance);
        });
    });

    describe('ORE_TYPES definitions', () => {
        test('should have smooth ~2x value progression', () => {
            const values = Object.values(ORE_TYPES).map(ore => ore.baseValue);
            for (let i = 1; i < values.length; i++) {
                const ratio = values[i] / values[i - 1];
                expect(ratio).toBeGreaterThanOrEqual(1.8);
                expect(ratio).toBeLessThanOrEqual(2.2);
            }
        });

        test('should have increasing required power', () => {
            const powers = Object.values(ORE_TYPES).map(ore => ore.requiredPower);
            for (let i = 1; i < powers.length; i++) {
                expect(powers[i]).toBeGreaterThan(powers[i - 1]);
            }
        });

        test('should have increasing health', () => {
            const healths = Object.values(ORE_TYPES).map(ore => ore.health);
            for (let i = 1; i < healths.length; i++) {
                expect(healths[i]).toBeGreaterThan(healths[i - 1]);
            }
        });
    });

    describe('ZONE_BONUS', () => {
        test('should have increasing zone bonuses', () => {
            expect(ZONE_BONUS.surface).toBe(1.0);
            expect(ZONE_BONUS.cave).toBeGreaterThan(ZONE_BONUS.surface);
            expect(ZONE_BONUS.crystal).toBeGreaterThan(ZONE_BONUS.cave);
            expect(ZONE_BONUS.lava).toBeGreaterThan(ZONE_BONUS.crystal);
        });

        test('lava zone should have 2.0x bonus', () => {
            expect(ZONE_BONUS.lava).toBe(2.0);
        });
    });

    describe('calculateOreValue', () => {
        test('should calculate base value correctly', () => {
            const value = calculateOreValue('coal', 'common', 'surface');
            expect(value).toBe(5); // 5 * 1.0 * 1.0
        });

        test('should apply rarity multiplier', () => {
            const commonValue = calculateOreValue('coal', 'common', 'surface');
            const uncommonValue = calculateOreValue('coal', 'uncommon', 'surface');
            expect(uncommonValue).toBe(Math.floor(5 * 1.5 * 1.0));
        });

        test('should apply zone bonus', () => {
            const surfaceValue = calculateOreValue('coal', 'common', 'surface');
            const lavaValue = calculateOreValue('coal', 'common', 'lava');
            expect(lavaValue).toBe(surfaceValue * 2);
        });

        test('should handle mythic rarity correctly', () => {
            const value = calculateOreValue('mythic_ore', 'mythic', 'lava');
            expect(value).toBe(Math.floor(320 * 15.0 * 2.0));
        });

        test('should handle invalid zone with default 1.0', () => {
            const value = calculateOreValue('coal', 'common', 'invalid_zone');
            expect(value).toBe(5); // 5 * 1.0 * 1.0
        });
    });

    describe('getRandomRarity', () => {
        test('should always return a valid rarity', () => {
            for (let i = 0; i < 100; i++) {
                const rarity = getRandomRarity('surface');
                expect(Object.values(RARITY)).toContain(rarity);
            }
        });

        test('surface zone should favor common/uncommon', () => {
            let commonCount = 0;
            let uncommonCount = 0;
            const iterations = 1000;
            
            for (let i = 0; i < iterations; i++) {
                const rarity = getRandomRarity('surface');
                if (rarity.id === 'common') commonCount++;
                if (rarity.id === 'uncommon') uncommonCount++;
            }
            
            expect(commonCount + uncommonCount).toBeGreaterThan(iterations * 0.9);
        });

        test('lava zone should have chance for mythic', () => {
            let mythicCount = 0;
            const iterations = 1000;
            
            for (let i = 0; i < iterations; i++) {
                const rarity = getRandomRarity('lava');
                if (rarity.id === 'mythic') mythicCount++;
            }
            
            expect(mythicCount).toBeGreaterThan(0);
        });

        test('should handle invalid zone with surface weights', () => {
            const rarity = getRandomRarity('invalid_zone');
            expect(Object.values(RARITY)).toContain(rarity);
        });
    });

    describe('getRandomOreType', () => {
        test('should return valid ore type for zone', () => {
            const oreType = getRandomOreType('surface', RARITY.COMMON);
            expect(Object.values(ORE_TYPES)).toContain(oreType);
        });

        test('surface zone should only return coal or iron', () => {
            const validTypes = ['COAL', 'IRON'];
            for (let i = 0; i < 100; i++) {
                const oreType = getRandomOreType('surface', RARITY.COMMON);
                expect(validTypes).toContain(oreType.id.toUpperCase());
            }
        });

        test('lava zone should include mythic ore', () => {
            const validTypes = ['DIAMOND', 'RUBY', 'MYTHIC_ORE'];
            for (let i = 0; i < 100; i++) {
                const oreType = getRandomOreType('lava', RARITY.MYTHIC);
                expect(validTypes).toContain(oreType.id.toUpperCase());
            }
        });
    });

    describe('generateOre', () => {
        test('should generate ore with all required properties', () => {
            const ore = generateOre('surface', 100, 100);
            expect(ore).toHaveProperty('x');
            expect(ore).toHaveProperty('y');
            expect(ore).toHaveProperty('width');
            expect(ore).toHaveProperty('height');
            expect(ore).toHaveProperty('type');
            expect(ore).toHaveProperty('typeId');
            expect(ore).toHaveProperty('rarity');
            expect(ore).toHaveProperty('rarityId');
            expect(ore).toHaveProperty('color');
            expect(ore).toHaveProperty('value');
            expect(ore).toHaveProperty('requiredPower');
            expect(ore).toHaveProperty('health');
            expect(ore).toHaveProperty('maxHealth');
        });

        test('should set correct position', () => {
            const ore = generateOre('surface', 150, 200);
            expect(ore.x).toBe(150);
            expect(ore.y).toBe(200);
        });

        test('should have health equal to maxHealth', () => {
            const ore = generateOre('surface', 100, 100);
            expect(ore.health).toBe(ore.maxHealth);
        });
    });

    describe('calculateOreHP', () => {
        test('should calculate base HP correctly', () => {
            const hp = calculateOreHP('surface', 'common', 10);
            expect(hp).toBe(10); // 10 * 1.0 * 1.0
        });

        test('should apply zone multiplier', () => {
            const surfaceHP = calculateOreHP('surface', 'common', 10);
            const lavaHP = calculateOreHP('lava', 'common', 10);
            expect(lavaHP).toBe(surfaceHP * 3);
        });

        test('should apply rarity multiplier', () => {
            const commonHP = calculateOreHP('surface', 'common', 10);
            const mythicHP = calculateOreHP('surface', 'mythic', 10);
            expect(mythicHP).toBe(Math.floor(10 * 1.0 * 3.5));
        });

        test('should handle invalid inputs gracefully', () => {
            const hp = calculateOreHP('invalid', 'invalid', 10);
            expect(hp).toBe(10); // 10 * 1.0 * 1.0 (defaults)
        });
    });
});
