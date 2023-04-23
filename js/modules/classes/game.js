import Bird from "./bird.js";
import BarriersPair from "./barriersPair.js";
import GameScore from "./gameScore.js";

class Game {
  constructor() {
    this.distanceBetweenBarrierPairs = 400;
    this.rerenderInterval = 40;

    this.barriersPairs = [
      new BarriersPair({
        gapsize: 200,
        xPosition: document.body.clientWidth,
      }),
      new BarriersPair({
        gapsize: 200,
        xPosition: document.body.clientWidth + this.distanceBetweenBarrierPairs,
      }),
      new BarriersPair({
        gapsize: 200,
        xPosition:
          document.body.clientWidth + 2 * this.distanceBetweenBarrierPairs,
      }),
      new BarriersPair({
        gapsize: 200,
        xPosition:
          document.body.clientWidth + 3 * this.distanceBetweenBarrierPairs,
      }),
    ];

    this.bird = new Bird();
    this.gameScore = new GameScore();
  }

  play() {
    this.interval = setInterval(() => {
      this.bird.fly();
      this.barriersPairs.forEach((barrierPair) => {
        barrierPair.moveHorizontally();
        if (
          barrierPair.bottomBarrier.checkCollision({ bird: this.bird }) ||
          barrierPair.topBarrier.checkCollision({ bird: this.bird })
        ) {
          this.#stop();
        }
        this.gameScore.manageScore(barrierPair);
      });
    }, this.rerenderInterval);
  }

  #stop() {
    clearInterval(this.interval);
  }
}

export default Game;
