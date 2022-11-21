import { ethers } from "hardhat";

async function main() {
  let lockerAddress = "0x95cbf2267ddD3448a1a1Ed5dF9DA2761af02202e"
  let lpToken = "0xc6eEa67c416e3A7FD0BB621cF63736a23FD421bA"
  let testLockID = "30"
  let testAmount = ethers.utils.parseUnits('5', 17).toString()
  let user = "0x9E795FC1C644EcaD8031eD52856FD64B65a678Ac"

  const AutoLocker = await ethers.getContractFactory("TokenAutomator");
  const autoLocker = await AutoLocker.deploy(lockerAddress, lpToken, testLockID, testAmount);

  // await lock.deployed();
  await autoLocker.deployed()

  console.log(`autolocker deployed to ${autoLocker.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
