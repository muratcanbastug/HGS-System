const { getNamedAccounts, ethers } = require("hardhat");

async function main() {
  const deployer = (await getNamedAccounts()).deployer;
  const admin = await ethers.getContract("Administration", deployer);
  const transactionResponse = await admin.withdraw();
  await transactionResponse.wait(1);
  console.log("All Offices are Withdrawed!");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
