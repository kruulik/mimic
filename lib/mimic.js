import Detector from './detector';

document.addEventListener("DOMContentLoaded", function(){
  const gameRoot = document.getElementById("game-root");
  const detectorClass = new Detector(gameRoot);
  detectorClass.init();
});
