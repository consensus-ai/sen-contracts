# Functional tests
Tests are conducted on the Kovan test network. The following contract has been verified on Etherscan.

## [`SEN`](https://kovan.etherscan.io/address/0x9578bbc4d83c31ae61013339d9645a3bcbf74a23#code)

## Accounts

* Owner: [0x00a55ee49d3471282fe8bbe89b6f8d8a58ff4674](https://kovan.etherscan.io/address/0x00a55ee49d3471282fe8bbe89b6f8d8a58ff4674)

## Expected behaviour tests

  - [x] Cannot change controller of SEN if called by non-owner. [`0x3c3746`](https://kovan.etherscan.io/tx/0x3c3746eb38f959974b1f1ed10dac1797ad6952d7f79e3acc874175de9517f53d)
  - [x] Owner can change controller of SEN. [`0xdd35a7`](https://kovan.etherscan.io/tx/0xdd35a7ce50ae58e0a1abf25c1f8256051215a0c7e03d61615b677a1372a5fe6f)
  - [x] Cannot change burner of SEN if called by non-owner. [`0xdd9a7a`](https://kovan.etherscan.io/tx/0xdd9a7a23baa673edd30d217bccefa0c6cc5f7482707d79d0535306f55a6a37b0)
  - [x] Owner can change burner of SEN. [`0x198c1f`](https://kovan.etherscan.io/tx/0x198c1f9268340bdefb6e9322d009a95360e90a8086b93a1dbc4e52d6a91dd5b0)
  - [x] New burner can successfully change burner of SEN. [`0x198c1f`](https://kovan.etherscan.io/tx/0x96475944b67432b1e977f1bfee168554a8092ccedfaa5c17ab39eccc4157cf54)
  - [x] Cannot change controller of SEN before finalize is called. [`0x247590`](https://kovan.etherscan.io/tx/0x2475907a6e124626fac2500e342ae2f626ac3a5b7bbf127c644a6de3f506c6e8)
  - [x] Owner can change controller of SEN after finalize has been called. [`0xb521a2`](https://kovan.etherscan.io/tx/0xb521a2872660748dedb8062a4ca8134236975e9d7d277c233e76d665da22a879)
  - [x] Cannot mintTokens of SEN if called by non-owner. [`0xeccbe2`](https://kovan.etherscan.io/tx/0xeccbe2c8da87cf597b5617f7254c52e31f08751248b8125fa5ff83b5ef35d24d)
  - [x] Cannot mint tokens after finalize has been called [`0x08021e`](https://kovan.etherscan.io/tx/0x08021ea613bfde67e12cace53af6ddcb93fb7c795013307fa6de55dbd9c011b5)
  - [x] Cannot send tokens before finalize has been called [`0xdd35a7`](https://kovan.etherscan.io/tx/0x2817292dd27272f73b9864289931a5aa7700b55ea5c93fc15229bfa5f8e86e3c)
  - [x] Transfer minted tokens after finalize has been called by owner. [`0xf6d0af`](https://kovan.etherscan.io/tx/0xf6d0af260d88f214225a27d9dfd93a9e568422d4c6bca1142388aa4f9e9bb88c)
  - [x] Cannot send tokens before finalize has been called [`0xdd35a7`](https://kovan.etherscan.io/tx/0x2817292dd27272f73b9864289931a5aa7700b55ea5c93fc15229bfa5f8e86e3c)
  - [x] Transfer minted tokens after finalize has been called by owner. [`0xf6d0af`](https://kovan.etherscan.io/tx/0xf6d0af260d88f214225a27d9dfd93a9e568422d4c6bca1142388aa4f9e9bb88c)
  - [x] Owner can transferFrom token balances of token holders. [`0xd93035`](https://kovan.etherscan.io/tx/0xd930353800f9edcd22cfc6f6b445f02671f6c9d038dac91bfc307a9d889f1c63)
  - [x] Non-owner cannot transferFrom token balances between addresses. [`0x938557`](https://kovan.etherscan.io/tx/0x9385571228033b8a1fa551a9c3005f656e6e7de840e5059c5c35f532c4c6f1fa)
  - [x] Owner can burn token balances of token holders. [`0x933067`](https://kovan.etherscan.io/tx/0x933067a2d89f5f70b34c4fd15542e2f1658839f5573ea0756149070d0f19721b)
  - [x] Non-owner cannot burn token balances of token holders. [`0xa6e897`](https://kovan.etherscan.io/tx/0xa6e897f1ef958572632e23a23e25cd5540e926c0ed333936cd1c6ea8b7c42341)

## [`Distribution`](https://kovan.etherscan.io/address/0x86c6eeaca5ae56ebc0ea5a7834ababd71aaa78e5#code)

## Accounts

* Owner: [0x00a55ee49d3471282fe8bbe89b6f8d8a58ff4674](https://kovan.etherscan.io/address/0x00a55ee49d3471282fe8bbe89b6f8d8a58ff4674)

## Expected behaviour tests

 - [x] Cannot change controller of Distribution if called by non-owner. [`0xa2b70e`](https://kovan.etherscan.io/tx/0xa2b70ee2b405b9764c4cd74f60cc679db58847f6b1678a0e29f65cdc12841a07)
 - [x] Finalize fails when distribution cap is not reached [`0xc01ffb`](https://kovan.etherscan.io/tx/0xc01ffbe29c2eb71a413a1aa38d136a5b823e4ee9a5438f19fbcc6740b9d7d154)
 - [x] Successfully mint tokens [`0x0aaf46`](https://kovan.etherscan.io/tx/0x0aaf46bdfd816abfce3ad520a7025ba2cd1abf237a7321009f061c9433bafe00)
 - [x] Fails to mint tokens exceeding distribution cap [`0xeae236`](https://kovan.etherscan.io/tx/0xeae2364d7661953802066bdbf669262e052b9a9d7708632fcc8b469c24acf708)
 - [x] Cannot finalize from non-owner address. [`0x36e8b6`](https://kovan.etherscan.io/tx/0x36e8b69bd0436b2c42bb7c866af45c028f573da3c6fb793565c69f2a91a92bf8)
 - [x] Successfully finalize and transfer reserve tokens to reserve wallet [`0x0b9878`](https://kovan.etherscan.io/tx/0x0b987883128c6c2cfcfb26fa5b0fd53273afc83f262c4b85d291cd5738164ba4)
