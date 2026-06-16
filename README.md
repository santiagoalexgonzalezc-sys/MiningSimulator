# Mining Simulator

A browser-based mining simulator game built with HTML5 Canvas and ES6 JavaScript.

## Phase 3 Features

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
4. Watch for rarity indicators (glow effects) on rare ores
5. See drop feedback showing ore type and rarity when mining
6. Walk into the green **SELL ZONE** to sell all ores
7. Walk into the purple **PORTAL** to switch zones (or unlock if you have enough money)
8. Click **Shop** to buy upgrades with your money
9. Click **Save Game** to manually save progress

## Controls

- **W/↑**: Move up
- **A/←**: Move left
- **S/↓**: Move down
- **D/→**: Move right
- **Mouse Click**: Mine ores
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

## Future Phases

This is Phase 3 of a 10-phase development plan. Future phases will include:
- Equipment progression
- Backpack upgrades
- Quest system
- Pets system
- Rebirth system
- Bosses and events
- Multiplayer support
