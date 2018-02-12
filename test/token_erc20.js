const TokenName = 'SEN'
const Token = artifacts.require(TokenName)
const BigNumber = require('bignumber.js')

let token

contract(TokenName, function(accounts) {
  beforeEach(async () => {
    // Create a token; account[0] is a controller
    token = await Token.new({ from: accounts[0] })
    // Mint 100 tokens for account[0]
    await token.mintTokens(accounts[0], 100e18)
    // Set contoller to nobody to avoid side effects
    await token.changeController('0x0')
  })

  // CREATION
  it('creation: should have an initial balance of 100 tokens', async () => {
    assert.equal(
      (await token.balanceOf.call(accounts[0])).toNumber(),
      100e18 // 100 Tokens
    )
  })

  // TRANSERS
  it('transfers: should transfer 100 tokens to accounts[1] with accounts[0] having 100 tokens', async () => {
    const watcher = token.Transfer()
    await token.transfer(accounts[1], 100e18, {
      from: accounts[0]
    })

    // Logs should have a Transfer event for latest transaction
    const logs = watcher.get()
    assert.equal(logs[0].event, 'Transfer')
    assert.equal(logs[0].args._from, accounts[0])
    assert.equal(logs[0].args._to, accounts[1])
    assert.equal(logs[0].args._amount.toNumber(), 100e18)

    // Check final balances
    assert.strictEqual((await token.balanceOf.call(accounts[0])).toNumber(), 0)
    assert.equal((await token.balanceOf.call(accounts[1])).toNumber(), 100e18)
  })

  it('transfers: should fail when trying to transfer more tokens than accounts[0] has in a balance', async () => {
    await token.transfer(accounts[1], new BigNumber(web3.toWei(100e18 + 1)), {
      from: accounts[0]
    })
    assert.equal((await token.balanceOf.call(accounts[0])).toNumber(), 100e18)
  })

  // APPROVALS
  it('approvals: msg.sender should approve 100 to accounts[1]', async () => {
    const watcher = token.Approval()
    await token.approve(accounts[1], 100e18, { from: accounts[0] })

    // Logs should have a Transfer event for latest transaction
    const logs = watcher.get()
    assert.equal(logs[0].event, 'Approval')
    assert.equal(logs[0].args._owner, accounts[0])
    assert.equal(logs[0].args._spender, accounts[1])
    assert.equal(logs[0].args._amount.toNumber(), 100e18)

    // Check transfer allowance
    assert.equal(
      (await token.allowance.call(accounts[0], accounts[1])).toNumber(),
      100e18
    )
  })

  it('approvals: msg.sender approves accounts[1] of 100 & withdraws 20 once.', async () => {
    watcher = token.Transfer()
    await token.approve(accounts[1], 100e18, { from: accounts[0] })

    // Check initial balance for recipient and transfer 20 tokens
    assert.strictEqual((await token.balanceOf.call(accounts[2])).toNumber(), 0)
    await token.transferFrom(accounts[0], accounts[2], 20e18, {
      from: accounts[1]
    })

    // Logs should have a Transfer event for latest transaction
    const logs = watcher.get()
    assert.notEqual(logs[0], undefined)
    assert.equal(logs[0].event, 'Transfer')
    assert.equal(logs[0].args._from, accounts[0])
    assert.equal(logs[0].args._to, accounts[2])
    assert.strictEqual(logs[0].args._amount.toNumber(), 20e18)

    // Check allowance, 80 of 100 should be unused
    assert.equal(
      (await token.allowance.call(accounts[0], accounts[1])).toNumber(),
      80e18
    )

    // Check ending balances
    assert.equal((await token.balanceOf.call(accounts[2])).toNumber(), 20e18)
    assert.equal((await token.balanceOf.call(accounts[0])).toNumber(), 80e18)
  })

  it('approvals: msg.sender approves accounts[1] of 100 & withdraws 20 twice.', async () => {
    await token.approve(accounts[1], 100e18, { from: accounts[0] })

    // Perform two transfers using approved amount
    await token.transferFrom(accounts[0], accounts[2], 20e18, {
      from: accounts[1]
    })
    await token.transferFrom(accounts[0], accounts[2], 20e18, {
      from: accounts[1]
    })

    // Check allowance, 60 of 100 should be unused
    assert.equal(
      (await token.allowance.call(accounts[0], accounts[1])).toNumber(),
      60e18
    )

    // Check ending balances
    assert.equal((await token.balanceOf.call(accounts[2])).toNumber(), 40e18)
    assert.equal((await token.balanceOf.call(accounts[0])).toNumber(), 60e18)
  })

  it('approvals: msg.sender approves accounts[1] of 90 & withdraws 40 and 60 (2nd tx should fail)', async () => {
    await token.approve(accounts[1], 90e18, { from: accounts[0] })

    // Transfer 40 tokens from account[0] to account[2]
    await token.transferFrom(accounts[0], accounts[2], 40e18, {
      from: accounts[1]
    })

    // Check relmaning approvals and balances after the transaction
    assert.equal(
      (await token.allowance.call(accounts[0], accounts[1])).toNumber(),
      50e18
    )
    assert.equal((await token.balanceOf.call(accounts[2])).toNumber(), 40e18)
    assert.equal((await token.balanceOf.call(accounts[0])).toNumber(), 60e18)

    // Trying to transfer 60 more tokens should fail, because only 50 allowed by now
    await token.transferFrom.call(accounts[0], accounts[2], 60e18, {
      from: accounts[1]
    })
    assert.equal((await token.balanceOf.call(accounts[2])).toNumber(), 40e18)
    assert.equal((await token.balanceOf.call(accounts[0])).toNumber(), 60e18)
  })

  it('approvals: attempt withdrawal from account with no allowance (should fail)', async () => {
    await token.transferFrom.call(accounts[0], accounts[2], 60e18, {
      from: accounts[1]
    })
    assert.equal((await token.balanceOf.call(accounts[0])).toNumber(), 100e18)
  })

  it('approvals: allow accounts[1] 100 to withdraw from accounts[0]. Withdraw 60 and then approve 0 & attempt transfer.', async () => {
    await token.approve(accounts[1], 100e18, { from: accounts[0] })
    await token.transferFrom(accounts[0], accounts[2], 60e18, {
      from: accounts[1]
    })

    // Reset approval. Following transfers should fail
    await token.approve(accounts[1], 0, { from: accounts[0] })
    await token.transferFrom.call(accounts[0], accounts[2], 10e18, {
      from: accounts[1]
    })
    assert.equal((await token.balanceOf.call(accounts[0])).toNumber(), 40e18)
  })
})
