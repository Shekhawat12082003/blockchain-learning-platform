const hre = require("hardhat");

/**
 * Unified Deployment Script for AI Learning Tutor Platform
 * Deploys all contracts: LearningCertificate, LearningPathManager, QuizSystem
 * Usage: npx hardhat run scripts/deployAll.js --network testnet
 */

async function main() {
  console.log("🚀 Deploying AI Learning Tutor Platform...\n");

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());
  console.log("");

  // Deploy LearningCertificate
  console.log("📜 Deploying LearningCertificate contract...");
  const LearningCertificate = await hre.ethers.getContractFactory("LearningCertificate");
  const certificate = await LearningCertificate.deploy();
  await certificate.deployed();
  console.log("✅ LearningCertificate deployed to:", certificate.address);
  console.log("");

  // Deploy LearningPathManager
  console.log("📚 Deploying LearningPathManager contract...");
  const LearningPathManager = await hre.ethers.getContractFactory("LearningPathManager");
  const pathManager = await LearningPathManager.deploy();
  await pathManager.deployed();
  console.log("✅ LearningPathManager deployed to:", pathManager.address);
  console.log("");

  // Deploy QuizSystem
  console.log("📝 Deploying QuizSystem contract...");
  const QuizSystem = await hre.ethers.getContractFactory("QuizSystem");
  const quizSystem = await QuizSystem.deploy();
  await quizSystem.deployed();
  console.log("✅ QuizSystem deployed to:", quizSystem.address);
  console.log("");

  // Setup permissions
  console.log("⚙️ Setting up permissions...");
  await pathManager.addEducator(deployer.address);
  console.log("✅ Added deployer as educator");
  
  await quizSystem.addQuizCreator(deployer.address);
  console.log("✅ Added deployer as quiz creator");
  
  await certificate.addIssuer(deployer.address);
  console.log("✅ Added deployer as certificate issuer");
  console.log("");

  // Deployment Summary
  console.log("🎉 Deployment Complete!");
  console.log("");
  console.log("📋 Contract Addresses:");
  console.log("======================");
  console.log("LearningCertificate:", certificate.address);
  console.log("LearningPathManager:", pathManager.address);
  console.log("QuizSystem:", quizSystem.address);
  console.log("");
  console.log("🔗 Network: Core Testnet2");
  console.log("🔗 Explorer: https://scan.test2.btcs.network");
  console.log("");
  console.log("📝 Update frontend/.env with these addresses:");
  console.log(`VITE_CONTRACT_ADDRESS=${certificate.address}`);
  console.log("");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
