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
  constructor({ gapsize }) {
    this.gapsize = gapsize;
    this.element = new GeneralDomElement({
      HTMLTagType: "div",
      HTMLElementClass: "barriers-pair",
    });
    document.querySelector("[wm-flappy]").appendChild(this.element);

    this.barriersPairHeight = this.element.clientHeight;

    this.topBarrier = new Barrier({ reversed: true });
    this.bottomBarrier = new Barrier({ reversed: false });

    this.#randomizePairHeight();
    this.#buildBarriersPair();
  }

  #randomizePairHeight() {
    const randomHeightFactor = Math.random();

    const topBarrierHeight =
      randomHeightFactor * (this.barriersPairHeight - this.gapsize);

    const bottomBarrierHeight =
      this.barriersPairHeight - this.gapsize - topBarrierHeight;

    this.topBarrier.setHeight(topBarrierHeight);
    this.bottomBarrier.setHeight(bottomBarrierHeight);
  }

  #buildBarriersPair() {
    this.element.appendChild(this.topBarrier.element);
    this.element.appendChild(this.bottomBarrier.element);
  }
}

new BarriersPair({
  gapsize: 150,
});
