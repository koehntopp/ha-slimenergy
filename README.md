# Slim Energy Card

A compact Home Assistant Lovelace card that shows your energy flows in a few small pills: solar, battery, grid, home, heat pump, EV charger, or anything else with a power sensor. Three pills per row, so it fits in a narrow dashboard slot where a full energy-flow card is too big.

![Slim Energy Card](docs/card.png)

## Features
- One pill per device: icon, live power in kW, and optional values in brackets.
- Border colour shows the energy direction (green or red, configurable per device, can be inverted).
- Brackets show what matters per device type: battery state of charge, daily energy (kWh), grid price.
- Visual editor: drag to reorder, copy, remove, and switch any device off. Only fields that apply to the device type are shown.
- Built-in coloured icons per device type, or use any `mdi:` icon or emoji.
- Tap a pill to open the entity's more-info dialog.
- W values are converted to kW automatically. No dependencies, one JS file.

## Install
1. HACS → ⋮ → Custom repositories → `https://github.com/koehntopp/ha-slimenergy`, type *Dashboard* → Download.
2. If it isn't added automatically: Settings → Dashboards → Resources → `/hacsfiles/ha-slimenergy/slim-energy-card.js`, type *JavaScript module*.
3. Reload the browser, then add the card *Slim Energy Card*.

## Configuration
Use the visual editor, or YAML.

![Editor](docs/editor.png)

Each device has a type. The type sets the default icon and border colour, and decides which fields are offered (battery: state of charge entity, grid: price entity).

![Editor, expanded device](docs/editor-grid.png)

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
    name: House                        # tooltip and editor label
    enabled: false                     # hide this device
```

### Device options
| Option | Default | Description |
|---|---|---|
| `type` | `other` | `solar`, `battery`, `grid`, `home`, `heatpump`, `ev`, `other` |
| `entity` | required | Power sensor (W or kW). Shown as absolute kW. |
| `name` | type name | Tooltip and editor label |
| `icon` | per type | Built-in name (`solar battery grid home heatpump ev plug`), `mdi:...`, or an emoji |
| `soc_entity` | | Battery only: state of charge, shown as `(52%)` |
| `price_entity` | | Grid only: price, shown in brackets |
| `daily_entity` | | Daily energy sensor in kWh or Wh, shown in brackets |
| `positive_color` | per type | Border colour when the value is above 0: `green` or `red`. Solar, home, other: green. Battery, grid, heat pump, EV: red. The opposite colour is used below 0. |
| `invert` | `false` | Flip the sign before colouring |
| `enabled` | `true` | `false` hides the device |
| `decimals` | `2` | Decimals of the power value |
| `threshold` | `0.005` | Below this many kW the border stays neutral |

Border colours can be themed with the CSS variables `--slim-green` and `--slim-red`.

## Development
`python3 -m http.server 8765`, then open `http://localhost:8765/preview.html`. It runs the real card against mock entities and a mocked form component. `?only=card` and `?only=editor&open=2` give the views used for the screenshots.

## Credits and licence
Code: MIT, see [LICENSE](LICENSE). Built-in icons are [Twemoji](https://github.com/jdecked/twemoji) graphics, CC-BY 4.0 (Twitter, Inc. and other contributors), embedded in `slim-energy-card.js`; originals in `assets/twemoji/`.
