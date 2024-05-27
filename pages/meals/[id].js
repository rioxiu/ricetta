import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import axios from "axios";
import BeatLoader from "react-spinners/BeatLoader";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { Button } from "../../components/button/buttonLink";
import { FaHeartBroken, FaHeart } from "react-icons/fa";
import Image from "next/image";
import Head from "next/head";

export const getSingleMeal = async ({ queryKey }) => {
  const { data } = await axios.get(`/lookup.php?i=${queryKey[1]}`);
  return data?.meals[0];
};

const MealPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const [isSaved, setIsSaved] = React.useState(false);
  const { data, isLoading, isError, error } = useQuery(
    ["singleMeal", id],
    getSingleMeal
  );

  useEffect(() => {
    if (localStorage.getItem("savedMeals")) {
      const savedMeals = JSON.parse(localStorage.getItem("savedMeals"));
      if (savedMeals.includes(id)) {
        setIsSaved(true);
      } else {
        setIsSaved(false);
      }
    } else {
      localStorage.setItem("savedMeals", JSON.stringify([]));
    }
  }, [id]);

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
          className="flex items-center justify-center p-5"
          size={30}
          color="#fff"
        />
      </div>
    );
  }

  const handleSaveButton = async () => {
    const savedMeals = JSON.parse(localStorage.getItem("savedMeals"));
    if (!isSaved) {
      savedMeals.push(data.idMeal);
      localStorage.setItem("savedMeals", JSON.stringify(savedMeals));
      toast.success("Meal saved successfully");
      setIsSaved(true);
    } else {
      savedMeals.splice(savedMeals.indexOf(data.idMeal), 1);
      localStorage.setItem("savedMeals", JSON.stringify(savedMeals));
      setIsSaved(false);
      toast.error("Meal Removed successfully");
    }
  };

  const urlYoutube = data.strYoutube.replace("watch?v=", "embed/");
  const urlSource = data.strSource;
  return (
    <>
      <Head>
        <title>{data.strMeal} || Ricetta</title>
      </Head>
      <div className="flex flex-col justify-start gap-10 p-5 mx-24 my-5 phone:mx-0">
        <div className="flex flex-row justify-center gap-12 phone:flex-col-reverse ">
          <div className="flex flex-col justify-start gap-5">
            <h1 className="mt-2 text-5xl font-extrabold phone:text-center font-nunito">
              {data.strMeal}
            </h1>
            <div>
              <p className="text-lg text-start">
                📌 Category :{" "}
                <span className="text-teal-600 text-md">
                  {data.strCategory}
                </span>
              </p>
              <p className="text-lg">
                🧷 Tags :{" "}
                <span className="text-teal-600 text-md">
                  {data?.strTags?.split(",").join(", ")}
                </span>{" "}
              </p>
              <p className="text-lg">
                🗺 Country :{" "}
                <span className="text-teal-600 text-md">{data.strArea}</span>
              </p>
              <p className="hover:font-bold">
                🔗 Source Link :{" "}
                <Link
                  className="text-teal-600 "
                  target={"_blank"}
                  href={urlSource}
                >
                  Click This!!
                </Link>
              </p>
            </div>

            <>
              {isSaved && (
                <>
                  <p className="font-bold text-cyan-600">
                    You already saved meals!
                  </p>
                </>
              )}
              {!isSaved && (
                <>
                  <p className="font-bold text-cyan-600">
                    You not already saved meals!
                  </p>
                </>
              )}
            </>
            <>
              <Button onClick={handleSaveButton}>
                {isSaved ? (
                  <>
                    <FaHeartBroken /> Remove
                  </>
                ) : (
                  <>
                    <FaHeart /> save
                  </>
                )}
              </Button>
            </>

            <div className="w-1/3 rounded-lg phone:flex phone:justify-center phone:w-full">
              <embed
                className="rounded-xl"
                width="400"
                height="285"
                src={urlYoutube}
                type=""
              />
            </div>
          </div>
          <div className="items-center p-2 ml-32 text-center phone:ml-0 rounded-xl">
            <Image
              alt="some"
              className="rounded-lg"
              loader={() => data.strMealThumb}
              unoptimized={true}
              src={data.strMealThumb}
              height={520}
              width={520}
            />
          </div>
        </div>
        <div className="flex flex-col gap-5 p-2 my-10 ">
          <h1 className="text-3xl font-bold text-slate-700">Ingredients</h1>
          <>
            <table className="p-2 ">
              <tbody className="p-5">
                <tr className="flex flex-row justify-start ">
                  <td className="mr-10">
                    <p className="text-lg font-semibold">
                      {data.strIngredient1}
                    </p>
                    <p className="text-lg font-semibold">
                      {data.strIngredient2}
                    </p>
                    <p className="text-lg font-semibold">
                      {data.strIngredient3}
                    </p>
                    <p className="text-lg font-semibold">
                      {data.strIngredient4}
                    </p>
                    <p className="text-lg font-semibold">
                      {data.strIngredient5}
                    </p>
                    <p className="text-lg font-semibold">
                      {data.strIngredient6}
                    </p>
                    <p className="text-lg font-semibold">
                      {data.strIngredient7}
                    </p>
                    <p className="text-lg font-semibold">
                      {data.strIngredient8}
                    </p>
                    <p className="text-lg font-semibold">
                      {data.strIngredient9}
                    </p>
                    <p className="text-lg font-semibold">
                      {data.strIngredient10}
                    </p>
                  </td>
                  <td>
                    <p className="text-lg font-semibold">{data.sMeasurent1}</p>
                    <p className="text-lg font-semibold">{data.strMeasure2}</p>
                    <p className="text-lg font-semibold">{data.strMeasure3}</p>
                    <p className="text-lg font-semibold">{data.strMeasure4}</p>
                    <p className="text-lg font-semibold">{data.strMeasure5}</p>
                    <p className="text-lg font-semibold">{data.strMeasure6}</p>
                    <p className="text-lg font-semibold">{data.strMeasure7}</p>
                    <p className="text-lg font-semibold">{data.strMeasure8}</p>
                    <p className="text-lg font-semibold">{data.strMeasure9}</p>
                    <p className="text-lg font-semibold">{data.strMeasure10}</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </>
        </div>
        {/* <div>
          <ingredientsWithMeasures
            ingredientsWithMeasures={ingredientsWithMeasures}
          />
        </div> */}

        <div className="flex flex-col gap-5 ">
          <h1 className="text-3xl font-bold text-slate-700">Instruction</h1>
          {data.strInstructions
            .split(".")
            .filter((sentence) => sentence !== "")
            .map((sentence, i) => (
              <div key={i}>
                <p className="text-xl font-semibold">📎 {sentence}.</p>
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

export default MealPage;
