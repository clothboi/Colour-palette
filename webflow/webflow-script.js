(() => {
function getPaletteMarkup() {
  return `
  <main class="app-shell">
    <section class="workspace">
      <div class="canvas-stage">
        <div class="control-hud" aria-label="Color study controls">
          <div class="hud-bar">
            <p class="eyebrow">Colour Palette</p>
            <span class="hud-count">Studio blur map</span>
          </div>
          <div class="hud-rule" aria-hidden="true"></div>
          <div class="hud-actions">
            <div class="hud-buttons">
              <button class="recipe-button" type="button" data-action="recipe">Paint Recipe</button>
              <button class="recipe-button" type="button" data-action="export-image">Save Image</button>
            </div>
            <label class="hud-slider">
              <span>Blur</span>
              <input data-role="blur-range" type="range" min="0" max="40" value="40">
            </label>
          </div>
        </div>

        <section data-role="import-warning" class="import-warning hidden" aria-live="polite"></section>

        <div class="canvas-wrap" data-role="canvas-wrap">
          <canvas data-role="display-canvas" width="900" height="1350"></canvas>
          <div data-role="swatch-layer" class="swatch-layer" aria-label="Color swatches"></div>
          <div data-role="empty-state" class="empty-state">
            <label class="empty-state-card empty-state-upload">
              <span class="empty-state-primary">Choose image</span>
              <p>or drag image in</p>
              <input data-role="image-input" type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/bmp,image/heic,image/heif">
            </label>
          </div>
        </div>
      </div>

      <aside class="palette-panel">
        <div class="palette-toolbar">
          <span class="palette-rail-label">Palette Rail</span>
          <div class="palette-toolbar-controls">
            <button class="palette-button" type="button" data-action="palette-minus" aria-label="Decrease palette size">-</button>
            <span data-role="palette-size-label" class="palette-size-label">Palette: 4</span>
            <button class="palette-button" type="button" data-action="palette-plus" aria-label="Increase palette size">+</button>
          </div>
        </div>
        <div data-role="palette-list" class="palette-list"></div>
      </aside>
    </section>
  </main>

  <div data-role="recipe-modal" class="recipe-modal hidden" aria-hidden="true">
    <div class="recipe-modal-panel" role="dialog" aria-modal="true" aria-label="Paint recipes">
      <div class="recipe-modal-head">
        <div>
          <p class="recipe-modal-kicker">Colour mix study</p>
          <h2>Paint recipes</h2>
        </div>
        <button class="recipe-close" type="button" data-action="recipe-close" aria-label="Close paint recipes">x</button>
      </div>
      <div data-role="recipe-content"></div>
    </div>
    <button class="recipe-export" type="button" data-action="recipe-export">Save recipe</button>
  </div>`;
}

function ensurePaletteMarkup(root) {
  if (root.querySelector('[data-role="display-canvas"]')) {
    return;
  }
  root.innerHTML = getPaletteMarkup();
}

function initPalette(root) {
if (!root || root.dataset.webflowPaletteReady === "true") {
  return;
}
ensurePaletteMarkup(root);
root.dataset.webflowPaletteReady = "true";
const input = root.querySelector('[data-role="image-input"]');
const blurRange = root.querySelector('[data-role="blur-range"]');
const importWarning = root.querySelector('[data-role="import-warning"]');
const canvas = root.querySelector('[data-role="display-canvas"]');
if (!input || !blurRange || !importWarning || !canvas) {
  return;
}
const ctx = canvas.getContext("2d", { willReadFrequently: true });
const swatchLayer = root.querySelector('[data-role="swatch-layer"]');
const paletteList = root.querySelector('[data-role="palette-list"]');
const emptyState = root.querySelector('[data-role="empty-state"]');
const canvasWrap = root.querySelector('[data-role="canvas-wrap"]');
const paletteMinus = root.querySelector('[data-action="palette-minus"]');
const palettePlus = root.querySelector('[data-action="palette-plus"]');
const paletteSizeLabel = root.querySelector('[data-role="palette-size-label"]');
const recipeButton = root.querySelector('[data-action="recipe"]');
const imageExportButton = root.querySelector('[data-action="export-image"]');
const recipeModal = root.querySelector('[data-role="recipe-modal"]');
const recipeContent = root.querySelector('[data-role="recipe-content"]');
const recipeClose = root.querySelector('[data-action="recipe-close"]');
const recipeExport = root.querySelector('[data-action="recipe-export"]');
if (!ctx || !swatchLayer || !paletteList || !emptyState || !canvasWrap || !paletteMinus || !palettePlus || !paletteSizeLabel || !recipeButton || !imageExportButton || !recipeModal || !recipeContent || !recipeClose || !recipeExport) {
  return;
}

const PALETTE_MIN = 4;
const PALETTE_MAX = 8;
const SAMPLE_GRID = 72;

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function rgbToHex(r, g, b) {
  return `#${[r, g, b].map((channel) => channel.toString(16).padStart(2, "0")).join("")}`.toUpperCase();
}

function hexToRgb(hex) {
  const value = hex.replace("#", "");
  return { r: parseInt(value.slice(0, 2), 16), g: parseInt(value.slice(2, 4), 16), b: parseInt(value.slice(4, 6), 16) };
}

function luminance(r, g, b) {
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
}

function colorDistance(a, b) {
  return Math.abs(a.r - b.r) + Math.abs(a.g - b.g) + Math.abs(a.b - b.b);
}

function srgbToLinear(channel) {
  const value = channel / 255;
  return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
}

function linearToSrgb(channel) {
  const value = channel <= 0.0031308 ? channel * 12.92 : 1.055 * (channel ** (1 / 2.4)) - 0.055;
  return clamp(Math.round(value * 255), 0, 255);
}

function rgbToLab(rgb) {
  const r = srgbToLinear(rgb.r);
  const g = srgbToLinear(rgb.g);
  const b = srgbToLinear(rgb.b);
  const x = (r * 0.4124564 + g * 0.3575761 + b * 0.1804375) / 0.95047;
  const y = (r * 0.2126729 + g * 0.7151522 + b * 0.072175) / 1.0;
  const z = (r * 0.0193339 + g * 0.119192 + b * 0.9503041) / 1.08883;
  const fx = x > 0.008856 ? Math.cbrt(x) : (7.787 * x) + 16 / 116;
  const fy = y > 0.008856 ? Math.cbrt(y) : (7.787 * y) + 16 / 116;
  const fz = z > 0.008856 ? Math.cbrt(z) : (7.787 * z) + 16 / 116;
  return { l: (116 * fy) - 16, a: 500 * (fx - fy), b: 200 * (fy - fz) };
}

function deltaE(labA, labB) {
  return Math.sqrt(((labA.l - labB.l) ** 2) + ((labA.a - labB.a) ** 2) + ((labA.b - labB.b) ** 2));
}
const PIGMENTS = [
  { name: "Titanium White", hex: "#F7F7F2" },
  { name: "Ivory Black", hex: "#1F1E1B" },
  { name: "Hansa Yellow", hex: "#F0C400" },
  { name: "Yellow Ochre", hex: "#C89A38" },
  { name: "Cadmium Red Hue", hex: "#CF4D34" },
  { name: "Quinacridone Magenta", hex: "#A43768" },
  { name: "Ultramarine Blue", hex: "#3B46A5" },
  { name: "Phthalo Blue", hex: "#114A8B" },
  { name: "Phthalo Green", hex: "#006B5E" },
  { name: "Burnt Sienna", hex: "#8A4B30" },
  { name: "Raw Umber", hex: "#6A513B" },
].map((pigment) => ({ ...pigment, rgb: hexToRgb(pigment.hex) }));

const state = {
  image: null,
  colors: [],
  swatches: [],
  dragId: null,
  dragPointerType: null,
  animationFrame: null,
  sourceWidth: canvas.width,
  sourceHeight: canvas.height,
  paletteSize: 4,
  dpr: window.devicePixelRatio || 1,
  scrollLockY: 0,
  hoveredColorId: null,
  paletteDragId: null,
  paletteDragPointerId: null,
  paletteDropIndex: null,
  paletteDragTop: 0,
  paletteGrabOffsetY: 0,
  recipe: [],
};

function mixPigments(recipe) {
  let r = 0;
  let g = 0;
  let b = 0;
  recipe.forEach((entry) => {
    const weight = entry.percent / 100;
    r += srgbToLinear(entry.pigment.rgb.r) * weight;
    g += srgbToLinear(entry.pigment.rgb.g) * weight;
    b += srgbToLinear(entry.pigment.rgb.b) * weight;
  });
  return { r: linearToSrgb(r), g: linearToSrgb(g), b: linearToSrgb(b) };
}

function generateWeightSets(count, step, total = 100, prefix = []) {
  if (count === 1) return total >= step ? [[...prefix, total]] : [];
  const weights = [];
  const minRemaining = (count - 1) * step;
  for (let weight = step; weight <= total - minRemaining; weight += step) {
    weights.push(...generateWeightSets(count - 1, step, total - weight, [...prefix, weight]));
  }
  return weights;
}

function getPigmentCombinations(size, start = 0, prefix = [], results = []) {
  if (prefix.length === size) {
    results.push(prefix);
    return results;
  }
  for (let index = start; index <= PIGMENTS.length - (size - prefix.length); index += 1) {
    getPigmentCombinations(size, index + 1, [...prefix, PIGMENTS[index]], results);
  }
  return results;
}

function estimatePaintRecipe(targetColor) {
  const targetLab = rgbToLab(targetColor);
  let best = null;
  for (let pigmentCount = 2; pigmentCount <= 4; pigmentCount += 1) {
    const combinations = getPigmentCombinations(pigmentCount);
    const weights = generateWeightSets(pigmentCount, 10);
    combinations.forEach((combo) => {
      weights.forEach((set) => {
        const recipe = combo.map((pigment, index) => ({ pigment, percent: set[index] }));
        const mixed = mixPigments(recipe);
        const distance = deltaE(targetLab, rgbToLab(mixed));
        if (!best || distance < best.distance) best = { recipe, distance };
      });
    });
  }
  return {
    targetHex: targetColor.hex,
    rgb: `RGB ${targetColor.r}, ${targetColor.g}, ${targetColor.b}`,
    lab: rgbToLab(targetColor),
    confidence: clamp(Math.round(100 - (best.distance * 2.4)), 5, 99),
    r: targetColor.r,
    g: targetColor.g,
    b: targetColor.b,
    recipe: best.recipe,
  };
}

function formatPercent(value) {
  return `${Math.round(value)}%`;
}

function updatePaletteLabel() {
  paletteSizeLabel.textContent = `Palette: ${state.paletteSize}`;
  paletteMinus.disabled = state.paletteSize <= PALETTE_MIN;
  palettePlus.disabled = state.paletteSize >= PALETTE_MAX;
}

function showImportWarning(title, message) {
  if (!importWarning) return;
  importWarning.innerHTML = `<strong>${title}</strong><p>${message}</p>`;
  importWarning.classList.remove("hidden");
}

function clearImportWarning() {
  if (!importWarning) return;
  importWarning.innerHTML = "";
  importWarning.classList.add("hidden");
}

function isUnsupportedApplePhoto(file) {
  if (!file) return false;
  const type = (file.type || "").toLowerCase();
  const name = (file.name || "").toLowerCase();
  return type === "image/heic" || type === "image/heif" || name.endsWith(".heic") || name.endsWith(".heif");
}

function showRecipeMessage(message) {
  if (!recipeModal || !recipeContent) return;
  recipeModal.classList.remove("hidden");
  recipeModal.setAttribute("aria-hidden", "false");
  recipeContent.innerHTML = `<p class="recipe-empty">${message}</p>`;
}

function closeRecipeModal() {
  if (!recipeModal) return;
  recipeModal.classList.add("hidden");
  recipeModal.setAttribute("aria-hidden", "true");
}

function wrapRecipeText(context, text, maxWidth) {
  const words = text.split(" ");
  const lines = [];
  let current = "";
  words.forEach((word) => {
    const trial = current ? `${current} ${word}` : word;
    if (context.measureText(trial).width <= maxWidth || !current) {
      current = trial;
    } else {
      lines.push(current);
      current = word;
    }
  });
  if (current) lines.push(current);
  return lines;
}

function drawRoundedRect(context, x, y, width, height, radius, fill) {
  context.beginPath();
  context.moveTo(x + radius, y);
  context.lineTo(x + width - radius, y);
  context.quadraticCurveTo(x + width, y, x + width, y + radius);
  context.lineTo(x + width, y + height - radius);
  context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  context.lineTo(x + radius, y + height);
  context.quadraticCurveTo(x, y + height, x, y + height - radius);
  context.lineTo(x, y + radius);
  context.quadraticCurveTo(x, y, x + radius, y);
  context.closePath();
  context.fillStyle = fill;
  context.fill();
}

function exportRecipeImage() {
  if (!state.recipe.length) {
    showRecipeMessage("Upload an image first to generate paint recipes for the palette.");
    return;
  }

  const width = 920;
  const padding = 24;
  const titleHeight = 48;
  const cardGap = 12;
  const cardWidth = width - (padding * 2);
  const note = "Estimated artistic pigment recipe only. This is a perceptual approximation, not an exact physical paint formula.";
  const measureCanvas = document.createElement("canvas");
  const measureCtx = measureCanvas.getContext("2d");
  measureCtx.font = '500 16px "Space Grotesk", sans-serif';
  const cardHeights = state.recipe.map((entry) => {
    const noteLines = wrapRecipeText(measureCtx, note, cardWidth - 44);
    return 152 + (entry.recipe.length * 40) + (Math.max(1, noteLines.length) * 20);
  });
  const height = padding + titleHeight + 16 + cardHeights.reduce((sum, value) => sum + value, 0) + (Math.max(0, state.recipe.length - 1) * cardGap) + padding;
  const exportCanvas = document.createElement("canvas");
  exportCanvas.width = width;
  exportCanvas.height = height;
  const exportCtx = exportCanvas.getContext("2d");

  exportCtx.fillStyle = "#111417";
  exportCtx.fillRect(0, 0, width, height);
  exportCtx.fillStyle = "#f2efe8";
  exportCtx.font = '700 26px "Space Grotesk", sans-serif';
  exportCtx.fillText("Paint recipes", padding, padding + 26);

  let y = padding + titleHeight + 16;
  state.recipe.forEach((entry, index) => {
    const cardHeight = cardHeights[index];
    drawRoundedRect(exportCtx, padding, y, cardWidth, cardHeight, 14, "#191d22");

    const headerTextColor = luminance(entry.r, entry.g, entry.b) > 0.62 ? "#15171a" : "#f2efe8";
    drawRoundedRect(exportCtx, padding + 12, y + 12, cardWidth - 24, 40, 10, entry.targetHex);
    exportCtx.fillStyle = headerTextColor;
    exportCtx.font = '700 18px "Space Grotesk", sans-serif';
    exportCtx.fillText(entry.targetHex, padding + 28, y + 38);

    exportCtx.fillStyle = "#bcc0c7";
    exportCtx.font = '600 16px "Space Grotesk", sans-serif';
    exportCtx.fillText(entry.rgb, padding + 12, y + 76);
    exportCtx.fillText(`LAB ${entry.lab.l.toFixed(1)}, ${entry.lab.a.toFixed(1)}, ${entry.lab.b.toFixed(1)}`, padding + 12, y + 102);
    exportCtx.fillText(`Match quality ${entry.confidence}%`, padding + 12, y + 128);

    let listY = y + 144;
    entry.recipe.forEach((item) => {
      drawRoundedRect(exportCtx, padding + 12, listY, cardWidth - 24, 34, 10, "#2a2f36");
      exportCtx.fillStyle = "#f2efe8";
      exportCtx.font = '600 16px "Space Grotesk", sans-serif';
      exportCtx.fillText(item.pigment.name, padding + 24, listY + 22);
      const percentText = `${item.percent}%`;
      const percentWidth = exportCtx.measureText(percentText).width;
      exportCtx.fillText(percentText, padding + cardWidth - 24 - percentWidth, listY + 22);
      listY += 40;
    });

    const noteLines = wrapRecipeText(exportCtx, note, cardWidth - 44);
    exportCtx.fillStyle = "#91969d";
    exportCtx.font = '500 16px "Space Grotesk", sans-serif';
    noteLines.forEach((line, lineIndex) => {
      exportCtx.fillText(line, padding + 12, listY + 18 + (lineIndex * 20));
    });

    y += cardHeight + cardGap;
  });

  const link = document.createElement("a");
  link.href = exportCanvas.toDataURL("image/png");
  link.download = `paint-recipes-${Date.now()}.png`;
  link.click();
}
function renderRecipe() {
  if (!recipeModal || !recipeContent) return;
  if (!state.recipe.length) {
    closeRecipeModal();
    recipeContent.innerHTML = "";
    return;
  }
  recipeModal.classList.remove("hidden");
  recipeModal.setAttribute("aria-hidden", "false");
  recipeContent.innerHTML = `<div class="recipe-stack">${state.recipe.map((entry) => `
    <section class="recipe-card" style="--recipe-color:${entry.targetHex}">
      <div class="recipe-card-head" style="background:${entry.targetHex};color:${luminance(entry.r, entry.g, entry.b) > 0.62 ? "#15171a" : "#f2efe8"};"><strong>${entry.targetHex}</strong></div>
      <div class="recipe-meta">
        <span>${entry.rgb}</span>
        <span>LAB ${entry.lab.l.toFixed(1)}, ${entry.lab.a.toFixed(1)}, ${entry.lab.b.toFixed(1)}</span>
        <span class="recipe-confidence">Match quality ${entry.confidence}%</span>
      </div>
      <ul class="recipe-list">${entry.recipe.map((item) => `<li><span>${item.pigment.name}</span><strong>${item.percent}%</strong></li>`).join("")}</ul>
      <p class="recipe-note">Estimated artistic pigment recipe only. This is a perceptual approximation, not an exact physical paint formula.</p>
    </section>`).join("")}</div>`;
}


function readImage(file) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const objectUrl = URL.createObjectURL(file);
    const cleanup = () => URL.revokeObjectURL(objectUrl);
    image.onload = () => {
      cleanup();
      resolve(image);
    };
    image.onerror = () => {
      cleanup();
      reject(new Error("Image decode failed"));
    };
    image.src = objectUrl;
  });
}

function fitImage(image, maxWidth, maxHeight) {
  const ratio = Math.min(maxWidth / image.width, maxHeight / image.height);
  return { width: Math.max(1, Math.round(image.width * ratio)), height: Math.max(1, Math.round(image.height * ratio)) };
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
      if (data[index + 3] < 180) continue;
      const r = data[index];
      const g = data[index + 1];
      const b = data[index + 2];
      const key = [Math.round(r / 24) * 24, Math.round(g / 24) * 24, Math.round(b / 24) * 24].join(",");
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
  return [...buckets.values()].sort((a, b) => b.count - a.count).slice(0, paletteSize).map((entry, index) => {
    const avgR = Math.round(entry.sumR / entry.count);
    const avgG = Math.round(entry.sumG / entry.count);
    const avgB = Math.round(entry.sumB / entry.count);
    const representative = entry.positions.reduce((closest, point) => {
      const currentDistance = Math.abs(point.r - avgR) + Math.abs(point.g - avgG) + Math.abs(point.b - avgB);
      return !closest || currentDistance < closest.distance ? { point, distance: currentDistance } : closest;
    }, null).point;
    return { id: `color-${index + 1}`, r: avgR, g: avgG, b: avgB, hex: rgbToHex(avgR, avgG, avgB), percent: (entry.count / total) * 100, x: representative.x / width, y: representative.y / height };
  });
}
function recalculatePercentages() {
  if (!state.colors.length) return;
  const sampleCanvas = document.createElement("canvas");
  const sampleCtx = sampleCanvas.getContext("2d", { willReadFrequently: true });
  sampleCanvas.width = SAMPLE_GRID;
  sampleCanvas.height = SAMPLE_GRID;
  sampleCtx.drawImage(canvas, 0, 0, SAMPLE_GRID, SAMPLE_GRID);
  const { data } = sampleCtx.getImageData(0, 0, SAMPLE_GRID, SAMPLE_GRID);
  const counts = new Array(state.colors.length).fill(0);
  let total = 0;
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] < 180) continue;
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
  if (!state.image) return;
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
  const blurReduction = Math.max(1, blurValue * 0.62);
  const reducedWidth = Math.max(14, Math.round(displayWidth / blurReduction));
  const reducedHeight = Math.max(20, Math.round(displayHeight / blurReduction));
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
    drawWidth = reducedWidth;
    drawHeight = reducedWidth / imageRatio;
    offsetY = (reducedHeight - drawHeight) / 2;
  } else {
    drawHeight = reducedHeight;
    drawWidth = reducedHeight * imageRatio;
    offsetX = (reducedWidth - drawWidth) / 2;
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
  return { r: pixel[0], g: pixel[1], b: pixel[2], hex: rgbToHex(pixel[0], pixel[1], pixel[2]) };
}

function getScaledPaletteHeights(availableHeight, gap = 3, minHeight = 52) {
  const totalPercent = state.colors.reduce((sum, color) => sum + color.percent, 0) || 1;
  const totalGaps = Math.max(0, state.colors.length - 1) * gap;
  const usableHeight = Math.max(minHeight * state.colors.length, availableHeight - totalGaps);
  const scaled = state.colors.map((color) => Math.max(minHeight, (color.percent / totalPercent) * usableHeight));
  const heightSum = scaled.reduce((sum, value) => sum + value, 0);
  const scale = heightSum > 0 ? usableHeight / heightSum : 1;
  return scaled.map((value) => value * scale);
}

function getPaletteHeights() {
  return getScaledPaletteHeights(paletteList.clientHeight, 3, 52);
}


function exportStudyImage() {
  if (!state.image || !state.colors.length) return;

  const imageWidth = 1100;
  const imageHeight = Math.max(700, Math.round(imageWidth * (state.sourceHeight / Math.max(1, state.sourceWidth))));
  const paletteWidth = 320;
  const gap = 3;
  const exportCanvas = document.createElement("canvas");
  exportCanvas.width = imageWidth + paletteWidth;
  exportCanvas.height = imageHeight;
  const exportCtx = exportCanvas.getContext("2d");

  exportCtx.fillStyle = "#111417";
  exportCtx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
  exportCtx.drawImage(canvas, 0, 0, imageWidth, imageHeight);

  const paletteHeights = getScaledPaletteHeights(imageHeight, gap, 54);
  let cardY = 0;
  state.colors.forEach((color, index) => {
    const cardHeight = paletteHeights[index] || 54;
    const cardX = imageWidth;
    exportCtx.fillStyle = color.hex;
    exportCtx.fillRect(cardX, cardY, paletteWidth, cardHeight);

    exportCtx.fillStyle = "rgba(255,255,255,0.08)";
    exportCtx.fillRect(cardX, cardY, paletteWidth, 1);

    const textColor = "#f2efe8";
    exportCtx.font = '700 18px "Space Grotesk", sans-serif';
    const hexWidth = exportCtx.measureText(color.hex).width;
    exportCtx.font = '300 17px "Space Grotesk", sans-serif';
    const percentLabel = `${Math.round(color.percent)}%`;
    const percentWidth = exportCtx.measureText(percentLabel).width;
    const labelWidth = Math.max(132, Math.ceil(hexWidth + percentWidth + 28));
    drawRoundedRect(exportCtx, cardX + 14, cardY + 12, labelWidth, 34, 10, "rgba(42, 44, 48, 0.64)");
    exportCtx.fillStyle = textColor;
    exportCtx.font = '700 18px "Space Grotesk", sans-serif';
    exportCtx.fillText(color.hex, cardX + 26, cardY + 34);
    exportCtx.font = '300 17px "Space Grotesk", sans-serif';
    exportCtx.fillText(percentLabel, cardX + 26 + hexWidth + 10, cardY + 34);

    cardY += cardHeight + gap;
  });

  const scaleX = imageWidth / Math.max(1, state.sourceWidth);
  const scaleY = imageHeight / Math.max(1, state.sourceHeight);
  state.swatches.forEach((swatch) => {
    const x = swatch.targetX * scaleX;
    const y = swatch.targetY * scaleY;
    exportCtx.beginPath();
    exportCtx.arc(x, y, 18, 0, Math.PI * 2);
    exportCtx.fillStyle = swatch.color.hex;
    exportCtx.fill();
    exportCtx.lineWidth = 2;
    exportCtx.strokeStyle = "rgba(10, 10, 10, 0.9)";
    exportCtx.stroke();
    exportCtx.beginPath();
    exportCtx.arc(x, y, 20, 0, Math.PI * 2);
    exportCtx.lineWidth = 2;
    exportCtx.strokeStyle = "rgba(255,255,255,0.26)";
    exportCtx.stroke();
  });

  const link = document.createElement("a");
  link.href = exportCanvas.toDataURL("image/png");
  link.download = `color-study-${Date.now()}.png`;
  link.click();
}

function startPaletteDrag(event, id) {
  if (!state.colors.length) return;
  event.preventDefault();
  event.stopPropagation();
  const card = event.currentTarget;
  const rect = card.getBoundingClientRect();
  const listRect = paletteList.getBoundingClientRect();
  state.paletteDragId = id;
  state.paletteDragPointerId = event.pointerId ?? null;
  state.paletteDropIndex = state.colors.findIndex((color) => color.id === id);
  state.paletteDragTop = rect.top - listRect.top;
  state.paletteGrabOffsetY = event.clientY - rect.top;
  setHoveredColor(id);
  lockPageScroll();
  if (state.paletteDragPointerId !== null) {
    paletteList.setPointerCapture(state.paletteDragPointerId);
  }
  renderPalette();
}

function getPaletteDragIndex(pointerY) {
  const cards = [...paletteList.querySelectorAll('.palette-card:not(.dragging)')];
  let index = 0;
  for (const card of cards) {
    const rect = card.getBoundingClientRect();
    const midpoint = rect.top + (rect.height / 2);
    if (pointerY < midpoint) return index;
    index += 1;
  }
  return cards.length;
}

function commitPaletteOrder() {
  if (!state.paletteDragId || state.paletteDropIndex === null) return;
  const currentIndex = state.colors.findIndex((color) => color.id === state.paletteDragId);
  if (currentIndex < 0) return;
  const [moved] = state.colors.splice(currentIndex, 1);
  state.colors.splice(state.paletteDropIndex, 0, moved);
}

function createPaletteCard(color, height) {
  const card = document.createElement('div');
  card.className = 'palette-card';
  if (state.hoveredColorId === color.id) card.classList.add('hovered');
  card.style.setProperty('--card-color', color.hex);
  card.style.background = `linear-gradient(135deg, ${color.hex}, color-mix(in srgb, ${color.hex} 44%, #17191c))`;
  card.style.height = `${height || 52}px`;
  const textColor = luminance(color.r, color.g, color.b) > 0.62 ? '#15171a' : '#f2efe8';
  card.style.color = textColor;
  card.dataset.id = color.id;
  card.addEventListener('pointerdown', (event) => startPaletteDrag(event, color.id));
  card.innerHTML = `<div class="palette-meta"><div class="palette-line"><button class="palette-code palette-copy" type="button" data-copy-hex="${color.hex}" title="Copy"><strong>${color.hex}</strong></button><span class="percent-badge">${formatPercent(color.percent)}</span></div></div>`;
  const copyButton = card.querySelector('[data-copy-hex]');
  if (copyButton) {
    copyButton.addEventListener('pointerdown', (event) => {
      event.stopPropagation();
    });
    copyButton.addEventListener('click', async (event) => {
      event.stopPropagation();
      await copyHexCode(color.hex);
    });
  }
  return card;
}

async function copyHexCode(hex) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(hex);
      return true;
    }
  } catch (error) {
    console.warn('Clipboard API copy failed, falling back.', error);
  }

  const helper = document.createElement('textarea');
  helper.value = hex;
  helper.setAttribute('readonly', '');
  helper.style.position = 'fixed';
  helper.style.opacity = '0';
  helper.style.pointerEvents = 'none';
  document.body.appendChild(helper);
  helper.select();
  helper.setSelectionRange(0, helper.value.length);
  const copied = document.execCommand('copy');
  document.body.removeChild(helper);
  return copied;
}

function renderPalette() {
  paletteList.innerHTML = '';
  const heights = getPaletteHeights();
  const heightById = new Map(state.colors.map((color, index) => [color.id, heights[index] || 52]));

  if (!state.paletteDragId) {
    state.colors.forEach((color) => {
      paletteList.appendChild(createPaletteCard(color, heightById.get(color.id)));
    });
    return;
  }

  const dragId = state.paletteDragId;
  const draggedColor = state.colors.find((color) => color.id === dragId);
  const draggedHeight = heightById.get(dragId) || 52;
  const remainingColors = state.colors.filter((color) => color.id !== dragId);

  remainingColors.forEach((color, index) => {
    if (state.paletteDropIndex === index) {
      const placeholder = document.createElement('div');
      placeholder.className = 'palette-placeholder';
      placeholder.style.height = `${draggedHeight}px`;
      paletteList.appendChild(placeholder);
    }
    paletteList.appendChild(createPaletteCard(color, heightById.get(color.id)));
  });

  if (state.paletteDropIndex === remainingColors.length) {
    const placeholder = document.createElement('div');
    placeholder.className = 'palette-placeholder';
    placeholder.style.height = `${draggedHeight}px`;
    paletteList.appendChild(placeholder);
  }

  const dragCard = createPaletteCard(draggedColor, draggedHeight);
  dragCard.classList.add('dragging');
  dragCard.style.top = `${state.paletteDragTop}px`;
  paletteList.appendChild(dragCard);
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

function setHoveredColor(id) {
  if (state.hoveredColorId === id) return;
  state.hoveredColorId = id;
  renderPalette();
}

function createSwatch(color) {
  const swatch = document.createElement("div");
  swatch.className = "swatch";
  swatch.style.setProperty("--swatch-color", color.hex);
  swatch.style.left = "0px";
  swatch.style.top = "0px";
  swatch.setAttribute("aria-label", `${color.hex} swatch`);
  swatch.dataset.id = color.id;
  swatch.addEventListener("pointerenter", () => setHoveredColor(color.id));
  swatch.addEventListener("pointerleave", () => setHoveredColor(null));
  swatch.addEventListener("pointerdown", (event) => startDrag(event, color.id));
  swatchLayer.appendChild(swatch);
  return { id: color.id, color, element: swatch, x: color.x * state.sourceWidth, y: color.y * state.sourceHeight, targetX: color.x * state.sourceWidth, targetY: color.y * state.sourceHeight };
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

function lockPageScroll() {
  state.scrollLockY = window.scrollY || window.pageYOffset || 0;
  document.body.style.position = "fixed";
  document.body.style.top = `-${state.scrollLockY}px`;
  document.body.style.left = "0";
  document.body.style.right = "0";
  document.body.style.width = "100%";
  document.body.style.overflow = "hidden";
}

function unlockPageScroll() {
  document.body.style.position = "";
  document.body.style.top = "";
  document.body.style.left = "";
  document.body.style.right = "";
  document.body.style.width = "";
  document.body.style.overflow = "";
  window.scrollTo(0, state.scrollLockY || 0);
}

function getPointFromEvent(event) {
  const rect = canvasWrap.getBoundingClientRect();
  const touch = event.touches && event.touches[0] ? event.touches[0] : event.changedTouches && event.changedTouches[0] ? event.changedTouches[0] : event;
  return { x: clamp(touch.clientX - rect.left, 0, rect.width), y: clamp(touch.clientY - rect.top, 0, rect.height) };
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
  syncSwatchTargetsFromColors();
}
function startDrag(event, id) {
  event.preventDefault();
  event.stopPropagation();
  state.dragId = id;
  state.dragPointerType = event.pointerType || "mouse";
  setHoveredColor(id);
  const swatch = state.swatches.find((entry) => entry.id === id);
  if (!swatch) return;
  swatch.element.classList.add("active");
  if (state.dragPointerType !== "touch") {
    lockPageScroll();
  }
  if (event.pointerId !== undefined && state.dragPointerType !== "touch") {
    swatch.element.setPointerCapture(event.pointerId);
  }
  const point = getPointFromEvent(event);
  swatch.targetX = point.x;
  swatch.targetY = point.y;
  updateSwatchColor(swatch);
}

function handleDrag(event) {
  if (state.paletteDragId) {
    event.preventDefault();
    const listRect = paletteList.getBoundingClientRect();
    const dragCard = paletteList.querySelector(".palette-card.dragging");
    const dragHeight = dragCard ? dragCard.getBoundingClientRect().height : 52;
    state.paletteDragTop = clamp(event.clientY - listRect.top - state.paletteGrabOffsetY, 0, Math.max(0, paletteList.clientHeight - dragHeight));
    const nextDropIndex = getPaletteDragIndex(event.clientY);
    if (nextDropIndex !== state.paletteDropIndex) {
      state.paletteDropIndex = nextDropIndex;
      renderPalette();
    } else if (dragCard) {
      dragCard.style.top = `${state.paletteDragTop}px`;
    }
    return;
  }
  if (!state.dragId) return;
  event.preventDefault();
  const swatch = state.swatches.find((entry) => entry.id === state.dragId);
  if (!swatch) return;
  const point = getPointFromEvent(event);
  swatch.targetX = point.x;
  swatch.targetY = point.y;
  updateSwatchColor(swatch);
}

function endDrag() {
  if (state.paletteDragId) {
    commitPaletteOrder();
    if (state.paletteDragPointerId !== null && paletteList.hasPointerCapture(state.paletteDragPointerId)) {
      paletteList.releasePointerCapture(state.paletteDragPointerId);
    }
    state.paletteDragId = null;
    state.paletteDragPointerId = null;
    state.paletteDropIndex = null;
    state.paletteDragTop = 0;
    state.paletteGrabOffsetY = 0;
    unlockPageScroll();
    setHoveredColor(null);
    renderPalette();
    rebuildSwatches();
    return;
  }
  if (!state.dragId) return;
  const swatch = state.swatches.find((entry) => entry.id === state.dragId);
  if (swatch) {
    swatch.element.classList.remove("active");
    updateSwatchColor(swatch);
  }
  if (state.dragPointerType !== "touch") {
    unlockPageScroll();
  }
  state.dragId = null;
  state.dragPointerType = null;
  setHoveredColor(null);
}

function initializePalette() {
  state.colors = extractPalette(state.image, state.paletteSize);
  state.recipe = [];
  canvasWrap.style.setProperty("--image-ratio", `${state.image.width} / ${state.image.height}`);
  drawProcessedImage();
  recalculatePercentages();
  renderRecipe();
  renderPalette();
  rebuildSwatches();
  updatePaletteLabel();
}

function addPaletteColor() {
  if (!state.image || state.colors.length >= PALETTE_MAX) return;
  const candidates = extractPalette(state.image, PALETTE_MAX);
  const nextColor = candidates.find((candidate) => !state.colors.some((color) => colorDistance(color, candidate) < 24)) || candidates[state.colors.length];
  if (!nextColor) return;
  state.colors.push({ ...nextColor, id: `color-${state.colors.length + 1}` });
  state.paletteSize = state.colors.length;
  recalculatePercentages();
  renderPalette();
  rebuildSwatches();
  updatePaletteLabel();
}

function removePaletteColor() {
  if (!state.image || state.colors.length <= PALETTE_MIN) return;
  state.colors.pop();
  state.paletteSize = state.colors.length;
  recalculatePercentages();
  renderPalette();
  rebuildSwatches();
  updatePaletteLabel();
}

async function handleFile(file) {
  if (!file) return;
  clearImportWarning();
  if (isUnsupportedApplePhoto(file)) {
    showImportWarning("Apple photo format", "This image looks like HEIC or HEIF, which may not open here yet. In Photos, share or export it as JPEG or PNG, then try again.");
    return;
  }

  try {
    state.image = await readImage(file);
    emptyState.classList.add("hidden");
    initializePalette();
  } catch (error) {
    showImportWarning("Could not import image", "That file could not be opened in this browser. Try a JPEG or PNG version and then reimport it.");
  }
}

recipeButton.addEventListener("click", () => {
  if (!state.colors.length) {
    showRecipeMessage("Upload an image first to generate paint recipes for the palette.");
    return;
  }
  state.recipe = state.colors.map((color) => estimatePaintRecipe(color));
  renderRecipe();
});


input.addEventListener("change", async (event) => {
  const [file] = event.target.files || [];
  await handleFile(file);
  event.target.value = "";
});

blurRange.addEventListener("input", () => {
  if (!state.image) return;
  drawProcessedImage();
  syncSwatchTargetsFromColors();
  recalculatePercentages();
  renderPalette();
  syncSwatchTargetsFromColors();
});

paletteMinus.addEventListener("click", removePaletteColor);
palettePlus.addEventListener("click", addPaletteColor);
canvasWrap.addEventListener("dragover", (event) => event.preventDefault());
canvasWrap.addEventListener("drop", async (event) => {
  event.preventDefault();
  const [file] = event.dataTransfer.files || [];
  await handleFile(file);
});
window.addEventListener("pointermove", handleDrag, { passive: false });
window.addEventListener("pointerup", endDrag);
window.addEventListener("pointercancel", endDrag);
if (recipeExport) {
  recipeExport.addEventListener("click", exportRecipeImage);
}
if (imageExportButton) {
  imageExportButton.addEventListener("click", exportStudyImage);
}
if (recipeClose) {
  recipeClose.addEventListener("click", closeRecipeModal);
}
if (recipeModal) {
  recipeModal.addEventListener("click", (event) => {
    if (event.target === recipeModal) closeRecipeModal();
  });
}
window.addEventListener("resize", () => {
  if (!state.image) return;
  drawProcessedImage();
  syncSwatchTargetsFromColors();
  recalculatePercentages();
  renderPalette();
  syncSwatchTargetsFromColors();
});
updatePaletteLabel();
}

function boot() {
  document.querySelectorAll("[data-webflow-palette]").forEach((root) => {
    initPalette(root);
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot, { once: true });
} else {
  boot();
}
})();


