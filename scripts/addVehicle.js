// for hgsboxoffice
const { getNamedAccounts, ethers } = require("hardhat");

async function main() {
  const deployer = (await getNamedAccounts()).deployer;
  const user = (await getNamedAccounts()).user;
  const admin = await ethers.getContract("Administration", deployer);

  const transactionResponse = await admin.addVehicle(
    user,
    1216,
    "Murat",
    "Can",
    1
  );
  await transactionResponse.wait(1);

  console.log(`${user} added!`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
