import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Layout from "../components/Layout";
import MealCard from "../components/MealCard";
import {
  fetchCategories,
  fetchRandomMeal,
  readSavedMeals,
  searchMeals,
  toggleSavedMeal,
} from "../lib/mealApi";
import type { MealCategory, MealDetail, MealSummary } from "../types/meal";

export default function HomePage() {
  const router = useRouter();
  const [query, setQuery] = useState<string>("");
  const [categories, setCategories] = useState<MealCategory[]>([]);
  const [featured, setFeatured] = useState<MealDetail[]>([]);
  const [randomMeal, setRandomMeal] = useState<MealDetail | null>(null);
  const [loadingInit, setLoadingInit] = useState<boolean>(true);
  const [loadingRandom, setLoadingRandom] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  const refreshSavedIds = () => {
    setSavedIds(new Set(readSavedMeals().map((m) => m.idMeal)));
  };

  useEffect(() => {
    refreshSavedIds();
    let active = true;
    async function loadHome() {
      setLoadingInit(true);
      setErrorMsg("");
      try {
        const [cats, picks, rand] = await Promise.all([
          fetchCategories(),
          searchMeals("Chicken"),
          fetchRandomMeal(),
        ]);
        if (!active) return;
        setCategories(cats.slice(0, 8));
        setFeatured(picks.slice(0, 6));
        setRandomMeal(rand);
      } catch (err) {
        if (!active) return;
        setErrorMsg(err instanceof Error ? err.message : "Gagal memuat resep dari TheMealDB.");
      } finally {
        if (active) setLoadingInit(false);
      }
    }
    loadHome();
    return () => {
      active = false;
    };
  }, []);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = query.trim();
    router.push(trimmed ? `/meals?q=${encodeURIComponent(trimmed)}` : "/meals");
  };

  const handlePickRandom = async () => {
    setLoadingRandom(true);
    try {
      const meal = await fetchRandomMeal();
      if (meal) setRandomMeal(meal);
    } catch {
      // keep previous random meal
    } finally {
      setLoadingRandom(false);
    }
  };

  const handleToggleSave = (meal: MealSummary) => {
    const res = toggleSavedMeal(meal);
    setSavedIds(new Set(res.list.map((m) => m.idMeal)));
  };

  return (
    <Layout>
      {/* HERO SPREAD */}
      <section className="border-b py-10 sm:py-16" style={{ borderColor: "var(--border)" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <p className="font-measure text-xs uppercase tracking-[0.16em]" style={{ color: "var(--ochre)" }}>
              Osteria Cookbook · TheMealDB Live
            </p>
            <h1
              className="font-cookbook text-4xl sm:text-5xl font-bold leading-[1.12] tracking-tight"
              style={{ color: "var(--text-primary)" }}
            >
              Temukan resep masakan dunia yang jelas takarannya dan mudah diikuti.
            </h1>
            <p className="text-base sm:text-lg leading-relaxed max-w-xl" style={{ color: "var(--text-secondary)" }}>
              Cari ratusan hidangan berdasarkan nama bahan atau kategori, centang bahan saat memasak, lalu simpan favorit kamu langsung di browser.
            </p>

            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2.5 max-w-xl">
              <label htmlFor="homeSearch" className="sr-only">
                Cari resep masakan
              </label>
              <input
                id="homeSearch"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari hidangan (mis. Pasta, Rendang, Curry, Salmon)"
                className="flex-1 px-4 min-h-[48px] rounded-md border text-sm sm:text-base"
                style={{
                  backgroundColor: "var(--bg-surface)",
                  borderColor: "var(--border-strong)",
                  color: "var(--text-primary)",
                }}
              />
              <button
                type="submit"
                className="btn-olive px-6 min-h-[48px] rounded-md text-sm font-semibold whitespace-nowrap"
              >
                Cari Resep
              </button>
            </form>

            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs font-measure">
              <span style={{ color: "var(--text-muted)" }}>Pencarian cepat:</span>
              {["Pasta", "Beef", "Seafood", "Dessert", "Vegetarian"].map((tag) => (
                <Link
                  key={tag}
                  href={`/meals?category=${encodeURIComponent(tag)}`}
                  className="px-2.5 py-1.5 rounded border hover:underline"
                  style={{
                    backgroundColor: "var(--bg-surface)",
                    borderColor: "var(--border)",
                    color: "var(--text-secondary)",
                  }}
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5">
            <div
              className="rounded-xl overflow-hidden border p-2.5"
              style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border)" }}
            >
              <div className="w-full aspect-[4/3] overflow-hidden rounded-lg">
                <img
                  src="/food-home.jpg"
                  alt="Hidangan meja makan klasik Ricetta"
                  width={3571}
                  height={5356}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RANDOM CHEF SUGGESTION */}
      {randomMeal && (
        <section className="border-b py-12" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <p className="font-measure text-xs uppercase tracking-[0.14em]" style={{ color: "var(--ochre)" }}>
                  Inspirasi Dapur Hari Ini
                </p>
                <h2 className="font-cookbook text-2xl sm:text-3xl font-bold m-0 mt-1">
                  Bingung mau masak apa?
                </h2>
              </div>
              <button
                type="button"
                onClick={handlePickRandom}
                disabled={loadingRandom}
                className="btn-parchment px-4 min-h-[44px] rounded-md text-sm font-semibold self-start sm:self-auto"
              >
                {loadingRandom ? "Mengacak resep..." : "Acak Resep Lain"}
              </button>
            </div>

            <div
              className="rounded-xl border overflow-hidden grid grid-cols-1 md:grid-cols-12"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-ground)" }}
            >
              <div className="md:col-span-5 aspect-[16/10] md:aspect-auto">
                <img
                  src={randomMeal.strMealThumb}
                  alt={randomMeal.strMeal}
                  width={600}
                  height={450}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between gap-4">
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2 font-measure text-xs uppercase">
                    {randomMeal.strCategory && (
                      <span className="px-2.5 py-0.5 rounded" style={{ backgroundColor: "var(--ochre-subtle)", color: "var(--ochre)" }}>
                        {randomMeal.strCategory}
                      </span>
                    )}
                    {randomMeal.strArea && <span style={{ color: "var(--text-muted)" }}>{randomMeal.strArea}</span>}
                  </div>
                  <h3 className="font-cookbook text-2xl sm:text-3xl font-bold m-0">{randomMeal.strMeal}</h3>
                  <p className="text-sm sm:text-base leading-relaxed line-clamp-3" style={{ color: "var(--text-secondary)" }}>
                    {randomMeal.strInstructions}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Link
                    href={`/meals/${randomMeal.idMeal}`}
                    className="btn-olive px-5 min-h-[44px] rounded-md text-sm font-semibold inline-flex items-center"
                  >
                    Lihat Bahan &amp; Langkah
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleToggleSave(randomMeal)}
                    className="btn-parchment px-4 min-h-[44px] rounded-md text-sm font-semibold"
                  >
                    {savedIds.has(randomMeal.idMeal) ? "Sudah Tersimpan" : "Simpan ke Buku Resep"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CATEGORIES */}
      <section className="border-b py-12 sm:py-16" style={{ borderColor: "var(--border)" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="font-cookbook text-2xl sm:text-3xl font-bold m-0">Kategori Hidangan</h2>
              <p className="text-sm mt-1 m-0" style={{ color: "var(--text-secondary)" }}>
                Pilih kategori untuk menyaring resep langsung dari TheMealDB.
              </p>
            </div>
            <Link href="/meals" className="text-sm font-semibold underline underline-offset-4" style={{ color: "var(--olive)" }}>
              Lihat Semua
            </Link>
          </div>

          {errorMsg ? (
            <div className="rounded-lg border p-6 text-sm" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
              {errorMsg}
            </div>
          ) : loadingInit ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-24 rounded-lg border animate-pulse" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elevated)" }} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {categories.map((cat) => (
                <Link
                  key={cat.idCategory}
                  href={`/meals?category=${encodeURIComponent(cat.strCategory)}`}
                  className="meal-card rounded-lg p-4 flex items-center gap-3 no-underline"
                >
                  <img
                    src={cat.strCategoryThumb}
                    alt={cat.strCategory}
                    width={56}
                    height={56}
                    loading="lazy"
                    className="w-14 h-14 object-contain shrink-0"
                  />
                  <span className="font-semibold text-sm sm:text-base" style={{ color: "var(--text-primary)" }}>
                    {cat.strCategory}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* FEATURED RECIPES */}
      <section className="py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="font-cookbook text-2xl sm:text-3xl font-bold m-0">Pilihan Populer</h2>
              <p className="text-sm mt-1 m-0" style={{ color: "var(--text-secondary)" }}>
                Hidangan favorit yang paling sering dicari di katalog Ricetta.
              </p>
            </div>
            <Link href="/meals" className="text-sm font-semibold underline underline-offset-4" style={{ color: "var(--olive)" }}>
              Jelajahi Katalog
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((meal, idx) => (
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
      </section>
    </Layout>
  );
}
