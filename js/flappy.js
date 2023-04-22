class GeneralDomElement {
  constructor({ HTMLTagType, HTMLElementClass }) {
    this.HTMLTagType = HTMLTagType;
    this.HTMLElementClass = HTMLElementClass;
  }

  build() {
    const element = document.createElement(this.HTMLTagType);
    element.className = this.HTMLElementClass;

    return element;
  };

  fetch() {
    const element = document.querySelector(
      `${this.HTMLElementClass}`,
    ) || document.querySelector(
      `${this.HTMLTagType}.${this.HTMLElementClass}`,
    );

    return element;
  }
}

const gameArea = new GeneralDomElement({
  HTMLElementClass: "[wm-flappy]",
  HTMLTagType: "div",
}).fetch();

class Barrier {
  constructor({ reversed = false }) {
    this.element = new GeneralDomElement({
      HTMLTagType: "div",
      HTMLElementClass: "barrier",
    }).build();

    this.barrierTop = new GeneralDomElement({
      HTMLTagType: "div",
      HTMLElementClass: "top",
    }).build();

    this.barrierBody = new GeneralDomElement({
      HTMLTagType: "div",
      HTMLElementClass: "body",
    }).build();

    this.#buildBarrier(reversed);
  }

  setHeight(height) {
    this.barrierBody.style.height = `${height}px`;
  }

  #buildBarrier(reversed) {
    this.element.appendChild(reversed ? this.barrierBody : this.barrierTop);

    this.element.appendChild(reversed ? this.barrierTop : this.barrierBody);
  }
}

class BarriersPair {
  constructor({ gapsize, xPosition }) {
    this.gapsize = gapsize;
    this.scored = false;

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

class Bird {
  constructor() {
    this.element = new GeneralDomElement({
      HTMLTagType: "img",
      HTMLElementClass: "bird",
    }).build();

    this.flying = false;

    this.element.src = "./imgs/passaro.png";

    this.yPosition = gameArea.clientHeight / 2;

    gameArea.appendChild(this.element);
  }

  get yPosition() {
    return parseInt(this.element.style.top.split("px")[0]);
  }

  set yPosition(y) {
    this.element.style.top = `${y}px`;
  }

  fly() {
    window.onkeydown = () => {
      this.flying = true;
    };
    window.onkeyup = () => {
      this.flying = false;
    };

    const newYPosition = this.yPosition + (this.flying ? -5 : 5);
    const minFlyHeight = gameArea.clientHeight - this.element.clientHeight;

    if (newYPosition < 0) {
      this.yPosition = 0;
    } else if (newYPosition > minFlyHeight) {
      this.yPosition = minFlyHeight;
    } else {
      this.yPosition = newYPosition;
    }
  }
}

class GameScore {
  constructor() {
    this.element = new GeneralDomElement({
      HTMLElementClass: "progress-status",
      HTMLTagType: "div",
    }).fetch();

    this.score = 0;
    this.#updateScoreOnScreen();
  }

  manageScore(barrierPair) {
    if (barrierPair.validForScoring) {
      this.score += 1;
      barrierPair.scored = true;
      this.#updateScoreOnScreen();
    }
  }

  #updateScoreOnScreen() {
    this.element.textContent = this.score;
  }
}

class Game {
  constructor() {
    this.distanceBetweenBarrierPairs = 400;
    this.rerenderInterval = 20;

    this.barriersPairs = [
      new BarriersPair({
        gapsize: 150,
        xPosition: document.body.clientWidth,
      }),
      new BarriersPair({
        gapsize: 150,
        xPosition: document.body.clientWidth + this.distanceBetweenBarrierPairs,
      }),
      new BarriersPair({
        gapsize: 150,
        xPosition:
          document.body.clientWidth + 2 * this.distanceBetweenBarrierPairs,
      }),
      new BarriersPair({
        gapsize: 150,
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
        this.gameScore.manageScore(barrierPair);
        barrierPair.moveHorizontally();
      });
    }, this.rerenderInterval);
  }

  stop() {
    clearInterval(this.interval);
  }
}

const game = new Game();

game.play();