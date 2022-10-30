import { expect } from "chai";
import { ethers, starknet, config } from "hardhat";
import { StarknetContract, Account } from 'hardhat/types';
import { utils } from '@snapshot-labs/sx';

let Authenticator: any;
let authenticator: any;
let controller: Account;

describe("Authenticator", function () {
    before(async function () {
        controller = (await starknet.deployAccount('OpenZeppelin'));
        Authenticator = await starknet.getContractFactory("l2_eth_remote_eip_712");
        authenticator = await Authenticator.deploy({owner:"0x2fe23f4cc4eb278306a9b500c8fb696c74229dae4aee91b16ab06bdb099c0d3"});
        console.log("deployed");
    });

    it("should create domain hash", async function () {
        const domain = {
            name: 'stark-x',
            version: '1',
            chainId: '5', // GOERLI
        };
        const domainHash = ethers.utils._TypedDataEncoder.hashDomain(domain);
        console.log(domainHash);
    });

    // it("should validate an ethereum signature", async function () {
    //     const accounts = await ethers.getSigners();
    //     const salt: utils.splitUint256.SplitUint256 = utils.splitUint256.SplitUint256.fromHex('0x1');
    //     const amount: utils.splitUint256.SplitUint256 = utils.splitUint256.SplitUint256.fromHex('0x3E8');

    //     const author = accounts[0].address;

    //     const domain = {
    //         name: 'stark-x',
    //         version: '1',
    //         chainId: '5', // GOERLI
    //     };

    //     // The named list of all type definitions
    //     const proposeTypes = {
    //         Order: [
    //           { name: 'authenticator', type: 'bytes32' },
    //           { name: 'user', type: 'address' },
    //           { name: 'base', type: 'bytes32' },
    //           { name: 'quote', type: 'bytes32' },
    //           { name: 'amount', type: 'uint256' },
    //           { name: 'price', type: 'uint256' },
    //           { name: 'strategy', type: 'uint256' },
    //           { name: 'salt', type: 'uint256' },
    //         ],
    //     };

    //     const message: any = {
    //         authenticator: authenticator.address,
    //         user: author, // author
    //         base: "0x06441c218ead27ee136579bad2c1705020e807f25d0b392e72b14e21b012b2f8",
    //         quote: "0x12341c218ead27ee136579bad2c1705020e807f25d0b392e72b14e21b0123333",
    //         amount: 1000,
    //         price: 200,
    //         strategy: 1,
    //         salt: salt.toHex(),
    //     };

    //     console.log("message", message);

    //     const sig = await accounts[0]._signTypedData(domain, proposeTypes, message);
    //     console.log("sig", sig);
    //     console.log("account", accounts[0].address);
    //     const { r, s, v } = utils.encoding.getRSVFromSig(sig);
    //     console.log("r", r);
    //     console.log("s", s);
    //     console.log("v", v);

    //     console.log("input", {
    //         price: 200,
    //         amount: 1000,
    //         strategy: 1,
    //         user: accounts[0].address,
    //         base: "0x06441c218ead27ee136579bad2c1705020e807f25d0b392e72b14e21b012b2f8",
    //         quote: "0x12341c218ead27ee136579bad2c1705020e807f25d0b392e72b14e21b0123333",
    //         r: r,
    //         s: s,
    //         v: v,
    //         salt: salt,
    //     });

    //     const proposeCalldata = [
    //         author,
    //         "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d", // token_address
    //     ];

    //     await controller.invoke(authenticator, 'authenticate', {
    //         price: 200,
    //         amount: 1000,
    //         strategy: 1,
    //         user: accounts[0].address,
    //         base: "0x06441c218ead27ee136579bad2c1705020e807f25d0b392e72b14e21b012b2f8",
    //         quote: "0x12341c218ead27ee136579bad2c1705020e807f25d0b392e72b14e21b0123333",
    //         r: r,
    //         s: s,
    //         v: v,
    //         salt: salt,
    //         calldata: proposeCalldata,
    //     });
    // });

    it("should validate an ethereum signature", async function () {
        const accounts = await ethers.getSigners();
        const salt: utils.splitUint256.SplitUint256 = utils.splitUint256.SplitUint256.fromHex('0x1');
        const amount: utils.splitUint256.SplitUint256 = utils.splitUint256.SplitUint256.fromHex('0x3E8');

        const author = accounts[0].address;

        const domain = {
            name: 'stark-x',
            version: '1',
            chainId: '5', // GOERLI
        };

        // The named list of all type definitions
        const proposeTypes = {
            Order: [
              { name: 'authenticator', type: 'bytes32' },
              { name: 'base_asset', type: 'bytes32' },
              { name: 'author', type: 'address' },
              { name: 'quote_asset', type: 'bytes32' },
              { name: 'amount', type: 'uint256' },
              { name: 'price', type: 'uint256' },
              { name: 'strategy', type: 'uint256' },
            //   { name: 'chainId', type: 'felt' },
            //   { name: 'orderId', type: 'felt' },
              { name: 'salt', type: 'uint256' },
            ],
        };

        const message: any = {
            authenticator: authenticator.address,
            base_asset: "0x06441c218ead27ee136579bad2c1705020e807f25d0b392e72b14e21b012b2f8",
            author: author, // author
            quote_asset: "0x06441c218ead27ee136579bad2c1705020e807f25d0b392e72b14e21b012b233", // token address
            amount: 1000,
            price: 200,
            strategy: 1,
            salt: salt.toHex(),
        };

        console.log("message", message);

        const proposeCalldata = [
            author,
            "0x06441c218ead27ee136579bad2c1705020e807f25d0b392e72b14e21b012b233", // quote_token 
        ];

        console.log("proposeCalldata", proposeCalldata);
        const sig = await accounts[0]._signTypedData(domain, proposeTypes, message);
        console.log("sig", sig);
        console.log("account", accounts[0].address);
        const { r, s, v } = utils.encoding.getRSVFromSig(sig);
        console.log("r", r);
        console.log("s", s);
        console.log("v", v);

        await controller.invoke(authenticator, 'authenticate', {
            price: 200,
            amount: 1000,
            strategy: 1,
            r: r,
            s: s,
            v: v,
            salt: salt,
            base_asset: "0x06441c218ead27ee136579bad2c1705020e807f25d0b392e72b14e21b012b2f8",
            calldata: proposeCalldata,
        });
    });
});