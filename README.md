# Consensus AI smart contracts

## SEN

`SEN` is an `ERC20` token which is made on top of `MiniMeToken` https://github.com/Giveth/minime with few additional features:
- It supports `Burnable` interface which allows a `controller` or a `burner` to destroy tokens under their control;
- It provides a `finalize` method to prevent any further token issue.

## Distribution

`Distribution` contract is a proxy for `SEN` contract. 
- It took control over the token minting to oraclaze payment information for off-chain payment processing;
- It limits tokens issue with a total suppy cap;
- It mint a special tokens pool to a `reserveWallet` (for team/bonuses/etc).
