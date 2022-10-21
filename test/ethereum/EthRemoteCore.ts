const { expect } = require("chai");
const { ethers } = require("hardhat");

let account1,
  account2, EthRemoteCore, ethRemoteCore;

beforeEach(async () => {
  [account1, account2] =
    await ethers.getSigners();
});

describe("test contract", function () {
    it("Should deploy test contract", async function () {
      EthRemoteCore = await ethers.getContractFactory("EthRemoteCore");
      ethRemoteCore = await EthRemoteCore.deploy("0x0000000000000000000000000000000000000000");
        await ethRemoteCore.deployed();
    })
});