import { LitElement, css, html, unsafeCSS } from "lit";
import tailwind from "../style.css?inline";

const words = [
  "ตัด MV เพลง",
  "พรุ่งนี้น่าจะมา",
  "ไปออกกอง",
  "เดี๋ยวจะทำนะ",
  "วันนี้ปวดขา",
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
      .cursor {
        display: inline-block;
        width: 2px;
        background-color: currentColor;
        margin-left: 1px;
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
      <span class="font-arabica text-6xl"
        >"${this._displayText}<span class="cursor">&nbsp;</span>"</span
      >
    `;
  }
}

customElements.define("typing-animation", TypingAnimationElement);
