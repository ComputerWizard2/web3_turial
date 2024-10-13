//import enthers.js
//create main function
//execute main function 
  
const {ethers} = require("hardhat")
async function main(){
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

  // init 2 accounts
  const [firstAccount,secondAccount] = await ethers.getSigners();
 // fund contract with first account
  const fundTx = await fundMe.fundMe({value:ethers.parseEther("0.01")});
  await fundTx.wait();
  // check balance of contract
  const balance = await ethers.provider.getBalance(fundMe.target);
  console.log(`Contract balance: ${ethers.formatEther(balance)} ETH`);
  // fund contract with second account
  const fundTx2 = await fundMe.connect(secondAccount).fundMe({value:ethers.parseEther("0.01")});
  await fundTx2.wait();
  // check balance of contract
  const balance2 = await ethers.provider.getBalance(fundMe.target);
  console.log(`Contract balance: ${ethers.formatEther(balance2)} ETH`);
  // check mapping fundersToAmounts
  const firstBalance =  await fundMe.fundersToAmounts(firstAccount.address);
  const secondBalance = await fundMe.fundMersToAmounts(secondAccount.address);
  console.log(`First account balance: ${ethers.formatEther(firstBalance)} ETH`);
  console.log(`Second account balance: ${ethers.formatEther(secondBalance)} ETH`);
 
}
async function verifyFundMe(fundMe,args){
  console.log("Contract deployed wait 5 confirmations");
  await fundMe.deploymentTransaction().wait(5);
  await hre.run("verify:verify", {
    address: fundMe.target,
    constructorArguments: [args],
  });
}



main().then().catch((error)=>{
  console.error(error);
  process.exit(1);
})