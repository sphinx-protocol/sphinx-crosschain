// To deploy: npx hardhat run --network alpha scripts/deploy_l2.ts
// To verify: npx hardhat starknet-verify --starknet-network alpha --path contracts/starknet/StorageProver.cairo --compiler-version 0.9.1 --address 0x01842fdb2938386ee745ea5d77cea68736d46665f510fea7ed45cd8110e39937

// npx hardhat starknet-deploy --starknet-network alpha-goerli starknet-artifacts/contracts/starknet/DummyProver.cairo --inputs "429955882159492657148005544722965770209018004439"
// Deployment address: 0x06de6fd6b0cb61b882f0c666bccd4361f8de5c56b32434fcc02d8b6ee2b972ff

import { starknet } from "hardhat"

async function main() {
    const L1GatewayAddress = 429955882159492657148005544722965770209018004439n

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
