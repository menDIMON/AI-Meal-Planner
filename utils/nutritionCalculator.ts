import type { ProfileData } from "../app/profile/edit/page";

// Коэффициенты активности (Mifflin-St Jeor)
const ACTIVITY_MULTIPLIERS: Record<string, number> = {
  sedentary:  1.2,
  light:      1.375,
  moderate:   1.55,
  active:     1.725,
  very_active: 1.9,
};

export interface NutritionResult {
  bmr:      number;
  tdee:     number;
  calories: number;
  protein:  number; // г
  fats:     number; // г
  carbs:    number; // г
}

/** BMR по формуле Mifflin-St Jeor */
export function calculateBMR(
  weight: number,
  height: number,
  age: number,
  gender: string
): number {
  const base = 10 * weight + 6.25 * height - 5 * age;
  return gender === "female" ? base - 161 : base + 5;
}

/**
 * Главная функция расчёта КБЖУ.
 *
 * Макронутриенты считаются от фактического веса:
 *   Похудение  : белок 2.2 г/кг, жир 0.9 г/кг, калории = TDEE − 20 %
 *   Поддержание: белок 2.0 г/кг, жир 1.0 г/кг, калории = TDEE
 *   Набор массы: белок 2.2 г/кг, жир 1.0 г/кг, калории = TDEE + 10 %
 *
 * Углеводы — остаток калорий после белков и жиров.
 */
export function calculateNutrition(profile: ProfileData): NutritionResult | null {
  const weight = parseFloat(profile.weight);
  const height = parseFloat(profile.height);
  const age    = parseFloat(profile.age);
  const gender        = profile.gender        || "male";
  const activityLevel = profile.activityLevel || "moderate";
  const goal          = profile.goal          || "maintain";

  if (!weight || !height || !age) return null;

  // ── BMR & TDEE ──────────────────────────────────────────────────────────────
  const bmr        = calculateBMR(weight, height, age, gender);
  const multiplier = ACTIVITY_MULTIPLIERS[activityLevel] ?? 1.55;
  const tdee       = bmr * multiplier;

  // ── Целевые калории ─────────────────────────────────────────────────────────
  const calorieFactors: Record<string, number> = {
    loss:     0.80,  // −20 %
    maintain: 1.00,
    gain:     1.10,  // +10 %
  };
  const calories = Math.round(tdee * (calorieFactors[goal] ?? 1.0));

  // ── Белки и жиры от фактического веса ───────────────────────────────────────
  const proteinPerKg = goal === "maintain" ? 2.0 : 2.4;
  const fatPerKg     = goal === "loss"     ? 1.1 : 1.3;

  const protein = Math.round(weight * proteinPerKg);
  const fats    = Math.round(weight * fatPerKg);

  // ── Углеводы по остаточному принципу ────────────────────────────────────────
  const carbCals = calories - protein * 4 - fats * 9;
  const carbs    = Math.max(0, Math.round(carbCals / 4));

  return {
    bmr:      Math.round(bmr),
    tdee:     Math.round(tdee),
    calories,
    protein,
    fats,
    carbs,
  };
}

/**
 * Читает профиль из localStorage и возвращает расчёт.
 * Вызывать только на клиенте.
 */
export function getNutritionFromStorage(): NutritionResult | null {
  try {
    const stored = localStorage.getItem("nutri_profile");
    if (!stored) return null;
    const profile: ProfileData = JSON.parse(stored);
    return calculateNutrition(profile);
  } catch {
    return null;
  }
}
