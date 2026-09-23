"use client";
import type { FieldDesc, SectionSchema } from "../lib/sectionSchema";

type Data = Record<string, unknown>;

function asString(v: unknown): string {
  return typeof v === "string" ? v : "";
}

function asStringList(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v.map((x) => (typeof x === "string" ? x : ""));
}

function asObjectList(v: unknown, keys: string[]): Data[] {
  if (!Array.isArray(v)) return [];
  return v.map((row) => {
    const src = typeof row === "object" && row !== null ? (row as Data) : {};
    const out: Data = {};
    for (const k of keys) out[k] = asString(src[k]);
    return out;
  });
}

function emptyObject(keys: string[]): Data {
  const o: Data = {};
  for (const k of keys) o[k] = "";
  return o;
}

function FieldControl({
  field,
  value,
  onChange,
}: {
  field: FieldDesc;
  value: unknown;
  onChange: (v: unknown) => void;
}) {
  if (field.type === "text" || field.type === "url") {
    return (
      <label className="block space-y-1 text-sm">
        <span className="font-semibold">{field.label}</span>
        <input
          className="field"
          type={field.type === "url" ? "url" : "text"}
          maxLength={field.max}
          value={asString(value)}
          onChange={(e) => onChange(e.target.value)}
        />
      </label>
    );
  }

  if (field.type === "textarea") {
    return (
      <label className="block space-y-1 text-sm">
        <span className="font-semibold">{field.label}</span>
        <textarea
          className="field min-h-28"
          maxLength={field.max}
          value={asString(value)}
          onChange={(e) => onChange(e.target.value)}
        />
      </label>
    );
  }

  if (field.type === "list") {
    const items = asStringList(value);
    const maxItems = field.maxItems ?? 40;
    return (
      <div className="space-y-2">
        <p className="text-sm font-semibold">{field.label}</p>
        {items.length === 0 ? (
          <p className="text-xs text-muted">Belum ada item.</p>
        ) : (
          <ul className="space-y-2">
            {items.map((item, i) => (
              <li key={i} className="flex gap-2">
                <input
                  className="field"
                  maxLength={field.maxLen ?? 200}
                  aria-label={`${field.label} item ${i + 1}`}
                  value={item}
                  onChange={(e) => {
                    const next = [...items];
                    next[i] = e.target.value;
                    onChange(next);
                  }}
                />
                <button
                  type="button"
                  className="btn btn-glass !min-h-9 !px-3 text-xs"
                  aria-label={`Hapus item ${i + 1}`}
                  onClick={() => onChange(items.filter((_, j) => j !== i))}
                >
                  Hapus
                </button>
              </li>
            ))}
          </ul>
        )}
        <button
          type="button"
          className="btn btn-glass !min-h-9 !px-4 text-xs"
          disabled={items.length >= maxItems}
          onClick={() => onChange([...items, ""])}
        >
          + Tambah item
        </button>
      </div>
    );
  }

  if (field.type !== "listObject") return null;

  const keys = field.fields.map((f) => f.name);
  const rows = asObjectList(value, keys);
  const maxItems = field.maxItems ?? 40;
  return (
    <div className="space-y-3">
      <p className="text-sm font-semibold">{field.label}</p>
      {rows.length === 0 ? (
        <p className="text-xs text-muted">Belum ada item.</p>
      ) : (
        rows.map((row, i) => (
          <div key={i} className="glass-soft space-y-2 rounded-2xl p-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted">Item {i + 1}</span>
              <button
                type="button"
                className="btn !min-h-8 !bg-transparent !px-3 text-xs text-danger"
                aria-label={`Hapus ${field.label} item ${i + 1}`}
                onClick={() => onChange(rows.filter((_, j) => j !== i))}
              >
                Hapus
              </button>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {field.fields.map((sub) => (
                <label key={sub.name} className="block space-y-1 text-sm sm:col-span-1">
                  <span className="text-xs font-semibold text-muted">{sub.label}</span>
                  <input
                    className="field"
                    maxLength={sub.max ?? 200}
                    value={asString(row[sub.name])}
                    onChange={(e) => {
                      const next = rows.map((r, j) => (j === i ? { ...r, [sub.name]: e.target.value } : r));
                      onChange(next);
                    }}
                  />
                </label>
              ))}
            </div>
          </div>
        ))
      )}
      <button
        type="button"
        className="btn btn-glass !min-h-9 !px-4 text-xs"
        disabled={rows.length >= maxItems}
        onClick={() => onChange([...rows, emptyObject(keys)])}
      >
        + Tambah item
      </button>
    </div>
  );
}

/** Form ramah non-teknis per section; output = objek JSON siap draft/publish. */
export default function SectionForm({
  schema,
  value,
  onChange,
}: {
  schema: SectionSchema;
  value: Data;
  onChange: (next: Data) => void;
}) {
  function set(name: string, v: unknown) {
    onChange({ ...value, [name]: v });
  }

  return (
    <div className="space-y-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted">{schema.title}</p>
      {schema.fields.map((f) => (
        <FieldControl key={f.name} field={f} value={value[f.name]} onChange={(v) => set(f.name, v)} />
      ))}
    </div>
  );
}
