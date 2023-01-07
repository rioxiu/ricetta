import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import React from "react";
import axios from "axios";
import BeatLoader from "react-spinners/BeatLoader";
import Ingredients from "./ingredients";
import Link from "next/link";
const getSingleMeal = async ({ queryKey }) => {
  const { data } = await axios.get(`/lookup.php?i=${queryKey[1]}`);
  return data?.meals[0];
};

const MealPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data, isLoading, isError, error } = useQuery(
    ["singleMeal", id],
    getSingleMeal
  );

  const loaderImg = ({ src }) => {
    return data.strMealThumb;
  };

  if (isError) {
    return <p className="">{error.message}</p>;
  }

  if (isLoading || !data) {
    return (
      <div className="">
        <BeatLoader
          className="p-5 flex justify-center items-center"
          size={30}
          color="#fff"
        />
      </div>
    );
  }

  const ingredients = Object.keys(data)
    .filter((key) => key.startsWith("strIngredient"))
    .filter((key) => data[key] !== "" && data[key] !== null);

  console.log(ingredients);

  const Ingmeasures = ingredients.map((key, i) => ({
    i: i + 1,
    ingredient: data[key],
    measure: data[`strMeasure${i + 1}`],
  }));

  const urlYoutube = data.strYoutube.replace("watch?v=", "embed/");
  const urlSource = data.strSource;
  return (
    <>
      <div className="p-5 flex flex-col my-5 justify-start mx-24 gap-10">
        <div className="flex flex-row justify-center gap-12 ">
          <div className="flex flex-col gap-5 justify-start">
            <h1 className="text-5xl font-extrabold mt-2 font-nunito">
              {data.strMeal}
            </h1>
            <p className="text-lg text-start">
              📌 Category :{" "}
              <span className=" text-md text-teal-600">{data.strCategory}</span>
            </p>
            <p className="text-lg">
              🧷 Tags :{" "}
              <span className="text-md text-teal-600">
                {data?.strTags?.split(",").join(", ")}
              </span>{" "}
            </p>
            <p className="text-lg">
              🗺 Country :{" "}
              <span className="text-md text-teal-600">{data.strArea}</span>
            </p>
            <p className="hover:font-bold">
              🔗 Source Link :{" "}
              <Link
                className=" text-teal-600"
                target={"_blank"}
                href={urlSource}
              >
                Click This!!
              </Link>
            </p>

            <div className="rounded-lg w-1/3">
              <embed
                className="rounded-xl"
                width="400"
                height="285"
                src={urlYoutube}
                type=""
              />
            </div>
          </div>
          <div className=" p-2 rounded-xl items-center ml-32 text-center ">
            <img
              className="rounded-lg"
              loader={loaderImg}
              src={data.strMealThumb}
              height={"520"}
              width={"520"}
            />
          </div>
        </div>

        <div>
          <Ingredients Ingmeasures={Ingmeasures} />
        </div>
        <div className="flex flex-col gap-5 ">
          <h1 className="text-3xl font-bold text-slate-700">Introduction</h1>
          {data.strInstructions
            .split(".")
            .filter((sentence) => sentence !== "")
            .map((sentence) => (
              <>
                <p className="text-xl font-semibold">📎 {sentence}.</p>
              </>
            ))}
        </div>
      </div>
    </>
  );
};

export default MealPage;
