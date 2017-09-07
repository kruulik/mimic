document.addEventListener("DOMContentLoaded", () => {
  let gameRoot = document.getElementById("game-root");
  let toggleButton = document.getElementById("toggleButton");
  let detector = new affdex.CameraDetector(gameRoot);
  detector.detectAllEmotions();
  detector.detectAllExpressions();
  detector.detectAllEmojis();

  toggleButton.addEventListener("click", function(){
    if (detector && !detector.isRunning) {
      console.log('should turn on');
      detector.start();
    } else {
      console.log('should turn off');
      detector.stop();
    }
  });

  // function toggleDetector(){
  //   console.log('clicked');
  //     if (detector && !detector.paused) {
  //       detector.start();
  //     } else {
  //       detector.stop();
  //     }
  // }

  detector.addEventListener("onInitializeSuccess", function() {
    console.log('initialized');
  });
  detector.addEventListener("onInitializeFailure", function() {
    console.log('initialize failed');
  });


});



//
// startWebcam = function() {
//   navigator.mediaDevices.getUserMedia({
//       video: true,
//       audio: false
//     })
//     .then(function(stream) {
//       video.srcObject = stream;
//       videoToCanvas();
//     })
//     .catch(function(err) {
//       console.log("User rejected camera access");
//       webcamAccess = false;
//     });
// };
//
// videoToCanvas = function() {
//   video.addEventListener('play', function() {
//
//   });
// };
