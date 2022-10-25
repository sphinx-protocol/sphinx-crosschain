//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./IERC20.sol";

/**
 * @dev Interface for StarkNet core contract, used to consume messages passed from L2 to L1.
 */
interface IStarknetCore {
    function consumeMessageFromL2(
        uint256 fromAddress,
        uint256[] calldata payload
    ) external;

    function sendMessageToL2(
        uint256 toAddress,
        uint256 selector,
        uint256[] calldata payload
    ) external payable returns (bytes32);
}

contract EthRemoteCore{
  address public owner;
  bool public proverAddressIsSet = false;
  uint256 public l2StorageProverAddress;
  uint256 public SUBMIT_L1_BLOCKHASH_SELECTOR = 598342674068027518481179578557554850038206119856216505601406522348670006916;
  mapping (bytes32 => bool) public nullifiers;
  IStarknetCore public starknetCore;
  
  constructor(IStarknetCore _starknetCore) {
    starknetCore = _starknetCore;
    owner = msg.sender;
  }

  function setProverAddress(uint256 _l2StorageProverAddress) external {
    require(msg.sender == owner, "Only owner");
    l2StorageProverAddress = _l2StorageProverAddress;
    proverAddressIsSet = true;
  }

  // Note: this logic assumes that the messaging layer will never fail.
  // https://www.cairo-lang.org/docs/hello_starknet/l1l2.html
  function remoteDepositAccount(uint256 toAddress, uint256 selector, address tokenAddress, uint256 amount) external payable {
    require(proverAddressIsSet, "No prover");
    IERC20(tokenAddress).transfer(address(this), amount);

    // Construct the L1 -> L2 message payload.
    uint256[] memory payload = new uint256[](4);
    payload[0] = uint160(msg.sender);
    payload[1] = uint160(tokenAddress);
    payload[2] = amount;
    payload[3] = block.number;
    // create nonce instead

    // Pass in a message fee. 
    /// starknetSelector(receive_from_l1) 598342674068027518481179578557554850038206119856216505601406522348670006916
    starknetCore.sendMessageToL2{value: msg.value}(toAddress, SUBMIT_L1_BLOCKHASH_SELECTOR, payload);
  }
  
  // Note: this logic assumes that the messaging layer will never fail.
  function remoteWithdrawAccount(uint256 tokenAddress, uint amount, uint256 userAddress, uint256 blocknumber) external {
    require(proverAddressIsSet, "No prover");

    // Construct the L2 -> L1 withdrawal message payload.
    uint256[] memory payload = new uint256[](3);
    payload[0] = userAddress;
    payload[1] = tokenAddress;
    payload[2] = amount;
    payload[3] = blocknumber;

    // Fails if message doesn't exist.
    starknetCore.consumeMessageFromL2(l2StorageProverAddress, payload);

    address convertedUserAddress = address(uint160(userAddress));
    address convertedTokendAddress = address(uint160(userAddress));

    // hash of payload is the nullifier to avoid double spending
    bytes32 nullifier = keccak256(abi.encodePacked(payload));
    require(!nullifiers[nullifier], "Double spend");

    IERC20(convertedTokendAddress).transfer(convertedUserAddress, amount);
    nullifiers[nullifier] = true;
  }
}