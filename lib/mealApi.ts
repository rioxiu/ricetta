import type { IngredientRow, MealCategory, MealDetail, MealSummary, SavedMeal } from "../types/meal";

const API_BASE = "https://www.themealdb.com/api/json/v1/1";
const SAVED_STORAGE_KEY = "ricetta_saved_meals_v2";

export async function fetchCategories(): Promise<MealCategory[]> {
  const res = await fetch(`${API_BASE}/categories.php`);
  if (!res.ok) throw new Error(`Gagal memuat kategori (HTTP ${res.status})`);
  const data: { categories: MealCategory[] | null } = await res.json();
  return data.categories ?? [];
}

export async function searchMeals(query: string): Promise<MealDetail[]> {
  const res = await fetch(`${API_BASE}/search.php?s=${encodeURIComponent(query.trim())}`);
  if (!res.ok) throw new Error(`Gagal mencari resep (HTTP ${res.status})`);
  const data: { meals: MealDetail[] | null } = await res.json();
  return data.meals ?? [];
}

export async function filterMealsByCategory(category: string): Promise<MealSummary[]> {
  const res = await fetch(`${API_BASE}/filter.php?c=${encodeURIComponent(category.trim())}`);
  if (!res.ok) throw new Error(`Gagal memuat kategori ${category} (HTTP ${res.status})`);
  const data: { meals: MealSummary[] | null } = await res.json();
  return (data.meals ?? []).map((m) => ({ ...m, strCategory: category }));
}

export async function fetchMealById(id: string): Promise<MealDetail | null> {
  const res = await fetch(`${API_BASE}/lookup.php?i=${encodeURIComponent(id.trim())}`);
  if (!res.ok) throw new Error(`Gagal memuat detail resep (HTTP ${res.status})`);
  const data: { meals: MealDetail[] | null } = await res.json();
  return data.meals?.[0] ?? null;
}

export async function fetchRandomMeal(): Promise<MealDetail | null> {
  const res = await fetch(`${API_BASE}/random.php`);
  if (!res.ok) throw new Error(`Gagal mengambil resep acak (HTTP ${res.status})`);
  const data: { meals: MealDetail[] | null } = await res.json();
  return data.meals?.[0] ?? null;
}

export function extractIngredients(meal: MealDetail): IngredientRow[] {
  const rows: IngredientRow[] = [];
  for (let i = 1; i <= 20; i += 1) {
    const ing = String(meal[`strIngredient${i}`] ?? "").trim();
    const meas = String(meal[`strMeasure${i}`] ?? "").trim();
    if (ing) {
      rows.push({ ingredient: ing, measure: meas || "Secukupnya" });
    }
  }
  return rows;
}

export function parseInstructionSteps(raw: string): string[] {
  return String(raw || "")
    .split(/\r?\n+/)
    .map((line) => line.replace(/^\d+[\.)]\s*/, "").trim())
    .filter((line) => line.length > 3);
}

export function readSavedMeals(): SavedMeal[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(SAVED_STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as SavedMeal[]) : [];
  } catch {
    return [];
  }
}

export function writeSavedMeals(items: SavedMeal[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(SAVED_STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event("ricetta-saved-change"));
  } catch {
    // ignore quota errors
  }
}

export function toggleSavedMeal(meal: MealSummary): { saved: boolean; list: SavedMeal[] } {
  const current = readSavedMeals();
  const exists = current.some((m) => m.idMeal === meal.idMeal);
  const next = exists
    ? current.filter((m) => m.idMeal !== meal.idMeal)
    : [
        {
          idMeal: meal.idMeal,
          strMeal: meal.strMeal,
          strMealThumb: meal.strMealThumb,
          strCategory: meal.strCategory,
          strArea: meal.strArea,
          savedAt: new Date().toISOString(),
        },
        ...current,
      ];
  writeSavedMeals(next);
  return { saved: !exists, list: next };
}
