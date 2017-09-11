import { EmojiImages } from './emoji';

class FallingEmoji {
  constructor(options) {
    this.ctx = options.ctx;
    this.pos = options.pos;
    this.vel = options.vel;
    this.game = options.game;
    this.emojiCode = null;
    this.emoji = null;
    this.emoji_images = EmojiImages.falling;

    this.generateEmoji(this.ctx);
  }

  generateEmoji(ctx){
    let values = Object.keys(this.emoji_images);
    this.emojiCode = values[Math.floor (Math.random() * values.length)];
    this.emoji = new Image();
    this.emoji.src = this.emoji_images[this.emojiCode];
    this.draw(ctx);
  }

  draw(ctx){
    ctx.drawImage(this.emoji, this.pos[0], this.pos[1], 50, 50);
  }

  move(timeDelta) {
    const velocityScale = timeDelta / NORMAL_FRAME_TIME_DELTA,
        offsetX = this.vel[0] * velocityScale,
        offsetY = this.vel[1] * velocityScale;

    this.pos = [this.pos[0] + offsetX, this.pos[1] + offsetY];
    if (this.pos[1] > 640) {
      this.remove();
      this.game.getStrike();
    }
  }

  remove() {
    this.game.remove(this.emojiCode);
  }

}

const NORMAL_FRAME_TIME_DELTA = 1000/60;

export default FallingEmoji;
