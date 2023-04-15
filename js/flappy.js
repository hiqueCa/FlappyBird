class GeneralDomElement {
  constructor({ HTMLTagType, HTMLElementClass }) {
    const element = document.createElement(HTMLTagType);
    element.className = HTMLElementClass;

    return element;
  }
}

class Barrier {
  constructor({ reversed = false }) {
    this.element = new GeneralDomElement({
      HTMLTagType: "div",
      HTMLElementClass: "barrier",
    });

    this.barrierTop = new GeneralDomElement({
      HTMLTagType: "div",
      HTMLElementClass: "top",
    });

    this.barrierBody = new GeneralDomElement({
      HTMLTagType: "div",
      HTMLElementClass: "body",
    });

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

    this.element = new GeneralDomElement({
      HTMLTagType: "div",
      HTMLElementClass: "barriers-pair",
    });

    this.xPosition = xPosition;

    document.querySelector("[wm-flappy]").appendChild(this.element);

    this.topBarrier = new Barrier({ reversed: true });
    this.bottomBarrier = new Barrier({ reversed: false });

    this.randomizePairHeight();
    this.#buildBarriersPair();
  }

  static xMovementFactor = 10;

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
    } else {
      console.log(this.xPosition);
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
    });

    this.flying = false;

    this.element.src = "./imgs/passaro.png";

    this.yPosition = document.querySelector("[wm-flappy]").clientHeight / 2;

    document.querySelector("[wm-flappy]").appendChild(this.element);
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
    const minFlyHeight =
      document.querySelector("[wm-flappy]").clientHeight -
      this.element.clientHeight;

    if (newYPosition < 0) {
      this.yPosition = 0;
    } else if (newYPosition > minFlyHeight) {
      this.yPosition = minFlyHeight;
    } else {
      this.yPosition = newYPosition;
    }
  }
}

const distanceBetweenBarrierPairs = 400;
const rerenderInterval = 20;

const barriersPairs = [
  new BarriersPair({
    gapsize: 150,
    xPosition: document.body.clientWidth,
  }),
  new BarriersPair({
    gapsize: 150,
    xPosition: document.body.clientWidth + distanceBetweenBarrierPairs,
  }),
  new BarriersPair({
    gapsize: 150,
    xPosition: document.body.clientWidth + 2 * distanceBetweenBarrierPairs,
  }),
  new BarriersPair({
    gapsize: 150,
    xPosition: document.body.clientWidth + 3 * distanceBetweenBarrierPairs,
  }),
];

const bird = new Bird();

setInterval(() => {
  bird.fly();
  barriersPairs.forEach((barrierPair) => barrierPair.moveHorizontally());
}, rerenderInterval);
