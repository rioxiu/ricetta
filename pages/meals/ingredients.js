import React from "react";

const Ingredients = ({ Ingmeasures }) => {
  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-3xl font-bold text-gray-800">Ingredients</h1>
      <table className="bg-slate-900 rounded w-full max-w-xl border-spacing-0 text-center">
        <>
          {Ingmeasures.map((ms, index) => (
            <tbody key={index} className="">
              <tr key={ms.i} className="border-b-2 flex justify-between ">
                <td className="p-2 mx-10 ">
                  <p className="items-start">{ms.ingredient}</p>
                </td>
                <td className="p-2 mx-10 items-start">
                  <p className="items-start">{ms.measure}</p>
                </td>
              </tr>
            </tbody>
          ))}
        </>
      </table>
    </div>
  );
};

export default Ingredients;
