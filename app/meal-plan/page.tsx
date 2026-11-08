"use client";

import { useState, useEffect } from "react";
import { Flame, Sparkles, ShoppingCart, ChevronDown, ChevronUp, Loader2, AlertCircle, RefreshCw, Bookmark, BookmarkCheck, ExternalLink } from "lucide-react";
import { buildShoppingCart } from "@/lib/ai";
import type { DayRation, CartItem, UserProfile } from "@/lib/ai";
import { getNutritionFromStorage } from "@/utils/nutritionCalculator";

// ── Магазины доставки ─────────────────────────────────────────────────────

const DELIVERY_SHOPS = [
  {
    name: "Яндекс Лавка",
    emoji: "🟡",
    url: "https://lavka.yandex.ru/",
    color: "#FFD700",
    desc: "За 15 минут",
  },
  {
    name: "Самокат",
    emoji: "🟢",
    url: "https://samokat.ru/",
    color: "#4ade80",
    desc: "Быстрая доставка",
  },
  {
    name: "Деливери Клуб",
    emoji: "🔴",
    url: "https://www.delivery-club.ru/",
    color: "#ef4444",
    desc: "Продукты и готовое",
  },
  {
    name: "Сбермаркет",
    emoji: "🟢",
    url: "https://sbermarket.ru/",
    color: "#22c55e",
    desc: "Из магазинов рядом",
  },
  {
    name: "Перекрёсток",
    emoji: "🛒",
    url: "https://www.perekrestok.ru/",
    color: "#f97316",
    desc: "Онлайн-гипермаркет",
  },
  {
    name: "Магнит Доставка",
    emoji: "🔴",
    url: "https://dostavka.magnit.ru/",
    color: "#dc2626",
    desc: "Доступные цены",
  },
  {
    name: "ВкусВилл",
    emoji: "🟤",
    url: "https://vkusvill.ru/",
    color: "#a16207",
    desc: "Натуральные продукты",
  },
  {
    name: "Ozon Свежее",
    emoji: "🔵",
    url: "https://www.ozon.ru/category/produkty-pitaniya-9200/",
    color: "#3b82f6",
    desc: "С Ozon-доставкой",
  },
];

const SAVED_RATION_KEY = "nutri_saved_ration";

// ── Профиль из localStorage ───────────────────────────────────────────────

function loadProfile(): UserProfile {
  try {
    const raw = localStorage.getItem("nutri_profile");
    if (!raw) return {};
    const p = JSON.parse(raw);

    // КБЖУ берём исключительно из единой функции расчёта —
    // те же значения, что показывает страница Профиль.
    const nutrition = getNutritionFromStorage();

    return {
      name:          p.name,
      goal:          p.goal,
      activityLevel: p.activityLevel,
      mealsPerDay:   p.mealsPerDay ? Number(p.mealsPerDay) : 3,
      allergies:     p.allergies ?? [],
      favoriteFoods: p.favoriteFoods ?? [],
      weight:        p.weight ? Number(p.weight) : undefined,
      height:        p.height ? Number(p.height) : undefined,
      age:           p.age    ? Number(p.age)    : undefined,
      calories:      nutrition?.calories ?? undefined,
      protein:       nutrition?.protein  ?? undefined,
      fat:           nutrition?.fats     ?? undefined, // NutritionResult использует "fats"
      carbs:         nutrition?.carbs    ?? undefined,
    };
  } catch {
    return {};
  }
}

// ── Вспомогательные ───────────────────────────────────────────────────────

const GOAL_LABELS: Record<string, string> = {
  loss:     "Похудение",
  maintain: "Поддержание",
  gain:     "Набор массы",
};

const DAY_NAMES = ["ВС", "ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ"];

function buildWeekDays() {
  const today = new Date();
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return { label: DAY_NAMES[d.getDay()], date: d.getDate() };
  });
}

function MacroBar({
  label,
  current,
  target,
  color,
}: {
  label: string;
  current: number;
  target: number;
  color: string;
}) {
  const pct = target ? Math.min((current / target) * 100, 100) : 0;
  const deviation = target ? Math.abs(current - target) / target : 0;
  const ok = deviation <= 0.05;
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 13 }}>
        <span style={{ color: "rgba(245,245,240,0.7)" }}>{label}</span>
        <span style={{ color: ok ? color : "#f87171" }}>
          {current} {target ? `/ ${target}` : ""} {label === "Калории" ? "ккал" : "г"}
          {target && <span style={{ fontSize: 11, opacity: 0.6, marginLeft: 4 }}>{ok ? "✓" : "±"}</span>}
        </span>
      </div>
      <div style={{ height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 2, overflow: "hidden" }}>
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            background: ok || !target ? color : "#f87171",
            borderRadius: 2,
            transition: "width 0.8s ease",
          }}
        />
      </div>
    </div>
  );
}

// ── Компонент карточки приёма пищи ────────────────────────────────────────

function MealCard({ meal }: { meal: DayRation["meals"][0] }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="card-hover"
      style={{
        background: "var(--black-3)",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: 16,
        overflow: "hidden",
        transition: "all 0.3s",
      }}
    >
      {/* Header row */}
      <div
        style={{
          padding: "24px 32px",
          display: "flex",
          alignItems: "center",
          gap: 20,
          flexWrap: "wrap",
        }}
      >
        <div style={{ fontSize: 36, flexShrink: 0 }}>{meal.emoji}</div>

        <div style={{ flex: 1, minWidth: 180 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6, flexWrap: "wrap" }}>
            <span
              style={{
                fontSize: 11,
                color: "var(--green-neon)",
                background: "rgba(74,222,128,0.1)",
                padding: "2px 10px",
                borderRadius: 100,
              }}
            >
              {meal.type}
            </span>
          </div>
          <h3 style={{ fontSize: 16, fontWeight: 500, color: "var(--white)", marginBottom: 8 }}>
            {meal.name}
          </h3>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            {[
              { label: "Б", val: meal.protein },
              { label: "У", val: meal.carbs },
              { label: "Ж", val: meal.fat },
            ].map((m) => (
              <span key={m.label} style={{ fontSize: 12, color: "var(--text-muted)" }}>
                {m.label}: {m.val}г
              </span>
            ))}
          </div>
        </div>

        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div className="font-display" style={{ fontSize: 32, color: "var(--green-neon)", lineHeight: 1 }}>
            {meal.kcal}
          </div>
          <div style={{ fontSize: 11, color: "var(--text-muted)" }}>ккал</div>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          style={{
            width: 40,
            height: 40,
            borderRadius: 8,
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.06)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--text-muted)",
            cursor: "pointer",
            flexShrink: 0,
            transition: "all 0.2s",
          }}
        >
          {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>

      {/* Ingredients */}
      {open && (
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.05)",
            padding: "16px 32px 24px",
          }}
        >
          <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>
            Состав
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {meal.ingredients.map((ing, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "8px 0",
                  borderBottom: i < meal.ingredients.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                }}
              >
                <span style={{ fontSize: 14, color: "var(--white)" }}>{ing.name}</span>
                <span
                  style={{
                    fontSize: 13,
                    color: "var(--green-neon)",
                    background: "rgba(74,222,128,0.08)",
                    padding: "3px 10px",
                    borderRadius: 100,
                    flexShrink: 0,
                  }}
                >
                  {ing.amount} {ing.unit}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Компонент корзины ─────────────────────────────────────────────────────

function CartBlock({ items }: { items: CartItem[] }) {
  const [copied, setCopied] = useState(false);

  function copyList() {
    const text = items
      .map((it) =>
        it.entries.length > 1
          ? `${it.name}: ${it.entries.map((e) => `${e.amount} ${e.unit}`).join(" + ")} = ${it.totalAmount} ${it.unit}`
          : `${it.name}: ${it.totalAmount} ${it.unit}`
      )
      .join("\n");
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div style={{ marginTop: 40, display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Product list */}
      <div
        style={{
          background: "var(--black-3)",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 16,
          padding: 32,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: "rgba(74,222,128,0.1)",
              border: "1px solid rgba(74,222,128,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--green-neon)",
            }}
          >
            <ShoppingCart size={16} />
          </div>
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 500, color: "var(--white)" }}>Список продуктов</h3>
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>
              {items.length} позиций · автоматически объединены повторы
            </div>
          </div>
          <button
            className="btn-outline"
            style={{ marginLeft: "auto", fontSize: 12, padding: "8px 20px" }}
            onClick={copyList}
          >
            {copied ? "✓ Скопировано!" : "Копировать список"}
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 10,
          }}
        >
          {items.map((item, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px 16px",
                background: "rgba(255,255,255,0.03)",
                borderRadius: 8,
                border: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              <div>
                <div style={{ fontSize: 14, color: "var(--white)" }}>{item.name}</div>
                {item.entries.length > 1 && (
                  <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
                    {item.entries.map((e) => `${e.amount} ${e.unit}`).join(" + ")}
                  </div>
                )}
              </div>
              <span
                style={{
                  fontSize: 13,
                  color: "var(--green-neon)",
                  background: "rgba(74,222,128,0.08)",
                  border: "1px solid rgba(74,222,128,0.15)",
                  padding: "3px 10px",
                  borderRadius: 100,
                  flexShrink: 0,
                  marginLeft: 12,
                }}
              >
                {item.totalAmount} {item.unit}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Delivery shops */}
      <div
        style={{
          background: "var(--black-3)",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 16,
          padding: 32,
        }}
      >
        <div style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 500, color: "var(--white)", marginBottom: 4 }}>
            Купить продукты с доставкой
          </h3>
          <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
            Откройте магазин и добавьте продукты из списка в корзину
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: 12,
          }}
        >
          {DELIVERY_SHOPS.map((shop) => (
            <a
              key={shop.name}
              href={shop.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "14px 18px",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 12,
                textDecoration: "none",
                transition: "all 0.2s",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.06)";
                (e.currentTarget as HTMLAnchorElement).style.borderColor = shop.color + "40";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.03)";
                (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.07)";
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  background: shop.color + "18",
                  border: `1px solid ${shop.color}30`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 18,
                  flexShrink: 0,
                }}
              >
                {shop.emoji}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: "var(--white)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {shop.name}
                </div>
                <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
                  {shop.desc}
                </div>
              </div>
              <ExternalLink size={12} color="var(--text-muted)" style={{ flexShrink: 0 }} />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Главная страница ──────────────────────────────────────────────────────

type Status = "idle" | "loading" | "done" | "error";

export default function MealPlanPage() {
  const [profile, setProfile]     = useState<UserProfile>({});
  const [ration, setRation]       = useState<DayRation | null>(null);
  const [cart, setCart]           = useState<CartItem[]>([]);
  const [status, setStatus]       = useState<Status>("idle");
  const [errorMsg, setErrorMsg]   = useState("");
  const [activeDay, setActiveDay] = useState(0); // 0 = сегодня
  const [saved, setSaved]         = useState(false);
  const formattedDate = new Date().toLocaleDateString("ru-RU", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  useEffect(() => {
    setProfile(loadProfile());
    // Восстанавливаем сохранённый рацион из localStorage
    try {
      const raw = localStorage.getItem(SAVED_RATION_KEY);
      if (raw) {
        const saved: DayRation = JSON.parse(raw);
        setRation(saved);
        setCart(buildShoppingCart(saved));
        setStatus("done");
        setSaved(true);
      }
    } catch {}
  }, []);

  function handleSave() {
    if (!ration) return;
    try {
      localStorage.setItem(SAVED_RATION_KEY, JSON.stringify(ration));
      setSaved(true);
    } catch {}
  }

  function handleDiscard() {
    localStorage.removeItem(SAVED_RATION_KEY);
    setSaved(false);
    setRation(null);
    setCart([]);
    setStatus("idle");
  }
  

  async function handleGenerate() {
    setStatus("loading");
    setErrorMsg("");
    setSaved(false);
    localStorage.removeItem(SAVED_RATION_KEY);
    try {
      const res = await fetch("/api/generate-ration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: res.statusText }));
        throw new Error(err.error ?? `HTTP ${res.status}`);
      }
      const result: DayRation = await res.json();
      setRation(result);
      setCart(buildShoppingCart(result));
      setStatus("done");
    } catch (e: unknown) {
      setErrorMsg(e instanceof Error ? e.message : String(e));
      setStatus("error");
    }
  }

  const target = {
    kcal:    profile.calories,
    protein: profile.protein,
    fat:     profile.fat,
    carbs:   profile.carbs,
  };

  return (
    <div style={{ paddingTop: 64, minHeight: "100vh" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "60px 24px" }}>

        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 48,
            flexWrap: "wrap",
            gap: 24,
          }}
        >
          <div>
            <span className="tag tag-green" style={{ marginBottom: 16 }}>
              <Flame size={10} />
              {formattedDate}
              {profile.goal && ` · ${GOAL_LABELS[profile.goal] ?? profile.goal}`}
            </span>
            <h1
              className="font-display"
              style={{ fontSize: "clamp(44px, 7vw, 80px)", lineHeight: 0.95, color: "var(--white)" }}
            >
              МОЙ<br />
              <span style={{ color: "var(--green-neon)" }}>РАЦИОН</span>
            </h1>
          </div>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-start" }}>
            {status === "done" && (
              <>
                <button className="btn-outline" onClick={handleDiscard} style={{ color: "#f87171", borderColor: "rgba(248,113,113,0.3)" }}>
                  <RefreshCw size={14} /> Пересоздать
                </button>
                <button
                  className="btn-outline"
                  onClick={handleSave}
                  style={saved ? { color: "var(--green-neon)", borderColor: "rgba(74,222,128,0.4)" } : {}}
                >
                  {saved ? <><BookmarkCheck size={14} /> Сохранено</> : <><Bookmark size={14} /> Сохранить рацион</>}
                </button>
              </>
            )}
            <button
              className="btn-primary"
              onClick={handleGenerate}
              disabled={status === "loading"}
              style={status === "loading" ? { opacity: 0.7, cursor: "not-allowed" } : {}}
            >
              {status === "loading" ? (
                <>
                  <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} />
                  Генерирую…
                </>
              ) : (
                <>
                  <Sparkles size={14} /> Сформировать рацион
                </>
              )}
            </button>
          </div>
        </div>

        {/* Day picker */}
        <div
          style={{
            display: "flex",
            gap: 8,
            marginBottom: 40,
            overflowX: "auto",
            paddingBottom: 4,
          }}
        >
          {buildWeekDays().map((d, i) => (
            <button
              key={i}
              onClick={() => setActiveDay(i)}
              style={{
                minWidth: 56,
                height: 56,
                borderRadius: 12,
                background: activeDay === i ? "var(--green-neon)" : "var(--black-3)",
                border: activeDay === i ? "none" : "1px solid rgba(255,255,255,0.06)",
                color: activeDay === i ? "var(--black)" : "var(--text-muted)",
                fontSize: 13,
                fontWeight: activeDay === i ? 500 : 400,
                cursor: "pointer",
                transition: "all 0.2s",
                flexShrink: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
              }}
            >
              <span style={{ fontSize: 10, opacity: 0.6 }}>{d.date}</span>
              {d.label}
            </button>
          ))}
        </div>

        {/* Profile summary bar */}
        {(target.kcal || profile.allergies?.length) ? (
          <div
            style={{
              background: "rgba(74,222,128,0.04)",
              border: "1px solid rgba(74,222,128,0.12)",
              borderRadius: 12,
              padding: "14px 24px",
              marginBottom: 32,
              display: "flex",
              gap: 24,
              flexWrap: "wrap",
              alignItems: "center",
              fontSize: 13,
            }}
          >
            {target.kcal && (
              <span style={{ color: "var(--text-muted)" }}>
                Норма: <strong style={{ color: "var(--green-neon)" }}>{target.kcal} ккал</strong>
              </span>
            )}
            {target.protein && (
              <span style={{ color: "var(--text-muted)" }}>
                Б: <strong style={{ color: "var(--white)" }}>{target.protein}г</strong>
              </span>
            )}
            {target.fat && (
              <span style={{ color: "var(--text-muted)" }}>
                Ж: <strong style={{ color: "var(--white)" }}>{target.fat}г</strong>
              </span>
            )}
            {target.carbs && (
              <span style={{ color: "var(--text-muted)" }}>
                У: <strong style={{ color: "var(--white)" }}>{target.carbs}г</strong>
              </span>
            )}
            {profile.mealsPerDay && (
              <span style={{ color: "var(--text-muted)" }}>
                Приёмов: <strong style={{ color: "var(--white)" }}>{profile.mealsPerDay}</strong>
              </span>
            )}
            {profile.allergies && profile.allergies.length > 0 && (
              <span style={{ color: "var(--text-muted)" }}>
                Исключено: <strong style={{ color: "#f87171" }}>{profile.allergies.join(", ")}</strong>
              </span>
            )}
            {saved && (
              <span style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6, color: "var(--green-neon)", fontSize: 12 }}>
                <BookmarkCheck size={12} /> Рацион сохранён
              </span>
            )}
          </div>
        ) : null}

        {/* Spinner / Error / Idle state */}
        {status === "idle" && (
          <div
            style={{
              textAlign: "center",
              padding: "80px 24px",
              background: "var(--black-3)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 16,
            }}
          >
            <div style={{ fontSize: 48, marginBottom: 16 }}>🥗</div>
            <div className="font-display" style={{ fontSize: 32, color: "var(--white)", marginBottom: 8 }}>
              РАЦИОН НЕ СФОРМИРОВАН
            </div>
            <div style={{ color: "var(--text-muted)", fontSize: 14, maxWidth: 400, margin: "0 auto 28px" }}>
              Нажмите «Сформировать рацион», и ИИ создаст персональный план питания на основе вашего профиля.
            </div>
            <button className="btn-primary" onClick={handleGenerate}>
              <Sparkles size={14} /> Сформировать рацион
            </button>
          </div>
        )}

        {status === "loading" && (
          <div
            style={{
              textAlign: "center",
              padding: "80px 24px",
              background: "var(--black-3)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 16,
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                border: "2px solid rgba(74,222,128,0.2)",
                borderTop: "2px solid var(--green-neon)",
                margin: "0 auto 24px",
                animation: "spin 0.8s linear infinite",
              }}
            />
            <div className="font-display" style={{ fontSize: 28, color: "var(--green-neon)", marginBottom: 8 }}>
              СОСТАВЛЯЮ РАЦИОН…
            </div>
            <div style={{ color: "var(--text-muted)", fontSize: 13 }}>
              ИИ подбирает блюда под ваш профиль
            </div>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {status === "error" && (
          <div
            style={{
              background: "rgba(248,113,113,0.08)",
              border: "1px solid rgba(248,113,113,0.25)",
              borderRadius: 16,
              padding: 32,
              display: "flex",
              gap: 16,
              alignItems: "flex-start",
            }}
          >
            <AlertCircle size={20} color="#f87171" style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <div style={{ fontSize: 15, color: "#f87171", fontWeight: 500, marginBottom: 6 }}>
                Ошибка генерации рациона
              </div>
              <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 16 }}>
                {errorMsg}
              </div>
              <button className="btn-outline" onClick={handleGenerate} style={{ fontSize: 13 }}>
                <RefreshCw size={13} /> Попробовать снова
              </button>
            </div>
          </div>
        )}

        {/* Ration result */}
        {status === "done" && ration && (
          <>
            {/* КБЖУ summary */}
            <div
              style={{
                background: "var(--black-3)",
                border: "1px solid rgba(74,222,128,0.15)",
                borderRadius: 16,
                padding: "28px 32px",
                marginBottom: 32,
                display: "flex",
                gap: 32,
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              <div>
                <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 4 }}>
                  Итого за день
                </div>
                <div className="font-display" style={{ fontSize: 42, color: "var(--green-neon)", lineHeight: 1 }}>
                  {ration.totals.kcal}
                  <span style={{ fontSize: 16, color: "var(--text-muted)", fontFamily: "DM Sans" }}> ккал</span>
                </div>
                {target.kcal && (
                  <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>
                    цель: {target.kcal} ккал
                  </div>
                )}
              </div>

              <div className="divider" style={{ width: 1, height: 48, background: "rgba(255,255,255,0.06)" }} />

              <div style={{ flex: 1, minWidth: 260, display: "flex", flexDirection: "column", gap: 12 }}>
                <MacroBar label="Калории"  current={ration.totals.kcal}    target={target.kcal    ?? 0} color="var(--green-neon)" />
                <MacroBar label="Белки"    current={ration.totals.protein}  target={target.protein ?? 0} color="var(--green-neon)" />
                <MacroBar label="Углеводы" current={ration.totals.carbs}    target={target.carbs   ?? 0} color="#60a5fa" />
                <MacroBar label="Жиры"     current={ration.totals.fat}      target={target.fat     ?? 0} color="#f59e0b" />
              </div>
            </div>

            {/* Meals */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {ration.meals.map((meal, i) => (
                <MealCard key={i} meal={meal} />
              ))}
            </div>

            {/* Shopping cart */}
            {cart.length > 0 && <CartBlock items={cart} />}
          </>
        )}
      </div>
    </div>
  );
}
