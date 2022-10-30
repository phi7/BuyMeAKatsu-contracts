// scripts/deploy.js

// jpycContractのアドレス from front 0x76F005C40784a900EcA197f16BEb7f87Ea3C7351
// BuyMeAKatsu deployed to: 0xCF9eeC699Ff383f9CaB919d90B0453CAF00bD4cd

const hre = require("hardhat");

async function main() {
  // const jpycContractFactory = await hre.ethers.getContractFactory("JPYC");
  // const jpycContract = await jpycContractFactory.deploy();
  // console.log("jpycContractのアドレス from front",jpycContract.address)
  // We get the contract to deploy.
  const BuyMeAKatsu = await hre.ethers.getContractFactory("BuyMeAKatsu");
  // const buyMeAKatsu = await BuyMeAKatsu.deploy(jpycContract.address);
  const buyMeAKatsu = await BuyMeAKatsu.deploy("0x431D5dfF03120AFA4bDf332c61A6e1766eF37BDB");


  // Deploy the contract.
  await buyMeAKatsu.deployed();
  console.log("BuyMeAKatsu deployed to:", buyMeAKatsu.address);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });