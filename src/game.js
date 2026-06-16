import { Player } from './player.js';
import { Camera } from './camera.js';
import { World } from './world.js';
import { Inventory } from './inventory.js';
import { Shop } from './shop.js';
import { SaveSystem } from './save.js';

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
        
        // Input state
        this.keys = {};
        this.mouse = { x: 0, y: 0, clicked: false };
        
        // UI elements
        this.uiElements = {};
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
        this.shop = new Shop(this.player, this.inventory);
        
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
        
        // Check if clicking on an ore
        const ore = this.world.getOreAt(worldX, worldY);
        if (ore && this.player.canMine(ore)) {
            const mined = this.player.mine(ore);
            if (mined) {
                this.inventory.add(ore.type, ore.value);
                this.world.removeOre(ore);
            }
        }
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
        // Clear canvas
        this.ctx.fillStyle = '#2c3e50';
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        // Save context for camera transform
        this.ctx.save();
        this.ctx.translate(-this.camera.x, -this.camera.y);
        
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
}

// Initialize game when DOM is loaded
window.addEventListener('DOMContentLoaded', () => {
    const game = new Game();
    game.init();
});
