// SPDX-License-Identifier: UNLICENSED
// ALL RIGHTS RESERVED
// UNCX by SDDTech reserves all rights on this code. You may NOT copy these contracts.

// This contract auto increments a preexisting Unicrypt liquidity lock using Gelato's decentralised bot network.

pragma solidity ^0.8.0;

import "./libraries/Ownable.sol";
import "./libraries/TransferHelper.sol";

interface IResolver {
  function checker()
    external
    view
    returns (bool canExec, bytes memory execPayload);
}

interface IUniFactory {
  function getPair(address tokenA, address tokenB)
    external
    view
    returns (address);
}

interface IUniswapV2Locker {
  function incrementLock(uint256 _lockID, uint256 _amount) external;
}

interface IERC20 {
  function balanceOf(address account) external view returns (uint256);
}

contract TokenAutomator is IResolver, Ownable {
  address private constant GelatoOpsGoerli =
    address(0xc1C6805B857Bef1f412519C4A842522431aFed39);
  uint256 private gasThreshold = 80 gwei;

  address public lockerAddress;
  address public lpToken; // The LP token
  uint256 public lockID; // Unicrypt liquidity lock nonce (lock ID)
  uint256 public amount; // threshold token amount which triggers the Gelato increment action.

  constructor(
    address _lockerAddress,
    address _lpTokenAddress,
    uint256 _lockID,
    uint256 _amount
  ) {
    lockerAddress = _lockerAddress;
    lpToken = _lpTokenAddress;
    lockID = _lockID;
    amount = _amount;
  }

  modifier onlyOpsAdmin() {
    require(
      owner() == _msgSender() || GelatoOpsGoerli == _msgSender(),
      "Not authorised to increment lock"
    );
    _;
  }

  function incrementLpLock(uint256 _amount) public onlyOpsAdmin {
    TransferHelper.safeApprove(lpToken, lockerAddress, _amount);
    IUniswapV2Locker(lockerAddress).incrementLock(lockID, _amount);
  }

  function updateIncrementedLock(
    address _lockerAddress,
    address _lpToken,
    uint256 _lockID,
    uint256 _amount
  ) external onlyOwner {
    lockerAddress = _lockerAddress;
    lpToken = _lpToken;
    lockID = _lockID;
    amount = _amount;
  }

  function updateGasThreshold(uint256 _gasThreshold) external onlyOwner {
    gasThreshold = _gasThreshold;
  }

  function withdrawTokens(address _token) external onlyOwner {
    uint256 amountToWithdraw = IERC20(_token).balanceOf(address(this));

    TransferHelper.safeApprove(address(_token), owner(), amountToWithdraw);
    TransferHelper.safeTransfer(address(_token), owner(), amountToWithdraw);
  }

  function checker()
    external
    view
    override
    returns (bool canExec, bytes memory execPayload)
  {
    if (tx.gasprice > gasThreshold) {
      return (false, bytes("Gas above threshold"));
    }

    if (IERC20(lpToken).balanceOf(address(this)) < amount) {
      return (false, bytes("Amount threshold not met"));
    }

    execPayload = abi.encodeWithSelector(this.incrementLpLock.selector, amount);

    return (true, execPayload);
  }
}
