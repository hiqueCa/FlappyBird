import GeneralDomElement from "./generalDomElement.js";
import Barrier from "./barrier.js";
import { gameArea } from "./elements/gameArea.js";

class BarriersPair {
  constructor({ gapsize, xPosition }) {
    this.gapsize = gapsize;
    this.scored = false;
    this.collided = false;

    this.element = new GeneralDomElement({
      HTMLTagType: "div",
      HTMLElementClass: "barriers-pair",
    }).build();

    this.xPosition = xPosition;

    gameArea.appendChild(this.element);

    this.topBarrier = new Barrier({ reversed: true });
    this.bottomBarrier = new Barrier({ reversed: false });

    this.randomizePairHeight();
    this.#buildBarriersPair();
  }

  static xMovementFactor = 10;

  get crossedMidScreen() {
    return this.xPosition <= gameArea.clientWidth / 2;
  }

  get validForScoring() {
    return this.crossedMidScreen && !this.scored;
  }

  get isOutOfScreen() {
    return this.xPosition < -this.width;
  }

  set xPosition(x) {
    this.element.style.left = `${x}px`;
  }

  get xPosition() {
    return this.element.style.left.split("px")[0];
  }

  get width() {
    return this.element.clientWidth;
  }

  get height() {
    return this.element.clientHeight;
  }

  randomizePairHeight() {
    const randomHeightFactor = Math.random();

    const topBarrierHeight = randomHeightFactor * (this.height - this.gapsize);

    const bottomBarrierHeight = this.height - this.gapsize - topBarrierHeight;

    this.topBarrier.setHeight(topBarrierHeight);
    this.bottomBarrier.setHeight(bottomBarrierHeight);
  }

  moveHorizontally() {
    if (this.isOutOfScreen) {
      this.xPosition = document.body.clientWidth;
      this.randomizePairHeight();
      this.scored = false;
    } else {
      this.xPosition = this.xPosition - BarriersPair.xMovementFactor;
    }
  }

  #buildBarriersPair() {
    this.element.appendChild(this.topBarrier.element);
    this.element.appendChild(this.bottomBarrier.element);
  }
}

export default BarriersPair;
