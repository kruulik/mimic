import Detector from './detector';
import Game from './game';

document.addEventListener("DOMContentLoaded", function(){
  const gameRoot = document.getElementById("game-root");
  const game = new Game(gameRoot);
  const openModalButton = document.querySelector(".open-modal");
  openModalButton.addEventListener("click", openModal);
  game.init();

});

function openModal() {
  const demoModal = document.getElementById("demo-modal");
  const closeModalAction = document.querySelector(".modal-container");
  const demoVideo = document.querySelector(".demo-video");
  closeModalAction.addEventListener("click", closeModal);
  demoModal.classList.toggle('hidden');
  demoVideo.play();
  demoVideo.playbackRate = 2;
}

function closeModal() {
  const demoModal = document.getElementById("demo-modal");
  demoModal.classList.toggle('hidden');
}
