const { ethers } = require("hardhat");
// Token 1 - GoldToken Deployed to 0x7a2088a1bFc9d81c55368AE168C2C02570cB814F)
// }
// Token 2 - Leptronic Deployed to 0x09635F643e140090A9A8Dcd712eD6285858ceBef
async function main() {
    const [deployer, depositAddress] = await ethers.getSigners();

    const Token0 = await ethers.getContractFactory('Token0', deployer);
    const token0 = await Token0.deploy()

    const Token1 = await ethers.getContractFactory('Token1', deployer);
    const token1 = await Token1.deploy()

    // minting tokens to the deployer address
    await token0.connect(deployer).mint(depositAddress.address, ethers.utils.parseEther('100000'))
    await token1.connect(deployer).mint(depositAddress.address, ethers.utils.parseEther('100000'))

    const token1Name = await token0.name()
    const token2Name = await token1.name()

    console.log(`Token 1 - ${token1Name} Deployed to ${token0.address} `)
    console.log(`Token 2 - ${token2Name} Deployed to ${token1.address}`)
}

main().then(() => process.exit(0)).catch((err) => {
    console.log(err);
    process.exit(1)
})
