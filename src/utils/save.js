async function loadFont() {
  const font = new FontFace("Cordia UPC", "url('/CordiaUPC-Bold.ttf')", {
    weight: "700",
    style: "normal",
  });
  await font.load();
  document.fonts.add(font);
}

const OUTPUT_SIZE = 1080;

const PAD_X = OUTPUT_SIZE * 0.03; // 3cqw  -> 32.4px
const PAD_BOTTOM = OUTPUT_SIZE * 0.03; // 3cqw  -> 32.4px
const LINE_GAP = OUTPUT_SIZE * 0.01; // 1cqw  -> 10.8px
const BASE_FONT = OUTPUT_SIZE * 0.12; // 12cqw -> 129.6px  (starting / max size)
const MAX_WIDTH = OUTPUT_SIZE * 0.97; // 97cqw -> 1047.6px (text shrink)

function drawTextWithShadow(ctx, text, x, y, fontSize, color) {
  const pad = Math.ceil(fontSize * 0.5); // enough room so blur never clips

  const offscreen = document.createElement("canvas");
  offscreen.width = OUTPUT_SIZE + pad * 2;
  offscreen.height = fontSize + pad * 2;
  const off = offscreen.getContext("2d");
  off.font = `700 ${fontSize}px "Cordia UPC", serif`;
  off.fillStyle = color;
  off.textAlign = "left";
  off.textBaseline = "bottom";
  off.fillText(text, pad, pad + fontSize);

  const shadowStamp = document.createElement("canvas");
  shadowStamp.width = offscreen.width;
  shadowStamp.height = offscreen.height;
  const ss = shadowStamp.getContext("2d");
  ss.drawImage(offscreen, 0, 0);
  ss.globalCompositeOperation = "source-in";
  ss.fillStyle = "#000";
  ss.fillRect(0, 0, shadowStamp.width, shadowStamp.height);

  const dx = x - pad;
  const dy = y - fontSize - pad;

  const shadowLayers = [
    { blur: 8, alpha: 1.0 },
    { blur: 8, alpha: 1.0 },
    { blur: 8, alpha: 1.0 },
    { blur: 8, alpha: 1.0 },
    { blur: 16, alpha: 1.0 },
    { blur: 16, alpha: 1.0 },
    { blur: 16, alpha: 1.0 },
    { blur: 24, alpha: 0.95 },
    { blur: 32, alpha: 0.9 },
  ];

  ctx.save();

  for (const { blur, alpha } of shadowLayers) {
    ctx.globalAlpha = alpha;
    ctx.filter = `blur(${blur}px)`;
    ctx.drawImage(shadowStamp, dx, dy);
  }

  ctx.filter = "none";
  ctx.globalAlpha = 1;
  ctx.drawImage(offscreen, dx, dy);

  ctx.restore();
}

function getFontSize(ctx, text) {
  let fontSize = BASE_FONT;
  ctx.font = `700 ${fontSize}px "Cordia UPC", serif`;
  while (ctx.measureText(text).width > MAX_WIDTH && fontSize > 8) {
    fontSize -= 1;
    ctx.font = `700 ${fontSize}px "Cordia UPC", serif`;
  }
  return fontSize;
}

export async function generateMeme(imgElement) {
  const imageUrl = imgElement._imageUrl;
  const upperText = imgElement.upperText;
  const lowerText = imgElement.lowerText;

  if (!imageUrl) return;

  await loadFont();

  const img = new Image();
  img.src = imageUrl;

  img.onload = () => {
    const canvas = document.createElement("canvas");
    canvas.width = OUTPUT_SIZE;
    canvas.height = OUTPUT_SIZE;
    const ctx = canvas.getContext("2d");

    const srcSize = Math.min(img.width, img.height);
    const sx = (img.width - srcSize) / 2;
    const sy = (img.height - srcSize) / 2;
    ctx.drawImage(
      img,
      sx,
      sy,
      srcSize,
      srcSize,
      0,
      0,
      OUTPUT_SIZE,
      OUTPUT_SIZE,
    );

    const lowerFontSize = lowerText ? getFontSize(ctx, lowerText) : 0;
    const upperFontSize = upperText ? getFontSize(ctx, upperText) : 0;

    const lowerY = OUTPUT_SIZE - PAD_BOTTOM;
    const upperY = lowerText ? lowerY - lowerFontSize - LINE_GAP : lowerY;

    if (lowerText)
      drawTextWithShadow(
        ctx,
        lowerText,
        PAD_X,
        lowerY,
        lowerFontSize,
        "#FFE600",
      );
    if (upperText)
      drawTextWithShadow(
        ctx,
        upperText,
        PAD_X,
        upperY,
        upperFontSize,
        "#FF1F8E",
      );

    const a = document.createElement("a");
    a.download = "gapbo-vanilla.png";
    a.href = canvas.toDataURL("image/png");
    a.click();
  };
}
