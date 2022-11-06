import { HardhatUserConfig } from "hardhat/types"
import "@shardlabs/starknet-hardhat-plugin"
import "@nomiclabs/hardhat-ethers"
import "@nomiclabs/hardhat-etherscan"
import * as dotenv from "dotenv"
dotenv.config()

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
const config: HardhatUserConfig = {
    solidity: {
        version: "0.8.9",
        settings: {
            optimizer: {
                enabled: true,
                runs: 200,
            },
        },
    },
      starknet: {
        dockerizedVersion: "0.10.0", // alternatively choose one of the two venv options below
        // uses (my-venv) defined by `python -m venv path/to/my-venv`
        // venv: "path/to/my-venv",

        // uses the currently active Python environment (hopefully with available Starknet commands!)
        // venv: "active",
        recompile: false,
        network: "integrated-devnet",
        wallets: {
          OpenZeppelin: {
            accountName: "OpenZeppelin",
            modulePath:
              "starkware.starknet.wallets.open_zeppelin.OpenZeppelinAccount",
            accountPath: "~/.starknet_accounts",
          },
        },
      },
    networks: {
        devnet: {
            url: "http://127.0.0.1:5050",
        },
        goerli: {
            url: `https://eth-goerli.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
            chainId: 5,
            accounts: [process.env.DEPLOYER_PRIVATE_KEY || ""],
        },
        integratedDevnet: {
          url: "http://127.0.0.1:5050",
          args: ["--lite-mode"],
          stdout: "STDOUT",
          // venv: "active",
          // dockerizedVersion: "<DEVNET_VERSION>",
        },
        hardhat: {},
    },
    etherscan: {
        apiKey: process.env.ETHERSCAN_API_KEY,
    },
}

export default config
