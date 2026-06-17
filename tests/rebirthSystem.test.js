/**
 * Unit tests for rebirthSystem.js
 * Tests additive rebirth growth, luck capping, and upgrade calculations
 */

import { 
    REBIRTH_REQUIREMENTS,
    REBIRTH_REWARDS,
    PERMANENT_UPGRADES,
    calculateRebirthPoints,
    calculateRebirthMultiplier,
    calculateUpgradeCost,
    calculateUpgradeEffect,
    getUpgrade,
    getUpgradesByCategory,
    canRebirth,
    getRebirthRequirementStatus
} from '../src/rebirthSystem.js';

describe('rebirthSystem.js', () => {
    describe('REBIRTH_REQUIREMENTS', () => {
        test('should have balanced requirements', () => {
            expect(REBIRTH_REQUIREMENTS.MIN_MONEY).toBe(50000);
            expect(REBIRTH_REQUIREMENTS.MIN_LEVEL).toBe(30);
            expect(REBIRTH_REQUIREMENTS.MIN_QUESTS_COMPLETED).toBe(5);
        });

        test('requirements should be achievable with rebalanced economy', () => {
            const mythicOreValue = 320;
            const requiredMoney = REBIRTH_REQUIREMENTS.MIN_MONEY;
            
            // Should require mining ~150 mythic ores (reasonable for endgame)
            expect(requiredMoney).toBeGreaterThan(mythicOreValue * 100);
            expect(requiredMoney).toBeLessThan(mythicOreValue * 200);
        });
    });

    describe('REBIRTH_REWARDS', () => {
        test('should use linear RP scaling', () => {
            expect(REBIRTH_REWARDS.RP_SCALING).toBe(1.0);
        });

        test('should have 5% bonus per rebirth for main stats', () => {
            expect(REBIRTH_REWARDS.BASE_MINING_SPEED).toBe(0.05);
            expect(REBIRTH_REWARDS.BASE_ORE_VALUE).toBe(0.05);
            expect(REBIRTH_REWARDS.BASE_XP_GAIN).toBe(0.05);
        });

        test('should have 2% luck per rebirth', () => {
            expect(REBIRTH_REWARDS.BASE_LUCK).toBe(0.02);
        });
    });

    describe('PERMANENT_UPGRADES', () => {
        test('should have upgrades in all categories', () => {
            expect(getUpgradesByCategory('mining').length).toBeGreaterThan(0);
            expect(getUpgradesByCategory('luck').length).toBeGreaterThan(0);
            expect(getUpgradesByCategory('inventory').length).toBeGreaterThan(0);
            expect(getUpgradesByCategory('pets').length).toBeGreaterThan(0);
            expect(getUpgradesByCategory('economy').length).toBeGreaterThan(0);
            expect(getUpgradesByCategory('progression').length).toBeGreaterThan(0);
        });

        test('all upgrades should have required properties', () => {
            Object.values(PERMANENT_UPGRADES).forEach(upgrade => {
                expect(upgrade).toHaveProperty('id');
                expect(upgrade).toHaveProperty('name');
                expect(upgrade).toHaveProperty('description');
                expect(upgrade).toHaveProperty('baseCost');
                expect(upgrade).toHaveProperty('costScaling');
                expect(upgrade).toHaveProperty('maxLevel');
                expect(upgrade).toHaveProperty('effect');
                expect(upgrade).toHaveProperty('category');
            });
        });

        test('cost scaling should be 2.0x for all upgrades', () => {
            Object.values(PERMANENT_UPGRADES).forEach(upgrade => {
                expect(upgrade.costScaling).toBe(2.0);
            });
        });

        test('effects should be reduced for balance', () => {
            // Mining speed should be 2% per level (not 5%)
            expect(PERMANENT_UPGRADES.MINING_SPEED_BOOST.effect).toBe(0.02);
            
            // Luck should be 2% per level (not 3%)
            expect(PERMANENT_UPGRADES.ORE_RARITY_LUCK.effect).toBe(0.02);
            
            // Pet XP should be 10% per level (not 20%)
            expect(PERMANENT_UPGRADES.FASTER_PET_LEVELING.effect).toBe(0.10);
        });

        test('max levels should be reduced to prevent overpowered combinations', () => {
            expect(PERMANENT_UPGRADES.MINING_SPEED_BOOST.maxLevel).toBe(20);
            expect(PERMANENT_UPGRADES.ORE_RARITY_LUCK.maxLevel).toBe(15);
            expect(PERMANENT_UPGRADES.BACKPACK_CAPACITY_MULTIPLIER.maxLevel).toBe(10);
        });
    });

    describe('calculateRebirthPoints', () => {
        test('should use linear scaling (+1 RP per rebirth)', () => {
            expect(calculateRebirthPoints(0)).toBe(1);
            expect(calculateRebirthPoints(1)).toBe(2);
            expect(calculateRebirthPoints(2)).toBe(3);
            expect(calculateRebirthPoints(10)).toBe(11);
        });

        test('should not use exponential scaling', () => {
            const rebirth1 = calculateRebirthPoints(1);
            const rebirth2 = calculateRebirthPoints(2);
            const rebirth10 = calculateRebirthPoints(10);
            
            // Linear: 2, 3, 11
            // Exponential would be much higher
            expect(rebirth10).toBeLessThan(20);
        });

        test('should be additive, not multiplicative', () => {
            const rp0 = calculateRebirthPoints(0);
            const rp1 = calculateRebirthPoints(1);
            const rp2 = calculateRebirthPoints(2);
            
            expect(rp1 - rp0).toBe(1);
            expect(rp2 - rp1).toBe(1);
        });
    });

    describe('calculateRebirthMultiplier', () => {
        test('should calculate mining speed multiplier correctly', () => {
            expect(calculateRebirthMultiplier(0, 'mining_speed')).toBe(1.0);
            expect(calculateRebirthMultiplier(1, 'mining_speed')).toBe(1.05);
            expect(calculateRebirthMultiplier(10, 'mining_speed')).toBe(1.5);
        });

        test('should calculate ore value multiplier correctly', () => {
            expect(calculateRebirthMultiplier(0, 'ore_value')).toBe(1.0);
            expect(calculateRebirthMultiplier(1, 'ore_value')).toBe(1.05);
            expect(calculateRebirthMultiplier(10, 'ore_value')).toBe(1.5);
        });

        test('should calculate XP gain multiplier correctly', () => {
            expect(calculateRebirthMultiplier(0, 'xp_gain')).toBe(1.0);
            expect(calculateRebirthMultiplier(1, 'xp_gain')).toBe(1.05);
        });

        test('should cap luck at 300% (3.0 multiplier)', () => {
            expect(calculateRebirthMultiplier(0, 'luck')).toBe(0);
            expect(calculateRebirthMultiplier(10, 'luck')).toBe(0.2); // 10 * 0.02
            expect(calculateRebirthMultiplier(150, 'luck')).toBe(3.0); // Capped
            expect(calculateRebirthMultiplier(200, 'luck')).toBe(3.0); // Still capped
        });

        test('luck cap should prevent excessive luck', () => {
            const extremeRebirths = 1000;
            const luck = calculateRebirthMultiplier(extremeRebirths, 'luck');
            expect(luck).toBeLessThanOrEqual(3.0);
        });

        test('should use additive growth for all multipliers', () => {
            const speed1 = calculateRebirthMultiplier(1, 'mining_speed');
            const speed2 = calculateRebirthMultiplier(2, 'mining_speed');
            const speed10 = calculateRebirthMultiplier(10, 'mining_speed');
            
            // Each rebirth adds 5%
            expect(speed2 - speed1).toBe(0.05);
            expect(speed10).toBe(1 + (10 * 0.05));
        });
    });

    describe('calculateUpgradeCost', () => {
        test('should calculate cost with 2.0x scaling', () => {
            const upgrade = PERMANENT_UPGRADES.MINING_SPEED_BOOST;
            expect(calculateUpgradeCost('mining_speed_boost', 0)).toBe(1);
            expect(calculateUpgradeCost('mining_speed_boost', 1)).toBe(2);
            expect(calculateUpgradeCost('mining_speed_boost', 2)).toBe(4);
            expect(calculateUpgradeCost('mining_speed_boost', 3)).toBe(8);
        });

        test('should return Infinity for maxed upgrades', () => {
            const upgrade = PERMANENT_UPGRADES.MINING_SPEED_BOOST;
            const cost = calculateUpgradeCost('mining_speed_boost', 20);
            expect(cost).toBe(Infinity);
        });

        test('should return Infinity for invalid upgrade', () => {
            const cost = calculateUpgradeCost('invalid_upgrade', 0);
            expect(cost).toBe(Infinity);
        });

        test('costs should rise quickly to force choices', () => {
            const upgrade = PERMANENT_UPGRADES.MINING_SPEED_BOOST;
            const cost5 = calculateUpgradeCost('mining_speed_boost', 5);
            const cost10 = calculateUpgradeCost('mining_speed_boost', 10);
            
            // Cost should double every level
            expect(cost10).toBeGreaterThan(cost5 * 10);
        });
    });

    describe('calculateUpgradeEffect', () => {
        test('should calculate effect linearly with level', () => {
            const upgrade = PERMANENT_UPGRADES.MINING_SPEED_BOOST;
            expect(calculateUpgradeEffect('mining_speed_boost', 0)).toBe(0);
            expect(calculateUpgradeEffect('mining_speed_boost', 1)).toBe(0.02);
            expect(calculateUpgradeEffect('mining_speed_boost', 5)).toBe(0.10);
            expect(calculateUpgradeEffect('mining_speed_boost', 10)).toBe(0.20);
        });

        test('should return 0 for invalid upgrade', () => {
            const effect = calculateUpgradeEffect('invalid_upgrade', 5);
            expect(effect).toBe(0);
        });

        test('should handle different effect types', () => {
            const moneyEffect = calculateUpgradeEffect('starting_money_boost', 5);
            expect(moneyEffect).toBe(1000); // 200 * 5
        });
    });

    describe('getUpgrade', () => {
        test('should return correct upgrade by ID', () => {
            const upgrade = getUpgrade('mining_speed_boost');
            expect(upgrade.id).toBe('mining_speed_boost');
            expect(upgrade.name).toBe('Mining Speed Boost');
        });

        test('should be case-insensitive', () => {
            const upgrade1 = getUpgrade('mining_speed_boost');
            const upgrade2 = getUpgrade('MINING_SPEED_BOOST');
            expect(upgrade1).toEqual(upgrade2);
        });

        test('should return null for invalid upgrade', () => {
            const upgrade = getUpgrade('invalid_upgrade');
            expect(upgrade).toBeNull();
        });
    });

    describe('getUpgradesByCategory', () => {
        test('should return upgrades in correct category', () => {
            const miningUpgrades = getUpgradesByCategory('mining');
            miningUpgrades.forEach(upgrade => {
                expect(upgrade.category).toBe('mining');
            });
        });

        test('should return empty array for invalid category', () => {
            const upgrades = getUpgradesByCategory('invalid_category');
            expect(upgrades).toEqual([]);
        });
    });

    describe('canRebirth', () => {
        test('should return true if any requirement is met', () => {
            const mockPlayer = { money: 60000, level: 35 };
            const mockQuestManager = { getCompletedQuestCount: () => 6 };
            
            expect(canRebirth(mockPlayer, mockQuestManager)).toBe(true);
        });

        test('should return false if no requirements are met', () => {
            const mockPlayer = { money: 10000, level: 10 };
            const mockQuestManager = { getCompletedQuestCount: () => 1 };
            
            expect(canRebirth(mockPlayer, mockQuestManager)).toBe(false);
        });

        test('should check money requirement', () => {
            const mockPlayer = { money: 60000, level: 10 };
            const mockQuestManager = { getCompletedQuestCount: () => 1 };
            
            expect(canRebirth(mockPlayer, mockQuestManager)).toBe(true);
        });

        test('should check level requirement', () => {
            const mockPlayer = { money: 10000, level: 35 };
            const mockQuestManager = { getCompletedQuestCount: () => 1 };
            
            expect(canRebirth(mockPlayer, mockQuestManager)).toBe(true);
        });

        test('should check quest requirement', () => {
            const mockPlayer = { money: 10000, level: 10 };
            const mockQuestManager = { getCompletedQuestCount: () => 6 };
            
            expect(canRebirth(mockPlayer, mockQuestManager)).toBe(true);
        });
    });

    describe('getRebirthRequirementStatus', () => {
        test('should return status for all requirements', () => {
            const mockPlayer = { money: 60000, level: 35 };
            const mockQuestManager = { getCompletedQuestCount: () => 6 };
            
            const status = getRebirthRequirementStatus(mockPlayer, mockQuestManager);
            
            expect(status).toHaveProperty('money');
            expect(status).toHaveProperty('level');
            expect(status).toHaveProperty('quests');
        });

        test('should show correct met status', () => {
            const mockPlayer = { money: 60000, level: 35 };
            const mockQuestManager = { getCompletedQuestCount: () => 6 };
            
            const status = getRebirthRequirementStatus(mockPlayer, mockQuestManager);
            
            expect(status.money.met).toBe(true);
            expect(status.level.met).toBe(true);
            expect(status.quests.met).toBe(true);
        });

        test('should show current and required values', () => {
            const mockPlayer = { money: 60000, level: 35 };
            const mockQuestManager = { getCompletedQuestCount: () => 6 };
            
            const status = getRebirthRequirementStatus(mockPlayer, mockQuestManager);
            
            expect(status.money.current).toBe(60000);
            expect(status.money.required).toBe(50000);
            expect(status.level.current).toBe(35);
            expect(status.level.required).toBe(30);
        });
    });

    describe('Economy balance checks', () => {
        test('rebirth should not give exponential power', () => {
            const rebirth1 = calculateRebirthMultiplier(1, 'mining_speed');
            const rebirth10 = calculateRebirthMultiplier(10, 'mining_speed');
            
            // 10 rebirths should give 50% boost, not 1000%+
            expect(rebirth10).toBeLessThan(2.0);
        });

        test('luck should never exceed 300%', () => {
            for (let i = 0; i < 1000; i++) {
                const luck = calculateRebirthMultiplier(i, 'luck');
                expect(luck).toBeLessThanOrEqual(3.0);
            }
        });

        test('upgrade costs should force meaningful choices', () => {
            const cost1 = calculateUpgradeCost('mining_speed_boost', 0);
            const cost10 = calculateUpgradeCost('mining_speed_boost', 9);
            
            // Level 10 should cost much more than level 1
            expect(cost10).toBeGreaterThan(cost1 * 100);
        });

        test('total RP from 10 rebirths should be reasonable', () => {
            const totalRP = calculateRebirthPoints(10);
            expect(totalRP).toBe(11); // 1 + 10
            
            // Should be enough for some upgrades but not all
            const maxUpgradeCost = calculateUpgradeCost('mining_speed_boost', 19);
            expect(totalRP).toBeLessThan(maxUpgradeCost);
        });
    });
});
