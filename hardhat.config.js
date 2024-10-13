require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
require("@chainlink/env-enc").config();
const {SPOLIA_URL,SPOLIA_ACCOUNT,ETHERSCAN_API_KEY,PRIVATE_KEY_1} = process.env;
require("./tasks")
module.exports = {

  solidity: "0.8.24",
  networks:{
    sepolia:{
      // 网络提供商：Alchemy Infura QuickNode
      url:SPOLIA_URL,
      accounts:[SPOLIA_ACCOUNT,PRIVATE_KEY_1],
      chainId:11155111
    },
    
  },
  etherscan:{
    apiKey:{
      sepolia:ETHERSCAN_API_KEY
    }
  },
  sourcify: {
    // Disabled by default
    // Doesn't need an API key
    enabled: true
  }

};
