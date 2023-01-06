import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import React from "react";
import BeatLoader from "react-spinners/BeatLoader";
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

  // const loaderImg = ({ src }) => {
  //   return data.strMealThumb;
  // };

  if (isError) {
    return <p className="">{error.message}</p>;
  }

  if (isLoading || !data) {
    return <BeatLoader color="#fff" />;
  }

  return (
    <div>
      <div>
        <div className="h-72 w-72 rounded-xl bg-slate-900 items-center text-center flex flex-col justify-center">
          <img
            className="rounded-lg"
            loader={loaderImg}
            src={data.strMealThumb}
            height={"200"}
            width={"200"}
          />
          <p className="">{data.strMeal}</p>
          <h2 className="text-md mt-5 font-nunito">{data.infoMeal}</h2>
        </div>
      </div>
    </div>
  );
};

export default MealPage;
