"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Save, Plus, X } from "lucide-react";
import Link from "next/link";

export interface ProfileData {
  name: string;
  gender: string;
  age: string;
  height: string;
  weight: string;
  goal: string;
  activityLevel: string;
  allergies: string[];
  favoriteFoods: string[];
  mealsPerDay: string;
}

const defaultProfile: ProfileData = {
  name: "",
  gender: "",
  age: "",
  height: "",
  weight: "",
  goal: "",
  activityLevel: "",
  allergies: [],
  favoriteFoods: [],
  mealsPerDay: "3",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "var(--black-2)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 8,
  padding: "12px 16px",
  color: "var(--white)",
  fontSize: 14,
  outline: "none",
  transition: "border-color 0.2s",
  fontFamily: "inherit",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 12,
  color: "var(--text-muted)",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  marginBottom: 8,
  fontWeight: 500,
};

const fieldGroupStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 0,
};

export default function ProfileEditPage() {
  const router = useRouter();
  const [form, setForm] = useState<ProfileData>(defaultProfile);
  const [allergyInput, setAllergyInput] = useState("");
  const [foodInput, setFoodInput] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("nutri_profile");
      if (stored) setForm(JSON.parse(stored));
    } catch {}
  }, []);

  const set = (field: keyof ProfileData, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const addTag = (field: "allergies" | "favoriteFoods", input: string, clear: () => void) => {
    const val = input.trim();
    if (!val) return;
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].includes(val) ? prev[field] : [...prev[field], val],
    }));
    clear();
  };

  const removeTag = (field: "allergies" | "favoriteFoods", tag: string) =>
    setForm((prev) => ({ ...prev, [field]: prev[field].filter((t) => t !== tag) }));

  const handleSave = () => {
    localStorage.setItem("nutri_profile", JSON.stringify(form));
    setSaved(true);
    setTimeout(() => router.push("/profile"), 600);
  };

  const focusStyle = {
    borderColor: "var(--green-neon)",
  };

  return (
    <div style={{ paddingTop: 64, minHeight: "100vh" }}>
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "60px 24px" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 48 }}>
          <Link
            href="/profile"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 40,
              height: 40,
              borderRadius: 8,
              border: "1px solid rgba(255,255,255,0.1)",
              color: "var(--text-muted)",
              textDecoration: "none",
              transition: "all 0.2s",
              flexShrink: 0,
            }}
          >
            <ChevronLeft size={18} />
          </Link>
          <div>
            <h1 className="font-display" style={{ fontSize: 40, color: "var(--white)", lineHeight: 1 }}>
              РЕДАКТИРОВАТЬ ПРОФИЛЬ
            </h1>
            <div style={{ color: "var(--text-muted)", fontSize: 13, marginTop: 4 }}>
              Данные сохраняются локально
            </div>
          </div>
        </div>

        {/* Section: Основные данные */}
        <Section title="Основные данные">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <div style={fieldGroupStyle}>
              <label style={labelStyle}>Имя</label>
              <FocusInput
                value={form.name}
                onChange={(v) => set("name", v)}
                placeholder="Ваше имя"
              />
            </div>

            <div style={fieldGroupStyle}>
              <label style={labelStyle}>Пол</label>
              <SelectInput
                value={form.gender}
                onChange={(v) => set("gender", v)}
                options={[
                  { value: "", label: "Выберите" },
                  { value: "male", label: "Мужской" },
                  { value: "female", label: "Женский" },
                  { value: "other", label: "Другой" },
                ]}
              />
            </div>

            <div style={fieldGroupStyle}>
              <label style={labelStyle}>Возраст</label>
              <FocusInput
                value={form.age}
                onChange={(v) => set("age", v)}
                placeholder="лет"
                type="number"
              />
            </div>

            <div style={fieldGroupStyle}>
              <label style={labelStyle}>Рост (см)</label>
              <FocusInput
                value={form.height}
                onChange={(v) => set("height", v)}
                placeholder="170"
                type="number"
              />
            </div>

            <div style={fieldGroupStyle}>
              <label style={labelStyle}>Вес (кг)</label>
              <FocusInput
                value={form.weight}
                onChange={(v) => set("weight", v)}
                placeholder="70"
                type="number"
              />
            </div>

            <div style={fieldGroupStyle}>
              <label style={labelStyle}>Приёмов пищи в день</label>
              <SelectInput
                value={form.mealsPerDay}
                onChange={(v) => set("mealsPerDay", v)}
                options={[
                  { value: "2", label: "2" },
                  { value: "3", label: "3" },
                  { value: "4", label: "4" },
                  { value: "5", label: "5" },
                  { value: "6", label: "6" },
                ]}
              />
            </div>
          </div>
        </Section>

        {/* Section: Цель */}
        <Section title="Цель">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
            {[
              { value: "loss", label: "Похудение", emoji: "📉" },
              { value: "maintain", label: "Поддержание", emoji: "⚖️" },
              { value: "gain", label: "Набор массы", emoji: "📈" },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => set("goal", opt.value)}
                style={{
                  background: form.goal === opt.value
                    ? "rgba(74,222,128,0.12)"
                    : "var(--black-2)",
                  border: form.goal === opt.value
                    ? "1px solid rgba(74,222,128,0.5)"
                    : "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 12,
                  padding: "20px 16px",
                  cursor: "pointer",
                  color: form.goal === opt.value ? "var(--green-neon)" : "var(--text-muted)",
                  textAlign: "center",
                  transition: "all 0.2s",
                  fontFamily: "inherit",
                }}
              >
                <div style={{ fontSize: 24, marginBottom: 8 }}>{opt.emoji}</div>
                <div style={{ fontSize: 13, fontWeight: 400 }}>{opt.label}</div>
              </button>
            ))}
          </div>
        </Section>

        {/* Section: Уровень активности */}
        <Section title="Уровень активности">
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { value: "sedentary", label: "Сидячий образ жизни", sub: "Офис, минимум движения" },
              { value: "light", label: "Лёгкая активность", sub: "1–3 тренировки в неделю" },
              { value: "moderate", label: "Умеренная активность", sub: "3–5 тренировок в неделю" },
              { value: "active", label: "Высокая активность", sub: "6–7 тренировок в неделю" },
              { value: "very_active", label: "Очень высокая", sub: "Профессиональный спорт" },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => set("activityLevel", opt.value)}
                style={{
                  background: form.activityLevel === opt.value
                    ? "rgba(74,222,128,0.08)"
                    : "transparent",
                  border: form.activityLevel === opt.value
                    ? "1px solid rgba(74,222,128,0.4)"
                    : "1px solid rgba(255,255,255,0.06)",
                  borderRadius: 10,
                  padding: "14px 20px",
                  cursor: "pointer",
                  color: "var(--white)",
                  textAlign: "left",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  transition: "all 0.2s",
                  fontFamily: "inherit",
                  width: "100%",
                }}
              >
                <div>
                  <div style={{
                    fontSize: 14,
                    color: form.activityLevel === opt.value ? "var(--green-neon)" : "var(--white)",
                    fontWeight: 400,
                  }}>
                    {opt.label}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>
                    {opt.sub}
                  </div>
                </div>
                <div style={{
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  border: form.activityLevel === opt.value
                    ? "2px solid var(--green-neon)"
                    : "2px solid rgba(255,255,255,0.2)",
                  background: form.activityLevel === opt.value ? "var(--green-neon)" : "transparent",
                  flexShrink: 0,
                  transition: "all 0.2s",
                }} />
              </button>
            ))}
          </div>
        </Section>

        {/* Section: Аллергии */}
        <Section title="Аллергии и непереносимость">
          <TagInput
            tags={form.allergies}
            inputValue={allergyInput}
            onInputChange={setAllergyInput}
            onAdd={() => addTag("allergies", allergyInput, () => setAllergyInput(""))}
            onRemove={(tag) => removeTag("allergies", tag)}
            placeholder="Например: глютен, лактоза…"
          />
        </Section>

        {/* Section: Любимые продукты */}
        <Section title="Любимые продукты">
          <TagInput
            tags={form.favoriteFoods}
            inputValue={foodInput}
            onInputChange={setFoodInput}
            onAdd={() => addTag("favoriteFoods", foodInput, () => setFoodInput(""))}
            onRemove={(tag) => removeTag("favoriteFoods", tag)}
            placeholder="Например: курица, гречка, авокадо…"
          />
        </Section>

        {/* Save button */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 8 }}>
          <Link href="/profile" className="btn-outline" style={{ textDecoration: "none" }}>
            Отмена
          </Link>
          <button
            className="btn-primary"
            onClick={handleSave}
            style={saved ? { background: "var(--green-light)" } : {}}
          >
            <Save size={14} />
            {saved ? "Сохранено!" : "Сохранить"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Sub-components ──────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        background: "var(--black-3)",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: 16,
        padding: 32,
        marginBottom: 20,
      }}
    >
      <h3 style={{ fontSize: 14, fontWeight: 500, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 24 }}>
        {title}
      </h3>
      {children}
    </div>
  );
}

function FocusInput({
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        ...inputStyle,
        borderColor: focused ? "var(--green-neon)" : "rgba(255,255,255,0.1)",
      }}
    />
  );
}

function SelectInput({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  const [focused, setFocused] = useState(false);
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        ...inputStyle,
        borderColor: focused ? "var(--green-neon)" : "rgba(255,255,255,0.1)",
        cursor: "pointer",
      }}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value} style={{ background: "#1a1a1a" }}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

function TagInput({
  tags,
  inputValue,
  onInputChange,
  onAdd,
  onRemove,
  placeholder,
}: {
  tags: string[];
  inputValue: string;
  onInputChange: (v: string) => void;
  onAdd: () => void;
  onRemove: (tag: string) => void;
  placeholder?: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: tags.length ? 12 : 0 }}>
        <input
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={(e) => e.key === "Enter" && onAdd()}
          style={{
            ...inputStyle,
            borderColor: focused ? "var(--green-neon)" : "rgba(255,255,255,0.1)",
          }}
        />
        <button
          onClick={onAdd}
          style={{
            background: "rgba(74,222,128,0.1)",
            border: "1px solid rgba(74,222,128,0.25)",
            borderRadius: 8,
            padding: "0 16px",
            color: "var(--green-neon)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            flexShrink: 0,
            transition: "all 0.2s",
          }}
        >
          <Plus size={16} />
        </button>
      </div>
      {tags.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {tags.map((tag) => (
            <span
              key={tag}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "5px 12px",
                background: "rgba(74,222,128,0.08)",
                border: "1px solid rgba(74,222,128,0.2)",
                borderRadius: 100,
                fontSize: 12,
                color: "var(--green-neon)",
              }}
            >
              {tag}
              <button
                onClick={() => onRemove(tag)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--green-neon)",
                  padding: 0,
                  display: "flex",
                  alignItems: "center",
                  opacity: 0.7,
                }}
              >
                <X size={11} />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
