/**
 * Shop class - manages upgrades and purchases
 */
export class Shop {
    constructor(player, inventory) {
        this.player = player;
        this.inventory = inventory;
        this.isOpen = false;
        
        // Upgrades
        this.upgrades = [
            {
                id: 'pickaxe',
                name: 'Upgrade Pickaxe',
                description: 'Increase mining power and speed',
                cost: 100,
                action: () => this.player.upgradePickaxe()
            },
            {
                id: 'backpack',
                name: 'Upgrade Backpack',
                description: 'Increase inventory capacity by 25',
                cost: 50,
                action: () => {
                    this.inventory.capacity += 25;
                    return true;
                }
            }
        ];
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
                min-width: 300px;
            `;
            document.body.appendChild(shopModal);
        }
        
        let html = '<h2>Upgrade Shop</h2>';
        html += `<p>Money: $${this.player.money.toFixed(2)}</p>`;
        html += '<div style="margin-top: 15px;">';
        
        for (const upgrade of this.upgrades) {
            const canAfford = this.player.money >= upgrade.cost;
            html += `
                <div style="margin-bottom: 10px; padding: 10px; background: ${canAfford ? '#34495e' : '#1a252f'}; border-radius: 5px;">
                    <h3>${upgrade.name} - $${upgrade.cost}</h3>
                    <p>${upgrade.description}</p>
                    <button onclick="game.shop.purchase('${upgrade.id}')" 
                            ${canAfford ? '' : 'disabled'}
                            style="padding: 5px 10px; cursor: ${canAfford ? 'pointer' : 'not-allowed'};">
                        Buy
                    </button>
                </div>
            `;
        }
        
        html += '</div>';
        html += '<button onclick="game.shop.close()" style="margin-top: 15px; padding: 10px 20px;">Close</button>';
        
        shopModal.innerHTML = html;
        shopModal.style.display = 'block';
    }
    
    purchase(upgradeId) {
        const upgrade = this.upgrades.find(u => u.id === upgradeId);
        if (!upgrade) return;
        
        if (this.player.money >= upgrade.cost) {
            const success = upgrade.action();
            if (success) {
                this.player.money -= upgrade.cost;
                upgrade.cost = Math.floor(upgrade.cost * 1.5); // Increase cost for next purchase
                this.renderShop();
            }
        }
    }
}
