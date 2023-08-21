const { ethers } = require("hardhat");
// Token 1 - GoldToken Deployed to 0x7a2088a1bFc9d81c55368AE168C2C02570cB814F)
// }
// Token 2 - Leptronic Deployed to 0x09635F643e140090A9A8Dcd712eD6285858ceBef
async function main() {
    const [deployer] = await ethers.getSigners();
    // const deployer = "0x6Cf0944aDB0e90E3b89d0505e9B9668E8c0E0bA1"
    const depositAddress = "0x2824C88FFf36D53CBD0F932b3ba4782Ff435DE8C"
    console.log("Deploying contracts with the account:", deployer.address);

    const Token0 = await ethers.getContractFactory('Token0', deployer);
    const token0 = await Token0.deploy()

    const Token1 = await ethers.getContractFactory('Token1', deployer);
    const token1 = await Token1.deploy()

    // minting tokens to the deposit address by deployer
    await token0.mint(depositAddress, ethers.utils.parseEther('100000'))
    await token1.mint(depositAddress, ethers.utils.parseEther('100000'))

    console.log(await token0.balanceOf(depositAddress))

    const token1Name = await token0.name()
    const token2Name = await token1.name()

    console.log(`Token 1 - ${token1Name} Deployed to ${token0.address} `)
    console.log(`Token 2 - ${token2Name} Deployed to ${token1.address}`)
}

main().then(() => process.exit(0)).catch((err) => {
    console.log(err);
    process.exit(1)
})
