import React from "react";
import foodImg from "../../public/food-home.jpg";
import Image from "next/image";
import ButtonLink from "../../components/button/buttonLink";
export const HeroSect = () => {
  return (
    <section className="items-center mt-10">
      <>
        <div className="flex flex-row gap-10 justify-center">
          <div className="flex flex-col mx-10 my-36 p-5 gap-10 ">
            <h1 className="text-center text-4xl font-bold w-96">
              Search for the
              <span className="font-extrabold text-cyan-600"> recipe</span>{" "}
              <br /> of the food you want to know.
            </h1>

            <ButtonLink link={"/main"}>Meals</ButtonLink>
          </div>
          <div className="items-center p-5 flex justify-center">
            <Image
              src={foodImg}
              width={300}
              className="rounded-lg"
              height={150}
              alt=""
            />
          </div>
        </div>
      </>
    </section>
  );
};
