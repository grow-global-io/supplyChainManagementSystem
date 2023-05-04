const { ethers, upgrades } = require("hardhat")

async function main() {
    const supp = await ethers.getContractFactory("SupplyChain");
    let proxy = await upgrades.upgradeProxy("0x15BA1eaB00e5E130d142B6B364357251566c1999", supp); //xdc
    console.log("Supply Chain Contract has been successfully upgraded...")
}


main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log("This is error")
        console.error(error)
        process.exit(1)
    })
