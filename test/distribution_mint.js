const TokenName = 'SEN'
const Token = artifacts.require(TokenName)
const Distribution = artifacts.require('DistributionMock')

const assertFail = require('./helpers/assertFail')

let token
let distribution

const totalSupplyCap = 660e18
const totalReserve = 60e18
const btcTxID =
  'b9f7ea9a794eaf4174efcb035ea3f1b95a689420ec5758e426c0bf86f1d54a8d'
const ltcTxID =
  'abcfd320f69bc65522845164e19a65103edc38ca38e31c6ff2a2eb8a17891206'
const ethTxID =
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
    await distribution.proxyMintTokens(accounts[1], 100e18, 'BTC', btcTxID, {
      from: accounts[0]
    })
    assert.equal((await token.balanceOf.call(accounts[1])).toNumber(), 100e18)
    assert.equal((await token.totalSupply.call()).toNumber(), 100e18)
  })

  it('Others except controller cannot mint tokens', async () => {
    assert.equal(await distribution.controller(), accounts[0])
    await assertFail(async () => {
      await distribution.proxyMintTokens(accounts[1], 100e18, 'BTC', btcTxID, {
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

  it('Mint and store tx paid with different currencies', async () => {
    const watcher = distribution.Purchase()

    // Mint tokens with different paid currencies and check for event emitted
    await distribution.proxyMintTokens(accounts[1], 100e18, 'BTC', btcTxID, {
      from: accounts[0]
    })
    let logs = watcher.get()
    assert.equal(logs[0].event, 'Purchase')
    assert.equal(logs[0].args._owner, accounts[1])
    assert.equal(logs[0].args._amount.toNumber(), 100e18)
    assert.equal(logs[0].args._paidCurrency, 'BTC')
    assert.equal(logs[0].args._paidTxID, btcTxID)

    await distribution.proxyMintTokens(accounts[1], 200e18, 'LTC', ltcTxID, {
      from: accounts[0]
    })
    logs = watcher.get()
    assert.equal(logs[0].event, 'Purchase')
    assert.equal(logs[0].args._owner, accounts[1])
    assert.equal(logs[0].args._amount.toNumber(), 200e18)
    assert.equal(logs[0].args._paidCurrency, 'LTC')
    assert.equal(logs[0].args._paidTxID, ltcTxID)

    await distribution.proxyMintTokens(accounts[1], 300e18, 'ETH', ethTxID, {
      from: accounts[0]
    })
    logs = watcher.get()
    assert.equal(logs[0].event, 'Purchase')
    assert.equal(logs[0].args._owner, accounts[1])
    assert.equal(logs[0].args._amount.toNumber(), 300e18)
    assert.equal(logs[0].args._paidCurrency, 'ETH')
    assert.equal(logs[0].args._paidTxID, ethTxID)

    // Check for total balance and supply
    assert.equal((await token.balanceOf.call(accounts[1])).toNumber(), 600e18)
    assert.equal((await token.totalSupply.call()).toNumber(), 600e18)

    // Check for address total transaction
    let totalTx = (await distribution.totalTransactionCount.call(
      accounts[1]
    )).toNumber()
    assert.equal(totalTx, 3)

    // Check tx paid with BTC
    let btcTx = await distribution.getTransactionAtIndex.call(accounts[1], 0)
    assert.equal(btcTx[0].toNumber(), 100e18)
    assert.equal(btcTx[1], 'BTC')
    assert.equal(btcTx[2], btcTxID)

    // Check tx paid with LTC
    let ltcTx = await distribution.getTransactionAtIndex.call(accounts[1], 1)
    assert.equal(ltcTx[0].toNumber(), 200e18)
    assert.equal(ltcTx[1], 'LTC')
    assert.equal(ltcTx[2], ltcTxID)

    // Check tx paid with ETH
    let ethTx = await distribution.getTransactionAtIndex.call(accounts[1], 2)
    assert.equal(ethTx[0].toNumber(), 300e18)
    assert.equal(ethTx[1], 'ETH')
    assert.equal(ethTx[2], ethTxID)
  })
})
