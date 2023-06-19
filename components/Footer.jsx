import React from "react";
import Image from "next/image";

const Footer = () => {
  return (
    <div className="glassmorphism w-full h-[200px] justify-center items-center font-semibold text-[16px] flex flex-col">
      <div className="flex items-center justify-center gap-x-2 mb-[20px]">
        <Image
          src="/assets/images/logo.svg"
          alt="logo"
          width={50}
          height={50}
          className="object-contain w-[46px] md:w-[40px]"
        />
        <p className="logo_text">Prompt.IT</p>
      </div>
      <div className="text-[#505A68] flex justify-center items-center flex-col">
        <h1>Made by: Keanu John Lariosa</h1>
        <p>All rights reserved.</p>
        <p>2023</p>
      </div>
    </div>
  );
};

export default Footer;
