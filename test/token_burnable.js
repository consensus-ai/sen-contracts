const TokenName = 'SEN'
const Token = artifacts.require(TokenName)
const assertFail = require('./helpers/assertFail')

let token

contract(`${TokenName} Burnable`, function(accounts) {
  beforeEach(async () => {
    // Create a token; account[0] is a controller
    token = await Token.new({ from: accounts[0] })
    // Mint 100 tokens for account[0]
    await token.mintTokens(accounts[0], 100e18)
  })

  it('Controler can burn tokens', async () => {
    // Balance and totalSupply before burning
    assert.equal((await token.balanceOf.call(accounts[0])).toNumber(), 100e18)
    assert.equal((await token.totalSupply.call()).toNumber(), 100e18)

    // Burn the token
    await token.destroyTokens(accounts[0], 10e18)

    // Balance and totalSupply after burning
    assert.equal((await token.balanceOf.call(accounts[0])).toNumber(), 90e18)
    assert.equal((await token.totalSupply.call()).toNumber(), 90e18)
  })

  it('Others cannot burn tokens', async () => {
    await token.changeController(accounts[1])

    // Unable to burn if not a controller
    await assertFail(async () => {
      await token.destroyTokens(accounts[0], 10e18, { from: account[2] })
    })

    // Balance and totalSupply should remain the same
    assert.equal((await token.balanceOf.call(accounts[0])).toNumber(), 100e18)
    assert.equal((await token.totalSupply.call()).toNumber(), 100e18)
  })

  it('Burner can burn his/her tokens', async () => {
    // Balance and totalSupply before burning
    await token.transfer(accounts[1], 20e18, { from: accounts[0] })
    assert.equal((await token.balanceOf.call(accounts[0])).toNumber(), 80e18)
    assert.equal((await token.balanceOf.call(accounts[1])).toNumber(), 20e18)
    assert.equal((await token.totalSupply.call()).toNumber(), 100e18)

    // Change a burner and destroy some tokens
    await token.changeBurner(accounts[1])
    await token.destroyTokens(accounts[1], 10e18, { from: accounts[1] })

    // Balance and totalSupply after burning
    assert.equal((await token.balanceOf.call(accounts[0])).toNumber(), 80e18)
    assert.equal((await token.balanceOf.call(accounts[1])).toNumber(), 10e18)
    assert.equal((await token.totalSupply.call()).toNumber(), 90e18)
  })

  it('Burner cannot burn others tokens', async () => {
    // Balance and totalSupply before burning
    assert.equal((await token.balanceOf.call(accounts[0])).toNumber(), 100e18)
    assert.equal((await token.totalSupply.call()).toNumber(), 100e18)

    // Change a burner and try to destroy some tokens
    await token.changeBurner(accounts[1])
    await assertFail(async () => {
      await token.destroyTokens(accounts[0], 10e18, { from: accounts[1] })
    })

    // Balance and totalSupply should remain the same
    assert.equal((await token.balanceOf.call(accounts[0])).toNumber(), 100e18)
    assert.equal((await token.totalSupply.call()).toNumber(), 100e18)
  })
})
