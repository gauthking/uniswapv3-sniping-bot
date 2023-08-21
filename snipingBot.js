// code for the main bot listening to the Uniswap Factory events
const UniswapV3Factory = require("@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Factory.sol/IUniswapV3Factory.json")
const NonfungiblePositionManager = require("@uniswap/v3-periphery/artifacts/contracts/interfaces/INonfungiblePositionManager.sol/INonfungiblePositionManager.json");
const UniswapV3Pool = require("@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json");
const ERC20 = require('@openzeppelin/contracts/build/contracts/ERC20.json');

const { ethers } = require('ethers')


const factoryV3Address = "0x46855Ca1007D795daf220af5F9f4500819e0cB72";
const positionManagerAddress = '0x84E38FFd6d1DC750F8bD2c5F98e30d5B6afEE722'
// const wethAddress = "";

// const routerV3Address = "0xE592427A0AEce92De3Edee1F18E0157C05861564";


// alchemy mainnet provider
// const provider = new ethers.providers.JsonRpcProvider("https://eth-mainnet.g.alchemy.com/v2/dGRip-MurOBgPq0obsQrSRGU7lnvVtOl")

// harhdat provider
const provider = new ethers.providers.JsonRpcProvider('https://polygon-mumbai.g.alchemy.com/v2/lCTz9baW9Wdl5DbGGhU0x7JGHMZeFuC-')


// contract instances
const factoryContract = new ethers.Contract(factoryV3Address, UniswapV3Factory.abi, provider);
const positionManagerContract = new ethers.Contract(positionManagerAddress, NonfungiblePositionManager.abi, provider);
// const wethContract = new ethers.Contract(wethAddress, ERC20.abi, provider);

console.log("listening for new pools....")

factoryContract.on('PoolCreated', async (token0, token1, fee, tickSpacing, pool) => {
    console.log(`New pool detected:\n`);
    console.log(`Token0: ${token0}`);
    console.log(`Token1: ${token1}`);
    console.log(`Pool Address: ${pool}`);
    console.log(`Pool FEE: ${fee}`);
    console.log(`Tick Spacing: ${tickSpacing}`);
    console.log(`\n`);

    const poolContract = new ethers.Contract(pool, UniswapV3Pool.abi, provider);
    const [token0Address, token1Address] = await poolContract.getTokens();
    console.log(poolContract);
    console.log(token0Address);
    console.log(token1Address);

    // const amountIn = ethers.utils.parseEther('0.25'); // Amount of WETH to swap
    // const path = [wethAddress, token0Address]; // Swap from WETH to the new token

    // const gasLimit = await positionManagerContract.estimateGas.swapExactInputSingle(
    //     [path[0], path[1]],
    //     sniper.address,
    //     [0, amountIn, 0, 0],
    //     1,
    //     Math.floor(Date.now() / 1000) + 60 * 15,
    //     { gasLimit: 5000000 }
    // );

    // // Perform the swap
    // const tx = await positionManagerContract.swapExactInputSingle(
    //     [path[0], path[1]],
    //     sniper.address,
    //     [0, amountIn, 0, 0],
    //     1,
    //     Math.floor(Date.now() / 1000) + 60 * 15,
    //     { gasLimit: gasLimit }
    // );

    // console.log(`Swap transaction sent: ${tx.hash}`);

});


factoryContract.on('error', (error) => {
    console.error(`Error: ${error}`);
});



