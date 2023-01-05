import { QueryClient, useQuery } from "@tanstack/react-query";
import React from "react";
import SearchBar from "../../components/mealspage/searchbar";

const getCategories = async () => {};

const Main = () => {
  const result = useQuery(["categories"], getCategories);
  return (
    <div>
      <SearchBar />
    </div>
  );
};

export default Main;
