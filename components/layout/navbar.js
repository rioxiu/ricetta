import React from "react";
import Link from "next/link";
import logo from "../../public/Ricetta-2.png";
import Image from "next/image";
const Navbar = () => {
  return (
    <nav className="flex flex-row items-center p-2 bg-slate-800 justify-between">
      <Image src={logo} className="w-1/12 ml-5" />
      <Link className="text-2xl" href={"/"}></Link>
      <ul className="gap-10 flex flex-row mx-4">
        <Link href={"/meals"}>Meals</Link>
        <Link href={"/aboutus"}>About Us</Link>
        <Link href={"/"}>Meals</Link>
      </ul>
    </nav>
  );
};

export default Navbar;
