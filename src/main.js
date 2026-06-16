import { Game } from './game.js';

// Initialize game when DOM is loaded
window.addEventListener('DOMContentLoaded', () => {
    window.game = new Game();
    window.game.init();
});
