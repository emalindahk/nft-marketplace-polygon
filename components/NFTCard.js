import React from 'react'
import Image from 'next/image'

function NFTCard({ title, src, price, description, onClick }) {
  return (
    <div className="mx-auto mt-10 h-[25rem] w-72 rounded-xl bg-gradient-to-r from-[#6EE7B7] via-[#3B82F6] to-[#9333EA] p-[2px]">
      <div className="flex h-full flex-col items-center justify-between rounded-lg bg-primary py-4 px-2 text-white">
        <div className="relative -ml-[3px] h-[22rem] w-64">
          <Image src={src} layout="fill" className="rounded-lg" />
        </div>

        <div className="w-full py-2">
          <h2 className="text-lg text-gray-200">{title}</h2>
          <p className="overflow-hidden text-sm text-gray-400">{description}</p>
          <div className="flex flex-row items-center justify-between pt-2">
            <div className="flex flex-col">
              <p className="text-xs text-gray-500">Price</p>
              <p className="text-sm text-gray-300">{price} matic</p>
            </div>
            <button
              className="cursor-pointer rounded-full bg-gradient-to-r from-grd-ltBlue to-grd-blue
                   px-4 py-2 font-mono text-sm text-gray-800"
              onClick={onClick}
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NFTCard
