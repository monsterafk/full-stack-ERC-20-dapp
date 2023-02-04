import hre from "hardhat";
import { ethers } from "hardhat"

async function main() {
  const DevToken = await hre.ethers.getContractFactory("HKPtoken");
  

  const devToken = await DevToken.deploy();
  await devToken.deployed();
  
  console.log("Contract deployed to: ", devToken.address);
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });