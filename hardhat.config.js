/** @type import('hardhat/config').HardhatUserConfig */
require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-etherscan");
require("dotenv").config();
require("./tasks/block-number");
require("hardhat-gas-reporter");
require("solidity-coverage");
require("hardhat-deploy");

const RINKEBY_RPC_URL = process.env.RINKEBY_RPC_URL || "https://eth-rinkeby";
const PRIVATE_KEY_DEPLOYER = process.env.PRIVATE_KEY_DEPLOYER || "0xkey";
const PRIVATE_KEY_USER = process.env.PRIVATE_KEY_USER || "0xkey";
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "key";
const LOCALHOST_RPC_URL = process.env.LOCALHOST_RPC_URL;
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY || "key";

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    rinkeby: {
      url: RINKEBY_RPC_URL,
      accounts: [PRIVATE_KEY_DEPLOYER, PRIVATE_KEY_USER],
      chainId: 4,
      blockConfirmations: 6,
    },
    localhost: {
      url: LOCALHOST_RPC_URL,
      chainId: 31337,
    },
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
  gasReporter: {
    enabled: true,
    outputFile: "gas-report.txt",
    noColors: true,
    currency: "USD",
    coinmarketcap: COINMARKETCAP_API_KEY,
    token: "ETH",
  },
  namedAccounts: {
    deployer: {
      default: 0,
      4: 0,
      31337: 0,
    },
    user: {
      default: 0,
      4: 1,
      31337: 1,
    },
  },
  plugins: ["solidity-coverage"],
  solidity: {
    compilers: [{ version: "0.8.16" }, { version: "0.6.6" }],
  },
};
