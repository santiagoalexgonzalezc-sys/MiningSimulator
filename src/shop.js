import { PICKAXES, PICKAXE_ORDER, getNextPickaxe } from './pickaxeData.js';

/**
 * Shop class - manages upgrades and purchases
 */
export class Shop {
    constructor(player, inventory) {
        this.player = player;
        this.inventory = inventory;
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
        html += '<h3 style="margin-top: 20px;">Backpack Upgrade</h3>';
        const backpackCost = 50;
        const canAffordBackpack = this.player.money >= backpackCost;
        html += `
            <div style="margin-top: 10px; padding: 12px; background: ${canAffordBackpack ? '#34495e' : '#1a252f'}; border-radius: 6px;">
                <h4>Upgrade Backpack (+25 capacity)</h4>
                <p>Current: ${this.inventory.used}/${this.inventory.capacity}</p>
                <button onclick="game.shop.purchaseBackpack()" 
                        ${canAffordBackpack ? '' : 'disabled'}
                        style="padding: 8px 16px; cursor: ${canAffordBackpack ? 'pointer' : 'not-allowed'}; margin-top: 5px;">
                    $${backpackCost}
                </button>
            </div>
        `;
        
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
                this.renderShop();
            }
        }
    }
    
    purchaseBackpack() {
        const cost = 50;
        if (this.player.money >= cost) {
            this.player.money -= cost;
            this.inventory.capacity += 25;
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
}
