const TokenName = 'SEN'
const Token = artifacts.require(TokenName)
const Distribution = artifacts.require('DistributionMock')

const assertFail = require('./helpers/assertFail')

let token
let distribution
let reserveWallet

const totalSupplyCap = 100e18
const totalReserve = 10e18
const txId1 =
  '0xc4ea08f7ce04082c6934c0069a814c1300dd149721f9828b8b8a5764f04b6c0e'
const txId2 =
  '0x350ebf97f24e98b1e8e250e97f33e29b00c5975ce3f13c4851b7135ab0e7465e'
const txId3 =
  '0x1a8830949c4cc2438b91ce54626027a4fcb631d2b2d5424ef40461ac848de061'

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

    await distribution.proxyMintTokens(accounts[1], 80e18, txId1)

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
      txid2
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
      txId1
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
      txId1
    )
    await distribution.finalize()

    assert.equal(
      (await token.balanceOf.call(reserveWallet)).toNumber(),
      totalReserve
    )
  })

  it('Tokens can NOT be minted after finalizing', async () => {
    assert.equal(await distribution.controller(), accounts[0])
    await distribution.proxyMintTokens(accounts[1], 50e18, txId1)

    assert.equal((await token.balanceOf.call(accounts[1])).toNumber(), 50e18)
    assert.equal((await token.totalSupply.call()).toNumber(), 50e18)

    // Mint the rest and finalize
    await distribution.proxyMintTokens(
      accounts[9],
      totalSupplyCap -
        totalReserve -
        (await token.totalSupply.call()).toNumber(),
      txId2
    )
    await distribution.finalize({ from: accounts[0] })

    // Cannot mint throught Distribution
    await assertFail(async () => {
      await distribution.proxyMintTokens(accounts[1], 50e18, txId3)
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
    await distribution.proxyMintTokens(accounts[1], 50e18, txId1)

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
      txId2
    )
    await distribution.finalize({ from: accounts[0] })

    // transfer should succeed after
    await token.transfer(accounts[2], 10e18, { from: accounts[1] })
    assert.equal((await token.balanceOf.call(accounts[1])).toNumber(), 40e18)
    assert.equal((await token.balanceOf.call(accounts[2])).toNumber(), 10e18)
  })
})
