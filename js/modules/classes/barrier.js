import GeneralDomElement from "./generalDomElement.js";

class Barrier {
  constructor({ reversed = false }) {
    this.collided = false;

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

  checkCollision({ bird }) {
    const horizontalSuperposition =
      bird.element.getBoundingClientRect().right >=
        this.element.getBoundingClientRect().left &&
      this.element.getBoundingClientRect().right >=
        bird.element.getBoundingClientRect().left;
    const verticalSuperposition =
      bird.element.getBoundingClientRect().bottom >=
        this.element.getBoundingClientRect().top &&
      this.element.getBoundingClientRect().bottom >=
        bird.element.getBoundingClientRect().top;

    if (!this.collided) {
      this.collided = horizontalSuperposition && verticalSuperposition;
    }

    return this.collided;
  }

  #buildBarrier(reversed) {
    this.element.appendChild(reversed ? this.barrierBody : this.barrierTop);

    this.element.appendChild(reversed ? this.barrierTop : this.barrierBody);
  }
}

export default Barrier;
