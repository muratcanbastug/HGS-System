const { getNamedAccounts, ethers } = require("hardhat");

async function main() {
  const deployer = (await getNamedAccounts()).deployer;
  const admin = await ethers.getContract("Administration", deployer);
  const transactionResponse = await admin.createOffice(5, 10, 15);
  await transactionResponse.wait(1);

  const officeAddress = await admin.getOfficeAddress(0);
  console.log(`The Office was created at: ${officeAddress} !`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
