import React from "react";

const About = () => {
  return (
    <>
      <div className="flex flex-col justify-end w-2/3 gap-4 p-2 mx-32 my-32 phone:p-4 phone:mx-0 phone:w-full phone:justify-center">
        <h1 className="text-xl ">What is Ricetta</h1>
        <p className="text-lg font-nunito">
          "Ricetta" is an Italian term that refers to a recipe for cooking. The
          term can also be used to refer to a prescription for medicine or other
          recipe. Ricetta derives from the Latin word "recipere," which means
          "to receive" or "to take".
        </p>
      </div>
    </>
  );
};

export default About;
