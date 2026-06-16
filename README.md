# Mining Simulator

A browser-based mining simulator game built with HTML5 Canvas and ES6 JavaScript.

## Phase 1 Features

- **WASD Movement**: Smooth player movement with collision detection
- **Camera System**: Camera follows the player throughout the world
- **2D World**: 2000x2000 pixel world with grid pattern
- **Mining System**: Click on ores to mine them (within range)
- **Ore Types**: Coal, Iron, Gold, and Diamond with different rarities
- **Inventory System**: Track collected ores with capacity limits
- **Sell Zone**: Green zone where ores are automatically sold for money
- **Upgrade Shop**: Purchase pickaxe upgrades and backpack capacity increases
- **Save/Load**: Game progress automatically saved to LocalStorage

## How to Play

1. Open `index.html` in a modern web browser
2. Use **WASD** or **Arrow Keys** to move the player
3. Click on ores to mine them (must be within range)
4. Walk into the green **SELL ZONE** to sell all ores
5. Click **Shop** to buy upgrades with your money
6. Click **Save Game** to manually save progress

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
│   ├── game.js         # Main game loop and coordination
│   ├── player.js       # Player movement and stats
│   ├── camera.js       # Camera following system
│   ├── world.js        # World generation and ore spawning
│   ├── inventory.js    # Inventory management
│   ├── shop.js         # Upgrade shop system
│   └── save.js         # LocalStorage save/load
```

## Technical Details

- **Framework**: Pure HTML5 Canvas + ES6 JavaScript
- **Architecture**: Modular class-based design
- **Performance**: Target 60 FPS with efficient collision detection
- **Storage**: LocalStorage for persistent saves (under 100 KB)

## Future Phases

This is Phase 1 of a 10-phase development plan. Future phases will include:
- Multiple mining zones
- Ore rarity system overhaul
- Equipment progression
- Backpack upgrades
- Quest system
- Pets system
- Rebirth system
- Bosses and events
- Multiplayer support
