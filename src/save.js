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
                game.player.fromJSON(data.player);
                game.inventory.fromJSON(data.inventory);
                game.world.fromJSON(data.world);
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
