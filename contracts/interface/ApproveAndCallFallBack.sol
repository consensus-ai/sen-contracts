pragma solidity ^0.4.18;


contract ApproveAndCallFallBack {
  function receiveApproval(
    address _from,
    uint256 _amount,
    address _token,
    bytes _data) public;
}
