(() => {
function getPaletteControlsMarkup(extraClass = "") {
  const className = extraClass ? `palette-toolbar-controls ${extraClass}` : "palette-toolbar-controls";
  return `
                <div class="${className}">
                  <button class="palette-button" type="button" data-action="palette-minus" aria-label="Decrease palette size">-</button>
                  <span data-role="palette-size-label" class="palette-size-label">Palette: 4</span>
                  <button class="palette-button" type="button" data-action="palette-plus" aria-label="Increase palette size">+</button>
                </div>`;
}

function getPaletteMarkup() {
  return `
  <main class="app-shell">
    <section class="workspace">
      <div class="canvas-stage">
        <div class="control-hud" aria-label="Color study controls">
          <div class="control-hud__panel control-hud__panel--bar">
            <div class="hud-bar">
              <div class="hud-bar__group hud-bar__group--title">
                <p class="eyebrow">Colour Palette</p>
              </div>
              <div class="hud-bar__group hud-bar__group--center">
                <button class="hud-settings-toggle" type="button" data-action="toggle-settings" aria-expanded="false" hidden>Settings</button>
              </div>
              <div class="hud-bar__group hud-bar__group--status">
                <span class="hud-count">Studio blur map</span>
              </div>
            </div>
          </div>
          <div class="control-hud__panel control-hud__panel--actions hud-settings-panel" data-role="hud-settings-panel">
            <div class="hud-actions">
              <div class="hud-buttons">
                <button class="recipe-button" type="button" data-action="paint-setup">Paint Setup</button>
                <button class="recipe-button" type="button" data-action="recipe">Paint Recipe</button>
                <button class="recipe-button" type="button" data-action="export-image">Save Image</button>
              </div>
              <label class="hud-slider">
                <span>Blur</span>
                <input data-role="blur-range" type="range" min="0" max="40" value="40">
              </label>
            </div>
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

      <aside class="palette-panel" data-role="palette-panel">
        <div class="mobile-palette-rail" data-role="mobile-palette-rail">
          <button class="palette-drawer-open" type="button" data-action="palette-drawer-open" aria-label="Open reorder menu" aria-expanded="false">
            <span class="palette-drawer-open__label">Open</span>
          </button>
          <div class="mobile-palette-rail__surface palette-drawer-summary" data-role="palette-drawer-summary">
            <div class="mobile-palette-rail__top">
              <div class="mobile-palette-rail__copy palette-drawer-toggle__copy">
                <span class="palette-drawer-toggle__label">Palette Rail</span>
                <span class="palette-drawer-toggle__status" data-role="palette-preview-status">Upload an image to build a palette.</span>
              </div>
              <div class="mobile-palette-rail__toolbar palette-toolbar">
${getPaletteControlsMarkup("mobile-palette-rail__toolbar-controls")}
              </div>
            </div>
            <span class="mobile-palette-rail__preview palette-preview-list" data-role="palette-preview-list" aria-hidden="true"></span>
          </div>
        </div>
        <div class="palette-toolbar" data-role="desktop-palette-toolbar">
          <div class="palette-toolbar-head">
            <span class="palette-rail-label">Palette Rail</span>
            <button class="palette-drawer-close" type="button" data-action="palette-drawer-close" aria-label="Close palette drawer">Close</button>
          </div>
${getPaletteControlsMarkup()}
        </div>
        <div class="palette-drawer-sheet" data-role="palette-drawer-sheet" aria-hidden="false">
          <div data-role="palette-list" class="palette-list"></div>
        </div>
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
  </div>

  <div data-role="inventory-modal" class="inventory-modal hidden" aria-hidden="true">
    <div class="inventory-modal-panel" role="dialog" aria-modal="true" aria-label="Paint setup">
      <div class="inventory-modal-head">
        <div>
          <p class="recipe-modal-kicker">Owned paint inventory</p>
          <h2>Paint setup</h2>
        </div>
        <button class="recipe-close" type="button" data-action="inventory-close" aria-label="Close paint setup">x</button>
      </div>
      <div class="inventory-modal-body">
        <p class="inventory-note">Add the tubes you own. Pigment codes are required, and the app will use the Williamsburg starter palette whenever no saved inventory is available.</p>
        <form data-role="inventory-form" class="inventory-form">
          <div class="inventory-grid">
            <label class="inventory-field">
              <span>Brand</span>
              <input data-role="inventory-brand" name="brand" type="text" maxlength="48" placeholder="Williamsburg">
            </label>
            <label class="inventory-field">
              <span>Color name</span>
              <input data-role="inventory-color-name" name="color_name" type="text" maxlength="64" placeholder="Phthalo Blue">
            </label>
            <label class="inventory-field">
              <span>Pigment codes</span>
              <input data-role="inventory-pigment-codes" name="pigment_codes" type="text" maxlength="80" placeholder="PB15:3">
            </label>
            <label class="inventory-field">
              <span>Opacity</span>
              <select data-role="inventory-opacity" name="opacity_label">
                <option value="opaque">Opaque</option>
                <option value="semi-opaque">Semi-opaque</option>
                <option value="semi-transparent">Semi-transparent</option>
                <option value="transparent">Transparent</option>
                <option value="unverified">Unverified</option>
              </select>
            </label>
            <label class="inventory-field">
              <span>Lightfastness</span>
              <input data-role="inventory-lightfastness" name="lightfastness_label" type="text" maxlength="32" placeholder="I or ASTM I">
            </label>
            <label class="inventory-field">
              <span>Swatch hex</span>
              <input data-role="inventory-hex" name="approx_srgb_hex" type="text" maxlength="7" placeholder="#114A8B">
            </label>
          </div>
          <div class="inventory-actions">
            <button class="recipe-button" type="submit">Add paint</button>
            <p data-role="inventory-feedback" class="inventory-feedback" aria-live="polite"></p>
          </div>
        </form>
        <div class="inventory-list-shell">
          <div class="inventory-list-head">
            <strong>Saved paints</strong>
            <span data-role="inventory-count">0 paints saved</span>
          </div>
          <div data-role="inventory-list" class="inventory-list"></div>
        </div>
      </div>
    </div>
    <div class="inventory-modal-actions">
      <button class="recipe-button" type="button" data-action="inventory-reset">Use starter palette</button>
      <button class="recipe-export" type="button" data-action="inventory-save">Save inventory</button>
    </div>
  </div>

  <div data-role="save-modal" class="save-modal hidden" aria-hidden="true">
    <div class="save-modal-panel" role="dialog" aria-modal="true" aria-label="Save image options">
      <div class="save-modal-head">
        <div>
          <p class="save-modal-kicker">Export study</p>
          <h2>Save image</h2>
        </div>
        <button class="save-close" type="button" data-action="save-close" aria-label="Close save options">x</button>
      </div>
      <div data-role="save-content" class="save-modal-content">
        <div class="save-controls">
          <section class="save-control-group">
            <span class="save-control-label">Style</span>
            <div class="save-option-row">
              <button class="save-option-button" type="button" data-save-style="current">Default</button>
              <button class="save-option-button" type="button" data-save-style="strip">Swatches</button>
            </div>
          </section>
          <section class="save-control-group">
            <span class="save-control-label">Size</span>
            <div class="save-option-row save-option-row-sizes">
              <button class="save-option-button" type="button" data-save-size="1000">1k</button>
              <button class="save-option-button" type="button" data-save-size="2000">2k</button>
              <button class="save-option-button" type="button" data-save-size="3000">3k</button>
              <button class="save-option-button" type="button" data-save-size="4000">4k</button>
            </div>
          </section>
          <label data-role="save-nodes-row" class="save-toggle">
            <input data-role="save-strip-nodes" type="checkbox">
            <span>Show nodes</span>
          </label>
        </div>
        <div class="save-preview-shell">
          <canvas data-role="save-preview-canvas" aria-label="Save preview"></canvas>
          <p data-role="save-preview-empty" class="save-preview-empty" hidden></p>
        </div>
      </div>
    </div>
    <button class="save-export" type="button" data-action="save-export-image">Save image</button>
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
  root.dataset.paletteHasImage = "false";

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
  const palettePanel = root.querySelector('[data-role="palette-panel"]');
  const mobilePaletteRail = root.querySelector('[data-role="mobile-palette-rail"]');
  const desktopPaletteToolbar = root.querySelector('[data-role="desktop-palette-toolbar"]');
  const paletteDrawerSheet = root.querySelector('[data-role="palette-drawer-sheet"]');
  const paletteDrawerSummary = root.querySelector('[data-role="palette-drawer-summary"]');
  const palettePreviewList = root.querySelector('[data-role="palette-preview-list"]');
  const palettePreviewStatus = root.querySelector('[data-role="palette-preview-status"]');
  const emptyState = root.querySelector('[data-role="empty-state"]');
  const canvasStage = root.querySelector('.canvas-stage');
  const canvasWrap = root.querySelector('[data-role="canvas-wrap"]');
  const controlHud = root.querySelector('.control-hud');
  const hudSettingsPanel = root.querySelector('[data-role="hud-settings-panel"]');
  const settingsToggle = root.querySelector('[data-action="toggle-settings"]');
  const paletteDrawerOpen = root.querySelector('[data-action="palette-drawer-open"]');
  const paletteDrawerClose = root.querySelector('[data-action="palette-drawer-close"]');
  const paletteMinusButtons = [...root.querySelectorAll('[data-action="palette-minus"]')];
  const palettePlusButtons = [...root.querySelectorAll('[data-action="palette-plus"]')];
  const paletteSizeLabels = [...root.querySelectorAll('[data-role="palette-size-label"]')];
  const recipeButton = root.querySelector('[data-action="recipe"]');
  const paintSetupButton = root.querySelector('[data-action="paint-setup"]');
  const imageExportButton = root.querySelector('[data-action="export-image"]');
  const recipeModal = root.querySelector('[data-role="recipe-modal"]');
  const recipeContent = root.querySelector('[data-role="recipe-content"]');
  const recipeClose = root.querySelector('[data-action="recipe-close"]');
  const recipeExport = root.querySelector('[data-action="recipe-export"]');
  const inventoryModal = root.querySelector('[data-role="inventory-modal"]');
  const inventoryForm = root.querySelector('[data-role="inventory-form"]');
  const inventoryBrand = root.querySelector('[data-role="inventory-brand"]');
  const inventoryColorName = root.querySelector('[data-role="inventory-color-name"]');
  const inventoryPigmentCodes = root.querySelector('[data-role="inventory-pigment-codes"]');
  const inventoryOpacity = root.querySelector('[data-role="inventory-opacity"]');
  const inventoryLightfastness = root.querySelector('[data-role="inventory-lightfastness"]');
  const inventoryHex = root.querySelector('[data-role="inventory-hex"]');
  const inventoryFeedback = root.querySelector('[data-role="inventory-feedback"]');
  const inventoryList = root.querySelector('[data-role="inventory-list"]');
  const inventoryCount = root.querySelector('[data-role="inventory-count"]');
  const inventoryClose = root.querySelector('[data-action="inventory-close"]');
  const inventoryReset = root.querySelector('[data-action="inventory-reset"]');
  const inventorySave = root.querySelector('[data-action="inventory-save"]');
  const saveModal = root.querySelector('[data-role="save-modal"]');
  const saveContent = root.querySelector('[data-role="save-content"]');
  const savePreviewCanvas = root.querySelector('[data-role="save-preview-canvas"]');
  const savePreviewEmpty = root.querySelector('[data-role="save-preview-empty"]');
  const saveNodesRow = root.querySelector('[data-role="save-nodes-row"]');
  const saveStripNodes = root.querySelector('[data-role="save-strip-nodes"]');
  const saveClose = root.querySelector('[data-action="save-close"]');
  const saveExport = root.querySelector('[data-action="save-export-image"]');
  const saveStyleButtons = [...root.querySelectorAll('[data-save-style]')];
  const saveSizeButtons = [...root.querySelectorAll('[data-save-size]')];
  if (!ctx || !swatchLayer || !paletteList || !palettePanel || !mobilePaletteRail || !desktopPaletteToolbar || !paletteDrawerSheet || !paletteDrawerSummary || !palettePreviewList || !palettePreviewStatus || !emptyState || !canvasStage || !canvasWrap || !controlHud || !hudSettingsPanel || !settingsToggle || !paletteDrawerOpen || !paletteDrawerClose || !paletteMinusButtons.length || !palettePlusButtons.length || !paletteSizeLabels.length || !recipeButton || !paintSetupButton || !imageExportButton || !recipeModal || !recipeContent || !recipeClose || !recipeExport || !inventoryModal || !inventoryForm || !inventoryBrand || !inventoryColorName || !inventoryPigmentCodes || !inventoryOpacity || !inventoryLightfastness || !inventoryHex || !inventoryFeedback || !inventoryList || !inventoryCount || !inventoryClose || !inventoryReset || !inventorySave || !saveModal || !saveContent || !savePreviewCanvas || !savePreviewEmpty || !saveNodesRow || !saveStripNodes || !saveClose || !saveExport || !saveStyleButtons.length || !saveSizeButtons.length) {
    return;
  }

const PALETTE_MIN = 2;
const PALETTE_MAX = 30;
const DEFAULT_PALETTE_SIZE = 4;
const MOBILE_LAYOUT_MAX_WIDTH = 980;
const PALETTE_TWO_COLUMN_THRESHOLD = 16;
const PALETTE_GAP = 3;
const PALETTE_SINGLE_MIN_HEIGHT = 52;
const PALETTE_TWO_COLUMN_TARGET_MIN_HEIGHT = 34;
const PALETTE_TWO_COLUMN_FLOOR_HEIGHT = 18;
const SAMPLE_GRID = 72;
const PERCENTAGE_SAMPLE_LONG_EDGE = 96;
const EXPORT_LAYOUT_CURRENT = "current";
const EXPORT_LAYOUT_STRIP = "strip";
const EXPORT_DEFAULT_LONGEST_EDGE = 2000;
const EXPORT_PREVIEW_LONGEST_EDGE = 1200;
const EXPORT_SIZE_PRESETS = [1000, 2000, 3000, 4000];
const SCROLL_LOCK_SWATCH_DRAG = "swatch-drag";
const SCROLL_LOCK_PALETTE_DRAG = "palette-drag";
const SCROLL_LOCK_PALETTE_DRAWER = "palette-drawer";
const PALETTE_PREVIEW_PLACEHOLDER_COUNT = 4;
const PALETTE_DRAWER_SETTLE_DELAY_MS = 260;
const mobileLayoutQuery = window.matchMedia(`(max-width: ${MOBILE_LAYOUT_MAX_WIDTH}px)`);
const paletteDrawerId = `palette-drawer-${Math.random().toString(36).slice(2, 10)}`;

paletteDrawerSheet.id = paletteDrawerId;
paletteDrawerOpen.setAttribute("aria-controls", paletteDrawerId);
paletteDrawerClose.setAttribute("aria-controls", paletteDrawerId);

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function isRealMobileLayout() {
  return mobileLayoutQuery.matches;
}

function isTwoColumnPalette(count = state.colors.length) {
  return count >= PALETTE_TWO_COLUMN_THRESHOLD;
}

function getPaletteLeftColumnCount(count = state.colors.length) {
  return Math.ceil(count / 2);
}

function getPaletteFrameClearance() {
  if (isRealMobileLayout()) {
    return 24;
  }
  return isTwoColumnPalette() ? 576 : 460;
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

function labDistanceSquared(labA, labB) {
  return ((labA.l - labB.l) ** 2) + ((labA.a - labB.a) ** 2) + ((labA.b - labB.b) ** 2);
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
const INVENTORY_STORAGE_KEY = "colour-palette-owned-paints-v1";
const IDEAL_SINGLE_PAINT_DISTANCE_THRESHOLD = 6.5;
const DEFAULT_RECIPE_BATCH_SIZE = { value: 1, unit: "parts" };
const DEFAULT_RECIPE_CONSTRAINTS = {
  max_pigments: 4,
  finish_intent: "opaque",
  illuminants: ["D65", "A"],
  allow_substitutions: true,
  avoid_multi_pigment: false,
};
const STARTER_PAINTS = [
  {
    brand: "Williamsburg",
    color_name: "Permanent Yellow Light",
    pigment_codes: ["PY3"],
    opacity_label: "semi-transparent",
    approx_srgb_hex: "#E6C62A",
    line: "Oil",
  },
  {
    brand: "Williamsburg",
    color_name: "Permanent Yellow Deep",
    pigment_codes: ["PY65"],
    opacity_label: "semi-transparent",
    approx_srgb_hex: "#D59619",
    line: "Oil",
  },
  {
    brand: "Williamsburg",
    color_name: "Pyrrole Red",
    pigment_codes: ["PR254"],
    opacity_label: "opaque",
    approx_srgb_hex: "#B9362E",
    line: "Oil",
  },
  {
    brand: "Williamsburg",
    color_name: "Quinacridone Magenta",
    pigment_codes: ["PR122"],
    opacity_label: "transparent",
    approx_srgb_hex: "#A43768",
    line: "Oil",
  },
  {
    brand: "Williamsburg",
    color_name: "Egyptian Violet",
    pigment_codes: ["PV23"],
    opacity_label: "transparent",
    approx_srgb_hex: "#5A3A7A",
    line: "Oil",
  },
  {
    brand: "Williamsburg",
    color_name: "Phthalo Blue",
    pigment_codes: ["PB15:3"],
    opacity_label: "transparent",
    approx_srgb_hex: "#114A8B",
    line: "Oil",
  },
  {
    brand: "Williamsburg",
    color_name: "Phthalo Green",
    pigment_codes: ["PG7"],
    opacity_label: "transparent",
    approx_srgb_hex: "#006B5E",
    line: "Oil",
  },
  {
    brand: "Williamsburg",
    color_name: "Green Gold",
    pigment_codes: ["PY129"],
    opacity_label: "semi-transparent",
    approx_srgb_hex: "#768C2A",
    line: "Oil",
  },
  {
    brand: "Williamsburg",
    color_name: "Titanium White",
    pigment_codes: ["PW6"],
    opacity_label: "opaque",
    approx_srgb_hex: "#F2EFE8",
    line: "Oil",
  },
];

function isValidHex(value) {
  return /^#([0-9a-f]{6})$/i.test((value || "").trim());
}

function toHexOrEmpty(value) {
  if (!value) return "";
  const normalized = value.trim().toUpperCase();
  return isValidHex(normalized) ? normalized : "";
}

function normalizePigmentCode(value) {
  return (value || "").trim().toUpperCase().replace(/\s+/g, "");
}

function basePigmentCode(value) {
  return normalizePigmentCode(value).split(":")[0];
}

function parsePigmentCodes(value) {
  const raw = Array.isArray(value) ? value : String(value || "").split(",");
  return raw
    .map((entry) => normalizePigmentCode(entry))
    .filter(Boolean);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function getPaintLabel(paint) {
  return paint.color_name || paint.name || "Untitled paint";
}

function getPaintProxy(pigmentCodes) {
  const exact = STARTER_PAINTS.find((paint) => paint.pigment_codes.some((code) => pigmentCodes.includes(code)));
  if (exact) {
    return { paint: exact, matchClass: "same_pigment_code" };
  }

  const family = STARTER_PAINTS.find((paint) => paint.pigment_codes.some((code) => pigmentCodes.some((candidate) => basePigmentCode(candidate) === basePigmentCode(code))));
  if (family) {
    return { paint: family, matchClass: "same_family" };
  }

  return null;
}

function normalizePaintProduct(paint, index = 0, source = "inventory") {
  const colorName = String(paint.color_name || paint.name || "").trim();
  const pigmentCodes = parsePigmentCodes(paint.pigment_codes);
  const explicitHex = toHexOrEmpty(paint.approx_srgb_hex);
  const proxy = explicitHex ? null : getPaintProxy(pigmentCodes);
  const proxyHex = proxy?.paint?.approx_srgb_hex || "";
  const approxHex = explicitHex || proxyHex;
  const modelSource = explicitHex ? (source === "starter" ? "starter_demo" : "inventory_swatch") : (proxy ? `proxy_${proxy.matchClass}` : "missing_proxy");
  const rgb = approxHex ? hexToRgb(approxHex) : null;

  return {
    id: paint.id || `${source}-paint-${index + 1}`,
    brand: String(paint.brand || "").trim() || (source === "starter" ? "Williamsburg" : "Unspecified"),
    line: String(paint.line || "").trim(),
    color_name: colorName,
    name: colorName,
    pigment_codes: pigmentCodes,
    opacity_label: String(paint.opacity_label || "unverified").trim() || "unverified",
    lightfastness_label: String(paint.lightfastness_label || "").trim(),
    user_swatch_hex: explicitHex,
    approx_srgb_hex: approxHex,
    rgb,
    model_source: modelSource,
    substitution_proxy: proxy,
    is_multi_pigment: pigmentCodes.length > 1,
  };
}

function createStarterPalette() {
  return STARTER_PAINTS.map((paint, index) => normalizePaintProduct(paint, index, "starter"));
}

const STARTER_PALETTE = createStarterPalette();

function labToSchema(lab) {
  return {
    L: Number(lab.l.toFixed(2)),
    a: Number(lab.a.toFixed(2)),
    b: Number(lab.b.toFixed(2)),
  };
}

function loadOwnedPaints() {
  try {
    const raw = window.localStorage.getItem(INVENTORY_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((paint, index) => normalizePaintProduct(paint, index, "inventory"))
      .filter((paint) => paint.color_name && paint.pigment_codes.length);
  } catch (error) {
    return [];
  }
}

function serializeOwnedPaints(paints) {
  return paints.map((paint) => ({
    brand: paint.brand,
    color_name: paint.color_name,
    pigment_codes: [...paint.pigment_codes],
    opacity_label: paint.opacity_label,
    lightfastness_label: paint.lightfastness_label || "",
    approx_srgb_hex: paint.user_swatch_hex || "",
    line: paint.line || "",
  }));
}

function persistOwnedPaints(paints) {
  try {
    window.localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(serializeOwnedPaints(paints)));
  } catch (error) {
    // Ignore storage failures so the app can continue in-memory.
  }
}

const state = {
  image: null,
  colors: [],
  swatches: [],
  dragId: null,
  dragLens: null,
  dragLensHideTimer: null,
  dragPointerType: null,
  animationFrame: null,
  sourceWidth: canvas.width,
  sourceHeight: canvas.height,
  processedReferenceCanvas: null,
  paletteSize: DEFAULT_PALETTE_SIZE,
  saveExport: {
    layout: EXPORT_LAYOUT_CURRENT,
    longestEdge: EXPORT_DEFAULT_LONGEST_EDGE,
    stripNodes: false,
  },
  dpr: window.devicePixelRatio || 1,
  isSettingsOpen: false,
  wasMobileLayout: isRealMobileLayout(),
  isPaletteDrawerOpen: false,
  scrollLockY: 0,
  scrollLocks: new Set(),
  hoveredColorId: null,
  paletteDragId: null,
  paletteDragPointerId: null,
  paletteDropIndex: null,
  paletteDragTop: 0,
  paletteDragLeft: 0,
  paletteDragWidth: 0,
  paletteGrabOffsetY: 0,
  paletteDrawerSettleTimer: null,
  recipeResults: [],
  recipeRequest: null,
  ownedPaints: loadOwnedPaints(),
  inventoryDraft: [],
};

const renderProfile = (() => {
  const ua = navigator.userAgent || "";
  const platform = navigator.platform || "";
  const maxTouchPoints = navigator.maxTouchPoints || 0;
  const isIOSDevice = /iPad|iPhone|iPod/.test(ua) || (platform === "MacIntel" && maxTouchPoints > 1);
  return {
    isIOSDevice,
    blurReductionFactor: isIOSDevice ? 0.38 : 0.62,
    blurRadiusBoost: isIOSDevice ? 1.08 : 1,
    grainAmount: isIOSDevice ? 14 : 18,
    minReducedWidth: isIOSDevice ? 20 : 14,
    minReducedHeight: isIOSDevice ? 28 : 20,
  };
})();

const DRAG_LENS = {
  size: 76,
  overlap: 8,
  edgePadding: 8,
  zoomSize: 70,
  gridSize: 5,
  cellSize: 14,
};

function mixPaints(recipe) {
  let r = 0;
  let g = 0;
  let b = 0;
  recipe.forEach((entry) => {
    const weight = entry.massPercent / 100;
    r += srgbToLinear(entry.paint.rgb.r) * weight;
    g += srgbToLinear(entry.paint.rgb.g) * weight;
    b += srgbToLinear(entry.paint.rgb.b) * weight;
  });
  return { r: linearToSrgb(r), g: linearToSrgb(g), b: linearToSrgb(b) };
}

function generateWeightSets(count, step, total = 100, prefix = []) {
  if (count === 1) return total > 0 ? [[...prefix, total]] : [];
  const weights = [];
  const minRemaining = (count - 1) * step;
  for (let weight = step; weight <= total - minRemaining; weight += step) {
    weights.push(...generateWeightSets(count - 1, step, total - weight, [...prefix, weight]));
  }
  return weights;
}

function getPaintCombinations(paints, size, start = 0, prefix = [], results = []) {
  if (prefix.length === size) {
    results.push(prefix);
    return results;
  }
  for (let index = start; index <= paints.length - (size - prefix.length); index += 1) {
    getPaintCombinations(paints, size, index + 1, [...prefix, paints[index]], results);
  }
  return results;
}

function getActivePaintInventory() {
  return state.ownedPaints.length ? state.ownedPaints : STARTER_PALETTE;
}

function describeInventorySource() {
  return state.ownedPaints.length ? "saved inventory" : "starter demo palette";
}

function selectCandidatePaints(targetLab, paints) {
  const eligible = paints.filter((paint) => paint.rgb);
  const ranked = eligible
    .map((paint) => {
      const referenceLab = rgbToLab(paint.rgb);
      return {
        paint,
        score: deltaE(targetLab, referenceLab)
          + (paint.is_multi_pigment ? 3.2 : 0)
          + (paint.model_source === "missing_proxy" ? 14 : 0)
          + (paint.model_source.startsWith("proxy_") ? 1.4 : 0),
      };
    })
    .sort((left, right) => left.score - right.score)
    .map((entry) => entry.paint);

  const candidates = ranked.slice(0, Math.min(8, ranked.length));
  const whitePaint = eligible.find((paint) => paint.pigment_codes.includes("PW6"));
  if (whitePaint && !candidates.some((paint) => paint.id === whitePaint.id)) {
    candidates.push(whitePaint);
  }
  return candidates.slice(0, Math.min(9, candidates.length));
}

function simplifyParts(percentages) {
  const parts = percentages.map((value) => Math.round(value / 10));
  const normalized = parts.every((value) => value > 0) ? parts : percentages.map((value) => value / 10);
  return normalized;
}

function buildMixingSteps(components, targetHex) {
  if (!components.length) {
    return [`Start with a swatch drawdown for ${targetHex} and compare it in daylight before committing to a larger mix.`];
  }

  const [base, ...rest] = components;
  const steps = [
    `Start with ${base.parts} part${base.parts === 1 ? "" : "s"} ${getPaintLabel(base)} as the base.`,
  ];

  rest.forEach((component) => {
    steps.push(`Fold in ${component.parts} part${component.parts === 1 ? "" : "s"} ${getPaintLabel(component)} and check the mix after each addition.`);
  });

  steps.push("Make a small test swatch, let it settle for a moment, then adjust warmer, cooler, lighter, or duller in small increments.");
  return steps;
}

function describeLabMiss(targetLab, mixedLab) {
  const notes = [];
  const targetChroma = Math.hypot(targetLab.a, targetLab.b);
  const mixedChroma = Math.hypot(mixedLab.a, mixedLab.b);
  const chromaDelta = targetChroma - mixedChroma;
  const lightnessDelta = targetLab.l - mixedLab.l;
  const warmthDelta = targetLab.a - mixedLab.a;
  const yellowBlueDelta = targetLab.b - mixedLab.b;

  if (chromaDelta > 8) {
    notes.push("the target is more saturated than this paint set can comfortably reach");
  }
  if (Math.abs(lightnessDelta) > 6) {
    notes.push(lightnessDelta > 0 ? "the closest mix still reads a little darker" : "the closest mix still reads a little lighter");
  }
  if (Math.abs(warmthDelta) > 5) {
    notes.push(warmthDelta > 0 ? "the hue wants a slightly warmer bias" : "the hue wants a slightly cooler bias");
  }
  if (Math.abs(yellowBlueDelta) > 5) {
    notes.push(yellowBlueDelta > 0 ? "it could use a touch more yellow" : "it could use a touch more blue");
  }

  if (!notes.length) {
    return "The palette gets close, but the nearest mix still sits just outside the target gamut.";
  }

  return `Nearest achievable mix: ${notes.join("; ")}.`;
}

function buildSubstitutions(recipeEntries) {
  return recipeEntries
    .filter((entry) => entry.paint.substitution_proxy)
    .map((entry) => ({
      missing_paint: getPaintLabel(entry.paint),
      recommended_substitute: {
        brand: entry.paint.substitution_proxy.paint.brand,
        color_name: entry.paint.substitution_proxy.paint.color_name,
        pigment_codes: [...entry.paint.substitution_proxy.paint.pigment_codes],
        reason: "Used as the optical proxy for recipe estimation.",
      },
      match_class: entry.paint.substitution_proxy.matchClass,
      notes: entry.paint.substitution_proxy.matchClass === "same_pigment_code"
        ? "Using a same-pigment-code starter paint as the swatch proxy."
        : "Using the closest starter pigment family as the swatch proxy.",
    }));
}

function formatIdealMixPart(paint, massPercent) {
  return `${getPaintLabel(paint)} (${paint.pigment_codes.join(", ")}) ${Math.round(massPercent)}%`;
}

function buildIdealMixSummary(targetLab, candidatePaints, recipeEntries) {
  const singlePaintMatch = candidatePaints
    .filter((paint) => paint.rgb)
    .map((paint) => ({
      paint,
      distance: deltaE(targetLab, rgbToLab(paint.rgb)),
    }))
    .sort((left, right) => left.distance - right.distance)[0];

  if (singlePaintMatch && singlePaintMatch.distance <= IDEAL_SINGLE_PAINT_DISTANCE_THRESHOLD) {
    return formatIdealMixPart(singlePaintMatch.paint, 100);
  }

  return recipeEntries.map((entry) => formatIdealMixPart(entry.paint, entry.massPercent)).join(" + ");
}

function estimatePaintRecipe(targetColor, request) {
  const targetLab = rgbToLab(targetColor);
  const candidatePaints = selectCandidatePaints(targetLab, request.owned_paints);
  let best = null;

  for (let pigmentCount = 1; pigmentCount <= Math.min(request.constraints.max_pigments, candidatePaints.length); pigmentCount += 1) {
    const combinations = getPaintCombinations(candidatePaints, pigmentCount);
    const weights = generateWeightSets(pigmentCount, 10);
    combinations.forEach((combo) => {
      weights.forEach((set) => {
        const recipe = combo.map((paint, index) => ({ paint, massPercent: set[index] }));
        const mixed = mixPaints(recipe);
        const mixedLab = rgbToLab(mixed);
        const distance = deltaE(targetLab, mixedLab);
        const penalty = recipe.reduce((sum, entry) => sum + (entry.paint.is_multi_pigment ? 1.4 : 0), 0)
          + recipe.reduce((sum, entry) => sum + (entry.paint.model_source.startsWith("proxy_") ? 0.55 : 0), 0)
          + (recipe.length - 1) * 0.18;
        const score = distance + penalty;
        if (!best || score < best.score) {
          best = { recipe, mixed, mixedLab, distance, score };
        }
      });
    });
  }

  if (!best) {
    return {
      target_hex: targetColor.hex,
      target_lab: labToSchema(targetLab),
      model_used: "heuristic_proxy",
      recipe: { components: [], mixing_steps: [] },
      quality: {
        delta_e_status: "not_computed_missing_data",
        delta_e00: null,
        metamerism_status: "not_computed_missing_spectra",
        metamerism_risk: "unknown",
        gamut_status: "unknown",
        gamut_note: "No paints with usable swatch data were available for this request.",
      },
      substitutions: [],
      warnings: ["No recipe could be estimated because the paint inventory does not include any usable swatch proxies."],
      display: {
        targetRgb: `RGB ${targetColor.r}, ${targetColor.g}, ${targetColor.b}`,
        sourceLabel: describeInventorySource(),
      },
    };
  }

  const massPercentages = best.recipe.map((entry) => entry.massPercent);
  const parts = simplifyParts(massPercentages);
  const components = best.recipe.map((entry, index) => ({
    brand: entry.paint.brand,
    color_name: entry.paint.color_name,
    pigment_codes: [...entry.paint.pigment_codes],
    role: index === 0 ? "base" : "adjustment",
    parts: parts[index],
    fraction_mass: Number((entry.massPercent / 100).toFixed(3)),
    mass_percent: entry.massPercent,
    scaled_amount: Number(((entry.massPercent / 100) * request.batch_size.value).toFixed(2)),
    scaled_unit: request.batch_size.unit,
    substitution_notes: entry.paint.model_source.startsWith("proxy_")
      ? `Estimated with ${entry.paint.substitution_proxy.paint.color_name} as a ${entry.paint.substitution_proxy.matchClass === "same_pigment_code" ? "same pigment code" : "same family"} proxy.`
      : "",
  }));
  const gamutStatus = best.distance <= 12 ? "in_gamut" : "nearest_achievable";
  const gamutNote = gamutStatus === "in_gamut" ? "This target appears achievable within the current proxy palette." : describeLabMiss(targetLab, best.mixedLab);
  const substitutions = buildSubstitutions(best.recipe);
  const idealMixSummary = buildIdealMixSummary(targetLab, candidatePaints, best.recipe);
  const warnings = [];

  if (!state.ownedPaints.length) {
    warnings.push("Using the Williamsburg starter demo palette because no saved inventory is active.");
  }
  if (best.recipe.some((entry) => entry.paint.is_multi_pigment)) {
    warnings.push("One or more paints in this mix are multi-pigment convenience colors, so the mixture may go muddy faster.");
  }
  if (best.recipe.some((entry) => entry.paint.model_source.startsWith("proxy_"))) {
    warnings.push("At least one paint was estimated with a starter-palette proxy because no explicit swatch hex was saved for that tube.");
  }

  return {
    target_hex: targetColor.hex,
    target_lab: labToSchema(targetLab),
    model_used: "heuristic_proxy",
    recipe: {
      components,
      mixing_steps: buildMixingSteps(components, targetColor.hex),
    },
    quality: {
      delta_e_status: "not_computed_missing_data",
      delta_e00: null,
      metamerism_status: "not_computed_missing_spectra",
      metamerism_risk: "unknown",
      gamut_status: gamutStatus,
      gamut_note: gamutNote,
    },
    substitutions,
    warnings,
    display: {
      targetRgb: `RGB ${targetColor.r}, ${targetColor.g}, ${targetColor.b}`,
      sourceLabel: describeInventorySource(),
      mixedRgb: `RGB ${best.mixed.r}, ${best.mixed.g}, ${best.mixed.b}`,
      mixedHex: rgbToHex(best.mixed.r, best.mixed.g, best.mixed.b),
      swatchColor: targetColor.hex,
      idealMixSummary,
    },
  };
}

function buildRecipeRequest(colors) {
  return {
    targets: colors.map((color) => color.hex),
    medium: "oil",
    batch_size: { ...DEFAULT_RECIPE_BATCH_SIZE },
    owned_paints: getActivePaintInventory(),
    constraints: { ...DEFAULT_RECIPE_CONSTRAINTS },
    output_format: "both",
  };
}

function formatPercent(value) {
  return `${Math.round(value)}%`;
}

function clearDragLensHideTimer() {
  if (state.dragLensHideTimer) {
    clearTimeout(state.dragLensHideTimer);
    state.dragLensHideTimer = null;
  }
}

function createDragLens() {
  clearDragLensHideTimer();
  if (state.dragLens?.element?.isConnected) {
    state.dragLens.element.remove();
  }

  const lens = document.createElement("div");
  lens.className = "swatch-lens";
  lens.dataset.placement = "above";
  lens.setAttribute("aria-hidden", "true");

  const shell = document.createElement("div");
  shell.className = "swatch-lens-shell";
  shell.style.setProperty("--swatch-color", "#F2EFE8");

  const zoom = document.createElement("div");
  zoom.className = "swatch-lens-zoom";

  const zoomCanvas = document.createElement("canvas");
  zoomCanvas.className = "swatch-lens-canvas";
  zoomCanvas.width = DRAG_LENS.zoomSize;
  zoomCanvas.height = DRAG_LENS.zoomSize;
  zoom.appendChild(zoomCanvas);
  shell.appendChild(zoom);
  lens.append(shell);
  swatchLayer.appendChild(lens);

  const zoomCtx = zoomCanvas.getContext("2d", { willReadFrequently: true });
  if (zoomCtx) {
    zoomCtx.imageSmoothingEnabled = false;
  }

  requestAnimationFrame(() => lens.classList.add("is-visible"));

  state.dragLens = { element: lens, shell, canvas: zoomCanvas, ctx: zoomCtx };
  return state.dragLens;
}

function destroyDragLens(immediate = false) {
  clearDragLensHideTimer();
  if (!state.dragLens) return;

  const { element } = state.dragLens;
  state.dragLens = null;

  if (immediate || !element?.isConnected) {
    element?.remove();
    return;
  }

  element.classList.remove("is-visible");
  state.dragLensHideTimer = setTimeout(() => {
    element.remove();
    state.dragLensHideTimer = null;
  }, 180);
}

function positionDragLens(swatch) {
  if (!state.dragLens) return;

  const pointX = swatch.x;
  const pointY = swatch.y;
  const availableHeight = canvasWrap.clientHeight || canvasWrap.getBoundingClientRect().height;
  const lensSize = DRAG_LENS.size;
  const edgePadding = DRAG_LENS.edgePadding;

  let placement = "above";
  if (pointY < (lensSize - DRAG_LENS.overlap + edgePadding)) {
    placement = "below";
  }

  if (placement === "below" && (pointY + lensSize - DRAG_LENS.overlap > availableHeight - edgePadding)) {
    placement = "above";
  }

  state.dragLens.element.dataset.placement = placement;
  state.dragLens.element.style.left = `${pointX}px`;
  state.dragLens.element.style.top = `${pointY}px`;
}

function sampleLensNeighborhood(centerX, centerY, gridSize) {
  const half = Math.floor(gridSize / 2);
  const pixelX = clamp(Math.round(centerX * state.dpr), 0, canvas.width - 1);
  const pixelY = clamp(Math.round(centerY * state.dpr), 0, canvas.height - 1);
  const minX = clamp(pixelX - half, 0, canvas.width - 1);
  const maxX = clamp(pixelX + half, 0, canvas.width - 1);
  const minY = clamp(pixelY - half, 0, canvas.height - 1);
  const maxY = clamp(pixelY + half, 0, canvas.height - 1);
  const sourceWidth = maxX - minX + 1;
  const sourceHeight = maxY - minY + 1;
  const source = ctx.getImageData(minX, minY, sourceWidth, sourceHeight).data;
  const samples = new Uint8ClampedArray(gridSize * gridSize * 4);

  for (let gy = 0; gy < gridSize; gy += 1) {
    for (let gx = 0; gx < gridSize; gx += 1) {
      const sampleX = clamp(pixelX + gx - half, 0, canvas.width - 1);
      const sampleY = clamp(pixelY + gy - half, 0, canvas.height - 1);
      const sourceIndex = (((sampleY - minY) * sourceWidth) + (sampleX - minX)) * 4;
      const targetIndex = ((gy * gridSize) + gx) * 4;
      samples[targetIndex] = source[sourceIndex];
      samples[targetIndex + 1] = source[sourceIndex + 1];
      samples[targetIndex + 2] = source[sourceIndex + 2];
      samples[targetIndex + 3] = source[sourceIndex + 3];
    }
  }

  return samples;
}

function renderDragLens(swatch) {
  if (!state.dragLens?.ctx) return;

  const { ctx: lensCtx } = state.dragLens;
  const { gridSize, cellSize, zoomSize } = DRAG_LENS;
  const samples = sampleLensNeighborhood(swatch.targetX, swatch.targetY, gridSize);
  lensCtx.clearRect(0, 0, zoomSize, zoomSize);

  for (let gy = 0; gy < gridSize; gy += 1) {
    for (let gx = 0; gx < gridSize; gx += 1) {
      const index = ((gy * gridSize) + gx) * 4;
      const r = samples[index];
      const g = samples[index + 1];
      const b = samples[index + 2];
      const a = samples[index + 3] / 255;
      lensCtx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a.toFixed(3)})`;
      lensCtx.fillRect(gx * cellSize, gy * cellSize, cellSize, cellSize);
    }
  }

  const center = Math.floor(gridSize / 2);
  const centerIndex = ((center * gridSize) + center) * 4;
  const centerR = samples[centerIndex];
  const centerG = samples[centerIndex + 1];
  const centerB = samples[centerIndex + 2];
  const reticleColor = luminance(centerR, centerG, centerB) > 0.62 ? "rgba(10, 10, 10, 0.98)" : "rgba(255, 255, 255, 0.98)";

  lensCtx.save();
  lensCtx.strokeStyle = reticleColor;
  lensCtx.lineWidth = 2;
  lensCtx.strokeRect((center * cellSize) + 1, (center * cellSize) + 1, cellSize - 2, cellSize - 2);
  lensCtx.restore();
}

function refreshStageSize() {
  if (!state.image) {
    root.dataset.paletteHasImage = "false";
    state.processedReferenceCanvas = null;
    root.style.removeProperty("--ambient-image");
    root.dataset.ambientImage = "false";
    canvasStage.style.removeProperty("--image-ratio");
    canvasStage.style.removeProperty("--frame-width");
    canvasStage.style.removeProperty("--frame-height");
    canvasWrap.style.removeProperty("--image-ratio");
    return;
  }

  root.dataset.paletteHasImage = "true";
  const imageRatio = state.image.width / state.image.height;
  const ratioValue = `${state.image.width} / ${state.image.height}`;
  canvasStage.style.setProperty("--image-ratio", ratioValue);
  canvasWrap.style.setProperty("--image-ratio", ratioValue);

  if (isRealMobileLayout()) {
    const stageStyles = window.getComputedStyle(canvasStage);
    const gap = parseFloat(stageStyles.rowGap || stageStyles.gap || "0") || 0;
    const paddingTop = parseFloat(stageStyles.paddingTop || "0") || 0;
    const paddingBottom = parseFloat(stageStyles.paddingBottom || "0") || 0;
    const paddingLeft = parseFloat(stageStyles.paddingLeft || "0") || 0;
    const paddingRight = parseFloat(stageStyles.paddingRight || "0") || 0;
    const stageHeight = canvasStage.clientHeight || canvasStage.getBoundingClientRect().height || 0;
    const stageWidth = canvasStage.clientWidth || canvasStage.getBoundingClientRect().width || 0;
    const warningVisible = !importWarning.classList.contains("hidden");
    const fixedHeight = controlHud.getBoundingClientRect().height + (warningVisible ? importWarning.getBoundingClientRect().height : 0);
    const gapCount = warningVisible ? 2 : 1;
    const availableHeight = Math.max(
      220,
      Math.round(stageHeight - paddingTop - paddingBottom - fixedHeight - (gap * gapCount)),
    );
    const availableWidth = Math.max(180, Math.round(stageWidth - paddingLeft - paddingRight));

    let frameWidth = availableWidth;
    let frameHeight = Math.round(frameWidth / imageRatio);
    if (frameHeight > availableHeight) {
      frameHeight = availableHeight;
      frameWidth = Math.round(frameHeight * imageRatio);
    }

    canvasStage.style.setProperty("--frame-width", `${Math.max(180, frameWidth)}px`);
    canvasStage.style.setProperty("--frame-height", `${Math.max(220, frameHeight)}px`);
    return;
  }

  const frameHeight = Math.max(320, Math.round(canvasWrap.clientHeight || canvasWrap.getBoundingClientRect().height || 0));
  const maxWidth = Math.max(280, Math.round(window.innerWidth - getPaletteFrameClearance()));
  const frameWidth = Math.min(Math.round(frameHeight * imageRatio), maxWidth);
  canvasStage.style.setProperty("--frame-width", `${frameWidth}px`);
  canvasStage.style.removeProperty("--frame-height");
}

function updateAmbientBackdrop() {
  if (!state.image || !state.processedReferenceCanvas) {
    root.style.removeProperty("--ambient-image");
    root.dataset.ambientImage = "false";
    return;
  }

  const sourceCanvas = state.processedReferenceCanvas;
  const longestEdge = Math.max(sourceCanvas.width, sourceCanvas.height, 1);
  const scale = Math.min(1, 120 / longestEdge);
  const backdropCanvas = document.createElement("canvas");
  backdropCanvas.width = Math.max(24, Math.round(sourceCanvas.width * scale));
  backdropCanvas.height = Math.max(24, Math.round(sourceCanvas.height * scale));
  const backdropCtx = backdropCanvas.getContext("2d");
  backdropCtx.imageSmoothingEnabled = true;
  backdropCtx.imageSmoothingQuality = "high";
  backdropCtx.drawImage(sourceCanvas, 0, 0, backdropCanvas.width, backdropCanvas.height);
  root.style.setProperty("--ambient-image", `url("${backdropCanvas.toDataURL("image/jpeg", 0.68)}")`);
  root.dataset.ambientImage = "true";
}

function renderPalettePreview() {
  palettePreviewList.innerHTML = "";
  palettePreviewList.style.removeProperty("--preview-count");
  if (!state.colors.length) {
    palettePreviewList.style.setProperty("--preview-count", `${PALETTE_PREVIEW_PLACEHOLDER_COUNT}`);
    Array.from({ length: PALETTE_PREVIEW_PLACEHOLDER_COUNT }).forEach((_, index) => {
      const tile = document.createElement("span");
      tile.className = "palette-preview-tile palette-preview-tile--placeholder";
      tile.style.setProperty("--placeholder-index", `${index}`);
      tile.setAttribute("aria-hidden", "true");
      palettePreviewList.appendChild(tile);
    });
    return;
  }

  palettePreviewList.style.setProperty("--preview-count", `${state.colors.length}`);
  state.colors.forEach((color) => {
    const tile = document.createElement("span");
    tile.className = "palette-preview-tile";
    tile.style.background = `linear-gradient(135deg, ${color.hex}, color-mix(in srgb, ${color.hex} 60%, #17191c))`;
    tile.setAttribute("aria-hidden", "true");
    palettePreviewList.appendChild(tile);
  });
}

function updatePaletteLabel() {
  paletteSizeLabels.forEach((label) => {
    label.textContent = `Palette: ${state.paletteSize}`;
  });
  paletteMinusButtons.forEach((button) => {
    button.disabled = state.paletteSize <= PALETTE_MIN;
  });
  palettePlusButtons.forEach((button) => {
    button.disabled = state.paletteSize >= PALETTE_MAX;
  });
  paletteDrawerOpen.disabled = !state.colors.length;
  palettePreviewStatus.textContent = state.colors.length
    ? `${state.colors.length} ${state.colors.length === 1 ? "colour" : "colours"} ready`
    : "Upload an image to build a palette.";
}

function syncLayoutState() {
  const mobileLayout = isRealMobileLayout();
  if (mobileLayout !== state.wasMobileLayout) {
    state.wasMobileLayout = mobileLayout;
    state.isSettingsOpen = false;
  }

  if (!mobileLayout) {
    state.isSettingsOpen = false;
  }

  if (!mobileLayout || !state.colors.length) {
    state.isPaletteDrawerOpen = false;
  }

  root.dataset.mobileLayout = mobileLayout ? "true" : "false";
  root.dataset.settingsOpen = mobileLayout && state.isSettingsOpen ? "true" : "false";
  root.dataset.paletteDrawerOpen = mobileLayout && state.isPaletteDrawerOpen ? "true" : "false";

  settingsToggle.hidden = !mobileLayout;
  settingsToggle.setAttribute("aria-expanded", String(mobileLayout && state.isSettingsOpen));
  hudSettingsPanel.hidden = mobileLayout ? !state.isSettingsOpen : false;
  hudSettingsPanel.setAttribute("aria-hidden", String(mobileLayout ? !state.isSettingsOpen : false));
  mobilePaletteRail.hidden = !mobileLayout || state.isPaletteDrawerOpen;
  paletteDrawerOpen.hidden = !mobileLayout || state.isPaletteDrawerOpen;
  paletteDrawerOpen.setAttribute("aria-expanded", mobileLayout && state.isPaletteDrawerOpen ? "true" : "false");
  paletteDrawerSummary.hidden = !mobileLayout || state.isPaletteDrawerOpen;
  paletteDrawerSummary.setAttribute("aria-hidden", String(!mobileLayout || state.isPaletteDrawerOpen));
  paletteDrawerClose.hidden = !mobileLayout || !state.isPaletteDrawerOpen;
  paletteDrawerSheet.hidden = mobileLayout ? !state.isPaletteDrawerOpen : false;
  paletteDrawerSheet.setAttribute("aria-hidden", mobileLayout ? String(!state.isPaletteDrawerOpen) : "false");

  if (mobileLayout && state.isPaletteDrawerOpen) {
    lockPageScroll(SCROLL_LOCK_PALETTE_DRAWER);
  } else {
    unlockPageScroll(SCROLL_LOCK_PALETTE_DRAWER);
  }

  refreshStageSize();
}

function clearPaletteDrawerSettleTimer() {
  if (!state.paletteDrawerSettleTimer) return;
  clearTimeout(state.paletteDrawerSettleTimer);
  state.paletteDrawerSettleTimer = null;
}

function schedulePaletteDrawerSettleRender() {
  clearPaletteDrawerSettleTimer();
  state.paletteDrawerSettleTimer = setTimeout(() => {
    state.paletteDrawerSettleTimer = null;
    if (!state.isPaletteDrawerOpen || !isRealMobileLayout()) {
      return;
    }
    renderPalette();
  }, PALETTE_DRAWER_SETTLE_DELAY_MS);
}

function openPaletteDrawer() {
  if (!isRealMobileLayout() || !state.colors.length || state.isPaletteDrawerOpen) {
    return;
  }

  state.isPaletteDrawerOpen = true;
  syncLayoutState();
  schedulePaletteDrawerSettleRender();
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      renderPalette();
      paletteDrawerClose.focus({ preventScroll: true });
    });
  });
}

function closePaletteDrawer({ restoreFocus = true } = {}) {
  clearPaletteDrawerSettleTimer();
  if (!state.isPaletteDrawerOpen) {
    syncLayoutState();
    return;
  }

  state.isPaletteDrawerOpen = false;
  syncLayoutState();
  if (restoreFocus) {
    requestAnimationFrame(() => {
      paletteDrawerOpen.focus({ preventScroll: true });
    });
  }
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

function clonePaintCollection(paints) {
  return paints.map((paint, index) => normalizePaintProduct(serializeOwnedPaints([paint])[0], index, "inventory"));
}

function resetInventoryForm() {
  inventoryForm.reset();
  inventoryOpacity.value = "opaque";
  inventoryFeedback.textContent = "";
}

function setInventoryFeedback(message, isError = false) {
  inventoryFeedback.textContent = message;
  inventoryFeedback.dataset.state = isError ? "error" : "success";
}

function renderInventoryList() {
  const paints = state.inventoryDraft;
  inventoryCount.textContent = `${paints.length} paint${paints.length === 1 ? "" : "s"} saved`;
  if (!paints.length) {
    inventoryList.innerHTML = `<p class="inventory-empty">No owned paints saved yet. Save a few paints or keep using the starter palette.</p>`;
    return;
  }

  inventoryList.innerHTML = paints.map((paint, index) => {
    const swatch = paint.approx_srgb_hex || "#2A2F36";
    const proxyTag = paint.model_source.startsWith("proxy_") ? `<span class="recipe-chip">Proxy ${escapeHtml(paint.substitution_proxy.paint.pigment_codes[0])}</span>` : "";
    return `
      <article class="inventory-item">
        <div class="inventory-swatch" style="background:${swatch}"></div>
        <div class="inventory-copy">
          <strong>${escapeHtml(getPaintLabel(paint))}</strong>
          <span>${escapeHtml(paint.brand)}${paint.opacity_label ? ` - ${escapeHtml(paint.opacity_label)}` : ""}</span>
          <span>${escapeHtml(paint.pigment_codes.join(", "))}${proxyTag ? ` - ${proxyTag}` : ""}</span>
        </div>
        <button class="inventory-remove" type="button" data-index="${index}" aria-label="Remove ${escapeHtml(getPaintLabel(paint))}">Remove</button>
      </article>`;
  }).join("");
}

function openInventoryModal() {
  state.inventoryDraft = clonePaintCollection(state.ownedPaints);
  renderInventoryList();
  resetInventoryForm();
  inventoryModal.classList.remove("hidden");
  inventoryModal.setAttribute("aria-hidden", "false");
}

function closeInventoryModal() {
  inventoryModal.classList.add("hidden");
  inventoryModal.setAttribute("aria-hidden", "true");
}

function validateInventoryFormDraft() {
  const colorName = inventoryColorName.value.trim();
  const pigmentCodes = parsePigmentCodes(inventoryPigmentCodes.value);
  const hex = toHexOrEmpty(inventoryHex.value);
  if (!colorName) {
    return { ok: false, message: "Add a color name before saving this paint." };
  }
  if (!pigmentCodes.length) {
    return { ok: false, message: "Pigment codes are required. Add values like PB15:3 or PR254." };
  }
  if (inventoryHex.value.trim() && !hex) {
    return { ok: false, message: "Swatch hex must use the #RRGGBB format." };
  }
  return { ok: true, colorName, pigmentCodes, hex };
}

function addInventoryPaint(event) {
  event.preventDefault();
  const validation = validateInventoryFormDraft();
  if (!validation.ok) {
    setInventoryFeedback(validation.message, true);
    return;
  }

  const normalized = normalizePaintProduct({
    brand: inventoryBrand.value.trim(),
    color_name: validation.colorName,
    pigment_codes: validation.pigmentCodes,
    opacity_label: inventoryOpacity.value,
    lightfastness_label: inventoryLightfastness.value.trim(),
    approx_srgb_hex: validation.hex,
  }, state.inventoryDraft.length, "inventory");
  state.inventoryDraft.push(normalized);
  renderInventoryList();
  resetInventoryForm();
  setInventoryFeedback(`${normalized.color_name} added. Save inventory to use it for recipes.`);
  inventoryBrand.focus({ preventScroll: true });
}

function saveInventoryDraft() {
  state.ownedPaints = clonePaintCollection(state.inventoryDraft);
  persistOwnedPaints(state.ownedPaints);
  closeInventoryModal();
  state.recipeResults = [];
  renderRecipe();
  showImportWarning("Paint setup saved", state.ownedPaints.length ? `Recipes will now use your saved inventory (${state.ownedPaints.length} paints).` : "No paints were saved, so recipes will use the starter palette.");
}

function useStarterPalette() {
  state.inventoryDraft = clonePaintCollection(STARTER_PALETTE);
  state.ownedPaints = clonePaintCollection(STARTER_PALETTE);
  persistOwnedPaints(state.ownedPaints);
  renderInventoryList();
  resetInventoryForm();
  closeInventoryModal();
  state.recipeResults = [];
  renderRecipe();
  showImportWarning("Starter palette saved", "The Williamsburg starter palette has been loaded into your saved paints and will be used for recipes.");
}

function handleInventoryModalClick(event) {
  const removeButton = event.target.closest("[data-index]");
  if (removeButton && inventoryList.contains(removeButton)) {
    const index = Number(removeButton.dataset.index);
    if (Number.isInteger(index)) {
      state.inventoryDraft.splice(index, 1);
      renderInventoryList();
      setInventoryFeedback("Paint removed. Save inventory to apply the change.");
    }
    return;
  }

  if (event.target.closest('[data-action="inventory-close"]')) {
    event.preventDefault();
    closeInventoryModal();
    return;
  }

  if (event.target.closest('[data-action="inventory-reset"]')) {
    event.preventDefault();
    useStarterPalette();
    return;
  }

  if (event.target.closest('[data-action="inventory-save"]')) {
    event.preventDefault();
    saveInventoryDraft();
    return;
  }

  if (event.target === inventoryModal) {
    closeInventoryModal();
  }
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
  if (!state.recipeResults.length) {
    showRecipeMessage("Upload an image first to generate paint recipes for the palette.");
    return;
  }

  const width = 920;
  const padding = 24;
  const titleHeight = 48;
  const cardGap = 12;
  const cardWidth = width - (padding * 2);
  const measureCanvas = document.createElement("canvas");
  const measureCtx = measureCanvas.getContext("2d");
  measureCtx.font = '500 16px "Space Grotesk", sans-serif';

  function getCardLines(entry) {
    const lines = [
      entry.display.targetRgb,
      `LAB ${entry.target_lab.L.toFixed(1)}, ${entry.target_lab.a.toFixed(1)}, ${entry.target_lab.b.toFixed(1)}`,
      `Model ${entry.model_used.replaceAll("_", " ")}`,
      `Using ${entry.display.sourceLabel}`,
      `Gamut ${entry.quality.gamut_status.replaceAll("_", " ")}`,
      `Metamerism ${entry.quality.metamerism_status === "not_computed_missing_spectra" ? "not computed" : entry.quality.metamerism_risk}`,
    ];

    if (entry.quality.gamut_note) {
      lines.push(entry.quality.gamut_note);
    }

    if (entry.display.idealMixSummary) {
      lines.push(`Ideal mix ${entry.display.idealMixSummary}`);
    }

    entry.recipe.components.forEach((component) => {
      lines.push(`${getPaintLabel(component)} - ${component.mass_percent}% - ${component.pigment_codes.join(", ")}`);
    });

    entry.recipe.mixing_steps.forEach((step, index) => {
      lines.push(`${index + 1}. ${step}`);
    });

    entry.warnings.forEach((warning) => {
      lines.push(`Warning: ${warning}`);
    });

    return lines.flatMap((line) => wrapRecipeText(measureCtx, line, cardWidth - 44));
  }

  const cardHeights = state.recipeResults.map((entry) => 152 + (getCardLines(entry).length * 20));
  const height = padding + titleHeight + 16 + cardHeights.reduce((sum, value) => sum + value, 0) + (Math.max(0, state.recipeResults.length - 1) * cardGap) + padding;
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
  state.recipeResults.forEach((entry, index) => {
    const cardHeight = cardHeights[index];
    drawRoundedRect(exportCtx, padding, y, cardWidth, cardHeight, 14, "#191d22");

    const swatch = entry.display.swatchColor || entry.target_hex;
    const swatchRgb = hexToRgb(swatch);
    const headerTextColor = luminance(swatchRgb.r, swatchRgb.g, swatchRgb.b) > 0.62 ? "#15171a" : "#f2efe8";
    drawRoundedRect(exportCtx, padding + 12, y + 12, cardWidth - 24, 40, 10, swatch);
    exportCtx.fillStyle = headerTextColor;
    exportCtx.font = '700 18px "Space Grotesk", sans-serif';
    exportCtx.fillText(entry.target_hex, padding + 28, y + 38);

    exportCtx.fillStyle = "#bcc0c7";
    exportCtx.font = '600 16px "Space Grotesk", sans-serif';
    exportCtx.fillText(entry.display.targetRgb, padding + 12, y + 76);
    exportCtx.fillText(`LAB ${entry.target_lab.L.toFixed(1)}, ${entry.target_lab.a.toFixed(1)}, ${entry.target_lab.b.toFixed(1)}`, padding + 12, y + 102);
    exportCtx.fillText(`Using ${entry.display.sourceLabel}`, padding + 12, y + 128);

    const lines = getCardLines(entry);
    exportCtx.fillStyle = "#91969d";
    exportCtx.font = '500 16px "Space Grotesk", sans-serif';
    lines.forEach((line, lineIndex) => {
      exportCtx.fillText(line, padding + 12, y + 160 + (lineIndex * 20));
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
  if (!state.recipeResults.length) {
    closeRecipeModal();
    recipeContent.innerHTML = "";
    return;
  }
  recipeModal.classList.remove("hidden");
  recipeModal.setAttribute("aria-hidden", "false");
  recipeContent.innerHTML = `<div class="recipe-stack">${state.recipeResults.map((entry) => `
    <section class="recipe-card" style="--recipe-color:${escapeHtml(entry.display.swatchColor || entry.target_hex)}">
      <div class="recipe-card-head" style="background:${escapeHtml(entry.display.swatchColor || entry.target_hex)};color:${luminance(hexToRgb(entry.display.swatchColor || entry.target_hex).r, hexToRgb(entry.display.swatchColor || entry.target_hex).g, hexToRgb(entry.display.swatchColor || entry.target_hex).b) > 0.62 ? "#15171a" : "#f2efe8"};"><strong>${escapeHtml(entry.target_hex)}</strong></div>
      <div class="recipe-meta">
        <span>${escapeHtml(entry.display.targetRgb)}</span>
        <span>LAB ${entry.target_lab.L.toFixed(1)}, ${entry.target_lab.a.toFixed(1)}, ${entry.target_lab.b.toFixed(1)}</span>
        <span class="recipe-confidence">Using ${escapeHtml(entry.display.sourceLabel)}</span>
      </div>
      <div class="recipe-badge-row">
        <span class="recipe-chip">Model ${escapeHtml(entry.model_used.replaceAll("_", " "))}</span>
        <span class="recipe-chip">Gamut ${escapeHtml(entry.quality.gamut_status.replaceAll("_", " "))}</span>
        <span class="recipe-chip">${entry.quality.metamerism_status === "not_computed_missing_spectra" ? "Metamerism not computed" : `Metamerism ${escapeHtml(entry.quality.metamerism_risk)}`}</span>
      </div>
      <ul class="recipe-list">${entry.recipe.components.map((item) => `<li><span><strong>${escapeHtml(getPaintLabel(item))}</strong><small>${escapeHtml(item.brand)} - ${escapeHtml(item.pigment_codes.join(", "))}</small></span><strong>${item.mass_percent}%</strong></li>`).join("")}</ul>
      <div class="recipe-section">
        <strong>Mixing steps</strong>
        <ol class="recipe-steps">${entry.recipe.mixing_steps.map((step) => `<li>${escapeHtml(step)}</li>`).join("")}</ol>
      </div>
      ${entry.quality.gamut_note ? `<p class="recipe-note">${escapeHtml(entry.quality.gamut_note)}</p>` : ""}
      ${entry.substitutions.length ? `<div class="recipe-section"><strong>Substitutions</strong><ul class="recipe-inline-list">${entry.substitutions.map((item) => `<li>${escapeHtml(item.missing_paint)} -> ${escapeHtml(item.recommended_substitute.color_name)} (${escapeHtml(item.match_class.replaceAll("_", " "))})</li>`).join("")}</ul></div>` : ""}
      ${entry.warnings.length ? `<div class="recipe-section"><strong>Warnings</strong><ul class="recipe-inline-list">${entry.warnings.map((warning) => `<li>${escapeHtml(warning)}</li>`).join("")}</ul></div>` : ""}
      ${entry.display.idealMixSummary ? `<div class="recipe-ideal-banner"><strong>Ideal mix</strong><span>${escapeHtml(entry.display.idealMixSummary)}</span></div>` : ""}
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
  const sourceCanvas = state.processedReferenceCanvas || canvas;
  const longestEdge = Math.max(sourceCanvas.width || 0, sourceCanvas.height || 0, 1);
  const sampleScale = Math.min(1, PERCENTAGE_SAMPLE_LONG_EDGE / longestEdge);
  const sampleWidth = Math.max(1, Math.round((sourceCanvas.width || SAMPLE_GRID) * sampleScale));
  const sampleHeight = Math.max(1, Math.round((sourceCanvas.height || SAMPLE_GRID) * sampleScale));
  const sampleCanvas = document.createElement("canvas");
  sampleCanvas.width = sampleWidth;
  sampleCanvas.height = sampleHeight;
  const sampleCtx = sampleCanvas.getContext("2d", { willReadFrequently: true });
  sampleCtx.imageSmoothingEnabled = true;
  sampleCtx.imageSmoothingQuality = "high";
  sampleCtx.drawImage(sourceCanvas, 0, 0, sampleWidth, sampleHeight);
  const { data } = sampleCtx.getImageData(0, 0, sampleWidth, sampleHeight);
  const paletteLabs = state.colors.map((color) => rgbToLab(color));
  const counts = new Array(state.colors.length).fill(0);
  let total = 0;
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] < 180) continue;
    const sampleLab = rgbToLab({ r: data[i], g: data[i + 1], b: data[i + 2] });
    let bestIndex = 0;
    let bestDistance = Number.POSITIVE_INFINITY;
    paletteLabs.forEach((paletteLab, index) => {
      const distance = labDistanceSquared(sampleLab, paletteLab);
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
  const blurReduction = Math.max(1, blurValue * renderProfile.blurReductionFactor);
  const reducedWidth = Math.max(renderProfile.minReducedWidth, Math.round(displayWidth / blurReduction));
  const reducedHeight = Math.max(renderProfile.minReducedHeight, Math.round(displayHeight / blurReduction));
  const effectiveBlurValue = blurValue * renderProfile.blurRadiusBoost;
  downscaleCanvas.width = reducedWidth;
  downscaleCanvas.height = reducedHeight;
  downscaleCtx.imageSmoothingEnabled = true;
  downscaleCtx.imageSmoothingQuality = "high";
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
  const processedCanvas = document.createElement("canvas");
  processedCanvas.width = displayWidth;
  processedCanvas.height = displayHeight;
  const processedCtx = processedCanvas.getContext("2d", { willReadFrequently: true });
  processedCtx.imageSmoothingEnabled = true;
  processedCtx.imageSmoothingQuality = "high";
  processedCtx.filter = `blur(${effectiveBlurValue}px) saturate(118%) contrast(104%)`;
  processedCtx.drawImage(downscaleCanvas, 0, 0, displayWidth, displayHeight);
  state.processedReferenceCanvas = processedCanvas;
  ctx.clearRect(0, 0, displayWidth, displayHeight);
  ctx.save();
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(processedCanvas, 0, 0, displayWidth, displayHeight);
  ctx.restore();
  const imageData = ctx.getImageData(0, 0, displayWidth, displayHeight);
  for (let i = 0; i < imageData.data.length; i += 4) {
    const grain = (Math.random() - 0.5) * renderProfile.grainAmount;
    imageData.data[i] = clamp(imageData.data[i] + grain, 0, 255);
    imageData.data[i + 1] = clamp(imageData.data[i + 1] + grain, 0, 255);
    imageData.data[i + 2] = clamp(imageData.data[i + 2] + grain, 0, 255);
  }
  ctx.putImageData(imageData, 0, 0);
  updateAmbientBackdrop();
}

function sampleCanvasColor(x, y) {
  const pixelX = clamp(Math.round(x * state.dpr), 0, canvas.width - 1);
  const pixelY = clamp(Math.round(y * state.dpr), 0, canvas.height - 1);
  const pixel = ctx.getImageData(pixelX, pixelY, 1, 1).data;
  return { r: pixel[0], g: pixel[1], b: pixel[2], hex: rgbToHex(pixel[0], pixel[1], pixel[2]) };
}

function getScaledPaletteHeights(colors, availableHeight, gap = PALETTE_GAP, minHeight = PALETTE_SINGLE_MIN_HEIGHT) {
  if (!colors.length) return [];
  const totalPercent = colors.reduce((sum, color) => sum + color.percent, 0) || 1;
  const totalGaps = Math.max(0, colors.length - 1) * gap;
  const usableHeight = Math.max(minHeight * colors.length, availableHeight - totalGaps);
  const scaled = colors.map((color) => Math.max(minHeight, (color.percent / totalPercent) * usableHeight));
  const heightSum = scaled.reduce((sum, value) => sum + value, 0);
  const scale = heightSum > 0 ? usableHeight / heightSum : 1;
  return scaled.map((value) => value * scale);
}

function normalizePaletteHeights(heights, availableHeight, gap = PALETTE_GAP, minimumHeight = 0) {
  if (!heights.length) return [];
  const totalGaps = Math.max(0, heights.length - 1) * gap;
  const usableHeight = Math.max(0, Math.round(availableHeight - totalGaps));
  const clamped = heights.map((height) => Math.max(minimumHeight, height));
  const base = clamped.map((height) => Math.max(minimumHeight, Math.floor(height)));
  let remaining = usableHeight - base.reduce((sum, height) => sum + height, 0);

  if (remaining > 0) {
    const order = clamped
      .map((height, index) => ({ index, remainder: height - Math.floor(height) }))
      .sort((a, b) => b.remainder - a.remainder);
    for (let i = 0; i < order.length && remaining > 0; i += 1, remaining -= 1) {
      base[order[i].index] += 1;
    }
  } else if (remaining < 0) {
    const order = clamped
      .map((height, index) => ({ index, height }))
      .sort((a, b) => b.height - a.height);
    for (let i = 0; i < order.length && remaining < 0; i += 1) {
      const index = order[i].index;
      const reducible = Math.max(0, base[index] - minimumHeight);
      if (!reducible) continue;
      const delta = Math.min(reducible, -remaining);
      base[index] -= delta;
      remaining += delta;
    }
  }

  return base;
}

function getFittedPaletteHeights(colors, availableHeight, gap = PALETTE_GAP, preferredMinHeight = PALETTE_TWO_COLUMN_TARGET_MIN_HEIGHT, floorHeight = PALETTE_TWO_COLUMN_FLOOR_HEIGHT) {
  if (!colors.length) return [];
  const totalGaps = Math.max(0, colors.length - 1) * gap;
  const usableHeight = Math.max(0, availableHeight - totalGaps);
  if (!usableHeight) return colors.map(() => 0);

  const totalPercent = colors.reduce((sum, color) => sum + color.percent, 0) || colors.length || 1;
  const weightedHeights = colors.map((color) => Math.max(0.001, (color.percent / totalPercent) * usableHeight));
  const averageHeight = usableHeight / colors.length;
  const safeMinHeight = Math.min(preferredMinHeight, Math.max(floorHeight, averageHeight * 0.72), averageHeight);
  const heights = new Array(colors.length).fill(0);
  let flexible = weightedHeights.map((value, index) => ({ value, index }));
  let remainingHeight = usableHeight;

  while (flexible.length) {
    const remainingWeight = flexible.reduce((sum, item) => sum + item.value, 0) || flexible.length;
    const nextFlexible = [];
    let fixedAny = false;

    flexible.forEach((item) => {
      const proposed = remainingHeight * (item.value / remainingWeight);
      if (proposed < safeMinHeight) {
        heights[item.index] = safeMinHeight;
        remainingHeight -= safeMinHeight;
        fixedAny = true;
      } else {
        nextFlexible.push(item);
      }
    });

    if (!fixedAny) {
      flexible.forEach((item) => {
        heights[item.index] = remainingHeight * (item.value / remainingWeight);
      });
      break;
    }

    flexible = nextFlexible;
  }

  return heights;
}

function getPaletteAvailableHeight() {
  const listHeight = paletteList.clientHeight || paletteList.getBoundingClientRect().height || 0;
  const sheetHeight = paletteDrawerSheet.clientHeight || paletteDrawerSheet.getBoundingClientRect().height || 0;
  const panelHeight = palettePanel.clientHeight || palettePanel.getBoundingClientRect().height || 0;
  if (!panelHeight) {
    return Math.max(0, Math.round(Math.max(listHeight, sheetHeight)));
  }

  const panelStyles = window.getComputedStyle(palettePanel);
  const paddingTop = parseFloat(panelStyles.paddingTop || "0") || 0;
  const paddingBottom = parseFloat(panelStyles.paddingBottom || "0") || 0;
  const gap = parseFloat(panelStyles.rowGap || panelStyles.gap || "0") || 0;
  const summaryVisible = !paletteDrawerSummary.hidden && window.getComputedStyle(paletteDrawerSummary).display !== "none";
  const openVisible = !paletteDrawerOpen.hidden && window.getComputedStyle(paletteDrawerOpen).display !== "none";
  const toolbarVisible = window.getComputedStyle(desktopPaletteToolbar).display !== "none";
  const usedHeights = [
    openVisible ? paletteDrawerOpen.getBoundingClientRect().height : 0,
    summaryVisible ? paletteDrawerSummary.getBoundingClientRect().height : 0,
    toolbarVisible ? desktopPaletteToolbar.getBoundingClientRect().height : 0,
  ].filter((value) => value > 0);
  const visibleItems = usedHeights.length + 1;
  const gaps = Math.max(0, visibleItems - 1) * gap;
  const computedHeight = Math.max(0, Math.round(panelHeight - paddingTop - paddingBottom - gaps - usedHeights.reduce((sum, value) => sum + value, 0)));

  if (isRealMobileLayout() && state.isPaletteDrawerOpen) {
    const fittedHeight = Math.max(0, Math.round(computedHeight || sheetHeight || listHeight));
    return Math.max(0, fittedHeight - 4);
  }

  const desktopCandidates = [computedHeight, sheetHeight].filter((value) => value > 0);
  const fittedHeight = desktopCandidates.length
    ? Math.min(...desktopCandidates)
    : Math.max(0, Math.round(listHeight));
  return Math.max(0, Math.round(fittedHeight) - 4);
}

function getPaletteHeightMap() {
  const availableHeight = getPaletteAvailableHeight();
  const heightById = new Map();

  if (!isTwoColumnPalette()) {
    const heights = normalizePaletteHeights(
      getScaledPaletteHeights(state.colors, availableHeight, PALETTE_GAP, PALETTE_SINGLE_MIN_HEIGHT),
      availableHeight,
      PALETTE_GAP,
      PALETTE_SINGLE_MIN_HEIGHT,
    );
    state.colors.forEach((color, index) => {
      heightById.set(color.id, heights[index] || PALETTE_SINGLE_MIN_HEIGHT);
    });
    return heightById;
  }

  const leftCount = getPaletteLeftColumnCount();
  const columns = [state.colors.slice(0, leftCount), state.colors.slice(leftCount)];
  columns.forEach((columnColors) => {
    const heights = normalizePaletteHeights(
      getFittedPaletteHeights(columnColors, availableHeight, PALETTE_GAP, PALETTE_TWO_COLUMN_TARGET_MIN_HEIGHT, PALETTE_TWO_COLUMN_FLOOR_HEIGHT),
      availableHeight,
      PALETTE_GAP,
      PALETTE_TWO_COLUMN_FLOOR_HEIGHT,
    );
    columnColors.forEach((color, index) => {
      heightById.set(color.id, heights[index] || PALETTE_TWO_COLUMN_FLOOR_HEIGHT);
    });
  });

  return heightById;
}

function getPaletteColumns(items, totalCount = items.length) {
  if (!isTwoColumnPalette(totalCount)) {
    return [items];
  }

  const leftCount = getPaletteLeftColumnCount(totalCount);
  return [items.slice(0, leftCount), items.slice(leftCount)];
}

function createPaletteColumn(index) {
  const column = document.createElement("div");
  column.className = "palette-column";
  column.dataset.column = `${index}`;
  return column;
}

function createPalettePlaceholder(height) {
  const placeholder = document.createElement("div");
  placeholder.className = "palette-placeholder";
  placeholder.style.height = `${height}px`;
  return placeholder;
}

function updatePaletteLayoutMode() {
  const layout = isTwoColumnPalette() ? "double" : "single";
  root.dataset.paletteLayout = layout;
  paletteList.dataset.layout = layout;
  paletteList.classList.toggle("two-column", layout === "double");
  paletteList.classList.toggle("single-column", layout === "single");
}

function drawExportSwatchNodes(context, imageX, imageY, imageWidth, imageHeight) {
  state.colors.forEach((color) => {
    const x = imageX + (color.x * imageWidth);
    const y = imageY + (color.y * imageHeight);
    context.beginPath();
    context.arc(x, y, 18, 0, Math.PI * 2);
    context.fillStyle = color.hex;
    context.fill();
    context.lineWidth = 2;
    context.strokeStyle = "rgba(10, 10, 10, 0.9)";
    context.stroke();
    context.beginPath();
    context.arc(x, y, 20, 0, Math.PI * 2);
    context.lineWidth = 2;
    context.strokeStyle = "rgba(255,255,255,0.26)";
    context.stroke();
  });
}

function drawExportPaletteLabel(context, options) {
  const {
    x,
    y,
    hex,
    percent,
    textColor = "#f2efe8",
    labelFill = "rgba(42, 44, 48, 0.64)",
    labelHeight = 34,
    radius = 10,
    paddingX = 12,
    hexFontSize = 18,
    percentFontSize = 17,
  } = options;
  context.font = `700 ${hexFontSize}px "Space Grotesk", sans-serif`;
  const hexWidth = context.measureText(hex).width;
  context.font = `300 ${percentFontSize}px "Space Grotesk", sans-serif`;
  const percentLabel = formatPercent(percent);
  const percentWidth = context.measureText(percentLabel).width;
  const labelWidth = Math.max(72, Math.ceil(hexWidth + percentWidth + (paddingX * 2) + 10));
  const textBaselineY = y + (labelHeight / 2) + Math.max(4, (hexFontSize * 0.24));
  drawRoundedRect(context, x, y, labelWidth, labelHeight, radius, labelFill);
  context.fillStyle = textColor;
  context.font = `700 ${hexFontSize}px "Space Grotesk", sans-serif`;
  context.fillText(hex, x + paddingX, textBaselineY);
  context.font = `300 ${percentFontSize}px "Space Grotesk", sans-serif`;
  context.fillText(percentLabel, x + paddingX + hexWidth + 10, textBaselineY);
}

function scaleCanvasToLongestEdge(sourceCanvas, longestEdge) {
  const safeLongestEdge = Math.max(1, longestEdge || EXPORT_DEFAULT_LONGEST_EDGE);
  const sourceLongestEdge = Math.max(sourceCanvas.width, sourceCanvas.height, 1);
  if (sourceLongestEdge === safeLongestEdge) {
    return sourceCanvas;
  }
  const scale = safeLongestEdge / sourceLongestEdge;
  const scaledCanvas = document.createElement("canvas");
  scaledCanvas.width = Math.max(1, Math.round(sourceCanvas.width * scale));
  scaledCanvas.height = Math.max(1, Math.round(sourceCanvas.height * scale));
  const scaledCtx = scaledCanvas.getContext("2d");
  scaledCtx.imageSmoothingEnabled = true;
  scaledCtx.imageSmoothingQuality = "high";
  scaledCtx.drawImage(sourceCanvas, 0, 0, scaledCanvas.width, scaledCanvas.height);
  return scaledCanvas;
}

function getUniformPaletteHeights(count, availableHeight, gap = PALETTE_GAP) {
  if (!count) return [];
  const totalGapHeight = Math.max(0, count - 1) * gap;
  const cardHeight = Math.max(1, (availableHeight - totalGapHeight) / count);
  return new Array(count).fill(cardHeight);
}

function buildCurrentExportBaseCanvas(options) {
  const showNodes = Boolean(options?.stripNodes);
  const imageWidth = 1100;
  const imageHeight = Math.max(700, Math.round(imageWidth * (state.sourceHeight / Math.max(1, state.sourceWidth))));
  const paletteWidth = 320;
  const gap = 3;
  const minCardHeight = 54;
  const useUniformStack = state.colors.length > 15;
  const minPaletteHeight = (state.colors.length * minCardHeight) + (Math.max(0, state.colors.length - 1) * gap);
  const paletteAreaHeight = useUniformStack ? imageHeight : Math.max(imageHeight, minPaletteHeight);
  const paletteHeights = useUniformStack
    ? getUniformPaletteHeights(state.colors.length, imageHeight, gap)
    : getScaledPaletteHeights(state.colors, paletteAreaHeight, gap, minCardHeight);
  const exportHeight = useUniformStack
    ? imageHeight
    : Math.max(
      imageHeight,
      Math.round(paletteHeights.reduce((sum, value) => sum + value, 0) + (Math.max(0, paletteHeights.length - 1) * gap)),
    );
  const exportCanvas = document.createElement("canvas");
  exportCanvas.width = imageWidth + paletteWidth;
  exportCanvas.height = exportHeight;
  const exportCtx = exportCanvas.getContext("2d");

  exportCtx.fillStyle = "#111417";
  exportCtx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
  exportCtx.drawImage(canvas, 0, 0, imageWidth, imageHeight);

  let cardY = 0;
  state.colors.forEach((color, index) => {
    const cardHeight = paletteHeights[index] || minCardHeight;
    const cardX = imageWidth;
    const compactLabelHeight = useUniformStack ? clamp(Math.round(cardHeight - 6), 12, 26) : 34;
    const compactHexSize = useUniformStack ? clamp(Math.round(compactLabelHeight * 0.46), 8, 13) : 18;
    const compactPercentSize = useUniformStack ? clamp(Math.round(compactLabelHeight * 0.42), 7, 12) : 17;
    exportCtx.fillStyle = color.hex;
    exportCtx.fillRect(cardX, cardY, paletteWidth, cardHeight);
    exportCtx.fillStyle = "rgba(255,255,255,0.08)";
    exportCtx.fillRect(cardX, cardY, paletteWidth, 1);
    drawExportPaletteLabel(exportCtx, {
      x: cardX + 14,
      y: cardY + (useUniformStack ? 2 : 12),
      hex: color.hex,
      percent: color.percent,
      labelHeight: compactLabelHeight,
      radius: useUniformStack ? 8 : 10,
      paddingX: useUniformStack ? 8 : 12,
      hexFontSize: compactHexSize,
      percentFontSize: compactPercentSize,
    });
    cardY += cardHeight + gap;
  });

  if (showNodes) {
    drawExportSwatchNodes(exportCtx, 0, 0, imageWidth, imageHeight);
  }
  return exportCanvas;
}

function buildStripExportBaseCanvas(options) {
  const showNodes = Boolean(options?.stripNodes);
  const sourceRatio = state.sourceWidth / Math.max(1, state.sourceHeight);
  const baseImageWidth = 1100;
  const baseImageHeight = Math.round(baseImageWidth * (state.sourceHeight / Math.max(1, state.sourceWidth)));
  const imageHeight = Math.max(1900, baseImageHeight);
  const imageWidth = Math.round(imageHeight * sourceRatio);
  const cardGap = 12;
  const rowsPerColumn = Math.min(5, Math.max(1, state.colors.length));
  const columnsCount = Math.max(1, Math.ceil(state.colors.length / 5));
  const columnGap = 12;
  const cardHeight = (imageHeight - (Math.max(0, rowsPerColumn - 1) * cardGap)) / rowsPerColumn;
  const cardWidth = Math.max(1, Math.round(cardHeight * 0.72));
  const paletteWidth = (columnsCount * cardWidth) + (Math.max(0, columnsCount - 1) * columnGap);
  const exportWidth = imageWidth + columnGap + paletteWidth;
  const exportHeight = imageHeight;
  const exportCanvas = document.createElement("canvas");
  exportCanvas.width = exportWidth;
  exportCanvas.height = exportHeight;
  const exportCtx = exportCanvas.getContext("2d");

  exportCtx.fillStyle = "#111417";
  exportCtx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
  exportCtx.drawImage(canvas, 0, 0, imageWidth, imageHeight);

  if (showNodes) {
    drawExportSwatchNodes(exportCtx, 0, 0, imageWidth, imageHeight);
  }

  state.colors.forEach((color, index) => {
    const columnIndex = Math.floor(index / 5);
    const rowIndex = index % 5;
    const cardX = imageWidth + columnGap + (columnIndex * (cardWidth + columnGap));
    const cardY = rowIndex * (cardHeight + cardGap);
    drawRoundedRect(exportCtx, cardX, cardY, cardWidth, cardHeight, 14, color.hex);
    exportCtx.fillStyle = "rgba(255,255,255,0.08)";
    exportCtx.fillRect(cardX, cardY, cardWidth, 1);
  });

  return exportCanvas;
}

function buildExportCanvas(options = state.saveExport) {
  const exportOptions = {
    layout: options?.layout || EXPORT_LAYOUT_CURRENT,
    longestEdge: options?.longestEdge || EXPORT_DEFAULT_LONGEST_EDGE,
    stripNodes: Boolean(options?.stripNodes),
  };
  const baseCanvas = exportOptions.layout === EXPORT_LAYOUT_STRIP
    ? buildStripExportBaseCanvas(exportOptions)
    : buildCurrentExportBaseCanvas(exportOptions);
  return scaleCanvasToLongestEdge(baseCanvas, exportOptions.longestEdge);
}

function downloadCanvas(canvasToDownload, filename) {
  const link = document.createElement("a");
  link.href = canvasToDownload.toDataURL("image/png");
  link.download = `${filename}-${Date.now()}.png`;
  link.click();
}

function syncSaveModalControls() {
  saveStyleButtons.forEach((button) => {
    const active = button.dataset.saveStyle === state.saveExport.layout;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", active ? "true" : "false");
  });
  saveSizeButtons.forEach((button) => {
    const active = Number(button.dataset.saveSize) === state.saveExport.longestEdge;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", active ? "true" : "false");
  });
  saveStripNodes.checked = state.saveExport.stripNodes;
  saveNodesRow.hidden = false;
}

function resetSaveExportState() {
  state.saveExport.layout = EXPORT_LAYOUT_CURRENT;
  state.saveExport.longestEdge = EXPORT_DEFAULT_LONGEST_EDGE;
  state.saveExport.stripNodes = false;
  syncSaveModalControls();
}

function renderSavePreview() {
  if (!state.image || !state.colors.length) {
    savePreviewCanvas.hidden = true;
    savePreviewEmpty.hidden = false;
    savePreviewEmpty.textContent = "Upload an image first to preview save options.";
    return;
  }

  const exportCanvas = buildExportCanvas(state.saveExport);
  const previewCanvas = scaleCanvasToLongestEdge(exportCanvas, EXPORT_PREVIEW_LONGEST_EDGE);
  savePreviewCanvas.width = previewCanvas.width;
  savePreviewCanvas.height = previewCanvas.height;
  const previewCtx = savePreviewCanvas.getContext("2d");
  previewCtx.clearRect(0, 0, savePreviewCanvas.width, savePreviewCanvas.height);
  previewCtx.drawImage(previewCanvas, 0, 0, savePreviewCanvas.width, savePreviewCanvas.height);
  savePreviewCanvas.hidden = false;
  savePreviewEmpty.hidden = true;
}

function closeSaveModal() {
  if (!saveModal) return;
  saveModal.classList.add("hidden");
  saveModal.setAttribute("aria-hidden", "true");
}

function openSaveModal() {
  if (!state.image || !state.colors.length) {
    showImportWarning("Save options", "Upload an image first to preview and save export layouts.");
    return;
  }
  closeRecipeModal();
  resetSaveExportState();
  renderSavePreview();
  saveModal.classList.remove("hidden");
  saveModal.setAttribute("aria-hidden", "false");
}

function exportConfiguredImage() {
  if (!state.image || !state.colors.length) return;
  const exportCanvas = buildExportCanvas(state.saveExport);
  downloadCanvas(exportCanvas, "color-study");
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
  state.paletteDragLeft = rect.left - listRect.left;
  state.paletteDragWidth = rect.width;
  state.paletteGrabOffsetY = event.clientY - rect.top;
  setHoveredColor(id);
  lockPageScroll(SCROLL_LOCK_PALETTE_DRAG);
  if (state.paletteDragPointerId !== null) {
    paletteList.setPointerCapture(state.paletteDragPointerId);
  }
  renderPalette();
}

function getPaletteDragPosition(pointerX, pointerY, dragHeight) {
  const listRect = paletteList.getBoundingClientRect();
  const columns = [...paletteList.querySelectorAll(".palette-column")];
  if (!columns.length) {
    return { dropIndex: 0, top: 0, left: 0, width: listRect.width };
  }

  let columnIndex = 0;
  if (isTwoColumnPalette() && columns.length > 1) {
    const leftRect = columns[0].getBoundingClientRect();
    const rightRect = columns[1].getBoundingClientRect();
    const splitX = (leftRect.right + rightRect.left) / 2;
    columnIndex = pointerX >= splitX ? 1 : 0;
  }

  const column = columns[columnIndex];
  const columnRect = column.getBoundingClientRect();
  const cards = [...column.querySelectorAll(".palette-card:not(.dragging)")];
  let localIndex = 0;
  for (const card of cards) {
    const rect = card.getBoundingClientRect();
    const midpoint = rect.top + (rect.height / 2);
    if (pointerY < midpoint) {
      break;
    }
    localIndex += 1;
  }

  const baseIndex = columnIndex === 0 ? 0 : getPaletteLeftColumnCount(state.colors.length);
  const minTop = columnRect.top - listRect.top;
  const maxTop = Math.max(minTop, (columnRect.bottom - listRect.top) - dragHeight);
  return {
    dropIndex: baseIndex + localIndex,
    top: clamp(pointerY - listRect.top - state.paletteGrabOffsetY, minTop, maxTop),
    left: columnRect.left - listRect.left,
    width: columnRect.width,
  };
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
  card.style.background = `linear-gradient(135deg, ${color.hex}, color-mix(in srgb, ${color.hex} 58%, #17191c))`;
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

function appendPaletteItems(column, items, heightById, draggedHeight) {
  items.forEach((item) => {
    if (item && item.isPlaceholder) {
      column.appendChild(createPalettePlaceholder(draggedHeight));
      return;
    }
    column.appendChild(createPaletteCard(item, heightById.get(item.id)));
  });
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
  updatePaletteLayoutMode();
  renderPalettePreview();
  paletteList.innerHTML = '';
  const heightById = getPaletteHeightMap();
  const columns = Array.from({ length: isTwoColumnPalette() ? 2 : 1 }, (_, index) => {
    const column = createPaletteColumn(index);
    paletteList.appendChild(column);
    return column;
  });

  if (!state.paletteDragId) {
    getPaletteColumns(state.colors, state.colors.length).forEach((items, index) => {
      appendPaletteItems(columns[index], items, heightById, 0);
    });
    return;
  }

  const dragId = state.paletteDragId;
  const draggedColor = state.colors.find((color) => color.id === dragId);
  if (!draggedColor) {
    state.paletteDragId = null;
    renderPalette();
    return;
  }
  const draggedHeight = heightById.get(dragId) || PALETTE_SINGLE_MIN_HEIGHT;
  const remainingColors = state.colors.filter((color) => color.id !== dragId);
  const placeholderIndex = clamp(state.paletteDropIndex ?? remainingColors.length, 0, remainingColors.length);
  const renderItems = [
    ...remainingColors.slice(0, placeholderIndex),
    { id: "__palette-placeholder__", isPlaceholder: true },
    ...remainingColors.slice(placeholderIndex),
  ];

  getPaletteColumns(renderItems, state.colors.length).forEach((items, index) => {
    appendPaletteItems(columns[index], items, heightById, draggedHeight);
  });

  const dragCard = createPaletteCard(draggedColor, draggedHeight);
  dragCard.classList.add('dragging');
  dragCard.style.top = `${state.paletteDragTop}px`;
  dragCard.style.left = `${state.paletteDragLeft}px`;
  dragCard.style.width = `${state.paletteDragWidth}px`;
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
  destroyDragLens(true);
  swatchLayer.innerHTML = "";
  state.swatches = state.colors.map((color) => createSwatch(color));
  startAnimation();
}

function updateSwatchPositions() {
  state.swatches.forEach((swatch) => {
    if (state.dragId === swatch.id) {
      swatch.x = swatch.targetX;
      swatch.y = swatch.targetY;
    } else {
      swatch.x += (swatch.targetX - swatch.x) * 0.18;
      swatch.y += (swatch.targetY - swatch.y) * 0.18;
    }
    swatch.element.style.left = `${swatch.x}px`;
    swatch.element.style.top = `${swatch.y}px`;
    if (state.dragLens && state.dragId === swatch.id) {
      positionDragLens(swatch);
    }
  });
  state.animationFrame = requestAnimationFrame(updateSwatchPositions);
}

function startAnimation() {
  cancelAnimationFrame(state.animationFrame);
  state.animationFrame = requestAnimationFrame(updateSwatchPositions);
}

function applyScrollLockState() {
  if (!state.scrollLocks.size) {
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.left = "";
    document.body.style.right = "";
    document.body.style.width = "";
    document.body.style.overflow = "";
    window.scrollTo(0, state.scrollLockY || 0);
    return;
  }

  document.body.style.position = "fixed";
  document.body.style.top = `-${state.scrollLockY}px`;
  document.body.style.left = "0";
  document.body.style.right = "0";
  document.body.style.width = "100%";
  document.body.style.overflow = "hidden";
}

function lockPageScroll(reason) {
  if (!reason) {
    return;
  }

  if (!state.scrollLocks.size) {
    state.scrollLockY = window.scrollY || window.pageYOffset || 0;
  }

  state.scrollLocks.add(reason);
  applyScrollLockState();
}

function unlockPageScroll(reason) {
  if (reason) {
    state.scrollLocks.delete(reason);
  } else {
    state.scrollLocks.clear();
  }

  applyScrollLockState();
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
  if (state.dragLens && state.dragId === swatch.id) {
    renderDragLens(swatch);
  }
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
    lockPageScroll(SCROLL_LOCK_SWATCH_DRAG);
  }
  if (event.pointerId !== undefined && state.dragPointerType !== "touch") {
    swatch.element.setPointerCapture(event.pointerId);
  }
  const point = getPointFromEvent(event);
  swatch.targetX = point.x;
  swatch.targetY = point.y;
  swatch.x = point.x;
  swatch.y = point.y;
  swatch.element.style.left = `${swatch.x}px`;
  swatch.element.style.top = `${swatch.y}px`;
  createDragLens();
  positionDragLens(swatch);
  updateSwatchColor(swatch);
}

function handleDrag(event) {
  if (state.paletteDragId) {
    event.preventDefault();
    const dragCard = paletteList.querySelector(".palette-card.dragging");
    const dragHeight = dragCard ? dragCard.getBoundingClientRect().height : PALETTE_SINGLE_MIN_HEIGHT;
    const nextPosition = getPaletteDragPosition(event.clientX, event.clientY, dragHeight);
    const nextDropIndex = clamp(nextPosition.dropIndex, 0, state.colors.length);
    state.paletteDragTop = nextPosition.top;
    state.paletteDragLeft = nextPosition.left;
    state.paletteDragWidth = nextPosition.width;
    if (nextDropIndex !== state.paletteDropIndex) {
      state.paletteDropIndex = nextDropIndex;
      renderPalette();
    } else if (dragCard) {
      dragCard.style.top = `${state.paletteDragTop}px`;
      dragCard.style.left = `${state.paletteDragLeft}px`;
      dragCard.style.width = `${state.paletteDragWidth}px`;
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
  swatch.x = point.x;
  swatch.y = point.y;
  swatch.element.style.left = `${swatch.x}px`;
  swatch.element.style.top = `${swatch.y}px`;
  positionDragLens(swatch);
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
    state.paletteDragLeft = 0;
    state.paletteDragWidth = 0;
    state.paletteGrabOffsetY = 0;
    unlockPageScroll(SCROLL_LOCK_PALETTE_DRAG);
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
  destroyDragLens();
  if (state.dragPointerType !== "touch") {
    unlockPageScroll(SCROLL_LOCK_SWATCH_DRAG);
  }
  state.dragId = null;
  state.dragPointerType = null;
  setHoveredColor(null);
}

function initializePalette() {
  closeSaveModal();
  state.colors = extractPalette(state.image, state.paletteSize);
  state.recipeResults = [];
  state.recipeRequest = null;
  updatePaletteLayoutMode();
  syncLayoutState();
  requestAnimationFrame(() => {
    drawProcessedImage();
    recalculatePercentages();
    renderRecipe();
    updatePaletteLabel();
    renderPalette();
    rebuildSwatches();
  });
}

function addPaletteColor() {
  if (!state.image || state.colors.length >= PALETTE_MAX) return;
  const candidates = extractPalette(state.image, PALETTE_MAX);
  const nextColor = candidates.find((candidate) => !state.colors.some((color) => colorDistance(color, candidate) < 24)) || candidates[state.colors.length];
  if (!nextColor) return;
  state.colors.push({ ...nextColor, id: `color-${state.colors.length + 1}` });
  state.recipeResults = [];
  state.paletteSize = state.colors.length;
  updatePaletteLayoutMode();
  syncLayoutState();
  requestAnimationFrame(() => {
    drawProcessedImage();
    recalculatePercentages();
    renderRecipe();
    updatePaletteLabel();
    renderPalette();
    rebuildSwatches();
  });
}

function removePaletteColor() {
  if (!state.image || state.colors.length <= PALETTE_MIN) return;
  state.colors.pop();
  state.recipeResults = [];
  state.paletteSize = state.colors.length;
  updatePaletteLayoutMode();
  syncLayoutState();
  requestAnimationFrame(() => {
    drawProcessedImage();
    recalculatePercentages();
    renderRecipe();
    updatePaletteLabel();
    renderPalette();
    rebuildSwatches();
  });
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
    state.paletteSize = DEFAULT_PALETTE_SIZE;
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
  state.recipeRequest = buildRecipeRequest(state.colors);
  state.recipeResults = state.colors.map((color) => estimatePaintRecipe(color, state.recipeRequest));
  renderRecipe();
});

paintSetupButton.addEventListener("click", () => {
  closeSaveModal();
  closeRecipeModal();
  openInventoryModal();
});

inventoryForm.addEventListener("submit", addInventoryPaint);
inventoryModal.addEventListener("click", handleInventoryModalClick);


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

settingsToggle.addEventListener("click", () => {
  if (!isRealMobileLayout()) {
    return;
  }

  state.isSettingsOpen = !state.isSettingsOpen;
  syncLayoutState();
  if (!state.image) {
    return;
  }

  requestAnimationFrame(() => {
    drawProcessedImage();
    syncSwatchTargetsFromColors();
    recalculatePercentages();
    renderPalette();
    syncSwatchTargetsFromColors();
  });
});
paletteDrawerOpen.addEventListener("click", openPaletteDrawer);
paletteDrawerClose.addEventListener("click", () => {
  closePaletteDrawer();
});
paletteMinusButtons.forEach((button) => {
  button.addEventListener("click", removePaletteColor);
});
palettePlusButtons.forEach((button) => {
  button.addEventListener("click", addPaletteColor);
});
canvasWrap.addEventListener("dragover", (event) => event.preventDefault());
canvasWrap.addEventListener("drop", async (event) => {
  event.preventDefault();
  const [file] = event.dataTransfer.files || [];
  await handleFile(file);
});
window.addEventListener("pointermove", handleDrag, { passive: false });
window.addEventListener("pointerup", endDrag);
window.addEventListener("pointercancel", endDrag);
window.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") {
    return;
  }

  if (state.isPaletteDrawerOpen) {
    event.preventDefault();
    closePaletteDrawer();
    return;
  }

  if (isRealMobileLayout() && state.isSettingsOpen) {
    event.preventDefault();
    state.isSettingsOpen = false;
    syncLayoutState();
    if (state.image) {
      requestAnimationFrame(() => {
        drawProcessedImage();
        syncSwatchTargetsFromColors();
        recalculatePercentages();
        renderPalette();
        syncSwatchTargetsFromColors();
      });
    }
    return;
  }

  if (!saveModal.classList.contains("hidden")) {
    closeSaveModal();
    return;
  }

  if (!inventoryModal.classList.contains("hidden")) {
    closeInventoryModal();
    return;
  }

  if (!recipeModal.classList.contains("hidden")) {
    closeRecipeModal();
  }
});
if (recipeExport) {
  recipeExport.addEventListener("click", exportRecipeImage);
}
if (imageExportButton) {
  imageExportButton.addEventListener("click", openSaveModal);
}
if (recipeClose) {
  recipeClose.addEventListener("click", closeRecipeModal);
}
if (recipeModal) {
  recipeModal.addEventListener("click", (event) => {
    if (event.target === recipeModal) closeRecipeModal();
  });
}
if (saveClose) {
  saveClose.addEventListener("click", closeSaveModal);
}
if (saveModal) {
  saveModal.addEventListener("click", (event) => {
    if (event.target === saveModal) closeSaveModal();
  });
}
saveStyleButtons.forEach((button) => {
  button.addEventListener("click", () => {
    state.saveExport.layout = button.dataset.saveStyle === EXPORT_LAYOUT_STRIP ? EXPORT_LAYOUT_STRIP : EXPORT_LAYOUT_CURRENT;
    syncSaveModalControls();
    renderSavePreview();
  });
});
saveSizeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const requestedSize = Number(button.dataset.saveSize);
    if (!EXPORT_SIZE_PRESETS.includes(requestedSize)) return;
    state.saveExport.longestEdge = requestedSize;
    syncSaveModalControls();
    renderSavePreview();
  });
});
saveStripNodes.addEventListener("change", () => {
  state.saveExport.stripNodes = Boolean(saveStripNodes.checked);
  syncSaveModalControls();
  renderSavePreview();
});
saveExport.addEventListener("click", exportConfiguredImage);
window.addEventListener("resize", () => {
  syncLayoutState();
  if (!state.image) return;
  requestAnimationFrame(() => {
    drawProcessedImage();
    syncSwatchTargetsFromColors();
    recalculatePercentages();
    renderPalette();
    syncSwatchTargetsFromColors();
    if (!saveModal.classList.contains("hidden")) {
      renderSavePreview();
    }
  });
});
syncLayoutState();
updatePaletteLabel();
state.inventoryDraft = clonePaintCollection(state.ownedPaints);
renderInventoryList();
renderPalettePreview();
syncSaveModalControls();
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


