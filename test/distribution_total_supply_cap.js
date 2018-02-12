const TokenName = 'SEN'
const Token = artifacts.require(TokenName)
const Distribution = artifacts.require('DistributionMock')

const assertFail = require('./helpers/assertFail')

let token
let distribution

const totalSupplyCap = 110e18
const totalReserve = 10e18
const btcTxID =
  'b9f7ea9a794eaf4174efcb035ea3f1b95a689420ec5758e426c0bf86f1d54a8d'

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
    await distribution.proxyMintTokens(accounts[1], 100e18, 'BTC', btcTxID, {
      from: accounts[0]
    })
    assert.equal((await token.balanceOf.call(accounts[1])).toNumber(), 100e18)
    assert.equal((await token.totalSupply.call()).toNumber(), 100e18)

    // Mint exceed cap with smallest amount
    await assertFail(async () => {
      await distribution.proxyMintTokens(accounts[1], 1, 'BTC', btcTxID, {
        from: accounts[0]
      })
    })
    assert.equal((await token.balanceOf.call(accounts[1])).toNumber(), 100e18)
    assert.equal((await token.totalSupply.call()).toNumber(), 100e18)
  })
})
