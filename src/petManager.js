import { getPet, getRarityInfo, calculatePetBonus, calculateTotalBonus, PET_BONUS_TYPES } from './petSystem.js';

/**
 * PetManager class - manages pet inventory, equipping, and leveling
 */
export class PetManager {
    constructor() {
        this.ownedPets = [];
        this.equippedPets = [];
        this.maxEquippedPets = 3; // Maximum pets that can be equipped
    }
    
    /**
     * Add a pet to the inventory
     */
    addPet(petId) {
        const petTemplate = getPet(petId);
        if (!petTemplate) return false;
        
        // Check if player already owns this pet
        const existingPet = this.ownedPets.find(p => p.id === petId);
        if (existingPet) {
            // If already owned, maybe give XP or duplicate handling
            return false;
        }
        
        // Create new pet instance
        const newPet = {
            id: petTemplate.id,
            name: petTemplate.name,
            rarity: petTemplate.rarity,
            description: petTemplate.description,
            bonusType: petTemplate.bonusType,
            baseBonus: petTemplate.baseBonus,
            emoji: petTemplate.emoji,
            level: 1,
            xp: 0,
            xpToNextLevel: 100
        };
        
        this.ownedPets.push(newPet);
        return true;
    }
    
    /**
     * Equip a pet
     */
    equipPet(petId) {
        if (this.equippedPets.length >= this.maxEquippedPets) {
            return false; // Max equipped pets reached
        }
        
        const pet = this.ownedPets.find(p => p.id === petId);
        if (!pet) return false;
        
        if (this.equippedPets.includes(pet)) {
            return false; // Already equipped
        }
        
        this.equippedPets.push(pet);
        return true;
    }
    
    /**
     * Unequip a pet
     */
    unequipPet(petId) {
        const index = this.equippedPets.findIndex(p => p.id === petId);
        if (index === -1) return false;
        
        this.equippedPets.splice(index, 1);
        return true;
    }
    
    /**
     * Add XP to a pet
     */
    addPetXP(petId, amount) {
        const pet = this.ownedPets.find(p => p.id === petId);
        if (!pet) return false;
        
        const rarityInfo = getRarityInfo(pet.rarity);
        if (pet.level >= rarityInfo.maxLevel) {
            return false; // Max level reached
        }
        
        pet.xp += amount;
        
        // Check for level up
        while (pet.xp >= pet.xpToNextLevel && pet.level < rarityInfo.maxLevel) {
            pet.xp -= pet.xpToNextLevel;
            pet.level++;
            pet.xpToNextLevel = Math.floor(pet.xpToNextLevel * 1.5); // Increase XP requirement
        }
        
        return true;
    }
    
    /**
     * Add XP to all equipped pets
     */
    addXPToEquipped(amount) {
        for (const pet of this.equippedPets) {
            this.addPetXP(pet.id, amount);
        }
    }
    
    /**
     * Get total bonus for a specific bonus type
     */
    getTotalBonus(bonusType) {
        return calculateTotalBonus(this.equippedPets, bonusType);
    }
    
    /**
     * Get pet by ID
     */
    getPet(petId) {
        return this.ownedPets.find(p => p.id === petId);
    }
    
    /**
     * Check if pet is equipped
     */
    isEquipped(petId) {
        return this.equippedPets.some(p => p.id === petId);
    }
    
    /**
     * Get all owned pets
     */
    getOwnedPets() {
        return this.ownedPets;
    }
    
    /**
     * Get all equipped pets
     */
    getEquippedPets() {
        return this.equippedPets;
    }
    
    /**
     * Get bonus multiplier for mining speed
     */
    getMiningSpeedMultiplier() {
        const bonus = this.getTotalBonus(PET_BONUS_TYPES.MINING_SPEED);
        return 1 + bonus;
    }
    
    /**
     * Get bonus multiplier for ore value
     */
    getOreValueMultiplier() {
        const bonus = this.getTotalBonus(PET_BONUS_TYPES.ORE_VALUE);
        return 1 + bonus;
    }
    
    /**
     * Get bonus multiplier for XP gain
     */
    getXPMultiplier() {
        const bonus = this.getTotalBonus(PET_BONUS_TYPES.XP_GAIN);
        return 1 + bonus;
    }
    
    /**
     * Get bonus for crit chance
     */
    getCritChanceBonus() {
        return this.getTotalBonus(PET_BONUS_TYPES.CRIT_CHANCE);
    }
    
    /**
     * Get bonus for backpack capacity
     */
    getBackpackCapacityBonus() {
        const bonus = this.getTotalBonus(PET_BONUS_TYPES.BACKPACK_CAPACITY);
        return bonus;
    }
    
    toJSON() {
        return {
            ownedPets: this.ownedPets,
            equippedPets: this.equippedPets.map(p => p.id),
            maxEquippedPets: this.maxEquippedPets
        };
    }
    
    fromJSON(data) {
        this.ownedPets = data.ownedPets || [];
        this.equippedPets = [];
        this.maxEquippedPets = data.maxEquippedPets || 3;
        
        // Restore equipped pets by ID
        if (data.equippedPets) {
            for (const petId of data.equippedPets) {
                const pet = this.ownedPets.find(p => p.id === petId);
                if (pet) {
                    this.equippedPets.push(pet);
                }
            }
        }
    }
}
