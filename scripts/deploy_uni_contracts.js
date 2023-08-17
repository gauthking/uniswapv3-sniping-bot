// after deployment in testnet:
// WETH_ADDRESS= '0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9'
// FACTORY_ADDRESS= '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707'
// SWAP_ROUTER_ADDRESS= '0x0165878A594ca255338adfa4d48449f69242Eb8F'
// NFT_DESCRIPTOR_ADDRESS= '0xa513E6E4b8f2a923D98304ec87F64353C4D5C853'
// POSITION_DESCRIPTOR_ADDRESS= '0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6'
// POSITION_MANAGER_ADDRESS= '0x8A791620dd6260079BF849Dc5567aDC3F2FdC318'

const { ContractFactory, utils, ethers } = require("ethers")
const { waffle } = require("hardhat");

const artifacts = {
    UniswapV3Factory: require("@uniswap/v3-core/artifacts/contracts/UniswapV3Factory.sol/UniswapV3Factory.json"),
    SwapRouter: require("@uniswap/v3-periphery/artifacts/contracts/SwapRouter.sol/SwapRouter.json"),
    NFTDescriptor: require("@uniswap/v3-periphery/artifacts/contracts/libraries/NFTDescriptor.sol/NFTDescriptor.json"),
    NonfungibleTokenPositionDescriptor: require("@uniswap/v3-periphery/artifacts/contracts/NonfungibleTokenPositionDescriptor.sol/NonfungibleTokenPositionDescriptor.json"),
    NonfungiblePositionManager: require("@uniswap/v3-periphery/artifacts/contracts/NonfungiblePositionManager.sol/NonfungiblePositionManager.json"),
    WETH: require("@openzeppelin/contracts/build/contracts/ERC20.json"),
};

const linkLibraries = ({ bytecode, linkReferences }, libraries) => {
    Object.keys(linkReferences).forEach((fileName) => {
        Object.keys(linkReferences[fileName]).forEach((contractName) => {
            if (!libraries.hasOwnProperty(contractName)) {
                throw new Error(`Missing link library name ${contractName}`)
            }
            const address = utils
                .getAddress(libraries[contractName])
                .toLowerCase()
                .slice(2)
            linkReferences[fileName][contractName].forEach(
                ({ start, length }) => {
                    const start2 = 2 + start * 2
                    const length2 = length * 2
                    bytecode = bytecode
                        .slice(0, start2)
                        .concat(address)
                        .concat(bytecode.slice(start2 + length2, bytecode.length))
                }
            )
        })
    })
    return bytecode
}

async function main() {
    const provider = waffle.provider
    const owner = provider.getSigner()

    const Weth = new ContractFactory(artifacts.WETH.abi, artifacts.WETH.bytecode, owner);
    const weth = await Weth.deploy(ethers.utils.parseEther('1000000'), owner);

    const Factory = new ContractFactory(artifacts.UniswapV3Factory.abi, artifacts.UniswapV3Factory.bytecode, owner);
    const factory = await Factory.deploy();

    const SwapRouter = new ContractFactory(artifacts.SwapRouter.abi, artifacts.SwapRouter.bytecode, owner);
    const swapRouter = await SwapRouter.deploy(factory.address, weth.address);

    const NFTDescriptor = new ContractFactory(artifacts.NFTDescriptor.abi, artifacts.NFTDescriptor.bytecode, owner);
    const nftDescriptor = await NFTDescriptor.deploy();

    const linkedBytecode = linkLibraries(
        {
            bytecode: artifacts.NonfungibleTokenPositionDescriptor.bytecode,
            linkReferences: {
                "NFTDescriptor.sol": {
                    NFTDescriptor: [
                        {
                            length: 20,
                            start: 1261,
                        },
                    ],
                },
            },
        },
        {
            NFTDescriptor: nftDescriptor.address,
        }
    );

    const NonfungibleTokenPositionDescriptor = new ContractFactory(artifacts.NonfungibleTokenPositionDescriptor.abi, linkedBytecode, owner);
    const nonfungibleTokenPositionDescriptor = await NonfungibleTokenPositionDescriptor.deploy(weth.address);

    const NonfungiblePositionManager = new ContractFactory(artifacts.NonfungiblePositionManager.abi, artifacts.NonfungiblePositionManager.bytecode, owner);
    const nonfungiblePositionManager = await NonfungiblePositionManager.deploy(factory.address, weth.address, nonfungibleTokenPositionDescriptor.address);

    console.log('WETH_ADDRESS=', `'${weth.address}'`)
    console.log('FACTORY_ADDRESS=', `'${factory.address}'`)
    console.log('SWAP_ROUTER_ADDRESS=', `'${swapRouter.address}'`)
    console.log('NFT_DESCRIPTOR_ADDRESS=', `'${nftDescriptor.address}'`)
    console.log('POSITION_DESCRIPTOR_ADDRESS=', `'${nonfungibleTokenPositionDescriptor.address}'`)
    console.log('POSITION_MANAGER_ADDRESS=', `'${nonfungiblePositionManager.address}'`)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });