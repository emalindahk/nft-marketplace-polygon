import React, { useState } from "react";
import Link from "next/link";

function MobileNav() {
  const [open, setOpen] = useState(false);

  const openDropdown = () => {
    setOpen(!open);
  };

  return (
    <div className="relative inline-block md:hidden text-left">
      <div onClick={openDropdown} className="-mr-1 ml-2 h-8 w-8">
        menu
      </div>

      {open && (
        <div
          className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-secondary
 ring-1 ring-black ring-opacity-5 focus:outline-none text-gray-300 z-50"
        >
          <div className="flex flex-col space-y-3 p-4 text-left">
            <Link href="how-it-works">
              <a className=" text-white text-xl"> How It Works</a>
            </Link>
            <Link href="/explore">
              <a className=" text-white text-xl"> Explore</a>
            </Link>
            <Link href="/rent">
              <a className=" text-white text-xl"> Borrow</a>
            </Link>
            {/* <button
              className="border border-gray-500 text-lg font-black
             text-transparent bg-clip-text bg-gradient-to-br from-white to-grd-blue rounded-full py-2 px-4"
            >
              Connect Wallet
            </button> */}
          </div>
        </div>
      )}
    </div>
  );
}

export default MobileNav;