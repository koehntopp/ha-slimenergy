# Slim Energy Card

HACS Lovelace card (`custom:slim-energy-card`). Goal: very simple, slim energy overview.

## Files
- `slim-energy-card.js`: whole card, vanilla custom element, no deps, no build.
- `hacs.json`: HACS manifest (type Dashboard, `filename` = the js file).
- `README.md`: user docs and config example. Keep in sync with the options below.
- `preview.html`: local mock (fake `hass`, emoji icons, mocked `ha-form`) loading the real card JS; editor changes update the card live and print the resulting config.

## Spec
- Fields in a 3-column grid; one field per entry in `entities`, so 6 entities = 2 rows. Pill: border, icon, value, optional bracket text.
- Value shown as absolute kW (W converted to kW); other units shown as-is. Missing/non-numeric state shows `n/a`.
- Editor row header shows live signed value + effective border colour (`sumStates`, `borderColor` shared with the card); `positive_color` and `invert` have helper texts.
- Border colour from sign: value > 0 uses `positive_color` (`green` default, or `red`), value < 0 the opposite. `invert: true` flips the sign first. `abs(kW) <= threshold` (default 0.005) = neutral border.
- Bracket text, parts joined with ` · `, in order: battery SoC (`soc_entity`, `52%`), daily energy (`daily_entity`, kWh, Wh converted, 1 decimal), grid price (only `type: grid`, from its `price_entity`, 2 decimals + its unit).
  - Solar: `daily_entity` = daily production. Grid: `daily_entity` = daily use, e.g. `(4.2 kWh · 0.28 €/kWh)`.
- Daily value without a unit (e.g. a meter on a unit-less source) is shown as kWh.
- `daily_line: true`: all bracket parts (SoC, daily, price, joined with ` · `) go on a second line, without brackets, instead of next to the value; saves width. Key name kept from when it only moved the daily value.
- Battery `soc_fill: true` (needs `soc_entity`): pill background filled left to right to SoC%, gradient red to hsl(SoC*1.2) (red low, green high). Off by default.
- Solar only: `entity_2` and `daily_entity_2` (second inverter) are summed with `entity` / `daily_entity` (`_sum`, W to kW, Wh to kWh; unavailable ones skipped). Tap opens more-info of `entity`.
- Icon per entity: any `mdi:...` (via `ha-icon`) or emoji. Defaults per type are standard MDI icons (`TYPES`): sun `mdi:white-balance-sunny`, battery `mdi:battery-charging-medium`, grid `mdi:transmission-tower`, home `mdi:home`, heat pump `mdi:heat-pump`, EV `mdi:car-electric`, other `mdi:flash`. Chosen to match what the owner had configured by hand; no coloured/embedded icons (rejected). Editor icon picker shows the type default as placeholder.
- Tap on a field fires `hass-more-info` for its entity.
- Border colours overridable via CSS vars `--slim-green`, `--slim-red`.

- Visual editor (`slim-energy-card-editor`, same file, via `getConfigElement`): sortable list like HA power-flow cards. Row = drag handle, icon, name, entity id, warning if no entity, copy, remove; expands to an `ha-form` whose schema depends on `type` (`schemaFor`: SoC only for battery; price entity only for grid). Native HTML5 drag (draggable set on handle mousedown). Types (`TYPES`) give default icon, label and `positive_color`; stored config omits values equal to the default. Editor skips re-render when the config echoed back is unchanged (keeps input focus); type change re-renders. Emoji icons work via YAML only.

## Config
Card: `entities` (required). Legacy card-level `price_entity` still read as fallback.
Entity: `type` (solar|battery|grid|home|heatpump|ev|other), `name` (tooltip/editor label), `enabled` (false = hidden), `entity`, `icon`, `soc_entity` (battery), `soc_fill` (battery), `price_entity` (grid), `daily_entity`, `daily_line`, `positive_color`, `invert`, `decimals` (2), `threshold` (0.005).

## Not included (add only on request)
Status words ("Producing", "Using"), visual editor, translations, per-field click actions, auto sizing to content.

- README images must use absolute `raw.githubusercontent.com/.../main/docs/X.png` URLs: HACS renders the README inside HA, where relative paths break.
- Screenshots in `docs/` (README) are made headless from `preview.html` (`?only=card`, `?only=editor&open=2`): `Google Chrome --headless=new --force-device-scale-factor=2 --window-size=W,H --screenshot=docs/X.png URL`. Regenerate when card or editor look changes. Editor shots use the mocked `ha-form`, not real HA widgets.

## Workflow
- Preview: `python3 -m http.server 8765` in repo root, open `http://localhost:8765/preview.html` (file:// does not run scripts in the browser pane).
- After EVERY change to the card, `preview.html`, or config options: update `preview.html` so it exercises the change (mock entities, config), reload it in the browser pane, and check a screenshot.
- Editing `preview.html` makes the harness auto-open a blank `file://` tab and front it. After each edit: close that tab, front the `http://localhost:8765` tab, reload, screenshot.
- Keep README, this file, and preview in sync with any option change.
- Style: minimal code, no unrequested abstractions.
