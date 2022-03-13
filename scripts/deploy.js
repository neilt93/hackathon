const main = async () => {
  const marketplaceContractFactory = await hre.ethers.getContractFactory('Marketplace');
  const marketplaceContract = await marketplaceContractFactory.deploy({
    value: hre.ethers.utils.parseEther('0.001'),
  });

  await marketplaceContract.deployed();

  console.log('Marketplace address: ', marketplaceContract.address);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

runMain();