const hre = require("hardhat");

function sleep(millisec) {
  const date = Date.now()
  let currentDate = null;
  do {
    currentDate = Date.now()
  } while (currentDate - date < millisec)
}

async function main() {

  const supp = await hre.ethers.getContractFactory("SupplyChain");
  //const proxy = await upgrades.deployProxy(gateway, ["0xB5b93720E9b5F7650164b4962E8Dfe2DBdF94488", "asohmwkdib3ijn3vbbs9ejb5ja09djnwmmw"])
  const suppChain = await supp.deploy();
  await suppChain.deployed();
  //const suppChain = await hre.upgrades.deployProxy(supp);
  console.log("SupplyChain deployed to:", suppChain.address);

  sleep(100000)
  await hre.run("verify:verify", {
    contract: "contracts/SupplyChain.sol:SupplyChain",
    address: suppChain.address
  })

}



main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log("This is error");
    console.error(error);
    process.exit(1);
  });
