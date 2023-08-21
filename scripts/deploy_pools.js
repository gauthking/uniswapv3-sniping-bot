const WETH_ADDRESS = '0x5Ee655E87d269D4585E94a9CC9741C5278e8357d';
const FACTORY_ADDRESS = '0x46855Ca1007D795daf220af5F9f4500819e0cB72';
const SWAP_ROUTER_ADDRESS = '0x41107b1e29862D9A5640104CA067830819A57d22';
const NFT_DESCRIPTOR_ADDRESS = '0x586D40B8fFae6Cd1FFd91e1c7f1A5a0660d8d396';
const POSITION_DESCRIPTOR_ADDRESS = '0x8271d93c72E1b2A3B32137bb3eEb99e8e7771760';
const POSITION_MANAGER_ADDRESS = '0x84E38FFd6d1DC750F8bD2c5F98e30d5B6afEE722';


const TOKEN0_ADDRESS = '0x85E437f7d33115EBd9eE77e1d9Bbf404605aEe73';
const TOKEN1_ADDRESS = '0x83e70cB48E774a783f143Ec39f60a82b95985034';

const artifacts = {
    UniswapV3Factory: require("@uniswap/v3-core/artifacts/contracts/UniswapV3Factory.sol/UniswapV3Factory.json"),
    NonfungiblePositionManager: require("@uniswap/v3-periphery/artifacts/contracts/NonfungiblePositionManager.sol/NonfungiblePositionManager.json"),
    ERC20: require("@openzeppelin/contracts/build/contracts/ERC20.json"),
};
const { Contract, BigNumber } = require("ethers")
const { waffle, ethers } = require("hardhat")
const bn = require('bignumber.js')



bn.config({ EXPONENTIAL_AT: 999999, DECIMAL_PLACES: 40 })
const provider = waffle.provider

function encodePriceSqrt(reserve1, reserve0) {
    return BigNumber.from(
        new bn(reserve1.toString())
            .div(reserve0.toString())
            .sqrt()
            .multipliedBy(new bn(2).pow(96))
            .integerValue(3)
            .toString()
    )
}

const nonfungiblePositionManager = new Contract(
    POSITION_MANAGER_ADDRESS,
    artifacts.NonfungiblePositionManager.abi,
    provider
)
// console.log("Non Fungible Position Manager - ", nonfungiblePositionManager)

const factory = new Contract(
    FACTORY_ADDRESS,
    artifacts.UniswapV3Factory.abi,
    provider
)

// console.log("Factory - ", factory)

async function deployPool(token0, token1, fee, price) {
    const [deployer] = await ethers.getSigners();

    const tx = await nonfungiblePositionManager.connect(deployer).createAndInitializePoolIfNecessary(
        token0,
        token1,
        fee,
        price,
        { gasLimit: 16000000 }
    )
    console.log(tx)
    // const receipt = await provider.getTransactionReceipt(tx.hash);
    // console.log(receipt.logs)
    console.log("Created and Initialized Pool")
    const poolAddress = await factory.connect(deployer).getPool(
        token0,
        token1,
        fee,
    )
    return poolAddress
}

async function main() {
    // const t1 = new ethers.Contract(TOKEN1_ADDRESS, artifacts.ERC20.abi, provider);
    // console.log(await t1.name())
    const deployedPool = await deployPool(TOKEN0_ADDRESS, TOKEN1_ADDRESS, 200, encodePriceSqrt(1, 1))
    console.log('Pool Address - ', `'${deployedPool}'`)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });