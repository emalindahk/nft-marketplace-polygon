import React, { useState, useEffect } from "react";
import  Layout  from "../components/Layout";

import { ethers } from "ethers"
import axios from 'axios';
import Web3Modal from 'web3modal';

import {nftaddress, nftmarketaddress} from '../config.js';

import NFT from "../abi/NFT.json"
import Market from "../abi/NFTMarket.json"

function MyAssets() {
    const [nfts, setNfts] = useState([]);
    const [loadingState, setLoadingState] = useState('not-loaded');

    useEffect(() => {
        loadNFTs();
    })

     // fetch the all nfts from our contract
  async function loadNFTs() {
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()

    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, signer)
    const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, signer)
    const data = await marketContract.fetchMyNFTs()

    const items = await Promise.all(data.map(async i => {
      const tokenUri = await tokenContract.tokenURI(i.tokenId)
      // get metadata of the token
      const meta = await axios.get(tokenUri)  
      let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
      let item = {
        price,
        tokenId: i.tokenId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        image: meta.data.image,
        name: meta.data.name,
        description: meta.data.description,
      }
      return item
    }))
    setNfts(items)
    setLoadingState('loaded')
  }

  if(loadingState === 'loaded' && !nfts.length) return (
    <Layout>
      <h1 className="px-20 py-10 text-3xl font-semibold text-white"> No assets owned</h1>
      </Layout>
  )

  return (
    <Layout>
        <div className="px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          
          {
            nfts.map((nft, i) => (
              <NFTCard
                key={i}
                title={nft.name}
                src={nft.image}
                description={nft.description}
                price={nft.price}
              />
            ))
          }
        </div>
      </div>
    </Layout>
  )
}

export default MyAssets


const NFTCard = ({title, src, description, price,}) => {
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
        </div>
      </div>
    </div>
  </div>
    )
}