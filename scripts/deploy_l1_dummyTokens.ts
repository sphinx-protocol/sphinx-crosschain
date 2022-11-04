// To deploy: npx hardhat run --network goerli scripts/deploy_l1_dummyTokens.ts
// Deployment address: USDC address: 0x41FE9AC7a76D7a20794551a3E8Ba445c3C635106
// DAI address: 0x45f2B2E318412d1f8102D1369B4C811421017a34
// WETH address: 0x0e9A9Ac3Aaf264Af4F6716C2FC982CF58F3E591D

import { ethers } from "hardhat"

async function main() {
    const [deployer] = await ethers.getSigners()
    console.log("Deploying contracts with the account:", deployer.address)
    console.log("Account balance:", (await deployer.getBalance()).toString())

    const Token = await ethers.getContractFactory("ERC20Fake");
    const USDC = await Token.deploy("USDC","USDC");
    const DAI = await Token.deploy("DAI","DAI");
    const WETH = await Token.deploy("WETH","WETH");

    console.log("USDC address:", USDC.address);
    console.log("DAI address:", DAI.address);
    console.log("WETH address:", WETH.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
