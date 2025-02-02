export class Character {
  constructor(name, x, y, dx, width, height, color, spriteSheet) {
    this.name = name;
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.width = width;
    this.height = height;
    this.color = color;
    this.dy = 0;
    this.isJumping = false;
    this.isFalling = false;
    this.jumpCount = 0;
    this.maxJumps = 2;
    this.health = 100;
    this.attack = false;
    this.canAttack = true; // Kontrola, či môže útočiť
    this.lastDirection = 'right';
    this.spriteSheet = spriteSheet; // Použitie spriteSheet predaného cez konštruktor
    this.currentFrame = 0;
    this.frameDelay = 10;
    this.runFrameDelay = 6;
    this.frameCounter = 0;
    this.scaleFactor = 2;
    this.previousState = "idle"; // Predchádzajúci stav animácie
  }

  updatePosition(gravity, canvasHeight, canvasWidth) {
    this.x += this.dx;
    this.y += this.dy;

    // Zabezpečenie, aby postava nespadla pod zem
    if (this.y + this.height < canvasHeight + 20) {
      this.dy += gravity;
      this.isFalling = true;
    } else {
      this.dy = 0;
      this.isJumping = false;
      this.isFalling = false;
      this.jumpCount = 0;
      //vyska spawnu
      this.y = canvasHeight - this.height + 20;
    }

    // Zabránenie pohybu mimo plátno
    if (this.x < 0) this.x = 0;
    if (this.x + this.width > canvasWidth) this.x = canvasWidth - this.width;

    // Sledovanie smeru
    if (this.dx > 0) this.lastDirection = 'right';
    if (this.dx < 0) this.lastDirection = 'left';
  }

  draw(ctx) {
    let currentSprite = this.spriteSheet.idle;

    // Animácia na základe stavu
    if (this.attack) {
      currentSprite = this.spriteSheet.attack;
    } else if (this.dx !== 0) {
      currentSprite = this.spriteSheet.run;
    } else if (this.isJumping || this.dy < 0) {
      currentSprite = this.spriteSheet.jump;
    } 
    let numFrames = 4;
    if (currentSprite === this.spriteSheet.run) numFrames = 8;
    if (currentSprite === this.spriteSheet.jump) numFrames = 2;
    if (currentSprite === this.spriteSheet.attack) numFrames = 1;

    const frameWidth = currentSprite.width / numFrames;
    const frameHeight = currentSprite.height;

    const currentFrameDelay = currentSprite === this.spriteSheet.run ? this.runFrameDelay : this.frameDelay;

    // Resetovanie snímky pri zmene animácie
    if (this.previousState !== currentSprite) {
      this.currentFrame = 0;
    }

    if (this.frameCounter >= currentFrameDelay) {
      this.currentFrame++;
      if (this.currentFrame >= numFrames) {
        this.currentFrame = 0;
        if (currentSprite === this.spriteSheet.attack) this.attack = false; // Koniec animácie útoku
      }
      this.frameCounter = 0;
    }
    this.frameCounter++;

    const flipX = this.lastDirection === 'left' ? -1 : 1;

    ctx.save();
    ctx.translate(this.x + this.width / 2, this.y + this.height / 2); // Posun do stredu postavy
    ctx.scale(flipX * this.scaleFactor, this.scaleFactor); // Zväčšenie a otočenie podľa smeru
    ctx.translate(-this.width / 2, -this.height / 2); // Posun späť pre kreslenie

    ctx.drawImage(
      currentSprite,
      frameWidth * this.currentFrame, 0, frameWidth, frameHeight,
      0, 0, this.width, this.height
    );

    ctx.restore();

    this.previousState = currentSprite; // Uloženie predchádzajúceho stavu
  }

  handleInput(keys, upKey, leftKey, rightKey, attackKey, gravity, canvasHeight) {
    this.dx = keys[leftKey] ? -10 : keys[rightKey] ? 10 : 0;

    if (keys[upKey] && !this.isJumping) {
      this.dy = -30;
      this.isJumping = true;
    }

    // Aktivácia útoku iba pri jednorazovom stlačení
    if (keys[attackKey] && this.canAttack) {
      this.attack = true;
      this.canAttack = false; // Zakázanie opakovania pri držaní klávesy
    }
  }

  resetAttackKey(keyReleased, attackKey) {
    // Uvoľnenie klávesy umožní nový útok
    if (keyReleased === attackKey) {
      this.canAttack = true;
    }
  }

  checkAttack(target) {
    if (this.attack) {
      const attackWidth = 50;
      const attackHeight = 20;
      const attackX = this.lastDirection === 'right'
        ? this.x + this.width - 150
        : this.x - attackWidth + 150;
  
      const attackY = this.y + this.height / 2 - attackHeight / 2;
  
      if (
        attackX + attackWidth > target.x &&
        attackX < target.x + target.width &&
        attackY + attackHeight > target.y &&
        attackY < target.y + target.height
      ) {
        target.health -= 1;
      }
    }
  }
}
