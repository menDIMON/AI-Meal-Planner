import Link from "next/link";
import { ArrowRight, Zap, Target, ShieldCheck, ChevronRight, Star } from "lucide-react";

const features = [
  {
    icon: "⚡",
    title: "Быстрый подбор",
    desc: "Алгоритм анализирует ваши параметры и составляет рацион за 60 секунд",
  },
  {
    icon: "🎯",
    title: "Точные калории",
    desc: "Точный расчёт КБЖУ под ваши цели — похудение, набор массы или поддержание",
  },
  {
    icon: "🛡️",
    title: "Проверенные рецепты",
    desc: "Все блюда разработаны нутрициологами и проверены на сбалансированность",
  },
  {
    icon: "🔄",
    title: "Гибкая замена",
    desc: "Не любите брокколи? Заменим на другие продукты с похожим составом",
  },
];

const plans = [
  {
    name: "Старт",
    kcal: "1 400",
    goal: "Похудение",
    color: "#1a7a4a",
    meals: ["Овсянка с ягодами", "Куриный суп", "Лосось с овощами"],
    price: "1 490 ₽",
  },
  {
    name: "Баланс",
    kcal: "2 000",
    goal: "Поддержание",
    color: "#4ade80",
    meals: ["Яичница с авокадо", "Паста с курицей", "Говядина с рисом"],
    price: "1 890 ₽",
    featured: true,
  },
  {
    name: "Масса",
    kcal: "2 800",
    goal: "Набор",
    color: "#1a7a4a",
    meals: ["Протеиновые блины", "Бурито с фасолью", "Стейк с картофелем"],
    price: "2 290 ₽",
  },
];

const reviews = [
  { name: "Алина М.", text: "Минус 7 кг за месяц, и ни одного скучного обеда!", stars: 5 },
  { name: "Дмитрий К.", text: "Набрал 4 кг мышц за 8 недель. Рацион реально работает.", stars: 5 },
  { name: "Светлана В.", text: "Наконец-то нашла питание, которое не надо самой считать.", stars: 5 },
];

export default function HomePage() {
  return (
    <div style={{ paddingTop: 64 }}>
      {/* HERO */}
      <section
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          position: "relative",
          overflow: "hidden",
          padding: "80px 24px",
        }}
      >
        {/* BG decorations */}
        <div
          style={{
            position: "absolute",
            top: "10%",
            right: "-10%",
            width: 600,
            height: 600,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(74,222,128,0.07) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "5%",
            left: "-5%",
            width: 400,
            height: 400,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(26,122,74,0.1) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div style={{ maxWidth: 1280, margin: "0 auto", width: "100%" }}>
          <div style={{ maxWidth: 760 }}>
            <div className="animate-fade-up" style={{ marginBottom: 24 }}>
              <span className="tag tag-green">
                <span
                  className="animate-pulse-green"
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "var(--green-neon)",
                    display: "inline-block",
                  }}
                />
                Новый сезон — новый рацион
              </span>
            </div>

            <h1
              className="font-display animate-fade-up"
              style={{
                fontSize: "clamp(72px, 12vw, 140px)",
                lineHeight: 0.92,
                marginBottom: 32,
                color: "var(--white)",
              }}
            >
              ЕДА,{" "}
              <span style={{ color: "var(--green-neon)" }}>КОТОРАЯ</span>
              <br />
              РАБОТАЕТ
            </h1>

            <p
              className="animate-fade-up-delay"
              style={{
                fontSize: 18,
                color: "var(--text-muted)",
                maxWidth: 480,
                lineHeight: 1.7,
                marginBottom: 48,
                fontWeight: 300,
              }}
            >
              Персональный рацион под ваши цели, вкусы и образ жизни.
              Никаких скучных диет — только сбалансированное питание,
              которое вам понравится.
            </p>

            <div
              className="animate-fade-up-delay-2"
              style={{ display: "flex", gap: 16, flexWrap: "wrap" }}
            >
              <Link href="/meal-plan" className="btn-primary">
                Составить рацион <ArrowRight size={16} />
              </Link>
              <Link href="/about" className="btn-outline">
                Как это работает
              </Link>
            </div>

            {/* Stats */}
            <div
              className="animate-fade-up-delay-2"
              style={{
                display: "flex",
                gap: 48,
                marginTop: 72,
                paddingTop: 48,
                borderTop: "1px solid rgba(255,255,255,0.06)",
                flexWrap: "wrap",
              }}
            >
              {[
                { num: "12 000+", label: "Активных пользователей" },
                { num: "340+", label: "Рецептов в базе" },
                { num: "4.9", label: "Оценка пользователей" },
              ].map((s) => (
                <div key={s.num}>
                  <div
                    className="font-display"
                    style={{ fontSize: 40, color: "var(--green-neon)", lineHeight: 1 }}
                  >
                    {s.num}
                  </div>
                  <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* FEATURES */}
      <section style={{ padding: "100px 24px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ marginBottom: 64 }}>
            <span className="tag tag-green" style={{ marginBottom: 20 }}>
              Почему NutriFlow
            </span>
            <h2
              className="font-display"
              style={{ fontSize: "clamp(42px, 6vw, 72px)", lineHeight: 1, color: "var(--white)" }}
            >
              УМНЫЙ ПОДХОД
              <br />К ПИТАНИЮ
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 24,
            }}
          >
            {features.map((f, i) => (
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
                <div style={{ fontSize: 36, marginBottom: 20 }}>{f.icon}</div>
                <h3
                  style={{
                    fontSize: 18,
                    fontWeight: 500,
                    color: "var(--white)",
                    marginBottom: 12,
                  }}
                >
                  {f.title}
                </h3>
                <p style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.6 }}>
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* PLANS */}
      <section style={{ padding: "100px 24px", background: "var(--black-2)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ marginBottom: 64, display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 24 }}>
            <div>
              <span className="tag tag-green" style={{ marginBottom: 20 }}>
                Тарифы
              </span>
              <h2
                className="font-display"
                style={{ fontSize: "clamp(42px, 6vw, 72px)", lineHeight: 1, color: "var(--white)" }}
              >
                ВЫБЕРИТЕ
                <br />СВОЙ ПЛАН
              </h2>
            </div>
            <Link
              href="/meal-plan"
              style={{
                color: "var(--green-neon)",
                textDecoration: "none",
                fontSize: 14,
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
              className="link-underline"
            >
              Все планы <ChevronRight size={16} />
            </Link>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 24,
            }}
          >
            {plans.map((p, i) => (
              <div
                key={i}
                className="card-hover"
                style={{
                  background: p.featured ? "var(--black-3)" : "var(--black-3)",
                  border: p.featured
                    ? "1px solid rgba(74,222,128,0.35)"
                    : "1px solid rgba(255,255,255,0.06)",
                  borderRadius: 16,
                  padding: 32,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {p.featured && (
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 2,
                      background: "var(--green-neon)",
                    }}
                  />
                )}
                {p.featured && (
                  <span className="tag tag-green" style={{ marginBottom: 20 }}>
                    Популярный
                  </span>
                )}
                {!p.featured && <div style={{ marginBottom: 32 }} />}

                <div
                  className="font-display"
                  style={{ fontSize: 48, color: "var(--white)", lineHeight: 1 }}
                >
                  {p.name}
                </div>
                <div style={{ color: "var(--text-muted)", fontSize: 13, marginBottom: 24 }}>
                  {p.goal}
                </div>

                <div
                  style={{
                    fontSize: 36,
                    fontWeight: 500,
                    color: "var(--green-neon)",
                    marginBottom: 4,
                  }}
                >
                  {p.kcal}
                  <span style={{ fontSize: 16, fontWeight: 300, color: "var(--text-muted)" }}>
                    {" "}ккал/день
                  </span>
                </div>

                <div
                  style={{
                    borderTop: "1px solid rgba(255,255,255,0.06)",
                    margin: "24px 0",
                    paddingTop: 24,
                  }}
                >
                  {p.meals.map((meal, j) => (
                    <div
                      key={j}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        marginBottom: 10,
                        fontSize: 14,
                        color: "rgba(245,245,240,0.7)",
                      }}
                    >
                      <div
                        style={{
                          width: 4,
                          height: 4,
                          borderRadius: "50%",
                          background: "var(--green-neon)",
                          flexShrink: 0,
                        }}
                      />
                      {meal}
                    </div>
                  ))}
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginTop: 24,
                  }}
                >
                  <span style={{ fontSize: 20, fontWeight: 500 }}>{p.price}</span>
                  <Link
                    href="/meal-plan"
                    style={{
                      padding: "10px 20px",
                      borderRadius: 6,
                      background: p.featured ? "var(--green-neon)" : "transparent",
                      border: p.featured
                        ? "none"
                        : "1px solid rgba(255,255,255,0.12)",
                      color: p.featured ? "var(--black)" : "var(--white)",
                      fontSize: 13,
                      fontWeight: 500,
                      textDecoration: "none",
                      transition: "all 0.2s",
                    }}
                  >
                    Выбрать
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* REVIEWS */}
      <section style={{ padding: "100px 24px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ marginBottom: 64 }}>
            <span className="tag tag-green" style={{ marginBottom: 20 }}>
              Отзывы
            </span>
            <h2
              className="font-display"
              style={{ fontSize: "clamp(42px, 6vw, 72px)", lineHeight: 1 }}
            >
              ЧТО ГОВОРЯТ
              <br />ПОЛЬЗОВАТЕЛИ
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 24,
            }}
          >
            {reviews.map((r, i) => (
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
                <div style={{ display: "flex", gap: 4, marginBottom: 20 }}>
                  {Array(r.stars)
                    .fill(0)
                    .map((_, j) => (
                      <Star
                        key={j}
                        size={14}
                        fill="var(--green-neon)"
                        color="var(--green-neon)"
                      />
                    ))}
                </div>
                <p
                  style={{
                    fontSize: 15,
                    lineHeight: 1.6,
                    color: "rgba(245,245,240,0.8)",
                    marginBottom: 24,
                    fontStyle: "italic",
                  }}
                >
                  «{r.text}»
                </p>
                <div style={{ fontSize: 13, color: "var(--text-muted)" }}>{r.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        style={{
          margin: "0 24px 80px",
          borderRadius: 24,
          background:
            "linear-gradient(135deg, rgba(26,122,74,0.3) 0%, rgba(10,10,10,1) 60%)",
          border: "1px solid rgba(74,222,128,0.15)",
          padding: "80px 60px",
          position: "relative",
          overflow: "hidden",
          maxWidth: 1280 - 48,
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: -100,
            top: -100,
            width: 500,
            height: 500,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(74,222,128,0.08) 0%, transparent 60%)",
            pointerEvents: "none",
          }}
        />
        <div style={{ maxWidth: 560, position: "relative" }}>
          <h2
            className="font-display"
            style={{ fontSize: "clamp(40px, 6vw, 72px)", lineHeight: 1, marginBottom: 24 }}
          >
            ГОТОВЫ НАЧАТЬ
            <br />
            <span style={{ color: "var(--green-neon)" }}>ПИТАТЬСЯ ПРАВИЛЬНО?</span>
          </h2>
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: 16,
              marginBottom: 40,
              lineHeight: 1.6,
            }}
          >
            Первые 7 дней — бесплатно. Без привязки карты.
          </p>
          <Link href="/profile" className="btn-primary" style={{ fontSize: 15 }}>
            Начать бесплатно <ArrowRight size={16} />
          </Link>
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
