import React from "react";
import BeatLoader from "react-spinners/BeatLoader";
import CategoriesItem from "./categoriesitem";
const Categories = ({
  categories,
  categoriesIsLoading,
  categoriesIsError,
  selectedCategory,
  setSelectedCategory,
  setQuery,
}) => {
  if (categoriesIsLoading) {
    return <BeatLoader color="#fff" loading={categoriesIsLoading} />;
  }
  if (categoriesIsError) {
    return "error";
  }
  return (
    <>
      <div className="grid items-center justify-center grid-cols-7 gap-4 px-2 mx-8 mt-10 mb-10 text-center phone:grid-cols-4 ">
        {categories &&
          categories.map((item, i) => {
            return (
              <div key={i}>
                <CategoriesItem
                  key={item.idCategory}
                  category={item}
                  onClickHandler={() => {
                    setSelectedCategory(item.strCategory);
                    setQuery("");
                  }}
                  selectedCategory={selectedCategory}
                />
              </div>
            );
          })}
      </div>
    </>
  );
};

export default Categories;
