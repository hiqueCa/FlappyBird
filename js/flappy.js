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

    this.setXPosition(xPosition);

    document.querySelector("[wm-flappy]").appendChild(this.element);

    this.topBarrier = new Barrier({ reversed: true });
    this.bottomBarrier = new Barrier({ reversed: false });

    this.randomizePairHeight();
    this.#buildBarriersPair();
  }

  setXPosition(x) {
    this.element.style.left = `${x}px`;
  }

  getXPosition() {
    return this.element.style.left.split("px")[0];
  }

  getWidth() {
    return this.element.clientWidth;
  }

  getHeight() {
    return this.element.clientHeight;
  }

  randomizePairHeight() {
    const randomHeightFactor = Math.random();

    const topBarrierHeight =
      randomHeightFactor * (this.getHeight() - this.gapsize);

    const bottomBarrierHeight =
      this.getHeight() - this.gapsize - topBarrierHeight;

    this.topBarrier.setHeight(topBarrierHeight);
    this.bottomBarrier.setHeight(bottomBarrierHeight);
  }

  #buildBarriersPair() {
    this.element.appendChild(this.topBarrier.element);
    this.element.appendChild(this.bottomBarrier.element);
  }
}

const xMovementFactor = 10;
const rerenderInterval = 20;
const barriersPair = new BarriersPair({
  gapsize: 150,
  xPosition: document.body.clientWidth,
});

setInterval(() => {
  const isOutOfScreen = barriersPair.getXPosition() < -barriersPair.getWidth();
  barriersPair.setXPosition(barriersPair.getXPosition() - xMovementFactor);
  console.log(isOutOfScreen);

  if (isOutOfScreen) {
    barriersPair.setXPosition(document.body.clientWidth);
    barriersPair.randomizePairHeight();
  }
}, rerenderInterval);
