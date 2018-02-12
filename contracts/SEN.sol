pragma solidity ^0.4.18;

import "./MiniMeToken.sol";


contract SEN is MiniMeToken {
  function SEN() public MiniMeToken(
    0x0,                // no parent token
    0,                  // no snapshot block number from parent
    "Consensus Token",  // Token name
    18,                 // Decimals
    "SEN"              // Symbolh
  )
  {}
}
