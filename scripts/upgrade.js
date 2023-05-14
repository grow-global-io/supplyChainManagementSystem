const { ethers, upgrades } = require("hardhat")

async function main() {
    const supp = await ethers.getContractFactory("SupplyChain");
    let proxy = await upgrades.upgradeProxy("0xd561813541dDd402cfA6de6E0D68c1b735fF9f3d", supp); //mumbai
    console.log("Supply Chain Contract has been successfully upgraded...")
}


main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log("This is error")
        console.error(error)
        process.exit(1)
    })
