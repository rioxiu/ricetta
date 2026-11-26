import React from "react";
import Link from "next/link";
import type { MealSummary } from "../types/meal";

interface MealCardProps {
  meal: MealSummary;
  isSaved: boolean;
  onToggleSave: (meal: MealSummary) => void;
  priority?: boolean;
}

export default function MealCard({ meal, isSaved, onToggleSave, priority = false }: MealCardProps) {
  return (
    <article className="meal-card rounded-lg overflow-hidden flex flex-col justify-between">
      <div>
        <Link href={`/meals/${meal.idMeal}`} className="block overflow-hidden border-b" style={{ borderColor: "var(--border)" }}>
          <div className="w-full aspect-[4/3] overflow-hidden" style={{ backgroundColor: "var(--bg-elevated)" }}>
            <img
              src={meal.strMealThumb}
              alt={meal.strMeal}
              width={600}
              height={450}
              loading={priority ? undefined : "lazy"}
              className="w-full h-full object-cover transition-transform duration-200 hover:scale-[1.03]"
            />
          </div>
        </Link>

        <div className="p-4 sm:p-5 space-y-2.5">
          {(meal.strCategory || meal.strArea) && (
            <div className="flex flex-wrap items-center gap-2 font-measure text-[11px] uppercase tracking-wider">
              {meal.strCategory && (
                <span
                  className="px-2 py-0.5 rounded"
                  style={{ backgroundColor: "var(--ochre-subtle)", color: "var(--ochre)" }}
                >
                  {meal.strCategory}
                </span>
              )}
              {meal.strArea && <span style={{ color: "var(--text-muted)" }}>{meal.strArea}</span>}
            </div>
          )}

          <h3 className="font-cookbook text-lg font-bold leading-snug m-0">
            <Link
              href={`/meals/${meal.idMeal}`}
              className="hover:underline"
              style={{ color: "var(--text-primary)" }}
            >
              {meal.strMeal}
            </Link>
          </h3>
        </div>
      </div>

      <div
        className="px-4 sm:px-5 py-3 border-t flex items-center justify-between gap-2"
        style={{ borderColor: "var(--border)" }}
      >
        <Link
          href={`/meals/${meal.idMeal}`}
          className="text-sm font-semibold underline underline-offset-4 min-h-[40px] inline-flex items-center"
          style={{ color: "var(--olive)" }}
        >
          Baca Resep
        </Link>

        <button
          type="button"
          onClick={() => onToggleSave(meal)}
          aria-pressed={isSaved}
          aria-label={isSaved ? `Hapus ${meal.strMeal} dari tersimpan` : `Simpan ${meal.strMeal}`}
          className="btn-parchment px-3 min-h-[40px] rounded-md text-xs font-semibold inline-flex items-center gap-1.5"
          style={
            isSaved
              ? {
                  backgroundColor: "var(--olive-subtle)",
                  borderColor: "var(--olive)",
                  color: "var(--olive)",
                }
              : undefined
          }
        >
          <svg
            viewBox="0 0 18 18"
            width="14"
            height="14"
            fill={isSaved ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="1.7"
            aria-hidden="true"
          >
            <path d="M4 2.5h10v13l-5-3.4L4 15.5v-13Z" strokeLinejoin="round" />
          </svg>
          <span>{isSaved ? "Tersimpan" : "Simpan"}</span>
        </button>
      </div>
    </article>
  );
}
