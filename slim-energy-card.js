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
          .ic { --mdc-icon-size: 20px; font-size: 18px; flex: none; }
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
    const [n, s] = this._num(c.entity);
    let val = "n/a", color = "";
    if (!isNaN(n)) {
      const unit = s.attributes.unit_of_measurement;
      const kw = unit === "W" ? n / 1000 : n;
      val = `${Math.abs(kw).toFixed(c.decimals ?? 2)} ${unit === "W" || unit === "kW" ? "kW" : unit || ""}`;
      if (Math.abs(kw) > (c.threshold ?? 0.005)) {
        // positive_color: colour shown when value > 0 (default green)
        const pos = c.positive_color === "red" ? "red" : "green";
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
    if (c.type === "grid" && this._config.price_entity) {
      const [p, ps] = this._num(this._config.price_entity);
      if (!isNaN(p)) parts.push(`${p.toFixed(2)} ${ps.attributes.unit_of_measurement || ""}`.trim());
    }
    const extra = parts.length ? `(${parts.join(" · ")})` : "";
    const icon = c.icon || "mdi:flash";
    const ic = icon.includes(":")
      ? `<ha-icon class="ic" icon="${icon}"></ha-icon>`
      : `<span class="ic">${icon}</span>`;
    return `<div class="f ${color}" data-e="${c.entity}">${ic}<span class="v">${val}</span><span class="x">${extra}</span></div>`;
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

const ent = { entity: {} };
const sel = (options) => ({ select: { options, mode: "dropdown" } });
const FIELD_SCHEMA = [
  { name: "enabled", selector: { boolean: {} } },
  { name: "entity", selector: ent },
  { name: "icon", selector: { icon: {} } },
  { name: "type", selector: sel([{ value: "", label: "Normal" }, { value: "grid", label: "Grid (shows price)" }]) },
  { name: "soc_entity", selector: ent },
  { name: "daily_entity", selector: ent },
  { name: "positive_color", selector: sel([{ value: "green", label: "Green" }, { value: "red", label: "Red" }]) },
  { name: "invert", selector: { boolean: {} } },
];
const LABELS = {
  enabled: "Show", entity: "Power entity", icon: "Icon", type: "Type", soc_entity: "Battery SoC entity",
  daily_entity: "Daily energy entity", positive_color: "Border colour when value > 0", invert: "Invert sign",
  price_entity: "Grid price entity",
};

class SlimEnergyCardEditor extends HTMLElement {
  setConfig(config) {
    if (JSON.stringify(config) === JSON.stringify(this._config)) return;
    this._config = config;
    this._render();
  }

  set hass(hass) {
    this._hass = hass;
    this.querySelectorAll("ha-form").forEach((f) => (f.hass = hass));
  }

  _emit(config) {
    this._config = config;
    this.dispatchEvent(new CustomEvent("config-changed", { detail: { config }, bubbles: true, composed: true }));
  }

  _form(schema, data, onChange) {
    const f = document.createElement("ha-form");
    f.hass = this._hass;
    f.schema = schema;
    f.data = data;
    f.computeLabel = (s) => LABELS[s.name] || s.name;
    f.addEventListener("value-changed", (e) => {
      e.stopPropagation();
      onChange(e.detail.value);
    });
    return f;
  }

  _render() {
    this.innerHTML = "";
    const c = this._config;
    this.appendChild(this._form([{ name: "price_entity", selector: ent }], { price_entity: c.price_entity }, (v) => {
      const n = { ...c, price_entity: v.price_entity };
      if (!n.price_entity) delete n.price_entity;
      this._emit(n);
    }));
    c.entities.forEach((e, i) => {
      const d = document.createElement("details");
      d.open = !e.entity;
      d.innerHTML = `<summary style="cursor:pointer;padding:8px 0">${e.enabled === false ? "(off) " : ""}${e.entity || "new field"}</summary>`;
      const data = { ...e, enabled: e.enabled !== false, type: e.type || "", positive_color: e.positive_color || "green" };
      d.appendChild(this._form(FIELD_SCHEMA, data, (v) => {
        const n = { entity: v.entity };
        for (const k of ["icon", "soc_entity", "daily_entity"]) if (v[k]) n[k] = v[k];
        if (v.type) n.type = v.type;
        if (v.positive_color === "red") n.positive_color = "red";
        if (v.invert) n.invert = true;
        if (!v.enabled) n.enabled = false;
        const kept = { ...e };
        FIELD_SCHEMA.forEach((s) => delete kept[s.name]);
        const entities = c.entities.slice();
        entities[i] = { ...kept, ...n };
        this._emit({ ...c, entities });
      }));
      const rm = document.createElement("mwc-button");
      rm.textContent = "Remove";
      rm.addEventListener("click", () => {
        this._emit({ ...c, entities: c.entities.filter((_, j) => j !== i) });
        this._render();
      });
      d.appendChild(rm);
      this.appendChild(d);
    });
    const add = document.createElement("mwc-button");
    add.textContent = "Add field";
    add.addEventListener("click", () => {
      this._emit({ ...c, entities: [...c.entities, { entity: "" }] });
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
