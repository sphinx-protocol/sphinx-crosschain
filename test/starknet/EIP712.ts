import { expect } from "chai";
import { ethers, starknet } from "hardhat";
import { StarknetContract, Account } from 'hardhat/types';
import { utils } from '@snapshot-labs/sx';

let EthSigAuth: any;
let ethSigAuth: any;
let controller: Account;

describe("EthSigAuth", function () {
    before(async function () {
        controller = (await starknet.deployAccount('OpenZeppelin'));
        EthSigAuth = await starknet.getContractFactory("EthSig");
        ethSigAuth = await EthSigAuth.deploy();
    });

    it("should validate an ethereum signature", async function () {
        const accounts = await ethers.getSigners();
        const salt: utils.splitUint256.SplitUint256 = utils.splitUint256.SplitUint256.fromHex('0x1');
        // All properties on a domain are optional
        const domain = {
            name: 'Ether Mail',
            version: '1',
            chainId: 1,
            verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC'
        };

        // The named list of all type definitions
        const types = {
            Person: [
                { name: 'name', type: 'string' },
                { name: 'wallet', type: 'address' }
            ],
            Mail: [
                { name: 'from', type: 'Person' },
                { name: 'to', type: 'Person' },
                { name: 'contents', type: 'string' }
            ]
        };

        // The data to sign
        const value = {
            from: {
                name: 'Cow',
                wallet: '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826'
            },
            to: {
                name: 'Bob',
                wallet: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB'
            },
            contents: 'Hello, Bob!'
        };

        const sig = await accounts[0]._signTypedData(domain, types, value);
        const { r, s, v } = utils.encoding.getRSVFromSig(sig);

        // await controller.invoke(ethSigAuth, 'authenticate', {
        //     r: r,
        //     s: s,
        //     v: v,
        //     salt: salt,
        //     target: spaceAddress,
        //     function_selector: PROPOSE_SELECTOR,
        //     calldata: fakeData,
        //   });
          
        // console.log("sig", sig);
        // console.log("r, s, v", r, s, v);
        });
});

// it('Should not authenticate an invalid signature', async () => {
//     try {
//       const accounts = await ethers.getSigners();
//       const salt: utils.splitUint256.SplitUint256 = utils.splitUint256.SplitUint256.fromHex('0x1');
//       const spaceStr = utils.encoding.hexPadRight(space.address);
//       const executionHashPadded = utils.encoding.hexPadRight(executionHash);
//       const usedVotingStrategiesHashPadded1 = utils.encoding.hexPadRight(usedVotingStrategiesHash1);
//       const userVotingStrategyParamsFlatHashPadded1 = utils.encoding.hexPadRight(
//         userVotingStrategyParamsFlatHash1
//       );
//       const paddedExecutor = utils.encoding.hexPadRight(vanillaExecutionStrategy.address);
//       const message: Propose = {
//         authenticator: ethSigAuth.address,
//         space: spaceStr,
//         author: proposerEthAddress,
//         metadata_uri: METADATA_URI,
//         executor: paddedExecutor,
//         execution_hash: executionHashPadded,
//         strategies_hash: usedVotingStrategiesHashPadded1,
//         strategies_params_hash: userVotingStrategyParamsFlatHashPadded1,
//         salt: salt.toHex(),
//       };

//       const fakeData = [...proposeCalldata];

//       const sig = await accounts[0]._signTypedData(domain, proposeTypes, message);
//       const { r, s, v } = utils.encoding.getRSVFromSig(sig);

//       // Data is signed with accounts[0] but the proposer is accounts[1] so it should fail
//       fakeData[0] = accounts[1].address;

//       await controller.invoke(ethSigAuth, 'authenticate', {
//         r: r,
//         s: s,
//         v: v,
//         salt: salt,
//         target: spaceAddress,
//         function_selector: PROPOSE_SELECTOR,
//         calldata: fakeData,
//       });
//       expect(1).to.deep.equal(2);
//     } catch (err: any) {
//       expect(err.message).to.contain('Invalid signature.');
//     }
//   });