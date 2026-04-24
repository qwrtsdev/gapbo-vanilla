import { LitElement, css, html, unsafeCSS } from "lit";
import tailwind from "../style.css?inline";

const words = [
  "เดี๋ยวจะทำนะ",
  "จะตัด MV เพลง",
  "พรุ่งนี้น่าจะมา",
  "ไปออกกอง",
  "ดูมีมแบบคว่ำๆ",
];

export class TypingAnimationElement extends LitElement {
  static properties = {
    _displayText: { state: true },
    _isDeleting: { state: true },
    _wordIndex: { state: true },
  };

  static styles = [
    unsafeCSS(tailwind),
    css`
      :host {
        display: block;
        width: 100%;
      }

      .wrap {
        width: 100%;
        display: flex;
        justify-content: center;
        overflow: hidden;
      }

      .typing {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        max-width: 100%;
        white-space: nowrap;
        line-height: 1.6;
        overflow: hidden;
        font-size: clamp(2.5rem, 10vw, 4rem);
      }

      .cursor {
        display: inline-block;
        width: 2px;
        height: 0.9em;
        background-color: currentColor;
        margin-left: 1px;
        flex-shrink: 0;
        animation: blink 0.7s step-end infinite;
      }

      @keyframes blink {
        0%,
        100% {
          opacity: 1;
        }
        50% {
          opacity: 0;
        }
      }
    `,
  ];

  constructor() {
    super();
    this._displayText = "";
    this._isDeleting = false;
    this._wordIndex = 0;
  }

  connectedCallback() {
    super.connectedCallback();
    this._tick();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    clearTimeout(this._timer);
  }

  _tick() {
    const currentWord = words[this._wordIndex];
    const isComplete = this._displayText === currentWord;
    const isEmpty = this._displayText === "";

    if (!this._isDeleting && isComplete) {
      this._timer = setTimeout(() => {
        this._isDeleting = true;
        this._tick();
      }, 1500);
      return;
    }

    if (this._isDeleting && isEmpty) {
      this._isDeleting = false;
      this._wordIndex = (this._wordIndex + 1) % words.length;
      this._timer = setTimeout(() => this._tick(), 400);
      return;
    }

    this._displayText = this._isDeleting
      ? currentWord.slice(0, this._displayText.length - 1)
      : currentWord.slice(0, this._displayText.length + 1);

    const speed = this._isDeleting ? 80 : 120;
    this._timer = setTimeout(() => this._tick(), speed);
  }

  render() {
    return html`
      <div class="wrap">
        <span class="typing font-arabica">
          "${this._displayText}<span class="cursor"></span>"
        </span>
      </div>
    `;
  }
}

customElements.define("typing-animation", TypingAnimationElement);
