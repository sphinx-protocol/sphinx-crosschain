import { expect } from "chai";
import { ethers, starknet } from "hardhat";
import { StarknetContract, Account } from 'hardhat/types';
import { utils } from '@snapshot-labs/sx';

let EthSigAuth: any;
let ethSigAuth: any;
let controller: Account;

// function getProposeCalldata(proposerAddress, metadataUri, executorAddress, usedVotingStrategies, usedVotingStrategyParams, executionParams) {
//     const usedVotingStrategyParamsFlat = flatten2DArray(usedVotingStrategyParams);
//     return [
//         proposerAddress,
//         `0x${metadataUri.bytesLength.toString(16)}`,
//         `0x${metadataUri.values.length.toString(16)}`,
//         ...metadataUri.values,
//         executorAddress,
//         `0x${usedVotingStrategies.length.toString(16)}`,
//         ...usedVotingStrategies,
//         `0x${usedVotingStrategyParamsFlat.length.toString(16)}`,
//         ...usedVotingStrategyParamsFlat,
//         `0x${executionParams.length.toString(16)}`,
//         ...executionParams
//     ];
// }

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
        // const domain = {
        //     name: 'snapshot-x',
        //     version: '1',
        //     chainId: '5', // GOERLI
        // };

        // // The named list of all type definitions
        // const proposeTypes = {
        //     Propose: [
        //       { name: 'authenticator', type: 'bytes32' },
        //       { name: 'space', type: 'bytes32' },
        //       { name: 'author', type: 'address' },
        //       { name: 'metadata_uri', type: 'string' },
        //       { name: 'executor', type: 'bytes32' },
        //       { name: 'execution_hash', type: 'bytes32' },
        //       { name: 'strategies_hash', type: 'bytes32' },
        //       { name: 'strategies_params_hash', type: 'bytes32' },
        //       { name: 'salt', type: 'uint256' },
        //     ],
        // };

        // const message: any = {
        //     authenticator: ethSigAuth.address,
        //     space: spaceStr,
        //     author: proposerEthAddress,
        //     metadata_uri: METADATA_URI,
        //     executor: paddedExecutor,
        //     execution_hash: executionHashPadded,
        //     strategies_hash: usedVotingStrategiesHashPadded1,
        //     strategies_params_hash: userVotingStrategyParamsFlatHashPadded1,
        //     salt: salt.toHex(),
        // };

        // const proposeCalldata = utils.encoding.getProposeCalldata(
        //     proposerEthAddress,
        //     metadataUriInts,
        //     executionStrategy,
        //     usedVotingStrategies1,
        //     userVotingParamsAll1,
        //     executionParams
        // );

        // const sig = await accounts[0]._signTypedData(domain, proposeTypes, message);
        // const { r, s, v } = utils.encoding.getRSVFromSig(sig);

        // await controller.invoke(ethSigAuth, 'authenticate', {
        //     r: r,
        //     s: s,
        //     v: v,
        //     salt: salt,
        //     target: spaceAddress,
        //     calldata: fakeData,
        // });

        const space = "0x0000000000000000000000000000000000000001";
        const author = accounts[0].address;

        const domain = {
            name: 'snapshot-x',
            version: '1',
            chainId: '5', // GOERLI
        };

        // The named list of all type definitions
        const proposeTypes = {
            Order: [
              { name: 'authenticator', type: 'bytes32' },
              { name: 'space', type: 'bytes32' },
              { name: 'author', type: 'address' },
              { name: 'token', type: 'address' },
              { name: 'salt', type: 'uint256' },
            ],
        };

        const message: any = {
            authenticator: ethSigAuth.address,
            // space: utils.encoding.hexPadRight("0x0000000000000000000000000000000000000001"),
            space: "0x06441c218ead27ee136579bad2c1705020e807f25d0b392e72b14e21b012b2f8",
            author: author,
            token: accounts[1].address, // token address
            salt: salt.toHex(),
        };

        console.log("message", message);

        // console.log("author", author);


        const proposeCalldata = [
            author,
            accounts[1].address, // execution strategy
        ];

        console.log("proposeCalldata", proposeCalldata);

        // const proposeCalldata2 = utils.encoding.getProposeCalldata(
        //     "author",
        //     utils.intsSequence.IntsSequence.LEFromString('Hello and welcome to Snapshot X. This is the future of governance.'),
        //     "author",
        //     ["author"],
        //     [["author"]],
        //     ["author"]
        //   );

        // console.log(proposeCalldata2);

        const sig = await accounts[0]._signTypedData(domain, proposeTypes, message);
        const { r, s, v } = utils.encoding.getRSVFromSig(sig);

        await controller.invoke(ethSigAuth, 'authenticate', {
            r: r,
            s: s,
            v: v,
            salt: salt,
            target: "0x06441c218ead27ee136579bad2c1705020e807f25d0b392e72b14e21b012b2f8",
            calldata: proposeCalldata,
        });
    });
});