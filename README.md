# Mining Simulator

A browser-based mining simulator game built with HTML5 Canvas and ES6 JavaScript.

## Phase 5 Features

- **Slot-Based Inventory System**: Each ore takes slots based on rarity (Common=1, Uncommon=1, Rare=2, Epic=3, Legendary=4, Mythic=5)
- **Backpack Progression**: 5 upgradeable backpacks with increasing capacity
- **Capacity Management**: Visual capacity bar with color warnings (green → yellow → red)
- **Backpack Full Warning**: Popup warning when attempting to mine with full inventory
- **Strategic Inventory**: Players must manage space and decide which ores to keep
- **Backpack Shop UI**: Visual backpack progression tree with costs and locked states
- **Inventory Slot Display**: Shows total slots used per item type
- **Save System**: Backpack level and capacity saved with backward compatibility

### Backpack Progression

**Small Backpack** (Free)
- Capacity: 20 slots
- Basic backpack for starting miners.

**Medium Backpack** ($200)
- Capacity: 40 slots
- Spacious backpack for serious mining.

**Large Backpack** ($1,000)
- Capacity: 75 slots
- Large backpack for extended mining sessions.

**Epic Backpack** ($5,000)
- Capacity: 120 slots
- Epic backpack for professional miners.

**Mythic Backpack** ($25,000)
- Capacity: 200 slots
- Legendary backpack with massive capacity.

### Slot Costs by Rarity

**Common**: 1 slot
**Uncommon**: 1 slot
**Rare**: 2 slots
**Epic**: 3 slots
**Legendary**: 4 slots
**Mythic**: 5 slots

### Inventory Management

- **Capacity Bar**: Visual indicator showing used vs total slots
- **Color Warnings**: Green (<70%), Yellow (70-89%), Red (90%+)
- **Slot Display**: Each item shows total slots used
- **Full Prevention**: Cannot mine when backpack is full
- **Upgrade Path**: Must upgrade backpack to carry more valuable ores

## Phase 4 Features (Retained)

- **Pickaxe Progression System**: 7 upgradeable pickaxes with unique stats
- **Damage-Based Mining**: Ores have HP, pickaxes deal damage per click
- **Critical Hit System**: Chance for 2x-4x damage with visual feedback
- **Screen Shake Effects**: Visual feedback when mining and on critical hits
- **Pickaxe UI Panel**: Real-time display of current pickaxe stats
- **Progression Shop UI**: Visual pickaxe tree with costs and locked states
- **Upgrade Feedback**: Animated popup when upgrading pickaxes
- **Rock HP Scaling**: Ore health scales with zone and rarity

### Pickaxe Progression

**Wooden Pickaxe** (Free)
- Power: 1 | Speed: 1.0x | Crit: 5%
- Basic wooden pickaxe. Slow but reliable.

**Stone Pickaxe** ($100)
- Power: 2 | Speed: 1.2x | Crit: 7%
- Sturdier stone pickaxe. Better mining speed.

**Iron Pickaxe** ($500)
- Power: 4 | Speed: 1.5x | Crit: 10%
- Durable iron pickaxe. Significant power boost.

**Steel Pickaxe** ($2,000)
- Power: 7 | Speed: 1.8x | Crit: 12%
- Reinforced steel pickaxe. Excellent mining efficiency.

**Gold Pickaxe** ($5,000)
- Power: 12 | Speed: 2.2x | Crit: 15%
- Golden pickaxe. High power and crit chance.

**Diamond Pickaxe** ($15,000)
- Power: 20 | Speed: 2.8x | Crit: 18%
- Diamond pickaxe. Ultimate mining power.

**Mythic Pickaxe** ($50,000)
- Power: 35 | Speed: 3.5x | Crit: 22%
- Legendary mythic pickaxe. God-tier mining power.

### Mining Mechanics

- **Damage System**: Click to deal damage equal to pickaxe power
- **Critical Hits**: Random chance for multiplied damage with red text
- **HP Scaling**: Ore HP increases in deeper zones and with higher rarity
- **Visual Feedback**: Damage numbers float up, screen shakes on hits
- **Progression**: Better pickaxes mine faster and deal more damage

## Phase 3 Features (Retained)

- **Ore Rarity System**: 6 rarity tiers (Common, Uncommon, Rare, Epic, Legendary, Mythic)
- **Rarity-Based Drop Chances**: Weighted rarity drops per zone (better zones = rarer ores)
- **Ore Value Scaling**: Base value × rarity multiplier × zone bonus
- **Visual Rarity Indicators**: Glow effects and colored text for rare ores
- **Drop Feedback System**: Animated popup text showing ore type and rarity
- **Enhanced Inventory**: Sorted by rarity, highlighted rare items with colors
- **Centralized Ore Data**: Data-driven ore system for easy expansion

### Rarity System

**Common** (1.0x value)
- Gray color, no glow
- Most frequent in Surface Mine

**Uncommon** (1.5x value)
- Green color, subtle glow
- Common in all zones

**Rare** (2.5x value)
- Blue color, moderate glow
- Appears in Cave Mine and deeper

**Epic** (4.0x value)
- Purple color, strong glow
- Found in Crystal Mine and Lava Mine

**Legendary** (7.0x value)
- Orange color, intense glow
- Rare drops in Lava Mine

**Mythic** (15.0x value)
- Red color, maximum glow
- Extremely rare in Lava Mine

### Zone Rarity Distribution

**Surface Mine**: Mostly Common/Uncommon
**Cave Mine**: Common/Uncommon/Rare
**Crystal Mine**: Rare/Epic/Legendary
**Lava Mine**: Epic/Legendary/Mythic

## Phase 2 Features (Retained)

- **Multiple Mining Zones**: 4 unique zones (Surface, Cave, Crystal, Lava)
- **Zone Unlock System**: Unlock deeper zones by earning money
- **Zone Transition System**: Teleport pads between zones
- **Unique Zone Visuals**: Different background colors and rock styles per zone
- **Level & XP System**: Gain XP from mining and level up for bonuses
- **Zone UI Display**: Shows current zone and player level

### Zone Details

**Surface Mine** (Default)
- Background: Brown earth
- Rock Style: Square
- Unlock: Free

**Cave Mine**
- Background: Dark gray
- Rock Style: Circle
- Unlock: $500

**Crystal Mine**
- Background: Dark blue
- Rock Style: Diamond
- Unlock: $2,000

**Lava Mine**
- Background: Dark red
- Rock Style: Hexagon
- Unlock: $5,000

## Phase 1 Features (Retained)

- **WASD Movement**: Smooth player movement with collision detection
- **Camera System**: Camera follows the player throughout the world
- **2D World**: 2000x2000 pixel world with grid pattern
- **Mining System**: Click on ores to mine them (within range)
- **Inventory System**: Track collected ores with capacity limits
- **Sell Zone**: Green zone where ores are automatically sold for money
- **Upgrade Shop**: Purchase pickaxe upgrades and backpack capacity increases
- **Save/Load**: Game progress automatically saved to LocalStorage

## How to Play

1. Open `index.html` in a modern web browser
2. Use **WASD** or **Arrow Keys** to move the player
3. Click on ores to mine them (must be within range)
4. Watch for damage numbers and critical hit effects
5. See drop feedback showing ore type and rarity when mining
6. Manage backpack capacity - rare ores take more slots
7. Walk into the green **SELL ZONE** to sell all ores
8. Walk into the purple **PORTAL** to switch zones (or unlock if you have enough money)
9. Click **Shop** to upgrade pickaxes and backpack
10. Click **Save Game** to manually save progress

## Controls

- **W/↑**: Move up
- **A/←**: Move left
- **S/↓**: Move down
- **D/→**: Move right
- **Mouse Click**: Mine ores (deal damage)
- **Shop Button**: Open upgrade shop
- **Save Button**: Save game progress

## Project Structure

```
MiningSimulator/
├── index.html          # Game entry point
├── styles.css          # UI styling
├── src/
│   ├── main.js         # Entry point initialization
│   ├── game.js         # Main game loop and coordination
│   ├── player.js       # Player movement and stats
│   ├── camera.js       # Camera following system
│   ├── world.js        # World generation and zone management
│   ├── zone.js         # Zone definitions and properties
│   ├── oreData.js      # Centralized ore data and rarity system
│   ├── pickaxeData.js  # Centralized pickaxe data and progression
│   ├── inventorySystem.js # Centralized inventory and backpack system
│   ├── inventory.js    # Inventory management
│   ├── shop.js         # Upgrade shop system
│   └── save.js         # LocalStorage save/load
```

## Technical Details

- **Framework**: Pure HTML5 Canvas + ES6 JavaScript
- **Architecture**: Modular class-based design with ES6 modules
- **Performance**: Target 60 FPS with efficient collision detection
- **Storage**: LocalStorage for persistent saves (under 100 KB)
- **Zone System**: Data-driven zone definitions for easy expansion
- **Ore System**: Centralized data-driven ore and rarity system
- **Pickaxe System**: Centralized data-driven equipment progression
- **Inventory System**: Centralized slot-based inventory with backpack progression

## Future Phases

This is Phase 5 of a 10-phase development plan. Future phases will include:
- Quest system
- Pets system
- Rebirth system
- Bosses and events
- Multiplayer support
