// To deploy: npx hardhat run --network alpha scripts/deploy_l2.ts
// To verify: npx hardhat starknet-verify --starknet-network alpha --path contracts/starknet/StorageProver.cairo --compiler-version 0.9.1 --address 0x01842fdb2938386ee745ea5d77cea68736d46665f510fea7ed45cd8110e39937

// npx hardhat starknet-deploy --starknet-network alpha-goerli starknet-artifacts/contracts/starknet/DummyProver.cairo --inputs "795768490102041104253562152038687745547332906247"
// Deployment address: 0x016f2a04efe50e2b82fb14581e8c8835eb2aba76a7b27267939d8691549e0262

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
