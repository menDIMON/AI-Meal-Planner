import { Leaf, Users, BookOpen, Award, ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";

const team = [
  { name: "Екатерина Волкова", role: "Главный нутрициолог", emoji: "👩‍⚕️", exp: "10 лет опыта" },
  { name: "Михаил Орлов", role: "Шеф-повар", emoji: "👨‍🍳", exp: "Ресторанный опыт" },
  { name: "Анна Смирнова", role: "Диетолог", emoji: "👩‍🔬", exp: "Кандидат наук" },
];

const values = [
  { icon: "🌿", title: "Натуральность", desc: "Только реальные продукты без синтетических добавок и искусственных красителей" },
  { icon: "🔬", title: "Наука", desc: "Все рационы основаны на доказательной медицине и актуальных исследованиях" },
  { icon: "🎨", title: "Вкус", desc: "Здоровое не значит скучное — мы доказываем это каждым блюдом" },
  { icon: "💚", title: "Забота", desc: "Индивидуальный подход к каждому — ведь все мы разные" },
];

const steps = [
  { num: "01", title: "Заполните анкету", desc: "Укажите ваши параметры, цели и пищевые предпочтения. Это займёт 3 минуты." },
  { num: "02", title: "Получите рацион", desc: "Алгоритм создаёт персональный план питания с учётом всех ваших данных." },
  { num: "03", title: "Закажите продукты", desc: "Корзина формируется автоматически — просто подтвердите и ждите доставку." },
  { num: "04", title: "Готовьте и ешьте", desc: "Следуйте рецептам и отмечайте приёмы пищи. Мы поддержим вас на каждом шагу." },
];

export default function AboutPage() {
  return (
    <div style={{ paddingTop: 64, minHeight: "100vh" }}>

      {/* Hero */}
      <section
        style={{
          padding: "100px 24px",
          maxWidth: 1280,
          margin: "0 auto",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: 500,
            height: 500,
            background: "radial-gradient(circle, rgba(26,122,74,0.12) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <span className="tag tag-green" style={{ marginBottom: 24 }}>
          О нас
        </span>
        <h1
          className="font-display"
          style={{
            fontSize: "clamp(56px, 10vw, 120px)",
            lineHeight: 0.92,
            marginBottom: 48,
            maxWidth: 800,
          }}
        >
          ЕДА —
          <br />
          ЭТО НАУКА
          <br />
          <span style={{ color: "var(--green-neon)" }}>И ИСКУССТВО</span>
        </h1>
        <p
          style={{
            fontSize: 18,
            color: "var(--text-muted)",
            maxWidth: 560,
            lineHeight: 1.7,
            fontWeight: 300,
          }}
        >
          NutriFlow появился в 2023 году с простой идеей: сделать
          правильное питание доступным для каждого. Без сложных подсчётов,
          без скучных диет и без компромиссов между вкусом и пользой.
        </p>
      </section>

      <div className="divider" />

      {/* How it works */}
      <section style={{ padding: "100px 24px", background: "var(--black-2)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ marginBottom: 64 }}>
            <span className="tag tag-green" style={{ marginBottom: 20 }}>Как это работает</span>
            <h2
              className="font-display"
              style={{ fontSize: "clamp(42px, 6vw, 72px)", lineHeight: 1 }}
            >
              ЧЕТЫРЕ ШАГА
              <br />К РЕЗУЛЬТАТУ
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 32,
            }}
          >
            {steps.map((s, i) => (
              <div key={i} style={{ position: "relative" }}>
                <div
                  className="font-display"
                  style={{
                    fontSize: 80,
                    color: "rgba(74,222,128,0.08)",
                    lineHeight: 1,
                    marginBottom: -20,
                  }}
                >
                  {s.num}
                </div>
                <h3
                  style={{
                    fontSize: 20,
                    fontWeight: 500,
                    color: "var(--white)",
                    marginBottom: 12,
                  }}
                >
                  {s.title}
                </h3>
                <p style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.6 }}>
                  {s.desc}
                </p>
                {i < steps.length - 1 && (
                  <div
                    style={{
                      position: "absolute",
                      right: -16,
                      top: 40,
                      color: "rgba(74,222,128,0.3)",
                    }}
                    className="hidden lg:block"
                  >
                    <ArrowRight size={20} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* Values */}
      <section style={{ padding: "100px 24px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ marginBottom: 64 }}>
            <span className="tag tag-green" style={{ marginBottom: 20 }}>Наши принципы</span>
            <h2
              className="font-display"
              style={{ fontSize: "clamp(42px, 6vw, 72px)", lineHeight: 1 }}
            >
              ЧТО ДЛЯ НАС
              <br />ВАЖНО
            </h2>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 24,
            }}
          >
            {values.map((v, i) => (
              <div
                key={i}
                className="card-hover"
                style={{
                  background: "var(--black-3)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: 16,
                  padding: 32,
                }}
              >
                <div style={{ fontSize: 40, marginBottom: 20 }}>{v.icon}</div>
                <h3 style={{ fontSize: 18, fontWeight: 500, marginBottom: 12 }}>{v.title}</h3>
                <p style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.6 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* Team */}
      <section style={{ padding: "100px 24px", background: "var(--black-2)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ marginBottom: 64 }}>
            <span className="tag tag-green" style={{ marginBottom: 20 }}>Команда</span>
            <h2
              className="font-display"
              style={{ fontSize: "clamp(42px, 6vw, 72px)", lineHeight: 1 }}
            >
              ЛЮДИ ЗА
              <br />NUTRIFLOW
            </h2>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 24,
            }}
          >
            {team.map((t, i) => (
              <div
                key={i}
                className="card-hover"
                style={{
                  background: "var(--black-3)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: 20,
                  padding: 40,
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    width: 80,
                    height: 80,
                    background: "rgba(74,222,128,0.08)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 36,
                    margin: "0 auto 24px",
                    border: "1px solid rgba(74,222,128,0.15)",
                  }}
                >
                  {t.emoji}
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 500, marginBottom: 8 }}>{t.name}</h3>
                <div style={{ fontSize: 13, color: "var(--green-neon)", marginBottom: 8 }}>{t.role}</div>
                <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{t.exp}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "100px 24px" }}>
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          <h2
            className="font-display"
            style={{ fontSize: "clamp(44px, 7vw, 88px)", lineHeight: 1, marginBottom: 24 }}
          >
            ГОТОВЫ
            <br />
            <span style={{ color: "var(--green-neon)" }}>ПОПРОБОВАТЬ?</span>
          </h2>
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: 16,
              marginBottom: 48,
              lineHeight: 1.6,
            }}
          >
            Присоединяйтесь к 12 000+ пользователям,
            <br />которые уже изменили своё питание с NutriFlow
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/profile" className="btn-primary" style={{ fontSize: 15 }}>
              Начать бесплатно <ArrowRight size={16} />
            </Link>
            <Link href="/meal-plan" className="btn-outline">
              Посмотреть рационы
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          borderTop: "1px solid rgba(255,255,255,0.06)",
          padding: "40px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 16,
          maxWidth: 1280,
          margin: "0 auto",
        }}
      >
        <span
          className="font-display"
          style={{ fontSize: 20, color: "var(--green-neon)", letterSpacing: "0.08em" }}
        >
          NUTRIFLOW
        </span>
        <span style={{ fontSize: 13, color: "var(--text-muted)" }}>
          © 2025 NutriFlow. Все права защищены.
        </span>
      </footer>
    </div>
  );
}
