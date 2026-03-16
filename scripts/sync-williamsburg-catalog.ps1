param(
  [string]$SourcePath = 'C:\Users\JGric\.codex\skills\paintmatch-store-paints\assets\williamsburg-oil-colors.json'
)

$ErrorActionPreference = 'Stop'

if (-not (Test-Path $SourcePath)) {
  throw "Catalog source not found: $SourcePath"
}

$repoRoot = Split-Path -Parent $PSScriptRoot
$targets = @(
  (Join-Path $repoRoot 'COLOUR PALETTE.html'),
  (Join-Path $repoRoot 'webflow\webflow-script.js')
)

function Get-SafeString {
  param([Parameter(ValueFromPipeline = $true)]$Value)
  if ($null -eq $Value) { return '' }
  return [string]$Value
}

$starterPigments = @{
  'Permanent Yellow Light' = @('PY3')
  'Permanent Yellow Deep' = @('PY65')
  'Pyrrole Red' = @('PR254')
  'Quinacridone Magenta' = @('PR122')
  'Egyptian Violet' = @('PV23')
  'Phthalo Blue' = @('PB15:3')
  'Phthalo Green' = @('PG7')
  'Green Gold' = @('PY129')
  'Titanium White' = @('PW6')
}

$rawCatalog = Get-Content -Raw $SourcePath | ConvertFrom-Json
$normalizedColors = foreach ($color in $rawCatalog.colors) {
  [ordered]@{
    color_name = Get-SafeString $color.color_name
    item_number = Get-SafeString $color.item_number
    series = Get-SafeString $color.series
    hue_group = Get-SafeString $color.hue_group
    hue_value = if ($null -ne $color.hue_value -and "$($color.hue_value)".Length) { [int64]$color.hue_value } else { $null }
    pigment_codes = [object[]]$(if ($starterPigments.ContainsKey($color.color_name)) { @($starterPigments[$color.color_name]) } else { @() })
    lab = if ($color.lab) {
      [ordered]@{
        L = [double]$color.lab.L
        a = [double]$color.lab.a
        b = [double]$color.lab.b
      }
    } else {
      $null
    }
    swatch_sm_url = Get-SafeString $color.swatch_sm_url
    swatch_lg_url = Get-SafeString $color.swatch_lg_url
    handpainted_card_url = Get-SafeString $color.handpainted_card_url
  }
}

$bundle = [ordered]@{
  source = if ($null -ne $rawCatalog.source -and "$($rawCatalog.source)".Length) { [string]$rawCatalog.source } else { 'Golden Artist Colors Williamsburg oil color catalog' }
  generated_at = Get-SafeString $rawCatalog.generated_at
  active_color_count = $normalizedColors.Count
  colors = $normalizedColors
}

$replacementJson = $bundle | ConvertTo-Json -Depth 8 -Compress
$replacementBlock = "/* WILLIAMSBURG_CATALOG_START */`r`n$replacementJson`r`n/* WILLIAMSBURG_CATALOG_END */"
$pattern = '/\* WILLIAMSBURG_CATALOG_START \*/.*?/\* WILLIAMSBURG_CATALOG_END \*/'

foreach ($target in $targets) {
  if (-not (Test-Path $target)) {
    throw "Target file not found: $target"
  }

  $content = Get-Content -Raw $target
  if ($content -notmatch 'WILLIAMSBURG_CATALOG_START') {
    throw "Catalog marker not found in $target"
  }

  $updated = [regex]::Replace($content, $pattern, $replacementBlock, [System.Text.RegularExpressions.RegexOptions]::Singleline)
  Set-Content -Path $target -Value $updated -Encoding UTF8
  Write-Output "Synced Williamsburg catalog into $target"
}
