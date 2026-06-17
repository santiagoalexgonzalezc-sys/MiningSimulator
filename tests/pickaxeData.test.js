/**
 * Unit tests for pickaxeData.js
 * Tests pickaxe progression, damage calculations, and scaling
 */

import { 
    PICKAXES, 
    PICKAXE_ORDER, 
    getPickaxe, 
    getNextPickaxe,
    calculateMiningDamage,
    isCriticalHit
} from '../src/pickaxeData.js';

describe('pickaxeData.js', () => {
    describe('PICKAXES definitions', () => {
        test('should have all required pickaxe tiers', () => {
            expect(PICKAXES).toHaveProperty('WOODEN');
            expect(PICKAXES).toHaveProperty('STONE');
            expect(PICKAXES).toHaveProperty('IRON');
            expect(PICKAXES).toHaveProperty('STEEL');
            expect(PICKAXES).toHaveProperty('GOLD');
            expect(PICKAXES).toHaveProperty('DIAMOND');
            expect(PICKAXES).toHaveProperty('MYTHIC');
        });

        test('should have 20-50% power growth per upgrade', () => {
            const powers = PICKAXE_ORDER.map(id => PICKAXES[id.toUpperCase()].miningPower);
            for (let i = 1; i < powers.length; i++) {
                const growth = ((powers[i] - powers[i - 1]) / powers[i - 1]) * 100;
                expect(growth).toBeGreaterThanOrEqual(20);
                expect(growth).toBeLessThanOrEqual(50);
            }
        });

        test('should have increasing mining speed', () => {
            const speeds = PICKAXE_ORDER.map(id => PICKAXES[id.toUpperCase()].miningSpeed);
            for (let i = 1; i < speeds.length; i++) {
                expect(speeds[i]).toBeGreaterThan(speeds[i - 1]);
            }
        });

        test('should have increasing crit chance', () => {
            const critChances = PICKAXE_ORDER.map(id => PICKAXES[id.toUpperCase()].critChance);
            for (let i = 1; i < critChances.length; i++) {
                expect(critChances[i]).toBeGreaterThan(critChances[i - 1]);
            }
        });

        test('should have increasing costs', () => {
            const costs = PICKAXE_ORDER.map(id => PICKAXES[id.toUpperCase()].cost);
            for (let i = 1; i < costs.length; i++) {
                expect(costs[i]).toBeGreaterThan(costs[i - 1]);
            }
        });

        test('mythic pickaxe should have 110 power', () => {
            expect(PICKAXES.MYTHIC.miningPower).toBe(110);
        });

        test('wooden pickaxe should be free', () => {
            expect(PICKAXES.WOODEN.cost).toBe(0);
        });
    });

    describe('PICKAXE_ORDER', () => {
        test('should have correct progression order', () => {
            expect(PICKAXE_ORDER).toEqual(['wooden', 'stone', 'iron', 'steel', 'gold', 'diamond', 'mythic']);
        });

        test('should match PICKAXES keys', () => {
            PICKAXE_ORDER.forEach(id => {
                expect(PICKAXES[id.toUpperCase()]).toBeDefined();
            });
        });
    });

    describe('getPickaxe', () => {
        test('should return correct pickaxe by ID', () => {
            const pickaxe = getPickaxe('stone');
            expect(pickaxe.id).toBe('stone');
            expect(pickaxe.name).toBe('Stone Pickaxe');
        });

        test('should be case-insensitive', () => {
            const pickaxe1 = getPickaxe('iron');
            const pickaxe2 = getPickaxe('IRON');
            const pickaxe3 = getPickaxe('Iron');
            expect(pickaxe1).toEqual(pickaxe2);
            expect(pickaxe1).toEqual(pickaxe3);
        });

        test('should return wooden pickaxe for invalid ID', () => {
            const pickaxe = getPickaxe('invalid_pickaxe');
            expect(pickaxe.id).toBe('wooden');
        });
    });

    describe('getNextPickaxe', () => {
        test('should return next pickaxe in progression', () => {
            const next = getNextPickaxe('wooden');
            expect(next.id).toBe('stone');
        });

        test('should return null for last pickaxe', () => {
            const next = getNextPickaxe('mythic');
            expect(next).toBeNull();
        });

        test('should return null for invalid pickaxe', () => {
            const next = getNextPickaxe('invalid');
            expect(next).toBeNull();
        });

        test('should handle entire progression chain', () => {
            let current = 'wooden';
            const expectedOrder = ['stone', 'iron', 'steel', 'gold', 'diamond', 'mythic'];
            
            for (const expected of expectedOrder) {
                const next = getNextPickaxe(current);
                expect(next.id).toBe(expected);
                current = expected;
            }
            
            expect(getNextPickaxe('mythic')).toBeNull();
        });
    });

    describe('calculateMiningDamage', () => {
        test('should return base power for non-critical hit', () => {
            const pickaxe = getPickaxe('stone');
            const damage = calculateMiningDamage(pickaxe, false);
            expect(damage).toBe(15);
        });

        test('should apply crit multiplier for critical hit', () => {
            const pickaxe = getPickaxe('stone');
            const damage = calculateMiningDamage(pickaxe, true);
            expect(damage).toBe(Math.floor(15 * 2.1));
        });

        test('mythic pickaxe should deal high damage on crit', () => {
            const pickaxe = getPickaxe('mythic');
            const damage = calculateMiningDamage(pickaxe, true);
            expect(damage).toBe(Math.floor(110 * 2.6));
        });

        test('should handle wooden pickaxe correctly', () => {
            const pickaxe = getPickaxe('wooden');
            expect(calculateMiningDamage(pickaxe, false)).toBe(10);
            expect(calculateMiningDamage(pickaxe, true)).toBe(20);
        });
    });

    describe('isCriticalHit', () => {
        test('should return boolean', () => {
            const pickaxe = getPickaxe('stone');
            const result = isCriticalHit(pickaxe);
            expect(typeof result).toBe('boolean');
        });

        test('should respect crit chance over many iterations', () => {
            const pickaxe = getPickaxe('stone');
            const iterations = 10000;
            let critCount = 0;
            
            for (let i = 0; i < iterations; i++) {
                if (isCriticalHit(pickaxe)) critCount++;
            }
            
            const critRate = critCount / iterations;
            expect(critRate).toBeGreaterThan(0.04);
            expect(critRate).toBeLessThan(0.08);
        });

        test('higher crit chance should result in more crits', () => {
            const lowCritPickaxe = getPickaxe('wooden');
            const highCritPickaxe = getPickaxe('mythic');
            const iterations = 10000;
            
            let lowCritCount = 0;
            let highCritCount = 0;
            
            for (let i = 0; i < iterations; i++) {
                if (isCriticalHit(lowCritPickaxe)) lowCritCount++;
                if (isCriticalHit(highCritPickaxe)) highCritCount++;
            }
            
            expect(highCritCount).toBeGreaterThan(lowCritCount);
        });
    });

    describe('Economy balance checks', () => {
        test('pickaxe costs should scale with ore values', () => {
            // Stone pickaxe costs 50, should be affordable with early game ores
            const stoneCost = PICKAXES.STONE.cost;
            const coalValue = 5;
            const ironValue = 10;
            
            // Player should need to mine ~5-10 coal or ~3-5 iron to afford stone
            expect(stoneCost).toBeGreaterThan(coalValue * 3);
            expect(stoneCost).toBeLessThan(coalValue * 15);
        });

        test('mythic pickaxe should be expensive but reachable', () => {
            const mythicCost = PICKAXES.MYTHIC.cost;
            const mythicOreValue = 320;
            
            // Should require mining multiple mythic ores
            expect(mythicCost).toBeGreaterThan(mythicOreValue);
            expect(mythicCost).toBeLessThan(mythicOreValue * 100);
        });

        test('power progression should not exceed guidelines', () => {
            const powers = PICKAXE_ORDER.map(id => PICKAXES[id.toUpperCase()].miningPower);
            const firstPower = powers[0];
            const lastPower = powers[powers.length - 1];
            
            // Total growth should be reasonable (not 1000x)
            const totalGrowth = lastPower / firstPower;
            expect(totalGrowth).toBeLessThan(20);
        });
    });
});
