pragma solidity ^0.4.18;

import "./interface/TokenController.sol";
import "./interface/Controlled.sol";
import "./interface/MiniMeTokenI.sol";

/*
  Copyright 2017, Anton Egorov (Mothership Foundation)
  Copyright 2017, An Hoang Phan Ngo (Mothership Foundation)

  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/


contract Distribution is Controlled, TokenController {

  /// Record tx details for each minting operation
  struct Transaction {
    uint256 amount;
    string paidCurrency;
    string paidTxID;
  }

  MiniMeTokenI public token;

  address public reserveWallet; // Team's wallet address

  uint256 public totalSupplyCap; // Total Token supply to be generated
  uint256 public totalReserve; // A number of tokens to reserve for the team/bonuses

  uint256 public finalizedBlock;

  /// Record all transaction details for all minting operations
  mapping (address => Transaction[]) allTransactions;

  /// @param _token Address of the SEN token contract
  ///  the contribution finalizes.
  /// @param _reserveWallet Team's wallet address to distribute reserved pool
  /// @param _totalSupplyCap Maximum amount of tokens to generate during the contribution
  /// @param _totalReserve A number of tokens to reserve for the team/bonuses
  function Distribution(
    address _token,
    address _reserveWallet,
    uint256 _totalSupplyCap,
    uint256 _totalReserve
  ) public onlyController
  {
    // Initialize only once
    assert(address(token) == 0x0);

    token = MiniMeTokenI(_token);
    reserveWallet = _reserveWallet;

    require(_totalReserve < _totalSupplyCap);
    totalSupplyCap = _totalSupplyCap;
    totalReserve = _totalReserve;

    assert(token.totalSupply() == 0);
    assert(token.decimals() == 18); // Same amount of decimals as ETH
  }

  function distributionCap() public constant returns (uint256) {
    return totalSupplyCap - totalReserve;
  }

  /// @notice This method can be called the distribution cap is reached only
  function finalize() public onlyController {
    assert(token.totalSupply() >= distributionCap());

    // Mint reserve pool
    doMint(reserveWallet, totalReserve);

    finalizedBlock = getBlockNumber();
    token.finalize(); // Token becomes unmintable after this

    // Distribution controller becomes a Token controller
    token.changeController(controller);

    Finalized();
  }

//////////
// TokenController functions
//////////

  function proxyMintTokens(
    address _th,
    uint256 _amount,
    string _paidCurrency,
    string _paidTxID
  ) public onlyController returns (bool)
  {
    require(_th != 0x0);

    require(_amount + token.totalSupply() <= distributionCap());

    doMint(_th, _amount);
    addTransaction(
      allTransactions[_th],
      _amount,
      _paidCurrency,
      _paidTxID);

    Purchase(
      _th,
      _amount,
      _paidCurrency,
      _paidTxID);

    return true;
  }

  function onTransfer(address, address, uint256) public returns (bool) {
    return false;
  }

  function onApprove(address, address, uint256) public returns (bool) {
    return false;
  }

  //////////
  // Safety Methods
  //////////

  /// @notice This method can be used by the controller to extract mistakenly
  ///  sent tokens to this contract.
  /// @param _token The address of the token contract that you want to recover
  ///  set to 0 in case you want to extract ether.
  function claimTokens(address _token) public onlyController {
    if (token.controller() == address(this)) {
      token.claimTokens(_token);
    }
    if (_token == 0x0) {
      controller.transfer(this.balance);
      return;
    }

    ERC20Token otherToken = ERC20Token(_token);
    uint256 balance = otherToken.balanceOf(this);
    otherToken.transfer(controller, balance);
    ClaimedTokens(_token, controller, balance);
  }

  //////////////////////////////////
  // Minting tokens and oraclization
  //////////////////////////////////

  /// Total transaction count belong to an address
  function totalTransactionCount(address _owner) public constant returns(uint) {
    return allTransactions[_owner].length;
  }

  /// Query a transaction details by address and its index in transactions array
  function getTransactionAtIndex(address _owner, uint index) public constant returns(
    uint256 _amount,
    string _paidCurrency,
    string _paidTxID
  ) {
    _amount = allTransactions[_owner][index].amount;
    _paidCurrency = allTransactions[_owner][index].paidCurrency;
    _paidTxID = allTransactions[_owner][index].paidTxID;
  }

  /// Save transaction details belong to an address
  /// @param  transactions all transactions belong to an address
  /// @param _amount amount of tokens issued in the transaction
  /// @param _paidCurrency currency paid, e.g.: BTC, LTC, ETH, etc
  /// @param _paidTxID blockchain tx_hash in _paidCurrency blockchain
  function addTransaction(
    Transaction[] storage transactions,
    uint _amount,
    string _paidCurrency,
    string _paidTxID
    ) internal
  {
    Transaction storage newTx = transactions[transactions.length++];
    newTx.amount = _amount;
    newTx.paidCurrency = _paidCurrency;
    newTx.paidTxID = _paidTxID;
  }

  function doMint(address _th, uint256 _amount) internal {
    assert(token.mintTokens(_th, _amount));
  }

//////////
// Testing specific methods
//////////

  /// @notice This function is overridden by the test Mocks.
  function getBlockNumber() internal constant returns (uint256) { return block.number; }


////////////////
// Events
////////////////
  event ClaimedTokens(address indexed _token, address indexed _controller, uint256 _amount);
  event Purchase(
    address indexed _owner,
    uint256 _amount,
    string _paidCurrency,
    string _paidTxID
  );
  event Finalized();
}
