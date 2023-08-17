// code for the main bot listening to the Uniswap Factory events
const UniswapV3Factory = require("@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Factory.sol/IUniswapV3Factory.json")
const { ethers } = require('ethers')


const factoryV3Address = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
// const routerV3Address = "0xE592427A0AEce92De3Edee1F18E0157C05861564";


// alchemy mainnet provider
// const provider = new ethers.providers.JsonRpcProvider("https://eth-mainnet.g.alchemy.com/v2/dGRip-MurOBgPq0obsQrSRGU7lnvVtOl")

// harhdat provider
const provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545/')


// contract instances
const factoryContract = new ethers.Contract(factoryV3Address, UniswapV3Factory.abi, provider);

console.log("listening for new pools....")
factoryContract.on('PoolCreated', (token0, token1, fee, tickSpacing, pool) => {
    console.log(`New pool detected:\n`);
    console.log(`Token0: ${token0}`);
    console.log(`Token1: ${token1}`);
    console.log(`Pool Address: ${pool}`);
    console.log(`Pool FEE: ${fee}`);
    console.log(`Tick Spacing: ${tickSpacing}`);
    console.log(`\n`);
});
factoryContract.on('error', (error) => {
    console.error(`Error: ${error}`);
});



