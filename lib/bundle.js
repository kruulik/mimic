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


document.addEventListener("DOMContentLoaded", function(){
  const gameRoot = document.getElementById("game-root");
  const detectorClass = new __WEBPACK_IMPORTED_MODULE_0__detector__["a" /* default */](gameRoot);
  detectorClass.init();
});


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

class Detector {

  constructor(gameRoot) {
    this.gameRoot = gameRoot;
    this.detector = new affdex.CameraDetector(gameRoot);
    this.detector.detectAllEmojis();
    this.init = this.init.bind(this);
    this.analyze = this.analyze.bind(this);
    this.toggleDetector = this.toggleDetector.bind(this);
  }


  init() {

    const toggleButton = document.getElementById("toggleButton");

    toggleButton.addEventListener("click", () => {
      this.toggleDetector();
    });

    this.detector.addEventListener("onInitializeSuccess", () => {
      document.getElementById("face_video_canvas").style.display = 'block';
      document.getElementById("face_video").style.display = 'none';
      console.log('should start');
      this.analyze();
    });

    this.detector.addEventListener("onInitializeFailure", () => {
      console.log('initialize failed');
    });
  }

  analyze(){
    this.detector.addEventListener("onImageResultsSuccess", (faces, image, timestamps) => {

    });
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


/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map