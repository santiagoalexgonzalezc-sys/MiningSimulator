/**
 * SaveSystem class - handles game save/load using LocalStorage
 */
export class SaveSystem {
    constructor() {
        this.saveKey = 'miningSimulator_save';
    }
    
    save(game) {
        const saveData = {
            player: game.player.toJSON(),
            inventory: game.inventory.toJSON(),
            world: game.world.toJSON(),
            questManager: game.questManager.toJSON(),
            petManager: game.petManager.toJSON(),
            rebirthManager: game.rebirthManager.toJSON(),
            bossManager: game.bossManager.toJSON(),
            arenaManager: game.arenaManager.toJSON(),
            bossShop: game.bossShop.toJSON(),
            eventManager: game.eventManager.toJSON(),
            achievementManager: game.achievementManager.toJSON(),
            timestamp: Date.now()
        };
        
        try {
            const jsonString = JSON.stringify(saveData);
            console.log('Save data size:', jsonString.length, 'bytes');
            localStorage.setItem(this.saveKey, jsonString);
            console.log('Game saved successfully');
            
            // Verify save
            const savedData = localStorage.getItem(this.saveKey);
            if (savedData) {
                console.log('Save verified in localStorage');
            } else {
                console.error('Save verification failed - data not in localStorage');
            }
            return true;
        } catch (error) {
            console.error('Failed to save game:', error);
            console.error('Error details:', error.message);
            return false;
        }
    }
    
    load(game) {
        try {
            const saveData = localStorage.getItem(this.saveKey);
            if (saveData) {
                const data = JSON.parse(saveData);
                
                // Check if save data has rebirthManager - if not, it's an old save
                if (!data.rebirthManager) {
                    console.log('Old save detected, clearing incompatible save');
                    this.clear();
                    return false;
                }
                
                game.player.fromJSON(data.player);
                game.inventory.fromJSON(data.inventory);
                game.world.fromJSON(data.world);
                
                // Sync player's currentZone with world's currentZone
                if (game.world.currentZone && game.world.currentZone.id) {
                    game.player.currentZone = game.world.currentZone.id;
                }
                if (data.questManager) {
                    game.questManager.fromJSON(data.questManager);
                }
                if (data.petManager) {
                    game.petManager.fromJSON(data.petManager);
                }
                if (data.rebirthManager) {
                    game.rebirthManager.fromJSON(data.rebirthManager);
                }
                if (data.bossManager) {
                    game.bossManager.fromJSON(data.bossManager);
                }
                if (data.arenaManager) {
                    game.arenaManager.fromJSON(data.arenaManager);
                }
                if (data.bossShop) {
                    game.bossShop.fromJSON(data.bossShop);
                }
                if (data.eventManager) {
                    game.eventManager.fromJSON(data.eventManager);
                }
                if (data.achievementManager) {
                    game.achievementManager.fromJSON(data.achievementManager);
                }
                console.log('Game loaded successfully');
                return true;
            }
        } catch (error) {
            console.error('Failed to load game:', error);
        }
        return false;
    }
    
    clear() {
        try {
            localStorage.removeItem(this.saveKey);
            console.log('Save data cleared');
            return true;
        } catch (error) {
            console.error('Failed to clear save data:', error);
            return false;
        }
    }
    
    hasSave() {
        return localStorage.getItem(this.saveKey) !== null;
    }
}
