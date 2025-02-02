export class HealthPotion {
  constructor(x, y, width, height, healAmount, imageSrc) {
    this.x = x;
    this.y = y;
    this.width = width; // Šírka obrázku
    this.height = height; // Výška obrázku
    this.hitboxWidth = width * 0.6; // Hitbox je 60 % šírky
    this.hitboxHeight = height * 0.6; // Hitbox je 60 % výšky
    this.healAmount = healAmount;
    this.image = new Image();
    this.image.src = imageSrc; // Cesta k obrázku pre potion
  }

  // Vykreslenie potionu na plátno
  draw(ctx) {
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);

    // Voliteľné: Vykreslenie hitboxu na debugging (odkomentuj, ak treba)
    // ctx.strokeStyle = "red";
    // ctx.strokeRect(
    //   this.x + (this.width - this.hitboxWidth) / 2,
    //   this.y + (this.height - this.hitboxHeight) / 2,
    //   this.hitboxWidth,
    //   this.hitboxHeight
    // );
  }

  // Kontrola kolízie s hráčom
  checkCollision(player) {
    const hitboxX = this.x + (this.width - this.hitboxWidth) / 2; // Posun hitboxu
    const hitboxY = this.y + (this.height - this.hitboxHeight) / 2;

    const isColliding =
      player.x < hitboxX + this.hitboxWidth &&
      player.x + player.width > hitboxX &&
      player.y < hitboxY + this.hitboxHeight &&
      player.y + player.height > hitboxY;

    if (isColliding) {
      player.health = Math.min(player.health + this.healAmount, 100); // Maximálne zdravie je 100
      return true; // Kolízia nastala, potion bol získaný
    }
    return false; // Žiadna kolízia
  }
}

export class HealthPotionManager {
  constructor(canvasWidth, canvasHeight) {
    this.canvasWidth = canvasWidth; // Šírka herného plátna
    this.canvasHeight = canvasHeight; // Výška herného plátna
    this.potions = []; // Pole pre všetky aktívne potiony
    this.lastSpawnTime = 0; // Čas posledného spawnovania
    this.spawnInterval = 10000; // Interval pre spawn potionov (v ms)
    this.potionImageSrc = "./images/HealthPotion.png"; // Cesta k obrázku potionu
  }

  // Spawn nového potionu
  spawnPotion() {
    const width = 210; // Šírka obrázku potionu
    const height = 160; // Výška obrázku potionu
    const healAmount = 20; // Hodnota pridávaného zdravia
    const x = Math.random() * (this.canvasWidth - width); // Náhodná horizontálna pozícia
    const y = Math.random() * (this.canvasHeight - height); // Náhodná vertikálna pozícia

    // Pridanie nového potionu do poľa
    this.potions.push(new HealthPotion(x, y, width, height, healAmount, this.potionImageSrc));
  }

  // Aktualizácia potionov a kontrola kolízie
  updatePotions(ctx, players, currentTime) {
    // Spawn nového potionu, ak uplynul spawn interval
    if (currentTime - this.lastSpawnTime > this.spawnInterval) {
      this.spawnPotion();
      this.lastSpawnTime = currentTime;
    }

    // Vykreslenie potionov a kontrola ich kolízií s hráčmi
    this.potions = this.potions.filter((potion) => {
      potion.draw(ctx); // Vykresli potion na plátno
      // Skontroluj kolíziu s každým hráčom
      for (const player of players) {
        if (potion.checkCollision(player)) {
          return false; // Potion bol získaný, odstráni ho z poľa
        }
      }
      return true; // Potion zostáva na obrazovke
    });
  }
}
