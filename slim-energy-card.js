const typeIcon = (T) => (T.fallback && !window.customIconsets?.[T.icon.split(":")[0]] ? T.fallback : T.icon);
const iconHtml = (i) => (i.includes(":") ? `<ha-icon icon="${i}"></ha-icon>` : i); // "mdi:..." or an emoji

const TYPES = {
  solar: { label: "Solar PV", icon: "mdi:white-balance-sunny", color: "green" },
  battery: { label: "Battery", icon: "mdi:battery-charging-medium", color: "red" },
  grid: { label: "Grid", icon: "mdi:transmission-tower", color: "red" },
  home: { label: "Home", icon: "mdi:home", color: "green" },
  heatpump: { label: "Heat pump", icon: "bha:heat-pump", fallback: "mdi:heat-pump", color: "red" }, // bha: icon pack (HACS), mdi when not installed
  ev: { label: "EV charger", icon: "mdi:car-electric", color: "red" },
  other: { label: "Other", icon: "mdi:flash", color: "green" },
};

// sum of the numeric states of ids; W -> kW (or Wh -> kWh when wh); returns [total, unit]
const sumStates = (hass, ids, wh) => {
  let t = NaN, u = "";
  for (const id of ids) {
    const s = id && hass.states[id];
    const n = s ? parseFloat(s.state) : NaN;
    if (isNaN(n)) continue;
    const un = s.attributes.unit_of_measurement || "";
    const small = un === (wh ? "Wh" : "W");
    u = small ? (wh ? "kWh" : "kW") : un;
    t = (isNaN(t) ? 0 : t) + (small ? n / 1000 : n);
  }
  return [t, u];
};

// border colour for a device value: positive_color (type default) when value > 0 (flipped by invert), the opposite below 0, "" near 0
const borderColor = (c, kw) => {
  if (!(Math.abs(kw) > (c.threshold ?? 0.005))) return "";
  const pos = (c.positive_color || (TYPES[c.type] || TYPES.other).color) === "red" ? "red" : "green";
  return (kw > 0) === !c.invert ? pos : pos === "red" ? "green" : "red";
};

class SlimEnergyCard extends HTMLElement {
  setConfig(config) {
    if (!Array.isArray(config.entities) || !config.entities.length) {
      throw new Error("entities: list required");
    }
    this._config = config;
    if (!this.shadowRoot) {
      this.attachShadow({ mode: "open" }).innerHTML = `
        <style>
          ha-card { padding: 8px; background: transparent; box-shadow: none; }
          .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
          .f { display: flex; align-items: center; gap: 6px; min-width: 0; padding: 6px 10px;
               border: 2px solid var(--divider-color); border-radius: 16px;
               background: var(--card-background-color); cursor: pointer; white-space: nowrap; }
          .f.green { border-color: var(--slim-green, #4caf50); }
          .f.red { border-color: var(--slim-red, #e57373); }
          .ic { display: flex; --mdc-icon-size: 20px; font-size: 18px; flex: none; }
          .v { font-weight: 600; }
          .x { color: var(--secondary-text-color); font-size: .85em; overflow: hidden; text-overflow: ellipsis; }
          .t { display: flex; flex-direction: column; min-width: 0; }
          .r { display: flex; align-items: center; gap: 6px; min-width: 0; }
        </style>
        <ha-card><div class="grid"></div></ha-card>`;
    }
    this._render();
  }

  set hass(hass) {
    this._hass = hass;
    this._render();
  }

  static getConfigElement() {
    return document.createElement("slim-energy-card-editor");
  }

  static getStubConfig() {
    return { entities: [{ entity: "" }] };
  }

  _active() {
    return this._config.entities.filter((c) => c.enabled !== false && c.entity);
  }

  getCardSize() {
    return Math.ceil(this._active().length / 3);
  }

  _num(id) {
    const s = this._hass.states[id];
    const n = s ? parseFloat(s.state) : NaN;
    return [n, s];
  }

  _sum(ids, wh) {
    return sumStates(this._hass, ids, wh);
  }

  _field(c) {
    const T = TYPES[c.type] || TYPES.other;
    const [kw, unit] = this._sum([c.entity, c.entity_2]); // entity_2: second source, e.g. second inverter
    let val = "n/a", color = "";
    if (!isNaN(kw)) {
      val = `${Math.abs(kw).toFixed(c.decimals ?? 2)} ${unit}`;
      color = borderColor(c, kw);
    }
    const parts = [];
    if (c.soc_entity) {
      const [soc] = this._num(c.soc_entity);
      if (!isNaN(soc)) parts.push(`${Math.round(soc)}%`);
    }
    const [d, du] = this._sum([c.daily_entity, c.daily_entity_2], true);
    if (!isNaN(d)) parts.push(`${d.toFixed(1)} ${du || "kWh"}`);
    const price = c.price_entity || this._config.price_entity; // card-level kept for old configs
    if (c.type === "grid" && price) {
      const [p, ps] = this._num(price);
      if (!isNaN(p)) parts.push(`${p.toFixed(2)} ${ps.attributes.unit_of_measurement || ""}`.trim());
    }
    const text = parts.join(" · ");
    const extra = text && !c.daily_line ? `(${text})` : "";
    const line2 = text && c.daily_line ? `<span class="x">${text}</span>` : ""; // daily_line: all bracket parts on a second line
    const icon = c.icon || typeIcon(T);
    let style = "";
    if (c.soc_fill && c.soc_entity) {
      // pill filled left to right up to the SoC, gradient red -> green; full green is reached at 60% SoC (hue 0 red, 120 green)
      const [soc] = this._num(c.soc_entity);
      if (!isNaN(soc)) {
        const p = Math.max(0, Math.min(100, soc));
        const hue = Math.min(120, p * 2), stop = p < 60 ? 100 : 6000 / p; // stop: where green is reached, in % of the fill
        style = ` style="background:linear-gradient(90deg,hsla(0,70%,45%,.55),hsla(${hue},70%,45%,.55) ${stop}%) no-repeat left/${p}% 100%,var(--card-background-color)"`;
      }
    }
    const ic = `<span class="ic">${iconHtml(icon)}</span>`;
    return `<div class="f ${color}" data-e="${c.entity}"${style} title="${(c.name || "").replace(/"/g, "&quot;")}">${ic}<div class="t"><div class="r"><span class="v">${val}</span><span class="x">${extra}</span></div>${line2}</div></div>`;
  }

  _render() {
    if (!this._config || !this._hass || !this.shadowRoot) return;
    const g = this.shadowRoot.querySelector(".grid");
    g.innerHTML = this._active().map((c) => this._field(c)).join("");
    g.querySelectorAll(".f").forEach((el) =>
      el.addEventListener("click", () =>
        this.dispatchEvent(new CustomEvent("hass-more-info", {
          detail: { entityId: el.dataset.e }, bubbles: true, composed: true,
        }))
      )
    );
  }
}

const ent = (extra = {}) => ({ entity: { domain: "sensor", ...extra } });
const sel = (options) => ({ select: { options, mode: "dropdown" } });
const TYPE_OPTIONS = Object.entries(TYPES).map(([value, t]) => ({ value, label: t.label }));
const LABELS = {
  enabled: "Show", type: "Type", name: "Name", entity: "Power entity", icon: "Icon",
  entity_2: "Second power entity (optional, added)", daily_entity_2: "Second daily energy entity (optional, added)", soc_entity: "Battery SoC entity", soc_fill: "Fill pill by state of charge", daily_entity: "Daily energy entity", daily_line: "Details on second line",
  positive_color: "Border colour when value > 0", invert: "Invert sign", price_entity: "Price entity",
};
const bool = { boolean: {} };
// fields depend on the device type: SoC only for batteries
const schemaFor = (type) => [
  { name: "enabled", selector: bool },
  { name: "type", selector: sel(TYPE_OPTIONS) },
  { name: "name", selector: { text: {} } },
  { name: "entity", selector: ent() },
  ...(type === "solar" ? [{ name: "entity_2", selector: ent() }] : []),
  { name: "icon", selector: { icon: { placeholder: typeIcon(TYPES[type]) } } }, // standard icon shown as placeholder
  ...(type === "battery" ? [{ name: "soc_entity", selector: ent({ device_class: "battery" }) }, { name: "soc_fill", selector: bool }] : []),
  ...(type === "grid" ? [{ name: "price_entity", selector: ent() }] : []),
  { name: "daily_entity", selector: ent({ device_class: "energy" }) },
  { name: "daily_line", selector: bool },
  ...(type === "solar" ? [{ name: "daily_entity_2", selector: ent({ device_class: "energy" }) }] : []),
  { name: "positive_color", selector: sel([{ value: "green", label: "Green" }, { value: "red", label: "Red" }]),
    helper: "Border colour while the value is above 0; below 0 the opposite colour is used. The live value and resulting colour show in the row header." },
  { name: "invert", selector: bool,
    helper: "Flip the sign first, for a sensor that reports the opposite direction (e.g. discharging as positive). Check the live value in the row header." },
];
const MANAGED = ["enabled", "type", "name", "entity", "entity_2", "icon", "soc_entity", "soc_fill", "price_entity", "daily_entity", "daily_entity_2", "daily_line", "positive_color", "invert"];

class SlimEnergyCardEditor extends HTMLElement {
  _nk = 0;
  _open = new Set();

  setConfig(config) {
    if (JSON.stringify(config) === JSON.stringify(this._config)) return;
    this._config = config;
    if (!this._keys || this._keys.length !== config.entities.length) this._keys = config.entities.map(() => this._nk++);
    this._render();
  }

  set hass(hass) {
    this._hass = hass;
    this.querySelectorAll("ha-form").forEach((f) => (f.hass = hass));
    this.querySelectorAll("summary").forEach((sum, i) => this._config?.entities[i] && this._head(sum, this._config.entities[i]));
  }

  _emit(entities, extra = {}) {
    this._config = { ...this._config, ...extra, entities };
    this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: this._config }, bubbles: true, composed: true }));
  }

  _form(schema, data, onChange) {
    const f = document.createElement("ha-form");
    f.hass = this._hass;
    f.schema = schema;
    f.data = data;
    f.computeLabel = (s) => LABELS[s.name] || s.name;
    f.computeHelper = (s) => s.helper || "";
    f.addEventListener("value-changed", (e) => {
      e.stopPropagation();
      f.data = e.detail.value; // ha-form merges edits into its data prop
      onChange(e.detail.value);
    });
    return f;
  }

  _head(sum, e) {
    const T = TYPES[e.type] || TYPES.other;
    const icon = e.icon || typeIcon(T);
    sum.querySelector(".ic").innerHTML = iconHtml(icon);
    sum.querySelector(".nm").textContent = (e.enabled === false ? "(off) " : "") + (e.name || T.label);
    sum.querySelector(".id").textContent = e.entity || "";
    sum.querySelector(".warn").textContent = e.entity ? "" : "⚠ no entity";
    // live value and the border colour it currently gets, so direction / invert are easy to judge
    const cur = sum.querySelector(".cur");
    const [kw, unit] = this._hass && e.entity ? sumStates(this._hass, [e.entity, e.entity_2]) : [NaN, ""];
    if (isNaN(kw)) cur.textContent = "";
    else {
      const col = borderColor(e, kw);
      cur.innerHTML = `${kw < 0 ? "−" : "+"}${Math.abs(kw).toFixed(2)} ${unit} <span style="color:var(--slim-${col || "x"}, ${col === "red" ? "#e57373" : col === "green" ? "#4caf50" : "gray"})">● ${col || "neutral"}</span>`;
    }
  }

  _move(from, to) {
    const entities = this._config.entities.slice();
    entities.splice(to, 0, entities.splice(from, 1)[0]);
    this._keys.splice(to, 0, this._keys.splice(from, 1)[0]);
    this._emit(entities);
    this._render();
  }

  _render() {
    const c = this._config;
    this.innerHTML = `<style>
      .row { background: var(--card-background-color); border: 1px solid var(--divider-color); border-radius: 12px; margin: 8px 0; padding: 0 12px 8px; }
      .row.over { outline: 2px dashed var(--primary-color); }
      summary { display: flex; align-items: center; gap: 8px; cursor: pointer; list-style: none; padding: 10px 0; }
      summary::-webkit-details-marker { display: none; }
      .h { cursor: grab; } .nm { font-weight: 600; } .warn { color: var(--warning-color, #ffa600); }
      .cur { font-size: .8em; white-space: nowrap; } .id { flex: 1; min-width: 0; color: var(--secondary-text-color); font-size: .8em; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      .btn { cursor: pointer; --mdc-icon-size: 20px; }
      .add { display: inline-block; cursor: pointer; color: var(--primary-color); padding: 8px 0; }
    </style>`;
    c.entities.forEach((e, i) => {
      const key = this._keys[i];
      const d = document.createElement("details");
      d.className = "row";
      d.open = this._open.has(key) || !e.entity;
      d.addEventListener("toggle", () => (d.open ? this._open.add(key) : this._open.delete(key)));
      const sum = document.createElement("summary");
      sum.innerHTML = `<ha-icon class="h" icon="mdi:drag"></ha-icon><span class="ic"></span><span class="nm"></span><span class="id"></span><span class="cur"></span><span class="warn"></span>
        <ha-icon class="btn cp" icon="mdi:content-copy"></ha-icon><ha-icon class="btn rm" icon="mdi:close"></ha-icon>`;
      this._head(sum, e);
      const act = (cls, fn) => sum.querySelector(cls).addEventListener("click", (ev) => { ev.preventDefault(); ev.stopPropagation(); fn(); });
      act(".cp", () => {
        const entities = this._config.entities.slice(); // closures outlive renders: never use the render-time config
        entities.splice(i + 1, 0, { ...entities[i] });
        this._keys.splice(i + 1, 0, this._nk++);
        this._emit(entities);
        this._render();
      });
      act(".rm", () => {
        this._keys.splice(i, 1);
        this._emit(this._config.entities.filter((_, j) => j !== i));
        this._render();
      });
      const h = sum.querySelector(".h");
      h.addEventListener("mousedown", () => (d.draggable = true));
      d.addEventListener("dragend", () => { d.draggable = false; });
      d.addEventListener("dragstart", (ev) => { this._drag = i; ev.dataTransfer.setData("text/plain", ""); ev.dataTransfer.effectAllowed = "move"; });
      d.addEventListener("dragover", (ev) => { ev.preventDefault(); d.classList.add("over"); });
      d.addEventListener("dragleave", () => d.classList.remove("over"));
      d.addEventListener("drop", (ev) => { ev.preventDefault(); if (this._drag !== undefined && this._drag !== i) this._move(this._drag, i); this._drag = undefined; });
      d.appendChild(sum);
      const type = e.type || "other";
      const data = { ...e, enabled: e.enabled !== false, type, positive_color: e.positive_color || TYPES[type].color };
      d.appendChild(this._form(schemaFor(type), data, (v) => {
        const n = {};
        const entities = this._config.entities.slice();
        const kept = { ...entities[i] };
        MANAGED.forEach((k) => delete kept[k]);
        for (const k of ["name", "icon", "entity", "daily_entity", ...(v.type === "solar" ? ["entity_2", "daily_entity_2"] : []), ...(v.type === "battery" ? ["soc_entity"] : []), ...(v.type === "grid" ? ["price_entity"] : [])]) if (v[k] || k === "entity") n[k] = v[k] || "";
        if (v.type && v.type !== "other") n.type = v.type;
        // a colour that was just the old type's default follows the new type
        const dflt = v.type !== type && v.positive_color === TYPES[type].color ? TYPES[v.type].color : v.positive_color;
        if (dflt && dflt !== TYPES[v.type].color) n.positive_color = dflt;
        if (v.invert) n.invert = true;
        if (v.daily_line) n.daily_line = true;
        if (v.type === "battery" && v.soc_fill) n.soc_fill = true;
        if (!v.enabled) n.enabled = false;
        entities[i] = { ...kept, ...n };
        this._emit(entities);
        if (v.type !== type) this._render(); else this._head(sum, entities[i]);
      }));
      this.appendChild(d);
    });
    const add = document.createElement("div");
    add.className = "add";
    add.textContent = "+ Add device";
    add.addEventListener("click", () => {
      this._keys.push(this._nk++);
      this._emit([...this._config.entities, { entity: "" }]);
      this._render();
    });
    this.appendChild(add);
  }
}

customElements.define("slim-energy-card", SlimEnergyCard);
customElements.define("slim-energy-card-editor", SlimEnergyCardEditor);
window.customCards = window.customCards || [];
window.customCards.push({
  type: "slim-energy-card",
  name: "Slim Energy Card",
  description: "Compact energy flow fields, 3 per row",
});
