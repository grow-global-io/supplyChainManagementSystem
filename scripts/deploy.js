const hre = require("hardhat");

async function main() {

  const supp = await hre.ethers.getContractFactory("SupplyChain");
  //const proxy = await upgrades.deployProxy(gateway, ["0xB5b93720E9b5F7650164b4962E8Dfe2DBdF94488", "asohmwkdib3ijn3vbbs9ejb5ja09djnwmmw"])
  const suppChain = await supp.deploy(8001);
  await suppChain.deployed();
  //const suppChain = await hre.upgrades.deployProxy(supp);
  console.log("SupplyChain deployed to:", suppChain.address);

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log("This is error");
    console.error(error);
    process.exit(1);
  });
