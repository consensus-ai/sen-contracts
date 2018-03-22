const TokenName = 'SEN'
const Token = artifacts.require(TokenName)
const Distribution = artifacts.require('DistributionMock')

const assertFail = require('./helpers/assertFail')

let token
let distribution

const totalSupplyCap = 100e18
const totalReserve = 10e18

contract('Distribution Initialize', function(accounts) {
  beforeEach(async () => {
    token = await Token.new({ from: accounts[0] })
  })

  it('Reserve should be less than total supply cap', async () => {
    await assertFail(async () => {
      const distribution = await Distribution.new(
        token.address,
        accounts[9],
        totalSupplyCap,
        totalSupplyCap
      )
    })
  })

  it('Distribution cap is a diffence between total supply cap and reserve', async () => {
    const distribution = await Distribution.new(
      token.address,
      accounts[9],
      totalSupplyCap,
      totalReserve
    )
    assert.equal(
      (await distribution.distributionCap()).toNumber(),
      totalSupplyCap - totalReserve
    )
  })

  it('Token total supply should be 0 at the beginning of distribution', async () => {
    await token.mintTokens(accounts[0], 10e18)
    assert.equal((await token.totalSupply()).toNumber(), 10e18)

    await assertFail(async () => {
      const distribution = await Distribution.new(
        token.address,
        accounts[9],
        totalSupplyCap,
        totalReserve
      )
    })
  })
})
