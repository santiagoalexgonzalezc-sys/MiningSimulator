import { Player } from './player.js';
import { Camera } from './camera.js';
import { World } from './world.js';
import { Inventory } from './inventory.js';
import { Shop } from './shop.js';
import { SaveSystem } from './save.js';
import { QuestManager } from './questManager.js';

/**
 * Main Game class - manages the game loop and coordinates all systems
 */
export class Game {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.lastTime = 0;
        this.deltaTime = 0;
        this.isRunning = false;
        
        // Game systems
        this.player = null;
        this.camera = null;
        this.world = null;
        this.inventory = null;
        this.shop = null;
        this.saveSystem = null;
        this.questManager = null;
        
        // Input state
        this.keys = {};
        this.mouse = { x: 0, y: 0, clicked: false };
        
        // UI elements
        this.uiElements = {};
        
        // Screen shake
        this.screenShake = 0;
    }
    
    init() {
        // Create canvas
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.resizeCanvas();
        
        // Initialize systems
        this.saveSystem = new SaveSystem();
        this.inventory = new Inventory();
        this.player = new Player(400, 300, this.inventory);
        this.camera = new Camera(this.player);
        this.world = new World(2000, 2000);
        this.questManager = new QuestManager(this.player);
        this.shop = new Shop(this.player, this.inventory, this.questManager);
        
        // Load saved game if exists
        this.saveSystem.load(this);
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Start game loop
        this.isRunning = true;
        this.lastTime = performance.now();
        requestAnimationFrame((t) => this.gameLoop(t));
        
        // Create UI
        this.createUI();
    }
    
    resizeCanvas() {
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    }
    
    setupEventListeners() {
        // Keyboard input
        window.addEventListener('keydown', (e) => {
            this.keys[e.key.toLowerCase()] = true;
        });
        
        window.addEventListener('keyup', (e) => {
            this.keys[e.key.toLowerCase()] = false;
        });
        
        // Mouse input
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
        });
        
        this.canvas.addEventListener('mousedown', (e) => {
            this.mouse.clicked = true;
        });
        
        this.canvas.addEventListener('mouseup', (e) => {
            this.mouse.clicked = false;
        });
        
        // Window resize
        window.addEventListener('resize', () => {
            this.width = window.innerWidth;
            this.height = window.innerHeight;
            this.resizeCanvas();
        });
    }
    
    gameLoop(currentTime) {
        if (!this.isRunning) return;
        
        this.deltaTime = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;
        
        // Cap delta time to prevent large jumps
        if (this.deltaTime > 0.1) this.deltaTime = 0.1;
        
        this.update(this.deltaTime);
        this.render();
        
        requestAnimationFrame((t) => this.gameLoop(t));
    }
    
    update(dt) {
        // Update player
        this.player.update(dt, this.keys, this.world);
        
        // Update camera
        this.camera.update();
        
        // Update world (respawn ores, etc.)
        this.world.update(dt);
        
        // Handle mining
        if (this.mouse.clicked) {
            this.handleMining();
            this.mouse.clicked = false;
        }
        
        // Check sell zone
        this.checkSellZone();
        
        // Check zone portal
        this.checkZonePortal();
        
        // Update UI
        this.updateUI();
    }
    
    handleMining() {
        // Convert mouse position to world coordinates
        const worldX = this.mouse.x + this.camera.x;
        const worldY = this.mouse.y + this.camera.y;
        
        // Check if clicking on an NPC
        const npc = this.world.getNPCAt(worldX, worldY);
        if (npc) {
            this.showNPCDialogue(npc);
            return;
        }
        
        // Check if clicking on an ore
        const ore = this.world.getOreAt(worldX, worldY);
        if (ore && this.player.canMine(ore)) {
            const pickaxe = this.player.getPickaxe();
            const isCritical = Math.random() < pickaxe.critChance;
            const damage = pickaxe.miningPower * (isCritical ? pickaxe.critMultiplier : 1);
            
            // Apply damage to ore
            ore.health -= damage;
            
            // Screen shake effect
            this.screenShake = isCritical ? 5 : 2;
            
            // Show damage feedback
            this.showDamageFeedback(damage, ore.x, ore.y, isCritical);
            
            // Check if ore is destroyed
            if (ore.health <= 0) {
                // Check if inventory can add the ore
                if (!this.inventory.canAdd(ore.rarity)) {
                    this.showBackpackFullWarning();
                    return;
                }
                
                const mined = this.player.mine(ore);
                if (mined) {
                    const added = this.inventory.add(ore.type, ore.value, ore.rarity);
                    if (added) {
                        this.world.removeOre(ore);
                        
                        // Update quest progress for mining ores
                        this.questManager.updateProgress('mine', { oreType: ore.type, rarity: ore.rarity });
                        
                        // Show drop feedback
                        const rarityText = ore.rarity && ore.rarity !== 'Common' ? ` (${ore.rarity})` : '';
                        this.showDropFeedback(`+1 ${ore.type}${rarityText}`, ore.glowColor, ore.glowIntensity);
                    }
                }
            }
        }
    }
    
    showNPCDialogue(npc) {
        const dialogue = document.createElement('div');
        dialogue.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(44, 62, 80, 0.95);
            color: white;
            padding: 20px;
            border-radius: 10px;
            z-index: 1000;
            border: 2px solid ${npc.color};
            min-width: 300px;
            max-width: 500px;
        `;
        
        let html = `<h2 style="color: ${npc.color}; margin-top: 0;">${npc.name}</h2>`;
        html += `<p style="margin-bottom: 15px;">${npc.dialogue}</p>`;
        
        // Show available quests
        html += '<h3 style="margin-bottom: 10px;">Available Quests:</h3>';
        const acceptedQuests = this.questManager.acceptNPCQuests(npc.id);
        
        if (acceptedQuests.length > 0) {
            html += '<ul style="margin: 0;">';
            for (const quest of acceptedQuests) {
                html += `<li style="margin-bottom: 5px;">${quest.title}: ${quest.description}</li>`;
            }
            html += '</ul>';
            html += '<p style="color: #27ae60; margin-top: 10px;">Quests accepted!</p>';
        } else {
            html += '<p style="color: #95a5a6;">No new quests available.</p>';
        }
        
        html += '<button onclick="this.parentElement.remove()" style="margin-top: 15px; padding: 8px 16px; cursor: pointer; background: #3498db; color: white; border: none; border-radius: 4px;">Close</button>';
        
        dialogue.innerHTML = html;
        document.body.appendChild(dialogue);
    }
    
    showBackpackFullWarning() {
        const warning = document.createElement('div');
        warning.textContent = 'Backpack Full! Sell ores or upgrade backpack.';
        warning.style.cssText = `
            position: fixed;
            top: 25%;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(231, 76, 60, 0.95);
            color: white;
            padding: 15px 30px;
            border-radius: 10px;
            font-size: 16px;
            font-weight: bold;
            z-index: 1000;
            border: 2px solid #c0392b;
            text-align: center;
            animation: pulse 0.5s ease-in-out;
        `;
        
        if (!document.getElementById('backpackWarningStyle')) {
            const style = document.createElement('style');
            style.id = 'backpackWarningStyle';
            style.textContent = `
                @keyframes pulse {
                    0% { transform: translateX(-50%) scale(1); }
                    50% { transform: translateX(-50%) scale(1.1); }
                    100% { transform: translateX(-50%) scale(1); }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(warning);
        
        setTimeout(() => {
            warning.remove();
        }, 2000);
    }
    
    showDamageFeedback(damage, x, y, isCritical) {
        // Convert world coordinates to screen coordinates
        const screenX = x - this.camera.x;
        const screenY = y - this.camera.y;
        
        const feedback = document.createElement('div');
        feedback.textContent = `-${damage}`;
        feedback.style.cssText = `
            position: fixed;
            left: ${screenX}px;
            top: ${screenY}px;
            color: ${isCritical ? '#e74c3c' : '#ffffff'};
            font-size: ${isCritical ? '24px' : '18px'};
            font-weight: ${isCritical ? 'bold' : 'normal'};
            z-index: 1000;
            pointer-events: none;
            animation: floatUpDamage 0.8s ease-out forwards;
            text-shadow: 0 0 5px rgba(0,0,0,0.8);
        `;
        
        // Add animation keyframes if not exists
        if (!document.getElementById('damageFeedbackStyle')) {
            const style = document.createElement('style');
            style.id = 'damageFeedbackStyle';
            style.textContent = `
                @keyframes floatUpDamage {
                    0% { opacity: 1; transform: translateY(0); }
                    100% { opacity: 0; transform: translateY(-30px); }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(feedback);
        
        // Remove after animation
        setTimeout(() => {
            feedback.remove();
        }, 800);
    }
    
    showDropFeedback(text, color, intensity) {
        // Create feedback element
        const feedback = document.createElement('div');
        feedback.textContent = text;
        feedback.style.cssText = `
            position: fixed;
            top: 30%;
            left: 50%;
            transform: translateX(-50%);
            background: ${color ? color + 'cc' : 'rgba(44, 62, 80, 0.9)'};
            color: white;
            padding: 10px 20px;
            border-radius: 8px;
            font-size: ${intensity > 8 ? '20px' : '16px'};
            font-weight: ${intensity > 5 ? 'bold' : 'normal'};
            z-index: 1000;
            border: ${intensity > 5 ? `2px solid ${color}` : 'none'};
            box-shadow: ${intensity > 5 ? `0 0 ${intensity}px ${color}` : 'none'};
            pointer-events: none;
            animation: floatUp 1.5s ease-out forwards;
        `;
        
        // Add animation keyframes if not exists
        if (!document.getElementById('dropFeedbackStyle')) {
            const style = document.createElement('style');
            style.id = 'dropFeedbackStyle';
            style.textContent = `
                @keyframes floatUp {
                    0% { opacity: 1; transform: translateX(-50%) translateY(0); }
                    100% { opacity: 0; transform: translateX(-50%) translateY(-50px); }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(feedback);
        
        // Remove after animation
        setTimeout(() => {
            feedback.remove();
        }, 1500);
    }
    
    checkSellZone() {
        const sellZone = this.world.sellZone;
        if (this.player.x > sellZone.x && 
            this.player.x < sellZone.x + sellZone.width &&
            this.player.y > sellZone.y && 
            this.player.y < sellZone.y + sellZone.height) {
            
            // Auto-sell when in sell zone
            const total = this.inventory.sellAll();
            if (total > 0) {
                this.player.money += total;
                
                // Update quest progress for earning money
                this.questManager.updateProgress('earn_money', { amount: total });
            }
        }
    }
    
    checkZonePortal() {
        const targetZoneId = this.world.checkPortalCollision(this.player);
        if (targetZoneId) {
            const targetZone = this.world.getZone(targetZoneId);
            
            if (targetZone.unlocked) {
                // Switch zones
                if (this.world.switchZone(targetZoneId, this.player)) {
                    this.showZoneMessage(`Entered ${targetZone.name}`);
                    
                    // Update quest progress for reaching zones
                    this.questManager.updateProgress('zone_change', { zoneId: targetZoneId });
                }
            } else {
                // Try to unlock
                if (this.world.unlockZone(targetZoneId, this.player)) {
                    this.showZoneMessage(`Unlocked ${targetZone.name}!`);
                } else {
                    this.showZoneMessage(targetZone.unlockMessage);
                }
            }
        }
    }
    
    showZoneMessage(message) {
        // Create or update message element
        let msgElement = document.getElementById('zoneMessage');
        if (!msgElement) {
            msgElement = document.createElement('div');
            msgElement.id = 'zoneMessage';
            msgElement.style.cssText = `
                position: fixed;
                top: 20%;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(44, 62, 80, 0.95);
                color: white;
                padding: 15px 30px;
                border-radius: 10px;
                font-size: 18px;
                font-weight: bold;
                z-index: 1000;
                border: 2px solid #3498db;
                text-align: center;
            `;
            document.body.appendChild(msgElement);
        }
        
        msgElement.textContent = message;
        msgElement.style.display = 'block';
        
        // Hide after 3 seconds
        setTimeout(() => {
            msgElement.style.display = 'none';
        }, 3000);
    }
    
    render() {
        // Apply screen shake
        let shakeX = 0;
        let shakeY = 0;
        if (this.screenShake > 0) {
            shakeX = (Math.random() - 0.5) * this.screenShake;
            shakeY = (Math.random() - 0.5) * this.screenShake;
            this.screenShake *= 0.9;
            if (this.screenShake < 0.5) this.screenShake = 0;
        }
        
        // Clear canvas
        this.ctx.fillStyle = '#2c3e50';
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        // Save context for camera transform and shake
        this.ctx.save();
        this.ctx.translate(-this.camera.x + shakeX, -this.camera.y + shakeY);
        
        // Render world
        this.world.render(this.ctx);
        
        // Render player
        this.player.render(this.ctx);
        
        // Restore context
        this.ctx.restore();
    }
    
    createUI() {
        // Inventory UI
        this.uiElements.inventory = document.getElementById('inventory');
        this.uiElements.money = document.getElementById('money');
        this.uiElements.shop = document.getElementById('shop');
        
        // Shop button
        const shopBtn = document.getElementById('shopBtn');
        if (shopBtn) {
            shopBtn.addEventListener('click', () => this.shop.open());
        }
        
        // Save button
        const saveBtn = document.getElementById('saveBtn');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => this.saveSystem.save(this));
        }
    }
    
    updateUI() {
        // Update money display
        if (this.uiElements.money) {
            this.uiElements.money.textContent = `$${this.player.money.toFixed(2)}`;
        }
        
        // Update inventory display
        if (this.uiElements.inventory) {
            this.uiElements.inventory.innerHTML = this.inventory.render();
        }
        
        // Update zone display
        this.updateZoneDisplay();
        
        // Update pickaxe display
        this.updatePickaxeDisplay();
        
        // Update quest display
        this.updateQuestDisplay();
    }
    
    updateZoneDisplay() {
        let zoneElement = document.getElementById('zoneDisplay');
        
        if (!zoneElement) {
            zoneElement = document.createElement('div');
            zoneElement.id = 'zoneDisplay';
            zoneElement.style.cssText = `
                position: absolute;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(44, 62, 80, 0.9);
                color: white;
                padding: 10px 20px;
                border-radius: 10px;
                font-size: 16px;
                font-weight: bold;
                pointer-events: auto;
            `;
            document.getElementById('ui').appendChild(zoneElement);
        }
        
        const currentZone = this.world.getCurrentZone();
        zoneElement.textContent = `Zone: ${currentZone.name} | Level: ${this.player.level}`;
    }
    
    updatePickaxeDisplay() {
        let pickaxeElement = document.getElementById('pickaxeDisplay');
        
        if (!pickaxeElement) {
            pickaxeElement = document.createElement('div');
            pickaxeElement.id = 'pickaxeDisplay';
            pickaxeElement.style.cssText = `
                position: absolute;
                top: 60px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(44, 62, 80, 0.9);
                color: white;
                padding: 8px 16px;
                border-radius: 8px;
                font-size: 14px;
                pointer-events: auto;
            `;
            document.getElementById('ui').appendChild(pickaxeElement);
        }
        
        const pickaxe = this.player.getPickaxe();
        pickaxeElement.style.border = `2px solid ${pickaxe.color}`;
        pickaxeElement.textContent = `${pickaxe.name} | Power: ${pickaxe.miningPower} | Crit: ${(pickaxe.critChance * 100).toFixed(0)}%`;
    }
    
    updateQuestDisplay() {
        let questElement = document.getElementById('questDisplay');
        
        if (!questElement) {
            questElement = document.createElement('div');
            questElement.id = 'questDisplay';
            questElement.style.cssText = `
                position: absolute;
                top: 90px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(44, 62, 80, 0.9);
                color: white;
                padding: 8px 16px;
                border-radius: 8px;
                font-size: 12px;
                pointer-events: auto;
                border: 2px solid #9B59B6;
            `;
            document.getElementById('ui').appendChild(questElement);
        }
        
        const activeQuests = this.questManager.getActiveQuests();
        if (activeQuests.length === 0) {
            questElement.textContent = 'No active quests';
        } else {
            const quest = activeQuests[0];
            questElement.textContent = `${quest.title}: ${quest.progress}/${quest.required}`;
        }
    }
}

// Initialize game when DOM is loaded
window.addEventListener('DOMContentLoaded', () => {
    const game = new Game();
    game.init();
});
