require("@nomiclabs/hardhat-waffle");

const fs = require("fs")
const privateKey = fs.readFileSync(".secret").toString()
const projectId = "p7RLESDtSW0_M2PgkW97xTppXbDjpEtQ"

module.exports = {
  networks: {
    hardhat : {
      chainId: 1337
    },
    mumbai: {
      url:`https://polygon-mumbai.g.alchemy.com/v2/${projectId}`,
      accounts: [privateKey]
    },
    mainnet: {
      url:`to be done`,
      accounts: [privateKey]
    }
  },
  solidity: "0.8.4",
};
