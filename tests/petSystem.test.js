/**
 * Unit tests for petSystem.js
 * Tests pet bonuses, capping at 25%, egg hatching, and rarity systems
 */

import { 
    PET_RARITY, 
    PET_BONUS_TYPES, 
    PETS, 
    EGGS, 
    getPet, 
    getEgg, 
    getRarityInfo,
    calculatePetBonus,
    getPetsByRarity,
    hatchEgg,
    calculateTotalBonus
} from '../src/petSystem.js';

describe('petSystem.js', () => {
    describe('PET_RARITY', () => {
        test('should have all required rarity tiers', () => {
            expect(PET_RARITY).toHaveProperty('COMMON');
            expect(PET_RARITY).toHaveProperty('UNCOMMON');
            expect(PET_RARITY).toHaveProperty('RARE');
            expect(PET_RARITY).toHaveProperty('EPIC');
            expect(PET_RARITY).toHaveProperty('LEGENDARY');
            expect(PET_RARITY).toHaveProperty('MYTHIC');
        });

        test('all rarity multipliers should be 1.0 (removed for balance)', () => {
            Object.values(PET_RARITY).forEach(rarity => {
                expect(rarity.bonusMultiplier).toBe(1.0);
            });
        });

        test('should have increasing max levels', () => {
            expect(PET_RARITY.COMMON.maxLevel).toBe(10);
            expect(PET_RARITY.UNCOMMON.maxLevel).toBe(15);
            expect(PET_RARITY.RARE.maxLevel).toBe(20);
            expect(PET_RARITY.EPIC.maxLevel).toBe(25);
            expect(PET_RARITY.LEGENDARY.maxLevel).toBe(30);
            expect(PET_RARITY.MYTHIC.maxLevel).toBe(50);
        });
    });

    describe('PET_BONUS_TYPES', () => {
        test('should have all required bonus types', () => {
            expect(PET_BONUS_TYPES).toHaveProperty('MINING_SPEED');
            expect(PET_BONUS_TYPES).toHaveProperty('ORE_VALUE');
            expect(PET_BONUS_TYPES).toHaveProperty('XP_GAIN');
            expect(PET_BONUS_TYPES).toHaveProperty('CRIT_CHANCE');
            expect(PET_BONUS_TYPES).toHaveProperty('BACKPACK_CAPACITY');
        });
    });

    describe('PETS definitions', () => {
        test('should have pets for each rarity', () => {
            expect(getPetsByRarity('COMMON').length).toBeGreaterThan(0);
            expect(getPetsByRarity('UNCOMMON').length).toBeGreaterThan(0);
            expect(getPetsByRarity('RARE').length).toBeGreaterThan(0);
            expect(getPetsByRarity('EPIC').length).toBeGreaterThan(0);
            expect(getPetsByRarity('LEGENDARY').length).toBeGreaterThan(0);
            expect(getPetsByRarity('MYTHIC').length).toBeGreaterThan(0);
        });

        test('all pets should have required properties', () => {
            Object.values(PETS).forEach(pet => {
                expect(pet).toHaveProperty('id');
                expect(pet).toHaveProperty('name');
                expect(pet).toHaveProperty('rarity');
                expect(pet).toHaveProperty('description');
                expect(pet).toHaveProperty('bonusType');
                expect(pet).toHaveProperty('baseBonus');
                expect(pet).toHaveProperty('emoji');
            });
        });

        test('base bonuses should be within reasonable range', () => {
            Object.values(PETS).forEach(pet => {
                expect(pet.baseBonus).toBeGreaterThan(0);
                expect(pet.baseBonus).toBeLessThanOrEqual(0.25);
            });
        });
    });

    describe('EGGS definitions', () => {
        test('should have eggs for each rarity', () => {
            expect(EGGS).toHaveProperty('COMMON_EGG');
            expect(EGGS).toHaveProperty('UNCOMMON_EGG');
            expect(EGGS).toHaveProperty('RARE_EGG');
            expect(EGGS).toHaveProperty('EPIC_EGG');
            expect(EGGS).toHaveProperty('LEGENDARY_EGG');
        });

        test('egg costs should scale with rarity', () => {
            expect(EGGS.COMMON_EGG.cost).toBeLessThan(EGGS.UNCOMMON_EGG.cost);
            expect(EGGS.UNCOMMON_EGG.cost).toBeLessThan(EGGS.RARE_EGG.cost);
            expect(EGGS.RARE_EGG.cost).toBeLessThan(EGGS.EPIC_EGG.cost);
            expect(EGGS.EPIC_EGG.cost).toBeLessThan(EGGS.LEGENDARY_EGG.cost);
        });

        test('higher tier eggs should have chance for better pets', () => {
            expect(EGGS.COMMON_EGG.hatchChances.MYTHIC).toBe(0);
            expect(EGGS.LEGENDARY_EGG.hatchChances.MYTHIC).toBeGreaterThan(0);
        });

        test('hatch chances should sum to 1.0', () => {
            Object.values(EGGS).forEach(egg => {
                const sum = Object.values(egg.hatchChances).reduce((a, b) => a + b, 0);
                expect(sum).toBeCloseTo(1.0, 2);
            });
        });
    });

    describe('getPet', () => {
        test('should return correct pet by ID', () => {
            const pet = getPet('rocky');
            expect(pet.id).toBe('rocky');
            expect(pet.name).toBe('Rocky');
        });

        test('should be case-insensitive', () => {
            const pet1 = getPet('rocky');
            const pet2 = getPet('ROCKY');
            const pet3 = getPet('Rocky');
            expect(pet1).toEqual(pet2);
            expect(pet1).toEqual(pet3);
        });

        test('should return null for invalid pet ID', () => {
            const pet = getPet('invalid_pet');
            expect(pet).toBeNull();
        });
    });

    describe('getEgg', () => {
        test('should return correct egg by ID', () => {
            const egg = getEgg('common_egg');
            expect(egg.id).toBe('common_egg');
            expect(egg.name).toBe('Common Egg');
        });

        test('should be case-insensitive', () => {
            const egg1 = getEgg('common_egg');
            const egg2 = getEgg('COMMON_EGG');
            expect(egg1).toEqual(egg2);
        });

        test('should return null for invalid egg ID', () => {
            const egg = getEgg('invalid_egg');
            expect(egg).toBeNull();
        });
    });

    describe('getRarityInfo', () => {
        test('should return correct rarity info', () => {
            const info = getRarityInfo('common');
            expect(info.name).toBe('Common');
            expect(info.color).toBe('#95a5a6');
        });

        test('should be case-insensitive', () => {
            const info1 = getRarityInfo('common');
            const info2 = getRarityInfo('COMMON');
            expect(info1).toEqual(info2);
        });

        test('should default to COMMON for invalid rarity', () => {
            const info = getRarityInfo('invalid');
            expect(info.name).toBe('Common');
        });
    });

    describe('calculatePetBonus', () => {
        test('should calculate bonus correctly at level 1', () => {
            const pet = getPet('rocky');
            const bonus = calculatePetBonus(pet, 1);
            expect(bonus).toBeCloseTo(0.05 * 1.0 * 1.0, 2);
        });

        test('should apply level bonus (2% per level)', () => {
            const pet = getPet('rocky');
            const level1Bonus = calculatePetBonus(pet, 1);
            const level10Bonus = calculatePetBonus(pet, 10);
            expect(level10Bonus).toBeGreaterThan(level1Bonus);
        });

        test('should cap bonus at 25% maximum', () => {
            const pet = getPet('stardragon'); // Mythic pet with 0.25 base
            const maxLevelBonus = calculatePetBonus(pet, 50);
            expect(maxLevelBonus).toBeLessThanOrEqual(0.25);
        });

        test('level growth should be 2% per level', () => {
            const pet = getPet('rocky');
            const level1Bonus = calculatePetBonus(pet, 1);
            const level2Bonus = calculatePetBonus(pet, 2);
            const expectedGrowth = level1Bonus * 0.02;
            expect(level2Bonus - level1Bonus).toBeCloseTo(expectedGrowth, 3);
        });

        test('mythic pets should not exceed 25% even at max level', () => {
            const mythicPet = getPet('stardragon');
            const bonus = calculatePetBonus(mythicPet, 50);
            expect(bonus).toBeLessThanOrEqual(0.25);
        });

        test('common pets should stay within reasonable range', () => {
            const commonPet = getPet('rocky');
            const maxBonus = calculatePetBonus(commonPet, 10);
            expect(maxBonus).toBeLessThanOrEqual(0.25);
        });
    });

    describe('getPetsByRarity', () => {
        test('should return correct number of pets per rarity', () => {
            expect(getPetsByRarity('COMMON').length).toBe(2);
            expect(getPetsByRarity('UNCOMMON').length).toBe(2);
            expect(getPetsByRarity('RARE').length).toBe(2);
            expect(getPetsByRarity('EPIC').length).toBe(2);
            expect(getPetsByRarity('LEGENDARY').length).toBe(2);
            expect(getPetsByRarity('MYTHIC').length).toBe(2);
        });

        test('should return pets with correct rarity', () => {
            const commonPets = getPetsByRarity('COMMON');
            commonPets.forEach(pet => {
                expect(pet.rarity).toBe('COMMON');
            });
        });

        test('should return empty array for invalid rarity', () => {
            const pets = getPetsByRarity('INVALID');
            expect(pets).toEqual([]);
        });
    });

    describe('hatchEgg', () => {
        test('should return a valid pet', () => {
            const pet = hatchEgg('common_egg');
            expect(pet).toBeDefined();
            expect(pet.id).toBeDefined();
            expect(pet.name).toBeDefined();
        });

        test('common egg should mostly hatch common pets', () => {
            let commonCount = 0;
            const iterations = 100;
            
            for (let i = 0; i < iterations; i++) {
                const pet = hatchEgg('common_egg');
                if (pet.rarity === 'COMMON') commonCount++;
            }
            
            expect(commonCount).toBeGreaterThan(iterations * 0.7);
        });

        test('legendary egg should have chance for mythic pets', () => {
            let mythicCount = 0;
            const iterations = 100;
            
            for (let i = 0; i < iterations; i++) {
                const pet = hatchEgg('legendary_egg');
                if (pet.rarity === 'MYTHIC') mythicCount++;
            }
            
            expect(mythicCount).toBeGreaterThan(0);
        });

        test('should return null for invalid egg', () => {
            const pet = hatchEgg('invalid_egg');
            expect(pet).toBeNull();
        });
    });

    describe('calculateTotalBonus', () => {
        test('should sum bonuses from multiple pets', () => {
            const pet1 = { ...getPet('rocky'), level: 1 };
            const pet2 = { ...getPet('sparky'), level: 1 };
            const equippedPets = [pet1, pet2];
            
            const total = calculateTotalBonus(equippedPets, PET_BONUS_TYPES.MINING_SPEED);
            expect(total).toBeGreaterThan(0);
        });

        test('should only sum pets with matching bonus type', () => {
            const pet1 = { ...getPet('rocky'), level: 1, bonusType: PET_BONUS_TYPES.MINING_SPEED };
            const pet2 = { ...getPet('sparky'), level: 1, bonusType: PET_BONUS_TYPES.ORE_VALUE };
            const equippedPets = [pet1, pet2];
            
            const speedBonus = calculateTotalBonus(equippedPets, PET_BONUS_TYPES.MINING_SPEED);
            const valueBonus = calculateTotalBonus(equippedPets, PET_BONUS_TYPES.ORE_VALUE);
            
            expect(speedBonus).toBeGreaterThan(0);
            expect(valueBonus).toBeGreaterThan(0);
        });

        test('should return 0 for empty pet list', () => {
            const total = calculateTotalBonus([], PET_BONUS_TYPES.MINING_SPEED);
            expect(total).toBe(0);
        });

        test('should handle pets with no matching bonus type', () => {
            const pet = { ...getPet('rocky'), level: 1, bonusType: PET_BONUS_TYPES.MINING_SPEED };
            const equippedPets = [pet];
            
            const total = calculateTotalBonus(equippedPets, PET_BONUS_TYPES.ORE_VALUE);
            expect(total).toBe(0);
        });
    });

    describe('Economy balance checks', () => {
        test('no single pet should exceed 25% bonus', () => {
            Object.values(PETS).forEach(pet => {
                const maxBonus = calculatePetBonus(pet, PET_RARITY[pet.rarity].maxLevel);
                expect(maxBonus).toBeLessThanOrEqual(0.25);
            });
        });

        test('egg costs should be affordable with rebalanced ore values', () => {
            const commonEggCost = EGGS.COMMON_EGG.cost;
            const coalValue = 5;
            
            // Should require mining ~10 coal for common egg
            expect(commonEggCost).toBeGreaterThan(coalValue * 5);
            expect(commonEggCost).toBeLessThan(coalValue * 20);
        });

        test('legendary egg should be expensive but reachable', () => {
            const legendaryEggCost = EGGS.LEGENDARY_EGG.cost;
            const mythicOreValue = 320;
            
            // Should require multiple mythic ores
            expect(legendaryEggCost).toBeGreaterThan(mythicOreValue);
            expect(legendaryEggCost).toBeLessThan(mythicOreValue * 100);
        });
    });
});
