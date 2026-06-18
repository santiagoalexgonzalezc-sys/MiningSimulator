import { getBoss, calculateBossHP, calculateBossRewards } from './bossData.js';

/**
 * Boss class - represents an individual boss instance
 */
export class Boss {
    constructor(bossId, rebirthCount = 0) {
        const bossData = getBoss(bossId);
        if (!bossData) {
            throw new Error(`Boss ${bossId} not found`);
        }
        
        this.id = bossData.id;
        this.name = bossData.name;
        this.description = bossData.description;
        this.baseHP = bossData.hp;
        this.level = bossData.level;
        this.requiredZone = bossData.requiredZone;
        this.arena = bossData.arena;
        this.color = bossData.color;
        this.rewards = bossData.rewards;
        this.attackPatterns = bossData.attackPatterns;
        
        // Calculate scaled HP based on rebirth
        this.maxHP = calculateBossHP(this.baseHP, rebirthCount);
        this.currentHP = this.maxHP;
        
        // Position and size
        this.x = 0;
        this.y = 0;
        this.width = 120;
        this.height = 120;
        
        // State
        this.isAlive = true;
        this.isAttacking = false;
        this.currentAttack = null;
        this.attackTimer = 0;
        this.attackCooldown = 3000; // 3 seconds between attacks
        this.lastAttackTime = 0;
        
        // Animation
        this.animationFrame = 0;
        this.animationSpeed = 0.1;
        this.scale = 1;
        this.targetScale = 1;
        
        // Visual effects
        this.particles = [];
        this.damageNumbers = [];
        this.shakeIntensity = 0;
        
        // Defeat animation
        this.isDefeated = false;
        this.defeatAnimationProgress = 0;
    }
    
    /**
     * Update boss state
     */
    update(deltaTime, player) {
        if (!this.isAlive) {
            if (this.isDefeated) {
                this.updateDefeatAnimation(deltaTime);
            }
            return;
        }
        
        // Update animation
        this.animationFrame += this.animationSpeed;
        
        // Update scale (smooth transitions)
        this.scale += (this.targetScale - this.scale) * 0.1;
        
        // Update shake effect
        if (this.shakeIntensity > 0) {
            this.shakeIntensity *= 0.9;
            if (this.shakeIntensity < 0.1) {
                this.shakeIntensity = 0;
            }
        }
        
        // Update particles
        this.updateParticles(deltaTime);
        
        // Update damage numbers
        this.updateDamageNumbers(deltaTime);
        
        // Attack logic
        this.updateAttack(deltaTime, player);
    }
    
    /**
     * Update attack logic
     */
    updateAttack(deltaTime, player) {
        const now = Date.now();
        
        if (now - this.lastAttackTime >= this.attackCooldown) {
            this.performAttack(player);
            this.lastAttackTime = now;
        }
        
        if (this.isAttacking) {
            this.attackTimer -= deltaTime;
            if (this.attackTimer <= 0) {
                this.isAttacking = false;
                this.currentAttack = null;
            }
        }
    }
    
    /**
     * Perform an attack
     */
    performAttack(player) {
        if (!this.attackPatterns || this.attackPatterns.length === 0) return;
        
        const randomPattern = this.attackPatterns[Math.floor(Math.random() * this.attackPatterns.length)];
        this.currentAttack = randomPattern;
        this.isAttacking = true;
        this.attackTimer = 1000; // 1 second attack duration
        
        // Visual feedback
        this.targetScale = 1.2;
        setTimeout(() => {
            this.targetScale = 1;
        }, 200);
        
        // Apply attack effect (simplified - actual damage logic in game.js)
        this.shakeIntensity = 10;
    }
    
    /**
     * Take damage
     */
    takeDamage(damage) {
        if (!this.isAlive) return 0;
        
        this.currentHP -= damage;
        this.shakeIntensity = 5;
        this.targetScale = 0.9;
        setTimeout(() => {
            this.targetScale = 1;
        }, 100);
        
        // Add damage number
        this.damageNumbers.push({
            value: damage,
            x: this.x + Math.random() * this.width,
            y: this.y,
            life: 1000,
            velocityY: -2
        });
        
        // Check for defeat
        if (this.currentHP <= 0) {
            this.currentHP = 0;
            this.defeat();
        }
        
        return damage;
    }
    
    /**
     * Defeat the boss
     */
    defeat() {
        this.isAlive = false;
        this.isDefeated = true;
        this.defeatAnimationProgress = 0;
        
        // Create defeat particles
        for (let i = 0; i < 50; i++) {
            this.particles.push({
                x: this.x + this.width / 2,
                y: this.y + this.height / 2,
                vx: (Math.random() - 0.5) * 10,
                vy: (Math.random() - 0.5) * 10,
                life: 2000,
                color: this.color,
                size: Math.random() * 10 + 5
            });
        }
    }
    
    /**
     * Update defeat animation
     */
    updateDefeatAnimation(deltaTime) {
        this.defeatAnimationProgress += deltaTime / 2000; // 2 second defeat animation
        this.scale = 1 - this.defeatAnimationProgress;
        
        if (this.defeatAnimationProgress >= 1) {
            this.scale = 0;
        }
    }
    
    /**
     * Update particles
     */
    updateParticles(deltaTime) {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life -= deltaTime;
            
            if (particle.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }
    
    /**
     * Update damage numbers
     */
    updateDamageNumbers(deltaTime) {
        for (let i = this.damageNumbers.length - 1; i >= 0; i--) {
            const number = this.damageNumbers[i];
            number.y += number.velocityY;
            number.life -= deltaTime;
            
            if (number.life <= 0) {
                this.damageNumbers.splice(i, 1);
            }
        }
    }
    
    /**
     * Render the boss
     */
    render(ctx) {
        if (!this.isAlive && this.scale <= 0) return;
        
        ctx.save();
        
        // Apply shake effect
        if (this.shakeIntensity > 0) {
            ctx.translate(
                (Math.random() - 0.5) * this.shakeIntensity,
                (Math.random() - 0.5) * this.shakeIntensity
            );
        }
        
        // Apply scale
        const centerX = this.x + this.width / 2;
        const centerY = this.y + this.height / 2;
        ctx.translate(centerX, centerY);
        ctx.scale(this.scale, this.scale);
        ctx.translate(-centerX, -centerY);
        
        // Draw boss body
        this.drawBossBody(ctx);
        
        // Draw attack effect
        if (this.isAttacking && this.currentAttack) {
            this.drawAttackEffect(ctx);
        }
        
        ctx.restore();
        
        // Draw particles (outside save/restore for performance)
        this.drawParticles(ctx);
        
        // Draw damage numbers
        this.drawDamageNumbers(ctx);
        
        // Draw health bar
        this.drawHealthBar(ctx);
    }
    
    /**
     * Draw boss body
     */
    drawBossBody(ctx) {
        // Glow effect
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 20;
        
        // Main body
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(
            this.x + this.width / 2,
            this.y + this.height / 2,
            this.width / 2,
            0,
            Math.PI * 2
        );
        ctx.fill();
        
        // Inner detail
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.beginPath();
        ctx.arc(
            this.x + this.width / 2 - 15,
            this.y + this.height / 2 - 15,
            this.width / 4,
            0,
            Math.PI * 2
        );
        ctx.fill();
        
        // Eyes
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(this.x + this.width / 2 - 20, this.y + this.height / 2 - 10, 10, 0, Math.PI * 2);
        ctx.arc(this.x + this.width / 2 + 20, this.y + this.height / 2 - 10, 10, 0, Math.PI * 2);
        ctx.fill();
        
        // Pupils
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(this.x + this.width / 2 - 20, this.y + this.height / 2 - 10, 5, 0, Math.PI * 2);
        ctx.arc(this.x + this.width / 2 + 20, this.y + this.height / 2 - 10, 5, 0, Math.PI * 2);
        ctx.fill();
        
        // Reset shadow
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
    }
    
    /**
     * Draw attack effect
     */
    drawAttackEffect(ctx) {
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 3;
        ctx.globalAlpha = 0.7;
        
        // Draw attack pattern based on type
        switch (this.currentAttack) {
            case 'slam':
            case 'ground_pound':
            case 'magma_fist':
                // Ground shockwave
                ctx.beginPath();
                ctx.arc(
                    this.x + this.width / 2,
                    this.y + this.height,
                    50 + (1 - this.attackTimer / 1000) * 100,
                    0,
                    Math.PI * 2
                );
                ctx.stroke();
                break;
            case 'crystal_shard':
            case 'lava_burst':
            case 'void_beam':
            case 'cosmic_ray':
                // Beam effect
                ctx.beginPath();
                ctx.moveTo(this.x + this.width / 2, this.y + this.height / 2);
                ctx.lineTo(this.x + this.width / 2 + 200, this.y + this.height / 2);
                ctx.stroke();
                break;
            case 'fire_wave':
            case 'dark_pulse':
            case 'starfall':
            case 'lightning_storm':
                // Wave effect
                ctx.beginPath();
                for (let i = 0; i < 5; i++) {
                    const y = this.y + this.height / 2 + Math.sin(i * 0.5) * 30;
                    ctx.lineTo(this.x + this.width / 2 + i * 40, y);
                }
                ctx.stroke();
                break;
            default:
                // Default circle effect
                ctx.beginPath();
                ctx.arc(
                    this.x + this.width / 2,
                    this.y + this.height / 2,
                    80,
                    0,
                    Math.PI * 2
                );
                ctx.stroke();
        }
        
        ctx.globalAlpha = 1;
    }
    
    /**
     * Draw particles
     */
    drawParticles(ctx) {
        for (const particle of this.particles) {
            ctx.fillStyle = particle.color;
            ctx.globalAlpha = particle.life / 2000;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.globalAlpha = 1;
    }
    
    /**
     * Draw damage numbers
     */
    drawDamageNumbers(ctx) {
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        
        for (const number of this.damageNumbers) {
            ctx.fillStyle = `rgba(255, 255, 255, ${number.life / 1000})`;
            ctx.fillText(number.value, number.x, number.y);
        }
    }
    
    /**
     * Draw health bar
     */
    drawHealthBar(ctx) {
        if (!this.isAlive) return;
        
        const barWidth = 200;
        const barHeight = 20;
        const barX = this.x + this.width / 2 - barWidth / 2;
        const barY = this.y - 30;
        
        // Background
        ctx.fillStyle = '#333333';
        ctx.fillRect(barX, barY, barWidth, barHeight);
        
        // Health fill
        const healthPercent = this.currentHP / this.maxHP;
        ctx.fillStyle = healthPercent > 0.5 ? '#27ae60' : healthPercent > 0.25 ? '#f39c12' : '#e74c3c';
        ctx.fillRect(barX, barY, barWidth * healthPercent, barHeight);
        
        // Border
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.strokeRect(barX, barY, barWidth, barHeight);
        
        // Text
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(
            `${this.name}: ${this.currentHP}/${this.maxHP}`,
            barX + barWidth / 2,
            barY + barHeight / 2 + 4
        );
    }
    
    /**
     * Get rewards for defeating this boss
     */
    getRewards(rebirthCount) {
        return calculateBossRewards(this.rewards, rebirthCount);
    }
    
    /**
     * Reset boss for new fight
     */
    reset(rebirthCount = 0) {
        this.maxHP = calculateBossHP(this.baseHP, rebirthCount);
        this.currentHP = this.maxHP;
        this.isAlive = true;
        this.isDefeated = false;
        this.isAttacking = false;
        this.currentAttack = null;
        this.attackTimer = 0;
        this.lastAttackTime = 0;
        this.scale = 1;
        this.targetScale = 1;
        this.particles = [];
        this.damageNumbers = [];
        this.shakeIntensity = 0;
        this.defeatAnimationProgress = 0;
    }
    
    /**
     * Serialize boss state
     */
    toJSON() {
        return {
            id: this.id,
            currentHP: this.currentHP,
            isAlive: this.isAlive,
            isDefeated: this.isDefeated
        };
    }
    
    /**
     * Deserialize boss state
     */
    fromJSON(data) {
        if (data.id !== this.id) return;
        this.currentHP = data.currentHP;
        this.isAlive = data.isAlive;
        this.isDefeated = data.isDefeated;
    }
}
