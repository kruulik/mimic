document.addEventListener("DOMContentLoaded", () => {
  let gameRoot = document.getElementById("game-root");
  let toggleButton = document.getElementById("toggleButton");
  let faceMode = affdex.FaceDetectorMode.SMALL_FACES;
  let height = 480;
  let width = 640;
  let detector = new affdex.CameraDetector(gameRoot);
  let canvas, ctx;
  let toMatch = null;
  let generateInterval = 0;
  let frames_since_face = 0;
  let face_visible = false;
  let generateEmoji;
  let delay = 1000;
  let score = 0;

  const emoji_images = {
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
  };

  detector.detectAllEmojis();

  toggleButton.addEventListener("click", function() {
    if (!detector.isRunning) {
      detector.start();
    } else {
      detector.removeEventListener();
      detector.stop();
    }
  });

  detector.addEventListener("onInitializeSuccess", function() {
    document.getElementById("face_video_canvas").style.display = 'block';
    document.getElementById("face_video").style.display = 'none';
    startGame();
  });
  detector.addEventListener("onInitializeFailure", function() {
    console.log('initialize failed');
  });
  detector.addEventListener("onStopSuccess", function() {
    pauseGame();
  });

  detector.addEventListener("onImageResultsSuccess", function(faces, image, timestamps) {
    let eCharCode, printResult = [];
    const results = document.getElementById("results");

    if (frames_since_face > 100 && face_visible){
      face_visible = false;
      console.log('no face detected');
    }
    if (faces.length > 0) {
      frames_since_face = 0;
      face_visible = true;
      // eCharCode = faces[0].emojis.dominantEmoji.codePointAt(0);

      eCharcode = 128539;

      // if (printResult[0] !== faces[0].emojis.dominantEmoji){
      //   printResult.unshift(faces[0].emojis.dominantEmoji);
      //   results.innerHTML = printResult;
      // }
      if (eCharCode === toMatch) {
        console.log('matched!');
        emoji = emoji_images[eCharCode];
        drawMask(image, faces[0].featurePoints, emoji);
      } else {
        drawFeaturePoints(image, faces[0].featurePoints);
      }
    } else {
      frames_since_face++;
    }
  });

  function drawMask(img, featurePoints, emoji){
    let ctx = document.getElementById("face_video_canvas").getContext('2d');
    let hRatio = ctx.canvas.width / img.width;
    let wRatio = ctx.canvas.height / img.height;
    let ratio = Math.min(hRatio, wRatio);
    let maskSize = getMaskSize(featurePoints);
    let faceCenter = getFaceCenter(featurePoints);

    let mask = new Image();
    mask.src = emoji;
    ctx.drawImage(mask, faceCenter[0]* 0.75, faceCenter[1]/2, maskSize * 2, maskSize * 2);

  }

  function drawFeaturePoints(img, featurePoints) {
    let ctx = document.getElementById("face_video_canvas").getContext('2d');
    let hRatio = ctx.canvas.width / img.width;
    let wRatio = ctx.canvas.height / img.height;
    let ratio = Math.min(hRatio, wRatio);
    let maskPos = getFaceCenter(featurePoints);
    let maskSize = getMaskSize(featurePoints);

    ctx.strokeStyle = "#FFFFFF";
    ctx.beginPath();
    ctx.arc(maskPos[0], maskPos[1], (maskSize * 0.8), 0, 2 * Math.PI
    );
    ctx.stroke();
  }

  function getMaskSize(fP){
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


  function startGame(){
    generateEmoji = setInterval(randomEmoji, delay);
  }

  function pauseGame(){
    clearInterval(generateEmoji);
  }

  function getFaceCenter(fP){
    let cx = [fP[11].x,  fP[17].x, fP[18].x];
    let cy = [fP[11].y,  fP[17].y, fP[18].y];

    let cxAVG = cx.reduce( ( acc, num ) => acc + num) / cx.length;
    let cyAVG = cy.reduce( ( acc, num ) => acc + num) / cy.length;
    return [cxAVG, cyAVG];
  }

  function randomEmoji(){
    let values = Object.keys(emoji_images);
    let result = values[Math.floor (Math.random() * values.length)];
    toMatch = result;
    // renderEmoji(result);
    console.log(result);
  }


  function renderFaceMask(){
    var canvas = document.getElementById('face_video_canvas');
    var context = canvas.getContext('2d');
    var X = myCanvas.width * 0.5;
    var Y = myCanvas.height * 0.5;

    context.fillStyle="rgba(0,0,0,.7)";
    context.fillRect(0, 0, 480, 600);
    context.save();
    context.strokeStyle = 'gray';
    context.beginPath();
    context.moveTo(X - 100, Y - 100);
    context.bezierCurveTo(X-100, Y-220, X+100, Y-220, X+100, Y-100);
    context.bezierCurveTo(X+100, Y+130, X-100, Y+130, X-100, Y-100);
    context.lineWidth = 5;
    context.clip();
    context.clearRect(0, 0, 480, 640);
    context.restore();
  }



});
