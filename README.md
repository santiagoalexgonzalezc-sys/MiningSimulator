# Mining Simulator

A browser-based mining simulator game built with HTML5 Canvas and ES6 JavaScript.

## Phase 8 Features

- **Rebirth System**: Reset progression for permanent bonuses and infinite progression
- **Rebirth Requirements**: Money ($100,000+), Level (50+), or Quests (10+) to rebirth
- **Rebirth Points (RP)**: Permanent currency earned from rebirthing
- **Global Multipliers**: Permanent bonuses from rebirth count (Mining Speed, Ore Value, XP Gain, Luck)
- **Permanent Upgrades**: Spend RP on permanent upgrades
- **Rebirth Shop**: 8 permanent upgrades available
- **Rebirth UI Panel**: View requirements, rewards, and manage upgrades
- **Rebirth Save System**: Rebirth data saved with game state
- **Backward Compatibility**: Old saves automatically cleared for Phase 8

### Rebirth Requirements

Players can rebirth when they meet at least one of these requirements:
- **Money**: $100,000+
- **Level**: Level 50+
- **Quests**: 10+ completed quests

### Rebirth Rewards

Each rebirth grants:
- **Rebirth Points (RP)**: Base 1 RP, scales by 1.5x per rebirth
- **Global Multipliers**: Permanent bonuses that stack with pets and equipment
- **Mining Speed**: +5% per rebirth
- **Ore Value**: +5% per rebirth
- **XP Gain**: +5% per rebirth
- **Luck**: +2% per rebirth

### What Resets on Rebirth

- Money
- Inventory contents
- Pickaxe level (resets to wooden)
- Zone progression (resets to surface)
- Active quests
- Player level and XP

### What Keeps on Rebirth

- Rebirth Points (RP)
- Permanent upgrades
- Pets (kept permanently)
- Rebirth count

### Permanent Upgrades

**Mining Speed Boost** (1 RP base, 1.5x scaling)
- Permanently increase mining speed by 5%
- Max Level: 50

**Ore Rarity Luck** (2 RP base, 1.6x scaling)
- Increase chance for rare ore drops by 3%
- Max Level: 30

**Backpack Capacity** (3 RP base, 1.7x scaling)
- Increase backpack capacity by 10%
- Max Level: 20

**Faster Pet Leveling** (2 RP base, 1.5x scaling)
- Pets gain XP 20% faster
- Max Level: 25

**Auto Sell Bonus** (2 RP base, 1.5x scaling)
- Increase ore sell value by 5%
- Max Level: 30

**Starting Money** (1 RP base, 1.4x scaling)
- Start with $500 more money after rebirth
- Max Level: 20

**Crit Chance Boost** (3 RP base, 1.8x scaling)
- Increase critical hit chance by 2%
- Max Level: 25

**Zone Unlock Speed** (4 RP base, 2.0x scaling)
- Reduce zone unlock cost by 5%
- Max Level: 15

## Phase 7 Features (Retained)

- **Pet System**: Collectible pets that provide passive bonuses
- **Pet Rarity System**: 6 rarity tiers (Common, Uncommon, Rare, Epic, Legendary, Mythic)
- **Pet Bonuses**: Mining Speed, Ore Value, XP Gain, Crit Chance, Backpack Capacity
- **Pet Acquisition**: Pet eggs in shop with hatching system
- **Pet Leveling**: Pets gain XP from mining and level up to increase bonuses
- **Pet Management UI**: Equip/unequip pets, view stats, and see active bonuses
- **Pet Integration**: Bonuses stack and integrate with all existing systems
- **Pet Save System**: Pet data saved with game state

### Pet Rarity System

**Common** (1.0x bonus multiplier)
- Max Level: 10
- Gray color
- Basic bonuses

**Uncommon** (1.2x bonus multiplier)
- Max Level: 15
- Green color
- Improved bonuses

**Rare** (1.5x bonus multiplier)
- Max Level: 20
- Blue color
- Strong bonuses

**Epic** (2.0x bonus multiplier)
- Max Level: 25
- Purple color
- Powerful bonuses

**Legendary** (3.0x bonus multiplier)
- Max Level: 30
- Orange color
- Exceptional bonuses

**Mythic** (5.0x bonus multiplier)
- Max Level: 50
- Red color
- God-tier bonuses

### Pet Bonuses

**Mining Speed**: Increases damage dealt to ores
**Ore Value**: Increases money earned from selling ores
**XP Gain**: Increases experience points gained from mining
**Crit Chance**: Increases chance for critical hits
**Backpack Capacity**: Increases total inventory capacity

### Pet Acquisition

**Pet Eggs**: Buy eggs in the shop to hatch random pets
- Common Egg ($100): 80% Common, 20% Uncommon
- Uncommon Egg ($500): 50% Common, 40% Uncommon, 10% Rare
- Rare Egg ($2,000): 20% Common, 40% Uncommon, 30% Rare, 10% Epic
- Epic Egg ($10,000): 20% Uncommon, 40% Rare, 30% Epic, 10% Legendary
- Legendary Egg ($50,000): 20% Rare, 40% Epic, 30% Legendary, 10% Mythic

### Pet Leveling

- Pets gain 10 XP per ore mined (when equipped)
- Each level increases bonus strength by 5%
- XP requirement increases by 50% per level
- Max level depends on pet rarity

### Pet Management

- **Equip Slots**: Maximum 3 pets can be equipped at once
- **Bonus Stacking**: All equipped pet bonuses stack additively
- **Pet UI**: Click on pet display to manage pets
- **Active Bonuses**: View total bonuses from equipped pets

## Phase 6 Features (Retained)

- **Quest System**: Structured quest system with objectives and rewards
- **NPC System**: 3 interactive NPCs (Miner Joe, Gem Collector, Engineer)
- **Quest Types**: Mine ores, earn money, upgrade pickaxe, reach zones
- **Quest Progress Tracking**: Real-time progress updates for all quest types
- **Quest Rewards**: Money and XP rewards for completing quests
- **NPC Dialogue**: Interactive dialogue system when talking to NPCs
- **Quest UI Panel**: Real-time display of active quest progress
- **Quest Save System**: Quest progress saved with game state

### NPCs

**Miner Joe** (Surface Zone)
- Position: (300, 300)
- Dialogue: "Hey there, rookie! I can teach you the basics of mining. Check out my quests to get started!"
- Quests: First Steps, First Earnings, Better Tools

**Gem Collector** (Surface Zone)
- Position: (800, 600)
- Dialogue: "I collect rare gems from all over the world. Can you help me find some?"
- Quests: Rare Collector, Epic Hunter, Legendary Seeker

**Engineer** (Surface Zone)
- Position: (1200, 900)
- Dialogue: "I specialize in equipment upgrades. My quests will help you become a master miner!"
- Quests: Iron Age, Steel Strength, More Space

### Quest Types

**Mine Ore Quests**
- Mine specific ores (e.g., 50 Coal)
- Track by ore type or rarity
- Progress updates when mining

**Earn Money Quests**
- Earn target amount of money (e.g., $5,000)
- Progress updates when selling ores
- Rewards scale with difficulty

**Upgrade Quests**
- Upgrade to specific pickaxe or backpack
- Track by equipment type
- Progress updates when purchasing upgrades

**Zone Quests**
- Reach specific mining zones
- Progress updates when entering zones
- Encourages exploration

### Quest Rewards

- **Money**: Direct cash rewards for completing quests
- **XP**: Experience points to level up player
- **Progression**: Quests guide players through game systems

## Phase 5 Features (Retained)

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
4. Click on NPCs to talk to them and accept quests
5. Click on pet display to manage pets and view bonuses
6. Click on rebirth display to manage rebirth and permanent upgrades
7. Watch for damage numbers and critical hit effects
8. See drop feedback showing ore type and rarity when mining
9. Manage backpack capacity - rare ores take more slots
10. Walk into the green **SELL ZONE** to sell all ores
11. Walk into the purple **PORTAL** to switch zones (or unlock if you have enough money)
12. Click **Shop** to upgrade pickaxes, backpack, and buy pet eggs
13. Click **Save Game** to manually save progress
14. **Rebirth** when you meet requirements to gain permanent bonuses

## Controls

- **W/↑**: Move up
- **A/←**: Move left
- **S/↓**: Move down
- **D/→**: Move right
- **Mouse Click**: Mine ores (deal damage) or interact with NPCs
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
│   ├── questSystem.js  # Centralized quest and NPC system
│   ├── questManager.js # Quest progress tracking and rewards
│   ├── petSystem.js    # Centralized pet system and definitions
│   ├── petManager.js   # Pet inventory and bonus management
│   ├── rebirthSystem.js # Centralized rebirth system and definitions
│   ├── rebirthManager.js # Rebirth logic and permanent upgrades
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
- **Quest System**: Centralized quest and NPC system with progress tracking
- **Pet System**: Centralized pet system with rarity, bonuses, and leveling
- **Rebirth System**: Centralized rebirth system with permanent upgrades and infinite progression

## Future Phases

This is Phase 8 of a 10-phase development plan. Future phases will include:
- Bosses and events
- Multiplayer support
