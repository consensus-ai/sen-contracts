pragma solidity ^0.4.18;

import "./Controlled.sol";


/// @dev Burnable introduces a burner role, which could be used to destroy
///  tokens. The burner address could be changed by himself.
contract Burnable is Controlled {
  address public burner;

  /// @notice The function with this modifier could be called by a controller
  /// as well as by a burner. But burner could use the onlt his/her address as
  /// a target.
  modifier onlyControllerOrBurner(address target) {
    assert(msg.sender == controller || (msg.sender == burner && msg.sender == target));
    _;
  }

  modifier onlyBurner {
    assert(msg.sender == burner);
    _;
  }

  /// Contract creator become a burner by default
  function Burnable() public { burner = msg.sender;}

  /// @notice Change a burner address
  /// @param _newBurner The new burner address
  function changeBurner(address _newBurner) public onlyBurner {
    burner = _newBurner;
  }
}
