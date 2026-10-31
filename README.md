# Slim Energy Card

Compact HACS Lovelace card: 3 fields per row, as many rows as entities.

## Install
1. HACS → ⋮ → Custom repositories → `https://github.com/koehntopp/ha-slimenergy`, type *Dashboard* → Download.
2. If not auto-added: Settings → Dashboards → Resources → `/hacsfiles/ha-slimenergy/slim-energy-card.js`, type *JavaScript module*.
3. Reload the browser, add card *Slim Energy Card* (or YAML below).

Local mock: `python3 -m http.server 8765`, open `http://localhost:8765/preview.html`.

## Config

```yaml
type: custom:slim-energy-card
price_entity: sensor.grid_price        # shown on type: grid
entities:
  - entity: sensor.solar_power
    icon: mdi:solar-power              # or an emoji
  - entity: sensor.battery_power
    icon: mdi:battery
    soc_entity: sensor.battery_soc     # shows (52%)
    positive_color: red                # colour when value > 0 (default green)
  - entity: sensor.grid_power
    icon: mdi:transmission-tower
    type: grid                         # shows (0.28 €/kWh)
    positive_color: red
  - entity: sensor.house_power
    icon: 🏠
    invert: true                       # flip sign before colouring
```

Configure via the card's visual editor or YAML. Each field has a `Show` switch (`enabled: false` hides it).

Per-entity options: `enabled` (true), `entity`, `icon`, `type` (`grid`), `soc_entity`, `daily_entity` (daily kWh sensor, e.g. solar production or grid use; shown in brackets, grid shows `(4.2 kWh · 0.28 €/kWh)`), `positive_color` (`green`|`red`), `invert`, `decimals` (2), `threshold` (0.005 kW, below = neutral border).
W values are shown as kW. Border colours: CSS vars `--slim-green`, `--slim-red`. Tap = more-info.
