import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
// import "./tasks/sample_tasks";
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-etherscan";
import "hardhat-gas-reporter";
import "solidity-coverage";
import "@typechain/hardhat";
// import 'hardhat-deploy';
// import '@openzeppelin/hardhat-upgrades';
// import "@openzeppelin/contracts";
const privateKey = "private key"
const config: HardhatUserConfig = {
  solidity: { 
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        runs: 2000
      }
    }
  },
  networks: { 
    goerli: {
      chainId: 5,
      url: "htps://eth-goerli.g.alchemy.com/v2/OCwWQwMdHroLZJhmwzurl9qAZmZscSxhoSy",
      accounts: [privateKey],
  },
    // hardhat: {
    //   chainId: 1337
    // }
  },
  etherscan: {
    apiKey: {
      goerli: "api key"
  },
}

}

export default config;

// const privateKey = 0xe6e758b4dc3d9076ace2a0941a12fd4669f30473ecc5d6806a6af4abd4ba88ee