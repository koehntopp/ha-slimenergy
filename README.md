# Slim Energy Card

Compact HACS Lovelace card: 3 fields per row, as many rows as entities.

## Install
1. HACS → ⋮ → Custom repositories → `https://github.com/koehntopp/ha-slimenergy`, type *Dashboard* → Download.
2. If not auto-added: Settings → Dashboards → Resources → `/hacsfiles/ha-slimenergy/slim-energy-card.js`, type *JavaScript module*.
3. Reload the browser, add card *Slim Energy Card* (or YAML below).

Local mock: `python3 -m http.server 8765`, open `http://localhost:8765/preview.html`.

## Config
Use the visual editor (drag to reorder, copy, remove, `Show` switch per device; only fields that apply to the device type are shown) or YAML:

```yaml
type: custom:slim-energy-card
entities:
  - type: solar                        # solar|battery|grid|home|heatpump|ev|other
    entity: sensor.solar_power
    daily_entity: sensor.solar_energy_today   # kWh, shown in brackets
  - type: battery
    entity: sensor.battery_power
    soc_entity: sensor.battery_soc     # shows (52%)
  - type: grid
    entity: sensor.grid_power
    price_entity: sensor.grid_price    # grid only; bracket: (4.2 kWh · 0.28 €/kWh)
    daily_entity: sensor.grid_import_today
  - type: home
    entity: sensor.house_power
    name: House                        # tooltip, editor label
    icon: mdi:home                     # default per type, mdi: or emoji
    enabled: false                     # hide
```

Per-entity options: `type` (default `other`), `entity`, `name`, `icon`, `soc_entity` (battery only), `price_entity` (grid only), `daily_entity`, `positive_color` (`green`|`red`, default per type: green for solar/home/other, red for battery/grid/heatpump/ev; colour used when value > 0), `invert`, `enabled` (true), `decimals` (2), `threshold` (0.005 kW, below = neutral border).
W values are shown as kW. Border colours: CSS vars `--slim-green`, `--slim-red`. Tap = more-info.
