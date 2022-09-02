const { task } = require("hardhat/config");

task("block-number", "Prints the current block number").setAction(
  async (hre, args) => {
    const blockNumber = await ethers.provider.getBlockNumber();
    console.log(`Current Block Number: ${blockNumber}`);
  }
);

module.exports = {};
