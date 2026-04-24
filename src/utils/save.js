async function loadFont() {
  const font = new FontFace("Cordia UPC", "url('/CordiaUPC-Bold.ttf')", {
    weight: "700",
    style: "normal",
  });
  await font.load();
  document.fonts.add(font);
}

export async function generateMeme(imgElement) {
  const imageUrl = imgElement._imageUrl;
  const upperText = imgElement.upperText;
  const lowerText = imgElement.lowerText;

  if (!imageUrl) return;

  await loadFont();

  const canvas = document.createElement("canvas");
  const img = new Image();
  img.src = imageUrl;

  img.onload = () => {
    const size = Math.min(img.width, img.height);
    const sx = (img.width - size) / 2;
    const sy = (img.height - size) / 2;

    canvas.width = size;
    canvas.height = size;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, sx, sy, size, size, 0, 0, size, size);

    const padX = size * 0.03; // left padding
    const padBottom = size * 0.03; // bottom padding
    const lineGap = size * 0.01; // gap between upper and lower line

    const drawText = (text, color, y) => {
      let fontSize = size * 0.12; // start at 12% of size (matches reference)
      ctx.font = `700 ${fontSize}px "Cordia UPC", serif`;

      // shrink only when text actually exceeds 97% of canvas width
      while (ctx.measureText(text).width > size * 0.97 && fontSize > 8) {
        fontSize -= 1;
        ctx.font = `700 ${fontSize}px "Cordia UPC", serif`;
      }

      // heavy hard shadow instead of stroke
      const sh = Math.max(fontSize * 0.06, 3);
      ctx.shadowColor = "rgba(0,0,0,0.95)";
      ctx.shadowBlur = 2;
      ctx.shadowOffsetX = sh;
      ctx.shadowOffsetY = sh;

      ctx.textAlign = "left";
      ctx.fillStyle = color;
      ctx.fillText(text, padX, y);

      // reset shadow
      ctx.shadowColor = "transparent";
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      ctx.shadowBlur = 0;
    };

    // measure both lines to position them from the bottom up
    const getFontSize = (text) => {
      let fontSize = size * 0.12;
      ctx.font = `700 ${fontSize}px "Cordia UPC", serif`;
      while (ctx.measureText(text).width > size * 0.97 && fontSize > 8) {
        fontSize -= 1;
        ctx.font = `700 ${fontSize}px "Cordia UPC", serif`;
      }
      return fontSize;
    };

    const lowerFontSize = lowerText ? getFontSize(lowerText) : 0;
    const upperFontSize = upperText ? getFontSize(upperText) : 0;

    // y positions: lower line sits at bottom, upper line sits above it
    const lowerY = size - padBottom;
    const upperY = lowerY - lowerFontSize - lineGap;

    if (lowerText) drawText(lowerText, "#FFE600", lowerY);
    if (upperText) drawText(upperText, "#FF1F8E", upperY);

    const a = document.createElement("a");
    a.download = "gapbo-vanilla.png";
    a.href = canvas.toDataURL("image/png");
    a.click();
  };
}
