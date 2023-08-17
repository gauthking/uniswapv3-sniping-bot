// code for the main bot listening to the Uniswap Factory events
const { UniswapV3Factory } = require("@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Factory.sol/IUniswapV3Factory.json")
const { ethers } = require('ethers')


const factoryV3Address = "0x1F98431c8aD98523631AE4a59f267346ea31F984";
const routerV3Address = "0xE592427A0AEce92De3Edee1F18E0157C05861564";


// alchemy mainnet provider
const provider = new ethers.providers.JsonRpcProvider("https://eth-mainnet.g.alchemy.com/v2/dGRip-MurOBgPq0obsQrSRGU7lnvVtOl")

// contract instances
const factoryContract = new ethers.Contract(factoryV3Address, UniswapV3Factory.abi, provider);


factoryContract.on('PoolCreated', (token0, token1, pool, fee) => {
    console.log(`New pool detected:\n`);
    console.log(`Token0: ${token0}`);
    console.log(`Token1: ${token1}`);
    console.log(`Pool Address: ${pool}`);
    console.log(`Fee: ${fee}`);
    console.log(`\n`);
});
factoryContract.on('error', (error) => {
    console.error(`Error: ${error}`);
});



