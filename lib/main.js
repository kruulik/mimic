document.addEventListener("DOMContentLoaded", () => {
  let gameRoot = document.getElementById("game-root");
  let toggleButton = document.getElementById("toggleButton");
  let detector = new affdex.CameraDetector(gameRoot);
  detector.detectAllEmotions();
  detector.detectAllExpressions();
  detector.detectAllEmojis();

  toggleButton.addEventListener("click", function(){
    if (!detector.isRunning) {
      console.log('should turn on');
      detector.start();
    } else {
      console.log('should turn off');
      detector.stop();
    }
  });

  detector.addEventListener("onInitializeSuccess", function() {
    console.log('initialized');
    debugger
    document.getElementById("face_video_canvas").style.display = 'block';
    document.getElementById("face_video").style.display = 'none';
  });
  detector.addEventListener("onInitializeFailure", function() {
    console.log('initialize failed');
  });


});
