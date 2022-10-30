const hre = require("hardhat");

// Returns the Ether balance of a given address.
async function getBalance(address) {
  const balanceBigInt = await hre.ethers.provider.getBalance(address);
  return hre.ethers.utils.formatEther(balanceBigInt);
}

// Logs the Ether balances for a list of addresses.
async function printBalances(addresses) {
  let idx = 0;
  for (const address of addresses) {
    console.log(`Address ${idx} balance: `, await getBalance(address));
    idx++;
  }
}

async function printJPYCBalances(addresses, jpycContract) {
  let idx = 0;
  for (const address of addresses) {
    console.log(
      `Address ${idx} balance: `,
      await jpycContract.balanceOf(address)
    );
    idx++;
  }
}

// Logs the memos stored on-chain from coffee purchases.
async function printMemos(memos) {
  for (const memo of memos) {
    const timestamp = memo.timestamp;
    const tipper = memo.name;
    const tipperAddress = memo.from;
    const message = memo.message;
    console.log(
      `At ${timestamp}, ${tipper} (${tipperAddress}) said: "${message}"`
    );
  }
}

async function main() {
  // Get the example accounts we'll be working with.
  const [owner, tipper, tipper2, tipper3] = await hre.ethers.getSigners();

  const jpycContractFactory = await hre.ethers.getContractFactory("JPYC");
  const jpycContract = await jpycContractFactory.deploy();
  console.log("jpycContractのアドレス from front", jpycContract.address);
  await jpycContract
    .connect(owner)
    .transfer(tipper.address, ethers.BigNumber.from("1000000000000000000"));
  await jpycContract
    .connect(owner)
    .transfer(tipper2.address, ethers.BigNumber.from("1000000000000000000"));
  await jpycContract
    .connect(owner)
    .transfer(tipper3.address, ethers.BigNumber.from("1000000000000000000"));
  console.log(await jpycContract.balanceOf(owner.address));
  console.log(await jpycContract.balanceOf(tipper.address));

  // We get the contract to deploy.
  const BuyMeAKatsu = await hre.ethers.getContractFactory("BuyMeAKatsu");
  const buyMeAKatsu = await BuyMeAKatsu.deploy(jpycContract.address);

  // Deploy the contract.
  await buyMeAKatsu.deployed();
  console.log("BuyMeAKatsu deployed to:", buyMeAKatsu.address);

  //カツコントラクトに送る
  //   await jpycContract
  //     .connect(owner)
  //     .transfer(
  //       buyMeAKatsu.address,
  //       ethers.BigNumber.from("10000000000000000000")
  //     );

  // Check balances before the coffee purchase.
  const addresses = [owner.address, tipper.address, buyMeAKatsu.address];
  //   console.log("カツコントラクトのアドレス from front", buyMeAKatsu.address);
  console.log("== start ==");
  await printJPYCBalances(addresses, jpycContract);

  // Buy the owner a few coffees.
  const tip = { value: hre.ethers.utils.parseEther("1") };
  await jpycContract.connect(tipper).approve(buyMeAKatsu.address, tip.value);
  await buyMeAKatsu
    .connect(tipper)
    .buyKatsu("Carolina", "You're the best!", tip.value);
  await jpycContract.connect(tipper2).approve(buyMeAKatsu.address, tip.value);
  await buyMeAKatsu
    .connect(tipper2)
    .buyKatsu("Vitto", "Amazing teacher", tip.value);
  await jpycContract.connect(tipper3).approve(buyMeAKatsu.address, tip.value);
  await buyMeAKatsu
    .connect(tipper3)
    .buyKatsu("Kay", "I love my Proof of Knowledge", tip.value);

  // Check balances after the coffee purchase.
  console.log("== bought katsu ==");
  await printJPYCBalances(addresses, jpycContract);

  //   jpycContract.connect(tipper).transfer(buyMeAKatsu.address, tip.value);
  //   console.log("== tensou katsu ==");
  //   await printJPYCBalances(addresses, jpycContract);

  // Withdraw.
  await buyMeAKatsu.connect(owner).withdrawTips();

  // Check balances after withdrawal.
  console.log("== withdrawTips ==");
  await printJPYCBalances(addresses, jpycContract);

  // Check out the memos.
  console.log("== memos ==");
  const memos = await buyMeAKatsu.getMemos();
  printMemos(memos);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
