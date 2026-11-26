import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import MealCard from "../../components/MealCard";
import {
  fetchCategories,
  filterMealsByCategory,
  readSavedMeals,
  searchMeals,
  toggleSavedMeal,
} from "../../lib/mealApi";
import type { MealCategory, MealSummary } from "../../types/meal";

export default function MealsPage() {
  const router = useRouter();
  const [searchInput, setSearchInput] = useState<string>("");
  const [activeCategory, setActiveCategory] = useState<string>("Beef");
  const [categories, setCategories] = useState<MealCategory[]>([]);
  const [meals, setMeals] = useState<MealSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    setSavedIds(new Set(readSavedMeals().map((m) => m.idMeal)));
    fetchCategories()
      .then((cats) => setCategories(cats))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!router.isReady) return;
    const qParam = typeof router.query.q === "string" ? router.query.q.trim() : "";
    const catParam = typeof router.query.category === "string" ? router.query.category.trim() : "";

    let cancelled = false;
    async function loadMeals() {
      setLoading(true);
      setErrorMsg("");
      try {
        if (qParam) {
          setSearchInput(qParam);
          setActiveCategory("");
          const found = await searchMeals(qParam);
          if (!cancelled) setMeals(found);
        } else {
          const targetCat = catParam || "Beef";
          setActiveCategory(targetCat);
          setSearchInput("");
          const found = await filterMealsByCategory(targetCat);
          if (!cancelled) setMeals(found);
        }
      } catch (err) {
        if (!cancelled) {
          setErrorMsg(err instanceof Error ? err.message : "Gagal memuat daftar resep.");
          setMeals([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    loadMeals();
    return () => {
      cancelled = true;
    };
  }, [router.isReady, router.query.q, router.query.category]);

  const handleSubmitSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const clean = searchInput.trim();
    if (clean) {
      router.push(`/meals?q=${encodeURIComponent(clean)}`);
    } else {
      router.push("/meals?category=Beef");
    }
  };

  const handleSelectCategory = (cat: string) => {
    router.push(`/meals?category=${encodeURIComponent(cat)}`);
  };

  const handleToggleSave = (meal: MealSummary) => {
    const res = toggleSavedMeal(meal);
    setSavedIds(new Set(res.list.map((m) => m.idMeal)));
  };

  return (
    <Layout title="Jelajahi Resep | Ricetta">
      <section className="border-b py-10" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-5">
          <div>
            <p className="font-measure text-xs uppercase tracking-[0.14em]" style={{ color: "var(--ochre)" }}>
              Katalog Resep
            </p>
            <h1 className="font-cookbook text-3xl sm:text-4xl font-bold m-0 mt-1">Jelajahi Hidangan Dunia</h1>
          </div>

          <form onSubmit={handleSubmitSearch} className="flex flex-col sm:flex-row gap-2.5 max-w-2xl">
            <label htmlFor="mealsSearch" className="sr-only">
              Kata kunci resep
            </label>
            <input
              id="mealsSearch"
              type="search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Ketik nama makanan atau bahan (mis. Lasagna, Curry, Soup)"
              className="flex-1 px-4 min-h-[46px] rounded-md border text-sm sm:text-base"
              style={{
                backgroundColor: "var(--bg-ground)",
                borderColor: "var(--border-strong)",
                color: "var(--text-primary)",
              }}
            />
            <button type="submit" className="btn-olive px-6 min-h-[46px] rounded-md text-sm font-semibold">
              Cari
            </button>
          </form>

          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1" role="group" aria-label="Filter kategori">
              {categories.map((cat) => {
                const selected = activeCategory === cat.strCategory;
                return (
                  <button
                    key={cat.idCategory}
                    type="button"
                    onClick={() => handleSelectCategory(cat.strCategory)}
                    aria-pressed={selected}
                    className="px-3.5 py-2 min-h-[40px] rounded-md text-xs sm:text-sm font-medium border transition-colors"
                    style={
                      selected
                        ? {
                            backgroundColor: "var(--olive)",
                            color: "var(--olive-text-on)",
                            borderColor: "var(--olive)",
                          }
                        : {
                            backgroundColor: "var(--bg-ground)",
                            color: "var(--text-secondary)",
                            borderColor: "var(--border)",
                          }
                    }
                  >
                    {cat.strCategory}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section className="py-10 sm:py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {loading ? (
            <div className="space-y-4">
              <p className="font-measure text-xs" style={{ color: "var(--text-muted)" }}>
                Memuat daftar resep...
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-72 rounded-lg border animate-pulse"
                    style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elevated)" }}
                  />
                ))}
              </div>
            </div>
          ) : errorMsg ? (
            <div
              className="rounded-lg border p-8 text-center space-y-4"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}
            >
              <p className="text-sm m-0" style={{ color: "var(--text-primary)" }}>
                {errorMsg}
              </p>
              <button
                type="button"
                onClick={() => router.reload()}
                className="btn-olive px-5 min-h-[44px] rounded-md text-sm font-semibold"
              >
                Coba Muat Ulang
              </button>
            </div>
          ) : meals.length === 0 ? (
            <div
              className="rounded-lg border p-8 text-center space-y-4"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}
            >
              <p className="text-base font-semibold m-0">Resep tidak ditemukan.</p>
              <p className="text-sm m-0" style={{ color: "var(--text-secondary)" }}>
                Coba kata kunci bahasa Inggris singkat seperti Chicken, Pasta, Fish, atau pilih kategori lain.
              </p>
              <button
                type="button"
                onClick={() => router.push("/meals?category=Beef")}
                className="btn-parchment px-5 min-h-[44px] rounded-md text-sm font-semibold"
              >
                Reset ke Kategori Beef
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              <p className="font-measure text-xs" style={{ color: "var(--text-muted)" }}>
                Menampilkan {meals.length} resep
                {activeCategory ? ` · Kategori ${activeCategory}` : ""}
                {typeof router.query.q === "string" && router.query.q ? ` · Pencarian "${router.query.q}"` : ""}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {meals.map((meal, idx) => (
                  <MealCard
                    key={meal.idMeal}
                    meal={meal}
                    isSaved={savedIds.has(meal.idMeal)}
                    onToggleSave={handleToggleSave}
                    priority={idx < 3}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
