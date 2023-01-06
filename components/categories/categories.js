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
      <div className="px-2 items-center text-center mt-10 grid grid-cols-7 mb-10 gap-10 ml-5">
        {categories &&
          categories.map((item) => {
            return (
              <>
                <CategoriesItem
                  key={item.idCategory}
                  category={item}
                  onClickHandler={() => {
                    setSelectedCategory(item.strCategory);
                    setQuery("");
                  }}
                  selectedCategory={selectedCategory}
                />
              </>
            );
          })}
      </div>
    </>
  );
};

export default Categories;
