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
        className="items-center flex justify-center"
        id="link"
        href={`/meals/${meal.idMeal}`}
      >
        <div className="h-72 w-72 rounded-xl bg-slate-900 items-center text-center flex flex-col justify-center">
          <Image
            className="rounded-lg"
            loader={loaderImg}
            src={meal.strMealThumb}
            height={"200"}
            width={"200"}
          />
          <h2 className="text-md mt-5 font-nunito">{meal.strMeal}</h2>
        </div>
      </Link>
    </>
  );
};

export default CardMeals;
