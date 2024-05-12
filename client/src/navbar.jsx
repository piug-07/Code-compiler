/* eslint-disable no-unused-vars */
"use client";

import react, { useState } from "react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-[#D9D9D9] w-full h-20 p-4 flex justify-between items-center border  mx-auto lg:mx-0 lg:w-full -mt-2">
      <div className="text-white" style={{ backgroundColor: "transparent" }}>
        <h1 className="text-4xl text-black font-normal ">
          Online Code Compiler
        </h1>
      </div>
      <div className="hidden lg:flex items-center">
        <a
          href="https://github.com/piug-07"
          className="text-black mx-4 lg:mx-8"
        >
          Github
        </a>
        <a
          href="https://shrutii-05.github.io/Live_CodeEditor"
          className="text-black mx-4 lg:mx-8"
        >
          Web Editor
        </a>
      </div>
      <div className="lg:hidden">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-black cursor-pointer"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          onClick={toggleMenu}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16m-7 6h7"
          />
        </svg>
        {isOpen && (
          <div className="absolute top-14 right-4 bg-white p-4 rounded-md shadow-lg z-10">
            <a
              href="https://github.com/piug-07"
              className="block text-black my-2"
            >
              Github
            </a>
            <a
              href="https://shrutii-05.github.io/Live_CodeEditor/"
              className="block text-black my-2"
            >
              Web Editor
            </a>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
