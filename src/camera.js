/**
 * Camera class - follows the player and handles viewport
 */
export class Camera {
    constructor(player) {
        this.player = player;
        this.x = 0;
        this.y = 0;
        this.width = window.innerWidth;
        this.height = window.innerHeight;
    }
    
    update() {
        // Center camera on player
        this.x = this.player.x + this.player.width / 2 - this.width / 2;
        this.y = this.player.y + this.player.height / 2 - this.height / 2;
    }
    
    resize(width, height) {
        this.width = width;
        this.height = height;
    }
}
