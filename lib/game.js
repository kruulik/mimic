import Detector from './detector';
import FallingEmoji from './falling_emoji';
import Announce from './announce';

class Game {
  constructor(gameRoot) {
    this.init = this.init.bind(this);
    this.detector = new Detector({
      gameRoot: gameRoot,
      game: this
    });
    this.ui_canvas = document.getElementById("ui_canvas");
    this.ui_ctx = ui_canvas.getContext('2d');
    this.displayScore = document.querySelector(".score");

    this.strikes = 0;
    this.emojiInterval = null;

    this.velocity = 2;
    this.renderDelay = 5000;
    this.multiplier = 1;
    this.score = 0;

    this.faceVisible = this.detector.face_visible;
    this.playing = false;

    this.fallingEmoji = {};
    this.lastEmoji = null;
    this.alerts = [];

    this.renderEmoji = this.renderEmoji.bind(this);
    this.getStrike = this.getStrike.bind(this);
    this.emojiStart = this.emojiStart.bind(this);
    this.mask = null;


    this.dominantEmoji = null;

  }

  init() {
    const toggleButton = document.getElementById("toggleButton");
    this.detector.init();

    toggleButton.addEventListener("click", () => {
      this.detector.toggleDetector();
      this.start();
      this.detector.analyze();
    });
  }

  emojiStart() {
    this.emojiInterval = setInterval(() => {
      this.renderEmoji();
    }, this.renderDelay);
    this.displayScore.innerHTML = 'Score: ';
  }

  start() {
    this.lastTime = 0;
    requestAnimationFrame(this.animate.bind(this));
  }

  gameOver() {
    clearInterval(this.emojiInterval);

    setTimeout(() => {
      this.detector.toggleDetector();
    }, 2500);
  }

  animate(time) {
    const timeDelta = time - this.lastTime;

    this.ui_ctx.save();
    this.ui_ctx.clearRect(0, 0, 480, 640);
    this.animateEmoji(timeDelta);
    if (this.alerts.length > 0){
      this.animateAlerts(timeDelta);
    }
    this.draw(this.ui_ctx);
    this.checkMatch();
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
      vel: [0, this.velocity]
    });

    // console.log([emoji.emojiCode, this.fallingEmoji]);
    this.fallingEmoji[emoji.emojiCode] = emoji;
  }

  animateEmoji(timeDelta){
    for (var emojiCode in this.fallingEmoji) {
      this.fallingEmoji[emojiCode].move(timeDelta);
    }
  }

  animateAlerts(timeDelta){
    // console.log('animate alert');
    this.alerts.forEach((alert) => {
      alert.animate(timeDelta);
    });
  }

  draw(ctx) {
    for (var emojiCode in this.fallingEmoji) {
      this.fallingEmoji[emojiCode].draw(ctx);
    }
  }

  removeEmoji(eCode){
    this.lastEmoji = this.fallingEmoji[eCode];
    delete this.fallingEmoji[eCode];
  }

  removeAlert(alert){
    this.alerts.splice(this.alerts.indexOf(alert), 1);
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
    let timestamp = this.fallingEmoji[eCode].timestamp;
    this.removeEmoji(eCode);
    this.mask_animation = 'match';

    this.scorePoints(timestamp);
    this.increaseDifficulty();
    this.detector.mask = new Image();
    this.detector.mask.src = this.detector.emoji_images[eCode];
    window.setTimeout(() => {
      this.mask_animation = 'none';
    }, 1000);
  }

  scorePoints(timestamp) {
    let elapsedTime = Date.now() - timestamp;
    let score = 10 + (10000 - elapsedTime) * this.multiplier;
    this.score += score;
    this.announce({
      time: elapsedTime,
      score: score,
    });

    this.displayScore.innerHTML = `Score: ${this.score}`;
  }

  increaseDifficulty() {
    // this.velocity += 0.25;
    this.renderDelay -= 750;
    this.multiplier += 1;
    // console.log(this.renderDelay);
  }

  getStrike(){
    this.announce({strike: this.strikes + 1});
    this.strikes += 1;
  }

  announce(options){
    let W = this.ui_canvas.width;
    let min = 100;
    let max = W - min;
    let posX = Math.random() * (max - (min* 2)) + min;

    // debugger
    let alert = new Announce({
      game: this,
      ctx: this.ui_ctx,
      canvas: this.ui_canvas,
      pos: [posX, 100],
      time: options.time,
      score: options.score,
      strike: options.strike,
    });

    this.alerts.push(alert);
  }

  // getStrike() {
  //   let eCode, delay = 1000;
  //   this.strikes += 1;
  //   this.multiplier = 1;
  //   this.mask_animation = 'miss';
  //   switch (this.strikes) {
  //     case 1:
  //       eCode = 128078;
  //       break;
  //     case 2:
  //       eCode = 128078;
  //       break;
  //     case 3:
  //       eCode = 128169;
  //       break;
  //     case 4:
  //       eCode = 128169;
  //       break;
  //     case 5:
  //       eCode = 128128;
  //       delay = 5000;
  //       this.gameOver();
  //       break;
  //   }
  //   this.detector.mask = new Image();
  //   this.detector.mask.src = this.detector.emoji_images[eCode];
  //   window.setTimeout(() => {
  //     this.mask_animation = 'none';
  //   }, delay);
  // }

  // flashMask() {
  //   this.detector.drawMask();
  // }

}

export default Game;
