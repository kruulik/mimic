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
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__detector__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__game__ = __webpack_require__(3);



document.addEventListener("DOMContentLoaded", function(){
  const gameRoot = document.getElementById("game-root");
  // const detectorClass = new Detector(gameRoot);
  // detectorClass.init();
  const game = new __WEBPACK_IMPORTED_MODULE_1__game__["a" /* default */](gameRoot);
  game.init();
});


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__emoji__ = __webpack_require__(4);



class Detector {

  constructor(gameRoot) {
    this.gameRoot = gameRoot;
    this.dt_canvas = null;
    this.dt_ctx = null;
    this.detector = new affdex.CameraDetector(gameRoot);
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
    this.frames_since_face = 0;
    this.face_visible = false;
    this.face = null;
    this.image = null;
    this.emoji_images = Object.assign({}, __WEBPACK_IMPORTED_MODULE_0__emoji__["a" /* EmojiImages */].ui, __WEBPACK_IMPORTED_MODULE_0__emoji__["a" /* EmojiImages */].falling);
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


  analyze(){
    this.detector.addEventListener("onImageResultsSuccess", (faces, image, timestamps) => {

      this.image = image;

      if (this.frames_since_face > 100 && this.face_visible){
        this.face_visible = false;
        // TODO also pause the game and prompt user to recenter face
        console.log('no face detected');
      }
      if (faces.length > 0) {
        this.frames_since_face = 0;
        this.face_visible = true;
        this.face = faces[0];

        this.dominantEmoji = this.face.emojis.dominantEmoji.codePointAt(0);

      } else {
        this.frames_since_face++;
      }
    });

  }

  drawFeaturePoints() {
    if (this.face !== null) {
      let img = this.image;
      let featurePoints = this.face.featurePoints;
      let hRatio = this.dt_ctx.canvas.width / img.width;
      let wRatio = this.dt_ctx.canvas.height / img.height;
      let ratio = Math.min(hRatio, wRatio);

      let maskPos = this.getFaceCenter(featurePoints);
      let maskSize = this.getMaskSize(featurePoints);

      this.dt_ctx.strokeStyle = "#FFFFFF";
      this.dt_ctx.beginPath();
      this.dt_ctx.arc(maskPos[0], maskPos[1], (maskSize), 0, 2 * Math.PI
      );
      this.dt_ctx.stroke();
    }
  }

  drawMask(){
    let img = this.image;
    let featurePoints = this.face.featurePoints;
    let hRatio = this.dt_ctx.canvas.width / img.width;
    let wRatio = this.dt_ctx.canvas.height / img.height;
    let ratio = Math.min(hRatio, wRatio);

    let maskSize = this.getMaskSize(featurePoints);
    let faceCenter = this.getFaceCenter(featurePoints);

    this.dt_ctx.drawImage(this.mask, faceCenter[0] - (maskSize), faceCenter[1]/2, maskSize * 2.5, maskSize * 2.5);
  }

  getMaskSize(fP){
    let rx, ry, lx, ly, rxAVG, ryAVG, lxAVG, lyAVG;

    rx = [fP[17].x, fP[16].x];
    lx = [fP[18].x, fP[19].x];
    ry = [fP[17].y, fP[16].y];
    ly = [fP[18].y, fP[19].y];

    rxAVG = rx.reduce( ( acc, num ) => acc + num, 0) / 2;
    ryAVG = ry.reduce( ( acc, num ) => acc + num, 0) / 2;
    lxAVG = lx.reduce( ( acc, num ) => acc + num, 0) / 2;
    lyAVG = ly.reduce( ( acc, num ) => acc + num, 0) / 2;
    return Math.hypot(
      (rxAVG - lxAVG),
      (ryAVG - lyAVG)
    );
  }

  getFaceCenter(fP){
    let cx = [fP[11].x,  fP[17].x, fP[18].x];
    let cy = [fP[11].y,  fP[17].y, fP[18].y];

    let cxAVG = cx.reduce( ( acc, num ) => acc + num) / cx.length;
    let cyAVG = cy.reduce( ( acc, num ) => acc + num) / cy.length;
    return [cxAVG, cyAVG];
  }


  toggleDetector() {
    if (!this.detector.isRunning) {
      this.detector.start();
    } else {
      this.detector.removeEventListener();
      this.detector.stop();
    }
  }

}

/* harmony default export */ __webpack_exports__["a"] = (Detector);


/***/ }),
/* 2 */,
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__detector__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__falling_emoji__ = __webpack_require__(5);



class Game {
  constructor(gameRoot) {
    this.init = this.init.bind(this);
    this.detector = new __WEBPACK_IMPORTED_MODULE_0__detector__["a" /* default */](gameRoot);

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

    let emoji = new __WEBPACK_IMPORTED_MODULE_1__falling_emoji__["a" /* default */]({
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

/* harmony default export */ __webpack_exports__["a"] = (Game);


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

const EmojiImages = {

  falling: {
    128540: "assets/emoji/laughing.png",
    128515: "assets/emoji/smiley.png",
    9786: "assets/emoji/relaxed.png",
    128521: "assets/emoji/wink.png",
    128535: "assets/emoji/kissing.png",
    128539: "assets/emoji/stuckOutTongue.png",
    128541: "assets/emoji/stuckOutTongueWinkingEye.png",
    128561: "assets/emoji/scream.png",
    128563: "assets/emoji/flushed.png",
    128527: "assets/emoji/smirk.png",
    128542: "assets/emoji/disappointed.png",
    128545: "assets/emoji/rage.png",
    128528: "assets/emoji/neutral.png",
  },
  ui: {
    128128: "assets/emoji/skull.png",
    128169: "assets/emoji/poo.png",
    128077: "assets/emoji/thumbUp.png",
    128078: "assets/emoji/thumbDown.png",
    128081: "assets/emoji/crown.png",
  }
};
/* harmony export (immutable) */ __webpack_exports__["a"] = EmojiImages;



/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__emoji__ = __webpack_require__(4);


class FallingEmoji {
  constructor(options) {
    this.ctx = options.ctx;
    this.pos = options.pos;
    this.vel = options.vel;
    this.game = options.game;
    this.emojiCode = null;
    this.emoji = null;
    this.emoji_images = __WEBPACK_IMPORTED_MODULE_0__emoji__["a" /* EmojiImages */].falling;

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

/* harmony default export */ __webpack_exports__["a"] = (FallingEmoji);


/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map