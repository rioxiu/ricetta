import React from "react";

const Ingredients = ({ Ingmeasures }) => {
  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-3xl font-bold text-gray-800">Ingredients</h1>
      <table className="bg-slate-900 rounded w-full max-w-xl border-spacing-0 text-center">
        <tbody>
          {Ingmeasures.map((ms) => (
            <tr key={ms.index} className="border-b-2">
              <td className="p-2">
                <p>{ms.ingredient}</p>
              </td>
              <td className="p-2">
                <p>{ms.measure}</p>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Ingredients;
