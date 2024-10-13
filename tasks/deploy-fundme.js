const {task} = require('hardhat/config');
task("deploy-fundme").setAction(async (taskArgs, hre) => {
  //create factory
  const fundMeFactory = await ethers.getContractFactory("FundMe");
  console.log("Deploying contract...");
  //deplay contract from factory
  const fundMe = await fundMeFactory.deploy(10); 
  await fundMe.waitForDeployment();
  console.log(`FundMe deployed to: ${fundMe.target} `);
  if(hre.network.config.chainId===11155111 && process.env.ETHERSCAN_API_KEY){
    await verifyFundMe(fundMe,300);
  }else{
    console.log("Contract not deployed on sepolia");
  }
})
async function verifyFundMe(fundMe,args){
  console.log("Contract deployed wait 5 confirmations");
  await fundMe.deploymentTransaction().wait(5);
  await hre.run("verify:verify", {
    address: fundMe.target,
    constructorArguments: [args],
  });
}
module.exports = {};
