const SEN = artifacts.require('SEN')
const Distribution = artifacts.require('Distribution')

const reserveWallet = process.env['SEN_RESERVE']
const totalSupplyCap = process.env['SEN_TOTAL_SUPPLY'] || 2e11
const totalReserve = process.env['SEN_TOTAL_RESERVE'] || 2e9

module.exports = async function(deployer) {
  const sen = await SEN.new()
  const distribution = await Distribution.new(
    sen.address,
    reserveWallet,
    totalSupplyCap,
    totalReserve
  )
}
