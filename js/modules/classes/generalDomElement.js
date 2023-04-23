class GeneralDomElement {
  constructor({ HTMLTagType, HTMLElementClass }) {
    this.HTMLTagType = HTMLTagType;
    this.HTMLElementClass = HTMLElementClass;
  }

  build() {
    const element = document.createElement(this.HTMLTagType);
    element.className = this.HTMLElementClass;

    return element;
  }

  fetch() {
    const element =
      document.querySelector(`${this.HTMLElementClass}`) ||
      document.querySelector(`${this.HTMLTagType}.${this.HTMLElementClass}`);

    return element;
  }
}

export default GeneralDomElement;
