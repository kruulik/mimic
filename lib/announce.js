
class Announce {
  constructor(options){
    this.game = options.game;
    this.ctx = options.ctx;
    this.canvas = options.canvas;
    this.time = options.time;
    this.score = options.score;
    this.strike = options.strike;
    this.pos =  options.pos;
    this.vel = [0, 2];
    this.alert = null;
    this.generateAlert(options);
  }

  generateAlert(options){
    let a = arguments[0];
    if (a.strike) {
      this.alert = this.strikeAnimation;
    } else if (a.score) {
      this.alert = this.scoreAnimation;
    }
    let move = setTimeout(() => {
      this.game.removeAlert(this);
      clearTimeout(move);
    }, 600);
  }

  strikeAnimation(){
    let strike = this.strike;
    this.ctx.font = "36px Josefin Sans";
    this.ctx.textAlign = "center";
    this.ctx.fillStyle = "red";
    this.ctx.fillText(`Strike ${strike} !!`, this.pos[0], this.pos[1]);
  }

  scoreAnimation(){
    let message;
    if (this.time < 500) {
      this.messageAnimation('Perfect!');
    } else if (this.time >= 500 && this.time < 1000) {
      this.messageAnimation('Good');
    }

    let score = this.score;
    this.ctx.font = "36px Josefin Sans";
    this.ctx.textAlign = "center";
    this.ctx.fillStyle = "green";
    this.ctx.fillText(`+ ${score} !!`, this.pos[0], this.pos[1]);
  }

  messageAnimation(message){
    let strike = this.strike;
    this.ctx.font = "36px Josefin Sans";
    this.ctx.textAlign = "center";
    this.ctx.fillStyle = "green";
    this.ctx.fillText(`${message}`, this.pos[0], this.pos[1] - 50);
  }


  animate(timeDelta) {
    const velocityScale = timeDelta / NORMAL_FRAME_TIME_DELTA,
        offsetY = this.vel[1] * velocityScale;
    this.pos = [this.pos[0], this.pos[1] - offsetY];

    this.alert();

  }

}

const NORMAL_FRAME_TIME_DELTA = 1000/60;

export default Announce;
