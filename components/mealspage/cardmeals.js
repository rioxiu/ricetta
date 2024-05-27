import Image from "next/image";
import Link from "next/link";
import React from "react";

const CardMeals = ({ meal }) => {
  const loaderImg = ({ src }) => {
    return meal.strMealThumb;
  };
  return (
    <>
      <Link
        className="flex items-center justify-center"
        id="link"
        href={`/meals/${meal.idMeal}`}
      >
        <div className="flex flex-col items-center justify-center text-center h-72 w-72 rounded-xl bg-slate-900">
          <Image
            className="rounded-lg"
            loader={() => meal.strMealThumb}
            src={meal.strMealThumb}
            height={"200"}
            unoptimized={true}
            width={"200"}
            alt="some"
          />
          <h2 className="mt-5 text-md font-nunito">{meal.strMeal}</h2>
        </div>
      </Link>
    </>
  );
};

export default CardMeals;
