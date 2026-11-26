import React, { useEffect, useState } from "react";
import Link from "next/link";
import Layout from "../components/Layout";
import MealCard from "../components/MealCard";
import { readSavedMeals, toggleSavedMeal, writeSavedMeals } from "../lib/mealApi";
import type { MealSummary, SavedMeal } from "../types/meal";

export default function SavedMealsPage() {
  const [saved, setSaved] = useState<SavedMeal[]>([]);

  useEffect(() => {
    setSaved(readSavedMeals());
  }, []);

  const handleToggle = (meal: MealSummary) => {
    const res = toggleSavedMeal(meal);
    setSaved(res.list);
  };

  const handleClearAll = () => {
    writeSavedMeals([]);
    setSaved([]);
  };

  return (
    <Layout title="Resep Tersimpan | Ricetta">
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b pb-5" style={{ borderColor: "var(--border)" }}>
          <div>
            <p className="font-measure text-xs uppercase tracking-[0.14em]" style={{ color: "var(--ochre)" }}>
              Buku Resep Pribadi
            </p>
            <h1 className="font-cookbook text-3xl sm:text-4xl font-bold m-0 mt-1">Resep Tersimpan</h1>
          </div>

          {saved.length > 0 && (
            <button
              type="button"
              onClick={handleClearAll}
              className="btn-parchment px-4 min-h-[42px] rounded-md text-xs font-semibold self-start sm:self-auto"
            >
              Kosongkan Semua ({saved.length})
            </button>
          )}
        </div>

        {saved.length === 0 ? (
          <div
            className="rounded-xl border p-10 text-center space-y-4"
            style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}
          >
            <h2 className="font-cookbook text-2xl font-bold m-0">Belum ada resep yang disimpan.</h2>
            <p className="text-sm max-w-md mx-auto m-0" style={{ color: "var(--text-secondary)" }}>
              Klik tombol Simpan pada kartu atau halaman detail resep agar tersimpan otomatis di perangkat ini.
            </p>
            <div>
              <Link
                href="/meals"
                className="btn-olive px-5 py-2.5 min-h-[44px] rounded-md text-sm font-semibold inline-flex items-center"
              >
                Jelajahi Katalog Resep
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {saved.map((meal) => (
              <MealCard
                key={meal.idMeal}
                meal={meal}
                isSaved={true}
                onToggleSave={handleToggle}
              />
            ))}
          </div>
        )}
      </section>
    </Layout>
  );
}
