// npx hardhat starknet-deploy --starknet-network alpha-goerli starknet-artifacts/contracts/starknet/l2_eth_remote_eip_712_dummy.cairo
// Deployment address: 0x3a4b0e85260818d7bfca160eac17ed663a6f4229c7d469037c4a6ff92e4467b

import { starknet } from "hardhat"

async function main() {
    const storageProverFactory = await starknet.getContractFactory("l2_eth_remote_eip_712_dummy")
    const storageProver = await storageProverFactory.deploy({
    })

    console.log("l2_eth_remote_eip_712_dummy address:", storageProver.address)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
