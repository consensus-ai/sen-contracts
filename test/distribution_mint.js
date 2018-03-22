const TokenName = 'SEN'
const Token = artifacts.require(TokenName)
const Distribution = artifacts.require('DistributionMock')

const assertFail = require('./helpers/assertFail')

let token
let distribution

const totalSupplyCap = 660e18
const totalReserve = 60e18
const txId =
  '0xc4ea08f7ce04082c6934c0069a814c1300dd149721f9828b8b8a5764f04b6c0e'

contract('Distribution', function(accounts) {
  beforeEach(async () => {
    token = await Token.new({ from: accounts[0] })

    distribution = await Distribution.new(
      token.address,
      accounts[9],
      totalSupplyCap,
      totalReserve,
      { from: accounts[0] }
    )

    // change token's controller to distribution
    await token.changeController(distribution.address)
  })

  it('Distribution controller is able to mint tokens', async () => {
    assert.equal(await distribution.controller(), accounts[0])
    const watcher = distribution.Purchase()

    await distribution.proxyMintTokens(accounts[1], 100e18, txId, {
      from: accounts[0]
    })

    // Check balance and total supply
    assert.equal((await token.balanceOf.call(accounts[1])).toNumber(), 100e18)
    assert.equal((await token.totalSupply.call()).toNumber(), 100e18)

    // Check provisioned information
    assert.equal(
      (await distribution.totalTransactionCount.call(accounts[1])).toNumber(),
      1
    )
    const tx = await distribution.getTransactionAtIndex.call(accounts[1], 0)
    assert.equal(tx[0].toNumber(), 100e18)
    assert.equal(tx[1], txId)

    // An event should be logged
    let logs = watcher.get()
    assert.equal(logs[0].event, 'Purchase')
    assert.equal(logs[0].args._owner, accounts[1])
    assert.equal(logs[0].args._amount.toNumber(), 100e18)
    assert.equal(logs[0].args._paidTxID, txId)
  })

  it('Others except controller cannot mint tokens', async () => {
    assert.equal(await distribution.controller(), accounts[0])
    await assertFail(async () => {
      await distribution.proxyMintTokens(accounts[1], 100e18, txId, {
        from: accounts[1]
      })
    })
    assert.equal((await token.balanceOf.call(accounts[1])).toNumber(), 0)
    assert.equal((await token.totalSupply.call()).toNumber(), 0)
  })

  it('Cannot mint tokens directly on a token', async () => {
    await assertFail(async () => {
      await token.mintTokens(accounts[0], 10e18)
    })
    assert.equal((await token.balanceOf.call(accounts[0])).toNumber(), 0)
    assert.equal((await token.totalSupply.call()).toNumber(), 0)
  })
})
