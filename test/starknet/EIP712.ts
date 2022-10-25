import { expect } from "chai";
import { ethers, starknet, config } from "hardhat";
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
        console.log("deployed");
    });

    it("should validate an ethereum signature", async function () {
        const accounts = await ethers.getSigners();
        const salt: utils.splitUint256.SplitUint256 = utils.splitUint256.SplitUint256.fromHex('0x1');
        const amount: utils.splitUint256.SplitUint256 = utils.splitUint256.SplitUint256.fromHex('0x3E8');

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
              { name: 'market', type: 'bytes32' },
              { name: 'author', type: 'address' },
              { name: 'token', type: 'address' },
              { name: 'amount', type: 'uint256' },
              { name: 'price', type: 'uint256' },
              { name: 'strategy', type: 'uint256' },
              { name: 'salt', type: 'uint256' },
            ],
        };

        const message: any = {
            authenticator: ethSigAuth.address,
            market: "0x06441c218ead27ee136579bad2c1705020e807f25d0b392e72b14e21b012b2f8",
            author: author, // author
            token: "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d", // token address
            amount: 1000,
            price: 200,
            strategy: 1,
            salt: salt.toHex(),
        };

        console.log("message", message);

        const proposeCalldata = [
            author,
            "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d", // token_address
        ];

        console.log("proposeCalldata", proposeCalldata);
        const sig = await accounts[0]._signTypedData(domain, proposeTypes, message);
        console.log("sig", sig);
        console.log("account", accounts[0].address);
        const { r, s, v } = utils.encoding.getRSVFromSig(sig);
        console.log("r", r);
        console.log("s", s);
        console.log("v", v);

        await controller.invoke(ethSigAuth, 'authenticate', {
            price: 200,
            amount: 1000,
            strategy: 1,
            r: r,
            s: s,
            v: v,
            salt: salt,
            market: "0x06441c218ead27ee136579bad2c1705020e807f25d0b392e72b14e21b012b2f8",
            calldata: proposeCalldata,
        });
    });
});