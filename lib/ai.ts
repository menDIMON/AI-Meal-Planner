/**
 * lib/ai.ts
 *
 * Весь код работы с AI-провайдером сосредоточен здесь.
 * Чтобы сменить модель — достаточно изменить одну константу MODEL.
 * Чтобы сменить провайдера — заменить ENDPOINT и заголовки в route.ts.
 *
 * ВАЖНО: этот файл импортируется как с сервера (route.ts),
 * так и с клиента (meal-plan/page.tsx — только типы и buildShoppingCart).
 * Функция callOpenRouter живёт только в route.ts и читает process.env
 * исключительно на сервере — ключ никогда не попадает в браузер.
 */

// ── Конфигурация (используется в route.ts) ───────────────────────────────

export const OPENROUTER_ENDPOINT = "https://openrouter.ai/api/v1/chat/completions";

// Меняйте только эту строку, чтобы переключиться на другую модель:
//export const MODEL = "z-ai/glm-4.5-air:free"; - долго, но точно
//export const MODEL = "openrouter/owl-alpha"; - средне, но неточно.
export const MODEL = "google/gemma-4-31b-it:free"

// ── Типы ──────────────────────────────────────────────────────────────────

export interface UserProfile {
  name?: string;
  goal?: string;
  calories?: number;
  protein?: number;
  fat?: number;
  carbs?: number;
  mealsPerDay?: number;
  allergies?: string[];
  favoriteFoods?: string[];
  excludedFoods?: string[];
  weight?: number;
  height?: number;
  age?: number;
  activityLevel?: string;
}

export interface MealIngredient {
  name: string;
  amount: number;
  unit: string; // "г" | "мл" | "шт" | "ст.л." | …
}

export interface Meal {
  type: string;    // "Завтрак" | "Обед" | "Ужин" | "Перекус"
  name: string;
  emoji: string;
  ingredients: MealIngredient[];
  kcal: number;
  protein: number;
  fat: number;
  carbs: number;
}

export interface DayRation {
  meals: Meal[];
  totals: {
    kcal: number;
    protein: number;
    fat: number;
    carbs: number;
  };
}

// ── Построение промптов (используется в route.ts) ─────────────────────────

export function buildSystemPrompt(): string {
  return `Ты — диетолог-нутрициолог. Твоя задача — составлять точные рационы питания.
Отвечай ТОЛЬКО валидным JSON-объектом без каких-либо пояснений, markdown-блоков или лишнего текста.
Структура ответа строго по схеме, которую предоставит пользователь. `;
}

export function buildUserPrompt(profile: UserProfile): string {
  const GOAL_LABELS: Record<string, string> = {
    loss:     "похудение (дефицит калорий)",
    maintain: "поддержание веса",
    gain:     "набор мышечной массы (профицит калорий)",
  };
  const ACTIVITY_LABELS: Record<string, string> = {
    sedentary:  "сидячий образ жизни",
    light:      "лёгкая активность",
    moderate:   "умеренная активность",
    active:     "высокая активность",
    very_active: "очень высокая активность",
  };

  const goal     = profile.goal          ? GOAL_LABELS[profile.goal]               ?? profile.goal          : "поддержание веса";
  const activity = profile.activityLevel ? ACTIVITY_LABELS[profile.activityLevel]  ?? profile.activityLevel : "умеренная активность";

  const lines = [
    `Составь рацион на ОДИН день. Количество приёмов пищи: ${profile.mealsPerDay ?? 3}.`,
    `Цель: ${goal}.`,
    profile.calories     ? `Суточная норма калорий: ${profile.calories} ккал.` : "",
    profile.protein      ? `Белки: ${profile.protein} г.`                      : "",
    profile.fat          ? `Жиры: ${profile.fat} г.`                           : "",
    profile.carbs        ? `Углеводы: ${profile.carbs} г.`                     : "",
    profile.allergies?.length
      ? `Аллергии и непереносимость (СТРОГО исключить): ${profile.allergies.join(", ")}.` : "",
    profile.excludedFoods?.length
      ? `Исключённые продукты: ${profile.excludedFoods.join(", ")}.`            : "",
    profile.favoriteFoods?.length
      ? `Предпочтительные продукты (использовать по возможности): ${profile.favoriteFoods.join(", ")}.` : "",
    profile.weight  ? `Вес пользователя: ${profile.weight} кг.`  : "",
    profile.height  ? `Рост: ${profile.height} см.`              : "",
    profile.age     ? `Возраст: ${profile.age} лет.`             : "",
    `Уровень активности: ${activity}.`,
  ].filter(Boolean);

  lines.push("");
  lines.push("Верни ТОЛЬКО JSON-объект следующей структуры (никаких комментариев, никакого markdown):");
  lines.push(`{
  "meals": [
    {
      "type": "Завтрак",
      "name": "Название блюда",
      "emoji": "🥣",
      "ingredients": [
        { "name": "Продукт", "amount": 100, "unit": "г" }
      ],
      "kcal": 400,
      "protein": 20,
      "fat": 10,
      "carbs": 50
    }
  ],
  "totals": {
    "kcal": 2000,
    "protein": 120,
    "fat": 60,
    "carbs": 250
  }
}`);

  return lines.join("\n");
}

// ── Пересчёт totals по факту ──────────────────────────────────────────────

/** Страховка: пересчитываем итог по реальным данным блюд, игнорируя totals от модели. */
export function recalcTotals(meals: Meal[]): DayRation["totals"] {
  return meals.reduce(
    (acc, m) => ({
      kcal:    acc.kcal    + (m.kcal    ?? 0),
      protein: acc.protein + (m.protein ?? 0),
      fat:     acc.fat     + (m.fat     ?? 0),
      carbs:   acc.carbs   + (m.carbs   ?? 0),
    }),
    { kcal: 0, protein: 0, fat: 0, carbs: 0 },
  );
}

// ── Утилита: сборка корзины (используется на клиенте) ────────────────────

export interface CartItem {
  name: string;
  entries: { amount: number; unit: string }[];
  totalAmount: number;
  unit: string;
}

/**
 * Собирает корзину из всех ингредиентов рациона.
 * Одинаковые продукты (по имени, без учёта регистра) объединяются.
 */
export function buildShoppingCart(ration: DayRation): CartItem[] {
  const map = new Map<string, CartItem>();

  for (const meal of ration.meals) {
    for (const ing of meal.ingredients) {
      const key = ing.name.toLowerCase().trim();
      if (!map.has(key)) {
        map.set(key, { name: ing.name, entries: [], totalAmount: 0, unit: ing.unit });
      }
      const item = map.get(key)!;
      item.entries.push({ amount: ing.amount, unit: ing.unit });
      item.totalAmount += ing.amount;
    }
  }

  return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name, "ru"));
}
