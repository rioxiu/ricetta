import { QueryClient, useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { use, useEffect, useState } from "react";
import Categories from "../../components/categories/categories";
import SearchBar from "../../components/mealspage/searchbar";
import BeatLoader from "react-spinners/BeatLoader";
import CardMeals from "../../components/mealspage/cardmeals";
import Head from "next/head";

const override = {
  display: "block",
  margin: "0 auto",
};
const getCategories = async () => {
  const { data } = await axios.get("/categories.php");
  return data.categories;
};

const getMeals = async ({ queryKey }) => {
  const { data } = await axios.get(`/filter.php?c=${queryKey[1]}`);
  return data?.meals || [];
};

const getQueriedMeals = async ({ queryKey }) => {
  const { data } = await axios.get(`/search.php?s=${queryKey[1]}`);
  return data?.meals || [];
};
const Main = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchText, setSearchText] = useState("");
  const [query, setQuery] = useState("");

  const {
    data: categories,
    isLoading: categoriesIsLoading,
    isError: categoriesIsError,
  } = useQuery(["categories"], getCategories);

  const { data, isLoading, isError } = useQuery(
    ["mealsByCategory", selectedCategory],
    getMeals,
    {
      enabled: query === "",
    }
  );

  const {
    data: queridData,
    isLoading: queryIsLoading,
    isError: queryError,
  } = useQuery(["mealsByQuery", query], getQueriedMeals, {
    enabled: query !== "",
  });

  useEffect(() => {
    if (categories) {
      setSelectedCategory(categories[0].strCategory);
    }
  }, [categories]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchText) {
        setQuery(searchText);
        setSelectedCategory("");
      } else {
        setQuery("");
        if (categories) {
          setSelectedCategory(categories[0].strCategory);
        }
      }
    }, 300);
    return () => {
      setQuery("");
      clearTimeout(timeout);
    };
  }, [searchText, categories]);
  return (
    <>
      <Head>
        <title>Categories |Ricetta</title>
      </Head>
      <div className="flex flex-col">
        <SearchBar searchText={searchText} setSearchText={setSearchText} />
        <Categories
          categories={categories}
          categoriesIsError={categoriesIsError}
          categoriesIsLoading={categoriesIsLoading}
          setSelectedCategory={setSelectedCategory}
          selectedCategory={selectedCategory}
          setQuery={setQuery}
        />
        {isLoading || categoriesIsLoading ? (
          <>
            <div className="py-5">
              <BeatLoader
                loading={isLoading || categoriesIsLoading}
                cssOverride={override}
                size={20}
              />
            </div>
          </>
        ) : null}
        <div>
          <div className="grid items-center grid-cols-5 gap-5 m-10 phone:grid-cols-2">
            {!isLoading &&
              !isError &&
              data &&
              data.map((meal) => <CardMeals meal={meal} key={meal.idMeal} />)}
            {!queryIsLoading &&
              !queryError &&
              queridData &&
              queridData.map((meal) => (
                <CardMeals meal={meal} key={meal.idMeal} />
              ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Main;
