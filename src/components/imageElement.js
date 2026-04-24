import { LitElement, css, html } from "lit";

/**
 * @slot - This element has a slot
 * @csspart button - The button
 */
export class ImageElement extends LitElement {
  static get properties() {
    return {
      image: { type: String },
      upperText: { type: String },
      lowerText: { type: String },
    };
  }

  constructor() {
    super();
    this.upperText = null;
    this.lowerText = null;
  }

  render() {
    return html`
      <div>
        <div>
          <h2>${this.upperText}</h2>
          <p>${this.lowerText}</p>
        </div>
      </div>
    `;
  }

  static get styles() {
    return css``;
  }
}

window.customElements.define("img-element", ImageElement);
