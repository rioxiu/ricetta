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

const Button = ({ children, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="rounded-xl text-lg text-black p-1 justify-center w-1/4 flex flex-row items-center gap-2 text-center bg-teal-700"
    >
      {children}
    </button>
  );
};

export { Button };

export default ButtonLink;
