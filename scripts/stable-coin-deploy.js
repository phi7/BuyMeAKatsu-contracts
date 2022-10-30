main3()

async function main3 () {
  try {
    const JPYCCoin = await ethers.getContractFactory("JPYC")
    const jpycCoin = await JPYCCoin.deploy()

    console.info(`Token address: ${jpycCoin.address}`)
  } catch (err) {
    console.error(err)
  }
}