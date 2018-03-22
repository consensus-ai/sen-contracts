const TokenName = 'SEN'
const Token = artifacts.require(TokenName)
const Distribution = artifacts.require('DistributionMock')

const assertFail = require('./helpers/assertFail')

let token
let distribution

const totalSupplyCap = 600e18
const totalReserve = 60e18
const txId =
  '0xc4ea08f7ce04082c6934c0069a814c1300dd149721f9828b8b8a5764f04b6c0e'

contract('Distribution', function(accounts) {
  beforeEach(async () => {
    // sen token which controlled by Distribution and SENController
    sen = await Token.new({ from: accounts[0] })

    // Another token which is not controlled by Distribution and SENController
    token = await Token.new({ from: accounts[1] })

    distribution = await Distribution.new(
      sen.address,
      accounts[9],
      totalSupplyCap,
      totalReserve,
      { from: accounts[0] }
    )

    // change token's controller to distribution
    await sen.changeController(distribution.address)
  })

  it('Controller is able to claim SEN tokens', async () => {
    assert.equal(await distribution.controller(), accounts[0])

    // Mint whole tokens supply for an account
    const minted = totalSupplyCap - totalReserve
    assert.isAbove(minted, 50e18) // ensure we have anough tokens to play with
    await distribution.proxyMintTokens(accounts[2], minted, txId)
    assert.equal((await sen.balanceOf.call(accounts[2])).toNumber(), minted)

    // Then filalize to make tokens transferable
    await distribution.finalize()

    // The user accidentally transfer tokens to the contracts
    await sen.transfer(distribution.address, 10e18, { from: accounts[2] })
    assert.equal(
      (await sen.balanceOf.call(distribution.address)).toNumber(),
      10e18
    )
    assert.equal(
      (await sen.balanceOf.call(accounts[2])).toNumber(),
      minted - 10e18
    )

    // Transfer to SEN contract itself should fail
    await assertFail(async () => {
      await sen.transfer(sen.address, 20e18, { from: accounts[2] })
    })
    assert.equal((await sen.balanceOf.call(sen.address)).toNumber(), 0)

    // Claim back tokems from Distribution address
    await distribution.claimTokens(sen.address)
    assert.equal((await sen.balanceOf.call(distribution.address)).toNumber(), 0)
    assert.equal((await sen.balanceOf.call(accounts[0])).toNumber(), 10e18)
  })

  it('Controller is able to claim OTHER tokens', async () => {
    await token.mintTokens(accounts[2], 100e18, { from: accounts[1] })
    assert.equal((await token.balanceOf.call(accounts[2])).toNumber(), 100e18)
    assert.equal((await token.totalSupply.call()).toNumber(), 100e18)

    // Someone accidentally transfer tokens to Distribution and SEN
    await token.transfer(distribution.address, 10e18, { from: accounts[2] })
    await token.transfer(sen.address, 20e18, { from: accounts[2] })
    assert.equal(
      (await token.balanceOf.call(distribution.address)).toNumber(),
      10e18
    )
    assert.equal((await token.balanceOf.call(sen.address)).toNumber(), 20e18)

    // Claim back the transfer tokens
    await distribution.claimTokens(token.address)
    assert.equal(
      (await token.balanceOf.call(distribution.address)).toNumber(),
      0
    )
    assert.equal((await token.balanceOf.call(sen.address)).toNumber(), 0)
    assert.equal((await token.balanceOf.call(accounts[0])).toNumber(), 30e18)
  })
})
