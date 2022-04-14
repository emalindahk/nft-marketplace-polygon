import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

import MobileNav from "./MobileNav";

export default function Header() {
  const handleWalletConnect = () => {
    // Do wallet stuff here
    console.log("Clicked");
  };
  return (
    <div className="flex flex-row justify-between items-center py-4 px-2 md:px-2 lg:px-0 mb-28">
      <Link href="/">
        <div className="relative h-10 w-72 px-2">
          {/* <Image src="/vercel.svg" alt="NFM Logo" layout="fill" /> */}
          <h1 className="text-2xl font-mono w-full underline">NFT MARKETPLACE</h1>
        </div>
      </Link>
      <div className="hidden md:flex items-center w-full justify-end px-4">
        <Link href="/create-item">
          <a className="ml-8 text-white text-lg"> Sell Digital Asset</a>
        </Link>
        <Link href="/my-assets">
          <a className="ml-8 text-white text-lg">My Assets</a>
        </Link>
        <Link href="/creator-dashboard">
          <a className="ml-8 text-white text-lg">Creator DashBoard</a>
        </Link>
      </div>
      <MobileNav handleWalletConnect={handleWalletConnect} />
    </div>
  );
}