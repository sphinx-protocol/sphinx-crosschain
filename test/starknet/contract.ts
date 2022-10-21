import { expect } from "chai";
import { starknet } from "hardhat";

let contractFactory: any;

describe("Starknet", function () {
    before(async function () {
        // assumes contracts have been compiled
        contractFactory = await starknet.getContractFactory("contract");
    });

    it("should deploy a starknet contract", async function () {
        await contractFactory.deploy();
        // try {
        //     await contractFactory.deploy();
        //     expect.fail("Should have failed on not passing constructor calldata.");
        // } catch (err: any) {
        //     expect(err.message).to.equal("constructor: Expected 1 argument, got 0.");
        // }
    });
});