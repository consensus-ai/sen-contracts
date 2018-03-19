# Gas consumption report
performed by Blockchain Labs, February 27, 2018


```
  Contract: Distribution
    ✓ Controller is able to claim SEN tokens (684118 gas)
    ✓ Controller is able to claim OTHER tokens (526744 gas)

  Contract: Distribution
    ✓ A controller can finalize after reaching distribution cap (4719825 gas)
    ✓ A token controller should be changed after finalize (426806 gas)
    ✓ Reserve pool should be minted on finalize (426806 gas)
    ✓ Tokens can NOT be minted after finalizing (735672 gas)
    ✓ Transfer is allowed after finalize olny (817330 gas)

  Contract: Distribution Initialize
    ✓ Reserve should be less than total supply cap (584964 gas)
    ✓ Distribution cap is a diffence between total supply cap and reserve (1877243 gas)
    ✓ Token total supply should be 0 at the beginning of distribution (4121541 gas)

  Contract: Distribution
    ✓ Distribution controller is able to mint tokens (259382 gas)
    ✓ Others except controller cannot mint tokens (29537 gas)
    ✓ Cannot mint tokens directly on a token (24171 gas)
    ✓ Mint and store tx paid with different currencies (725268 gas)

  Contract: Distribution
    ✓ Distribution is NOT able to mint tokens exceeding distribution cap (293848 gas)

  Contract: SEN Burnable
    ✓ Controler can burn tokens (97237 gas)
    ✓ Others cannot burn tokens (28547 gas)
    ✓ Burner can burn his/her tokens (236768 gas)
    ✓ Burner cannot burn others tokens (4028679 gas)

  Contract: SEN
    ✓ cloning: a cloned Token will keep the original Token transaction history (2879096 gas)
    ✓ cloning: a new token could have its own name, symbol and digits (2879096 gas)
    ✓ cloning: transfer should work after and affect new token only (3141530 gas)

  Contract: SEN
    ✓ creation: should have an initial balance of 100 tokens
    ✓ transfers: should transfer 100 tokens to accounts[1] with accounts[0] having 100 tokens (109848 gas)
    ✓ transfers: should fail when trying to transfer more tokens than accounts[0] has in a balance (27655 gas)
    ✓ approvals: msg.sender should approve 100 to accounts[1] (46359 gas)
    ✓ approvals: msg.sender approves accounts[1] of 100 & withdraws 20 once. (163478 gas)
    ✓ approvals: msg.sender approves accounts[1] of 100 & withdraws 20 twice. (268694 gas)
    ✓ approvals: msg.sender approves accounts[1] of 90 & withdraws 40 and 60 (2nd tx should fail) (163414 gas)
    ✓ approvals: attempt withdrawal from account with no allowance (should fail)
    ✓ approvals: allow accounts[1] 100 to withdraw from accounts[0]. Withdraw 60 and then approve 0 & attempt transfer. (178999 gas)

  Contract: SEN
    ✓ Tokens cannot be minted after finalizing (188483 gas)

  Contract: SEN
    ✓ Controler can mint tokens (121605 gas)
    ✓ Others are not allowed to mint tokens (52718 gas)

·--------------------------------------------------------------------------------------|----------------------------·
│                                         Gas                                          ·  Block limit: 6721975 gas  │
····················································|··································|·····························
│  Methods                                          ·           21 gwei/gas            ·       865.35 usd/eth       │
···························|························|··········|···········|···········|··············|··············
│  Contract                ·  Method                ·  Min     ·  Max      ·  Avg      ·  # calls     ·  usd (avg)  │
···························|························|··········|···········|···········|··············|··············
│  ApproveAndCallFallBack  ·  receiveApproval       ·       -  ·        -  ·        -  ·           0  ·          -  │
···························|························|··········|···········|···········|··············|··············
│  DistributionMock        ·  changeController      ·       -  ·        -  ·    28547  ·           2  ·       0.52  │
···························|························|··········|···········|···········|··············|··············
│  DistributionMock        ·  claimTokens           ·  122592  ·   184099  ·   153346  ·           2  ·       2.79  │
···························|························|··········|···········|···········|··············|··············
│  DistributionMock        ·  finalize              ·   42381  ·   167488  ·   149616  ·           7  ·       2.72  │
···························|························|··········|···········|···········|··············|··············
│  DistributionMock        ·  onApprove             ·       -  ·        -  ·        -  ·           0  ·          -  │
···························|························|··········|···········|···········|··············|··············
│  DistributionMock        ·  onTransfer            ·       -  ·        -  ·        -  ·           0  ·          -  │
···························|························|··········|···········|···········|··············|··············
│  DistributionMock        ·  proxyMintTokens       ·  222552  ·   259382  ·   253464  ·          14  ·       4.61  │
···························|························|··········|···········|···········|··············|··············
│  DistributionMock        ·  setMockedBlockNumber  ·       -  ·        -  ·        -  ·           0  ·          -  │
···························|························|··········|···········|···········|··············|··············
│  SEN                     ·  approve               ·   15521  ·    46359  ·    41209  ·           6  ·       0.75  │
···························|························|··········|···········|···········|··············|··············
│  SEN                     ·  approveAndCall        ·       -  ·        -  ·        -  ·           0  ·          -  │
···························|························|··········|···········|···········|··············|··············
│  SEN                     ·  changeBurner          ·       -  ·        -  ·    28679  ·           2  ·       0.52  │
···························|························|··········|···········|···········|··············|··············
│  SEN                     ·  destroyTokens         ·   97237  ·    97537  ·    97387  ·           2  ·       1.77  │
···························|························|··········|···········|···········|··············|··············
│  SEN                     ·  mintTokens            ·  121541  ·   121605  ·   121589  ·           4  ·       2.21  │
···························|························|··········|···········|···········|··············|··············
│  SEN                     ·  transfer              ·   27655  ·   131249  ·   105834  ·           9  ·       1.92  │
···························|························|··········|···········|···········|··············|··············
│  SEN                     ·  transferFrom          ·  105216  ·   117119  ·   114738  ·           5  ·       2.09  │
···························|························|··········|···········|···········|··············|··············

  34 passing (2m)  
```

<br>

## Summary  
Upon finalization of the contracts to be used by **Mothership**, the contracts were assessed on the gas usage of each function to ensure there aren't any unforeseen issues with exceeding the block size GasLimit.

<br>