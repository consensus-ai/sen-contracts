const TokenName = 'SEN'
const Token = artifacts.require(TokenName)
const Distribution = artifacts.require('DistributionMock')

const assertFail = require('./helpers/assertFail')

let token
let distribution

const totalSupplyCap = 110e18
const totalReserve = 10e18
const txId1 =
  '0xc4ea08f7ce04082c6934c0069a814c1300dd149721f9828b8b8a5764f04b6c0e'
const txId2 =
  '0x350ebf97f24e98b1e8e250e97f33e29b00c5975ce3f13c4851b7135ab0e7465e'

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

  it('Distribution is NOT able to mint tokens exceeding distribution cap', async () => {
    assert.equal(await distribution.controller(), accounts[0])

    // Mint the total distribution cap
    await distribution.proxyMintTokens(accounts[1], 100e18, txId1, {
      from: accounts[0]
    })
    assert.equal((await token.balanceOf.call(accounts[1])).toNumber(), 100e18)
    assert.equal((await token.totalSupply.call()).toNumber(), 100e18)

    // Mint exceed cap with smallest amount
    await assertFail(async () => {
      await distribution.proxyMintTokens(accounts[1], 1, txId2, {
        from: accounts[0]
      })
    })
    assert.equal((await token.balanceOf.call(accounts[1])).toNumber(), 100e18)
    assert.equal((await token.totalSupply.call()).toNumber(), 100e18)
  })
})
