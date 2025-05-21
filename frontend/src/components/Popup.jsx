import { Fragment, useState } from "react";

export default function PopupProvider({ children, open }) {
  return (
    <div
      className={`fixed top-0 left-0 w-screen h-screen overflow-y-scroll z-50 ${
        open ? "block" : "hidden"
      }`}
    >
      <div className="relative w-full h-full">
        <div className="absolute w-full h-full bg-black/50"></div>
        <div className="relative w-full h-full flex justify-center items-center z-50 [&>*]:w-[95%] [&>*]:md:w-1/2">
          {children}
        </div>
      </div>
    </div>
  );
}