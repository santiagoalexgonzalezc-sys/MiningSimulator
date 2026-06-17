# Mining Simulator - Unit Tests

This directory contains comprehensive unit tests for the Mining Simulator game economy systems.

## Test Coverage

The test suite covers all recently rebalanced economy systems:

- **oreData.test.js** - Ore value calculations, rarity generation, zone bonuses
- **pickaxeData.test.js** - Pickaxe progression, damage calculations, scaling
- **petSystem.test.js** - Pet bonuses, 25% cap enforcement, egg hatching
- **rebirthSystem.test.js** - Additive rebirth growth, luck capping, upgrade costs
- **inventorySystem.test.js** - Backpack capacity, slot costs, inventory calculations
- **zone.test.js** - Zone unlock requirements, progression chain

## Installation

First, install the required dependencies:

```bash
npm install
```

This will install:
- `jest` - Testing framework
- `@babel/preset-env` - Babel preset for ES6+ support
- `jest-environment-jsdom` - DOM environment (if needed for UI tests)

## Running Tests

Run all tests:
```bash
npm test
```

Run tests in watch mode (auto-rerun on file changes):
```bash
npm run test:watch
```

Run tests with coverage report:
```bash
npm run test:coverage
```

## Test Structure

Tests are organized by module, mirroring the `src/` structure:

```
tests/
├── oreData.test.js
├── pickaxeData.test.js
├── petSystem.test.js
├── rebirthSystem.test.js
├── inventorySystem.test.js
├── zone.test.js
└── README.md
```

## Key Test Categories

### Economy Balance Tests
Each test file includes "Economy balance checks" that verify:
- Scaling follows guidelines (20-50% per upgrade)
- Values are reachable with rebalanced ore prices
- No single system breaks progression
- Caps are enforced (25% pet bonus, 300% luck)

### Data Validation Tests
- All required properties exist
- Values are within expected ranges
- Progression chains are complete
- Invalid inputs are handled gracefully

### Calculation Tests
- Mathematical formulas are correct
- Multipliers apply properly
- Edge cases are handled
- Random distributions are reasonable

## Test Philosophy

The tests follow the economy balancing guidelines:

1. **No huge jumps** - Verify 20-50% efficiency increases
2. **Smooth scaling** - Check ~2x ore value progression
3. **Pet caps** - Ensure no pet exceeds 25% bonus
4. **Additive rebirth** - Verify linear RP scaling, not exponential
5. **Luck limits** - Confirm 300% cap is enforced
6. **Reachable goals** - Validate costs match ore values

## Adding New Tests

When adding new economy features:

1. Create a new test file in `tests/`
2. Include data validation tests
3. Add economy balance checks
4. Test edge cases and invalid inputs
5. Verify against the balancing guidelines

## Continuous Integration

These tests can be integrated into CI/CD pipelines to ensure economy balance is maintained as the game evolves.
