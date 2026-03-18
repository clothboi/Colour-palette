(() => {
const HARMONIZE_SCHEMES = [
  { id: "monochromatic", label: "Monochromatic", group: "Simple", description: "Shifts all colours toward a single hue using tints and shades for a unified result." },
  { id: "analogous", label: "Analogous", group: "Simple", description: "Shifts colours toward neighbouring hues to create a smooth, cohesive flow." },
  { id: "complementary", label: "Complementary", group: "Balanced Contrast", description: "Shifts colours toward opposing hues to create clear, high-impact contrast." },
  { id: "split-complementary", label: "Split Complementary", group: "Balanced Contrast", description: "Shifts colours toward near-opposing hues to balance contrast with harmony." },
  { id: "triadic", label: "Triadic", group: "Complex Harmony", description: "Shifts colours toward three evenly spaced hues for vibrant, balanced variation." },
  { id: "tetradic", label: "Tetradic", group: "Complex Harmony", description: "Shifts colours toward two opposing hue pairs for rich, dynamic combinations." },
];
const HARMONIZE_DEFAULT_SCHEME = "analogous";
const HARMONIZE_DEFAULT_STRENGTH = 60;
const HARMONIZE_DEFAULT_SATURATION = 0;
const HARMONIZE_DEFAULT_BRIGHTNESS = 0;

function getHarmonizeSchemeOptionsMarkup() {
  const groups = [];
  HARMONIZE_SCHEMES.forEach((scheme) => {
    const existingGroup = groups.find((entry) => entry.label === scheme.group);
    if (existingGroup) {
      existingGroup.items.push(scheme);
      return;
    }
    groups.push({
      label: scheme.group,
      items: [scheme],
    });
  });
  return groups.map((group) => `                <optgroup label="${group.label}">
${group.items.map((scheme) => `                  <option value="${scheme.id}"${scheme.id === HARMONIZE_DEFAULT_SCHEME ? " selected" : ""}>${scheme.label}</option>`).join("\n")}
                </optgroup>`).join("\n");
}

function getPaletteControlsMarkup(extraClass = "") {
  const className = extraClass ? `palette-toolbar-controls ${extraClass}` : "palette-toolbar-controls";
  return `
                <div class="${className}">
                  <div class="palette-toolbar-stepper">
                    <button class="palette-button" type="button" data-action="palette-minus" aria-label="Decrease palette size">-</button>
                    <span data-role="palette-size-label" class="palette-size-label">Palette: 4</span>
                    <button class="palette-button" type="button" data-action="palette-plus" aria-label="Increase palette size">+</button>
                  </div>
                  <button class="palette-harmonize-toggle" type="button" data-action="toggle-harmonize" aria-expanded="false">Harmonise</button>
                </div>`;
}

function getMobilePaletteSummaryControlsMarkup() {
  return `
              <div class="mobile-palette-rail__header-row">
                <button class="mobile-palette-rail__open palette-drawer-open" type="button" data-action="palette-drawer-open" aria-label="Open palette rail" aria-expanded="false">
                  <span class="palette-drawer-open__label">Open Palette</span>
                </button>
                <div class="mobile-palette-rail__stepper palette-toolbar-stepper">
                  <button class="palette-button" type="button" data-action="palette-minus" aria-label="Decrease palette size">-</button>
                  <span data-role="palette-size-label" class="palette-size-label">Palette: 4</span>
                  <button class="palette-button" type="button" data-action="palette-plus" aria-label="Increase palette size">+</button>
                </div>
              </div>
              <button class="palette-harmonize-toggle mobile-palette-rail__harmonize" type="button" data-action="toggle-harmonize" aria-expanded="false">Harmonise</button>`;
}

function getHarmonizePanelMarkup() {
  return `
        <section class="palette-harmonize-panel" data-role="harmonize-panel" hidden aria-hidden="true">
          <div class="palette-harmonize-head">
            <div>
              <p class="palette-harmonize-kicker">Palette tuning</p>
              <h3>Harmonise palette</h3>
            </div>
          </div>
          <section class="palette-harmonize-card">
            <div class="palette-harmonize-card-head">
              <h4 class="palette-harmonize-card-title">Colour scheme</h4>
            </div>
            <div class="palette-harmonize-card-body">
              <div class="palette-harmonize-section-head palette-harmonize-section-head--inline">
                <div class="palette-harmonize-select-wrap">
                  <select class="palette-harmonize-select" data-role="harmonize-scheme-select" aria-label="Choose a harmony scheme">
${getHarmonizeSchemeOptionsMarkup()}
                  </select>
                </div>
              </div>
              <p class="palette-harmonize-subtle palette-harmonize-scheme-description" data-role="harmonize-scheme-description">${HARMONIZE_SCHEMES.find((scheme) => scheme.id === HARMONIZE_DEFAULT_SCHEME)?.description || ""}</p>
            </div>
          </section>
          <section class="palette-harmonize-card">
            <div class="palette-harmonize-card-head">
              <h4 class="palette-harmonize-card-title">Palette balance</h4>
            </div>
            <div class="palette-harmonize-card-body">
              <label class="palette-harmonize-section palette-harmonize-range">
                <div class="palette-harmonize-section-head">
                  <span class="palette-harmonize-label">Strength</span>
                  <strong class="palette-harmonize-value" data-role="harmonize-strength-value">${HARMONIZE_DEFAULT_STRENGTH}%</strong>
                </div>
                <input class="palette-harmonize-slider" data-role="harmonize-strength" type="range" min="0" max="100" step="1" value="${HARMONIZE_DEFAULT_STRENGTH}">
              </label>
              <label class="palette-harmonize-section palette-harmonize-range">
                <div class="palette-harmonize-section-head">
                  <span class="palette-harmonize-label">Saturation</span>
                  <strong class="palette-harmonize-value" data-role="harmonize-saturation-value">0%</strong>
                </div>
                <input class="palette-harmonize-slider" data-role="harmonize-saturation" type="range" min="-100" max="100" step="1" value="${HARMONIZE_DEFAULT_SATURATION}">
              </label>
              <label class="palette-harmonize-section palette-harmonize-range">
                <div class="palette-harmonize-section-head">
                  <span class="palette-harmonize-label">Brightness</span>
                  <strong class="palette-harmonize-value" data-role="harmonize-brightness-value">0%</strong>
                </div>
                <input class="palette-harmonize-slider" data-role="harmonize-brightness" type="range" min="-100" max="100" step="1" value="${HARMONIZE_DEFAULT_BRIGHTNESS}">
              </label>
            </div>
          </section>
          <section class="palette-harmonize-card">
            <div class="palette-harmonize-card-head">
              <h4 class="palette-harmonize-card-title">Anchor and settings</h4>
            </div>
            <div class="palette-harmonize-card-body">
              <p class="palette-harmonize-helper" data-role="harmonize-helper">Use the palette rail locks to pin colours. The first locked colour becomes the anchor.</p>
              <div class="palette-harmonize-actions">
                <button class="palette-harmonize-action" type="button" data-action="harmonize-reset">Reset</button>
                <button class="palette-harmonize-action" type="button" data-action="harmonize-cancel">Cancel</button>
                <button class="palette-harmonize-action palette-harmonize-action--primary" type="button" data-action="harmonize-apply">Apply</button>
              </div>
            </div>
          </section>
        </section>`;
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
                <button class="recipe-button" type="button" data-action="export-image">Export</button>
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
          <div class="mobile-palette-rail__surface palette-drawer-summary" data-role="palette-drawer-summary">
            <div class="mobile-palette-rail__top">
${getMobilePaletteSummaryControlsMarkup()}
            </div>
            <span class="mobile-palette-rail__preview palette-preview-list" data-role="palette-preview-list" aria-hidden="true"></span>
          </div>
        </div>
        <div class="palette-toolbar" data-role="desktop-palette-toolbar">
          <div class="palette-toolbar-head">
            <span class="palette-rail-label">Palette Rail</span>
            <button class="palette-drawer-close" type="button" data-action="palette-drawer-close" aria-label="Close palette drawer">X</button>
          </div>
${getPaletteControlsMarkup()}
        </div>
${getHarmonizePanelMarkup()}
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
        <button class="recipe-close" type="button" data-action="recipe-close" aria-label="Close paint recipes">X</button>
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
        <button class="recipe-close" type="button" data-action="inventory-close" aria-label="Close paint setup">X</button>
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
    <div class="save-modal-panel" role="dialog" aria-modal="true" aria-label="Export options">
      <div class="save-modal-head">
        <div>
          <p class="save-modal-kicker">Export study</p>
          <h2>Export</h2>
        </div>
        <button class="save-close" type="button" data-action="save-close" aria-label="Close export options">X</button>
      </div>
      <div data-role="save-content" class="save-modal-content">
        <div class="save-controls">
          <section class="save-control-group">
            <span class="save-control-label">Style</span>
            <div class="save-option-row">
              <button class="save-option-button" type="button" data-save-style="current">Default</button>
              <button class="save-option-button" type="button" data-save-style="strip">Swatches</button>
              <button class="save-option-button" type="button" data-save-style="wheel">Colour wheel</button>
              <button class="save-option-button" type="button" data-save-style="gradient">Gradient map</button>
            </div>
            <div class="save-style-settings" data-role="save-style-settings">
              <label data-role="save-nodes-row" class="save-toggle" hidden>
                <input data-role="save-strip-nodes" type="checkbox">
                <span>Show nodes</span>
              </label>
              <section class="save-style-inline" data-role="save-wheel-order-row" hidden>
                <span class="save-style-label">Order</span>
                <div class="save-option-row save-option-row-inline">
                  <button class="save-option-button" type="button" data-save-wheel-order="palette">Palette order</button>
                  <button class="save-option-button" type="button" data-save-wheel-order="hue">Hue order</button>
                </div>
              </section>
              <section class="save-style-panel" data-role="save-gradient-row" hidden>
                <p class="save-style-note">Gradient map node positions are export-only for this style.</p>
                <button class="save-option-button save-option-button--secondary" type="button" data-action="save-gradient-reset">Reset nodes</button>
              </section>
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
        </div>
        <div class="save-preview-shell">
          <canvas data-role="save-preview-canvas" aria-label="Export preview"></canvas>
          <div data-role="save-preview-overlay" class="save-preview-overlay" hidden></div>
          <p data-role="save-preview-empty" class="save-preview-empty" hidden></p>
        </div>
      </div>
    </div>
    <button class="save-export" type="button" data-action="save-export-image">Export</button>
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
  const harmonizeToggleButtons = [...root.querySelectorAll('[data-action="toggle-harmonize"]')];
  const paletteSizeLabels = [...root.querySelectorAll('[data-role="palette-size-label"]')];
  const harmonizePanel = root.querySelector('[data-role="harmonize-panel"]');
  const harmonizeSchemeSelect = root.querySelector('[data-role="harmonize-scheme-select"]');
  const harmonizeSchemeDescription = root.querySelector('[data-role="harmonize-scheme-description"]');
  const harmonizeStrength = root.querySelector('[data-role="harmonize-strength"]');
  const harmonizeStrengthValue = root.querySelector('[data-role="harmonize-strength-value"]');
  const harmonizeSaturation = root.querySelector('[data-role="harmonize-saturation"]');
  const harmonizeSaturationValue = root.querySelector('[data-role="harmonize-saturation-value"]');
  const harmonizeBrightness = root.querySelector('[data-role="harmonize-brightness"]');
  const harmonizeBrightnessValue = root.querySelector('[data-role="harmonize-brightness-value"]');
  const harmonizeHelper = root.querySelector('[data-role="harmonize-helper"]');
  const harmonizeReset = root.querySelector('[data-action="harmonize-reset"]');
  const harmonizeCancel = root.querySelector('[data-action="harmonize-cancel"]');
  const harmonizeApply = root.querySelector('[data-action="harmonize-apply"]');
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
  const savePreviewShell = root.querySelector('.save-preview-shell');
  const savePreviewCanvas = root.querySelector('[data-role="save-preview-canvas"]');
  const savePreviewOverlay = root.querySelector('[data-role="save-preview-overlay"]');
  const savePreviewEmpty = root.querySelector('[data-role="save-preview-empty"]');
  const saveStyleSettings = root.querySelector('[data-role="save-style-settings"]');
  const saveNodesRow = root.querySelector('[data-role="save-nodes-row"]');
  const saveStripNodes = root.querySelector('[data-role="save-strip-nodes"]');
  const saveWheelOrderRow = root.querySelector('[data-role="save-wheel-order-row"]');
  const saveWheelOrderButtons = [...root.querySelectorAll('[data-save-wheel-order]')];
  const saveGradientRow = root.querySelector('[data-role="save-gradient-row"]');
  const saveGradientReset = root.querySelector('[data-action="save-gradient-reset"]');
  const saveClose = root.querySelector('[data-action="save-close"]');
  const saveExport = root.querySelector('[data-action="save-export-image"]');
  const saveStyleButtons = [...root.querySelectorAll('[data-save-style]')];
  const saveSizeButtons = [...root.querySelectorAll('[data-save-size]')];
  if (!ctx || !swatchLayer || !paletteList || !palettePanel || !mobilePaletteRail || !desktopPaletteToolbar || !paletteDrawerSheet || !paletteDrawerSummary || !palettePreviewList || !emptyState || !canvasStage || !canvasWrap || !controlHud || !hudSettingsPanel || !settingsToggle || !paletteDrawerOpen || !paletteDrawerClose || !paletteMinusButtons.length || !palettePlusButtons.length || !harmonizeToggleButtons.length || !paletteSizeLabels.length || !harmonizePanel || !harmonizeSchemeSelect || !harmonizeSchemeDescription || !harmonizeStrength || !harmonizeStrengthValue || !harmonizeSaturation || !harmonizeSaturationValue || !harmonizeBrightness || !harmonizeBrightnessValue || !harmonizeHelper || !harmonizeReset || !harmonizeCancel || !harmonizeApply || !recipeButton || !paintSetupButton || !imageExportButton || !recipeModal || !recipeContent || !recipeClose || !recipeExport || !inventoryModal || !inventoryForm || !inventoryBrand || !inventoryColorName || !inventoryPigmentCodes || !inventoryOpacity || !inventoryLightfastness || !inventoryHex || !inventoryFeedback || !inventoryList || !inventoryCount || !inventoryClose || !inventoryReset || !inventorySave || !saveModal || !saveContent || !savePreviewShell || !savePreviewCanvas || !savePreviewOverlay || !savePreviewEmpty || !saveStyleSettings || !saveNodesRow || !saveStripNodes || !saveWheelOrderRow || !saveWheelOrderButtons.length || !saveGradientRow || !saveGradientReset || !saveClose || !saveExport || !saveStyleButtons.length || !saveSizeButtons.length) {
    return;
  }

const PALETTE_MIN = 2;
const PALETTE_MAX = 30;
const DEFAULT_PALETTE_SIZE = 4;
let importWarningTimer = null;
const MOBILE_LAYOUT_MAX_WIDTH = 980;
const TABLET_PORTRAIT_MAX_WIDTH = 1180;
const PALETTE_TWO_COLUMN_THRESHOLD = 16;
const PALETTE_GAP = 3;
const PALETTE_SINGLE_MIN_HEIGHT = 52;
const PALETTE_TWO_COLUMN_TARGET_MIN_HEIGHT = 34;
const PALETTE_TWO_COLUMN_FLOOR_HEIGHT = 18;
const MOBILE_HARMONIZE_PALETTE_GAP = 2;
const MOBILE_HARMONIZE_SINGLE_MIN_HEIGHT = 36;
const MOBILE_HARMONIZE_TWO_COLUMN_TARGET_MIN_HEIGHT = 24;
const MOBILE_HARMONIZE_TWO_COLUMN_FLOOR_HEIGHT = 16;
const SAMPLE_GRID = 72;
const PERCENTAGE_SAMPLE_LONG_EDGE = 96;
const EXPORT_LAYOUT_CURRENT = "current";
const EXPORT_LAYOUT_STRIP = "strip";
const EXPORT_LAYOUT_WHEEL = "wheel";
const EXPORT_LAYOUT_GRADIENT = "gradient";
const EXPORT_WHEEL_ORDER_PALETTE = "palette";
const EXPORT_WHEEL_ORDER_HUE = "hue";
const EXPORT_DEFAULT_LONGEST_EDGE = 2000;
const EXPORT_PREVIEW_LONGEST_EDGE = 1200;
const EXPORT_SIZE_PRESETS = [1000, 2000, 3000, 4000];
const SCROLL_LOCK_SWATCH_DRAG = "swatch-drag";
const SCROLL_LOCK_PALETTE_DRAG = "palette-drag";
const SCROLL_LOCK_PALETTE_DRAWER = "palette-drawer";
const SCROLL_LOCK_SAVE_GRADIENT_DRAG = "save-gradient-drag";
const PALETTE_PREVIEW_PLACEHOLDER_COUNT = 4;
const PALETTE_DRAWER_SETTLE_DELAY_MS = 260;
const HARMONIZE_MIN_NEUTRAL_CHROMA = 4;
const mobileLayoutQuery = window.matchMedia(`(max-width: ${MOBILE_LAYOUT_MAX_WIDTH}px)`);
const tabletPortraitLayoutQuery = window.matchMedia(`(max-width: ${TABLET_PORTRAIT_MAX_WIDTH}px) and (orientation: portrait) and (pointer: coarse)`);
const paletteDrawerId = `palette-drawer-${Math.random().toString(36).slice(2, 10)}`;
const harmonizePanelId = `palette-harmonize-${Math.random().toString(36).slice(2, 10)}`;

paletteDrawerSheet.id = paletteDrawerId;
paletteDrawerOpen.setAttribute("aria-controls", paletteDrawerId);
paletteDrawerClose.setAttribute("aria-controls", paletteDrawerId);
harmonizePanel.id = harmonizePanelId;
harmonizeToggleButtons.forEach((button) => {
  button.setAttribute("aria-controls", harmonizePanelId);
});

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function isRealMobileLayout() {
  const viewportWidth = Math.min(window.innerWidth || Number.MAX_SAFE_INTEGER, window.visualViewport?.width || Number.MAX_SAFE_INTEGER);
  if (mobileLayoutQuery.matches || viewportWidth <= MOBILE_LAYOUT_MAX_WIDTH) {
    return true;
  }
  return tabletPortraitLayoutQuery.matches || (viewportWidth <= TABLET_PORTRAIT_MAX_WIDTH && window.innerHeight > window.innerWidth && navigator.maxTouchPoints > 0);
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

function labToRgbWithGamutInfo(lab) {
  const fy = (lab.l + 16) / 116;
  const fx = fy + (lab.a / 500);
  const fz = fy - (lab.b / 200);
  const fx3 = fx ** 3;
  const fy3 = fy ** 3;
  const fz3 = fz ** 3;
  const x = 0.95047 * (fx3 > 0.008856 ? fx3 : (fx - 16 / 116) / 7.787);
  const y = 1.0 * (fy3 > 0.008856 ? fy3 : (fy - 16 / 116) / 7.787);
  const z = 1.08883 * (fz3 > 0.008856 ? fz3 : (fz - 16 / 116) / 7.787);
  const linearR = (x * 3.2404542) + (y * -1.5371385) + (z * -0.4985314);
  const linearG = (x * -0.969266) + (y * 1.8760108) + (z * 0.041556);
  const linearB = (x * 0.0556434) + (y * -0.2040259) + (z * 1.0572252);
  return {
    rgb: {
      r: linearToSrgb(clamp(linearR, 0, 1)),
      g: linearToSrgb(clamp(linearG, 0, 1)),
      b: linearToSrgb(clamp(linearB, 0, 1)),
    },
    clipped: linearR < 0 || linearR > 1 || linearG < 0 || linearG > 1 || linearB < 0 || linearB > 1,
  };
}

function labToRgb(lab) {
  return labToRgbWithGamutInfo(lab).rgb;
}

function labToLch(lab) {
  const c = Math.sqrt((lab.a ** 2) + (lab.b ** 2));
  const h = (Math.atan2(lab.b, lab.a) * 180 / Math.PI + 360) % 360;
  return { l: lab.l, c, h };
}

function lchToLab(lch) {
  const radians = (lch.h * Math.PI) / 180;
  return {
    l: lch.l,
    a: lch.c * Math.cos(radians),
    b: lch.c * Math.sin(radians),
  };
}

function wrapHueDistance(value) {
  return ((value + 180) % 360 + 360) % 360 - 180;
}

function getCircularHueDistance(left, right) {
  return Math.abs(wrapHueDistance(left - right));
}

function interpolateHue(from, to, amount) {
  return (from + wrapHueDistance(to - from) * amount + 360) % 360;
}

function median(values) {
  if (!values.length) return 0;
  const sorted = [...values].sort((left, right) => left - right);
  const middle = Math.floor(sorted.length / 2);
  if (sorted.length % 2) return sorted[middle];
  return (sorted[middle - 1] + sorted[middle]) / 2;
}

function clonePaletteColors(colors) {
  return colors.map((color) => ({ ...color }));
}

function syncHarmonizeSourceColors(colors = state.colors) {
  state.harmonize.sourceColors = clonePaletteColors(colors);
}

function getHarmonyOffsets(selectedScheme) {
  switch (selectedScheme) {
    case "complementary":
      return [0, 180];
    case "split-complementary":
      return [0, 150, 210];
    case "triadic":
      return [0, 120, 240];
    case "tetradic":
      return [0, 90, 180, 270];
    case "monochromatic":
      return [0];
    case "analogous":
    default:
      return [0, 30, -30];
  }
}

function getHarmonyTargets(anchorHue, scheme) {
  return getHarmonyOffsets(scheme).map((offset) => (anchorHue + offset + 360) % 360);
}

function getNearestTargetHue(hue, targets) {
  return targets.reduce((best, target) => {
    const distance = getCircularHueDistance(hue, target);
    if (!best || distance < best.distance) {
      return { target, distance };
    }
    return best;
  }, null);
}

function isNearNeutral(lch) {
  return lch.c < HARMONIZE_MIN_NEUTRAL_CHROMA;
}

function limitLabDelta(sourceLab, targetLab, budget) {
  const distance = deltaE(sourceLab, targetLab);
  if (distance <= budget || distance === 0) {
    return { lab: targetLab, limited: false };
  }

  const ratio = budget / distance;
  return {
    lab: {
      l: sourceLab.l + (targetLab.l - sourceLab.l) * ratio,
      a: sourceLab.a + (targetLab.a - sourceLab.a) * ratio,
      b: sourceLab.b + (targetLab.b - sourceLab.b) * ratio,
    },
    limited: true,
  };
}

function createHarmonizedColor(inputColor, rgb) {
  return {
    ...inputColor,
    r: rgb.r,
    g: rgb.g,
    b: rgb.b,
    hex: rgbToHex(rgb.r, rgb.g, rgb.b),
  };
}

function improvePalette(colors, options = {}) {
  if (!colors.length) {
    return {
      outputColors: [],
      anchorId: null,
      paletteMetrics: {
        meanHarmonyErrorBefore: 0,
        meanHarmonyErrorAfter: 0,
        meanDeltaE: 0,
      },
      perColorMetrics: [],
      warnings: [],
    };
  }

  const scheme = HARMONIZE_SCHEMES.some((entry) => entry.id === options.scheme) ? options.scheme : HARMONIZE_DEFAULT_SCHEME;
  const strength = clamp(Number(options.strength ?? HARMONIZE_DEFAULT_STRENGTH), 0, 100);
  const saturation = clamp(Number(options.saturation ?? HARMONIZE_DEFAULT_SATURATION), -100, 100);
  const brightness = clamp(Number(options.brightness ?? HARMONIZE_DEFAULT_BRIGHTNESS), -100, 100);
  const t = strength / 100;
  const satT = saturation / 100;
  const brightT = brightness / 100;
  const hueSnapStrength = 0.28 + (0.72 * t);
  const maxDelta = 4 + (14 * t);
  const lockedIds = options.lockedIds instanceof Set ? options.lockedIds : new Set(options.lockedIds || []);
  const preferredAnchorId = typeof options.anchorId === "string" ? options.anchorId : "";
  const records = colors.map((color) => {
    const lab = rgbToLab(color);
    const lch = labToLch(lab);
    return {
      color,
      lab,
      lch,
      locked: lockedIds.has(color.id),
      nearNeutral: isNearNeutral(lch),
    };
  });
  const chromaticRecords = records.filter((record) => !record.nearNeutral);
  const anchorRecord = records.find((record) => record.color.id === preferredAnchorId) || records.find((record) => record.locked) || chromaticRecords.reduce((best, record) => {
    if (!best || record.lch.c > best.lch.c) return record;
    return best;
  }, null) || records[0];
  const anchorId = anchorRecord ? anchorRecord.color.id : null;
  const targets = getHarmonyTargets(anchorRecord?.lch.h ?? 0, scheme);
  const medianChroma = median(chromaticRecords.map((record) => record.lch.c)) || median(records.map((record) => record.lch.c));
  const medianLightness = median(records.map((record) => record.lch.l));
  const warnings = [];
  let harmonyBeforeTotal = 0;
  let harmonyAfterTotal = 0;
  let harmonyCount = 0;
  let deltaTotal = 0;

  const perColorMetrics = records.map((record) => {
    const nearestBefore = record.nearNeutral ? { distance: 0, target: record.lch.h } : getNearestTargetHue(record.lch.h, targets);
    let nextLch = { ...record.lch };
    const notes = [];

    if (record.locked) {
      notes.push("locked colour preserved");
    } else {
      if (!record.nearNeutral) {
        nextLch.h = interpolateHue(record.lch.h, nearestBefore.target, hueSnapStrength);
        notes.push(`moved toward ${scheme} harmony`);
      }

      const chromaWeight = record.nearNeutral ? 0.1 : 0.22;
      nextLch.c = Math.max(0, record.lch.c + ((medianChroma - record.lch.c) * chromaWeight));
      nextLch.l = clamp(record.lch.l + ((medianLightness - record.lch.l) * 0.18), 0, 100);
      const saturationWeight = record.nearNeutral ? 0.2 : 1;
      nextLch.c = Math.max(0, nextLch.c * (1 + ((0.8 * satT) * saturationWeight)));
      nextLch.l = clamp(nextLch.l + (20 * brightT), 0, 100);
    }

    const limited = limitLabDelta(record.lab, lchToLab(nextLch), maxDelta);
    let finalLab = limited.lab;
    let gamutResult = labToRgbWithGamutInfo(finalLab);
    if (gamutResult.clipped) {
      finalLab = rgbToLab(gamutResult.rgb);
      notes.push("clipped back into sRGB gamut");
    }
    const finalRgb = gamutResult.rgb;
    const finalColor = createHarmonizedColor(record.color, finalRgb);
    const finalLch = labToLch(rgbToLab(finalRgb));
    const nearestAfter = record.nearNeutral ? { distance: 0 } : getNearestTargetHue(finalLch.h, targets);
    const finalDelta = deltaE(record.lab, rgbToLab(finalRgb));
    const changed = finalColor.hex !== record.color.hex;

    if (limited.limited) {
      notes.push("edit budget capped stronger harmonising");
    }
    if (!changed) {
      notes.push(record.locked ? "no edit applied" : "change stayed within the original palette");
    }
    if (record.nearNeutral) {
      notes.push("near-neutral hue preserved");
    }

    if (!record.nearNeutral) {
      harmonyBeforeTotal += nearestBefore.distance;
      harmonyAfterTotal += nearestAfter.distance;
      harmonyCount += 1;
    }
    deltaTotal += finalDelta;

    return {
      inputHex: record.color.hex,
      outputHex: finalColor.hex,
      colorId: record.color.id,
      locked: record.locked,
      nearNeutral: record.nearNeutral,
      anchor: record.color.id === anchorId,
      changed,
      deltaE: finalDelta,
      harmonyErrorBefore: nearestBefore.distance,
      harmonyErrorAfter: nearestAfter.distance,
      notes,
      outputColor: finalColor,
    };
  });

  if (!chromaticRecords.length) {
    warnings.push("The palette is mostly neutral, so harmonise can only make very subtle changes.");
  }
  if (perColorMetrics.some((entry) => entry.notes.includes("edit budget capped stronger harmonising"))) {
    warnings.push("Some colours hit the edit budget before reaching the strongest harmony target.");
  }
  if (perColorMetrics.some((entry) => entry.notes.includes("clipped back into sRGB gamut"))) {
    warnings.push("At least one preview colour was clipped to stay inside the sRGB display gamut.");
  }

  return {
    outputColors: perColorMetrics.map((entry) => entry.outputColor),
    anchorId,
    paletteMetrics: {
      meanHarmonyErrorBefore: harmonyCount ? harmonyBeforeTotal / harmonyCount : 0,
      meanHarmonyErrorAfter: harmonyCount ? harmonyAfterTotal / harmonyCount : 0,
      meanDeltaE: perColorMetrics.length ? deltaTotal / perColorMetrics.length : 0,
    },
    perColorMetrics,
    warnings,
  };
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
  const starterFallbackHex = source === "starter" ? toHexOrEmpty(paint.approx_srgb_hex) : "";
  const explicitHex = source === "starter" ? "" : toHexOrEmpty(paint.approx_srgb_hex);
  const proxy = explicitHex ? null : getPaintProxy(pigmentCodes);
  const catalogColor = explicitHex ? null : getCatalogColorForPaint({ ...paint, color_name: colorName, pigment_codes: pigmentCodes });
  const approxHex = getResolvedPaintSwatchHex({ ...paint, color_name: colorName, pigment_codes: pigmentCodes }, { explicitHex, fallbackHex: starterFallbackHex, proxy });
  const modelSource = explicitHex
    ? (source === "starter" ? "starter_demo" : "inventory_swatch")
    : (catalogColor
      ? (source === "starter" ? "starter_catalog" : "catalog_match")
      : (starterFallbackHex ? "starter_demo" : (proxy ? `proxy_${proxy.matchClass}` : "missing_proxy")));
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

const WILLIAMSBURG_CATALOG =
/* WILLIAMSBURG_CATALOG_START */
{"source":"Golden Artist Colors Williamsburg oil color catalog","generated_at":"2026-03-16T20:28:19+00:00","active_color_count":173,"colors":[{"color_name":"Brilliant Yellow Extra Pale","item_number":"6000202","series":"2","hue_group":"1","hue_value":10000100,"pigment_codes":null,"lab":{"L":96.32,"a":-1.25,"b":11.25},"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6000202-brilliant-yellow-exta-pale.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6000202-brilliant-yellow-exta-pale.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6000202-brilliant-yellow-extra-pale-1000px.webp"},{"color_name":"Brilliant Yellow Pale","item_number":"6000212","series":"2","hue_group":"1","hue_value":10000200,"pigment_codes":null,"lab":{"L":94.92,"a":-1.33,"b":33.41},"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6000212-brilliant-yellow-pale.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6000212-brilliant-yellow-pale.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6000212-brilliant-yellow-pale-1000px.webp"},{"color_name":"Nickel Yellow","item_number":"6000224","series":"4","hue_group":"1","hue_value":10000300,"pigment_codes":null,"lab":{"L":85.89,"a":-6.46,"b":61.11},"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6000224-nickel-yellow.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6000224-nickel-yellow.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6000224-nickel-yellow-1000px.webp"},{"color_name":"Bismuth Vanadate Yellow","item_number":"6001929","series":"7","hue_group":"1","hue_value":10004000,"pigment_codes":null,"lab":{"L":90.14,"a":-2.02,"b":99.47},"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6001929-Bismuth-Vanadate-Yellow-100px.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6001929-Bismuth-Vanadate-Yellow-400px.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6001929-bismuth-vanadate-yellow-1000px.webp"},{"color_name":"Cadmium Lemon","item_number":"6000246","series":"6","hue_group":"1","hue_value":10004400,"pigment_codes":null,"lab":{"L":89.99,"a":-8.36,"b":94.94},"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6000246-cadmium-lemon.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6000246-cadmium-lemon.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6000246-cadmium-lemon-1000px.webp"},{"color_name":"Permanent Lemon","item_number":"6000263","series":"3","hue_group":"1","hue_value":10004800,"pigment_codes":null,"lab":{"L":86.66,"a":-4.96,"b":97.05},"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6000263-permanent-lemon.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6000263-permanent-lemon.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6000263-permanent-lemon-1000px.webp"},{"color_name":"Cadmium Yellow Light","item_number":"6000286","series":"6","hue_group":"1","hue_value":10005000,"pigment_codes":null,"lab":{"L":87.77,"a":1.66,"b":108.96},"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6000286-cadmium-yellow-light.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6000286-cadmium-yellow-light.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6000286-cadmium-yellow-light-1000px.webp"},{"color_name":"Permanent Yellow Light","item_number":"6000303","series":"3","hue_group":"1","hue_value":10006000,"pigment_codes":["PY3"],"lab":{"L":87.66,"a":-0.47,"b":105.55},"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6000303-permanent-yellow-light.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6000303-permanent-yellow-light.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6000303-permanent-yellow-light-1000px.webp"},{"color_name":"Permanent Yellow Medium","item_number":"6000383","series":"3","hue_group":"1","hue_value":10010000,"pigment_codes":null,"lab":{"L":82.39,"a":17.65,"b":112.46},"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6000383-permanent-yellow-medium.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6000383-permanent-yellow-medium.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6000383-permanent-yellow-medium-1000px.webp"},{"color_name":"Cadmium Yellow Medium","item_number":"6000366","series":"6","hue_group":"1","hue_value":10012000,"pigment_codes":null,"lab":{"L":83.08,"a":16.8,"b":111.85},"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6000366-cadmium-yellow-medium.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6000366-cadmium-yellow-medium.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6000366-cadmium-yellow-medium-1000px.webp"},{"color_name":"Nickel Azo Yellow","item_number":"6001928","series":"6","hue_group":"1","hue_value":10014000,"pigment_codes":null,"lab":{"L":31.26,"a":3.01,"b":31.69},"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6001928-Nickel-Azo-Yellow-100px.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6001928-Nickel-Azo-Yellow-400px.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6001928-nickel-azo-1000px.webp"},{"color_name":"India Yellow","item_number":"6000524","series":"3","hue_group":"1","hue_value":10014500,"pigment_codes":null,"lab":null,"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6000524-indian-yellow.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6000524-indian-yellow.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6000524-indian-yellow-1000px.webp"},{"color_name":"Permanent Yellow Deep","item_number":"6000423","series":"3","hue_group":"1","hue_value":10016000,"pigment_codes":["PY65"],"lab":{"L":70.5,"a":46.69,"b":105.95},"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6000423-permanent-yellow-deep.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6000423-permanent-yellow-deep.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6000423-permanent-yellow-deep-1000px.webp"},{"color_name":"Cadmium Yellow Deep","item_number":"6000406","series":"6","hue_group":"1","hue_value":10016200,"pigment_codes":null,"lab":{"L":76.43,"a":30.57,"b":106.34},"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6000406-cadmium-yellow-deep.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6000406-cadmium-yellow-deep.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6000406-cadmium-yellow-deep-1000px.webp"},{"color_name":"Cadmium Yellow Extra Deep","item_number":"6000416","series":"6","hue_group":"1","hue_value":10016500,"pigment_codes":null,"lab":{"L":67.92,"a":49.15,"b":98.67},"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6000416-cadmium-yellow-extra-deep.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6000416-cadmium-yellow-extra-deep.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6000416-cadmium-yellow-extra-deep-1000px.webp"},{"color_name":"Naples Yellow Italian","item_number":"6000461","series":"2","hue_group":"1","hue_value":10017000,"pigment_codes":null,"lab":{"L":80.41,"a":12.81,"b":52.07},"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6000461-naples-yellow-italian.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6000461-naples-yellow-italian.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6000461-naples-yellow-italian-1000px.webp"},{"color_name":"Naples Yellow Reddish","item_number":"6000422","series":"2","hue_group":"1","hue_value":10017500,"pigment_codes":null,"lab":{"L":73.58,"a":22.17,"b":40.71},"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6000422-naples-yellow-reddish.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6000422-naples-yellow-reddish.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6000422-naples-yellow-reddish-1000px.webp"},{"color_name":"Canton Rose","item_number":"6000744","series":"4","hue_group":"1","hue_value":10018000,"pigment_codes":null,"lab":{"L":65.42,"a":23.24,"b":18.34},"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6000744-canton-rose.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6000744-canton-rose.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6000744-canton-rose-1000px.webp"},{"color_name":"Jaune Brilliant","item_number":"6000463","series":"2","hue_group":"1","hue_value":10018500,"pigment_codes":null,"lab":{"L":79.68,"a":14.52,"b":39.01},"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6000463-jaune-brilliant.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6000463-jaune-brilliant.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6000463-jaune-brilliant-1000px.webp"},{"color_name":"Montserrat Orange","item_number":"6000583","series":"3","hue_group":"1","hue_value":10019000,"pigment_codes":null,"lab":{"L":67.45,"a":36.29,"b":34.36},"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6000583-montserrat-orange.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6000583-montserrat-orange.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6000583-montserrat-orange-1000px.webp"},{"color_name":"Alizarin Yellow","item_number":"6000514","series":"4","hue_group":"1","hue_value":10020000,"pigment_codes":null,"lab":{"L":57.45,"a":32.42,"b":86.68},"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6000514-alizarin-yellow.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6000514-alizarin-yellow.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6000514-alizarin-yellow-1000px.webp"},{"color_name":"Unbleached Titanium Pale","item_number":"6000191","series":"1","hue_group":"1","hue_value":10172900,"pigment_codes":null,"lab":{"L":80.1,"a":1.45,"b":13.32},"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6000191-unbleached-titanium-pale.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6000191-unbleached-titanium-pale.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6000191-unbleached-titanium-pale-1000px.webp"},{"color_name":"Unbleached Titanium","item_number":"6000181","series":"1","hue_group":"1","hue_value":10173100,"pigment_codes":null,"lab":{"L":75.34,"a":2.46,"b":19.65},"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6000181-unbleached-titanium.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6000181-unbleached-titanium.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6000181-unbleached-titanium-1000px.webp"},{"color_name":"Cadmium Orange","item_number":"6000546","series":"6","hue_group":"2","hue_value":20020000,"pigment_codes":null,"lab":{"L":61.2,"a":55.6,"b":86.32},"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6000546-cadmium-orange.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6000546-cadmium-orange.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6000546-cadmium-orange-1000px.webp"},{"color_name":"Permanent Orange","item_number":"6000542","series":"4","hue_group":"2","hue_value":20020500,"pigment_codes":null,"lab":{"L":51.85,"a":52.23,"b":68.43},"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6000542-permanent-orange.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6000542-permanent-orange.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6000542-permanent-orange-1000px.webp"},{"color_name":"Alizarin Orange","item_number":"6000534","series":"4","hue_group":"2","hue_value":20021000,"pigment_codes":null,"lab":{"L":44.36,"a":51.27,"b":64.84},"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6000534-alizarin-orange.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6000534-alizarin-orange.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6000534-alizarin-orange-1000px.webp"},{"color_name":"Permanent Red-Orange","item_number":"6000563","series":"3","hue_group":"2","hue_value":20021000,"pigment_codes":null,"lab":{"L":44.23,"a":57.91,"b":63.31},"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6000563-permanent-red-orange.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6000563-permanent-red-orange.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6000563-permanent-red-orange-1000px.webp"},{"color_name":"Pyrrole Orange","item_number":"6001927","series":"7","hue_group":"2","hue_value":20021500,"pigment_codes":null,"lab":{"L":52.33,"a":64.02,"b":74.85},"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6001927-Pyrrole-Orange-100px.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6001927-Pyrrole-Orange-400px.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6001927-pyrrole-orange-1000px.webp"},{"color_name":"Cadmium Red Vermilion","item_number":"6000597","series":"7","hue_group":"2","hue_value":20021500,"pigment_codes":null,"lab":{"L":48.69,"a":63.87,"b":65.68},"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6000597-cadmium-red-vermilion.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6000597-cadmium-red-vermilion.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6000597-cadmium-red-vermilion-1000px.webp"},{"color_name":"Cadmium Red Light","item_number":"6000587","series":"7","hue_group":"2","hue_value":20022000,"pigment_codes":null,"lab":{"L":51.19,"a":64.23,"b":70.2},"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6000587-cadmium-red-light.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6000587-cadmium-red-light.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6000587-cadmium-red-light-1000px.webp"},{"color_name":"Fanchon Red","item_number":"6000624","series":"4","hue_group":"2","hue_value":20022000,"pigment_codes":null,"lab":{"L":39.76,"a":62.8,"b":59.63},"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6000624-fanchon-red.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6000624-fanchon-red.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6000624-fanchon-red-1000px.webp"},{"color_name":"Pyrrole Red","item_number":"6001925","series":"4","hue_group":"2","hue_value":20027000,"pigment_codes":["PR254"],"lab":{"L":36.73,"a":63.15,"b":54.86},"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6001925-Pyrrole-Red-100px.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6001925-Pyrrole-Red-400px.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6001925-pyrrole-red-1000px.webp"},{"color_name":"Cadmium Red Medium","item_number":"6000607","series":"7","hue_group":"2","hue_value":20027500,"pigment_codes":null,"lab":{"L":39.08,"a":60.78,"b":48.2},"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6000607-cadmium-red-medium.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6000607-cadmium-red-medium.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6000607-cadmium-red-medium-1000px.webp"},{"color_name":"Cadmium Red Deep","item_number":"6000647","series":"7","hue_group":"2","hue_value":20029000,"pigment_codes":null,"lab":{"L":30.41,"a":52.61,"b":32.71},"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6000647-cadmium-red-deep.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6000647-cadmium-red-deep.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6000647-cadmium-red-deep-1000px.webp"},{"color_name":"Cadmium Red Purple","item_number":"6000657","series":"7","hue_group":"2","hue_value":20030000,"pigment_codes":null,"lab":{"L":25.94,"a":46.2,"b":26.51},"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6000657-cadmium-red-purple.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6000657-cadmium-red-purple.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6000657-cadmium-red-purple-1000px.webp"},{"color_name":"Cadmium Purple","item_number":"6000658","series":"8","hue_group":"2","hue_value":20030500,"pigment_codes":null,"lab":{"L":20.87,"a":36.48,"b":19.14},"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6000658-cadmium-purple.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6000658-cadmium-purple.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6000658-cadmium-purple-1000px.webp"},{"color_name":"Quinacridone Red","item_number":"6000665","series":"5","hue_group":"2","hue_value":20036000,"pigment_codes":null,"lab":{"L":31.61,"a":53.23,"b":32.93},"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6000665-quinacridone-red.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6000665-quinacridone-red.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6000665-quinacridone-red-1000px.webp"},{"color_name":"Quinacridone Magenta","item_number":"6000775","series":"5","hue_group":"2","hue_value":20040000,"pigment_codes":["PR122"],"lab":{"L":19.37,"a":31.88,"b":9.36},"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6000775-quinacridone-magenta.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6000775-quinacridone-magenta.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6000775-quinacridone-magenta-1000px.webp"},{"color_name":"Carl\u0027s Crimson (Permanent)","item_number":"6000685","series":"5","hue_group":"2","hue_value":20040500,"pigment_codes":null,"lab":null,"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6000685-carl-s-crimson.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6000685-carl-s-crimson.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6000685-carls-crimson-1000px.webp"},{"color_name":"Permanent Crimson","item_number":"6000687","series":"6","hue_group":"2","hue_value":20041000,"pigment_codes":null,"lab":{"L":15.78,"a":44.79,"b":23.48},"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6000687-permanent-crimson.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6000687-permanent-crimson.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6000687-permanent-crimson-1000px.webp"},{"color_name":"Quinacridone Violet","item_number":"6000785","series":"5","hue_group":"2","hue_value":20042000,"pigment_codes":null,"lab":{"L":15.17,"a":34.72,"b":8.96},"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6000785-quinacridone-violet.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6000785-quinacridone-violet.webp","handpainted_card_url":""},{"color_name":"Perylene Crimson","item_number":"6000686","series":"6","hue_group":"2","hue_value":20042100,"pigment_codes":null,"lab":{"L":14.96,"a":22.86,"b":11},"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6000686-perylene-crimson.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6000686-perylene-crimson.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6000686-perylene-crimson-1000px.webp"},{"color_name":"Persian Rose","item_number":"6000713","series":"2","hue_group":"2","hue_value":20042500,"pigment_codes":null,"lab":{"L":50.65,"a":59.45,"b":24.81},"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6000713-persian-rose.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6000713-persian-rose.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6000713-persian-rose-1000px.webp"},{"color_name":"Dianthus Pink","item_number":"6000724","series":"4","hue_group":"2","hue_value":20043000,"pigment_codes":null,"lab":{"L":78.38,"a":28.91,"b":-7.38},"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6000724-dianthus-pink.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6000724-dianthus-pink.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6000724-dianthus-pink-1000px.webp"},{"color_name":"Cobalt Violet Deep","item_number":"6000748","series":"8","hue_group":"2","hue_value":20044500,"pigment_codes":null,"lab":{"L":15.58,"a":46.22,"b":-40.96},"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6000748-cobalt-violet-deep.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6000748-cobalt-violet-deep.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6000748-cobalt-violet-deep-1000px.webp"},{"color_name":"Provence Violet Reddish","item_number":"6000734","series":"4","hue_group":"2","hue_value":20045000,"pigment_codes":null,"lab":{"L":33.19,"a":39.76,"b":-14.69},"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6000734-provence-violet-reddish.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6000734-provence-violet-reddish.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6000734-provence-violet-reddish-1000px.webp"},{"color_name":"Provence Violet Bluish","item_number":"6000754","series":"4","hue_group":"3","hue_value":30046000,"pigment_codes":null,"lab":{"L":29.87,"a":26.42,"b":-45.99},"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6000754-provence-violet-bluish.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6000754-provence-violet-bluish.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6000754-provence-violet-bluish-1000px.webp"},{"color_name":"Manganese Violet","item_number":"6000704","series":"4","hue_group":"3","hue_value":30046500,"pigment_codes":null,"lab":{"L":12.4,"a":31.87,"b":-25.04},"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6000704-manganese-violet.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6000704-manganese-violet.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6000704-manganese-violet-1000px.webp"},{"color_name":"Ultramarine Violet","item_number":"6000764","series":"3","hue_group":"3","hue_value":30047000,"pigment_codes":null,"lab":{"L":7.68,"a":17.32,"b":-25.45},"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6000764-ultramarine-violet.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6000764-ultramarine-violet.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6000764-ultramarine-violet-1000px.webp"},{"color_name":"Egyptian Violet","item_number":"6000805","series":"5","hue_group":"3","hue_value":30047500,"pigment_codes":["PV23"],"lab":{"L":6.27,"a":1.5,"b":-1.84},"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6000805-egyptian-violet.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6000805-egyptian-violet.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6000805-egyptian-violet-1000px.webp"},{"color_name":"King\u0027s Blue","item_number":"6000813","series":"3","hue_group":"3","hue_value":30048000,"pigment_codes":null,"lab":{"L":70.02,"a":-16.69,"b":-33.46},"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6000813-king-s-blue.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6000813-king-s-blue.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6000813-kings-blue-1000px.webp"},{"color_name":"Sevres Blue","item_number":"6000823","series":"3","hue_group":"3","hue_value":30048500,"pigment_codes":null,"lab":{"L":55.06,"a":-21.6,"b":-41.64},"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6000823-sevres-blue.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6000823-sevres-blue.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6000823-sevres-blue-1000px.webp"},{"color_name":"Cerulean Blue (Genuine)","item_number":"6000848","series":"8","hue_group":"3","hue_value":30049000,"pigment_codes":null,"lab":null,"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6000848-cerulean-blue-genuine.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6000848-cerulean-blue-genuine.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6000848-cerulean-blue-1000px.webp"},{"color_name":"Cobalt Teal Greenish","item_number":"6000786","series":"7","hue_group":"3","hue_value":30049200,"pigment_codes":null,"lab":{"L":53.05,"a":-48.91,"b":-13.02},"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6000786-cobalt-teal-greenish.webp","swatch_lg_url":"","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6000786-cobalt-teal-greenish-1000px.webp"},{"color_name":"Cobalt Teal Bluish","item_number":"6000817","series":"7","hue_group":"3","hue_value":30049300,"pigment_codes":null,"lab":{"L":54.35,"a":-46.55,"b":-20.02},"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6000817-cobalt-teal-bluish.webp","swatch_lg_url":"","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6000817-cobalt-teal-bluish-1000px.webp"},{"color_name":"Cobalt Turquoise Greenish","item_number":"6000887","series":"7","hue_group":"3","hue_value":30049400,"pigment_codes":null,"lab":{"L":35.69,"a":-36.34,"b":-12.05},"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6000887-cobalt-turquoise-greenish.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6000887-cobalt-turquoise-greenish.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6000887-cobalt-turquoise-greenish-1000px.webp"},{"color_name":"Cobalt Turquoise Bluish","item_number":"6000907","series":"7","hue_group":"3","hue_value":30049500,"pigment_codes":null,"lab":{"L":28.99,"a":-20.43,"b":-28.74},"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6000907-cobalt-turquoise-bluish.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6000907-cobalt-turquoise-bluish.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6000907-cobalt-turquoise-bluish-1000px.webp"},{"color_name":"Ultramarine Blue","item_number":"6000942","series":"2","hue_group":"3","hue_value":30050000,"pigment_codes":null,"lab":{"L":4.78,"a":24.88,"b":-37.9},"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6000942-ultramarine-blue.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6000942-ultramarine-blue.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6000942-ultramarine-blue-1000px.webp"},{"color_name":"Cobalt Blue","item_number":"6000927","series":"7","hue_group":"3","hue_value":30052000,"pigment_codes":null,"lab":{"L":26.58,"a":8.91,"b":-49.14},"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6000927-cobalt-blue.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6000927-cobalt-blue.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6000927-cobalt-blue-1000px.webp"},{"color_name":"Cobalt Blue Deep","item_number":"6000937","series":"7","hue_group":"3","hue_value":30052500,"pigment_codes":null,"lab":{"L":26.17,"a":17.72,"b":-55.12},"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6000937-cobalt-blue-deep.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6000937-cobalt-blue-deep.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6000937-cobalt-blue-deep-1000px.webp"},{"color_name":"Ultramarine Blue French","item_number":"6000962","series":"2","hue_group":"3","hue_value":30053000,"pigment_codes":null,"lab":{"L":8.14,"a":20.48,"b":-33.63},"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6000962-ultramarine-blue-french.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6000962-ultramarine-blue-french.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6000962-ultramarine-blue-french-1000px.webp"},{"color_name":"Indanthrone Blue","item_number":"6000985","series":"7","hue_group":"3","hue_value":30054500,"pigment_codes":null,"lab":{"L":4.74,"a":8.7,"b":-8.9},"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6000985-indanthrone-blue.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6000985-indanthrone-blue.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6000985-indanthrone-blue-1000px.webp"},{"color_name":"Prussian Blue","item_number":"6000982","series":"2","hue_group":"3","hue_value":30056000,"pigment_codes":null,"lab":{"L":1.22,"a":1.58,"b":-1.32},"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6000982-prussian-blue.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6000982-prussian-blue.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6000982-prussian-blue-1000px.webp"},{"color_name":"Phthalo Blue","item_number":"6001004","series":"4","hue_group":"3","hue_value":30056500,"pigment_codes":["PB15:3"],"lab":{"L":7.75,"a":22.12,"b":-33.56},"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6001004-phthalo-blue.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6001004-phthalo-blue.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6001004-phthalo-blue-1000px.webp"},{"color_name":"Phthalo Turquoise","item_number":"6001024","series":"4","hue_group":"3","hue_value":30056700,"pigment_codes":null,"lab":{"L":7.62,"a":-5.13,"b":-8.89},"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6001024-phthalo-turquoise.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6001024-phthalo-turquoise.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6001024-phthalo-turquoise-1000px.webp"},{"color_name":"Indigo","item_number":"6001043","series":"3","hue_group":"3","hue_value":30057000,"pigment_codes":null,"lab":{"L":8.04,"a":-2.23,"b":-3.09},"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6001043-indigo.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6001043-indigo.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6001043-indigo-1000px.webp"},{"color_name":"Cerulean Blue French","item_number":"6000857","series":"7","hue_group":"3","hue_value":30061500,"pigment_codes":null,"lab":{"L":29.58,"a":-15.71,"b":-32.11},"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6000857-cerulean-blue-french.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6000857-cerulean-blue-french.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6000857-cerulean-blue-french-1000px.webp"},{"color_name":"Courbet Green","item_number":"6001323","series":"3","hue_group":"4","hue_value":40000100,"pigment_codes":null,"lab":{"L":13.12,"a":-1.97,"b":10.83},"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6001323-courbet-green.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6001323-courbet-green.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6001323-courbet-green-1000px.webp"},{"color_name":"Turquoise","item_number":"6000863","series":"3","hue_group":"4","hue_value":40059500,"pigment_codes":null,"lab":{"L":47.59,"a":-51.77,"b":-2.33},"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6000863-turquoise.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6000863-turquoise.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6000863-turquoise-1000px.webp"},{"color_name":"Veronese Green","item_number":"6001103","series":"3","hue_group":"4","hue_value":40070000,"pigment_codes":null,"lab":{"L":50.51,"a":-59.34,"b":14.09},"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6001103-veronese-green.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6001103-veronese-green.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6001103-veronese-green-1000px.webp"},{"color_name":"Cinnabar Green Light","item_number":"6001153","series":"3","hue_group":"4","hue_value":40070500,"pigment_codes":null,"lab":{"L":62.97,"a":-20.15,"b":60.11},"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6001153-cinnabar-green-light.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6001153-cinnabar-green-light.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6001153-cinnabar-green-light-1000px.webp"},{"color_name":"Cadmium Green Light","item_number":"6001146","series":"6","hue_group":"4","hue_value":40071000,"pigment_codes":null,"lab":{"L":59.55,"a":-36.42,"b":60.52},"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6001146-cadmium-green-light.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6001146-cadmium-green-light.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6001146-cadmium-green-light-1000px.webp"},{"color_name":"Permanent Green Light","item_number":"6001163","series":"3","hue_group":"4","hue_value":40073000,"pigment_codes":null,"lab":{"L":58.94,"a":-61.58,"b":60.7},"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6001163-permanent-green-light.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6001163-permanent-green-light.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6001163-permanent-green-light-1000px.webp"},{"color_name":"Permanent Green","item_number":"6001263","series":"3","hue_group":"4","hue_value":40073500,"pigment_codes":null,"lab":{"L":36.82,"a":-46.17,"b":38.38},"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6001263-permanent-green.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6001263-permanent-green.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6001263-permanent-green-1000px.webp"},{"color_name":"Cobalt Green","item_number":"6001250","series":"6","hue_group":"4","hue_value":40074000,"pigment_codes":null,"lab":{"L":25.98,"a":-27.1,"b":4.47},"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6001250-cobalt-green.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6001250-cobalt-green.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6001250-cobalt-green-1000px.webp"},{"color_name":"Viridian","item_number":"6001245","series":"5","hue_group":"4","hue_value":40074500,"pigment_codes":null,"lab":{"L":21.45,"a":-30.2,"b":1.05},"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6001245-viridian.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6001245-viridian.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6001245-viridian-1000px.webp"},{"color_name":"Phthalo Green-Yellowish","item_number":"6001264","series":"4","hue_group":"4","hue_value":40074700,"pigment_codes":null,"lab":{"L":10.7,"a":-22.08,"b":0.02},"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6001264-phthalo-green-yelloish.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6001264-phthalo-green-yelloish.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6001264-phthalo-green-yellowish-1000px.webp"},{"color_name":"Phthalo Green","item_number":"6001284","series":"4","hue_group":"4","hue_value":40074900,"pigment_codes":["PG7"],"lab":{"L":8.31,"a":-13.77,"b":-6.37},"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6001284-phthalo-green.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6001284-phthalo-green.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6001284-phthalo-green-1000px.webp"},{"color_name":"Sap Green","item_number":"6001303","series":"5","hue_group":"4","hue_value":40075500,"pigment_codes":null,"lab":{"L":17.57,"a":-13.25,"b":8.38},"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6001303-sap-green.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6001303-sap-green.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6001303-sap-green-1000px.webp"},{"color_name":"Cadmium Green","item_number":"6001186","series":"6","hue_group":"4","hue_value":40076000,"pigment_codes":null,"lab":{"L":44.28,"a":-35.29,"b":44.03},"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6001186-cadium-green.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6001186-cadium-green.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6001186-cadmium-green-1000px.webp"},{"color_name":"Chromium Oxide Green","item_number":"6001223","series":"3","hue_group":"4","hue_value":40080000,"pigment_codes":null,"lab":{"L":38.97,"a":-19.81,"b":18.86},"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6001223-chromium-oxide-green.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6001223-chromium-oxide-green.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6001223-chromium-oxide-green-1000px.webp"},{"color_name":"Olive Green","item_number":"6000322","series":"6","hue_group":"4","hue_value":40080500,"pigment_codes":null,"lab":{"L":26.5,"a":-14.12,"b":32.92},"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6000322-olive-green.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6000322-olive-green.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6000322-olive-green-1000px.webp"},{"color_name":"Bohemian Green Earth","item_number":"6001021","series":"2","hue_group":"4","hue_value":40081500,"pigment_codes":null,"lab":{"L":29.78,"a":0.92,"b":16.29},"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6001021-bohemian-green-earth.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6001021-bohemian-green-earth.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6001021-bohemian-green-earth-1000px.webp"},{"color_name":"Earth Green","item_number":"6001122","series":"2","hue_group":"4","hue_value":40082000,"pigment_codes":null,"lab":{"L":32.14,"a":-1.89,"b":15.43},"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6001122-earth-green.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6001122-earth-green.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6001122-earth-green-1000px.webp"},{"color_name":"Green Gold","item_number":"6000518","series":"7","hue_group":"4","hue_value":40083000,"pigment_codes":["PY129"],"lab":{"L":28.67,"a":-7.28,"b":38.39},"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6000518-green-gold.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6000518-green-gold.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6000518-green-gold-1000px.webp"},{"color_name":"Mars Violet","item_number":"6001442","series":"2","hue_group":"5","hue_value":50000100,"pigment_codes":null,"lab":{"L":22.67,"a":25.78,"b":15.2},"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6001442-mars-violet.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6001442-mars-violet.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6001442-mars-violet-1000px.webp"},{"color_name":"Titan Buff","item_number":"6000160","series":"1","hue_group":"5","hue_value":50085000,"pigment_codes":null,"lab":{"L":89.87,"a":4.61,"b":12.28},"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6000160-titan-buff-100px.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6000160-Titan-Buff-400px.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6000160-titan-buff-1000px.webp"},{"color_name":"Naples Yellow","item_number":"6000442","series":"2","hue_group":"1","hue_value":50086000,"pigment_codes":null,"lab":{"L":73.38,"a":13.03,"b":42.45},"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6000442-naples-yellow.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6000442-naples-yellow.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6000442-naples-yellow-1000px.webp"},{"color_name":"Transparent Yellow Iron Oxide","item_number":"6001920","series":"4","hue_group":"5","hue_value":50089000,"pigment_codes":null,"lab":{"L":19.78,"a":9,"b":16.62},"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6001920-Transparent-Yellow-Iron-Oxide-100px.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6001920-Transparent-Yellow-Iron-Oxide-400px.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6001920-transparent-yellow-oxide-1000px.webp"},{"color_name":"Yellow Ochre (Domestic)","item_number":"6001401","series":"1","hue_group":"5","hue_value":50089000,"pigment_codes":null,"lab":null,"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6001401-yellow-ochre-domestic.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6001401-yellow-ochre-domestic.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6001401-yellow-ochre-domestic-1000px.webp"},{"color_name":"Raw Sienna","item_number":"6001501","series":"1","hue_group":"5","hue_value":50090000,"pigment_codes":null,"lab":{"L":44.39,"a":17.98,"b":39.66},"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6001501-raw-sienna.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6001501-raw-sienna.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6001501-raw-sienna-1000px.webp"},{"color_name":"Cyprus Orange","item_number":"6001512","series":"3","hue_group":"5","hue_value":50090000,"pigment_codes":null,"lab":{"L":48.78,"a":21.54,"b":37.5},"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6001512-cyprus-orange.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6001512-cyprus-orange.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6001512-cypress-orange-1000px.webp"},{"color_name":"Stil De Grain","item_number":"6001464","series":"4","hue_group":"5","hue_value":50091500,"pigment_codes":null,"lab":{"L":30.21,"a":7.58,"b":12.19},"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6001464-stil-de-grain.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6001464-stil-de-grain.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6001464-stil-de-grain-1000px.webp"},{"color_name":"Transparent Red Iron Oxide","item_number":"6001922","series":"4","hue_group":"5","hue_value":50093000,"pigment_codes":null,"lab":{"L":12.45,"a":12.89,"b":9.58},"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6001922-Transparent-Red-Iron-Oxide-100px.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6001922-Transparent-Red-Iron-Oxide-400px.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6001922-transparent-red-oxide-1000px.webp"},{"color_name":"Brown Pink","item_number":"6001484","series":"4","hue_group":"5","hue_value":50093500,"pigment_codes":null,"lab":{"L":21.1,"a":11.34,"b":8.98},"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6001484-brown-pink.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6001484-brown-pink.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6001484-brown-pink-1000px.webp"},{"color_name":"Italian Pink","item_number":"6001474","series":"4","hue_group":"5","hue_value":50094500,"pigment_codes":null,"lab":{"L":25.09,"a":8.49,"b":7.22},"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6001474-italian-pink.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6001474-italian-pink.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6001474-italian-pink-1000px.webp"},{"color_name":"Van Dyke Brown","item_number":"6001680","series":"1","hue_group":"5","hue_value":50095300,"pigment_codes":null,"lab":{"L":13.24,"a":0.35,"b":0.36},"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6001680-van-dyke-brown.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6001680-van-dyke-brown.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6001680-van-dyke-brown-1000px.webp"},{"color_name":"Burnt Sienna","item_number":"6001521","series":"1","hue_group":"5","hue_value":50097000,"pigment_codes":null,"lab":{"L":25.87,"a":23.89,"b":23.2},"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6001521-burnt-sienna.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6001521-burnt-sienna.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6001521-burnt-sienna-1000px.webp"},{"color_name":"Yellow Ochre Burnt","item_number":"6001541","series":"1","hue_group":"5","hue_value":50097500,"pigment_codes":null,"lab":{"L":41.66,"a":11.67,"b":22.01},"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6001541-yellow-ochre-burnt.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6001541-yellow-ochre-burnt.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6001541-yellow-ochre-burnt-1000px.webp"},{"color_name":"Brown Ochre","item_number":"6001561","series":"1","hue_group":"5","hue_value":50097700,"pigment_codes":null,"lab":{"L":38.43,"a":9.86,"b":23.34},"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6001561-brown-ochre.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6001561-brown-ochre.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6001561-brown-ochre-1000px.webp"},{"color_name":"Red Ochre","item_number":"6001581","series":"1","hue_group":"5","hue_value":50097900,"pigment_codes":null,"lab":{"L":32.64,"a":23.68,"b":19.89},"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6001581-red-ochre.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6001581-red-ochre.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6001581-red-ochre-1000px.webp"},{"color_name":"Spanish Earth","item_number":"6001601","series":"1","hue_group":"5","hue_value":50098100,"pigment_codes":null,"lab":{"L":23.27,"a":13.21,"b":6.79},"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6001601-spanish-earth.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6001601-spanish-earth.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6001601-spanish-earth-1000px.webp"},{"color_name":"Mars Yellow Light","item_number":"6001342","series":"2","hue_group":"5","hue_value":50098300,"pigment_codes":null,"lab":{"L":55.25,"a":17.38,"b":54.18},"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6001342-mars-yellow-light.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6001342-mars-yellow-light.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6001342-mars-yellow-light-1000px.webp"},{"color_name":"Mars Yellow Deep","item_number":"6001362","series":"2","hue_group":"5","hue_value":50098500,"pigment_codes":null,"lab":{"L":47.17,"a":20.44,"b":43.69},"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6001362-mars-yellow-deep.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6001362-mars-yellow-deep.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6001362-mars-yellow-deep-1000px.webp"},{"color_name":"Mars Orange","item_number":"6001382","series":"2","hue_group":"5","hue_value":50098700,"pigment_codes":null,"lab":{"L":41.87,"a":26.74,"b":31.11},"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6001382-mars-orange.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6001382-mars-orange.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6001382-mars-orange-1000px.webp"},{"color_name":"Mars Red Light","item_number":"6001402","series":"2","hue_group":"5","hue_value":50098900,"pigment_codes":null,"lab":{"L":30.31,"a":32.28,"b":31.26},"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6001402-mars-red-light.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6001402-mars-red-light.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6001402-mars-red-light-1000px.webp"},{"color_name":"Mars Red","item_number":"6001422","series":"2","hue_group":"5","hue_value":50099000,"pigment_codes":null,"lab":{"L":26.64,"a":31.86,"b":23.9},"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6001422-mars-red.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6001422-mars-red.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6001422-mars-red-1000px.webp"},{"color_name":"Burnt Umber","item_number":"6001661","series":"1","hue_group":"5","hue_value":50099200,"pigment_codes":null,"lab":{"L":18.68,"a":3.5,"b":6.17},"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6001661-burnt-umber.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6001661-burnt-umber.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6001661-burnt-umber-1000px.webp"},{"color_name":"Raw Umber","item_number":"6001621","series":"1","hue_group":"5","hue_value":50099300,"pigment_codes":null,"lab":{"L":18.68,"a":0.42,"b":7.03},"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6001621-raw-umber.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6001621-raw-umber.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6001621-raw-umber-1000px.webp"},{"color_name":"Brown Umber (Natural)","item_number":"6001631","series":"1","hue_group":"5","hue_value":50099400,"pigment_codes":null,"lab":null,"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6001631-brown-umber.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6001631-brown-umber.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6001631-brown-umber-1000px.webp"},{"color_name":"Dutch Brown (Transparent)","item_number":"6001494","series":"4","hue_group":"5","hue_value":50100500,"pigment_codes":null,"lab":{"L":23.85,"a":2.79,"b":2.96},"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6001494-dutch-brown-transparent.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6001494-dutch-brown-transparent.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6001494-dutch-brown-1000px.webp"},{"color_name":"Turkey Umber","item_number":"6001641","series":"1","hue_group":"5","hue_value":50101500,"pigment_codes":null,"lab":{"L":16.82,"a":-3.06,"b":6.07},"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6001641-turkey-umber.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6001641-turkey-umber.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6001641-turkey-umber-1000px.webp"},{"color_name":"Red Umber","item_number":"6001671","series":"1","hue_group":"5","hue_value":50102000,"pigment_codes":null,"lab":{"L":17.33,"a":10.49,"b":12.37},"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6001671-red-umber.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6001671-red-umber.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6001671-red-umber-1000px.webp"},{"color_name":"German Earth","item_number":"6001792","series":"2","hue_group":"5","hue_value":50103500,"pigment_codes":null,"lab":{"L":20.37,"a":0.16,"b":0.24},"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6001792-german-earth.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6001792-german-earth.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6001792-german-earth-1000px.webp"},{"color_name":"Mars Black","item_number":"6001742","series":"2","hue_group":"6","hue_value":60104000,"pigment_codes":null,"lab":{"L":8.73,"a":0.77,"b":0.94},"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6001742-mars-black.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6001742-mars-black.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6001742-mars-black-1000px.webp"},{"color_name":"Ivory Black","item_number":"6001721","series":"1","hue_group":"6","hue_value":60104500,"pigment_codes":null,"lab":{"L":10.83,"a":-0.03,"b":-0.34},"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6001721-ivory-black.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6001721-ivory-black.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6001721-ivory-black-1000px.webp"},{"color_name":"Davy\u0027s Gray Deep","item_number":"6001701","series":"1","hue_group":"6","hue_value":60105000,"pigment_codes":null,"lab":null,"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6001701-davy-s-grey-deep.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6001701-davy-s-grey-deep.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6001701-daveys-grey-deep-1000px.webp"},{"color_name":"Graphite Gray","item_number":"6001702","series":"1","hue_group":"6","hue_value":60106000,"pigment_codes":null,"lab":null,"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6001702-graphite-grey.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6001702-graphite-grey.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6001702-graphite-gray-1000px.webp"},{"color_name":"Payne\u0027s Gray (Violet)","item_number":"6001063","series":"2","hue_group":"6","hue_value":60106500,"pigment_codes":null,"lab":null,"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6001063-payne-s-grey-violet.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6001063-payne-s-grey-violet.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6001063-paynes-gray-violet-1000px.webp"},{"color_name":"Payne\u0027s Gray","item_number":"6001703","series":"2","hue_group":"6","hue_value":60107000,"pigment_codes":null,"lab":null,"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6001703-payne-s-grey.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6001703-payne-s-grey.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6001703-paynes-gray-1000px.webp"},{"color_name":"Lamp Black","item_number":"6001761","series":"1","hue_group":"6","hue_value":60107200,"pigment_codes":null,"lab":{"L":14.54,"a":-0.03,"b":-0.45},"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6001761-lamp-black.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6001761-lamp-black.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6001761-lamp-black-1000px.webp"},{"color_name":"Cold Black","item_number":"6001732","series":"2","hue_group":"6","hue_value":60107400,"pigment_codes":null,"lab":{"L":5.2,"a":-0.06,"b":-1.91},"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6001732-cold-black.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6001732-cold-black.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6001732-cold-black-1000px.webp"},{"color_name":"Flake White","item_number":"6000104","series":"6","hue_group":"6","hue_value":60107600,"pigment_codes":null,"lab":{"L":96.73,"a":-0.22,"b":2.68},"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6000104-flake-white.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6000104-flake-white.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6000104-flake-white-1000px.webp"},{"color_name":"Titanium - Zinc White","item_number":"6000121","series":"1","hue_group":"6","hue_value":60107800,"pigment_codes":null,"lab":{"L":98.37,"a":-0.98,"b":2.76},"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6000121-titanium-zinc-white.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6000121-titanium-zinc-white.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6000121-titanium-zinc-white-1000px.webp"},{"color_name":"Zinc White","item_number":"6000141","series":"1","hue_group":"6","hue_value":60108000,"pigment_codes":null,"lab":{"L":96.9,"a":-0.88,"b":2.24},"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6000141-zinc-white.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6000141-zinc-white.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6000141-zinc-white-1000px.webp"},{"color_name":"Titanium White","item_number":"6000101","series":"1","hue_group":"6","hue_value":60109000,"pigment_codes":["PW6"],"lab":{"L":98.24,"a":-0.99,"b":2.58},"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6000101-titanium-white.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6000101-titanium-white.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6000101-titanium-white-1000px.webp"},{"color_name":"French Terre Verte","item_number":"6000052","series":"4","hue_group":"6","hue_value":60110000,"pigment_codes":null,"lab":{"L":34.48,"a":-14.93,"b":5.32},"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6000052-french-terre-verte.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6000052-french-terre-verte.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6000052-french-terre-verte-1000px.webp"},{"color_name":"N2 Neutral Gray","item_number":"6001912","series":"1","hue_group":"6","hue_value":60110000,"pigment_codes":null,"lab":null,"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6001912-Neutral-Gray-N2-100px.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6001912-Neutral-Gray-N2-400px.webp","handpainted_card_url":""},{"color_name":"French Yellow Ochre Deep","item_number":"6000040","series":"2","hue_group":"6","hue_value":60111000,"pigment_codes":null,"lab":{"L":49.73,"a":19.91,"b":44.95},"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6000040-french-yellow-ochre-deep.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6000040-french-yellow-ochre-deep.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6000040-french-yellow-ochre-deep-1000px.webp"},{"color_name":"French Raw Sienna","item_number":"6000041","series":"2","hue_group":"6","hue_value":60112000,"pigment_codes":null,"lab":{"L":40.64,"a":12.21,"b":23.21},"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6000041-french-raw-sienna.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6000041-french-raw-sienna.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6000041-french-raw-sienna-1000px.webp"},{"color_name":"N4 Neutral Gray","item_number":"6001914","series":"1","hue_group":"6","hue_value":60112000,"pigment_codes":null,"lab":null,"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6001914-Neutral-Gray-N4-100px.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6001914-Neutral-Gray-N4-400px.webp","handpainted_card_url":""},{"color_name":"French Ochre Havane","item_number":"6000042","series":"2","hue_group":"6","hue_value":60113000,"pigment_codes":null,"lab":null,"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6000042-french-ochre-havane.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6000042-french-ochre-havane.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6000042-french-ochre-havane-1000px.webp"},{"color_name":"French Rouge Indien","item_number":"6000043","series":"2","hue_group":"6","hue_value":60114000,"pigment_codes":null,"lab":{"L":33.92,"a":24.77,"b":21.51},"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6000043-french-rouge-indien.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6000043-french-rouge-indien.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6000043-french-rouge-indien-1000px.webp"},{"color_name":"N6 Neutral Gray","item_number":"6001916","series":"1","hue_group":"6","hue_value":60114000,"pigment_codes":null,"lab":null,"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6001916-Neutral-Gray-N6-100px.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6001916-Neutral-Gray-N6-400px.webp","handpainted_card_url":""},{"color_name":"French Brown Ochre","item_number":"6000044","series":"2","hue_group":"6","hue_value":60115000,"pigment_codes":null,"lab":{"L":27.96,"a":9.41,"b":12.91},"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6000044-french-brown-ochre.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6000044-french-brown-ochre.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6000044-french-brown-ochre-1000px.webp"},{"color_name":"French Burnt Ochre","item_number":"6000046","series":"2","hue_group":"6","hue_value":60116000,"pigment_codes":null,"lab":{"L":25.95,"a":5.94,"b":6.01},"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6000046-french-burnt-ochre.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6000046-french-burnt-ochre.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6000046-french-burnt-ochre-1000px.webp"},{"color_name":"N8 Neutral Gray","item_number":"6001918","series":"1","hue_group":"6","hue_value":60116000,"pigment_codes":null,"lab":null,"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6001918-Neutral-Gray-N8-100px.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6001918-Neutral-Gray-N8-400px.webp","handpainted_card_url":""},{"color_name":"French Burnt Umber","item_number":"6000045","series":"3","hue_group":"6","hue_value":60117000,"pigment_codes":null,"lab":{"L":17.89,"a":2.55,"b":4.29},"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6000045-french-burnt-umber.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6000045-french-burnt-umber.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6000045-french-burnt-umber-1000px.webp"},{"color_name":"French Light Sienna","item_number":"6000051","series":"2","hue_group":"6","hue_value":60118000,"pigment_codes":null,"lab":{"L":32.34,"a":5.33,"b":20.84},"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6000051-french-light-sienna.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6000051-french-light-sienna.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6000051-french-light-sienna-1000px.webp"},{"color_name":"French Ardoise Gray","item_number":"6000050","series":"2","hue_group":"6","hue_value":60119000,"pigment_codes":null,"lab":null,"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6000050-french-ardoise-grey.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6000050-french-ardoise-grey.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6000050-french-ardoise-gray-1000px.webp"},{"color_name":"French Raw Umber","item_number":"6000047","series":"2","hue_group":"6","hue_value":60120000,"pigment_codes":null,"lab":{"L":29.64,"a":4.18,"b":11.03},"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6000047-french-raw-umber.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6000047-french-raw-umber.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6000047-french-raw-umber-1000px.webp"},{"color_name":"Italian Terra Verte","item_number":"6000013","series":"3","hue_group":"6","hue_value":60123000,"pigment_codes":null,"lab":{"L":31.85,"a":-10.28,"b":8.76},"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6000013-italian-terra-verte.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6000013-italian-terra-verte.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6000013-italian-terre-verte-1000px.webp"},{"color_name":"Italian Lemon Ochre","item_number":"6000014","series":"3","hue_group":"6","hue_value":60124000,"pigment_codes":null,"lab":{"L":60.14,"a":18.13,"b":50.84},"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6000014-italian-lemon-ochre.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6000014-italian-lemon-ochre.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6000014-italian-lemon-ochre-1000px.webp"},{"color_name":"Italian Yellow Ochre","item_number":"6000015","series":"3","hue_group":"6","hue_value":60125000,"pigment_codes":null,"lab":{"L":54.62,"a":15.28,"b":40.83},"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6000015-italian-yellow-ochre.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6000015-italian-yellow-ochre.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6000015-italian-yellow-ochre-1000px.webp"},{"color_name":"Italian Raw Sienna","item_number":"6000024","series":"3","hue_group":"6","hue_value":60126000,"pigment_codes":null,"lab":{"L":41.76,"a":13.92,"b":29.14},"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6000024-italian-raw-sienna.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6000024-italian-raw-sienna.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6000024-italian-raw-sienna-1000px.webp"},{"color_name":"Italian Green Ochre","item_number":"6000017","series":"3","hue_group":"6","hue_value":60127000,"pigment_codes":null,"lab":{"L":37.35,"a":8.9,"b":20.32},"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6000017-italian-green-ochre.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6000017-italian-green-ochre.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6000017-italian-green-ochre-1000px.webp"},{"color_name":"Italian Orange Ochre","item_number":"6000016","series":"3","hue_group":"6","hue_value":60128000,"pigment_codes":null,"lab":{"L":39.32,"a":18.88,"b":26.1},"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6000016-italian-orange-ochre.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6000016-italian-orange-ochre.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6000016-italian-orange-ochre-1000px.webp"},{"color_name":"Italian Pompeii Red","item_number":"6000018","series":"3","hue_group":"6","hue_value":60129000,"pigment_codes":null,"lab":{"L":39.08,"a":29.4,"b":25.69},"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6000018-italian-pompeii-red.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6000018-italian-pompeii-red.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6000018-italian-pompeii-red-1000px.webp"},{"color_name":"Italian Rosso Veneto","item_number":"6000019","series":"3","hue_group":"6","hue_value":60130000,"pigment_codes":null,"lab":{"L":37.55,"a":26.53,"b":20.46},"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6000019-italian-rosso-veneto.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6000019-italian-rosso-veneto.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6000019-italian-rosso-veneto-1000px.webp"},{"color_name":"Italian Pozzuoli Earth","item_number":"6000020","series":"3","hue_group":"6","hue_value":60131000,"pigment_codes":null,"lab":{"L":36.09,"a":26.89,"b":25.07},"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6000020-italian-pozzuoli-earth.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6000020-italian-pozzuoli-earth.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6000020-italian-pozzuoli-earth-1000px.webp"},{"color_name":"Italian Terra Rosa","item_number":"6000021","series":"3","hue_group":"6","hue_value":60132000,"pigment_codes":null,"lab":{"L":31.98,"a":17.4,"b":15.75},"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6000021-italian-terra-rosa.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6000021-italian-terra-rosa.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6000021-italian-terra-rosa-1000px.webp"},{"color_name":"Italian Burnt Sienna","item_number":"6000023","series":"3","hue_group":"6","hue_value":60133000,"pigment_codes":null,"lab":{"L":28.47,"a":17.77,"b":15.46},"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6000023-italian-burnt-sienna.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6000023-italian-burnt-sienna.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6000023-italian-burnt-sienna-1000px.webp"},{"color_name":"Italian Raw Umber","item_number":"6000025","series":"3","hue_group":"6","hue_value":60134000,"pigment_codes":null,"lab":{"L":22.73,"a":0.8,"b":4.25},"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6000025-italian-raw-umber.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6000025-italian-raw-umber.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6000025-italian-raw-umber-1000px.webp"},{"color_name":"Italian Black Roman Earth","item_number":"6000022","series":"3","hue_group":"6","hue_value":60135000,"pigment_codes":null,"lab":{"L":18.99,"a":0.23,"b":0.9},"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6000022-italian-black-roman-earth.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6000022-italian-black-roman-earth.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6000022-italian-black-roman-earth-1000px.webp"},{"color_name":"SF Flake White","item_number":"6003104","series":"6","hue_group":"6","hue_value":60136000,"pigment_codes":null,"lab":{"L":97,"a":-0.04,"b":2.26},"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6003104-sf-flake-white.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6003104-sf-flake-white.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6003104-safflower-flake-white-1000px.webp"},{"color_name":"SF Porcelain White","item_number":"6003103","series":"4","hue_group":"6","hue_value":60137000,"pigment_codes":null,"lab":{"L":97.46,"a":-1.06,"b":1.33},"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6003103-sf-porcelain-white.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6003103-sf-porcelain-white.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6003103-safflower-porcelain-white-1000px.webp"},{"color_name":"SF Titanium White","item_number":"6003101","series":"1","hue_group":"6","hue_value":60138000,"pigment_codes":null,"lab":{"L":98.97,"a":-0.97,"b":1.8},"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6003101-sf-titanium-white.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6003101-sf-titanium-white.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6003101-safflower-titanium-white-1000px.webp"},{"color_name":"SF French Ardoise Gray","item_number":"6003050","series":"2","hue_group":"6","hue_value":60139000,"pigment_codes":null,"lab":null,"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6003050-sf-french-ardoise-grey.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6003050-sf-french-ardoise-grey.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6003050-safflower-french-ardoise-gray-1000px.webp"},{"color_name":"SF Ultramarine Violet","item_number":"6003764","series":"3","hue_group":"6","hue_value":60142000,"pigment_codes":null,"lab":{"L":8.74,"a":19.78,"b":-28.7},"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6003764-sf-ultramarine-violet.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6003764-sf-ultramarine-violet.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6003764-safflower-ultramarine-violet-1000px.webp"},{"color_name":"SF Cerulean Blue French","item_number":"6003857","series":"7","hue_group":"6","hue_value":60143000,"pigment_codes":null,"lab":{"L":29.53,"a":-15.2,"b":-32.68},"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6003857-sf-cerulean-blue-french.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6003857-sf-cerulean-blue-french.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6003857-safflower-cerulean-blue-french-1000px.webp"},{"color_name":"SF Ultramarine Blue","item_number":"6003942","series":"2","hue_group":"6","hue_value":60144000,"pigment_codes":null,"lab":{"L":5.41,"a":29.8,"b":-43.17},"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6003942-sf-ultramarine-blue.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6003942-sf-ultramarine-blue.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6003942-safflower-ultramarine-blue-1000px.webp"},{"color_name":"SF Ultramarine Blue French","item_number":"6003962","series":"2","hue_group":"6","hue_value":60145000,"pigment_codes":null,"lab":null,"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6003962-sf-ultramarine-blue-french.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6003962-sf-ultramarine-blue-french.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6003962-safflower-ultramarine-blue-french-1000px.webp"},{"color_name":"SF Italian Terra Verte","item_number":"6003013","series":"3","hue_group":"6","hue_value":60146000,"pigment_codes":null,"lab":{"L":32.13,"a":-11.69,"b":10.11},"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6003013-sf-italian-terra-verte.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6003013-sf-italian-terra-verte.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6003013-safflower-italian-terra-verte-1000px.webp"},{"color_name":"Interference Violet","item_number":"6001813","series":"4","hue_group":"6","hue_value":60153000,"pigment_codes":null,"lab":null,"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6001813-interference-violet.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6001813-interference-violet.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6001813-interference-violet-1000px.webp"},{"color_name":"Interference Red","item_number":"6001873","series":"4","hue_group":"6","hue_value":60154000,"pigment_codes":null,"lab":null,"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6001873-interference-red.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6001873-interference-red.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6001873-interference-red-1000px.webp"},{"color_name":"Interference Blue","item_number":"6001803","series":"4","hue_group":"6","hue_value":60155000,"pigment_codes":null,"lab":null,"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6001803-interference-blue.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6001803-interference-blue.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6001803-interference-blue-1000px.webp"},{"color_name":"Interference Green","item_number":"6001893","series":"4","hue_group":"6","hue_value":60156000,"pigment_codes":null,"lab":null,"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6001893-interference-green.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6001893-interference-green.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6001893-interference-green-1000px.webp"},{"color_name":"Iridescent Copper","item_number":"6001883","series":"3","hue_group":"7","hue_value":70147000,"pigment_codes":null,"lab":null,"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6001883-iridescent-copper.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6001883-iridescent-copper.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6001883-iridescent-copper-1000px.webp"},{"color_name":"Iridescent Pale Gold","item_number":"6001823","series":"3","hue_group":"7","hue_value":70148000,"pigment_codes":null,"lab":null,"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6001823-iridescent-pale-gold.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6001823-iridescent-pale-gold.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6001823-iridescent-pale-gold-1000px.webp"},{"color_name":"Iridescent Pearl White","item_number":"6001863","series":"3","hue_group":"7","hue_value":70149000,"pigment_codes":null,"lab":null,"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6001863-iridescent-pearl-white.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6001863-iridescent-pearl-white.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6001863-iridescent-pearl-white-1000px.webp"},{"color_name":"Iridescent Bronze","item_number":"6001853","series":"3","hue_group":"7","hue_value":70150000,"pigment_codes":null,"lab":null,"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6001853-iridescent-bronze.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6001853-iridescent-bronze.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6001853-iridescent-bronze-1000px.webp"},{"color_name":"Iridescent Silver","item_number":"6001833","series":"3","hue_group":"7","hue_value":70151000,"pigment_codes":null,"lab":null,"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6001833-iridescent-silver.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6001833-iridescent-silver.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6001833-iridescent-silver-1000px.webp"},{"color_name":"Iridescent Pewter","item_number":"6001843","series":"3","hue_group":"7","hue_value":70152000,"pigment_codes":null,"lab":null,"swatch_sm_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-sm/6001843-iridescent-pewter.webp","swatch_lg_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/swatch-lg/6001843-iridescent-pewter.webp","handpainted_card_url":"https://goldenartistcolors.com/products/williamsburg-artist-oil-colors/colors/handpainted-cards/6001843-iridescent-pewter-1000px.webp"}]}
/* WILLIAMSBURG_CATALOG_END */;

function labToSchema(lab) {
  return {
    L: Number(lab.l.toFixed(2)),
    a: Number(lab.a.toFixed(2)),
    b: Number(lab.b.toFixed(2)),
  };
}

function createCatalogSwatchHex(catalogColor) {
  if (catalogColor.swatch_hex) return catalogColor.swatch_hex;
  if (!catalogColor.lab) return "#2A2F36";
  const rgb = labToRgb({ l: catalogColor.lab.L, a: catalogColor.lab.a, b: catalogColor.lab.b });
  return rgbToHex(rgb.r, rgb.g, rgb.b);
}

function getCatalogColorForPaint(paint) {
  if (!Array.isArray(WILLIAMSBURG_CATALOG.colors) || !WILLIAMSBURG_CATALOG.colors.length) {
    return null;
  }

  const normalizedName = getPaintLabel(paint).trim().toLowerCase();
  if (normalizedName) {
    const exactName = WILLIAMSBURG_CATALOG.colors.find((color) => color.color_name.trim().toLowerCase() === normalizedName);
    if (exactName) {
      return exactName;
    }
  }

  const pigmentCodes = parsePigmentCodes(paint.pigment_codes);
  if (!pigmentCodes.length) {
    return null;
  }

  const exactPigmentSet = WILLIAMSBURG_CATALOG.colors.find((color) => {
    const catalogPigments = parsePigmentCodes(color.pigment_codes);
    return catalogPigments.length === pigmentCodes.length && catalogPigments.every((code) => pigmentCodes.includes(code));
  });
  if (exactPigmentSet) {
    return exactPigmentSet;
  }

  return WILLIAMSBURG_CATALOG.colors.find((color) => {
    const catalogPigments = parsePigmentCodes(color.pigment_codes);
    return catalogPigments.some((code) => pigmentCodes.includes(code));
  }) || null;
}

function getResolvedPaintSwatchHex(paint, options = {}) {
  const explicitHex = toHexOrEmpty(options.explicitHex ?? paint.user_swatch_hex ?? paint.approx_srgb_hex);
  if (explicitHex) {
    return explicitHex;
  }

  const catalogColor = getCatalogColorForPaint(paint);
  if (catalogColor) {
    return createCatalogSwatchHex(catalogColor);
  }

  const fallbackHex = toHexOrEmpty(options.fallbackHex);
  if (fallbackHex) {
    return fallbackHex;
  }

  const proxy = options.proxy ?? getPaintProxy(parsePigmentCodes(paint.pigment_codes));
  if (proxy?.paint) {
    const proxyCatalogColor = getCatalogColorForPaint(proxy.paint);
    if (proxyCatalogColor) {
      return createCatalogSwatchHex(proxyCatalogColor);
    }
    return toHexOrEmpty(proxy.paint.user_swatch_hex || proxy.paint.approx_srgb_hex);
  }

  return "";
}

function formatPaintDetailLine(paint) {
  const brand = String(paint.brand || "Unspecified").trim() || "Unspecified";
  const itemNumber = String(paint.item_number || "").trim() || "Item n/a";
  const pigmentLabel = parsePigmentCodes(paint.pigment_codes).join(", ") || "Pigment n/a";
  return `${brand} - ${itemNumber} - ${pigmentLabel}`;
}

const STARTER_PALETTE = createStarterPalette();

function getCatalogRefreshLabel(value) {
  if (!value) return "Williamsburg active catalog";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Williamsburg active catalog";
  return `Catalog refreshed ${new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" }).format(date)}`;
}

function getTargetHueGroup(targetLab) {
  const angle = (Math.atan2(targetLab.b, targetLab.a) * 180 / Math.PI + 360) % 360;
  return Math.floor(angle / 36) + 1;
}

function getHueGroupDistance(left, right) {
  if (!left || !right) return 10;
  const difference = Math.abs(left - right);
  return Math.min(difference, 10 - difference);
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
  imageBounds: {
    x: 0,
    y: 0,
    width: canvas.width,
    height: canvas.height,
  },
  processedReferenceCanvas: null,
  paletteSize: DEFAULT_PALETTE_SIZE,
  saveExport: {
    layout: EXPORT_LAYOUT_CURRENT,
    wheelOrder: EXPORT_WHEEL_ORDER_PALETTE,
    longestEdge: EXPORT_DEFAULT_LONGEST_EDGE,
    stripNodes: false,
    gradientNodes: [],
    gradientDragId: null,
    gradientDragPointerId: null,
    previewRaf: null,
    noisePatternCanvas: null,
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
  paletteSettleRaf: null,
  recipeResults: [],
  recipeRequest: null,
  ownedPaints: loadOwnedPaints(),
  inventoryDraft: [],
  harmonize: {
    isOpen: false,
    baselineColors: [],
    sourceColors: [],
    scheme: HARMONIZE_DEFAULT_SCHEME,
    strength: HARMONIZE_DEFAULT_STRENGTH,
    saturation: HARMONIZE_DEFAULT_SATURATION,
    brightness: HARMONIZE_DEFAULT_BRIGHTNESS,
    lockedIds: new Set(),
    metrics: null,
    warnings: [],
    previewRaf: null,
    lastTrigger: null,
  },
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
  const minimumReflectance = 0.003;
  let rAbsorbance = 0;
  let gAbsorbance = 0;
  let bAbsorbance = 0;
  recipe.forEach((entry) => {
    const weight = entry.massPercent / 100;
    const rReflectance = Math.max(minimumReflectance, srgbToLinear(entry.paint.rgb.r));
    const gReflectance = Math.max(minimumReflectance, srgbToLinear(entry.paint.rgb.g));
    const bReflectance = Math.max(minimumReflectance, srgbToLinear(entry.paint.rgb.b));
    rAbsorbance += -Math.log(rReflectance) * weight;
    gAbsorbance += -Math.log(gReflectance) * weight;
    bAbsorbance += -Math.log(bReflectance) * weight;
  });
  return {
    r: linearToSrgb(Math.exp(-rAbsorbance)),
    g: linearToSrgb(Math.exp(-gAbsorbance)),
    b: linearToSrgb(Math.exp(-bAbsorbance)),
  };
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
    .filter((entry) => {
      const substitute = entry.paint.substitution_proxy.paint;
      const sameName = getPaintLabel(entry.paint).trim().toLowerCase() === getPaintLabel(substitute).trim().toLowerCase();
      const samePigments = [...entry.paint.pigment_codes].sort().join("|") === [...substitute.pigment_codes].sort().join("|");
      return !(sameName || samePigments);
    })
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

function solveBestRecipe(targetLab, paints, maxPigments) {
  const candidatePaints = selectCandidatePaints(targetLab, paints);
  let best = null;

  for (let pigmentCount = 1; pigmentCount <= Math.min(maxPigments, candidatePaints.length); pigmentCount += 1) {
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

  return { best, candidatePaints };
}

function formatIdealMixPart(paint, massPercent) {
  return `${getPaintLabel(paint)} (${paint.pigment_codes.join(", ")}) ${Math.round(massPercent)}%`;
}

function formatCatalogMixPart(match) {
  return `${match.color_name} ${Math.round(match.recommended_mass_percent)}%`;
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

function getIdealSinglePaintMatch(targetLab, candidatePaints) {
  return candidatePaints
    .filter((paint) => paint.rgb)
    .map((paint) => ({
      paint,
      distance: deltaE(targetLab, rgbToLab(paint.rgb)),
    }))
    .sort((left, right) => left.distance - right.distance)[0] || null;
}

function hasOwnedEquivalent(paint, ownedPaints) {
  return ownedPaints.some((ownedPaint) => ownedPaint.pigment_codes.some((code) => paint.pigment_codes.includes(code)));
}

function findOwnedEquivalent(paint, ownedPaints) {
  return ownedPaints.find((ownedPaint) => ownedPaint.pigment_codes.some((code) => paint.pigment_codes.includes(code))) || null;
}

function recipeEntriesEquivalent(leftEntries, rightEntries) {
  if (leftEntries.length !== rightEntries.length) {
    return false;
  }

  const normalize = (entries) => entries
    .map((entry) => ({
      key: [...entry.paint.pigment_codes].sort().join("|"),
      massPercent: Math.round(entry.massPercent),
    }))
    .sort((left, right) => left.key.localeCompare(right.key) || left.massPercent - right.massPercent);

  const leftNormalized = normalize(leftEntries);
  const rightNormalized = normalize(rightEntries);
  return leftNormalized.every((entry, index) => entry.key === rightNormalized[index].key && entry.massPercent === rightNormalized[index].massPercent);
}

function resolveCatalogMatchForPaint(paint, targetLab) {
  if (!Array.isArray(WILLIAMSBURG_CATALOG.colors) || !WILLIAMSBURG_CATALOG.colors.length) {
    return null;
  }

  const directMatch = getCatalogColorForPaint(paint);
  if (directMatch) {
    return { color: directMatch, reason: "same pigment" };
  }

  const withLab = WILLIAMSBURG_CATALOG.colors
    .filter((color) => color.lab && Number.isFinite(color.lab.L) && Number.isFinite(color.lab.a) && Number.isFinite(color.lab.b))
    .map((color) => ({
      color,
      distance: deltaE(targetLab, { l: color.lab.L, a: color.lab.a, b: color.lab.b }),
    }))
    .sort((left, right) => left.distance - right.distance)[0];
  if (withLab) {
    return { color: withLab.color, reason: "nearest active tube", deltaE76: Number(withLab.distance.toFixed(2)) };
  }

  const targetHueGroup = getTargetHueGroup(targetLab);
  const hueFallback = WILLIAMSBURG_CATALOG.colors
    .map((color) => ({
      color,
      distance: getHueGroupDistance(targetHueGroup, Number(color.hue_group) || 0),
      hueValue: Number(color.hue_value) || Number.MAX_SAFE_INTEGER,
    }))
    .sort((left, right) => left.distance - right.distance || left.hueValue - right.hueValue)[0];
  if (!hueFallback) {
    return null;
  }

  return {
    color: hueFallback.color,
    reason: "fallback hue match",
    labDistanceNote: "No bundled Lab reading for this tube, so it was ranked by hue-group fallback.",
  };
}

function resolveIdealMixGuidance(targetLab, request, fallbackRecipeEntries, fallbackCandidatePaints) {
  const starterSolve = solveBestRecipe(targetLab, STARTER_PALETTE, request.constraints.max_pigments);
  const starterCandidatePaints = starterSolve.candidatePaints || [];
  const singlePaintMatch = getIdealSinglePaintMatch(targetLab, starterCandidatePaints);
  let idealRecipeEntries = starterSolve.best?.recipe || fallbackRecipeEntries;
  let idealSummary = buildIdealMixSummary(targetLab, starterCandidatePaints, idealRecipeEntries);

  if (singlePaintMatch && singlePaintMatch.distance <= IDEAL_SINGLE_PAINT_DISTANCE_THRESHOLD) {
    idealRecipeEntries = [{ paint: singlePaintMatch.paint, massPercent: 100 }];
    idealSummary = formatIdealMixPart(singlePaintMatch.paint, 100);
  }

  const missingEntries = idealRecipeEntries.filter((entry) => !hasOwnedEquivalent(entry.paint, state.ownedPaints));
  const matchesCurrentRecipe = recipeEntriesEquivalent(idealRecipeEntries, fallbackRecipeEntries);

  return {
    label: matchesCurrentRecipe ? "Current recipe is ideal mix" : "Ideal mix",
    summary: matchesCurrentRecipe ? "" : idealSummary,
    missingEntries,
    idealRecipeEntries,
  };
}

function buildCatalogMatches(targetLab, guidance, gamutStatus) {
  const shouldSuggest = !state.ownedPaints.length || guidance.missingEntries.length > 0 || gamutStatus === "nearest_achievable";
  if (!shouldSuggest || !Array.isArray(WILLIAMSBURG_CATALOG.colors) || !WILLIAMSBURG_CATALOG.colors.length) {
    return [];
  }

  const ownedPigmentCodes = new Set(state.ownedPaints.flatMap((paint) => paint.pigment_codes));
  const requiredEntries = guidance.missingEntries.length
    ? guidance.missingEntries
    : (!state.ownedPaints.length || gamutStatus === "nearest_achievable" ? guidance.idealRecipeEntries : []);
  if (!requiredEntries.length) {
    return [];
  }

  return requiredEntries
    .map((entry) => {
      const match = resolveCatalogMatchForPaint(entry.paint, targetLab);
      if (!match?.color) {
        return null;
      }
      const suggestedPigmentCodes = Array.isArray(match.color.pigment_codes) ? match.color.pigment_codes : [];
      if (suggestedPigmentCodes.some((code) => ownedPigmentCodes.has(code))) {
        return null;
      }
      return {
        brand: "Williamsburg",
        color_name: match.color.color_name,
        item_number: match.color.item_number,
        series: match.color.series,
        pigment_codes: [...suggestedPigmentCodes],
        target_pigment_codes: [...entry.paint.pigment_codes],
        swatch_hex: createCatalogSwatchHex(match.color),
        swatch_sm_url: match.color.swatch_sm_url || "",
        swatch_lg_url: match.color.swatch_lg_url || "",
        handpainted_card_url: match.color.handpainted_card_url || "",
        delta_e76: match.deltaE76 ?? null,
        lab_distance_note: match.labDistanceNote ?? null,
        reason: match.reason,
        recommended_mass_percent: entry.massPercent,
      };
    })
    .filter(Boolean)
    .filter((match, index, collection) => collection.findIndex((candidate) => candidate.item_number === match.item_number) === index)
    .slice(0, 3);
}

function buildIdealMixDisplaySummary(guidance, catalogMatches) {
  return guidance.idealRecipeEntries.map((idealEntry) => {
    const catalogMatch = catalogMatches.find((match) => match.target_pigment_codes.some((code) => idealEntry.paint.pigment_codes.includes(code)));
    if (catalogMatch) {
      return catalogMatch.color_name;
    }
    const ownedEquivalent = findOwnedEquivalent(idealEntry.paint, state.ownedPaints);
    if (ownedEquivalent) {
      return getPaintLabel(ownedEquivalent);
    }
    return getPaintLabel(idealEntry.paint);
  }).join(" + ");
}

function applyIdealMixDisplay(entry, guidance) {
  if (entry.catalog_matches?.length) {
    entry.display.idealMixLabel = "Ideal mix";
    entry.display.idealMixSummary = "";
  } else {
    entry.display.idealMixLabel = "Current recipe is ideal mix";
    entry.display.idealMixSummary = "";
    entry.substitutions = [];
  }
  return entry;
}

function estimatePaintRecipe(targetColor, request) {
  const targetLab = rgbToLab(targetColor);
  const { best, candidatePaints } = solveBestRecipe(targetLab, request.owned_paints, request.constraints.max_pigments);

  if (!best) {
    const idealMixGuidance = resolveIdealMixGuidance(targetLab, request, [], candidatePaints);
    return applyIdealMixDisplay({
      target_hex: targetColor.hex,
      target_lab: labToSchema(targetLab),
      model_used: "heuristic_proxy",
      catalog_matches: buildCatalogMatches(targetLab, idealMixGuidance, "unknown"),
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
        idealMixLabel: idealMixGuidance.label,
        idealMixSummary: idealMixGuidance.summary,
        catalogRefreshLabel: getCatalogRefreshLabel(WILLIAMSBURG_CATALOG.generated_at),
      },
    }, idealMixGuidance);
  }

  const massPercentages = best.recipe.map((entry) => entry.massPercent);
  const parts = simplifyParts(massPercentages);
  const components = best.recipe.map((entry, index) => {
    const catalogColor = getCatalogColorForPaint(entry.paint);
    return {
      brand: entry.paint.brand,
      color_name: entry.paint.color_name,
      pigment_codes: [...entry.paint.pigment_codes],
      item_number: catalogColor?.item_number || "",
      swatch_hex: getResolvedPaintSwatchHex(entry.paint) || "#2A2F36",
      role: index === 0 ? "base" : "adjustment",
      parts: parts[index],
      fraction_mass: Number((entry.massPercent / 100).toFixed(3)),
      mass_percent: entry.massPercent,
      scaled_amount: Number(((entry.massPercent / 100) * request.batch_size.value).toFixed(2)),
      scaled_unit: request.batch_size.unit,
      substitution_notes: entry.paint.model_source.startsWith("proxy_")
        ? `Estimated with ${entry.paint.substitution_proxy.paint.color_name} as a ${entry.paint.substitution_proxy.matchClass === "same_pigment_code" ? "same pigment code" : "same family"} proxy.`
        : "",
    };
  });
  const gamutStatus = best.distance <= 12 ? "in_gamut" : "nearest_achievable";
  const gamutNote = gamutStatus === "in_gamut" ? "This target appears achievable within the current proxy palette." : describeLabMiss(targetLab, best.mixedLab);
  const substitutions = buildSubstitutions(best.recipe);
  const idealMixGuidance = resolveIdealMixGuidance(targetLab, request, best.recipe, candidatePaints);
  const catalogMatches = buildCatalogMatches(targetLab, idealMixGuidance, gamutStatus);
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

  return applyIdealMixDisplay({
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
    catalog_matches: catalogMatches,
    substitutions,
    warnings,
    display: {
      targetRgb: `RGB ${targetColor.r}, ${targetColor.g}, ${targetColor.b}`,
      sourceLabel: describeInventorySource(),
      mixedRgb: `RGB ${best.mixed.r}, ${best.mixed.g}, ${best.mixed.b}`,
      mixedHex: rgbToHex(best.mixed.r, best.mixed.g, best.mixed.b),
      swatchColor: targetColor.hex,
      idealMixLabel: idealMixGuidance.label,
      idealMixSummary: idealMixGuidance.summary,
      catalogRefreshLabel: getCatalogRefreshLabel(WILLIAMSBURG_CATALOG.generated_at),
    },
  }, idealMixGuidance);
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
  const availableHeight = getImageBounds().height;
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
  const bounds = getImageBounds();
  const point = getCanvasSamplePoint(centerX, centerY);
  const minBoundX = clamp(Math.floor(bounds.x * state.dpr), 0, canvas.width - 1);
  const maxBoundX = clamp(Math.ceil((bounds.x + bounds.width) * state.dpr) - 1, 0, canvas.width - 1);
  const minBoundY = clamp(Math.floor(bounds.y * state.dpr), 0, canvas.height - 1);
  const maxBoundY = clamp(Math.ceil((bounds.y + bounds.height) * state.dpr) - 1, 0, canvas.height - 1);
  const pixelX = clamp(Math.round(point.x * state.dpr), minBoundX, maxBoundX);
  const pixelY = clamp(Math.round(point.y * state.dpr), minBoundY, maxBoundY);
  const minX = clamp(pixelX - half, minBoundX, maxBoundX);
  const maxX = clamp(pixelX + half, minBoundX, maxBoundX);
  const minY = clamp(pixelY - half, minBoundY, maxBoundY);
  const maxY = clamp(pixelY + half, minBoundY, maxBoundY);
  const sourceWidth = maxX - minX + 1;
  const sourceHeight = maxY - minY + 1;
  const source = ctx.getImageData(minX, minY, sourceWidth, sourceHeight).data;
  const samples = new Uint8ClampedArray(gridSize * gridSize * 4);

  for (let gy = 0; gy < gridSize; gy += 1) {
    for (let gx = 0; gx < gridSize; gx += 1) {
      const sampleX = clamp(pixelX + gx - half, minBoundX, maxBoundX);
      const sampleY = clamp(pixelY + gy - half, minBoundY, maxBoundY);
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
    state.imageBounds = {
      x: 0,
      y: 0,
      width: canvasWrap.clientWidth || canvas.width,
      height: canvasWrap.clientHeight || canvas.height,
    };
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
    const coverMobileImage = shouldUseImageCoverOnMobile();

    let frameWidth = availableWidth;
    let frameHeight = availableHeight;
    if (!coverMobileImage) {
      frameHeight = Math.round(frameWidth / imageRatio);
      if (frameHeight > availableHeight) {
        frameHeight = availableHeight;
        frameWidth = Math.round(frameHeight * imageRatio);
      }
    }

    canvasStage.style.setProperty("--frame-width", `${Math.max(180, frameWidth)}px`);
    canvasStage.style.setProperty("--frame-height", `${Math.max(220, frameHeight)}px`);
    return;
  }

  const stageStyles = window.getComputedStyle(canvasStage);
  const workspace = canvasStage.parentElement;
  const gap = parseFloat(stageStyles.rowGap || stageStyles.gap || "0") || 0;
  const paddingTop = parseFloat(stageStyles.paddingTop || "0") || 0;
  const paddingBottom = parseFloat(stageStyles.paddingBottom || "0") || 0;
  const workspaceStyles = workspace ? window.getComputedStyle(workspace) : null;
  const workspaceGap = workspaceStyles ? (parseFloat(workspaceStyles.columnGap || workspaceStyles.gap || "0") || 0) : 0;
  const workspaceWidth = workspace ? (workspace.clientWidth || workspace.getBoundingClientRect().width || 0) : 0;
  const paletteWidth = palettePanel ? (palettePanel.clientWidth || palettePanel.getBoundingClientRect().width || 0) : 0;
  const stageHeight = canvasStage.clientHeight || canvasStage.getBoundingClientRect().height || 0;
  const availableHeight = Math.max(
    320,
    Math.round(stageHeight - paddingTop - paddingBottom - controlHud.getBoundingClientRect().height - gap),
  );
  const availableWidth = Math.max(
    280,
    Math.round(workspaceWidth ? (workspaceWidth - paletteWidth - workspaceGap) : (window.innerWidth - getPaletteFrameClearance())),
  );

  const coverDesktopImage = shouldUseImageCoverOnDesktop();
  let frameWidth = availableWidth;
  let frameHeight = availableHeight;
  if (!coverDesktopImage) {
    frameHeight = Math.round(frameWidth / imageRatio);
    if (frameHeight > availableHeight) {
      frameHeight = availableHeight;
      frameWidth = Math.round(frameHeight * imageRatio);
    }
  }

  canvasStage.style.setProperty("--frame-width", `${Math.max(280, frameWidth)}px`);
  canvasStage.style.setProperty("--frame-height", `${Math.max(320, frameHeight)}px`);
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
  const sizeControlsDisabled = state.harmonize.isOpen;
  paletteSizeLabels.forEach((label) => {
    label.textContent = `Palette: ${state.paletteSize}`;
  });
  paletteMinusButtons.forEach((button) => {
    button.disabled = sizeControlsDisabled || state.paletteSize <= PALETTE_MIN;
  });
  palettePlusButtons.forEach((button) => {
    button.disabled = sizeControlsDisabled || state.paletteSize >= PALETTE_MAX;
  });
  paletteDrawerOpen.disabled = !state.colors.length;
  harmonizeToggleButtons.forEach((button) => {
    button.disabled = !state.colors.length;
    button.setAttribute("aria-expanded", String(state.harmonize.isOpen));
  });
  if (palettePreviewStatus) {
    palettePreviewStatus.textContent = state.colors.length
      ? (state.harmonize.isOpen
        ? `Previewing ${state.colors.length} ${state.colors.length === 1 ? "colour" : "colours"}`
        : `${state.colors.length} ${state.colors.length === 1 ? "colour" : "colours"} ready`)
      : "Upload an image to build a palette.";
  }
}

function formatMetricNumber(value, digits = 1) {
  if (!Number.isFinite(value)) return "0";
  return Number(value.toFixed(digits)).toString();
}

function getHarmonizeSchemeDefinition(schemeId) {
  return HARMONIZE_SCHEMES.find((entry) => entry.id === schemeId) || HARMONIZE_SCHEMES.find((entry) => entry.id === HARMONIZE_DEFAULT_SCHEME) || HARMONIZE_SCHEMES[0];
}

function formatHarmonizeAdjustmentValue(value) {
  const numeric = clamp(Number(value) || 0, -100, 100);
  return `${numeric > 0 ? "+" : ""}${numeric}%`;
}

function clearHarmonizePreviewRaf() {
  if (!state.harmonize.previewRaf) return;
  cancelAnimationFrame(state.harmonize.previewRaf);
  state.harmonize.previewRaf = null;
}

function getVisibleHarmonizeTrigger() {
  if (state.harmonize.lastTrigger && state.harmonize.lastTrigger.isConnected && !state.harmonize.lastTrigger.hidden && state.harmonize.lastTrigger.offsetParent !== null) {
    return state.harmonize.lastTrigger;
  }
  return harmonizeToggleButtons.find((button) => button.isConnected && !button.hidden && button.offsetParent !== null && !button.disabled) || null;
}

function focusHarmonizePrimaryControl() {
  harmonizeSchemeSelect.focus({ preventScroll: true });
}

function renderHarmonizePanel() {
  root.dataset.harmonizeOpen = state.harmonize.isOpen ? "true" : "false";
  harmonizePanel.hidden = !state.harmonize.isOpen;
  harmonizePanel.setAttribute("aria-hidden", String(!state.harmonize.isOpen));
  const selectedScheme = getHarmonizeSchemeDefinition(state.harmonize.scheme);
  harmonizeSchemeSelect.value = selectedScheme.id;
  harmonizeSchemeDescription.textContent = selectedScheme.description;
  harmonizeStrength.value = String(state.harmonize.strength);
  harmonizeStrengthValue.textContent = `${state.harmonize.strength}%`;
  harmonizeSaturation.value = String(state.harmonize.saturation);
  harmonizeSaturationValue.textContent = formatHarmonizeAdjustmentValue(state.harmonize.saturation);
  harmonizeBrightness.value = String(state.harmonize.brightness);
  harmonizeBrightnessValue.textContent = formatHarmonizeAdjustmentValue(state.harmonize.brightness);

  if (!state.harmonize.isOpen) {
    harmonizeHelper.textContent = "Lock a palette colour to choose the anchor.";
    syncPaletteLockControls();
    return;
  }

  const metrics = state.harmonize.metrics;
  const anchorMetric = metrics?.perColorMetrics.find((entry) => entry.anchor) || null;
  const anchorHex = anchorMetric?.outputHex || "";
  if (anchorHex) {
    harmonizeHelper.innerHTML = `<span class="palette-harmonize-helper-dot" style="--helper-dot:${anchorHex};"></span><span>${anchorHex} is currently anchoring this preview.</span>`;
  } else {
    harmonizeHelper.textContent = "Choose a scheme to preview the current anchor.";
  }
  syncPaletteLockControls();
}

function syncPreviewDrivenViews() {
  updatePaletteLabel();
  renderPalette();
  syncSwatchTargetsFromColors();

  if (!saveModal.classList.contains("hidden")) {
    renderSavePreview();
  }

  if (!recipeModal.classList.contains("hidden")) {
    state.recipeRequest = buildRecipeRequest(state.colors);
    state.recipeResults = state.colors.map((color) => estimatePaintRecipe(color, state.recipeRequest));
    renderRecipe();
  } else {
    state.recipeResults = [];
    state.recipeRequest = null;
  }
}

function applyHarmonizePreview() {
  clearHarmonizePreviewRaf();
  if (!state.harmonize.isOpen || !state.harmonize.baselineColors.length) {
    return;
  }

  const preview = improvePalette(state.harmonize.baselineColors, {
    scheme: state.harmonize.scheme,
    strength: state.harmonize.strength,
    saturation: state.harmonize.saturation,
    brightness: state.harmonize.brightness,
    lockedIds: state.harmonize.lockedIds,
    anchorId: getPrimaryLockedHarmonizeId(),
  });
  state.harmonize.metrics = preview;
  state.harmonize.warnings = preview.warnings;
  state.colors = clonePaletteColors(preview.outputColors);
  syncPreviewDrivenViews();
  renderHarmonizePanel();
}

function scheduleHarmonizePreview() {
  clearHarmonizePreviewRaf();
  state.harmonize.previewRaf = requestAnimationFrame(() => {
    state.harmonize.previewRaf = null;
    applyHarmonizePreview();
  });
}

function resetHarmonizeConfig() {
  state.harmonize.scheme = HARMONIZE_DEFAULT_SCHEME;
  state.harmonize.strength = HARMONIZE_DEFAULT_STRENGTH;
  state.harmonize.saturation = HARMONIZE_DEFAULT_SATURATION;
  state.harmonize.brightness = HARMONIZE_DEFAULT_BRIGHTNESS;
  state.harmonize.lockedIds = new Set();
  state.harmonize.metrics = null;
  state.harmonize.warnings = [];
}

function closeHarmonizePanel(options = {}) {
  const { restoreFocus = true, revertPreview = true } = options;
  clearHarmonizePreviewRaf();
  if (revertPreview && state.harmonize.baselineColors.length) {
    state.colors = clonePaletteColors(state.harmonize.baselineColors);
    syncPreviewDrivenViews();
  }
  state.harmonize.isOpen = false;
  state.harmonize.baselineColors = [];
  resetHarmonizeConfig();
  renderHarmonizePanel();
  updatePaletteLabel();
  if (!revertPreview) {
    renderPalette();
  }

  if (restoreFocus) {
    const trigger = getVisibleHarmonizeTrigger();
    if (trigger) {
      requestAnimationFrame(() => {
        trigger.focus({ preventScroll: true });
      });
    }
  }
}

function openHarmonizePanel(trigger = null) {
  if (!state.colors.length) {
    return;
  }

  state.harmonize.lastTrigger = trigger;
  state.harmonize.isOpen = true;
  if (!state.harmonize.sourceColors.length) {
    syncHarmonizeSourceColors(state.colors);
  }
  state.harmonize.baselineColors = clonePaletteColors(state.colors);
  resetHarmonizeConfig();
  renderHarmonizePanel();
  updatePaletteLabel();
  renderPalette();
  scheduleHarmonizePreview();
  requestAnimationFrame(() => {
    focusHarmonizePrimaryControl();
  });
}

function toggleHarmonizePanel(trigger = null) {
  if (state.harmonize.isOpen) {
    closeHarmonizePanel();
    return;
  }

  if (isRealMobileLayout() && !state.isPaletteDrawerOpen) {
    openPaletteDrawer({ focusTarget: "harmonize" });
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        openHarmonizePanel(trigger);
      });
    });
    return;
  }

  openHarmonizePanel(trigger);
}

function handleHarmonizeOutsidePointerDown(event) {
  if (!state.harmonize.isOpen) {
    return;
  }

  const target = event.target;
  if (!(target instanceof Element)) {
    return;
  }

  if (palettePanel.contains(target)) {
    return;
  }

  event.preventDefault();
  event.stopPropagation();
  closeHarmonizePanel({ restoreFocus: false, revertPreview: true });
}

function handleSettingsOutsidePointerDown(event) {
  if (!state.isSettingsOpen || !isRealMobileLayout() || !shouldCollapseSettingsOnMobile()) {
    return;
  }

  const target = event.target;
  if (!(target instanceof Element)) {
    return;
  }

  if (hudSettingsPanel.contains(target) || settingsToggle.contains(target)) {
    return;
  }

  state.isSettingsOpen = false;
  syncLayoutState();
}

function getHarmonizeAnchorId() {
  if (!state.harmonize.isOpen) {
    return null;
  }

  const primaryLockedId = getPrimaryLockedHarmonizeId();
  if (primaryLockedId) {
    return primaryLockedId;
  }

  return state.harmonize.metrics?.anchorId || null;
}

function getPrimaryLockedHarmonizeId() {
  for (const colorId of state.harmonize.lockedIds) {
    if (state.colors.some((color) => color.id === colorId)) {
      return colorId;
    }
  }
  return null;
}

function getHarmonizeLockPresentation(colorId, hex = "") {
  const anchorId = getPrimaryLockedHarmonizeId();
  const locked = state.harmonize.lockedIds.has(colorId);
  const isAnchor = colorId === anchorId;
  const hasAnchor = Boolean(anchorId);
  const label = isAnchor || !hasAnchor ? "Anchor" : "Lock";
  const ariaLabel = isAnchor
    ? `Unlock anchor ${hex} during harmonise`
    : locked
      ? `Unlock ${hex} during harmonise`
      : hasAnchor
        ? `Lock ${hex} during harmonise`
        : `Anchor ${hex} during harmonise`;
  const title = isAnchor
    ? `${hex} is the harmonise anchor`
    : locked
      ? `${hex} is locked during harmonise`
      : hasAnchor
        ? `Lock ${hex} during harmonise`
        : `Anchor ${hex} during harmonise`;
  return { locked, isAnchor, label, ariaLabel, title };
}

function syncPaletteLockControls() {
  const cards = [...paletteList.querySelectorAll(".palette-card")];
  cards.forEach((card) => {
    const colorId = card.dataset.id;
    const lockButton = card.querySelector('[data-action="harmonize-lock-card"]');
    if (!colorId || !lockButton) {
      return;
    }

    const color = state.colors.find((entry) => entry.id === colorId);
    const hex = color?.hex || "";
    const lockState = getHarmonizeLockPresentation(colorId, hex);
    card.dataset.harmonizeLocked = lockState.locked ? "true" : "false";
    card.dataset.harmonizeAnchor = lockState.isAnchor ? "true" : "false";
    lockButton.hidden = !state.harmonize.isOpen;
    lockButton.textContent = lockState.label;
    lockButton.setAttribute("aria-pressed", String(lockState.locked));
    lockButton.setAttribute("aria-label", lockState.ariaLabel);
    lockButton.title = lockState.title;
  });
}

function toggleHarmonizeLock(colorId) {
  if (!state.harmonize.isOpen || !colorId) {
    return;
  }

  if (state.harmonize.lockedIds.has(colorId)) {
    state.harmonize.lockedIds.delete(colorId);
  } else {
    state.harmonize.lockedIds.add(colorId);
  }

  renderHarmonizePanel();
  syncPaletteLockControls();
  scheduleHarmonizePreview();
}

function applyHarmonizeChanges() {
  clearHarmonizePreviewRaf();
  state.harmonize.isOpen = false;
  state.harmonize.baselineColors = [];
  if (!state.harmonize.sourceColors.length) {
    syncHarmonizeSourceColors(state.colors);
  }
  resetHarmonizeConfig();
  renderHarmonizePanel();
  updatePaletteLabel();
  renderPalette();
  if (recipeModal.classList.contains("hidden")) {
    state.recipeResults = [];
    state.recipeRequest = null;
  }
}

function resetHarmonizePreview() {
  if (!state.harmonize.sourceColors.length) {
    return;
  }
  state.colors = clonePaletteColors(state.harmonize.sourceColors);
  state.harmonize.baselineColors = clonePaletteColors(state.harmonize.sourceColors);
  resetHarmonizeConfig();
  renderHarmonizePanel();
  syncPreviewDrivenViews();
}

function shouldCollapseSettingsOnMobile() {
  if (!isRealMobileLayout() || !state.image) {
    return false;
  }
  return state.image.height > state.image.width;
}

function shouldUseImageCoverOnMobile() {
  if (!isRealMobileLayout() || !state.image) {
    return false;
  }
  return true;
}

function shouldUseImageCoverOnDesktop() {
  if (isRealMobileLayout() || !state.image) {
    return false;
  }
  return state.image.width >= state.image.height;
}

function syncLayoutState() {
  const mobileLayout = isRealMobileLayout();
  const collapsibleSettings = shouldCollapseSettingsOnMobile();
  if (mobileLayout !== state.wasMobileLayout) {
    if (state.harmonize.isOpen) {
      closeHarmonizePanel({ restoreFocus: false, revertPreview: true });
    }
    state.wasMobileLayout = mobileLayout;
    state.isSettingsOpen = false;
  }

  if (!mobileLayout || !collapsibleSettings) {
    state.isSettingsOpen = false;
  }

  if (!mobileLayout || !state.colors.length) {
    state.isPaletteDrawerOpen = false;
  }

  root.dataset.mobileLayout = mobileLayout ? "true" : "false";
  root.dataset.settingsOpen = mobileLayout && collapsibleSettings && state.isSettingsOpen ? "true" : "false";
  root.dataset.settingsMode = mobileLayout && collapsibleSettings ? "overlay" : "inline";
  root.dataset.paletteDrawerOpen = mobileLayout && state.isPaletteDrawerOpen ? "true" : "false";

  settingsToggle.hidden = !mobileLayout || !collapsibleSettings;
  settingsToggle.setAttribute("aria-expanded", String(mobileLayout && collapsibleSettings && state.isSettingsOpen));
  hudSettingsPanel.hidden = mobileLayout && collapsibleSettings ? !state.isSettingsOpen : false;
  hudSettingsPanel.setAttribute("aria-hidden", String(mobileLayout && collapsibleSettings ? !state.isSettingsOpen : false));
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
    renderPalette({ skipSettle: true });
  }, PALETTE_DRAWER_SETTLE_DELAY_MS);
}

function clearPaletteSettleRender() {
  if (!state.paletteSettleRaf) return;
  cancelAnimationFrame(state.paletteSettleRaf);
  state.paletteSettleRaf = null;
}

function schedulePaletteSettleRender() {
  if (state.paletteDragId || state.dragId) {
    return;
  }
  clearPaletteSettleRender();
  let remainingFrames = 2;
  const settle = () => {
    if (remainingFrames > 0) {
      remainingFrames -= 1;
      state.paletteSettleRaf = requestAnimationFrame(settle);
      return;
    }
    state.paletteSettleRaf = null;
    renderPalette({ skipSettle: true });
  };
  state.paletteSettleRaf = requestAnimationFrame(settle);
}

function openPaletteDrawer(options = {}) {
  const { focusTarget = "close" } = options;
  if (!isRealMobileLayout() || !state.colors.length || state.isPaletteDrawerOpen) {
    return;
  }

  state.isPaletteDrawerOpen = true;
  syncLayoutState();
  schedulePaletteDrawerSettleRender();
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      renderPalette();
      if (focusTarget === "harmonize") {
        return;
      }
      paletteDrawerClose.focus({ preventScroll: true });
    });
  });
}

function closePaletteDrawer({ restoreFocus = true } = {}) {
  clearPaletteDrawerSettleTimer();
  if (state.harmonize.isOpen) {
    closeHarmonizePanel({ restoreFocus: false, revertPreview: true });
  }
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
  if (importWarningTimer) {
    window.clearTimeout(importWarningTimer);
    importWarningTimer = null;
  }
  importWarning.innerHTML = `<button class="import-warning__dismiss" type="button" data-action="import-warning-close" aria-label="Dismiss notice">x</button><strong>${title}</strong><p>${message}</p>`;
  importWarning.classList.remove("hidden");
  importWarningTimer = window.setTimeout(() => {
    clearImportWarning();
  }, 5000);
}

function clearImportWarning() {
  if (!importWarning) return;
  if (importWarningTimer) {
    window.clearTimeout(importWarningTimer);
    importWarningTimer = null;
  }
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
    const swatch = getResolvedPaintSwatchHex(paint) || "#2A2F36";
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

function handleImportWarningClick(event) {
  if (event.target.closest('[data-action="import-warning-close"]')) {
    clearImportWarning();
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

const RECIPE_EXPORT_CARD_WIDTH = 420;
const RECIPE_EXPORT_PADDING = 24;
const RECIPE_EXPORT_GAP = 12;
const HTML2CANVAS_URL = "https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js";
const RECIPE_EXPORT_STYLES = `
  :root { color-scheme: dark; }
  * { box-sizing: border-box; }
  body { margin: 0; }
  .recipe-export-sheet {
    width: var(--recipe-export-width);
    padding: ${RECIPE_EXPORT_PADDING}px;
    background: #111417;
    color: #f2efe8;
    font-family: "Space Grotesk", sans-serif;
  }
  .recipe-export-title {
    margin: 0 0 28px;
    color: #f2efe8;
    font-size: 26px;
    font-weight: 700;
    line-height: 1.15;
  }
  .recipe-stack {
    display: grid;
    grid-template-columns: repeat(var(--recipe-export-columns), minmax(0, var(--recipe-export-card-width)));
    gap: ${RECIPE_EXPORT_GAP}px;
    align-items: start;
  }
  .recipe-card {
    width: 100%;
    padding: 12px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 14px;
    background: rgba(255, 255, 255, 0.04);
  }
  .recipe-card-head {
    display: flex;
    align-items: center;
    width: 100%;
    margin: 0 0 10px;
    padding: 10px 12px;
    border-radius: 10px;
  }
  .recipe-card-head strong { font-size: 0.98rem; }
  .recipe-meta {
    display: grid;
    gap: 5px;
    margin-bottom: 10px;
  }
  .recipe-meta span,
  .recipe-note,
  .recipe-empty,
  .recipe-confidence,
  .recipe-list li small,
  .recipe-buy-copy small,
  .recipe-buy-reason,
  .recipe-section-caption,
  .recipe-steps,
  .recipe-inline-list {
    color: #bcc0c7;
    font-size: 0.82rem;
    line-height: 1.45;
  }
  .recipe-badge-row {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 10px;
  }
  .recipe-chip {
    display: inline-flex;
    align-items: center;
    min-height: 28px;
    padding: 4px 10px;
    border-radius: 999px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(255, 255, 255, 0.05);
    color: #f2efe8;
    font-size: 0.78rem;
    line-height: 1.2;
  }
  .recipe-list,
  .recipe-buy-list {
    display: grid;
    gap: 6px;
    margin: 0;
    padding: 0;
    list-style: none;
  }
  .recipe-list li,
  .recipe-buy-list li {
    display: flex;
    justify-content: space-between;
    align-items: start;
    gap: 12px;
    padding: 7px 9px;
    border-radius: 10px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    background: rgba(255, 255, 255, 0.05);
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.08),
      0 8px 18px rgba(0, 0, 0, 0.12);
  }
  .recipe-buy-copy {
    display: grid;
    gap: 3px;
    min-width: 0;
  }
  .recipe-buy-copy strong { text-transform: uppercase; }
  .recipe-component-head {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    flex-wrap: nowrap;
  }
  .recipe-component-head strong {
    display: inline-flex;
    align-items: center;
  }
  .recipe-component-dot {
    width: 14px;
    height: 14px;
    border-radius: 999px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.12);
    flex: 0 0 14px;
  }
  .recipe-mix-percent {
    flex: 0 0 auto;
    white-space: nowrap;
    line-height: 1.2;
    font-size: 0.98rem;
  }
  .recipe-section {
    display: grid;
    gap: 8px;
    margin-top: 12px;
  }
  .recipe-section strong {
    font-size: 0.84rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
  .recipe-section-head {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 10px;
  }
  .recipe-buy-reason {
    text-align: right;
    text-transform: capitalize;
    flex: 0 0 auto;
  }
  .recipe-ideal-banner {
    display: grid;
    gap: 6px;
    margin-top: 12px;
    padding: 10px 12px;
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(255, 255, 255, 0.05);
  }
  .recipe-ideal-banner strong {
    font-size: 0.72rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #bcc0c7;
  }
  .recipe-steps,
  .recipe-inline-list {
    display: grid;
    gap: 8px;
    margin: 0;
    padding-left: 18px;
  }
`;
let html2CanvasPromise = null;

function getRecipeSwatchColor(entry) {
  return entry.display.swatchColor || entry.target_hex;
}

function getRecipeHeaderTextColor(colorHex) {
  const color = hexToRgb(colorHex);
  return luminance(color.r, color.g, color.b) > 0.62 ? "#15171a" : "#f2efe8";
}

function buildRecipeCardMarkup(entry) {
  const swatchColor = getRecipeSwatchColor(entry);
  return `
    <section class="recipe-card" style="--recipe-color:${escapeHtml(swatchColor)}">
      <div class="recipe-card-head" style="background:${escapeHtml(swatchColor)};color:${getRecipeHeaderTextColor(swatchColor)};"><strong>${escapeHtml(entry.target_hex)}</strong></div>
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
      <ul class="recipe-list">${entry.recipe.components.map((item) => `<li><span class="recipe-buy-copy"><span class="recipe-component-head"><span class="recipe-component-dot" style="background:${escapeHtml(item.swatch_hex || "#2A2F36")}"></span><strong>${escapeHtml(getPaintLabel(item))}</strong></span><small>${escapeHtml(formatPaintDetailLine(item))}</small></span><strong class="recipe-mix-percent">${item.mass_percent}%</strong></li>`).join("")}</ul>
      <div class="recipe-section">
        <strong>Mixing steps</strong>
        <ol class="recipe-steps">${entry.recipe.mixing_steps.map((step) => `<li>${escapeHtml(step)}</li>`).join("")}</ol>
      </div>
      ${entry.quality.gamut_note ? `<p class="recipe-note">${escapeHtml(entry.quality.gamut_note)}</p>` : ""}
      ${entry.display.idealMixLabel ? `<div class="recipe-ideal-banner"><strong>${escapeHtml(entry.display.idealMixLabel)}</strong></div>` : ""}
      ${entry.catalog_matches?.length ? `<div class="recipe-section"><div class="recipe-section-head"><strong>Buy Williamsburg</strong><span class="recipe-section-caption">${escapeHtml(entry.display.catalogRefreshLabel || "Williamsburg active catalog")}</span></div><ul class="recipe-buy-list">${entry.catalog_matches.map((item) => `<li><span class="recipe-buy-copy"><span class="recipe-component-head"><span class="recipe-component-dot" style="background:${escapeHtml(item.swatch_hex || "#2A2F36")}"></span><strong>${escapeHtml(item.color_name)}</strong></span><small>${escapeHtml(formatPaintDetailLine(item))}</small></span><small class="recipe-buy-reason">${Math.round(item.recommended_mass_percent || 0)}%</small></li>`).join("")}</ul></div>` : ""}
      ${entry.substitutions.length ? `<div class="recipe-section"><strong>Substitutions</strong><ul class="recipe-inline-list">${entry.substitutions.map((item) => `<li>${escapeHtml(item.missing_paint)} -> ${escapeHtml(item.recommended_substitute.color_name)} (${escapeHtml(item.match_class.replaceAll("_", " "))})</li>`).join("")}</ul></div>` : ""}
      ${entry.warnings.length ? `<div class="recipe-section"><strong>Warnings</strong><ul class="recipe-inline-list">${entry.warnings.map((warning) => `<li>${escapeHtml(warning)}</li>`).join("")}</ul></div>` : ""}
    </section>`;
}

function buildRecipeCardsMarkup() {
  return `<div class="recipe-stack">${state.recipeResults.map((entry) => buildRecipeCardMarkup(entry)).join("")}</div>`;
}

function buildRecipeExportMarkup(columns, width) {
  return `<div xmlns="http://www.w3.org/1999/xhtml" class="recipe-export-sheet" style="--recipe-export-columns:${columns};--recipe-export-card-width:${RECIPE_EXPORT_CARD_WIDTH}px;--recipe-export-width:${width}px"><h1 class="recipe-export-title">Paint recipes</h1>${buildRecipeCardsMarkup()}</div>`;
}

function waitForNextFrame() {
  return new Promise((resolve) => {
    requestAnimationFrame(() => resolve());
  });
}

async function loadHtml2Canvas() {
  if (window.html2canvas) {
    return window.html2canvas;
  }
  if (html2CanvasPromise) {
    return html2CanvasPromise;
  }

  html2CanvasPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = HTML2CANVAS_URL;
    script.async = true;
    script.onload = () => {
      if (window.html2canvas) {
        resolve(window.html2canvas);
      } else {
        reject(new Error("html2canvas did not initialize"));
      }
    };
    script.onerror = () => reject(new Error("html2canvas failed to load"));
    document.head.appendChild(script);
  }).catch((error) => {
    html2CanvasPromise = null;
    throw error;
  });

  return html2CanvasPromise;
}

async function renderRecipeExportCanvasWithSvg(exportMarkup, width, height) {
  const svgMarkup = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><foreignObject width="100%" height="100%"><div xmlns="http://www.w3.org/1999/xhtml"><style>${RECIPE_EXPORT_STYLES}</style>${exportMarkup}</div></foreignObject></svg>`;
  const svgUrl = URL.createObjectURL(new Blob([svgMarkup], { type: "image/svg+xml;charset=utf-8" }));
  try {
    const image = await readImageFromSource(svgUrl);
    const scale = 2;
    const exportCanvas = document.createElement("canvas");
    exportCanvas.width = width * scale;
    exportCanvas.height = height * scale;
    const exportCtx = exportCanvas.getContext("2d");
    exportCtx.scale(scale, scale);
    exportCtx.fillStyle = "#111417";
    exportCtx.fillRect(0, 0, width, height);
    exportCtx.drawImage(image, 0, 0, width, height);
    return exportCanvas;
  } finally {
    URL.revokeObjectURL(svgUrl);
  }
}

async function renderRecipeExportCanvas() {
  const cardCount = state.recipeResults.length;
  const columns = Math.ceil(Math.sqrt(cardCount));
  const width = (RECIPE_EXPORT_PADDING * 2) + (columns * RECIPE_EXPORT_CARD_WIDTH) + (Math.max(0, columns - 1) * RECIPE_EXPORT_GAP);
  const exportMarkup = buildRecipeExportMarkup(columns, width);
  const measurementHost = document.createElement("div");
  measurementHost.style.position = "fixed";
  measurementHost.style.left = "-100000px";
  measurementHost.style.top = "0";
  measurementHost.style.opacity = "0";
  measurementHost.style.pointerEvents = "none";
  measurementHost.innerHTML = `<style>${RECIPE_EXPORT_STYLES}</style>${exportMarkup}`;
  document.body.appendChild(measurementHost);
  const sheet = measurementHost.querySelector(".recipe-export-sheet");
  try {
    if (document.fonts?.ready) {
      await Promise.race([document.fonts.ready, new Promise((resolve) => window.setTimeout(resolve, 1200))]);
    }
    await waitForNextFrame();
    await waitForNextFrame();
    const height = Math.ceil(sheet.getBoundingClientRect().height);
    try {
      const html2canvas = await loadHtml2Canvas();
      return await html2canvas(sheet, {
        backgroundColor: "#111417",
        scale: 2,
        logging: false,
        useCORS: true,
      });
    } catch (error) {
      return await renderRecipeExportCanvasWithSvg(exportMarkup, width, height);
    }
  } finally {
    measurementHost.remove();
  }
}

async function exportRecipeImage() {
  if (!state.recipeResults.length) {
    showRecipeMessage("Upload an image first to generate paint recipes for the palette.");
    return;
  }

  try {
    const exportCanvas = await renderRecipeExportCanvas();
    const link = document.createElement("a");
    link.href = exportCanvas.toDataURL("image/png");
    link.download = `paint-recipes-${Date.now()}.png`;
    link.click();
  } catch (error) {
    showRecipeMessage("Recipe export could not render. Try again in a moment.");
  }
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
  recipeContent.innerHTML = buildRecipeCardsMarkup();
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
  const coverMobileImage = shouldUseImageCoverOnMobile();
  const coverDesktopImage = shouldUseImageCoverOnDesktop();
  const coverImage = coverMobileImage || coverDesktopImage;
  let drawWidth;
  let drawHeight;
  let offsetX = 0;
  let offsetY = 0;
  if (coverImage) {
    if (imageRatio > frameRatio) {
      drawHeight = reducedHeight;
      drawWidth = reducedHeight * imageRatio;
      offsetX = (reducedWidth - drawWidth) / 2;
    } else {
      drawWidth = reducedWidth;
      drawHeight = reducedWidth / imageRatio;
      offsetY = (reducedHeight - drawHeight) / 2;
    }
  } else {
    if (imageRatio > frameRatio) {
      drawWidth = reducedWidth;
      drawHeight = reducedWidth / imageRatio;
      offsetY = (reducedHeight - drawHeight) / 2;
    } else {
      drawHeight = reducedHeight;
      drawWidth = reducedHeight * imageRatio;
      offsetX = (reducedWidth - drawWidth) / 2;
    }
  }
  const imageDisplayWidth = coverImage
    ? displayWidth
    : (imageRatio > frameRatio ? displayWidth : displayHeight * imageRatio);
  const imageDisplayHeight = coverImage
    ? displayHeight
    : (imageRatio > frameRatio ? displayWidth / imageRatio : displayHeight);
  state.imageBounds = {
    x: coverImage ? 0 : Math.max(0, (displayWidth - imageDisplayWidth) / 2),
    y: coverImage ? 0 : Math.max(0, (displayHeight - imageDisplayHeight) / 2),
    width: Math.max(1, imageDisplayWidth),
    height: Math.max(1, imageDisplayHeight),
  };
  swatchLayer.style.inset = "auto";
  swatchLayer.style.left = `${state.imageBounds.x}px`;
  swatchLayer.style.top = `${state.imageBounds.y}px`;
  swatchLayer.style.width = `${state.imageBounds.width}px`;
  swatchLayer.style.height = `${state.imageBounds.height}px`;
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

function getImageBounds() {
  const bounds = state.imageBounds;
  if (bounds && bounds.width > 0 && bounds.height > 0) {
    return bounds;
  }
  return {
    x: 0,
    y: 0,
    width: Math.max(1, state.sourceWidth || canvasWrap.clientWidth || 1),
    height: Math.max(1, state.sourceHeight || canvasWrap.clientHeight || 1),
  };
}

function getCanvasSamplePoint(x, y) {
  const bounds = getImageBounds();
  return {
    x: bounds.x + clamp(x, 0, bounds.width),
    y: bounds.y + clamp(y, 0, bounds.height),
  };
}

function sampleCanvasColor(x, y) {
  const bounds = getImageBounds();
  const point = getCanvasSamplePoint(x, y);
  const minPixelX = clamp(Math.floor(bounds.x * state.dpr), 0, canvas.width - 1);
  const maxPixelX = clamp(Math.ceil((bounds.x + bounds.width) * state.dpr) - 1, 0, canvas.width - 1);
  const minPixelY = clamp(Math.floor(bounds.y * state.dpr), 0, canvas.height - 1);
  const maxPixelY = clamp(Math.ceil((bounds.y + bounds.height) * state.dpr) - 1, 0, canvas.height - 1);
  const pixelX = clamp(Math.round(point.x * state.dpr), minPixelX, maxPixelX);
  const pixelY = clamp(Math.round(point.y * state.dpr), minPixelY, maxPixelY);
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

function getUniformPaletteHeights(count, availableHeight, gap = PALETTE_GAP, minHeight = PALETTE_SINGLE_MIN_HEIGHT) {
  if (!count) return [];
  const totalGaps = Math.max(0, count - 1) * gap;
  const usableHeight = Math.max(minHeight * count, availableHeight - totalGaps);
  const uniformHeight = usableHeight / count;
  return new Array(count).fill(uniformHeight);
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
  const harmonizeVisible = !harmonizePanel.hidden && window.getComputedStyle(harmonizePanel).display !== "none";
  const usedHeights = [
    openVisible ? paletteDrawerOpen.getBoundingClientRect().height : 0,
    summaryVisible ? paletteDrawerSummary.getBoundingClientRect().height : 0,
    toolbarVisible ? desktopPaletteToolbar.getBoundingClientRect().height : 0,
    harmonizeVisible ? harmonizePanel.getBoundingClientRect().height : 0,
  ].filter((value) => value > 0);
  const visibleItems = usedHeights.length + 1;
  const gaps = Math.max(0, visibleItems - 1) * gap;
  const computedHeight = Math.max(0, Math.round(panelHeight - paddingTop - paddingBottom - gaps - usedHeights.reduce((sum, value) => sum + value, 0)));

  if (isRealMobileLayout() && state.isPaletteDrawerOpen) {
    const mobileCandidates = [computedHeight, sheetHeight, listHeight].filter((value) => value > 0);
    const fittedHeight = mobileCandidates.length
      ? Math.min(...mobileCandidates)
      : Math.max(0, Math.round(computedHeight || sheetHeight || listHeight));
    return Math.max(0, fittedHeight - 4);
  }

  const desktopCandidates = [computedHeight, sheetHeight, listHeight].filter((value) => value > 0);
  const fittedHeight = desktopCandidates.length
    ? Math.min(...desktopCandidates)
    : Math.max(0, Math.round(listHeight));
  return Math.max(0, Math.round(fittedHeight));
}

function getPaletteHeightConfig() {
  if (isRealMobileLayout() && state.isPaletteDrawerOpen && state.harmonize.isOpen) {
    return {
      gap: MOBILE_HARMONIZE_PALETTE_GAP,
      singleMinHeight: MOBILE_HARMONIZE_SINGLE_MIN_HEIGHT,
      twoColumnPreferredMinHeight: MOBILE_HARMONIZE_TWO_COLUMN_TARGET_MIN_HEIGHT,
      twoColumnFloorHeight: MOBILE_HARMONIZE_TWO_COLUMN_FLOOR_HEIGHT,
      useUniformHeights: true,
    };
  }

  return {
    gap: PALETTE_GAP,
    singleMinHeight: PALETTE_SINGLE_MIN_HEIGHT,
    twoColumnPreferredMinHeight: PALETTE_TWO_COLUMN_TARGET_MIN_HEIGHT,
    twoColumnFloorHeight: PALETTE_TWO_COLUMN_FLOOR_HEIGHT,
    useUniformHeights: false,
  };
}

function getPaletteHeightMap() {
  const availableHeight = getPaletteAvailableHeight();
  const heightConfig = getPaletteHeightConfig();
  const heightById = new Map();

  if (!isTwoColumnPalette()) {
    const rawHeights = heightConfig.useUniformHeights
      ? getUniformPaletteHeights(state.colors.length, availableHeight, heightConfig.gap, heightConfig.singleMinHeight)
      : getScaledPaletteHeights(state.colors, availableHeight, heightConfig.gap, heightConfig.singleMinHeight);
    const heights = normalizePaletteHeights(
      rawHeights,
      availableHeight,
      heightConfig.gap,
      heightConfig.singleMinHeight,
    );
    state.colors.forEach((color, index) => {
      heightById.set(color.id, heights[index] || heightConfig.singleMinHeight);
    });
    return heightById;
  }

  const leftCount = getPaletteLeftColumnCount();
  const columns = [state.colors.slice(0, leftCount), state.colors.slice(leftCount)];
  columns.forEach((columnColors) => {
    const rawHeights = heightConfig.useUniformHeights
      ? getUniformPaletteHeights(columnColors.length, availableHeight, heightConfig.gap, heightConfig.twoColumnFloorHeight)
      : getFittedPaletteHeights(columnColors, availableHeight, heightConfig.gap, heightConfig.twoColumnPreferredMinHeight, heightConfig.twoColumnFloorHeight);
    const heights = normalizePaletteHeights(
      rawHeights,
      availableHeight,
      heightConfig.gap,
      heightConfig.twoColumnFloorHeight,
    );
    columnColors.forEach((color, index) => {
      heightById.set(color.id, heights[index] || heightConfig.twoColumnFloorHeight);
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
  const bounds = getImageBounds();
  const scaleX = imageWidth / Math.max(1, state.sourceWidth);
  const scaleY = imageHeight / Math.max(1, state.sourceHeight);
  state.colors.forEach((color) => {
    const x = imageX + ((bounds.x + (color.x * bounds.width)) * scaleX);
    const y = imageY + ((bounds.y + (color.y * bounds.height)) * scaleY);
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

function normalizeExportLayout(layout) {
  switch (layout) {
    case EXPORT_LAYOUT_STRIP:
    case EXPORT_LAYOUT_WHEEL:
    case EXPORT_LAYOUT_GRADIENT:
      return layout;
    case EXPORT_LAYOUT_CURRENT:
    default:
      return EXPORT_LAYOUT_CURRENT;
  }
}

function normalizeExportWheelOrder(order) {
  return order === EXPORT_WHEEL_ORDER_HUE ? EXPORT_WHEEL_ORDER_HUE : EXPORT_WHEEL_ORDER_PALETTE;
}

function createSaveGradientNodeSnapshot() {
  return state.colors.map((color) => ({
    id: color.id,
    x: clamp(typeof color.x === "number" ? color.x : 0.5, 0, 1),
    y: clamp(typeof color.y === "number" ? color.y : 0.5, 0, 1),
    percent: color.percent,
    hex: color.hex,
  }));
}

function seedSaveGradientNodesFromColors() {
  state.saveExport.gradientNodes = createSaveGradientNodeSnapshot();
  state.saveExport.gradientDragId = null;
  state.saveExport.gradientDragPointerId = null;
}

function getMergedSaveGradientNodes() {
  const colorById = new Map(state.colors.map((color) => [color.id, color]));
  const hasMatchingNodeSet = state.saveExport.gradientNodes.length === state.colors.length
    && state.saveExport.gradientNodes.every((node) => colorById.has(node.id));
  if (!hasMatchingNodeSet) {
    seedSaveGradientNodesFromColors();
  }

  return state.saveExport.gradientNodes.map((node) => {
    const color = colorById.get(node.id);
    return {
      id: node.id,
      x: clamp(typeof node.x === "number" ? node.x : 0.5, 0, 1),
      y: clamp(typeof node.y === "number" ? node.y : 0.5, 0, 1),
      percent: color ? color.percent : node.percent,
      hex: color ? color.hex : node.hex,
      r: color ? color.r : 0,
      g: color ? color.g : 0,
      b: color ? color.b : 0,
    };
  });
}

function getExportAspectCanvasDimensions(longestEdge = 1400) {
  const sourceWidth = Math.max(1, state.sourceWidth || 1);
  const sourceHeight = Math.max(1, state.sourceHeight || 1);
  if (sourceWidth >= sourceHeight) {
    return {
      width: longestEdge,
      height: Math.max(1, Math.round(longestEdge * (sourceHeight / sourceWidth))),
    };
  }

  return {
    width: Math.max(1, Math.round(longestEdge * (sourceWidth / sourceHeight))),
    height: longestEdge,
  };
}

function getAdjustedExportLchRgb(color, { lightnessShift = 0, chromaScale = 1, chromaShift = 0 } = {}) {
  const sourceLab = rgbToLab(color);
  const sourceLch = labToLch(sourceLab);
  const adjustedLab = lchToLab({
    l: clamp(sourceLch.l + lightnessShift, 0, 100),
    c: Math.max(0, (sourceLch.c * chromaScale) + chromaShift),
    h: sourceLch.h,
  });
  return labToRgbWithGamutInfo(adjustedLab).rgb;
}

function getExportWheelRingFill(color, ringIndex) {
  if (ringIndex === 2) {
    return color.hex;
  }

  const adjusted = ringIndex === 0
    ? getAdjustedExportLchRgb(color, { lightnessShift: 18, chromaScale: 0.58, chromaShift: -4 })
    : ringIndex === 1
      ? getAdjustedExportLchRgb(color, { lightnessShift: 8, chromaScale: 0.88, chromaShift: -1 })
      : getAdjustedExportLchRgb(color, { lightnessShift: -4, chromaScale: 1.18, chromaShift: 5 });
  return rgbToHex(adjusted.r, adjusted.g, adjusted.b);
}

function getSortedWheelColors(order) {
  const paletteOrder = state.colors.map((color, index) => {
    const lch = labToLch(rgbToLab(color));
    return {
      color,
      index,
      hue: lch.h,
      nearNeutral: isNearNeutral(lch),
    };
  });

  if (normalizeExportWheelOrder(order) !== EXPORT_WHEEL_ORDER_HUE) {
    return paletteOrder.map((entry) => entry.color);
  }

  const chromatic = paletteOrder
    .filter((entry) => !entry.nearNeutral)
    .sort((a, b) => a.hue - b.hue || a.index - b.index);
  const neutrals = paletteOrder.filter((entry) => entry.nearNeutral);
  return [...chromatic, ...neutrals].map((entry) => entry.color);
}

function createExportNoisePattern(size = 160) {
  const noiseCanvas = document.createElement("canvas");
  noiseCanvas.width = size;
  noiseCanvas.height = size;
  const noiseCtx = noiseCanvas.getContext("2d");
  const imageData = noiseCtx.createImageData(size, size);
  for (let index = 0; index < imageData.data.length; index += 4) {
    const grain = 120 + Math.round((Math.random() - 0.5) * 44);
    imageData.data[index] = grain;
    imageData.data[index + 1] = grain;
    imageData.data[index + 2] = grain;
    imageData.data[index + 3] = 22 + Math.round(Math.random() * 30);
  }
  noiseCtx.putImageData(imageData, 0, 0);
  return noiseCanvas;
}

function getExportNoisePatternCanvas() {
  if (!state.saveExport.noisePatternCanvas) {
    state.saveExport.noisePatternCanvas = createExportNoisePattern();
  }
  return state.saveExport.noisePatternCanvas;
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

function buildWheelExportBaseCanvas(options) {
  const orderedColors = getSortedWheelColors(options?.wheelOrder);
  const exportCanvas = document.createElement("canvas");
  const size = 1400;
  const center = size / 2;
  const radius = 600;
  const ringFractions = [0.18, 0.22, 0.34, 0.26];
  const totalPercent = orderedColors.reduce((sum, color) => sum + color.percent, 0) || orderedColors.length || 1;
  const exportCtx = exportCanvas.getContext("2d");
  exportCanvas.width = size;
  exportCanvas.height = size;

  const background = exportCtx.createRadialGradient(center, center, radius * 0.08, center, center, radius * 1.15);
  background.addColorStop(0, "#262a30");
  background.addColorStop(1, "#111417");
  exportCtx.fillStyle = background;
  exportCtx.fillRect(0, 0, size, size);

  let startAngle = -Math.PI / 2;
  orderedColors.forEach((color) => {
    const sweep = ((color.percent || (100 / orderedColors.length)) / totalPercent) * Math.PI * 2;
    const endAngle = startAngle + sweep;
    let innerRadius = 0;

    ringFractions.forEach((fraction, ringIndex) => {
      const outerRadius = innerRadius + (radius * fraction);
      exportCtx.beginPath();
      exportCtx.moveTo(center + (Math.cos(startAngle) * innerRadius), center + (Math.sin(startAngle) * innerRadius));
      exportCtx.arc(center, center, outerRadius, startAngle, endAngle);
      exportCtx.lineTo(center + (Math.cos(endAngle) * innerRadius), center + (Math.sin(endAngle) * innerRadius));
      if (innerRadius > 0) {
        exportCtx.arc(center, center, innerRadius, endAngle, startAngle, true);
      } else {
        exportCtx.lineTo(center, center);
      }
      exportCtx.closePath();
      exportCtx.fillStyle = getExportWheelRingFill(color, ringIndex);
      exportCtx.fill();
      exportCtx.lineWidth = 5;
      exportCtx.strokeStyle = "rgba(248, 246, 242, 0.96)";
      exportCtx.lineJoin = "round";
      exportCtx.lineCap = "round";
      exportCtx.stroke();
      innerRadius = outerRadius;
    });

    startAngle = endAngle;
  });

  exportCtx.beginPath();
  exportCtx.arc(center, center, 7, 0, Math.PI * 2);
  exportCtx.fillStyle = "rgba(255, 255, 255, 0.96)";
  exportCtx.fill();

  return exportCanvas;
}

function buildGradientExportBaseCanvas(options) {
  const { width, height } = getExportAspectCanvasDimensions(1400);
  const exportCanvas = document.createElement("canvas");
  exportCanvas.width = width;
  exportCanvas.height = height;
  const exportCtx = exportCanvas.getContext("2d");
  const minDimension = Math.min(width, height);
  const nodes = getMergedSaveGradientNodes();

  const background = exportCtx.createLinearGradient(0, 0, width, height);
  background.addColorStop(0, "#17191c");
  background.addColorStop(0.45, "#121417");
  background.addColorStop(1, "#1b2025");
  exportCtx.fillStyle = background;
  exportCtx.fillRect(0, 0, width, height);

  const vignette = exportCtx.createRadialGradient(width * 0.5, height * 0.42, minDimension * 0.08, width * 0.5, height * 0.5, minDimension * 0.8);
  vignette.addColorStop(0, "rgba(255,255,255,0.06)");
  vignette.addColorStop(1, "rgba(0,0,0,0.24)");
  exportCtx.fillStyle = vignette;
  exportCtx.fillRect(0, 0, width, height);

  const blobCanvas = document.createElement("canvas");
  blobCanvas.width = width;
  blobCanvas.height = height;
  const blobCtx = blobCanvas.getContext("2d");
  const totalPercent = Math.max(1, nodes.reduce((sum, node) => sum + (node.percent || 0), 0));

  nodes.forEach((node) => {
    const percentWeight = clamp((node.percent || 0) / totalPercent, 0.04, 0.9);
    const radius = minDimension * (0.18 + (0.46 * Math.sqrt(percentWeight)));
    const x = node.x * width;
    const y = node.y * height;
    const glow = blobCtx.createRadialGradient(x, y, 0, x, y, radius);
    glow.addColorStop(0, `rgba(${node.r}, ${node.g}, ${node.b}, 0.96)`);
    glow.addColorStop(0.38, `rgba(${node.r}, ${node.g}, ${node.b}, 0.72)`);
    glow.addColorStop(0.72, `rgba(${node.r}, ${node.g}, ${node.b}, 0.28)`);
    glow.addColorStop(1, `rgba(${node.r}, ${node.g}, ${node.b}, 0)`);
    blobCtx.fillStyle = glow;
    blobCtx.beginPath();
    blobCtx.arc(x, y, radius, 0, Math.PI * 2);
    blobCtx.fill();
  });

  exportCtx.save();
  exportCtx.globalCompositeOperation = "screen";
  exportCtx.filter = `blur(${Math.max(28, Math.round(minDimension * 0.06))}px) saturate(118%)`;
  exportCtx.drawImage(blobCanvas, 0, 0);
  exportCtx.restore();

  exportCtx.save();
  exportCtx.globalCompositeOperation = "screen";
  exportCtx.globalAlpha = 0.32;
  exportCtx.filter = `blur(${Math.max(10, Math.round(minDimension * 0.018))}px)`;
  exportCtx.drawImage(blobCanvas, 0, 0);
  exportCtx.restore();

  const noisePatternCanvas = getExportNoisePatternCanvas();
  const pattern = exportCtx.createPattern(noisePatternCanvas, "repeat");
  if (pattern) {
    exportCtx.save();
    exportCtx.globalAlpha = 0.12;
    exportCtx.globalCompositeOperation = "soft-light";
    exportCtx.fillStyle = pattern;
    exportCtx.fillRect(0, 0, width, height);
    exportCtx.restore();
  }

  exportCtx.save();
  exportCtx.fillStyle = "rgba(8, 10, 12, 0.1)";
  exportCtx.fillRect(0, 0, width, height);
  exportCtx.restore();

  return exportCanvas;
}

function buildExportCanvas(options = state.saveExport) {
  const exportOptions = {
    layout: normalizeExportLayout(options?.layout),
    wheelOrder: normalizeExportWheelOrder(options?.wheelOrder),
    longestEdge: options?.longestEdge || EXPORT_DEFAULT_LONGEST_EDGE,
    stripNodes: Boolean(options?.stripNodes),
    gradientNodes: options?.gradientNodes || [],
  };
  const baseCanvas = exportOptions.layout === EXPORT_LAYOUT_STRIP
    ? buildStripExportBaseCanvas(exportOptions)
    : exportOptions.layout === EXPORT_LAYOUT_WHEEL
      ? buildWheelExportBaseCanvas(exportOptions)
      : exportOptions.layout === EXPORT_LAYOUT_GRADIENT
        ? buildGradientExportBaseCanvas(exportOptions)
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
  saveWheelOrderButtons.forEach((button) => {
    const active = button.dataset.saveWheelOrder === state.saveExport.wheelOrder;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", active ? "true" : "false");
  });
  saveSizeButtons.forEach((button) => {
    const active = Number(button.dataset.saveSize) === state.saveExport.longestEdge;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", active ? "true" : "false");
  });
  saveStyleSettings.hidden = false;
  saveStripNodes.checked = state.saveExport.stripNodes;
  saveNodesRow.hidden = state.saveExport.layout === EXPORT_LAYOUT_WHEEL || state.saveExport.layout === EXPORT_LAYOUT_GRADIENT;
  saveWheelOrderRow.hidden = state.saveExport.layout !== EXPORT_LAYOUT_WHEEL;
  saveGradientRow.hidden = state.saveExport.layout !== EXPORT_LAYOUT_GRADIENT;
}

function resetSaveExportState() {
  state.saveExport.layout = EXPORT_LAYOUT_CURRENT;
  state.saveExport.wheelOrder = EXPORT_WHEEL_ORDER_PALETTE;
  state.saveExport.longestEdge = EXPORT_DEFAULT_LONGEST_EDGE;
  state.saveExport.stripNodes = false;
  seedSaveGradientNodesFromColors();
  syncSaveModalControls();
}

function getSavePreviewOverlayBounds() {
  if (savePreviewCanvas.hidden) {
    return null;
  }
  const shellRect = savePreviewShell.getBoundingClientRect();
  const canvasRect = savePreviewCanvas.getBoundingClientRect();
  if (!canvasRect.width || !canvasRect.height) {
    return null;
  }
  return {
    left: canvasRect.left,
    top: canvasRect.top,
    width: canvasRect.width,
    height: canvasRect.height,
    offsetLeft: canvasRect.left - shellRect.left,
    offsetTop: canvasRect.top - shellRect.top,
  };
}

function clearSavePreviewRaf() {
  if (!state.saveExport.previewRaf) {
    return;
  }
  cancelAnimationFrame(state.saveExport.previewRaf);
  state.saveExport.previewRaf = null;
}

function scheduleSavePreviewRender() {
  if (state.saveExport.previewRaf) {
    return;
  }
  state.saveExport.previewRaf = requestAnimationFrame(() => {
    state.saveExport.previewRaf = null;
    renderSavePreview();
  });
}

function renderSavePreviewOverlay() {
  savePreviewOverlay.innerHTML = "";
  savePreviewOverlay.hidden = true;
  savePreviewOverlay.style.left = "";
  savePreviewOverlay.style.top = "";
  savePreviewOverlay.style.width = "";
  savePreviewOverlay.style.height = "";

  if (state.saveExport.layout !== EXPORT_LAYOUT_GRADIENT || saveModal.classList.contains("hidden") || savePreviewCanvas.hidden) {
    return;
  }

  const bounds = getSavePreviewOverlayBounds();
  if (!bounds) {
    return;
  }

  savePreviewOverlay.hidden = false;
  savePreviewOverlay.style.left = `${bounds.offsetLeft}px`;
  savePreviewOverlay.style.top = `${bounds.offsetTop}px`;
  savePreviewOverlay.style.width = `${bounds.width}px`;
  savePreviewOverlay.style.height = `${bounds.height}px`;
  const fragment = document.createDocumentFragment();

  getMergedSaveGradientNodes().forEach((node) => {
    const handle = document.createElement("button");
    handle.className = "save-preview-node";
    handle.type = "button";
    handle.dataset.nodeId = node.id;
    handle.setAttribute("aria-label", `${node.hex} export node`);
    handle.title = `${node.hex} export node`;
    handle.style.left = `${node.x * bounds.width}px`;
    handle.style.top = `${node.y * bounds.height}px`;
    handle.style.setProperty("--node-color", node.hex);
    if (state.saveExport.gradientDragId === node.id) {
      handle.classList.add("active");
    }
    handle.addEventListener("pointerdown", (event) => {
      startSaveGradientNodeDrag(event, node.id);
    });
    fragment.appendChild(handle);
  });

  savePreviewOverlay.appendChild(fragment);
}

function renderSavePreview() {
  if (!state.image || !state.colors.length) {
    savePreviewCanvas.hidden = true;
    savePreviewEmpty.hidden = false;
    savePreviewEmpty.textContent = "Upload an image first to preview export options.";
    renderSavePreviewOverlay();
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
  requestAnimationFrame(() => {
    renderSavePreviewOverlay();
  });
}

function closeSaveModal() {
  if (!saveModal) return;
  clearSavePreviewRaf();
  endSaveGradientNodeDrag();
  savePreviewOverlay.innerHTML = "";
  savePreviewOverlay.hidden = true;
  saveModal.classList.add("hidden");
  saveModal.setAttribute("aria-hidden", "true");
}

function openSaveModal() {
  if (!state.image || !state.colors.length) {
    showImportWarning("Export options", "Upload an image first to preview and export layouts.");
    return;
  }
  closeRecipeModal();
  resetSaveExportState();
  saveModal.classList.remove("hidden");
  saveModal.setAttribute("aria-hidden", "false");
  renderSavePreview();
}

function exportConfiguredImage() {
  if (!state.image || !state.colors.length) return;
  const exportCanvas = buildExportCanvas(state.saveExport);
  downloadCanvas(exportCanvas, "color-study");
}

function updateSaveGradientNodeFromClientPosition(clientX, clientY) {
  const bounds = getSavePreviewOverlayBounds();
  if (!bounds || !state.saveExport.gradientDragId) {
    return;
  }

  const node = state.saveExport.gradientNodes.find((entry) => entry.id === state.saveExport.gradientDragId);
  if (!node) {
    return;
  }

  node.x = clamp((clientX - bounds.left) / Math.max(1, bounds.width), 0, 1);
  node.y = clamp((clientY - bounds.top) / Math.max(1, bounds.height), 0, 1);
}

function startSaveGradientNodeDrag(event, id) {
  if (state.saveExport.layout !== EXPORT_LAYOUT_GRADIENT || saveModal.classList.contains("hidden")) {
    return;
  }

  event.preventDefault();
  event.stopPropagation();
  state.saveExport.gradientDragId = id;
  state.saveExport.gradientDragPointerId = event.pointerId ?? null;
  lockPageScroll(SCROLL_LOCK_SAVE_GRADIENT_DRAG);
  updateSaveGradientNodeFromClientPosition(event.clientX, event.clientY);
  scheduleSavePreviewRender();
}

function handleSaveGradientNodeDrag(event) {
  if (!state.saveExport.gradientDragId) {
    return;
  }

  event.preventDefault();
  updateSaveGradientNodeFromClientPosition(event.clientX, event.clientY);
  scheduleSavePreviewRender();
}

function endSaveGradientNodeDrag() {
  if (!state.saveExport.gradientDragId) {
    return;
  }

  state.saveExport.gradientDragId = null;
  state.saveExport.gradientDragPointerId = null;
  unlockPageScroll(SCROLL_LOCK_SAVE_GRADIENT_DRAG);
  renderSavePreviewOverlay();
}

function startPaletteDrag(event, id) {
  if (state.harmonize.isOpen) return;
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
  syncHarmonizeSourceColors();
}

function createPaletteCard(color, height) {
  const card = document.createElement('div');
  const lockState = getHarmonizeLockPresentation(color.id, color.hex);
  card.className = 'palette-card';
  if (state.hoveredColorId === color.id) card.classList.add('hovered');
  card.style.setProperty('--card-color', color.hex);
  card.style.background = `linear-gradient(135deg, ${color.hex}, color-mix(in srgb, ${color.hex} 58%, #17191c))`;
  card.style.height = `${height || 52}px`;
  const textColor = luminance(color.r, color.g, color.b) > 0.62 ? '#15171a' : '#f2efe8';
  card.style.color = textColor;
  card.dataset.id = color.id;
  card.dataset.harmonizeLocked = lockState.locked ? "true" : "false";
  card.dataset.harmonizeAnchor = lockState.isAnchor ? "true" : "false";
  card.addEventListener('pointerdown', (event) => startPaletteDrag(event, color.id));
  card.innerHTML = `<div class="palette-meta"><div class="palette-line"><button class="palette-code palette-copy" type="button" data-copy-hex="${color.hex}" title="Copy"><strong>${color.hex}</strong></button><span class="percent-badge">${formatPercent(color.percent)}</span></div></div><button class="palette-card-lock" type="button" data-action="harmonize-lock-card" ${state.harmonize.isOpen ? "" : "hidden "}aria-pressed="${lockState.locked ? "true" : "false"}" aria-label="${lockState.ariaLabel}" title="${lockState.title}">${lockState.label}</button>`;
  const copyButton = card.querySelector('[data-copy-hex]');
  const lockButton = card.querySelector('[data-action="harmonize-lock-card"]');
  if (copyButton) {
    copyButton.addEventListener('pointerdown', (event) => {
      event.stopPropagation();
    });
    copyButton.addEventListener('click', async (event) => {
      event.stopPropagation();
      await copyHexCode(color.hex);
    });
  }
  if (lockButton) {
    lockButton.addEventListener('pointerdown', (event) => {
      event.preventDefault();
      event.stopPropagation();
    });
    lockButton.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      toggleHarmonizeLock(color.id);
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

function renderPalette(options = {}) {
  const { skipSettle = false } = options;
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
    syncPaletteLockControls();
    if (!skipSettle) {
      schedulePaletteSettleRender();
    }
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
  syncPaletteLockControls();
  if (!skipSettle) {
    schedulePaletteSettleRender();
  }
}

function syncSwatchTargetsFromColors() {
  const bounds = getImageBounds();
  state.swatches.forEach((swatch, index) => {
    const color = state.colors[index];
    swatch.color = color;
    swatch.targetX = color.x * bounds.width;
    swatch.targetY = color.y * bounds.height;
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
  const bounds = getImageBounds();
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
  return { id: color.id, color, element: swatch, x: color.x * bounds.width, y: color.y * bounds.height, targetX: color.x * bounds.width, targetY: color.y * bounds.height };
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
  const bounds = getImageBounds();
  const touch = event.touches && event.touches[0] ? event.touches[0] : event.changedTouches && event.changedTouches[0] ? event.changedTouches[0] : event;
  return {
    x: clamp(touch.clientX - rect.left - bounds.x, 0, bounds.width),
    y: clamp(touch.clientY - rect.top - bounds.y, 0, bounds.height),
  };
}
function updateSwatchColor(swatch) {
  const bounds = getImageBounds();
  const sampled = sampleCanvasColor(swatch.targetX, swatch.targetY);
  swatch.color.r = sampled.r;
  swatch.color.g = sampled.g;
  swatch.color.b = sampled.b;
  swatch.color.hex = sampled.hex;
  swatch.color.x = swatch.targetX / Math.max(1, bounds.width);
  swatch.color.y = swatch.targetY / Math.max(1, bounds.height);
  swatch.element.style.setProperty("--swatch-color", sampled.hex);
  swatch.element.setAttribute("aria-label", `${sampled.hex} swatch`);
  if (state.dragLens && state.dragId === swatch.id) {
    renderDragLens(swatch);
  }
  recalculatePercentages();
  syncHarmonizeSourceColors();
  renderPalette();
  syncSwatchTargetsFromColors();
}
function startDrag(event, id) {
  if (state.harmonize.isOpen) return;
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
  if (state.harmonize.isOpen) {
    closeHarmonizePanel({ restoreFocus: false, revertPreview: false });
  }
  state.colors = extractPalette(state.image, state.paletteSize);
  syncHarmonizeSourceColors();
  state.recipeResults = [];
  state.recipeRequest = null;
  updatePaletteLayoutMode();
  syncLayoutState();
  requestAnimationFrame(() => {
    drawProcessedImage();
    recalculatePercentages();
    renderRecipe();
    updatePaletteLabel();
    renderHarmonizePanel();
    renderPalette();
    rebuildSwatches();
  });
}

function addPaletteColor() {
  if (!state.image || state.colors.length >= PALETTE_MAX) return;
  if (state.harmonize.isOpen) {
    closeHarmonizePanel({ restoreFocus: false, revertPreview: true });
  }
  const candidates = extractPalette(state.image, PALETTE_MAX);
  const nextColor = candidates.find((candidate) => !state.colors.some((color) => colorDistance(color, candidate) < 24)) || candidates[state.colors.length];
  if (!nextColor) return;
  state.colors.push({ ...nextColor, id: `color-${state.colors.length + 1}` });
  syncHarmonizeSourceColors();
  state.recipeResults = [];
  state.paletteSize = state.colors.length;
  updatePaletteLayoutMode();
  syncLayoutState();
  requestAnimationFrame(() => {
    drawProcessedImage();
    recalculatePercentages();
    renderRecipe();
    updatePaletteLabel();
    renderHarmonizePanel();
    renderPalette();
    rebuildSwatches();
  });
}

function removePaletteColor() {
  if (!state.image || state.colors.length <= PALETTE_MIN) return;
  if (state.harmonize.isOpen) {
    closeHarmonizePanel({ restoreFocus: false, revertPreview: true });
  }
  state.colors.pop();
  syncHarmonizeSourceColors();
  state.recipeResults = [];
  state.paletteSize = state.colors.length;
  updatePaletteLayoutMode();
  syncLayoutState();
  requestAnimationFrame(() => {
    drawProcessedImage();
    recalculatePercentages();
    renderRecipe();
    updatePaletteLabel();
    renderHarmonizePanel();
    renderPalette();
    rebuildSwatches();
  });
}

async function handleFile(file) {
  if (!file) return;
  clearImportWarning();
  if (state.harmonize.isOpen) {
    closeHarmonizePanel({ restoreFocus: false, revertPreview: false });
  }
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
importWarning.addEventListener("click", handleImportWarningClick);


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
  if (!isRealMobileLayout() || !shouldCollapseSettingsOnMobile()) {
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
harmonizeToggleButtons.forEach((button) => {
  button.addEventListener("click", () => {
    toggleHarmonizePanel(button);
  });
});
harmonizeSchemeSelect.addEventListener("change", () => {
  if (!state.harmonize.isOpen) {
    return;
  }
  const nextScheme = getHarmonizeSchemeDefinition(harmonizeSchemeSelect.value).id;
  if (state.harmonize.scheme === nextScheme) {
    return;
  }
  state.harmonize.scheme = nextScheme;
  renderHarmonizePanel();
  scheduleHarmonizePreview();
});
harmonizeStrength.addEventListener("input", () => {
  if (!state.harmonize.isOpen) {
    return;
  }
  state.harmonize.strength = clamp(Number(harmonizeStrength.value), 0, 100);
  renderHarmonizePanel();
  scheduleHarmonizePreview();
});
harmonizeSaturation.addEventListener("input", () => {
  if (!state.harmonize.isOpen) {
    return;
  }
  state.harmonize.saturation = clamp(Number(harmonizeSaturation.value), -100, 100);
  renderHarmonizePanel();
  scheduleHarmonizePreview();
});
harmonizeBrightness.addEventListener("input", () => {
  if (!state.harmonize.isOpen) {
    return;
  }
  state.harmonize.brightness = clamp(Number(harmonizeBrightness.value), -100, 100);
  renderHarmonizePanel();
  scheduleHarmonizePreview();
});
harmonizeCancel.addEventListener("click", () => {
  closeHarmonizePanel();
});
harmonizeReset.addEventListener("click", () => {
  resetHarmonizePreview();
});
harmonizeApply.addEventListener("click", () => {
  applyHarmonizeChanges();
});
root.addEventListener("pointerdown", handleHarmonizeOutsidePointerDown, true);
root.addEventListener("pointerdown", handleSettingsOutsidePointerDown, true);
canvasWrap.addEventListener("dragover", (event) => event.preventDefault());
canvasWrap.addEventListener("drop", async (event) => {
  event.preventDefault();
  const [file] = event.dataTransfer.files || [];
  await handleFile(file);
});
window.addEventListener("pointermove", handleDrag, { passive: false });
window.addEventListener("pointermove", handleSaveGradientNodeDrag, { passive: false });
window.addEventListener("pointerup", endDrag);
window.addEventListener("pointerup", endSaveGradientNodeDrag);
window.addEventListener("pointercancel", endDrag);
window.addEventListener("pointercancel", endSaveGradientNodeDrag);
window.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") {
    return;
  }

  if (!saveModal.classList.contains("hidden")) {
    event.preventDefault();
    closeSaveModal();
    return;
  }

  if (!inventoryModal.classList.contains("hidden")) {
    event.preventDefault();
    closeInventoryModal();
    return;
  }

  if (!recipeModal.classList.contains("hidden")) {
    event.preventDefault();
    closeRecipeModal();
    return;
  }

  if (state.harmonize.isOpen) {
    event.preventDefault();
    closeHarmonizePanel({ restoreFocus: true, revertPreview: true });
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
    state.saveExport.layout = normalizeExportLayout(button.dataset.saveStyle);
    syncSaveModalControls();
    renderSavePreview();
  });
});
saveWheelOrderButtons.forEach((button) => {
  button.addEventListener("click", () => {
    state.saveExport.wheelOrder = normalizeExportWheelOrder(button.dataset.saveWheelOrder);
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
saveGradientReset.addEventListener("click", () => {
  seedSaveGradientNodesFromColors();
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
renderHarmonizePanel();
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

