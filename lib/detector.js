
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

export default Detector;
