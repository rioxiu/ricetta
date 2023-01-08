import React from "react";
import Link from "next/link";
import logo from "../../public/Ricetta-2.png";
import Image from "next/image";
const Navbar = () => {
  return (
    <nav className="flex flex-row items-center text-center  z-10 bg-slate-800 justify-between">
      <Link className="text-2xl" href={"/"}>
        <Image src={logo} className="ml-5" width={90} height={90} />
      </Link>
      <ul className="gap-10 flex flex-row mx-4">
        <Link className="hover:font-bold" href={"/meals"}>
          Meals
        </Link>
        <Link className="hover:font-bold" href={"/saved"}>
          Save Meals
        </Link>
        <Link href={"/aboutus"} className="hover:font-bold">
          About Us
        </Link>
      </ul>
    </nav>
  );
};

export default Navbar;
