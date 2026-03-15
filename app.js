const input = document.getElementById("image-input");
const blurRange = document.getElementById("blur-range");
const canvas = document.getElementById("display-canvas");
const ctx = canvas.getContext("2d", { willReadFrequently: true });
const swatchLayer = document.getElementById("swatch-layer");
const paletteList = document.getElementById("palette-list");
const emptyState = document.getElementById("empty-state");
const canvasWrap = document.getElementById("canvas-wrap");
const paletteMinus = document.getElementById("palette-minus");
const palettePlus = document.getElementById("palette-plus");
const paletteSizeLabel = document.getElementById("palette-size-label");

const PALETTE_MIN = 4;
const PALETTE_MAX = 8;
const SAMPLE_GRID = 72;

const state = {
  image: null,
  colors: [],
  swatches: [],
  dragId: null,
  animationFrame: null,
  sourceWidth: canvas.width,
  sourceHeight: canvas.height,
  paletteSize: 4,
  dpr: window.devicePixelRatio || 1,
};

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function rgbToHex(r, g, b) {
  return `#${[r, g, b].map((channel) => channel.toString(16).padStart(2, "0")).join("")}`.toUpperCase();
}

function luminance(r, g, b) {
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
}

function colorDistance(a, b) {
  return Math.abs(a.r - b.r) + Math.abs(a.g - b.g) + Math.abs(a.b - b.b);
}

function formatPercent(value) {
  return `${Math.round(value)}%`;
}

function updatePaletteLabel() {
  paletteSizeLabel.textContent = `Palette size ${state.paletteSize}`;
  paletteMinus.disabled = state.paletteSize <= PALETTE_MIN;
  palettePlus.disabled = state.paletteSize >= PALETTE_MAX;
}

function readImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = reject;
      image.src = reader.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function fitImage(image, maxWidth, maxHeight) {
  const ratio = Math.min(maxWidth / image.width, maxHeight / image.height);
  return {
    width: Math.max(1, Math.round(image.width * ratio)),
    height: Math.max(1, Math.round(image.height * ratio)),
  };
}

function extractPalette(image, paletteSize) {
  const sampleCanvas = document.createElement("canvas");
  const sampleCtx = sampleCanvas.getContext("2d", { willReadFrequently: true });
  const fitted = fitImage(image, SAMPLE_GRID, SAMPLE_GRID);
  sampleCanvas.width = fitted.width;
  sampleCanvas.height = fitted.height;
  sampleCtx.drawImage(image, 0, 0, fitted.width, fitted.height);

  const { data, width, height } = sampleCtx.getImageData(0, 0, fitted.width, fitted.height);
  const buckets = new Map();
  const samples = [];

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const index = (y * width + x) * 4;
      if (data[index + 3] < 180) {
        continue;
      }

      const r = data[index];
      const g = data[index + 1];
      const b = data[index + 2];
      const key = [
        Math.round(r / 24) * 24,
        Math.round(g / 24) * 24,
        Math.round(b / 24) * 24,
      ].join(",");
      const entry = buckets.get(key) || { count: 0, sumR: 0, sumG: 0, sumB: 0, positions: [] };
      entry.count += 1;
      entry.sumR += r;
      entry.sumG += g;
      entry.sumB += b;
      entry.positions.push({ x, y, r, g, b });
      buckets.set(key, entry);
      samples.push({ x, y, r, g, b });
    }
  }

  const total = samples.length || 1;
  return [...buckets.values()]
    .sort((a, b) => b.count - a.count)
    .slice(0, paletteSize)
    .map((entry, index) => {
      const avgR = Math.round(entry.sumR / entry.count);
      const avgG = Math.round(entry.sumG / entry.count);
      const avgB = Math.round(entry.sumB / entry.count);
      const representative = entry.positions.reduce((closest, point) => {
        const currentDistance = Math.abs(point.r - avgR) + Math.abs(point.g - avgG) + Math.abs(point.b - avgB);
        if (!closest || currentDistance < closest.distance) {
          return { point, distance: currentDistance };
        }
        return closest;
      }, null).point;

      return {
        id: `color-${index + 1}`,
        r: avgR,
        g: avgG,
        b: avgB,
        hex: rgbToHex(avgR, avgG, avgB),
        percent: (entry.count / total) * 100,
        x: representative.x / width,
        y: representative.y / height,
      };
    });
}

function recalculatePercentages() {
  if (!state.colors.length) {
    return;
  }

  const sampleCanvas = document.createElement("canvas");
  const sampleCtx = sampleCanvas.getContext("2d", { willReadFrequently: true });
  sampleCanvas.width = SAMPLE_GRID;
  sampleCanvas.height = SAMPLE_GRID;
  sampleCtx.drawImage(canvas, 0, 0, SAMPLE_GRID, SAMPLE_GRID);
  const { data } = sampleCtx.getImageData(0, 0, SAMPLE_GRID, SAMPLE_GRID);
  const counts = new Array(state.colors.length).fill(0);
  let total = 0;

  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] < 180) {
      continue;
    }

    const sample = { r: data[i], g: data[i + 1], b: data[i + 2] };
    let bestIndex = 0;
    let bestDistance = Number.POSITIVE_INFINITY;

    state.colors.forEach((color, index) => {
      const distance = colorDistance(sample, color);
      if (distance < bestDistance) {
        bestDistance = distance;
        bestIndex = index;
      }
    });

    counts[bestIndex] += 1;
    total += 1;
  }

  state.colors.forEach((color, index) => {
    color.percent = total ? (counts[index] / total) * 100 : 0;
  });
}

function drawProcessedImage() {
  if (!state.image) {
    return;
  }

  const wrapWidth = canvasWrap.clientWidth;
  const wrapHeight = Math.max(320, canvasWrap.clientHeight || canvasWrap.getBoundingClientRect().height);
  state.dpr = window.devicePixelRatio || 1;
  canvas.width = Math.round(wrapWidth * state.dpr);
  canvas.height = Math.round(wrapHeight * state.dpr);
  canvas.style.height = `${wrapHeight}px`;
  ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);

  const displayWidth = wrapWidth;
  const displayHeight = wrapHeight;
  state.sourceWidth = displayWidth;
  state.sourceHeight = displayHeight;

  const downscaleCanvas = document.createElement("canvas");
  const downscaleCtx = downscaleCanvas.getContext("2d");
  const blurValue = Number(blurRange.value);
  const reducedWidth = Math.max(14, Math.round(displayWidth / (blurValue * 0.62)));
  const reducedHeight = Math.max(20, Math.round(displayHeight / (blurValue * 0.62)));
  downscaleCanvas.width = reducedWidth;
  downscaleCanvas.height = reducedHeight;
  downscaleCtx.imageSmoothingEnabled = true;

  const imageRatio = state.image.width / state.image.height;
  const frameRatio = displayWidth / displayHeight;
  let drawWidth;
  let drawHeight;
  let offsetX = 0;
  let offsetY = 0;

  if (imageRatio > frameRatio) {
    drawHeight = reducedHeight;
    drawWidth = reducedHeight * imageRatio;
    offsetX = (reducedWidth - drawWidth) / 2;
  } else {
    drawWidth = reducedWidth;
    drawHeight = reducedWidth / imageRatio;
    offsetY = (reducedHeight - drawHeight) / 2;
  }

  downscaleCtx.drawImage(state.image, offsetX, offsetY, drawWidth, drawHeight);
  ctx.clearRect(0, 0, displayWidth, displayHeight);
  ctx.save();
  ctx.imageSmoothingEnabled = true;
  ctx.filter = `blur(${blurValue}px) saturate(118%) contrast(104%)`;
  ctx.drawImage(downscaleCanvas, 0, 0, displayWidth, displayHeight);
  ctx.restore();

  const imageData = ctx.getImageData(0, 0, displayWidth, displayHeight);
  for (let i = 0; i < imageData.data.length; i += 4) {
    const grain = (Math.random() - 0.5) * 18;
    imageData.data[i] = clamp(imageData.data[i] + grain, 0, 255);
    imageData.data[i + 1] = clamp(imageData.data[i + 1] + grain, 0, 255);
    imageData.data[i + 2] = clamp(imageData.data[i + 2] + grain, 0, 255);
  }
  ctx.putImageData(imageData, 0, 0);
}

function sampleCanvasColor(x, y) {
  const pixelX = clamp(Math.round(x * state.dpr), 0, canvas.width - 1);
  const pixelY = clamp(Math.round(y * state.dpr), 0, canvas.height - 1);
  const pixel = ctx.getImageData(pixelX, pixelY, 1, 1).data;
  return {
    r: pixel[0],
    g: pixel[1],
    b: pixel[2],
    hex: rgbToHex(pixel[0], pixel[1], pixel[2]),
  };
}

function getPaletteHeights() {
  const gap = 3;
  const availableHeight = paletteList.clientHeight;
  const totalPercent = state.colors.reduce((sum, color) => sum + color.percent, 0) || 1;
  const minHeight = 52;
  const totalGaps = Math.max(0, state.colors.length - 1) * gap;
  const usableHeight = Math.max(minHeight * state.colors.length, availableHeight - totalGaps);
  const scaled = state.colors.map((color) => Math.max(minHeight, (color.percent / totalPercent) * usableHeight));
  const heightSum = scaled.reduce((sum, value) => sum + value, 0);
  const scale = heightSum > 0 ? usableHeight / heightSum : 1;
  return scaled.map((value) => value * scale);
}

function renderPalette() {
  paletteList.innerHTML = "";
  const heights = getPaletteHeights();

  state.colors.forEach((color, index) => {
    const card = document.createElement("div");
    card.className = "palette-card";
    card.style.setProperty("--card-color", color.hex);
    card.style.background = `linear-gradient(135deg, ${color.hex}, color-mix(in srgb, ${color.hex} 44%, #17191c))`;
    card.style.height = `${heights[index] || 52}px`;

    const textColor = luminance(color.r, color.g, color.b) > 0.62 ? "#15171a" : "#f2efe8";
    card.style.color = textColor;
    card.innerHTML = `\n      <div class="palette-meta">\n        <div class="palette-line">\n          <strong class="palette-code">${color.hex}</strong>\n          <span class="percent-badge">${formatPercent(color.percent)}</span>\n        </div>\n      </div>\n    `;
    paletteList.appendChild(card);
  });
}

function syncSwatchTargetsFromColors() {
  state.swatches.forEach((swatch, index) => {
    const color = state.colors[index];
    swatch.color = color;
    swatch.targetX = color.x * state.sourceWidth;
    swatch.targetY = color.y * state.sourceHeight;
    swatch.element.style.setProperty("--swatch-color", color.hex);
    swatch.element.setAttribute("aria-label", `${color.hex} swatch`);
  });
}

function createSwatch(color) {
  const swatch = document.createElement("button");
  swatch.type = "button";
  swatch.className = "swatch";
  swatch.style.setProperty("--swatch-color", color.hex);
  swatch.style.left = "0px";
  swatch.style.top = "0px";
  swatch.setAttribute("aria-label", `${color.hex} swatch`);
  swatch.dataset.id = color.id;
  swatch.addEventListener("pointerdown", (event) => startDrag(event, color.id));
  swatchLayer.appendChild(swatch);

  return {
    id: color.id,
    color,
    element: swatch,
    x: color.x * state.sourceWidth,
    y: color.y * state.sourceHeight,
    targetX: color.x * state.sourceWidth,
    targetY: color.y * state.sourceHeight,
  };
}

function rebuildSwatches() {
  swatchLayer.innerHTML = "";
  state.swatches = state.colors.map((color) => createSwatch(color));
  startAnimation();
}

function updateSwatchPositions() {
  state.swatches.forEach((swatch) => {
    swatch.x += (swatch.targetX - swatch.x) * 0.18;
    swatch.y += (swatch.targetY - swatch.y) * 0.18;
    swatch.element.style.left = `${swatch.x}px`;
    swatch.element.style.top = `${swatch.y}px`;
  });
  state.animationFrame = requestAnimationFrame(updateSwatchPositions);
}

function startAnimation() {
  cancelAnimationFrame(state.animationFrame);
  state.animationFrame = requestAnimationFrame(updateSwatchPositions);
}

function getPointFromEvent(event) {
  const rect = canvasWrap.getBoundingClientRect();
  return {
    x: clamp(event.clientX - rect.left, 0, rect.width),
    y: clamp(event.clientY - rect.top, 0, rect.height),
  };
}

function updateSwatchColor(swatch) {
  const sampled = sampleCanvasColor(swatch.targetX, swatch.targetY);
  swatch.color.r = sampled.r;
  swatch.color.g = sampled.g;
  swatch.color.b = sampled.b;
  swatch.color.hex = sampled.hex;
  swatch.color.x = swatch.targetX / state.sourceWidth;
  swatch.color.y = swatch.targetY / state.sourceHeight;
  swatch.element.style.setProperty("--swatch-color", sampled.hex);
  swatch.element.setAttribute("aria-label", `${sampled.hex} swatch`);
  recalculatePercentages();
  renderPalette();
}

function startDrag(event, id) {
  state.dragId = id;
  const swatch = state.swatches.find((entry) => entry.id === id);
  if (!swatch) {
    return;
  }
  swatch.element.classList.add("active");
  swatch.element.setPointerCapture(event.pointerId);
  const point = getPointFromEvent(event);
  swatch.targetX = point.x;
  swatch.targetY = point.y;
  updateSwatchColor(swatch);
}

function handleDrag(event) {
  if (!state.dragId) {
    return;
  }
  const swatch = state.swatches.find((entry) => entry.id === state.dragId);
  if (!swatch) {
    return;
  }
  const point = getPointFromEvent(event);
  swatch.targetX = point.x;
  swatch.targetY = point.y;
  updateSwatchColor(swatch);
}

function endDrag() {
  if (!state.dragId) {
    return;
  }
  const swatch = state.swatches.find((entry) => entry.id === state.dragId);
  if (swatch) {
    swatch.element.classList.remove("active");
    updateSwatchColor(swatch);
  }
  state.dragId = null;
}

function initializePalette() {
  state.colors = extractPalette(state.image, state.paletteSize);
  drawProcessedImage();
  recalculatePercentages();
  renderPalette();
  rebuildSwatches();
  updatePaletteLabel();
}

function addPaletteColor() {
  if (!state.image || state.colors.length >= PALETTE_MAX) {
    return;
  }

  const candidates = extractPalette(state.image, PALETTE_MAX);
  const nextColor = candidates.find((candidate) => !state.colors.some((color) => colorDistance(color, candidate) < 24)) || candidates[state.colors.length];

  if (!nextColor) {
    return;
  }

  const newColor = {
    ...nextColor,
    id: `color-${state.colors.length + 1}`,
  };

  state.colors.push(newColor);
  state.paletteSize = state.colors.length;
  recalculatePercentages();
  renderPalette();
  rebuildSwatches();
  updatePaletteLabel();
}

function removePaletteColor() {
  if (!state.image || state.colors.length <= PALETTE_MIN) {
    return;
  }

  state.colors.pop();
  state.paletteSize = state.colors.length;
  recalculatePercentages();
  renderPalette();
  rebuildSwatches();
  updatePaletteLabel();
}

async function handleFile(file) {
  if (!file) {
    return;
  }

  state.image = await readImage(file);
  emptyState.classList.add("hidden");
  initializePalette();
}

input.addEventListener("change", async (event) => {
  const [file] = event.target.files || [];
  await handleFile(file);
});

blurRange.addEventListener("input", () => {
  if (!state.image) {
    return;
  }

  drawProcessedImage();
  syncSwatchTargetsFromColors();
  recalculatePercentages();
  renderPalette();
});

paletteMinus.addEventListener("click", removePaletteColor);
palettePlus.addEventListener("click", addPaletteColor);

canvasWrap.addEventListener("dragover", (event) => {
  event.preventDefault();
});

canvasWrap.addEventListener("drop", async (event) => {
  event.preventDefault();
  const [file] = event.dataTransfer.files || [];
  await handleFile(file);
});

window.addEventListener("pointermove", handleDrag);
window.addEventListener("pointerup", endDrag);
window.addEventListener("resize", () => {
  if (!state.image) {
    return;
  }

  drawProcessedImage();
  syncSwatchTargetsFromColors();
  recalculatePercentages();
  renderPalette();
});

updatePaletteLabel();





