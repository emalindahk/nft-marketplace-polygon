import React, { useState, useEffect } from "react";
import { ethers } from "ethers"
import axios from 'axios';
import Web3Modal from 'web3modal';

import Image from "next/image";

import Layout from "../components/Layout";
import NFTCard from "../components/NFTCard";

import {nftaddress, nftmarketaddress} from '../config.js';

import NFT from "../abi/NFT.json"
import Market from "../abi/NFTMarket.json"


function index() {
  const [nfts, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState('not-loaded');

  // fetch the all nfts from our contract
  async function loadNFTs() {
    const provider = new ethers.providers.JsonRpcProvider("https://rpc-mumbai.matic.today");
    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider)
    const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, provider)
    const data = await marketContract.fetchMarketItems()

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

  //buy nft function
  async function buyNFT(nft){
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)

    const signer = provider.getSigner()
    const contract = new ethers.Contract(nftmarketaddress, Market.abi, signer)

    const price = ethers.utils.parseUnits(nft.price.toString(), 'ether')

    const transaction = await contract.createMarketSale(nftaddress, nft.tokenId, {value : price})
    await transaction.wait()
    loadNFTs()
  }

  useEffect(() => {
    loadNFTs();
  }, []);

  if(loadingState === 'loaded' && !nfts.length) return (
    <Layout>
      <h1 className="px-20 py-10 text-3xl font-semibold text-white"> No items in the marketplace</h1>
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
                onClick={() => buyNFT(nft)}
              />
            ))
          }
        </div>
      </div>
    </Layout>
  )
}

export default index


const Feature = ({ src, title, content }) => {
  return (
    <div className="flex flex-col space-y-2 ">
      <div className="flex flex-row space-x-2 items-end">
        <div className="relative h-14 w-14">
          <Image src="/dummyNFT.svg" layout="fill" />
        </div>
        <p className="text-xl text-gray-300 font-bold">{title}</p>
      </div>

      <div>
        <p className="text-base text-gray-500">{content}</p>
      </div>
    </div>
  );
};

