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
      <div className="px-2 items-center text-center mt-10 flex flex-row justify-center mb-10 gap-4  mx-80">
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
