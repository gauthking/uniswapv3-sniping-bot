const WETH_ADDRESS = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512'
const FACTORY_ADDRESS = '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0'
const SWAP_ROUTER_ADDRESS = '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9'
const NFT_DESCRIPTOR_ADDRESS = '0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9'
const POSITION_DESCRIPTOR_ADDRESS = '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707'
const POSITION_MANAGER_ADDRESS = '0x0165878A594ca255338adfa4d48449f69242Eb8F'


const TOKEN0_ADDRESS = '0x7a2088a1bFc9d81c55368AE168C2C02570cB814F';
const TOKEN1_ADDRESS = '0x09635F643e140090A9A8Dcd712eD6285858ceBef';

const artifacts = {
    UniswapV3Factory: require("@uniswap/v3-core/artifacts/contracts/UniswapV3Factory.sol/UniswapV3Factory.json"),
    NonfungiblePositionManager: require("@uniswap/v3-periphery/artifacts/contracts/NonfungiblePositionManager.sol/NonfungiblePositionManager.json"),
    ERC20: require("@openzeppelin/contracts/build/contracts/ERC20.json"),
};
const { Contract, BigNumber } = require("ethers")
const { waffle, ethers } = require("hardhat")
const bn = require('bignumber.js')



bn.config({ EXPONENTIAL_AT: 999999, DECIMAL_PLACES: 40 })
const provider = waffle.provider;




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
console.log("Non Fungible Position Manager - ", nonfungiblePositionManager)

const factory = new Contract(
    FACTORY_ADDRESS,
    artifacts.UniswapV3Factory.abi,
    provider
)

console.log("Factory - ", factory)


async function deployPool(token0, token1, fee, price) {
    const [deployer] = await ethers.getSigners()
    await nonfungiblePositionManager.connect(deployer).createAndInitializePoolIfNecessary(
        token0,
        token1,
        fee,
        price,
        { gasLimit: 5000000 }
    )
    console.log("Created and Initialized Pool")
    const poolAddress = await factory.connect(deployer).getPool(
        token0,
        token1,
        fee,
    )
    return poolAddress
}

async function main() {
    const t1 = new ethers.Contract(TOKEN1_ADDRESS, artifacts.ERC20.abi, provider);
    console.log(await t1.name())
    const usdtUsdc500 = await deployPool(TOKEN0_ADDRESS, TOKEN1_ADDRESS, 500, encodePriceSqrt(1, 1))
    console.log('USDT_USDC_500=', `'${usdtUsdc500}'`)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });