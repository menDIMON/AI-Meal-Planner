"use client";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag } from "lucide-react";
import Link from "next/link";

const cartItems = [
  { name: "Куриное филе", qty: 600, unit: "г", price: 320, emoji: "🍗", category: "Мясо" },
  { name: "Лосось (стейк)", qty: 400, unit: "г", price: 580, emoji: "🐟", category: "Рыба" },
  { name: "Греческий йогурт", qty: 500, unit: "г", price: 140, emoji: "🥛", category: "Молочное" },
  { name: "Авокадо", qty: 3, unit: "шт", price: 210, emoji: "🥑", category: "Овощи и фрукты" },
  { name: "Киноа", qty: 300, unit: "г", price: 165, emoji: "🌾", category: "Крупы" },
  { name: "Черника замороженная", qty: 500, unit: "г", price: 190, emoji: "🫐", category: "Ягоды" },
];

const total = cartItems.reduce((s, i) => s + i.price, 0);

export default function CartPage() {
  return (
    <div style={{ paddingTop: 64, minHeight: "100vh" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "60px 24px" }}>

        {/* Header */}
        <div style={{ marginBottom: 48 }}>
          <span className="tag tag-green" style={{ marginBottom: 16 }}>
            <ShoppingBag size={10} />
            {cartItems.length} товаров
          </span>
          <h1
            className="font-display"
            style={{ fontSize: "clamp(44px, 7vw, 80px)", lineHeight: 0.95 }}
          >
            МОЯ
            <br />
            <span style={{ color: "var(--green-neon)" }}>КОРЗИНА</span>
          </h1>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 380px",
            gap: 32,
            alignItems: "start",
          }}
        >
          {/* Items */}
          <div>
            {/* Group by category header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <span style={{ fontSize: 13, color: "var(--text-muted)" }}>
                Для рациона на неделю
              </span>
              <button
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--text-muted)",
                  fontSize: 13,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <Trash2 size={12} /> Очистить
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {cartItems.map((item, i) => (
                <div
                  key={i}
                  className="card-hover"
                  style={{
                    background: "var(--black-3)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: 14,
                    padding: "20px 24px",
                    display: "flex",
                    alignItems: "center",
                    gap: 20,
                    flexWrap: "wrap",
                  }}
                >
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      background: "rgba(74,222,128,0.06)",
                      borderRadius: 12,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 28,
                      flexShrink: 0,
                    }}
                  >
                    {item.emoji}
                  </div>

                  <div style={{ flex: 1, minWidth: 150 }}>
                    <div style={{ fontSize: 15, fontWeight: 500, color: "var(--white)" }}>
                      {item.name}
                    </div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>
                      {item.category}
                    </div>
                  </div>

                  {/* Qty control */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      background: "rgba(255,255,255,0.04)",
                      borderRadius: 10,
                      padding: "6px 14px",
                    }}
                  >
                    <button
                      style={{
                        background: "none",
                        border: "none",
                        color: "var(--text-muted)",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        padding: 0,
                      }}
                    >
                      <Minus size={12} />
                    </button>
                    <span style={{ fontSize: 14, minWidth: 60, textAlign: "center" }}>
                      {item.qty} {item.unit}
                    </span>
                    <button
                      style={{
                        background: "none",
                        border: "none",
                        color: "var(--green-neon)",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        padding: 0,
                      }}
                    >
                      <Plus size={12} />
                    </button>
                  </div>

                  <div style={{ textAlign: "right", minWidth: 80 }}>
                    <div style={{ fontSize: 16, fontWeight: 500, color: "var(--white)" }}>
                      {item.price} ₽
                    </div>
                  </div>

                  <button
                    style={{
                      background: "none",
                      border: "none",
                      color: "rgba(255,255,255,0.2)",
                      cursor: "pointer",
                      padding: 8,
                      borderRadius: 8,
                      transition: "color 0.2s",
                    }}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLButtonElement).style.color = "#ef4444")
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.2)")
                    }
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>

            {/* Add more */}
            <Link
              href="/meal-plan"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                marginTop: 20,
                padding: 20,
                borderRadius: 14,
                border: "1px dashed rgba(74,222,128,0.2)",
                color: "var(--green-neon)",
                textDecoration: "none",
                fontSize: 14,
                transition: "all 0.2s",
              }}
            >
              <Plus size={16} /> Добавить из рациона
            </Link>
          </div>

          {/* Summary */}
          <div
            style={{
              background: "var(--black-3)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 20,
              padding: 32,
              position: "sticky",
              top: 80,
            }}
          >
            <h3 style={{ fontSize: 18, fontWeight: 500, marginBottom: 32 }}>
              Итог заказа
            </h3>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 16,
                marginBottom: 24,
              }}
            >
              {[
                { label: "Товары", val: `${total} ₽` },
                { label: "Доставка", val: "Бесплатно", green: true },
                { label: "Скидка 10%", val: `−${Math.round(total * 0.1)} ₽`, green: true },
              ].map((r) => (
                <div
                  key={r.label}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 14,
                  }}
                >
                  <span style={{ color: "var(--text-muted)" }}>{r.label}</span>
                  <span style={{ color: r.green ? "var(--green-neon)" : "var(--white)" }}>
                    {r.val}
                  </span>
                </div>
              ))}
            </div>

            <div className="divider" style={{ marginBottom: 24 }} />

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 32,
              }}
            >
              <span style={{ fontSize: 15, fontWeight: 500 }}>К оплате</span>
              <span
                className="font-display"
                style={{ fontSize: 32, color: "var(--green-neon)" }}
              >
                {Math.round(total * 0.9)} ₽
              </span>
            </div>

            {/* Promo */}
            <div
              style={{
                display: "flex",
                gap: 8,
                marginBottom: 24,
              }}
            >
              <input
                placeholder="Промокод"
                style={{
                  flex: 1,
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 8,
                  padding: "12px 16px",
                  color: "var(--white)",
                  fontSize: 14,
                  outline: "none",
                }}
              />
              <button
                style={{
                  padding: "12px 16px",
                  background: "rgba(74,222,128,0.1)",
                  border: "1px solid rgba(74,222,128,0.2)",
                  borderRadius: 8,
                  color: "var(--green-neon)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Tag size={14} />
              </button>
            </div>

            <button className="btn-primary" style={{ width: "100%", justifyContent: "center" }}>
              Оформить заказ <ArrowRight size={16} />
            </button>

            <p style={{ fontSize: 12, color: "var(--text-muted)", textAlign: "center", marginTop: 16, lineHeight: 1.5 }}>
              Доставка на следующий день при заказе до 20:00
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
