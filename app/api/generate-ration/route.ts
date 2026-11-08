/**
 * app/api/generate-ration/route.ts
 *
 * Server-only API route. Ключ OPENROUTER_API_KEY живёт исключительно здесь —
 * в браузер он никогда не попадает. Клиент делает fetch на /api/generate-ration,
 * не зная ничего о внешнем провайдере.
 */

import { NextRequest, NextResponse } from "next/server";
import {
  OPENROUTER_ENDPOINT,
  MODEL,
  buildSystemPrompt,
  buildUserPrompt,
  recalcTotals,
} from "@/lib/ai";
import type { UserProfile, DayRation } from "@/lib/ai";

export async function POST(req: NextRequest) {
  // ── 1. Читаем ключ только на сервере ─────────────────────────────────
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "OPENROUTER_API_KEY не задан в переменных окружения" },
      { status: 500 },
    );
  }

  // ── 2. Получаем профиль из тела запроса ──────────────────────────────
  let profile: UserProfile;
  try {
    profile = await req.json();
  } catch {
    return NextResponse.json({ error: "Невалидный JSON в теле запроса" }, { status: 400 });
  }

  // ── 3. Запрос к OpenRouter ────────────────────────────────────────────
  let openRouterRes: Response;
  try {
    openRouterRes = await fetch(OPENROUTER_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "HTTP-Referer": "https://nutri.app",
        "X-Title": "NutriFlow",
      },
      body: JSON.stringify({
        model: MODEL,
        temperature: 0.7,
        messages: [
          { role: "system", content: buildSystemPrompt() },
          { role: "user",   content: buildUserPrompt(profile) },
        ],
      }),
    });
  } catch (e) {
    return NextResponse.json(
      { error: `Не удалось подключиться к OpenRouter: ${String(e)}` },
      { status: 502 },
    );
  }

  if (!openRouterRes.ok) {
    const body = await openRouterRes.text();
    return NextResponse.json(
      { error: `OpenRouter вернул ${openRouterRes.status}: ${body}` },
      { status: 502 },
    );
  }

  // ── 4. Парсим ответ модели ────────────────────────────────────────────
  const data = await openRouterRes.json();
  const raw: string = data.choices?.[0]?.message?.content ?? "";

  const cleaned = raw
    .replace(/```json\s*/gi, "")
    .replace(/```\s*/g, "")
    .trim();

  console.log("===== RAW AI RESPONSE =====");
  console.log(raw);
  console.log("===========================");

  let parsed: DayRation;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    return NextResponse.json(
      { error: `Модель вернула невалидный JSON: ${cleaned.slice(0, 300)}` },
      { status: 502 },
    );
  }

  // ── 5. Пересчитываем totals по факту и отдаём клиенту ────────────────
  parsed.totals = recalcTotals(parsed.meals);

  return NextResponse.json(parsed);
}
