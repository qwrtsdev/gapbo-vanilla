import { LitElement, html, unsafeCSS } from "lit";
import tailwind from "../style.css?inline";
import { generateMeme } from "../utils/save.js";

const ALLOWED_FILES = ["image/jpeg", "image/png", "image/webp"];

export class ImageElement extends LitElement {
  static get properties() {
    return {
      upperText: { type: String },
      lowerText: { type: String },
      _imageUrl: { state: true },
      _isDragging: { state: true },
      _upperSize: { state: true },
      _lowerSize: { state: true },
    };
  }

  static get styles() {
    return [
      unsafeCSS(tailwind),
      unsafeCSS(`
        :host { display: block; width: 100%; }

        .meme-text {
          font-family: 'Impact', 'Arial Black', sans-serif;
          font-weight: 900;
          line-height: 1.15;
          white-space: nowrap;
          display: block;
          text-shadow:
            -3px -3px 0 #000,  3px -3px 0 #000,
            -3px  3px 0 #000,  3px  3px 0 #000,
            -5px  0   0 #000,  5px  0   0 #000,
             0   -5px 0 #000,  0    5px 0 #000;
        }
      `),
    ];
  }

  constructor() {
    super();
    this.upperText = null;
    this.lowerText = null;
    this._imageUrl = null;
    this._isDragging = false;
    this._upperSize = 9;
    this._lowerSize = 9;
    this._measureCanvas = document.createElement("canvas");
  }

  _calcFitSize(text, maxCqw = 94, baseCqw = 9) {
    if (!text) return baseCqw;
    const ctx = this._measureCanvas.getContext("2d");

    const zone = this.shadowRoot?.querySelector(".drop-zone");
    const containerPx = zone ? zone.getBoundingClientRect().width : 400;

    const maxPx = containerPx * (maxCqw / 100);
    let sizePx = containerPx * (baseCqw / 100);

    ctx.font = `900 ${sizePx}px Impact, Arial Black, sans-serif`;
    const textPx = ctx.measureText(text).width;

    if (textPx <= maxPx) return baseCqw;

    const ratio = maxPx / textPx;
    return Math.max(baseCqw * ratio, 2);
  }

  updated(changed) {
    if (changed.has("upperText") || changed.has("_imageUrl")) {
      this._upperSize = this._calcFitSize(this.upperText);
    }
    if (changed.has("lowerText") || changed.has("_imageUrl")) {
      this._lowerSize = this._calcFitSize(this.lowerText);
    }
  }

  _onDragOver(e) {
    e.preventDefault();
    this._isDragging = true;
  }
  _onDragLeave() {
    this._isDragging = false;
  }

  _onDrop(e) {
    e.preventDefault();
    this._isDragging = false;
    const file = e.dataTransfer.files[0];
    if (file && ALLOWED_FILES.includes(file.type)) this._loadFile(file);
  }

  _onFileChange(e) {
    const file = e.target.files[0];
    if (file && ALLOWED_FILES.includes(file.type)) this._loadFile(file);
  }

  _loadFile(file) {
    const reader = new FileReader();
    reader.onload = (e) => (this._imageUrl = e.target.result);
    reader.readAsDataURL(file);
  }

  _onClick(e) {
    e.stopPropagation();
    this.shadowRoot.querySelector("#file-input").click();
  }

  generateMeme() {
    generateMeme(this);
  }

  render() {
    const zoneClass = [
      "drop-zone relative w-full rounded-xl overflow-hidden cursor-pointer",
      "border-2 border-dashed border-gray-300 bg-gray-50",
      "flex items-center justify-center",
      "transition-colors duration-200",
      this._imageUrl
        ? "border-solid border-gray-200"
        : "hover:border-gray-400 hover:bg-gray-100",
      this._isDragging ? "!border-[#F794BF] !bg-pink-50" : "",
    ].join(" ");

    return html`
      <input
        id="file-input"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        class="hidden"
        @change=${this._onFileChange}
      />

      <div
        class=${zoneClass}
        style="aspect-ratio:1/1; container-type:size"
        @dragover=${this._onDragOver}
        @dragleave=${this._onDragLeave}
        @drop=${this._onDrop}
        @click=${this._onClick}
      >
        ${this._imageUrl
          ? html`
              <img
                src=${this._imageUrl}
                alt="uploaded"
                class="absolute inset-0 w-full h-full object-cover block"
              />

              <!-- hover hint -->
              <div
                class="absolute inset-0 flex items-center justify-center
                    bg-black/0 hover:bg-black/30 transition-colors duration-200 pointer-events-none"
              >
                <span
                  class="text-white text-sm font-line opacity-0 group-hover:opacity-100
                       bg-black/50 px-3 py-1 rounded-full"
                >
                  คลิกเพื่อเปลี่ยนรูป
                </span>
              </div>

              <div
                class="absolute inset-0 flex flex-col justify-end items-start pointer-events-none"
                style="padding: 3cqw; gap: 0.5cqw"
              >
                ${this.upperText
                  ? html`
                      <span
                        class="meme-text"
                        style="color:#FF1F8E; font-size:${this._upperSize}cqw"
                      >
                        ${this.upperText}
                      </span>
                    `
                  : ""}
                ${this.lowerText
                  ? html`
                      <span
                        class="meme-text"
                        style="color:#FFE600; font-size:${this._lowerSize}cqw"
                      >
                        ${this.lowerText}
                      </span>
                    `
                  : ""}
              </div>
            `
          : html`
              <div
                class="flex flex-col items-center justify-center gap-2 text-gray-400 select-none text-center px-4 w-full h-full pointer-events-none"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
                <p class="m-0 text-lg text-gray-500 font-line">
                  วางรูปของคุณที่นี่
                </p>
                <span class="text-xs text-gray-300 font-line"
                  >หรือคลิกเพื่อเลือกไฟล์</span
                >
              </div>
            `}
      </div>
    `;
  }
}

window.customElements.define("img-element", ImageElement);
