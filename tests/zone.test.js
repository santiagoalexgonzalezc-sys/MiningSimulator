/**
 * Unit tests for zone.js
 * Tests zone definitions, unlock requirements, and progression
 */

import { Zone, ZONE_DEFINITIONS } from '../src/zone.js';

describe('zone.js', () => {
    describe('ZONE_DEFINITIONS', () => {
        test('should have all required zones', () => {
            const zoneIds = ZONE_DEFINITIONS.map(z => z.id);
            expect(zoneIds).toContain('surface');
            expect(zoneIds).toContain('cave');
            expect(zoneIds).toContain('crystal');
            expect(zoneIds).toContain('lava');
        });

        test('should have unique zone IDs', () => {
            const zoneIds = ZONE_DEFINITIONS.map(z => z.id);
            const uniqueIds = new Set(zoneIds);
            expect(uniqueIds.size).toBe(zoneIds.length);
        });

        test('all zones should have required properties', () => {
            ZONE_DEFINITIONS.forEach(zone => {
                expect(zone).toHaveProperty('id');
                expect(zone).toHaveProperty('name');
                expect(zone).toHaveProperty('backgroundColor');
                expect(zone).toHaveProperty('gridColor');
                expect(zone).toHaveProperty('rockStyle');
                expect(zone).toHaveProperty('startPosition');
                expect(zone).toHaveProperty('portalPosition');
                expect(zone).toHaveProperty('portalTarget');
            });
        });

        test('surface zone should be unlocked by default', () => {
            const surface = ZONE_DEFINITIONS.find(z => z.id === 'surface');
            expect(surface.unlockRequirement).toBeNull();
        });

        test('other zones should have unlock requirements', () => {
            const cave = ZONE_DEFINITIONS.find(z => z.id === 'cave');
            const crystal = ZONE_DEFINITIONS.find(z => z.id === 'crystal');
            const lava = ZONE_DEFINITIONS.find(z => z.id === 'lava');
            
            expect(cave.unlockRequirement).not.toBeNull();
            expect(crystal.unlockRequirement).not.toBeNull();
            expect(lava.unlockRequirement).not.toBeNull();
        });

        test('zones should have increasing unlock costs', () => {
            const cave = ZONE_DEFINITIONS.find(z => z.id === 'cave');
            const crystal = ZONE_DEFINITIONS.find(z => z.id === 'crystal');
            const lava = ZONE_DEFINITIONS.find(z => z.id === 'lava');
            
            expect(cave.unlockRequirement.value).toBeLessThan(crystal.unlockRequirement.value);
            expect(crystal.unlockRequirement.value).toBeLessThan(lava.unlockRequirement.value);
        });

        test('zones should have different rock styles', () => {
            const surface = ZONE_DEFINITIONS.find(z => z.id === 'surface');
            const cave = ZONE_DEFINITIONS.find(z => z.id === 'cave');
            const crystal = ZONE_DEFINITIONS.find(z => z.id === 'crystal');
            const lava = ZONE_DEFINITIONS.find(z => z.id === 'lava');
            
            expect(surface.rockStyle).toBe('square');
            expect(cave.rockStyle).toBe('circle');
            expect(crystal.rockStyle).toBe('diamond');
            expect(lava.rockStyle).toBe('hexagon');
        });
    });

    describe('Zone class', () => {
        test('should create zone with config', () => {
            const config = {
                id: 'test_zone',
                name: 'Test Zone',
                backgroundColor: '#000000',
                gridColor: '#111111',
                rockStyle: 'square'
            };
            const zone = new Zone(config);
            
            expect(zone.id).toBe('test_zone');
            expect(zone.name).toBe('Test Zone');
        });

        test('should set default values for optional properties', () => {
            const config = {
                id: 'test_zone',
                name: 'Test Zone',
                backgroundColor: '#000000',
                gridColor: '#111111'
            };
            const zone = new Zone(config);
            
            expect(zone.rockStyle).toBe('square');
            expect(zone.startPosition).toEqual({ x: 400, y: 300 });
            expect(zone.portalPosition).toEqual({ x: 1800, y: 900 });
        });

        test('canUnlock should return true for no requirement', () => {
            const config = {
                id: 'test_zone',
                name: 'Test Zone',
                backgroundColor: '#000000',
                gridColor: '#111111'
            };
            const zone = new Zone(config);
            const mockPlayer = {};
            
            expect(zone.canUnlock(mockPlayer)).toBe(true);
        });

        test('canUnlock should check money requirement', () => {
            const config = {
                id: 'test_zone',
                name: 'Test Zone',
                backgroundColor: '#000000',
                gridColor: '#111111',
                unlockRequirement: { type: 'money', value: 100 }
            };
            const zone = new Zone(config);
            
            const poorPlayer = { money: 50 };
            const richPlayer = { money: 150 };
            
            expect(zone.canUnlock(poorPlayer)).toBe(false);
            expect(zone.canUnlock(richPlayer)).toBe(true);
        });

        test('canUnlock should check level requirement', () => {
            const config = {
                id: 'test_zone',
                name: 'Test Zone',
                backgroundColor: '#000000',
                gridColor: '#111111',
                unlockRequirement: { type: 'level', value: 10 }
            };
            const zone = new Zone(config);
            
            const lowLevelPlayer = { level: 5 };
            const highLevelPlayer = { level: 15 };
            
            expect(zone.canUnlock(lowLevelPlayer)).toBe(false);
            expect(zone.canUnlock(highLevelPlayer)).toBe(true);
        });

        test('canUnlock should check pickaxe requirement', () => {
            const config = {
                id: 'test_zone',
                name: 'Test Zone',
                backgroundColor: '#000000',
                gridColor: '#111111',
                unlockRequirement: { type: 'pickaxe', value: 3 }
            };
            const zone = new Zone(config);
            
            const lowTierPlayer = { pickaxeTier: 1 };
            const highTierPlayer = { pickaxeTier: 5 };
            
            expect(zone.canUnlock(lowTierPlayer)).toBe(false);
            expect(zone.canUnlock(highTierPlayer)).toBe(true);
        });

        test('canUnlock should return false for invalid requirement type', () => {
            const config = {
                id: 'test_zone',
                name: 'Test Zone',
                backgroundColor: '#000000',
                gridColor: '#111111',
                unlockRequirement: { type: 'invalid', value: 100 }
            };
            const zone = new Zone(config);
            const mockPlayer = {};
            
            expect(zone.canUnlock(mockPlayer)).toBe(false);
        });

        test('getRandomOre should return ore object', () => {
            const config = {
                id: 'surface',
                name: 'Surface Mine',
                backgroundColor: '#8b7355',
                gridColor: '#7a6548'
            };
            const zone = new Zone(config);
            
            const ore = zone.getRandomOre(100, 100);
            
            expect(ore).toHaveProperty('x');
            expect(ore).toHaveProperty('y');
            expect(ore).toHaveProperty('type');
            expect(ore).toHaveProperty('value');
            expect(ore).toHaveProperty('rarity');
        });

        test('toJSON should return zone data', () => {
            const config = {
                id: 'test_zone',
                name: 'Test Zone',
                backgroundColor: '#000000',
                gridColor: '#111111'
            };
            const zone = new Zone(config);
            zone.unlocked = true;
            
            const json = zone.toJSON();
            
            expect(json).toHaveProperty('id');
            expect(json).toHaveProperty('unlocked');
            expect(json.unlocked).toBe(true);
        });

        test('fromJSON should restore zone data', () => {
            const config = {
                id: 'test_zone',
                name: 'Test Zone',
                backgroundColor: '#000000',
                gridColor: '#111111'
            };
            const zone = new Zone(config);
            
            const data = { unlocked: true };
            zone.fromJSON(data);
            
            expect(zone.unlocked).toBe(true);
        });
    });

    describe('Zone progression', () => {
        test('should form a complete progression chain', () => {
            const surface = ZONE_DEFINITIONS.find(z => z.id === 'surface');
            const cave = ZONE_DEFINITIONS.find(z => z.id === 'cave');
            const crystal = ZONE_DEFINITIONS.find(z => z.id === 'crystal');
            const lava = ZONE_DEFINITIONS.find(z => z.id === 'lava');
            
            expect(surface.portalTarget).toBe('cave');
            expect(cave.portalTarget).toBe('crystal');
            expect(crystal.portalTarget).toBe('lava');
            expect(lava.portalTarget).toBe('surface');
        });

        test('portal targets should be valid zone IDs', () => {
            const zoneIds = ZONE_DEFINITIONS.map(z => z.id);
            
            ZONE_DEFINITIONS.forEach(zone => {
                expect(zoneIds).toContain(zone.portalTarget);
            });
        });
    });

    describe('Economy balance checks', () => {
        test('zone unlock costs should scale with rebalanced ore values', () => {
            const cave = ZONE_DEFINITIONS.find(z => z.id === 'cave');
            const crystal = ZONE_DEFINITIONS.find(z => z.id === 'crystal');
            const lava = ZONE_DEFINITIONS.find(z => z.id === 'lava');
            
            const coalValue = 5;
            
            // Cave should require ~50 coal
            expect(cave.unlockRequirement.value).toBeGreaterThan(coalValue * 40);
            expect(cave.unlockRequirement.value).toBeLessThan(coalValue * 60);
            
            // Crystal should require ~200 coal
            expect(crystal.unlockRequirement.value).toBeGreaterThan(coalValue * 180);
            expect(crystal.unlockRequirement.value).toBeLessThan(coalValue * 220);
            
            // Lava should require ~500 coal
            expect(lava.unlockRequirement.value).toBeGreaterThan(coalValue * 480);
            expect(lava.unlockRequirement.value).toBeLessThan(coalValue * 520);
        });

        test('zone costs should be reachable with pickaxe progression', () => {
            const cave = ZONE_DEFINITIONS.find(z => z.id === 'cave');
            const crystal = ZONE_DEFINITIONS.find(z => z.id === 'crystal');
            const lava = ZONE_DEFINITIONS.find(z => z.id === 'lava');
            
            // Cave should be unlockable with stone pickaxe
            expect(cave.unlockRequirement.value).toBeLessThan(300);
            
            // Crystal should be unlockable with iron/steel pickaxe
            expect(crystal.unlockRequirement.value).toBeGreaterThan(500);
            expect(crystal.unlockRequirement.value).toBeLessThan(2000);
            
            // Lava should be unlockable with gold/diamond pickaxe
            expect(lava.unlockRequirement.value).toBeGreaterThan(1500);
            expect(lava.unlockRequirement.value).toBeLessThan(10000);
        });

        test('zone progression should match target timeframes', () => {
            const cave = ZONE_DEFINITIONS.find(z => z.id === 'cave');
            const crystal = ZONE_DEFINITIONS.find(z => z.id === 'crystal');
            const lava = ZONE_DEFINITIONS.find(z => z.id === 'lava');
            
            // Costs should allow for 20-40 min cave, 40-90 min crystal, 90-180 min lava
            // Assuming ~10 ore/min at early game, scaling up with upgrades
            const caveOresNeeded = cave.unlockRequirement.value / 5; // Using coal value
            const crystalOresNeeded = crystal.unlockRequirement.value / 10; // Using iron value
            const lavaOresNeeded = lava.unlockRequirement.value / 20; // Using gold value
            
            // These should be reasonable numbers of ores to mine
            expect(caveOresNeeded).toBeGreaterThan(30);
            expect(caveOresNeeded).toBeLessThan(100);
            
            expect(crystalOresNeeded).toBeGreaterThan(50);
            expect(crystalOresNeeded).toBeLessThan(200);
            
            expect(lavaOresNeeded).toBeGreaterThan(80);
            expect(lavaOresNeeded).toBeLessThan(300);
        });
    });
});
