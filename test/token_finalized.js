const TokenName = 'SEN'
const Token = artifacts.require(TokenName)

const assertFail = require('./helpers/assertFail')

let token

contract(TokenName, function(accounts) {
  beforeEach(async () => {
    token = await Token.new({ from: accounts[0] })
  })

  it('Tokens cannot be minted after finalizing', async () => {
    await token.mintTokens(accounts[1], 100e18)
    assert.equal((await token.balanceOf.call(accounts[1])).toNumber(), 100e18)
    assert.equal((await token.totalSupply.call()).toNumber(), 100e18)

    await token.finalize()

    await assertFail(async () => {
      await token.mintTokens(accounts[1], 100e18)
    })

    assert.equal((await token.balanceOf.call(accounts[1])).toNumber(), 100e18)
    assert.equal((await token.totalSupply.call()).toNumber(), 100e18)
  })
})
