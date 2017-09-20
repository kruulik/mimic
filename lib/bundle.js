/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__emoji__ = __webpack_require__(1);



class Detector {

  constructor(options) {
    this.game = options.game;
    this.gameRoot = options.gameRoot;
    this.dt_canvas = null;
    this.dt_ctx = null;
    this.detector = new affdex.CameraDetector(this.gameRoot);
    this.detector.detectAllEmojis();
    this.init = this.init.bind(this);
    this.analyze = this.analyze.bind(this);
    this.getMaskSize = this.getMaskSize.bind(this);
    this.getFaceCenter = this.getFaceCenter.bind(this);
    this.drawFeaturePoints = this.drawFeaturePoints.bind(this);
    this.drawMask = this.drawMask.bind(this);
    this.toggleDetector = this.toggleDetector.bind(this);
    this.dominantEmoji = null;
    this.toMatch = null;
    this.frames = 0;
    this.animationFrames = 0;
    this.face_visible = false;
    this.face = null;
    this.image = null;
    this.emoji_images = Object.assign({}, __WEBPACK_IMPORTED_MODULE_0__emoji__["a" /* EmojiImages */].ui, __WEBPACK_IMPORTED_MODULE_0__emoji__["a" /* EmojiImages */].falling);

    this.recenterTimeout = null;
    this.faceDetected = this.faceDetected.bind(this);
    this.noFaceDetected = this.noFaceDetected.bind(this);

  }

  init() {
    this.detector.addEventListener("onInitializeSuccess", () => {
      this.dt_canvas = document.getElementById("face_video_canvas");
      this.dt_ctx = this.dt_canvas.getContext('2d');
      const video = document.getElementById("face_video");
      this.dt_canvas.style.display = 'block';
      video.style.display = 'none';
    });

    this.detector.addEventListener("onInitializeFailure", () => {
      console.log('initialize failed');
    });

  }


  analyze() {
    const loading = document.querySelector(".loading");
    this.detector.addEventListener("onImageResultsSuccess", (faces, image, timestamps) => {

      this.image = image;
      this.timestamps = timestamps;
      this.face = faces[0];
      // this.recenterFace();
      this.detectFace();
      // this.noFaceDetected();
    }).then(() => {
      console.log(loading); 
      loading.classList.toggle('hidden');
    });

  }

  detectFace() {

    if (this.frames > 200 && this.face_visible) {
      this.noFaceDetected();
    }
    if (this.face) {
      this.frames = 0;
      this.faceDetected();
    } else {
      this.frames++;
      console.log('no face');
    }
  }

  faceDetected() {
    this.face_visible = true;

    if (!this.game.emojiAreFalling && this.game.playing) {
      this.game.emojiAreFalling = true;
      this.game.emojiStart();
    }

    this.dominantEmoji = this.face.emojis.dominantEmoji.codePointAt(0);
  }

  noFaceDetected() {
    this.game.fallingEmoji = {};
    this.game.emojiAreFalling = false;
    this.game.playing = false;
    this.face_visible = false;

    this.recenterFace()
      .then(() => {
        this.face_visible = true;
        this.game.playing = true;
        clearInterval(this.game.emojiInterval);

        // this.game.emojiStart();
        this.frames = 0;
        this.drawFeaturePoints(2000).then(() => {
          this.detectFace();
        });

      })
      .catch(
        (reason) => {
          console.log(reason);
          alert('Cannot detect face! Please reload the page; something broke :( ');
        }
      );
  }

  recenterFace() {

    if (!this.detector.isRunning){
      this.analyze();

    }

    let timeout = Array.from(new Array(200), (val, index) => index * 100 + 100);

    return new Promise((resolve, reject) => {

      let startTime, time;
      let faceFound = false;
      // this.game.recenterMask();
      let findFace = () => {
        time = new Date().getTime() - startTime;
        time = time / 10000;
        this.game.recenterStartTime = new Date().getTime();
        if (this.face){
          faceFound = true;
          return resolve('face found');
        }
        if (time < 1) requestAnimationFrame(findFace);
      };
      startTime = new Date().getTime();

      if (!faceFound){
        findFace();
      } else {
        return reject('no face found');
      }

    });

  }


  drawFeaturePoints(duration) {

    return new Promise(resolve => {

      let startTime, time;
      let animation = () => {
        time = new Date().getTime() - startTime;
        time = time / duration;
        let img = this.image;
        let featurePoints = this.face.featurePoints;
        let hRatio = this.dt_ctx.canvas.width / img.width;
        let wRatio = this.dt_ctx.canvas.height / img.height;
        let ratio = Math.min(hRatio, wRatio);

        let maskPos = this.getFaceCenter(featurePoints);
        let maskSize = this.getMaskSize(featurePoints);
        if (time<1) requestAnimationFrame(animation);

        this.dt_ctx.strokeStyle = "#FFFFFF";
        this.dt_ctx.beginPath();
        this.dt_ctx.arc(maskPos[0], maskPos[1], (maskSize), 0, 2 * Math.PI);
        this.dt_ctx.stroke();
      };
      startTime = new Date().getTime();
      animation();

      return resolve('back to normal');

    });

  }

  drawMask() {
    let img = this.image;
    let featurePoints = this.face.featurePoints;
    let hRatio = this.dt_ctx.canvas.width / img.width;
    let wRatio = this.dt_ctx.canvas.height / img.height;
    let ratio = Math.min(hRatio, wRatio);

    let maskSize = this.getMaskSize(featurePoints) * 3;
    let faceCenter = this.getFaceCenter(featurePoints);

    this.dt_ctx.drawImage(this.mask, faceCenter[0] - (maskSize / 2), faceCenter[1] / 2, maskSize, maskSize);
  }

  getMaskSize(fP) {
    let rx, ry, lx, ly, rxAVG, ryAVG, lxAVG, lyAVG;

    rx = [fP[17].x, fP[16].x];
    lx = [fP[18].x, fP[19].x];
    ry = [fP[17].y, fP[16].y];
    ly = [fP[18].y, fP[19].y];

    rxAVG = rx.reduce((acc, num) => acc + num, 0) / 2;
    ryAVG = ry.reduce((acc, num) => acc + num, 0) / 2;
    lxAVG = lx.reduce((acc, num) => acc + num, 0) / 2;
    lyAVG = ly.reduce((acc, num) => acc + num, 0) / 2;
    return Math.hypot(
      (rxAVG - lxAVG),
      (ryAVG - lyAVG)
    );
  }

  getFaceCenter(fP) {
    let cx = [fP[11].x, fP[17].x, fP[18].x];
    let cy = [fP[11].y, fP[17].y, fP[18].y];

    let cxAVG = cx.reduce((acc, num) => acc + num) / cx.length;
    let cyAVG = cy.reduce((acc, num) => acc + num) / cy.length;
    return [cxAVG, cyAVG];
  }

  toggleDetector() {
    if (!this.detector.isRunning) {
      this.detector.start();
    } else {
      this.detector.removeEventListener();
      this.detector.stop();
      clearInterval(this.game.emojiInterval);
      this.game.playing = false;
    }
  }

}

/* harmony default export */ __webpack_exports__["a"] = (Detector);


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// export const EmojiImages = {
//
//   falling: {
//     128518: "assets/emoji/laughing.png",
//     128515: "assets/emoji/smiley.png",
//     9786: "assets/emoji/relaxed.png",
//     128521: "assets/emoji/wink.png",
//     128535: "assets/emoji/kissing.png",
//     128539: "assets/emoji/stuckOutTongue.png",
//     128540: "assets/emoji/stuckOutTongueWinkingEye.png",
//     128561: "assets/emoji/scream.png",
//     128563: "assets/emoji/flushed.png",
//     128527: "assets/emoji/smirk.png",
//     128542: "assets/emoji/disappointed.png",
//     128545: "assets/emoji/rage.png",
//     128528: "assets/emoji/neutral.png",
//   },
//   ui: {
//     128128: "assets/emoji/skull.png",
//     128169: "assets/emoji/poo.png",
//     128077: "assets/emoji/thumbUp.png",
//     128078: "assets/emoji/thumbDown.png",
//     128081: "assets/emoji/crown.png",
//   }
// };
const EmojiImages = {

  falling: {
    128518: "assets/svg/happy-4.svg",
    128515: "assets/svg/happy-5.svg",
    9786: "assets/svg/happy-2.svg",
    128521: "assets/svg/wink.svg",
    128535: "assets/svg/kiss.svg",
    128539: "assets/svg/tongue.svg",
    128540: "assets/svg/wink.svg",
    128561: "assets/svg/surprised-2.svg",
    128563: "assets/svg/surprised-4.svg",
    128527: "assets/svg/cool.svg",
    128542: "assets/svg/sad.svg",
    128545: "assets/svg/angry.svg",
    128528: "assets/svg/confused.svg",
  },
  ui: {
    128128: "assets/svg/skull.svg",
    128169: "assets/svg/poo.svg",
    128077: "assets/svg/thumbUp.svg",
    128078: "assets/svg/thumbDown.svg",
    128081: "assets/svg/crown.svg",
  }
};
/* harmony export (immutable) */ __webpack_exports__["a"] = EmojiImages;



/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__detector__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__game__ = __webpack_require__(3);



document.addEventListener("DOMContentLoaded", function(){
  const gameRoot = document.getElementById("game-root");
  const game = new __WEBPACK_IMPORTED_MODULE_1__game__["a" /* default */](gameRoot);
  game.init();
});


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__detector__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__falling_emoji__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__announce__ = __webpack_require__(5);




class Game {
  constructor(gameRoot) {
    this.init = this.init.bind(this);
    this.detector = new __WEBPACK_IMPORTED_MODULE_0__detector__["a" /* default */]({
      gameRoot: gameRoot,
      game: this
    });
    this.ui_canvas = document.getElementById("ui_canvas");
    this.ui_ctx = ui_canvas.getContext('2d');
    this.displayScore = document.querySelectorAll(".score");
    this.startScreen = document.querySelector(".info-screen.start");
    this.endScreen = document.querySelector(".info-screen.end");
    this.strikes = 0;
    this.emojiInterval = null;

    this.velocity = 2;
    this.renderDelay = 3000;
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
    const toggleButton = document.querySelector("button");
    this.detector.init();

    toggleButton.addEventListener("click", () => {
      this.detector.toggleDetector();
      this.detector.noFaceDetected();
      this.startScreen.classList.toggle('hidden');
      this.playing = true;
      this.checkMatch();

    });
  }

  emojiStart() {
    this.displayScore.forEach((score) => {
      score.innerHTML = 'Score: 0';
    });
    this.start().then(() => {
      this.gameOver();
    });

    if (this.playing) {
      setTimeout(() => {
        this.renderEmoji();
        this.emojiInterval = setInterval(() => {
          this.renderEmoji();
        }, this.renderDelay);
      }, 2000);
    }
  }

  gameOver() {
    clearInterval(this.emojiInterval);

    setTimeout(() => {
      this.detector.toggleDetector();
      this.endScreen.classList.toggle('hidden');
    }, 500);
  }

  start() {

    return new Promise(resolve => {
      let startTime, runTime, timerWidth;
      this.lastTime = 0;
      // let timeTime, timeTimeTIMEtime, timeytime;
      let animate = (time) => {
        const timeDelta = time - this.lastTime;
        runTime = new Date().getTime() - startTime;
        runTime = runTime / (120 * 1000);
        timerWidth = 480 - (480 * runTime);
        this.ui_ctx.save();
        this.ui_ctx.clearRect(0, 0, 480, 640);
        this.animateEmoji(timeDelta);
        if (this.alerts.length > 0){
          this.animateAlerts(timeDelta);
        }
        this.draw(this.ui_ctx);
        this.lastTime = time;
        this.ui_ctx.fillStyle="#836d95";
        this.ui_ctx.fillRect(0, 620, timerWidth, 640);
        this.ui_ctx.restore();

        if (runTime < 1) {
          requestAnimationFrame(animate);
        } else {
          console.log('ended');
          return resolve('Game ended');
        }

      };
      startTime = new Date().getTime();
      animate(this.lastTime);

    });

  }


  renderEmoji() {
    let W = this.ui_canvas.width;
    let min = 50;
    let max = W - min;
    let posX = Math.random() * (max - min) + min;

    let emoji = new __WEBPACK_IMPORTED_MODULE_1__falling_emoji__["a" /* default */]({
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

    // this.displayScore.innerHTML = `Score: ${this.score}`;
    this.displayScore.forEach((score) => {
      score.innerHTML = `Score: ${this.score}`;
    });
  }

  increaseDifficulty() {

    this.velocity += 0.1;
    this.renderDelay -= 1000;
    this.multiplier += 1;
    console.log('difficulty increased');
    console.log(this.renderDelay);
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

    let alert = new __WEBPACK_IMPORTED_MODULE_2__announce__["a" /* default */]({
      game: this,
      ctx: this.ui_ctx,
      canvas: this.ui_canvas,
      pos: [posX, 200],
      time: options.time,
      score: options.score,
      strike: options.strike,
    });

    this.alerts.push(alert);
  }

}

/* harmony default export */ __webpack_exports__["a"] = (Game);


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__emoji__ = __webpack_require__(1);


class FallingEmoji {
  constructor(options) {
    this.ctx = options.ctx;
    this.canvas = options.canvas;
    this.pos = options.pos;
    this.vel = options.vel;
    this.game = options.game;
    this.emojiCode = null;
    this.emoji = null;
    this.emoji_images = __WEBPACK_IMPORTED_MODULE_0__emoji__["a" /* EmojiImages */].falling;

    this.timestamp = Date.now();
    this.generateEmoji(this.ctx);
  }

  generateEmoji(ctx) {
    let values = Object.keys(this.emoji_images);

    let available = values.filter((value) => {
      if (!(Object.keys(this.game.fallingEmoji).includes(value)) && (value !== '128528')) {
        return value;
      }
    });
    this.emojiCode = available[Math.floor(Math.random() * available.length)];
    this.emoji = new Image();
    this.emoji.src = this.emoji_images[this.emojiCode];
    this.draw(ctx);
  }

  draw(ctx) {
    ctx.drawImage(this.emoji, this.pos[0], this.pos[1], 100, 100);
  }

  move(timeDelta) {
    const velocityScale = timeDelta / NORMAL_FRAME_TIME_DELTA,
      offsetX = this.vel[0] * velocityScale,
      offsetY = this.vel[1] * velocityScale;

    this.pos = [this.pos[0] + offsetX, this.pos[1] + offsetY];
    if (this.pos[1] > 650) {
      this.remove();
      this.game.getStrike();
    }
  }

  remove() {
    this.game.removeEmoji(this.emojiCode);
  }

}

const NORMAL_FRAME_TIME_DELTA = 1000 / 60;

/* harmony default export */ __webpack_exports__["a"] = (FallingEmoji);


/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

class Announce {
  constructor(options){
    this.game = options.game;
    this.ctx = options.ctx;
    this.canvas = options.canvas;
    this.time = options.time;
    this.score = options.score;
    this.strike = options.strike;
    this.pos =  options.pos;
    this.vel = [0, 1];
    this.alert = null;
    this.generateAlert(options);
  }

  generateAlert(options){
    let a = arguments[0];
    if (a.strike) {
      this.alert = this.strikeAnimation;
    } else if (a.score) {
      this.alert = this.scoreAnimation;
    }
    let move = setTimeout(() => {
      this.game.removeAlert(this);
      clearTimeout(move);
    }, 600);
  }

  strikeAnimation(){
    let strike = this.strike;
    this.ctx.font = "bold 36px Josefin Sans";
    this.ctx.textAlign = "center";
    this.ctx.fillStyle = "red";
    this.ctx.strokeStyle = 'white';
    this.ctx.lineWidth = 2;
    this.ctx.fillText(`Strike ${strike} !!`, this.pos[0], this.pos[1]);
    this.ctx.strokeText(`Strike ${strike} !!`, this.pos[0], this.pos[1]);
    this.ctx.fill();
    this.ctx.stroke();
  }

  scoreAnimation(){
    let message;
    console.log(this.time);
    if (this.time < 2600) {
      this.messageAnimation('Perfect!');
    } else if (this.time >= 2600 && this.time < 2500) {
      this.messageAnimation('Good');
    }

    let score = this.score;
    this.ctx.font = "36px Josefin Sans";
    this.ctx.textAlign = "center";
    this.ctx.fillStyle = "green";
    this.ctx.fillText(`+ ${score} !!`, this.pos[0], this.pos[1]);
  }

  messageAnimation(message){
    let strike = this.strike;
    this.ctx.font = "36px Josefin Sans";
    this.ctx.textAlign = "center";
    this.ctx.fillStyle = "green";
    this.ctx.fillText(`${message}`, this.pos[0], this.pos[1] - 50);
  }


  animate(timeDelta) {
    const velocityScale = timeDelta / NORMAL_FRAME_TIME_DELTA,
        offsetY = this.vel[1] * velocityScale;
    this.pos = [this.pos[0], this.pos[1] - offsetY];

    this.alert();

  }

}

const NORMAL_FRAME_TIME_DELTA = 1000/60;

/* harmony default export */ __webpack_exports__["a"] = (Announce);


/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map