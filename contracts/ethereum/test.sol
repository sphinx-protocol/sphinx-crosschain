//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

/**
 * @dev Interface for StarkNet core contract, used to consume messages passed from L2 to L1.
 */
interface IStarknetCore {
    /**
     * @dev Consumes a message that was sent from an L2 contract. Returns the hash of the message.
     */
    function consumeMessageFromL2(
        uint256 fromAddress,
        uint256[] calldata payload
    ) external;
}

contract EthereumDepositContract{

  IStarknetCore starknetCore;
  constructor(IStarknetCore _starknetCore) {
    starknetCore = _starknetCore;
  }

  function remoteDepositAccount() external {

  }
  
  function remoteWithdrawAccount() external {

  }
}