// for hgsboxoffice
const { getNamedAccounts, ethers } = require("hardhat");

async function main() {
  const deployer = (await getNamedAccounts()).deployer;
  const user = (await getNamedAccounts()).user;
  const admin = await ethers.getContract("Administration", deployer);

  /*   const deployerBalance = await ethers.provider.getBalance(deployer);
  const userBalance = await ethers.provider.getBalance(user);
  console.log(`deployer: ${deployer}, balance: ${deployerBalance}
  user: ${user}, balance: ${userBalance}`); */

  // const transactionResponseCreate = await admin.createOffice(5, 10, 15);
  // await transactionResponseCreate.wait(1);
  // console.log(`The Office created at: ${officeAddress} !`);
  // await admin.addVehicle(user, 1216, "Murat", "Can", 1);

  const officeAddress = await admin.getOfficeAddress(0);

  const HGSBoxOfficeFactory = await ethers.getContractFactory("HGSBoxOffice");
  const hgsBoxOffice = await HGSBoxOfficeFactory.attach(officeAddress);

  const connectedhgsboxoffice = await hgsBoxOffice.connect(
    ethers.provider.getSigner(user)
  );
  const transactionResponseCross = await hgsBoxOffice.setFees(5, 10, 15);
  await transactionResponseCross.wait(1);

  console.log(`Office (${officeAddress}) fees are updated!`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
