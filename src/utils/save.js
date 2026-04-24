export function generateMeme(imgElement) {
  const imageUrl = imgElement._imageUrl;
  const upperText = imgElement.upperText;
  const lowerText = imgElement.lowerText;

  if (!imageUrl) return;

  const canvas = document.createElement("canvas");
  const img = new Image();
  img.src = imageUrl;

  img.onload = () => {
    // --- crop to 1:1 center (same as object-fit: cover) ---
    const size = Math.min(img.width, img.height);
    const sx = (img.width - size) / 2;
    const sy = (img.height - size) / 2;

    canvas.width = size;
    canvas.height = size;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, sx, sy, size, size, 0, 0, size, size);
    // ------------------------------------------------------

    const drawText = (text, color, yFromBottom) => {
      const baseFontPx = size * 0.09;
      let fontSize = baseFontPx;
      ctx.font = `900 ${fontSize}px Impact, Arial Black, sans-serif`;

      while (ctx.measureText(text).width > size * 0.94 && fontSize > 8) {
        fontSize -= 1;
        ctx.font = `900 ${fontSize}px Impact, Arial Black, sans-serif`;
      }

      ctx.textAlign = "left";
      ctx.lineJoin = "round";
      ctx.lineWidth = fontSize * 0.2;
      ctx.strokeStyle = "#000";
      ctx.fillStyle = color;

      const x = size * 0.03;
      const y = size - yFromBottom;
      ctx.strokeText(text, x, y);
      ctx.fillText(text, x, y);
    };

    if (lowerText) drawText(lowerText, "#FFE600", size * 0.04);
    if (upperText) drawText(upperText, "#FF1F8E", size * 0.13);

    const a = document.createElement("a");
    a.download = "gapbo-vanilla.png";
    a.href = canvas.toDataURL("image/png");
    a.click();
  };
}
