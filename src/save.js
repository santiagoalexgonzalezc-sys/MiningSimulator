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
            timestamp: Date.now()
        };
        
        try {
            localStorage.setItem(this.saveKey, JSON.stringify(saveData));
            console.log('Game saved successfully');
            return true;
        } catch (error) {
            console.error('Failed to save game:', error);
            return false;
        }
    }
    
    load(game) {
        try {
            const saveData = localStorage.getItem(this.saveKey);
            if (saveData) {
                const data = JSON.parse(saveData);
                
                // Check if save data has petManager - if not, it's an old save
                if (!data.petManager) {
                    console.log('Old save detected, clearing incompatible save');
                    this.clear();
                    return false;
                }
                
                game.player.fromJSON(data.player);
                game.inventory.fromJSON(data.inventory);
                game.world.fromJSON(data.world);
                if (data.questManager) {
                    game.questManager.fromJSON(data.questManager);
                }
                if (data.petManager) {
                    game.petManager.fromJSON(data.petManager);
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
