import { gameArea } from "./elements/gameArea.js";
import GeneralDomElement from "./generalDomElement.js";

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

export default Bird;
