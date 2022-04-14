import React, { useState, useEffect } from "react";
import  Layout  from "../components/Layout";
import { ethers } from "ethers"
import { create as ipfsHttpClient } from "ipfs-http-client";
import axios from 'axios';
import Web3Modal from 'web3modal';
import {useRouter } from "next/router"

import {nftaddress, nftmarketaddress} from '../config.js';

import NFT from "../abi/NFT.json"
import Market from "../abi/NFTMarket.json"

const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0');

function CreateItem() {
    const [fileUrl, setFileUrl] = useState(null);
    const [formInput, updateFormInput] = useState({price: '', name: '', description: ''});
    const router = useRouter();

    async function onChange(e) {
        e.preventDefault();
        const file = e.target.files[0];
        try{
            const added = await client.add(file,
                {
                    progress: (prog) => console.log(`received: ${prog}`)
                })
            const url = `https://ipfs.infura.io/ipfs/${added.path}`;
            setFileUrl(url)
        } catch(err){
            console.log(err);
        }
    }


    async function createItem() {
        const {name, description, price} = formInput;
        if(!name || !description || !price || !fileUrl) return
        const data = JSON.stringify({name, description, image: fileUrl});

        try{
            const added = await client.add(data)
            const url = `https://ipfs.infura.io/ipfs/${added.path}`;
    
            createSale(url);
        }catch(err){
            console.log(err);
        }
    }

    async function createSale(url) {
        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()

        let contract = new ethers.Contract(nftaddress, NFT.abi, signer)
        let transaction = await contract.createToken(url)
        let tx = await transaction.wait();

        let event = tx.events[0];
        let value = event.args[2];
        let tokenId = value.toNumber();

        const price = ethers.utils.parseUnits(formInput.price,  'ether');

        contract = new ethers.Contract(nftmarketaddress, Market.abi, signer)
        let listingPrice = await contract.getListingPrice()
        listingPrice = listingPrice.toString();

        transaction = await contract.createMarketItem(
            nftaddress, tokenId, price, {value : listingPrice}
        )
        await transaction.wait();
        router.push('/')
    }

   

  return (
    <Layout>
        <div className="flex justify-center w-full">
            <div className="w-1/2 flex flex-col pb-12 space-y-3">
                <input type="text" 
                placeholder="Asset Name"
                className="w-full border border-gray-500 rounded-lg p-4 bg-transparent" 
                onChange={e => updateFormInput({...formInput, name: e.target.value})}/>
                 <input  type="text"
                placeholder="Asset Description"
                className="w-full border border-gray-500 rounded-lg p-4 bg-transparent" 
                onChange={e => updateFormInput({...formInput, description: e.target.value})}/>
                 <input type="text" 
                placeholder="Asset Price In Matic"
                className="w-full border border-gray-500 rounded-lg p-4 bg-transparent" 
                onChange={e => updateFormInput({...formInput, price: e.target.value})}/>
                <input type="file"
                name="Asset"
                onChange={onChange}
                className="w-full p-4" />
                {
                    fileUrl && <img src={fileUrl} className="h-96" />
                }
                <button onClick={createItem} 
                className="w-full bg-blue-500 text-white rounded-lg p-4">Create Digital Asset</button>

            </div>
        </div>
    </Layout>
  )
}

export default CreateItem