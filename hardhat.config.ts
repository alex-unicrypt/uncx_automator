import { HardhatUserConfig, task } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

// require("@nomiclabs/hardhat-waffle");
// require('@openzeppelin/hardhat-upgrades');
// require('hardhat-contract-sizer');
// require("@tenderly/hardhat-tenderly");

import "@nomiclabs/hardhat-etherscan";
import "@openzeppelin/hardhat-upgrades"
import "hardhat-contract-sizer"
// import "@nomiclabs/hardhat-waffle";
import "@nomicfoundation/hardhat-chai-matchers"
import "@tenderly/hardhat-tenderly"
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";

import "@nomiclabs/hardhat-etherscan"



const config: HardhatUserConfig = {
  networks: {
    hardhat: {
      forking: {
        url: "https://goerli.infura.io/v3/",
      }
    }
  },
  
  // solidity: "0.8.17",
  solidity: {
    compilers: [
      {
        version: "0.8.0"
      },
      {
        version: "0.8.17"
      },
      {
        version: "0.8.9"
      }
    ],
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
};

export default config;
