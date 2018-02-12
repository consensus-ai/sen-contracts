const TokenName = 'SEN'
const Token = artifacts.require(TokenName)
const Distribution = artifacts.require('DistributionMock')

const assertFail = require('./helpers/assertFail')

let token
let distribution
let reserveWallet

const totalSupplyCap = 100e18
const totalReserve = 10e18
const btcTxID =
  'b9f7ea9a794eaf4174efcb035ea3f1b95a689420ec5758e426c0bf86f1d54a8d'
const ltcTxID =
  'abcfd320f69bc65522845164e19a65103edc38ca38e31c6ff2a2eb8a17891206'

contract('Distribution', function(accounts) {
  beforeEach(async () => {
    token = await Token.new({ from: accounts[0] })

    reserveWallet = accounts[5]
    distribution = await Distribution.new(
      token.address,
      reserveWallet,
      totalSupplyCap,
      totalReserve,
      { from: accounts[0] }
    )

    // change token's controller to distribution
    await token.changeController(distribution.address)
  })

  it('A controller can finalize after reaching distribution cap', async () => {
    assert.equal(await distribution.controller(), accounts[0])
    assert.equal(await distribution.distributionCap(), 90e18)

    await distribution.proxyMintTokens(accounts[1], 80e18, 'BTC', btcTxID)

    // attempt to finalize with not-a-controller address before reaching cap
    await assertFail(async () => {
      await distribution.finalize({ from: accounts[1] })
    })
    // attempt to finalize with a address before reaching cap
    await assertFail(async () => {
      await distribution.finalize({ from: accounts[0] })
    })

    // Mint the rest
    await distribution.proxyMintTokens(
      accounts[9],
      totalSupplyCap -
        totalReserve -
        (await token.totalSupply.call()).toNumber(),
      'LTC',
      ltcTxID
    )

    // attempt to finalize with not-a-controller address before reaching cap
    await assertFail(async () => {
      await distribution.finalize({ from: accounts[1] })
    })
    // finalize with a controller address after reaching cap
    await distribution.finalize({ from: accounts[0] })
  })

  it('A token controller should be changed after finalize', async () => {
    assert.equal(await distribution.controller(), accounts[0])
    assert.equal(await token.controller(), distribution.address)

    // Mint the rest
    await distribution.proxyMintTokens(
      accounts[9],
      totalSupplyCap -
        totalReserve -
        (await token.totalSupply.call()).toNumber(),
      'LTC',
      ltcTxID
    )
    await distribution.finalize()

    // Check controllers
    assert.equal(await distribution.controller(), accounts[0])
    assert.equal(await token.controller(), accounts[0])
  })

  it('Reserve pool should be minted on finalize', async () => {
    assert.equal((await token.balanceOf.call(reserveWallet)).toNumber(), 0)

    // Mint the rest and finalize
    await distribution.proxyMintTokens(
      accounts[9],
      totalSupplyCap -
        totalReserve -
        (await token.totalSupply.call()).toNumber(),
      'BTC',
      btcTxID
    )
    await distribution.finalize()

    assert.equal(
      (await token.balanceOf.call(reserveWallet)).toNumber(),
      totalReserve
    )
  })

  it('Tokens can NOT be minted after finalizing', async () => {
    assert.equal(await distribution.controller(), accounts[0])
    await distribution.proxyMintTokens(accounts[1], 50e18, 'BTC', btcTxID)

    assert.equal((await token.balanceOf.call(accounts[1])).toNumber(), 50e18)
    assert.equal((await token.totalSupply.call()).toNumber(), 50e18)

    // Mint the rest and finalize
    await distribution.proxyMintTokens(
      accounts[9],
      totalSupplyCap -
        totalReserve -
        (await token.totalSupply.call()).toNumber(),
      'BTC',
      btcTxID
    )
    await distribution.finalize({ from: accounts[0] })

    // Cannot mint throught Distribution
    await assertFail(async () => {
      await distribution.proxyMintTokens(accounts[1], 50e18, 'LTC', ltcTxID)
    })
    // Cannot mint directly
    await assertFail(async () => {
      await token.mintTokens(accounts[1], 50e18)
    })

    assert.equal((await token.balanceOf.call(accounts[1])).toNumber(), 50e18)
    assert.equal((await token.totalSupply.call()).toNumber(), totalSupplyCap)
  })

  it('Transfer is allowed after finalize olny', async () => {
    assert.equal(await distribution.controller(), accounts[0])
    await distribution.proxyMintTokens(accounts[1], 50e18, 'BTC', btcTxID)

    // transfer before finalizing
    await assertFail(async () => {
      await token.transfer(accounts[2], 10e18, { from: accounts[1] })
    })

    // Mint the rest and finalize
    await distribution.proxyMintTokens(
      accounts[9],
      totalSupplyCap -
        totalReserve -
        (await token.totalSupply.call()).toNumber(),
      'BTC',
      btcTxID
    )
    await distribution.finalize({ from: accounts[0] })

    // transfer should succeed after
    await token.transfer(accounts[2], 10e18, { from: accounts[1] })
    assert.equal((await token.balanceOf.call(accounts[1])).toNumber(), 40e18)
    assert.equal((await token.balanceOf.call(accounts[2])).toNumber(), 10e18)
  })
})
