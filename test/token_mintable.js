const TokenName = 'SEN'
const Token = artifacts.require(TokenName)

const assertFail = require('./helpers/assertFail')

let token

contract(TokenName, function(accounts) {
  beforeEach(async () => {
    token = await Token.new({ from: accounts[0] })
  })

  it('Controler can mint tokens', async () => {
    await token.mintTokens(accounts[1], 100e18)
    assert.equal((await token.balanceOf.call(accounts[1])).toNumber(), 100e18)
    assert.equal((await token.totalSupply.call()).toNumber(), 100e18)
  })

  it('Others are not allowed to mint tokens', async () => {
    await token.changeController(accounts[1])

    await assertFail(async () => {
      await token.mintTokens(accounts[1], 10e18)
    })

    assert.equal((await token.balanceOf.call(accounts[1])).toNumber(), 0)
    assert.equal((await token.totalSupply.call()).toNumber(), 0)
  })
})
