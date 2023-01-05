import Link from "next/link";
import React from "react";

const ButtonLink = ({ link = "/", children }) => {
  return (
    <>
      <Link href={link}>
        <button className="rounded-lg bg-teal-700 px-3 py-1 ml-2">
          {" "}
          {children}
        </button>
      </Link>
    </>
  );
};

export default ButtonLink;
