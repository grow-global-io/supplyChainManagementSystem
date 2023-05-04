const hre = require("hardhat");

async function main() {

  const supp = await hre.ethers.getContractFactory("SupplyChain");
  // const mixerMain = await mixer.deploy();
  // await mixerMain.deployed();
  const suppChain = await hre.upgrades.deployProxy(supp);
  console.log("SupplyChain deployed to:", suppChain.address);

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log("This is error");
    console.error(error);
    process.exit(1);
  });
