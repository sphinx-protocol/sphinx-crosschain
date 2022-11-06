# Getting started

Requires docker.
You can run the test file that verifies the Ethereum EIP 712 signature on Starknet:

```shell
npx install
npx hardhat starknet-compile contracts/starknet/l2_eth_remote_eip_712.cairo --disable-hint-validation
npx hardhat test
```
