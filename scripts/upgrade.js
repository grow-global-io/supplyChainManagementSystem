const { ethers, upgrades } = require("hardhat")

async function main() {
    const supp = await ethers.getContractFactory("SupplyChain");
    let proxy = await upgrades.upgradeProxy("0x73b586295c2b754043a701F4c31d72bA7e8fB6AB", supp); //mumbai
    console.log("Supply Chain Contract has been successfully upgraded...")
}


main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log("This is error")
        console.error(error)
        process.exit(1)
    })
