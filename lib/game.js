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
    this.startScreen = document.querySelector(".start-screen");

    // this.timeBar = document.getElementById("timer");

    this.strikes = 0;
    this.emojiInterval = null;

    this.velocity = 2;
    this.renderDelay = 4000;
    this.multiplier = 1;
    this.score = 0;

    this.faceVisible = this.detector.face_visible;
    this.recenterStartTime = null;
    this.playing = false;
    this.emojiAreFalling = false;

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
      // this.detector.analyze();
      this.detector.recenterFace();
      this.playing = true;
      this.checkMatch();
      this.startScreen.classList.add('hidden');
    });
  }

  emojiStart() {

    if (this.playing) {
      this.emojiInterval = setInterval(() => {
        this.renderEmoji();
      }, this.renderDelay);
      this.displayScore.innerHTML = 'Score: 0';
    }
  }

  // gameOver() {
  //   clearInterval(this.emojiInterval);
  //
  //   setTimeout(() => {
  //     this.detector.toggleDetector();
  //   }, 2500);
  // }

  start() {

    let startTime, runTime;
    this.lastTime = 0;


    // let timeTime, timeTimeTIMEtime, timeytime;
    // debugger
    let animate = (time) => {
      const timeDelta = time - this.lastTime;
      // debugger
      runTime = new Date().getTime() - startTime;
      runTime = runTime / (30 * 1000);
      this.ui_ctx.save();
      this.ui_ctx.clearRect(0, 0, 480, 640);
      this.animateEmoji(timeDelta);
      if (this.alerts.length > 0){
        this.animateAlerts(timeDelta);
      }
      this.draw(this.ui_ctx);
      this.lastTime = time;

      this.ui_ctx.restore();

      if (runTime < 1) requestAnimationFrame(animate);

    };
    startTime = new Date().getTime();
    animate(this.lastTime);

  }


  renderEmoji() {
    let W = this.ui_canvas.width;
    let min = 50;
    let max = W - min;
    let posX = Math.random() * (max - min) + min;

    let emoji = new FallingEmoji({
      game: this,
      ctx: this.ui_ctx,
      canvas: this.ui_canvas,
      pos: [posX, 0],
      vel: [0, this.velocity]
    });

    this.fallingEmoji[emoji.emojiCode] = emoji;
  }

  recenterMask(){
    let canvas = this.detector.dt_canvas;
    let ctx = this.detector.dt_ctx;
    let X = canvas.width * 0.5;
    let Y = canvas.height * 0.5;
    let startTime, time;
    let animation = () => {
      time = new Date().getTime() - this.startTime;
      time = time / 1000;
      ctx.fillStyle="rgba(0,0,0,.7)";
      ctx.fillRect(0, 0, 480, 600);
      ctx.save();
      // ctx.strokeStyle = 'gray';
      ctx.beginPath();
      ctx.moveTo(X - 100, Y - 100);
      ctx.bezierCurveTo(X-100, Y-220, X+100, Y-220, X+100, Y-100);
      ctx.bezierCurveTo(X+100, Y+130, X-100, Y+130, X-100, Y-100);
      ctx.lineWidth = 5;
      ctx.clip();
      ctx.clearRect(0, 0, 480, 640);
      ctx.restore();
      if (time<1) requestAnimationFrame(animation);
    };
    startTime = this.recenterStartTime;
    animation();
  }


  animateEmoji(timeDelta){
    for (var emojiCode in this.fallingEmoji) {
      this.fallingEmoji[emojiCode].move(timeDelta);
    }
  }

  animateAlerts(timeDelta){
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
    let check = () => {
      requestAnimationFrame(check);
      var emoji = this.detector.dominantEmoji;
      if (emoji in this.fallingEmoji) {
        this.matched(emoji);
      }
    };
    if (this.playing) {
      check();
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
    this.velocity += 0.1;
    this.renderDelay -= 1000;
    this.multiplier += 1;
  }

  getStrike(){
    this.announce({strike: this.strikes + 1});
    this.multiplier = 0;
    this.strikes += 1;
  }

  announce(options){
    let W = this.ui_canvas.width;
    let min = 100;
    let max = W - min;
    let posX = Math.random() * (max - (min* 2)) + min;

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

}

export default Game;
