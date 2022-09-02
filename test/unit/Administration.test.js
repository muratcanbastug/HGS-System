const { ethers, getNamedAccounts, deployments } = require("hardhat");
const { assert, expect } = require("chai");
const { developmentChains } = require("../../helper-hardhat-config");

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("Administration", () => {
      let administration,
        deployer,
        user,
        mockV3Aggregator,
        connectedhgsboxoffice;
      const sendValue = ethers.utils.parseEther("0.1");
      beforeEach(async () => {
        deployer = (await getNamedAccounts()).deployer;
        user = (await getNamedAccounts()).user;

        const officeAddress = await admin.getOfficeAddress(0);
        const HGSBoxOfficeFactory = await ethers.getContractFactory(
          "HGSBoxOffice"
        );
        const hgsBoxOffice = await HGSBoxOfficeFactory.attach(officeAddress);
        const connectedhgsboxoffice = await hgsBoxOffice.connect(
          ethers.provider.getSigner(user)
        );

        await deployments.fixture(["all"]);
        administration = await ethers.getContract("Administration", deployer);
        mockV3Aggregator = await ethers.getContract(
          "MockV3Aggregator",
          deployer
        );
      });
      describe("constructor", () => {
        it("Set the aggregator address correctly", async () => {
          const response = administration.getPriceFeed();
          assert(response, mockV3Aggregator.address);
        });
      });

      describe("cross", () => {
        it("Fails if you send dont enough ETH", async () => {
          await expect(
            connectedhgsboxoffice.crossing()
          ).to.be.revertedWithCustomError(
            administration,
            "HGSBoxOffice__LessFee"
          );
        });
      });

      describe("withdraw", () => {
        beforeEach(async () => {
          connectedhgsboxoffice.crossing({
            value: ethers.utils.parseEther("0.01"),
          });
        });

        it("Withdraw ETH from a single office", async () => {
          const startingAdminBalance = await ethers.provider.getBalance(
            administration.address
          );
          const startingDeployerBalance = await ethers.provider.getBalance(
            deployer
          );

          const transactionResponse = await administration.withdraw();
          const transactionReciept = await transactionResponse.wait(1);
          const { gasUsed, effectiveGasPrice } = transactionReciept;
          const gasCost = gasUsed.mul(effectiveGasPrice);

          const endingAdminBalance = await ethers.provider.getBalance(
            administration.address
          );
          const endingDeployerBalance = await ethers.provider.getBalance(
            deployer
          );

          assert(endingFundMeBalance, 0);
          assert(
            startingDeployerBalance.add(startingDeployerBalance).toString(),
            endingDeployerBalance.add(gasCost).toString()
          );
        });

        it("Only allows the owner to withdraw", async () => {
          const accounts = await ethers.getSigners();
          const attacker = accounts[1];
          const attackerConnectedContract = await administration.connect(
            attacker
          );
          await expect(
            attackerConnectedContract.withdraw()
          ).to.be.revertedWithCustomError(
            attackerConnectedContract,
            "Adminisitration__NotOwner"
          );
        });
      });
    });
