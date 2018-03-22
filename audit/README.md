# Mothership Smart Contract Audit Report
<br>

## Preamble
This audit report was undertaken by <b>BlockchainLabs.nz</b> for the purpose of providing feedback to <b>Mothership</b>. <br>It has subsequently been shared publicly without any express or implied warranty.

Solidity contracts were sourced from the public Github repo [consensus-ai/sen-contracts](hhttps://github.com/consensus-ai/sen-contracts) prior to commit [b2cd76f851f44f421530eb31ad85e33235a87355](https://github.com/BlockchainLabsNZ/mothership-sen/tree/b2cd76f851f44f421530eb31ad85e33235a87355) - we would encourage all community members and token holders to make their own assessment of the contracts.

<br>

## Scope
The following contract was a subject for static, dynamic and functional analyses:  

- [SEN.sol](https://github.com/BlockchainLabsNZ/mothership-sen/blob/master/contracts/SEN.sol)
- [MiniMeToken.sol](https://github.com/BlockchainLabsNZ/mothership-sen/blob/master/contracts/MiniMeToken.sol)
- [Distribution.sol](https://github.com/BlockchainLabsNZ/mothership-sen/blob/master/contracts/Distribution.sol)

<br>

## Focus areas
The audit report is focused on the following key areas - though this is not an exhaustive list.


### Correctness
- No correctness defects uncovered during static analysis?
- No implemented contract violations uncovered during execution?
- No other generic incorrect behaviour detected during execution?
- Adherence to adopted standards such as ERC20?

### Testability
- Test coverage across all functions and events?
- Test cases for both expected behaviour and failure modes?
- Settings for easy testing of a range of parameters?
- No reliance on nested callback functions or console logs?
- Avoidance of test scenarios calling other test scenarios?

### Security
- No presence of known security weaknesses?
- No funds at risk of malicious attempts to withdraw/transfer?
- No funds at risk of control fraud?
- Prevention of Integer Overflow or Underflow?

### Best Practice
- Explicit labeling for the visibility of functions and state variables?
- Proper management of gas limits and nested execution?
- Latest version of the Solidity compiler?

<br>

## Analysis

- [Static analysis](static-analysis.md)
- [Dynamic analysis](dynamic-analysis.md)
- [Test coverage](test-coverage.md)
- [Functional tests](functional-tests.md)
- [Gas consumption](gas-consumption-report.md)

<br>

## Issues

### Severity Description
<table>
<tr>
	<td>Minor</td>
	<td>A defect that does not have a material impact on the contract execution and is likely to be subjective.</td>
</tr>
<tr>
	<td>Moderate</td>
	<td>A defect that could impact the desired outcome of the contract execution in a specific scenario.</td>
</tr>
<tr>
	<td>Major</td>
	<td> A defect that impacts the desired outcome of the contract execution or introduces a weakness that may be exploited.</td>
</tr>
<tr>
	<td>Critical</td>
	<td>A defect that presents a significant security vulnerability or failure of the contract across a range of scenarios.</td>
</tr>
</table>

### Minor

- **Use view or pure instead of constant modifier** - `Best practices`
<br>MiniMeToken.sol, lines: [189](https://github.com/BlockchainLabsNZ/mothership-sen/blob/b2cd76f851f44f421530eb31ad85e33235a87355/contracts/MiniMeToken.sol#L189), [222](https://github.com/BlockchainLabsNZ/mothership-sen/blob/b2cd76f851f44f421530eb31ad85e33235a87355/contracts/MiniMeToken.sol#L222), [248](https://github.com/BlockchainLabsNZ/mothership-sen/blob/b2cd76f851f44f421530eb31ad85e33235a87355/contracts/MiniMeToken.sol#L248), [260](https://github.com/BlockchainLabsNZ/mothership-sen/blob/b2cd76f851f44f421530eb31ad85e33235a87355/contracts/MiniMeToken.sol#L260), ... [View on GitHub](https://github.com/BlockchainLabsNZ/mothership-sen/issues/5)

  - [x] Fixed. [d70549](https://github.com/consensus-ai/sen-contracts/pull/3/commits/d70549db361b9a52cb8136fc77fb2c3e03c53182)

- **Gas costs can be reduced by using bytes32 instead of string in proxyMintTokens()** - `Gas-optimization` <br>The `proxyMintTokens` function takes 2 parameters `string _paidCurrency, string _paidTxID`. It is possible to save on gas costs each time this function is called by changing these to `bytes32 _paidCurrency, bytes32 _paidTxID` ... 
[View on GitHub](https://github.com/BlockchainLabsNZ/mothership-sen/issues/3)

  - [x] Fixed. [PR4](https://github.com/consensus-ai/sen-contracts/pull/4)

- **Favour require() over If() statements** - `Best practices`
<br>it is better to keep the "require()" from the original MiniMeToken.sol ...
 [View on GitHub](https://github.com/BlockchainLabsNZ/mothership-sen/issues/1)

  - [x] Fixed [125582](https://github.com/consensus-ai/sen-contracts/pull/3/commits/1255820c25742c9be924baf473ffb5bf1e0e9871)

### Moderate
- None found

### Major

- None found

### Critical
- None found

<br>

## Observations

#### Controller can transfer tokens without permission

[MiniMeToken.sol, line 125](https://github.com/BlockchainLabsNZ/mothership-sen/blob/audit/contracts/MiniMeToken.sol#L125)
```
  function transferFrom(address _from, address _to, uint256 _amount) public returns (bool success) {

    // The controller of this contract can move tokens around at will,
    //  this is important to recognize! Confirm that you trust the
    //  controller of this contract, which in most situations should be
    //  another open source smart contract or 0x0
    if (msg.sender != controller) {

      // The standard ERC 20 transferFrom functionality
      if (allowed[_from][msg.sender] < _amount)
        return false;

      allowed[_from][msg.sender] -= _amount;
    }
    return doTransfer(_from, _to, _amount);
  }
```

The `controller` is able to transfer token balances to and from any account without permission. We recommend that once distribution of tokens has been finalized to call `changeController` to the 0x0 address so that there is a guarantee that balances cannot be altered in future by anyone.

  - [x] Fixed. [3ac043](https://github.com/consensus-ai/sen-contracts/commit/3ac04396d3420974bfade80cdd4db419d3ac0ccf)

#### Controllership and token transfer

If deployer forgets to change controllership of the SEN token to the distribution contract, anyone would be able to transfer their tokens even during distribution period. 

It is possible after `transfersEnabled` modifier was removed from the original contract.
This [line 168](https://github.com/BlockchainLabsNZ/mothership-sen/blob/audit/contracts/MiniMeToken.sol#L168) is the only check now:

```
    if (isContract(controller)) {
      require(TokenController(controller).onTransfer(_from, _to, _amount));
    }

```

If the contract controller is the distribution contract this will always return FALSE in the [line 125](https://github.com/BlockchainLabsNZ/mothership-sen/blob/audit/contracts/Distribution.sol#L125):

```
  function onTransfer(address, address, uint256) public returns (bool) {
    return false;
  }
```

This makes transfers impossible while the controller is the distribution contract. 

  - [ ] Update: The developers decided there is no need to fix it. 

<br>

## Conclusion

The developers demonstrated an understanding of Solidity and smart contracts. They were receptive to the feedback provided to help improve the robustness of the contracts.

We took part in carefully reviewing all source code provided, including both static and dynamic testing methodology. 

Overall we consider the resulting contracts following the audit feedback period adequate and have not identified any potential vulnerabilities. This contract has a low level risk of ETH and SEN being hacked or stolen from the inspected contracts.

<hr>

### Disclaimer

Our team uses our current understanding of the best practises for Solidity and Smart Contracts. Development in Solidity and for Blockchain is an emergering area of software engineering which still has a lot of room to grow, hence our current understanding of best practise may not find all of the issues in this code and design. 

We have not analysed any of the assembly code generated by the Solidity compiler. We have not verified the deployment process and configurations of the contracts. We have only analysed the code outlined in the scope. We have not verified any of the claims made by any of the organisations behind this code. 

Security audits do not warrant bug-free code. We encourge all users interacting with smart contract code to continue to analyse and inform themselves of any risks before interacting with any smart contracts.

