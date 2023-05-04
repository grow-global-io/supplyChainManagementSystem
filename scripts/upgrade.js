const { ethers, upgrades } = require("hardhat")

async function main() {
    const supp = await ethers.getContractFactory("SupplyChain");
    let proxy = await upgrades.upgradeProxy("0x10c75f53ce6807D6DEd902638eA035BEC95a4c1a", supp); //mumbai
    console.log("Supply Chain Contract has been successfully upgraded...")
}


main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log("This is error")
        console.error(error)
        process.exit(1)
    })
