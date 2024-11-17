// deploy.js
const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const unlockTime = Math.floor(Date.now() / 1000) + 3600; // Unlock time is 1 hour from now
  const value = hre.ethers.utils.parseEther("1"); // 1 ETH

  const Lock = await hre.ethers.getContractFactory("Lock");
  const lock = await Lock.deploy(unlockTime, { value });

  await lock.deployed();

  console.log("Lock deployed to:", lock.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
