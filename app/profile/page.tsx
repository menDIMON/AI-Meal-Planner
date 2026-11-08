"use client";

import { useEffect, useState } from "react";
import { Settings, TrendingUp, Calendar, ChevronRight, Edit2, Award } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ProfileData } from "./edit/page";
import { calculateNutrition, type NutritionResult } from "../../utils/nutritionCalculator";

const GOAL_LABELS: Record<string, string> = {
  loss: "Похудение",
  maintain: "Поддержание веса",
  gain: "Набор массы",
};

const ACTIVITY_LABELS: Record<string, string> = {
  sedentary: "Сидячий образ жизни",
  light: "Лёгкая активность",
  moderate: "Умеренная активность",
  active: "Высокая активность",
  very_active: "Очень высокая активность",
};

const GENDER_LABELS: Record<string, string> = {
  male: "Мужской",
  female: "Женский",
  other: "Другой",
};

const history = [
  { date: "Вчера", meals: 4, kcal: 1950, complete: true },
  { date: "2 дня назад", meals: 3, kcal: 1700, complete: false },
  { date: "3 дня назад", meals: 4, kcal: 2010, complete: true },
  { date: "4 дня назад", meals: 3, kcal: 1880, complete: true },
];

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [nutrition, setNutrition] = useState<NutritionResult | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("nutri_profile");
      if (stored) {
        const parsed: ProfileData = JSON.parse(stored);
        setProfile(parsed);
        setNutrition(calculateNutrition(parsed));
      }
    } catch {}
  }, []);

  const displayName = profile?.name?.toUpperCase() || "ПОЛЬЗОВАТЕЛЬ";
  const displayGoal = profile?.goal ? GOAL_LABELS[profile.goal] : "Похудение";

  // Stats cards: show КБЖУ if profile is filled, otherwise placeholder
  const statsCards = nutrition
    ? [
        { label: "Калории", value: `${nutrition.calories}`, icon: "🔥", unit: "ккал" },
        { label: "Белки", value: `${nutrition.protein}`, icon: "🥩", unit: "г" },
        { label: "Жиры", value: `${nutrition.fats}`, icon: "🧈", unit: "г" },
        { label: "Углеводы", value: `${nutrition.carbs}`, icon: "🌾", unit: "г" },
      ]
    : [
        { label: "Калории", value: "0", icon: "🔥", unit: "ккал" },
        { label: "Белки", value: "0", icon: "🥩", unit: "г" },
        { label: "Жиры", value: "0", icon: "🧈", unit: "г" },
        { label: "Углеводы", value: "0", icon: "🌾", unit: "г" },
      ];

  // Goals section: use calculated КБЖУ or fallback
  const goals = nutrition
    ? [
        { name: "Белки", current: 0, target: nutrition.protein, unit: "г", color: "var(--green-neon)" },
        { name: "Углеводы", current: 0, target: nutrition.carbs, unit: "г", color: "#60a5fa" },
        { name: "Жиры", current: 0, target: nutrition.fats, unit: "г", color: "#f59e0b" },
        { name: "Ккал", current: 0, target: nutrition.calories, unit: "", color: "#e879f9" },
      ]
    : [
        { name: "Белки", current: 0, target: 0, unit: "г", color: "var(--green-neon)" },
        { name: "Углеводы", current: 0, target: 0, unit: "г", color: "#60a5fa" },
        { name: "Жиры", current: 0, target: 0, unit: "г", color: "#f59e0b" },
        { name: "Ккал", current: 0, target: 0, unit: "", color: "#e879f9" },
      ];

  const today = new Date().toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div style={{ paddingTop: 64, minHeight: "100vh" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "60px 24px" }}>

        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            marginBottom: 60,
            flexWrap: "wrap",
            gap: 24,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                background: "linear-gradient(135deg, var(--green) 0%, var(--green-neon) 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 32,
                flexShrink: 0,
              }}
            >
              👤
            </div>
            <div>
              <h1
                className="font-display"
                style={{ fontSize: 48, color: "var(--white)", lineHeight: 1 }}
              >
                {displayName}
              </h1>
              <div style={{ color: "var(--text-muted)", fontSize: 14, marginTop: 4 }}>
                {profile
                  ? [
                      profile.gender ? GENDER_LABELS[profile.gender] : null,
                      profile.age ? `${profile.age} лет` : null,
                      profile.height ? `${profile.height} см` : null,
                      profile.weight ? `${profile.weight} кг` : null,
                    ]
                      .filter(Boolean)
                      .join(" · ") || "Заполните профиль"
                  : "alex@example.com · В NutriFlow с марта 2025"}
              </div>
              <span className="tag tag-green" style={{ marginTop: 10 }}>
                <Award size={10} />
                Premium
              </span>
            </div>
          </div>
          <Link href="/profile/edit" className="btn-outline" style={{ textDecoration: "none" }}>
            <Edit2 size={14} /> Редактировать
          </Link>
        </div>

        {/* Profile info cards (shown when profile is filled) */}
        {profile && (profile.goal || profile.activityLevel || profile.allergies?.length || profile.favoriteFoods?.length) && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 16,
              marginBottom: 32,
            }}
          >
            {profile.goal && (
              <InfoCard icon="🎯" label="Цель" value={GOAL_LABELS[profile.goal]} />
            )}
            {profile.activityLevel && (
              <InfoCard icon="⚡" label="Активность" value={ACTIVITY_LABELS[profile.activityLevel]} />
            )}
            {nutrition && (
              <InfoCard icon="📊" label="BMR / TDEE" value={`${nutrition.bmr} / ${nutrition.tdee} ккал`} />
            )}
            {profile.mealsPerDay && (
              <InfoCard icon="🍽️" label="Приёмов пищи" value={`${profile.mealsPerDay} в день`} />
            )}
            {profile.allergies?.length > 0 && (
              <InfoCard icon="⚠️" label="Аллергии" value={profile.allergies.join(", ")} />
            )}
            {profile.favoriteFoods?.length > 0 && (
              <InfoCard icon="❤️" label="Любимые продукты" value={profile.favoriteFoods.join(", ")} />
            )}
          </div>
        )}

        {/* Stats / КБЖУ */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 16,
            marginBottom: 40,
          }}
        >
          {statsCards.map((s, i) => (
            <div
              key={i}
              className="card-hover"
              style={{
                background: "var(--black-3)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 16,
                padding: "24px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 28, marginBottom: 8 }}>{s.icon}</div>
              <div
                className="font-display"
                style={{ fontSize: 32, color: "var(--green-neon)" }}
              >
                {s.value}
              </div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>
                {s.label}
                {s.unit && (
                  <span style={{ color: "rgba(245,245,240,0.4)", marginLeft: 4 }}>{s.unit}</span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 24,
          }}
          className="md:grid-cols-2 grid-cols-1"
        >
          {/* Daily goals */}
          <div
            style={{
              background: "var(--black-3)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 16,
              padding: 32,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 32,
              }}
            >
              <h3 style={{ fontSize: 16, fontWeight: 500 }}>Цели на сегодня</h3>
              <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                {today}
              </span>
            </div>
            {goals.map((g, i) => (
              <div key={i} style={{ marginBottom: 24 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 8,
                    fontSize: 13,
                  }}
                >
                  <span style={{ color: "rgba(245,245,240,0.7)" }}>{g.name}</span>
                  <span style={{ color: g.color }}>
                    {g.current}{g.unit} / {g.target}{g.unit}
                  </span>
                </div>
                <div
                  style={{
                    height: 4,
                    background: "rgba(255,255,255,0.06)",
                    borderRadius: 2,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: g.target > 0 ? `${Math.min(100, (g.current / g.target) * 100)}%` : "0%",
                      height: "100%",
                      background: g.color,
                      borderRadius: 2,
                      transition: "width 0.8s ease",
                    }}
                  />
                </div>
              </div>
            ))}
            {!nutrition && (
              <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 8 }}>
                Заполните профиль для персональных расчётов КБЖУ
              </p>
            )}
          </div>

          {/* History */}
          <div
            style={{
              background: "var(--black-3)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 16,
              padding: 32,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 32,
              }}
            >
              <h3 style={{ fontSize: 16, fontWeight: 500 }}>История питания</h3>
              <Link
                href="/meal-plan"
                style={{
                  fontSize: 12,
                  color: "var(--green-neon)",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                Все <ChevronRight size={12} />
              </Link>
            </div>

            {history.map((h, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "14px 0",
                  borderBottom: i < history.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: h.complete ? "var(--green-neon)" : "rgba(255,255,255,0.2)",
                      flexShrink: 0,
                    }}
                  />
                  <div>
                    <div style={{ fontSize: 14, color: "var(--white)" }}>{h.date}</div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                      {h.meals} приёма
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div
                    style={{
                      fontSize: 14,
                      color: h.complete ? "var(--green-neon)" : "var(--text-muted)",
                    }}
                  >
                    {h.kcal} ккал
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                    {h.complete ? "Выполнен" : "Не завершён"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Settings link */}
        <div
          style={{
            marginTop: 24,
            background: "var(--black-3)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 16,
            overflow: "hidden",
          }}
        >
          {[
            {
              icon: <Settings size={16} />,
              label: "Настройки профиля",
              sub: "Данные, аллергии, предпочтения",
              href: "/profile/edit",
            },
            {
              icon: <TrendingUp size={16} />,
              label: "Моя цель",
              sub: `Текущая программа: ${displayGoal}`,
              href: "/profile/edit",
            },
            {
              icon: <Calendar size={16} />,
              label: "Расписание",
              sub: `Приёмов пищи: ${profile?.mealsPerDay || 3} в день`,
              href: "/profile/edit",
            },
          ].map((item, i, arr) => (
            <button
              key={i}
              onClick={() => router.push(item.href)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "20px 32px",
                background: "none",
                border: "none",
                borderBottom: i < arr.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                cursor: "pointer",
                color: "var(--white)",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.background =
                  "rgba(74,222,128,0.03)")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.background = "none")
              }
            >
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ color: "var(--green-neon)" }}>{item.icon}</div>
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontSize: 14, fontWeight: 400 }}>{item.label}</div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{item.sub}</div>
                </div>
              </div>
              <ChevronRight size={16} color="var(--text-muted)" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function InfoCard({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div
      style={{
        background: "var(--black-3)",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: 12,
        padding: "16px 20px",
        display: "flex",
        alignItems: "flex-start",
        gap: 12,
      }}
    >
      <span style={{ fontSize: 20, flexShrink: 0, marginTop: 2 }}>{icon}</span>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>
          {label}
        </div>
        <div style={{ fontSize: 13, color: "var(--white)", wordBreak: "break-word" }}>
          {value}
        </div>
      </div>
    </div>
  );
}
