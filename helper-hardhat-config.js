const networkConfig = {
  4: {
    name: "rinkeby",
    ethUsdPriceFeed: "0x8a753747a1fa494ec906ce90e9f37563a8af630e",
  },
};

const developmentChains = ["hardhat", "localhost"];
const DECIMALS = 8;
const INITIAL_ANSWER = 200000000000;

module.exports = {
  networkConfig,
  developmentChains,
  DECIMALS,
  INITIAL_ANSWER,
};
