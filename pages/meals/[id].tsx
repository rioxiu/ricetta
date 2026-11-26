import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import {
  extractIngredients,
  fetchMealById,
  parseInstructionSteps,
  readSavedMeals,
  toggleSavedMeal,
} from "../../lib/mealApi";
import type { MealDetail } from "../../types/meal";

export default function MealDetailPage() {
  const router = useRouter();
  const [meal, setMeal] = useState<MealDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [checkedIngredients, setCheckedIngredients] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (!router.isReady) return;
    const id = typeof router.query.id === "string" ? router.query.id : "";
    if (!id) return;

    let cancelled = false;
    async function load() {
      setLoading(true);
      setErrorMsg("");
      try {
        const data = await fetchMealById(id);
        if (!cancelled) {
          setMeal(data);
          if (data) {
            setIsSaved(readSavedMeals().some((m) => m.idMeal === data.idMeal));
          }
        }
      } catch (err) {
        if (!cancelled) {
          setErrorMsg(err instanceof Error ? err.message : "Gagal memuat resep.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [router.isReady, router.query.id]);

  const handleToggleIngredient = (idx: number) => {
    setCheckedIngredients((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const handleSave = () => {
    if (!meal) return;
    const res = toggleSavedMeal(meal);
    setIsSaved(res.saved);
  };

  const ingredients = meal ? extractIngredients(meal) : [];
  const steps = meal ? parseInstructionSteps(meal.strInstructions) : [];

  return (
    <Layout title={meal ? `${meal.strMeal} | Ricetta` : "Detail Resep | Ricetta"}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="mb-6 no-print">
          <Link
            href="/meals"
            className="text-sm font-semibold underline underline-offset-4 min-h-[40px] inline-flex items-center"
            style={{ color: "var(--olive)" }}
          >
            &larr; Kembali ke Katalog Resep
          </Link>
        </div>

        {loading ? (
          <div className="space-y-4">
            <p className="font-measure text-xs" style={{ color: "var(--text-muted)" }}>
              Memuat detail resep...
            </p>
            <div className="h-96 rounded-xl border animate-pulse" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elevated)" }} />
          </div>
        ) : errorMsg || !meal ? (
          <div
            className="rounded-xl border p-8 text-center space-y-4"
            style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}
          >
            <p className="text-base font-semibold m-0">{errorMsg || "Resep tidak ditemukan."}</p>
            <Link href="/meals" className="btn-olive px-5 py-2.5 min-h-[44px] rounded-md text-sm font-semibold inline-flex items-center">
              Jelajahi Resep Lain
            </Link>
          </div>
        ) : (
          <article className="space-y-10">
            {/* Header & Photo */}
            <div
              className="rounded-xl border overflow-hidden grid grid-cols-1 lg:grid-cols-12"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}
            >
              <div className="lg:col-span-5 aspect-[4/3] lg:aspect-auto">
                <img
                  src={meal.strMealThumb}
                  alt={meal.strMeal}
                  width={700}
                  height={525}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between gap-6">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2 font-measure text-xs uppercase">
                    {meal.strCategory && (
                      <span className="px-2.5 py-0.5 rounded" style={{ backgroundColor: "var(--ochre-subtle)", color: "var(--ochre)" }}>
                        {meal.strCategory}
                      </span>
                    )}
                    {meal.strArea && <span style={{ color: "var(--text-muted)" }}>{meal.strArea}</span>}
                    <span style={{ color: "var(--text-muted)" }}>· {ingredients.length} bahan</span>
                  </div>

                  <h1 className="font-cookbook text-3xl sm:text-4xl font-bold m-0 leading-tight">
                    {meal.strMeal}
                  </h1>
                </div>

                <div className="flex flex-wrap items-center gap-3 no-print">
                  <button
                    type="button"
                    onClick={handleSave}
                    aria-pressed={isSaved}
                    className="btn-olive px-5 min-h-[44px] rounded-md text-sm font-semibold inline-flex items-center gap-2"
                  >
                    <span>{isSaved ? "Tersimpan di Buku Resep" : "Simpan Resep"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="btn-parchment px-4 min-h-[44px] rounded-md text-sm font-semibold"
                  >
                    Cetak Resep
                  </button>

                  {meal.strYoutube && meal.strYoutube.startsWith("http") && (
                    <a
                      href={meal.strYoutube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-parchment px-4 min-h-[44px] rounded-md text-sm font-semibold inline-flex items-center"
                    >
                      Tonton Video ↗
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Cookbook Spread: Ingredients Checklist + Steps */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <section
                className="lg:col-span-5 rounded-xl border p-6 space-y-4 lg:sticky lg:top-24"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}
                aria-labelledby="ingredients-heading"
              >
                <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: "var(--border)" }}>
                  <h2 id="ingredients-heading" className="font-cookbook text-2xl font-bold m-0">
                    Bahan &amp; Takaran
                  </h2>
                  <span className="font-measure text-xs" style={{ color: "var(--text-muted)" }}>
                    {checkedIngredients.size}/{ingredients.length}
                  </span>
                </div>

                <ul className="divide-y list-none p-0 m-0" style={{ borderColor: "var(--border)" }}>
                  {ingredients.map((row, idx) => {
                    const done = checkedIngredients.has(idx);
                    return (
                      <li key={`${row.ingredient}-${idx}`} className="py-2.5" style={{ borderColor: "var(--border)" }}>
                        <label className="flex items-center justify-between gap-3 text-sm min-h-[36px]">
                          <span className="flex items-center gap-2.5">
                            <input
                              type="checkbox"
                              checked={done}
                              onChange={() => handleToggleIngredient(idx)}
                              className="w-4 h-4 accent-emerald-800"
                            />
                            <span
                              style={{
                                textDecoration: done ? "line-through" : "none",
                                color: done ? "var(--text-muted)" : "var(--text-primary)",
                              }}
                            >
                              {row.ingredient}
                            </span>
                          </span>
                          <span className="font-measure text-xs shrink-0" style={{ color: "var(--ochre)" }}>
                            {row.measure}
                          </span>
                        </label>
                      </li>
                    );
                  })}
                </ul>
              </section>

              <section
                className="lg:col-span-7 rounded-xl border p-6 sm:p-8 space-y-5"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}
                aria-labelledby="steps-heading"
              >
                <h2 id="steps-heading" className="font-cookbook text-2xl font-bold m-0 border-b pb-3" style={{ borderColor: "var(--border)" }}>
                  Langkah Memasak
                </h2>

                <ol className="space-y-5 list-none p-0 m-0">
                  {steps.map((step, idx) => (
                    <li key={idx} className="grid grid-cols-[36px_1fr] gap-3 items-start">
                      <span
                        className="font-measure text-xs font-semibold w-8 h-8 rounded-md flex items-center justify-center"
                        style={{ backgroundColor: "var(--olive-subtle)", color: "var(--olive)" }}
                      >
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <p className="m-0 text-sm sm:text-base leading-[1.75]" style={{ color: "var(--text-secondary)" }}>
                        {step}
                      </p>
                    </li>
                  ))}
                </ol>
              </section>
            </div>
          </article>
        )}
      </div>
    </Layout>
  );
}
