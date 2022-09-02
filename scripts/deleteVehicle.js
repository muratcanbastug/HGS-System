// for hgsboxoffice
const { getNamedAccounts, ethers } = require("hardhat");

async function main() {
  const deployer = (await getNamedAccounts()).deployer;
  const user = (await getNamedAccounts()).user;
  const admin = await ethers.getContract("Administration", deployer);

  const transactionResponse = await admin.deleteVehicle(user);
  await transactionResponse.wait(1);

  console.log(`${user} deleted!`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
