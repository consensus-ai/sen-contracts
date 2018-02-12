pragma solidity ^0.4.18;

import "../Distribution.sol";


// @dev DistributionMock mocks current block number
contract DistributionMock is Distribution {
  uint mock_blockNumber = 100;

  function DistributionMock(
    address _token,
    address _reserveWallet,
    uint256 _totalSupplyCap,
    uint256 _totalReserve
  ) public Distribution(
    _token,
    _reserveWallet,
    _totalSupplyCap,
    _totalReserve)
  {}

  function setMockedBlockNumber(uint _b) public {
    mock_blockNumber = _b;
  }

  function getBlockNumber() internal constant returns (uint) {
    return mock_blockNumber;
  }
}
