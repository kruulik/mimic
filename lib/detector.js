import {EmojiImages} from './emoji';


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
    this.emoji_images = Object.assign({}, EmojiImages.ui, EmojiImages.falling);
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

export default Detector;
