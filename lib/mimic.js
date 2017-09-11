import Detector from './detector';
import Game from './game';

document.addEventListener("DOMContentLoaded", function(){
  const gameRoot = document.getElementById("game-root");
  // const detectorClass = new Detector(gameRoot);
  // detectorClass.init();
  const game = new Game(gameRoot);
  game.init();
});
