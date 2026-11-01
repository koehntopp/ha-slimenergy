const iconHtml = (i) => (i.includes(":") ? `<ha-icon icon="${i}"></ha-icon>` : i); // "mdi:..." or an emoji

const TYPES = {
  solar: { label: "Solar PV", icon: "mdi:white-balance-sunny", color: "green" },
  battery: { label: "Battery", icon: "mdi:battery-charging-medium", color: "red" },
  grid: { label: "Grid", icon: "mdi:transmission-tower", color: "red" },
  home: { label: "Home", icon: "mdi:home", color: "green" },
  heatpump: { label: "Heat pump", icon: "mdi:heat-pump", color: "red" },
  ev: { label: "EV charger", icon: "mdi:car-electric", color: "red" },
  other: { label: "Other", icon: "mdi:flash", color: "green" },
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

  _field(c) {
    const T = TYPES[c.type] || TYPES.other;
    const [n, s] = this._num(c.entity);
    let val = "n/a", color = "";
    if (!isNaN(n)) {
      const unit = s.attributes.unit_of_measurement;
      const kw = unit === "W" ? n / 1000 : n;
      val = `${Math.abs(kw).toFixed(c.decimals ?? 2)} ${unit === "W" || unit === "kW" ? "kW" : unit || ""}`;
      if (Math.abs(kw) > (c.threshold ?? 0.005)) {
        // positive_color: colour shown when value > 0 (default green)
        const pos = (c.positive_color || T.color) === "red" ? "red" : "green";
        const neg = pos === "red" ? "green" : "red";
        color = (kw > 0) === (!c.invert) ? pos : neg;
      }
    }
    const parts = [];
    if (c.soc_entity) {
      const [soc] = this._num(c.soc_entity);
      if (!isNaN(soc)) parts.push(`${Math.round(soc)}%`);
    }
    if (c.daily_entity) {
      const [d, ds] = this._num(c.daily_entity);
      if (!isNaN(d)) parts.push(ds.attributes.unit_of_measurement === "Wh" ? `${(d / 1000).toFixed(1)} kWh` : `${d.toFixed(1)} ${ds.attributes.unit_of_measurement || ""}`.trim());
    }
    const price = c.price_entity || this._config.price_entity; // card-level kept for old configs
    if (c.type === "grid" && price) {
      const [p, ps] = this._num(price);
      if (!isNaN(p)) parts.push(`${p.toFixed(2)} ${ps.attributes.unit_of_measurement || ""}`.trim());
    }
    const extra = parts.length ? `(${parts.join(" · ")})` : "";
    const icon = c.icon || T.icon;
    const ic = `<span class="ic">${iconHtml(icon)}</span>`;
    return `<div class="f ${color}" data-e="${c.entity}" title="${(c.name || "").replace(/"/g, "&quot;")}">${ic}<span class="v">${val}</span><span class="x">${extra}</span></div>`;
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
  soc_entity: "Battery SoC entity", daily_entity: "Daily energy entity",
  positive_color: "Border colour when value > 0", invert: "Invert sign", price_entity: "Price entity",
};
const bool = { boolean: {} };
// fields depend on the device type: SoC only for batteries
const schemaFor = (type) => [
  { name: "enabled", selector: bool },
  { name: "type", selector: sel(TYPE_OPTIONS) },
  { name: "name", selector: { text: {} } },
  { name: "entity", selector: ent() },
  { name: "icon", selector: { icon: { placeholder: TYPES[type].icon } } }, // standard icon shown as placeholder
  ...(type === "battery" ? [{ name: "soc_entity", selector: ent({ device_class: "battery" }) }] : []),
  ...(type === "grid" ? [{ name: "price_entity", selector: ent() }] : []),
  { name: "daily_entity", selector: ent({ device_class: "energy" }) },
  { name: "positive_color", selector: sel([{ value: "green", label: "Green" }, { value: "red", label: "Red" }]) },
  { name: "invert", selector: bool },
];
const MANAGED = ["enabled", "type", "name", "entity", "icon", "soc_entity", "price_entity", "daily_entity", "positive_color", "invert"];

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
    f.addEventListener("value-changed", (e) => {
      e.stopPropagation();
      f.data = e.detail.value; // ha-form merges edits into its data prop
      onChange(e.detail.value);
    });
    return f;
  }

  _head(sum, e) {
    const T = TYPES[e.type] || TYPES.other;
    const icon = e.icon || T.icon;
    sum.querySelector(".ic").innerHTML = iconHtml(icon);
    sum.querySelector(".nm").textContent = (e.enabled === false ? "(off) " : "") + (e.name || T.label);
    sum.querySelector(".id").textContent = e.entity || "";
    sum.querySelector(".warn").textContent = e.entity ? "" : "⚠ no entity";
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
      .id { flex: 1; min-width: 0; color: var(--secondary-text-color); font-size: .8em; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
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
      sum.innerHTML = `<ha-icon class="h" icon="mdi:drag"></ha-icon><span class="ic"></span><span class="nm"></span><span class="id"></span><span class="warn"></span>
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
        for (const k of ["name", "icon", "entity", "daily_entity", ...(v.type === "battery" ? ["soc_entity"] : []), ...(v.type === "grid" ? ["price_entity"] : [])]) if (v[k] || k === "entity") n[k] = v[k] || "";
        if (v.type && v.type !== "other") n.type = v.type;
        // a colour that was just the old type's default follows the new type
        const dflt = v.type !== type && v.positive_color === TYPES[type].color ? TYPES[v.type].color : v.positive_color;
        if (dflt && dflt !== TYPES[v.type].color) n.positive_color = dflt;
        if (v.invert) n.invert = true;
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
