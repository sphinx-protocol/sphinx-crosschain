const { expect } = require("chai");
const { ethers } = require("hardhat");

let account1,
  account2, Contract, contract;

beforeEach(async () => {
  [account1, account2] =
    await ethers.getSigners();
});

describe("test contract", function () {
    it("Should deploy test contract", async function () {
        Contract = await ethers.getContractFactory("test");
        contract = await Contract.deploy();
        await contract.deployed();
    })
});