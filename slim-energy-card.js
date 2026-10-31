// Twemoji (c) Twitter/jdecked, CC-BY 4.0: https://github.com/jdecked/twemoji
const ICONS = {
  solar: `<svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36"><path fill="#FFAC33" d="M16 2s0-2 2-2 2 2 2 2v2s0 2-2 2-2-2-2-2V2zm18 14s2 0 2 2-2 2-2 2h-2s-2 0-2-2 2-2 2-2h2zM4 16s2 0 2 2-2 2-2 2H2s-2 0-2-2 2-2 2-2h2zm5.121-8.707s1.414 1.414 0 2.828-2.828 0-2.828 0L4.878 8.708s-1.414-1.414 0-2.829c1.415-1.414 2.829 0 2.829 0l1.414 1.414zm21 21s1.414 1.414 0 2.828-2.828 0-2.828 0l-1.414-1.414s-1.414-1.414 0-2.828 2.828 0 2.828 0l1.414 1.414zm-.413-18.172s-1.414 1.414-2.828 0 0-2.828 0-2.828l1.414-1.414s1.414-1.414 2.828 0 0 2.828 0 2.828l-1.414 1.414zm-21 21s-1.414 1.414-2.828 0 0-2.828 0-2.828l1.414-1.414s1.414-1.414 2.828 0 0 2.828 0 2.828l-1.414 1.414zM16 32s0-2 2-2 2 2 2 2v2s0 2-2 2-2-2-2-2v-2z"/><circle fill="#FFAC33" cx="18" cy="18" r="10"/></svg>`,
  battery: `<svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36" xml:space="preserve"><path fill="#77B255" d="M30 32.7c0 1.657-5.373 3.3-12 3.3S6 34.357 6 32.7c0-1.657 5.373-2.7 12-2.7s12 1.043 12 2.7z"/><path fill="#77B255" d="M6 3h24v29.7H6z"/><ellipse fill="#5C913B" cx="18" cy="3" rx="12" ry="3"/><path fill="#FFF" d="M21.956 12.788c.091.544-.321 1.066-.922 1.136-.676.079-1.355.121-2.035.147V16a1 1 0 0 1-2 0v-1.93a26.188 26.188 0 0 1-2.035-.147c-.601-.07-1.012-.591-.922-1.136a1.042 1.042 0 0 1 1.152-.851c.6.07 1.202.109 1.804.133V10a1 1 0 0 1 2 0v2.07a24.781 24.781 0 0 0 1.804-.133 1.042 1.042 0 0 1 1.154.851zm-1.652 17.746a21.119 21.119 0 0 1-4.607 0 1.048 1.048 0 0 0-1.153.854c-.091.544.326 1.067.934 1.134 1.676.184 3.368.184 5.044 0 .609-.067 1.026-.59.934-1.134a1.047 1.047 0 0 0-1.152-.854z"/><ellipse fill="#CCD6DD" cx="18" cy="3" rx="10" ry="2"/><path fill="#99AAB5" d="M14 1v1.5c0 .552 1.791 1 4 1s4-.448 4-1V1h-8z"/><ellipse fill="#CCD6DD" cx="18" cy="1" rx="4" ry="1"/></svg>`,
  grid: `<svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36"><path fill="#FFAC33" d="M32.938 15.651C32.792 15.26 32.418 15 32 15H19.925L26.89 1.458c.219-.426.106-.947-.271-1.243C26.437.071 26.218 0 26 0c-.233 0-.466.082-.653.243L18 6.588 3.347 19.243c-.316.273-.43.714-.284 1.105S3.582 21 4 21h12.075L9.11 34.542c-.219.426-.106.947.271 1.243.182.144.401.215.619.215.233 0 .466-.082.653-.243L18 29.412l14.653-12.655c.317-.273.43-.714.285-1.106z"/></svg>`,
  home: `<svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36"><path fill="#A0041E" d="M9.344 14.702h-2c-.276 0-.5-.224-.5-.5v-7c0-.276.224-.5.5-.5h2c.276 0 .5.224.5.5v7c0 .276-.224.5-.5.5z"/><path fill="#FFE8B6" d="M5 16L18 3l13 13v17H5z"/><path fill="#FFCC4D" d="M18 16h1v16h-1z"/><path fill="#66757F" d="M31 17c-.256 0-.512-.098-.707-.293L18 4.414 5.707 16.707c-.391.391-1.023.391-1.414 0s-.391-1.023 0-1.414l13-13c.391-.391 1.023-.391 1.414 0l13 13c.391.391.391 1.023 0 1.414-.195.195-.451.293-.707.293z"/><path fill="#66757F" d="M18 17c-.256 0-.512-.098-.707-.293-.391-.391-.391-1.023 0-1.414l6.5-6.5c.391-.391 1.023-.391 1.414 0s.391 1.023 0 1.414l-6.5 6.5c-.195.195-.451.293-.707.293z"/><path fill="#C1694F" d="M10 26h4v6h-4z"/><path fill="#55ACEE" d="M10 17h4v4h-4zm12.5 0h4v4h-4zm0 9h4v4h-4z"/><path fill="#5C913B" d="M33.5 33.5c0 .828-.672 1.5-1.5 1.5H4c-.828 0-1.5-.672-1.5-1.5S3.172 32 4 32h28c.828 0 1.5.672 1.5 1.5z"/></svg>`,
  heatpump: `<svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36"><path fill="#DD2E44" d="M31.538 21.572C32.466 22.612 33 23.771 33 25c0 4.418-6.715 8-15 8-8.284 0-15-3.582-15-8 0-1.229.535-2.388 1.462-3.428C2.299 23.082 1 24.959 1 27c0 4.971 7.611 9 17 9s17-4.029 17-9c0-2.041-1.299-3.918-3.462-5.428z"/><path fill="#DD2E44" d="M9.001 27.5c-.55 0-1.08-.304-1.343-.829-.37-.741-.07-1.642.671-2.013.12-.062 3.171-1.692 3.171-5.658 0-2.127-1.164-3.634-2.396-5.229C7.824 12.114 6.5 10.4 6.5 8c0-4.569 2.34-6.961 2.439-7.061.586-.586 1.535-.586 2.121 0 .583.582.586 1.524.011 2.11C10.986 3.14 9.5 4.762 9.5 8c0 1.376.917 2.564 1.978 3.938C12.825 13.68 14.5 15.849 14.5 19c0 5.859-4.632 8.243-4.829 8.342-.215.107-.444.158-.67.158z"/><path fill="#DD2E44" d="M16.001 27.5c-.55 0-1.08-.304-1.343-.829-.37-.741-.07-1.642.671-2.013.12-.062 3.171-1.692 3.171-5.658 0-2.127-1.164-3.634-2.396-5.229C14.824 12.114 13.5 10.4 13.5 8c0-4.569 2.34-6.961 2.439-7.061.586-.586 1.535-.586 2.121 0 .583.582.586 1.524.011 2.11C17.986 3.14 16.5 4.762 16.5 8c0 1.376.917 2.564 1.978 3.938C19.824 13.68 21.5 15.849 21.5 19c0 5.859-4.632 8.243-4.829 8.342-.215.107-.444.158-.67.158z"/><path fill="#DD2E44" d="M23.001 27.5c-.55 0-1.08-.304-1.343-.829-.37-.741-.07-1.642.671-2.013.12-.062 3.171-1.692 3.171-5.658 0-2.127-1.164-3.634-2.396-5.229C21.824 12.114 20.5 10.4 20.5 8c0-4.569 2.34-6.961 2.44-7.061.586-.586 1.535-.586 2.121 0 .582.582.586 1.524.011 2.11C24.986 3.14 23.5 4.762 23.5 8c0 1.376.917 2.564 1.979 3.938C26.824 13.68 28.5 15.849 28.5 19c0 5.859-4.632 8.243-4.829 8.342-.216.107-.444.158-.67.158z"/></svg>`,
  ev: `<svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36"><path fill="#DD2E44" d="M13 32h20s3 0 3-4c0-2 0-6-1-7s-8-7-11-7h-6c-3 0-10 7-10 7l-4 1s-3 1-3 3v3s-1 .338-1 1.957C0 32 2 32 2 32h11z"/><path fill="#BBDDF5" d="M20 16h-2c-2 0-8 6-8 6s4.997-.263 10-.519V16zm10 3c-1-1-5-3-7-3h-1v5.379c4.011-.204 7.582-.379 8-.379 1 0 1-1 0-2z"/><circle fill="#292F33" cx="10" cy="31" r="4"/><circle fill="#CCD6DD" cx="10" cy="31" r="2"/><circle fill="#292F33" cx="27" cy="31" r="4"/><circle fill="#CCD6DD" cx="27" cy="31" r="2"/></svg>`,
  plug: `<svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36"><path fill="#9AAAB4" d="M11.858 16.264c.389.389.389 1.025 0 1.414s-1.025.389-1.414 0L1.959 9.192c-.389-.389-.389-1.025 0-1.414s1.025-.389 1.414 0l8.485 8.486zm7.072-7.071c.389.389.389 1.025 0 1.414s-1.025.389-1.414 0L9.029 2.121c-.389-.389-.389-1.025 0-1.414s1.025-.389 1.414 0l8.487 8.486z"/><path fill="#31373D" d="M34 36c0-4.966-2.56-8.581-4.562-10.65.898-1.532.704-3.529-.61-4.844l-1.099-1.099c.352-1.332.021-2.806-1.022-3.851l-4.949-4.95c.78-.781.78-2.047 0-2.828-.781-.781-2.049-.781-2.829-.001l-2.826 2.826-.003.002-4.242 4.243-2.828 2.828c-.781.781-.781 2.047 0 2.828.781.781 2.047.781 2.828 0l4.95 4.95c1.044 1.044 2.519 1.373 3.85 1.021l1.101 1.101c1.318 1.318 3.323 1.51 4.857.602C28.099 29.726 30 32.404 30 36h4z"/></svg>`,
};
const iconHtml = (i) => ICONS[i] || (i.includes(":") ? `<ha-icon icon="${i}"></ha-icon>` : i);

const TYPES = {
  solar: { label: "Solar PV", icon: "solar", color: "green" },
  battery: { label: "Battery", icon: "battery", color: "red" },
  grid: { label: "Grid", icon: "grid", color: "red" },
  home: { label: "Home", icon: "home", color: "green" },
  heatpump: { label: "Heat pump", icon: "heatpump", color: "red" },
  ev: { label: "EV charger", icon: "ev", color: "red" },
  other: { label: "Other", icon: "plug", color: "green" },
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
  { name: "icon", selector: { icon: {} } },
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
