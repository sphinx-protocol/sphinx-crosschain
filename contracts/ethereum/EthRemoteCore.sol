//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./IERC20.sol";

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

contract EthRemoteCore{
  IStarknetCore starknetCore;
  // user address => token address => amount
  mapping (address => mapping (address => uint)) public userStakedAmountOfTokens;
  constructor(IStarknetCore _starknetCore) {
    starknetCore = _starknetCore;
  }

  function remoteDepositAccount(address tokenContract, uint amount) external {
    IERC20(tokenContract).transfer(address(this), amount);
    userStakedAmountOfTokens[tokenContract][msg.sender] += amount;
  }
  
  function remoteWithdrawAccount(address tokenContract, uint amount) external {
    require(userStakedAmountOfTokens[tokenContract][msg.sender] >= amount, "Not enough tokens");
    IERC20(tokenContract).transfer(address(this), amount);
    userStakedAmountOfTokens[tokenContract][msg.sender] -= amount;
  }
}