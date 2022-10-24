// import { expect } from "chai";
// import { starknet } from "hardhat";

// let contract: any;
// let Contract: any;
// let account: any;

// describe("Starknet", function () {
//     before(async function () {
//         account = (await starknet.deployAccount('OpenZeppelin'));
//         Contract = await starknet.getContractFactory("contract");
//         contract = await Contract.deploy();
//     });

//     it("should deploy a starknet contract", async function () {
//         let {res} = await contract.call("get_balance");
//         // console.log(res);
//         await account.invoke(contract, "increase_balance", {amount:2});
//         const response = await contract.call("get_balance");
//         // console.log(response.res);
//     });
// });