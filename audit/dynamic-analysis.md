# Dynamic Analysis

```
   Contract: Distribution
    ✓ Controller is able to claim SEN tokens (1064ms)
    ✓ Controller is able to claim OTHER tokens (966ms)

  Contract: Distribution
    ✓ A controller can finalize after reaching distribution cap (795ms)
    ✓ A token controller should be changed after finalize (503ms)
    ✓ Reserve pool should be minted on finalize (492ms)
    ✓ Tokens can NOT be minted after finalizing (882ms)
    ✓ Transfer is allowed after finalize olny (933ms)

  Contract: Distribution Initialize
    ✓ Reserve should be less than total supply cap (67ms)
    ✓ Distribution cap is a diffence between total supply cap and reserve (156ms)
    ✓ Token total supply should be 0 at the beginning of distribution (228ms)

  Contract: Distribution
    ✓ Distribution controller is able to mint tokens (307ms)
    ✓ Others except controller cannot mint tokens (90ms)
    ✓ Cannot mint tokens directly on a token (77ms)
    ✓ Mint and store tx paid with different currencies (1095ms)

  Contract: Distribution
    ✓ Distribution is NOT able to mint tokens exceeding distribution cap (384ms)

  Contract: SEN Burnable
    ✓ Controler can burn tokens (269ms)
    ✓ Others cannot burn tokens (111ms)
    ✓ Burner can burn his/her tokens (499ms)
    ✓ Burner cannot burn others tokens (201ms)

  Contract: SEN
    ✓ cloning: a cloned Token will keep the original Token transaction history (438ms)
    ✓ cloning: a new token could have its own name, symbol and digits (352ms)
    ✓ cloning: transfer should work after and affect new token only (758ms)

  Contract: SEN
    ✓ creation: should have an initial balance of 100 tokens (38ms)
    ✓ transfers: should transfer 100 tokens to accounts[1] with accounts[0] having 100 tokens (293ms)
    ✓ transfers: should fail when trying to transfer more tokens than accounts[0] has in a balance (104ms)
    ✓ approvals: msg.sender should approve 100 to accounts[1] (187ms)
    ✓ approvals: msg.sender approves accounts[1] of 100 & withdraws 20 once. (427ms)
    ✓ approvals: msg.sender approves accounts[1] of 100 & withdraws 20 twice. (432ms)
    ✓ approvals: msg.sender approves accounts[1] of 90 & withdraws 40 and 60 (2nd tx should fail) (374ms)
    ✓ approvals: attempt withdrawal from account with no allowance (should fail) (65ms)
    ✓ approvals: allow accounts[1] 100 to withdraw from accounts[0]. Withdraw 60 and then approve 0 & attempt transfer. (296ms)

  Contract: SEN
    ✓ Tokens cannot be minted after finalizing (343ms)

  Contract: SEN
    ✓ Controler can mint tokens (167ms)
    ✓ Others are not allowed to mint tokens (116ms)


  34 passing (25s)
```
