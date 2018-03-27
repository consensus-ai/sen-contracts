const WalletProvider = require('truffle-wallet-provider')

const infuraToken = process.env['INFURA_TOKEN']

// Read and unlock keystore
const keystore = require('fs')
  .readFileSync('./keystore')
  .toString()
const pass = require('fs')
  .readFileSync('./pass')
  .toString()
  .trim()
const wallet = require('ethereumjs-wallet').fromV3(keystore, pass, true)

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {
    ganache: {
      host: '127.0.0.1',
      port: 7545,
      network_id: 5777
    },
    ropsten: {
      provider: new WalletProvider(wallet, 'https://ropsten.infura.io/'),
      network_id: 3,
      gas: 4000000
    },
    mainnet: {
      provider: new WalletProvider(wallet, 'https://mainnet.infura.io/'),
      network_id: 1,
      gas: 4000000
    }
  }
}
