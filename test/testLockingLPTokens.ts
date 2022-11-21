
import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
// import { ethers } from "hardhat"
// import { ethers as classicEthers } from 'ethers'
import hre from "hardhat";

import { lockerv2abi } from '../abis/lockerv2abi'
import { pairV2Abi } from '../abis/pairV2Abi'



describe("Autolock Tests", function () {
  before(async function () {
    this.provider = hre.ethers.providers.getDefaultProvider('http://localhost:8545')

    this.lockerAddress = "0x95cbf2267ddD3448a1a1Ed5dF9DA2761af02202e"
    this.lpToken = "0xc6eEa67c416e3A7FD0BB621cF63736a23FD421bA"
    this.testLockID = "30"
    this.testAmount = hre.ethers.utils.parseUnits('5', 17).toString()
    this.user = "0x9E795FC1C644EcaD8031eD52856FD64B65a678Ac"

    this.uniFactory = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f"

    this.impersonatedSigner = await hre.ethers.getImpersonatedSigner("0x9E795FC1C644EcaD8031eD52856FD64B65a678Ac");
    this.lockerContract = new hre.ethers.Contract(this.lockerAddress, lockerv2abi, this.provider)
    this.lpTokenContract = new hre.ethers.Contract(this.lpToken, pairV2Abi, this.provider)

    this.autoLockerContract = await hre.ethers.getContractFactory("TokenAutomator")
    this.deployedAutolocker = await this.autoLockerContract.deploy(this.lockerAddress, this.lpToken, this.testLockID, this.testAmount)
  })


  describe("Run", function () {

    it("It should run", async function () {

      await this.lpTokenContract.connect(this.impersonatedSigner).approve(this.user, this.testAmount)
      await this.lpTokenContract.connect(this.impersonatedSigner).transfer(this.deployedAutolocker.address, this.testAmount)

      expect(await this.lpTokenContract.balanceOf(this.deployedAutolocker.address)).to.equal(hre.ethers.utils.parseUnits('5', 17));

      const wallet = hre.ethers.Wallet.createRandom()

      console.log('address:', wallet.address)
      console.log('mnemonic:', wallet.mnemonic.phrase)
      console.log('privateKey:', wallet.privateKey)

      // let result = await this.deployedAutolocker.connect(this.impersonatedSigner).transferLPsToUnicrypt()
      let result = await this.deployedAutolocker.connect(this.impersonatedSigner).checker()
      console.log(result);

      let lockData = await this.lockerContract.LOCKS(this.testLockID)
      console.log(lockData, 'locker after');

    })


  })
})

