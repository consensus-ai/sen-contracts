const TokenName = 'SEN'
const Token = artifacts.require(TokenName)
const MiniMeToken = artifacts.require('MiniMeToken')

let token

function cloneToken(parentToken) {
  const snapShotBlock = web3.eth.blockNumber
  return MiniMeToken.new(
    parentToken.address,
    snapShotBlock,
    'Clone',
    8,
    'CLONE'
  )
}

contract(TokenName, function(accounts) {
  beforeEach(async () => {
    // Create a token; account[0] is a controller
    token = await Token.new({ from: accounts[0] })
    // Mint 100 tokens for account[0]
    await token.mintTokens(accounts[0], 100e18)
    // Set contoller to nobody to avoid side effects
    await token.changeController('0x0')
    // Move 30 tokens form account[0] to account[1]
    await token.transfer(accounts[1], 30e18, {
      from: accounts[0]
    })
  })

  it('cloning: a cloned Token will keep the original Token transaction history', async () => {
    // Check balances before cloning
    assert.equal((await token.balanceOf.call(accounts[0])).toNumber(), 70e18)
    assert.equal((await token.balanceOf.call(accounts[1])).toNumber(), 30e18)

    token2 = await cloneToken(token)

    // The balance should be the same after cloning
    assert.equal((await token2.balanceOf.call(accounts[0])).toNumber(), 70e18)
    assert.equal((await token2.balanceOf.call(accounts[1])).toNumber(), 30e18)
  })

  it('cloning: a new token could have its own name, symbol and digits', async () => {
    const parentName = await token.name.call()
    const parentSymbol = await token.symbol.call()
    const parentDecimals = (await token.decimals.call()).toNumber()

    token2 = await cloneToken(token)

    assert.notEqual(await token2.name.call(), parentName)
    assert.notEqual(await token2.symbol.call(), parentSymbol)
    assert.notEqual((await token2.decimals.call()).toNumber(), parentDecimals)
  })

  it('cloning: transfer should work after and affect new token only', async () => {
    token2 = await cloneToken(token)

    // Test transfers from account[0]
    await token2.transfer(accounts[3], 10e18, {
      from: accounts[0]
    })
    assert.equal((await token2.balanceOf.call(accounts[0])).toNumber(), 60e18)
    assert.equal((await token2.balanceOf.call(accounts[3])).toNumber(), 10e18)

    // Test transfers from account[1]
    await token2.transfer(accounts[2], 20e18, {
      from: accounts[1]
    })
    assert.equal((await token2.balanceOf.call(accounts[1])).toNumber(), 10e18)
    assert.equal((await token2.balanceOf.call(accounts[2])).toNumber(), 20e18)

    // Balances for parent token should be the same
    assert.equal((await token.balanceOf.call(accounts[0])).toNumber(), 70e18)
    assert.equal((await token.balanceOf.call(accounts[1])).toNumber(), 30e18)
  })
})
