import { PICKAXES, PICKAXE_ORDER, getNextPickaxe } from './pickaxeData.js';
import { BACKPACKS, BACKPACK_ORDER, getNextBackpack } from './inventorySystem.js';
import { EGGS, getEgg, hatchEgg, getRarityInfo } from './petSystem.js';

/**
 * Shop class - manages upgrades and purchases
 */
export class Shop {
    constructor(player, inventory, questManager, petManager) {
        this.player = player;
        this.inventory = inventory;
        this.questManager = questManager;
        this.petManager = petManager;
        this.isOpen = false;
    }
    
    open() {
        this.isOpen = true;
        this.renderShop();
    }
    
    close() {
        this.isOpen = false;
        const shopModal = document.getElementById('shopModal');
        if (shopModal) {
            shopModal.style.display = 'none';
        }
    }
    
    renderShop() {
        let shopModal = document.getElementById('shopModal');
        
        if (!shopModal) {
            shopModal = document.createElement('div');
            shopModal.id = 'shopModal';
            shopModal.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: #2c3e50;
                padding: 20px;
                border-radius: 10px;
                color: white;
                z-index: 1000;
                min-width: 400px;
                max-height: 80vh;
                overflow-y: auto;
            `;
            document.body.appendChild(shopModal);
        }
        
        const currentPickaxe = this.player.getPickaxe();
        const nextPickaxe = getNextPickaxe(this.player.pickaxeId);
        
        let html = '<h2>Upgrade Shop</h2>';
        html += `<p>Money: $${this.player.money.toFixed(2)}</p>`;
        
        // Current Pickaxe Display
        html += '<div style="margin: 15px 0; padding: 15px; background: #34495e; border-radius: 8px; border: 2px solid ' + currentPickaxe.color + ';">';
        html += '<h3 style="color: ' + currentPickaxe.color + ';">Current Pickaxe: ' + currentPickaxe.name + '</h3>';
        html += '<p>Power: ' + currentPickaxe.miningPower + ' | Speed: ' + currentPickaxe.miningSpeed + 'x | Crit: ' + (currentPickaxe.critChance * 100).toFixed(0) + '%</p>';
        html += '</div>';
        
        // Pickaxe Progression Tree
        html += '<h3>Pickaxe Progression</h3>';
        html += '<div style="margin-top: 10px;">';
        
        for (const pickaxeId of PICKAXE_ORDER) {
            const pickaxe = PICKAXES[pickaxeId.toUpperCase()];
            const isCurrent = pickaxe.id === this.player.pickaxeId;
            const isNext = nextPickaxe && pickaxe.id === nextPickaxe.id;
            const isLocked = PICKAXE_ORDER.indexOf(pickaxe.id) > PICKAXE_ORDER.indexOf(this.player.pickaxeId);
            const canAfford = this.player.money >= pickaxe.cost;
            
            let bgColor = '#1a252f';
            let borderColor = '#34495e';
            
            if (isCurrent) {
                bgColor = pickaxe.color + '33';
                borderColor = pickaxe.color;
            } else if (isNext && canAfford) {
                bgColor = '#27ae6033';
                borderColor = '#27ae60';
            } else if (isNext) {
                bgColor = '#e74c3c33';
                borderColor = '#e74c3c';
            }
            
            html += `
                <div style="margin-bottom: 10px; padding: 12px; background: ${bgColor}; border: 2px solid ${borderColor}; border-radius: 6px;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <h4 style="color: ${pickaxe.color}; margin: 0;">${pickaxe.name} ${isCurrent ? '(Equipped)' : ''}</h4>
                            <p style="margin: 5px 0; font-size: 12px;">Power: ${pickaxe.miningPower} | Speed: ${pickaxe.miningSpeed}x | Crit: ${(pickaxe.critChance * 100).toFixed(0)}%</p>
                            <p style="margin: 0; font-size: 11px; color: #95a5a6;">${pickaxe.description}</p>
                        </div>
                        ${isNext ? `
                            <button onclick="game.shop.purchasePickaxe('${pickaxe.id}')" 
                                    ${canAfford ? '' : 'disabled'}
                                    style="padding: 8px 16px; cursor: ${canAfford ? 'pointer' : 'not-allowed'}; background: ${canAfford ? '#27ae60' : '#7f8c8d'}; color: white; border: none; border-radius: 4px;">
                                $${pickaxe.cost}
                            </button>
                        ` : isLocked ? `
                            <span style="color: #7f8c8d; font-size: 12px;">Locked</span>
                        ` : `
                            <span style="color: #27ae60; font-size: 12px;">✓ Owned</span>
                        `}
                    </div>
                </div>
            `;
        }
        
        html += '</div>';
        
        // Backpack Upgrade
        html += '<h3 style="margin-top: 20px;">Backpack Progression</h3>';
        const nextBackpack = getNextBackpack(this.inventory.backpackId);
        
        html += '<div style="margin-top: 10px;">';
        
        for (const backpackId of BACKPACK_ORDER) {
            const backpack = BACKPACKS[backpackId.toUpperCase()];
            const isCurrent = backpack.id === this.inventory.backpackId;
            const isNext = nextBackpack && backpack.id === nextBackpack.id;
            const isLocked = BACKPACK_ORDER.indexOf(backpack.id) > BACKPACK_ORDER.indexOf(this.inventory.backpackId);
            const canAfford = this.player.money >= backpack.cost;
            
            let bgColor = '#1a252f';
            let borderColor = '#34495e';
            
            if (isCurrent) {
                bgColor = backpack.color + '33';
                borderColor = backpack.color;
            } else if (isNext && canAfford) {
                bgColor = '#27ae6033';
                borderColor = '#27ae60';
            } else if (isNext) {
                bgColor = '#e74c3c33';
                borderColor = '#e74c3c';
            }
            
            html += `
                <div style="margin-bottom: 10px; padding: 12px; background: ${bgColor}; border: 2px solid ${borderColor}; border-radius: 6px;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <h4 style="color: ${backpack.color}; margin: 0;">${backpack.name} ${isCurrent ? '(Equipped)' : ''}</h4>
                            <p style="margin: 5px 0; font-size: 12px;">Capacity: ${backpack.capacity} slots</p>
                            <p style="margin: 0; font-size: 11px; color: #95a5a6;">${backpack.description}</p>
                        </div>
                        ${isNext ? `
                            <button onclick="game.shop.purchaseBackpack('${backpack.id}')" 
                                    ${canAfford ? '' : 'disabled'}
                                    style="padding: 8px 16px; cursor: ${canAfford ? 'pointer' : 'not-allowed'}; background: ${canAfford ? '#27ae60' : '#7f8c8d'}; color: white; border: none; border-radius: 4px;">
                                $${backpack.cost}
                            </button>
                        ` : isLocked ? `
                            <span style="color: #7f8c8d; font-size: 12px;">Locked</span>
                        ` : `
                            <span style="color: #27ae60; font-size: 12px;">✓ Owned</span>
                        `}
                    </div>
                </div>
            `;
        }
        
        html += '</div>';
        
        // Pet Shop Section
        html += '<h3 style="margin-top: 30px; margin-bottom: 15px; color: #9b59b6;">🥚 Pet Eggs</h3>';
        html += '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px;">';
        
        for (const eggId in EGGS) {
            const egg = EGGS[eggId];
            const canAfford = this.player.money >= egg.cost;
            html += `
                <div style="padding: 10px; background: ${canAfford ? '#34495e' : '#1a252f'}; border-radius: 5px; border: 2px solid ${getRarityInfo(egg.rarity).color};">
                    <h4 style="margin: 0 0 5px 0; color: ${getRarityInfo(egg.rarity).color};">${egg.emoji} ${egg.name}</h4>
                    <p style="margin: 0 0 10px 0; font-size: 12px; color: #bdc3c7;">${getRarityInfo(egg.rarity).name} Egg</p>
                    <button onclick="game.shop.purchaseEgg('${egg.id}')" 
                            ${canAfford ? '' : 'disabled'}
                            style="padding: 5px 10px; cursor: ${canAfford ? 'pointer' : 'not-allowed'}; background: ${canAfford ? '#9b59b6' : '#7f8c8d'}; color: white; border: none; border-radius: 4px; width: 100%;">
                        Buy ($${egg.cost})
                    </button>
                </div>
            `;
        }
        
        html += '</div>';
        
        html += '<button onclick="game.shop.close()" style="margin-top: 20px; padding: 10px 20px; width: 100%;">Close</button>';
        
        shopModal.innerHTML = html;
        shopModal.style.display = 'block';
    }
    
    purchasePickaxe(pickaxeId) {
        const pickaxe = PICKAXES[pickaxeId.toUpperCase()];
        if (!pickaxe) return;
        
        if (this.player.money >= pickaxe.cost) {
            const success = this.player.upgradePickaxe();
            if (success) {
                this.showUpgradeFeedback(pickaxe.name);
                
                // Update quest progress for upgrading pickaxe
                this.questManager.updateProgress('upgrade', { type: pickaxe.id });
                
                this.renderShop();
            }
        }
    }
    
    purchaseBackpack(backpackId) {
        const backpack = BACKPACKS[backpackId.toUpperCase()];
        if (!backpack) return;
        
        if (this.player.money >= backpack.cost) {
            this.player.money -= backpack.cost;
            this.inventory.upgradeBackpack();
            this.showUpgradeFeedback(backpack.name);
            
            // Update quest progress for upgrading backpack
            this.questManager.updateProgress('upgrade', { type: backpack.id + '_backpack' });
            
            this.renderShop();
        }
    }
    
    showUpgradeFeedback(pickaxeName) {
        const feedback = document.createElement('div');
        feedback.textContent = `Pickaxe Upgraded! ${pickaxeName}`;
        feedback.style.cssText = `
            position: fixed;
            top: 20%;
            left: 50%;
            transform: translateX(-50%);
            background: #27ae60;
            color: white;
            padding: 15px 30px;
            border-radius: 10px;
            font-size: 18px;
            font-weight: bold;
            z-index: 1001;
            border: 2px solid #2ecc71;
            text-align: center;
            animation: pulse 0.5s ease-in-out;
        `;
        
        if (!document.getElementById('upgradeFeedbackStyle')) {
            const style = document.createElement('style');
            style.id = 'upgradeFeedbackStyle';
            style.textContent = `
                @keyframes pulse {
                    0% { transform: translateX(-50%) scale(1); }
                    50% { transform: translateX(-50%) scale(1.1); }
                    100% { transform: translateX(-50%) scale(1); }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(feedback);
        
        setTimeout(() => {
            feedback.remove();
        }, 2000);
    }
    
    purchaseEgg(eggId) {
        const egg = getEgg(eggId);
        if (!egg) return;
        
        if (this.player.money >= egg.cost) {
            this.player.money -= egg.cost;
            
            // Hatch the egg
            const hatchedPet = hatchEgg(eggId);
            if (hatchedPet) {
                this.petManager.addPet(hatchedPet.id);
                this.showPetHatchedFeedback(hatchedPet);
            }
            
            this.renderShop();
        }
    }
    
    showPetHatchedFeedback(pet) {
        const feedback = document.createElement('div');
        feedback.textContent = `New Pet: ${pet.emoji} ${pet.name}!`;
        feedback.style.cssText = `
            position: fixed;
            top: 20%;
            left: 50%;
            transform: translateX(-50%);
            background: #9b59b6;
            color: white;
            padding: 15px 30px;
            border-radius: 10px;
            font-size: 18px;
            font-weight: bold;
            z-index: 1001;
            border: 2px solid #8e44ad;
            text-align: center;
            animation: pulse 0.5s ease-in-out;
        `;
        
        document.body.appendChild(feedback);
        setTimeout(() => {
            feedback.remove();
        }, 2000);
    }
}
