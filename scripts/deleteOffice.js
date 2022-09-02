const { getNamedAccounts, ethers } = require("hardhat");

async function main() {
  const deployer = (await getNamedAccounts()).deployer;
  const admin = await ethers.getContract("Administration", deployer);

  // const transactionResponseCreate = await admin.createOffice(5, 10, 15);
  // await transactionResponseCreate.wait(1);

  const officeAddress = await admin.getOfficeAddress(0);

  const transactionResponseDelete = await admin.deleteOffice(officeAddress);
  await transactionResponseDelete.wait(1);
  console.log(`The Offices at ${officeAddress} was Deleted!`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
