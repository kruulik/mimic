import {
  EmojiImages
} from './emoji';


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
    this.emoji_images = Object.assign({}, EmojiImages.ui, EmojiImages.falling);

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
      if (this.detector.isRunning) {
        let loading = document.querySelector(".loading");
        loading.classList.toggle('hidden');
      }
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
      this.game.playing = true; 
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

export default Detector;
