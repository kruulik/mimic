import Detector from './detector';
import FallingEmoji from './falling_emoji';

class Game {
  constructor(gameRoot) {
    this.init = this.init.bind(this);
    this.detector = new Detector(gameRoot);

    this.ui_canvas = document.getElementById("ui_canvas");
    this.ui_ctx = ui_canvas.getContext('2d');
    this.displayScore = document.querySelector(".score");
    this.displayHighScore = document.querySelector(".high-score");
    this.strikes = 0;
    this.mask_animation = 'none';
    this.score = 0;

    this.faceVisible = this.detector.face_visible;
    this.playing = false;

    this.fallingEmoji = {};

    this.renderEmoji = this.renderEmoji.bind(this);
    this.getStrike = this.getStrike.bind(this);
    this.mask = null;

  }

  init() {
    const toggleButton = document.getElementById("toggleButton");
    const makeEmoji = document.getElementById("makeEmoji");
    this.detector.init();

    toggleButton.addEventListener("click", () => {
      this.detector.toggleDetector();
      this.start();
    });
    this.detector.analyze();

    makeEmoji.addEventListener("click", () => {
      this.renderEmoji();
    });

  }

  start() {
    this.lastTime = 0;
    requestAnimationFrame(this.animate.bind(this));
  }

  animate(time) {
    const timeDelta = time - this.lastTime;

    this.ui_ctx.save();
    this.ui_ctx.clearRect(0, 0, 480, 640);
    this.fall(timeDelta);
    this.draw(this.ui_ctx);
    this.checkMatch();
    if (this.mask_animation !== 'none') {
      this.flashMask(this.mask_animation);
    }
    this.lastTime = time;
    this.ui_ctx.restore();

    requestAnimationFrame(this.animate.bind(this));
  }

  renderEmoji() {
    let W = this.ui_canvas.width;
    let min = 25;
    let max = W - min;
    let posX = Math.random() * (max - min) + min;

    let emoji = new FallingEmoji({
      game: this,
      ctx: this.ui_ctx,
      pos: [posX, 0],
      vel: [0, 2]
    });
    console.log([emoji.emojiCode, this.fallingEmoji]);
    this.fallingEmoji[emoji.emojiCode] = emoji;
  }

  fall(timeDelta) {
    for (var emojiCode in this.fallingEmoji) {
      this.fallingEmoji[emojiCode].move(timeDelta);
    }
  }

  draw(ctx) {
    for (var emojiCode in this.fallingEmoji) {
      this.fallingEmoji[emojiCode].draw(ctx);
    }
  }

  remove(emojiCode) {
    delete this.fallingEmoji[emojiCode];
  }

  checkMatch() {
    var emoji = this.detector.dominantEmoji;
    if (emoji in this.fallingEmoji) {
      this.matched(emoji);
      // TODO when generating emoji, amke sure there are no duplicates!
    } else {
      this.detector.drawFeaturePoints();
    }
  }

  matched(eCode) {
    this.remove(eCode);
    this.mask_animation = 'match';
    this.increaseScore();
    this.detector.mask = new Image();
    this.detector.mask.src = this.detector.emoji_images[eCode];
    window.setTimeout(() => {
      this.mask_animation = 'none';
    }, 1000 );
  }

  increaseScore() {
    this.score += 1;
    this.displayScore.innerHTML = `Score: ${this.score}`;
  }

  getStrike() {
    console.log(this.strikes);
    let eCode;
    this.strikes += 1;
    this.mask_animation = 'miss';
    switch(this.strikes) {
      case 1:
        eCode = 128078;
        break;
      case 2:
        eCode = 128169;
        break;
      case 3:
        eCode = 128128;
        break;
    }
    this.detector.mask = new Image();
    this.detector.mask.src = this.detector.emoji_images[eCode];
    window.setTimeout(() => {
      this.mask_animation = 'none';
    }, 1000 );
  }

  flashMask(){
    this.detector.drawMask();
  }

}

export default Game;
