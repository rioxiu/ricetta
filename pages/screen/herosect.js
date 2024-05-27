import React from "react";
import foodImg from "../../public/food-home.jpg";
import Image from "next/image";
import ButtonLink from "../../components/button/buttonLink";

const HeroSect = () => {
  return (
    <>
      <section className="items-center mt-10">
        <>
          <div className="flex flex-row justify-center gap-10 phone:flex-col-reverse">
            <div className="flex flex-col gap-10 p-5 mx-10 my-36 phone:my-0 ">
              <h1 className="text-4xl font-bold text-center w-96">
                Search for the
                <span className="font-extrabold text-cyan-600">
                  {" "}
                  recipe
                </span>{" "}
                <br /> of the food you want to know.
              </h1>
              <div className="flex flex-row gap-2 phone:items-center phone:justify-center">
                <ButtonLink link={"/meals"}>Meals</ButtonLink>
                <ButtonLink link={"/saved"}>Save Meals</ButtonLink>
              </div>
            </div>
            <div className="flex items-center justify-center p-5">
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
    </>
  );
};

export default HeroSect;
