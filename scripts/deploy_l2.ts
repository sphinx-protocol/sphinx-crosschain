// To deploy: npx hardhat run --network alpha scripts/deploy_l2.ts
// To verify: npx hardhat starknet-verify --starknet-network alpha --path contracts/starknet/StorageProver.cairo --compiler-version 0.9.1 --address 0x01842fdb2938386ee745ea5d77cea68736d46665f510fea7ed45cd8110e39937

// npx hardhat starknet-deploy --starknet-network alpha-goerli starknet-artifacts/contracts/starknet/DummyProver.cairo --inputs "0xc489D8139DEE2D3448785959251541990808c02C"
// Deployment address: 0x3a4b0e85260818d7bfca160eac17ed663a6f4229c7d469037c4a6ff92e4467b

import { starknet } from "hardhat"

async function main() {
    const L1GatewayAddress = 795768490102041104253562152038687745547332906247

    const storageProverFactory = await starknet.getContractFactory("DummyProver")
    const storageProver = await storageProverFactory.deploy({
        _L1_gateway_address: L1GatewayAddress,
    })

    console.log("StorageProver address:", storageProver.address)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
