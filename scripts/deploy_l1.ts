// To deploy: npx hardhat run --network goerli scripts/deploy_l1.ts
// To verify: npx hardhat verify --network goerli 0xF7D18E41638cC1790999Fc390B72c8b0A574602d "0xa4eD3aD27c294565cB0DCc993BDdCC75432D498c"

// Deployment address: 0xF7D18E41638cC1790999Fc390B72c8b0A574602d

import { ethers } from "hardhat"

async function main() {
    const [deployer] = await ethers.getSigners()
    console.log("Deploying contracts with the account:", deployer.address)
    console.log("Account balance:", (await deployer.getBalance()).toString())

    const starknetCoreContractAddress = "0xa4eD3aD27c294565cB0DCc993BDdCC75432D498c"
    const L1EthRemoteCoreContract = await ethers.getContractFactory("L1EthRemoteCore")
    const L1EthRemoteCore = await L1EthRemoteCoreContract.deploy(starknetCoreContractAddress)

    console.log("L1EthRemoteCore address:", L1EthRemoteCore.address)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
