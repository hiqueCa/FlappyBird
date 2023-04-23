import GeneralDomElement from "./generalDomElement.js";

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

export default GameScore;
