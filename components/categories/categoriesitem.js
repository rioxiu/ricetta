import React from "react";

const CategoriesItem = ({ category, selectedCategory, onClickHandler }) => {
  return (
    <>
      <button
        onClick={onClickHandler}
        type="button"
        className="px-3 py-2 text-sm  bg-teal-600  rounded-lg"
      >
        <p className="hover:font-bold">{category.strCategory}</p>
      </button>
    </>
  );
};

export default CategoriesItem;
