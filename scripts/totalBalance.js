const { getNamedAccounts, ethers } = require("hardhat");

async function main() {
  const deployer = (await getNamedAccounts()).deployer;
  const admin = await ethers.getContract("Administration", deployer);
  const totalBalance = await admin.totalBalanceOfOffices();
  console.log(`Total Balance: ${totalBalance}`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
