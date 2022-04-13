const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NFTMarket", function () {
  it("Should create and execute market sales", async function () {
    const NFTMarket = await ethers.getContractFactory("NFTMarket");
    const Market = await NFTMarket.deploy();
    await Market.deployed();
    const marketAdress = Market.address;

    const NFT = await ethers.getContractFactory("NFT");
    const nft = await NFT.deploy(marketAdress);
    await nft.deployed();
    const nftAddress = nft.address;

    let listingPrice = await Market.getListingPrice();
    listingPrice = listingPrice.toString();

    const auctionPrice = ethers.utils.parseUnits('100', 'ether');

    await nft.createToken("mytokelocation.com");
    await nft.createToken("mytokelocation2.com");

    await Market.createMarketItem(nftAddress, 1, auctionPrice, {value: listingPrice});
    await Market.createMarketItem(nftAddress, 2, auctionPrice, {value: listingPrice});

    const [_, buyerAddress] = await ethers.getSigners();

    await Market.connect(buyerAddress).createMarketSale(nftAddress, 1, {value: auctionPrice});

    let items = await Market.fetchMarketItems();

    items = await Promise.all(items.map(async i => {
      const tokenUri = await nft.tokenURI(i.tokenId);
      let item = {
        price : i.price.toString(),
        tokenId : i.tokenId.toString(),
        seller: i.seller,
        owner: i.owner,
        sold: i.sold,
        tokenUri
      }
      return item;
    }))
    console.log('Unsold items', items);
  });
});
