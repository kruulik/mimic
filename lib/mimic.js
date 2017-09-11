import Detector from './detector';
import Game from './game';

document.addEventListener("DOMContentLoaded", function(){
  const gameRoot = document.getElementById("game-root");
  const game = new Game(gameRoot);
  game.init();
});
