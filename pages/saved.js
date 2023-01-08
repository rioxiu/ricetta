import { useQueries } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { getSingleMeal } from "./meals/[id]";
import { BeatLoader } from "react-spinners";
import Link from "next/link";
const Saved = () => {
  const [savedMealsId, setSavedMealsId] = useState([]);

  const queries = savedMealsId.map((id) => ({
    queryKey: ["singleMeal", id],
    queryFn: getSingleMeal,
  }));

  const result = useQueries({ queries });

  useEffect(() => {
    if (localStorage.getItem("savedMeals")) {
      setSavedMealsId(JSON.parse(localStorage.getItem("savedMeals")));
    }
  }, []);

  return (
    <div className="mx-10 flex flex-col gap-10 my-10">
      <h1 className="text-3xl font-extrabold text-teal-500">
        My Saved Meal List
      </h1>
      <div className="grid grid-cols-4 mx-10 gap-10 ">
        {savedMealsId.length <= 0 && <p>You have no saved meals</p>}
        {result &&
          result.map(({ data, isLoading }, index) => {
            if (isLoading) {
              return (
                <BeatLoader
                  key={savedMealsId[[index]]}
                  color="#fff"
                  loading={isLoading}
                  size={20}
                />
              );
            }

            return (
              <div
                className="bg-slate-800 p-2 rounded-lg"
                key={savedMealsId[[index]]}
              >
                <Link
                  legacyBehavior
                  href={`/meals/${data.idMeal}`}
                  key={data.idMeal}
                >
                  <div className="flex flex-col gap-3 justify-start ">
                    <h3 className="text-lg text-cyan-800 text-center">
                      {data.strMeal}
                    </h3>
                    <p className="text-md">📌 Category : {data.strCategory}</p>
                    <p className="text-md">🧷 Tags : {data.strArea}</p>
                  </div>
                </Link>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Saved;
