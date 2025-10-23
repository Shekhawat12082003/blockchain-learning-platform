const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying QuizSystem...\n");

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with:", deployer.address);

  // Deploy QuizSystem
  const QuizSystem = await hre.ethers.getContractFactory("QuizSystem");
  const quizSystem = await QuizSystem.deploy();
  await quizSystem.deployed();

  console.log("✅ QuizSystem deployed to:", quizSystem.address);
  console.log("");

  // Add deployer as quiz creator
  console.log("Setting up permissions...");
  await quizSystem.addQuizCreator(deployer.address);
  console.log("✅ You are now a quiz creator!");
  console.log("");

  // Create sample questions
  console.log("Creating sample quiz questions...");
  
  const q1 = await quizSystem.createQuestion(
    "What is the capital of France?",
    "ipfs://sample1",
    10,
    1,
    "Geography"
  );
  await q1.wait();
  console.log("✅ Question 1 created");

  const q2 = await quizSystem.createQuestion(
    "What is 2 + 2?",
    "ipfs://sample2",
    10,
    1,
    "Mathematics"
  );
  await q2.wait();
  console.log("✅ Question 2 created");

  const q3 = await quizSystem.createQuestion(
    "What is the largest planet in our solar system?",
    "ipfs://sample3",
    10,
    2,
    "Science"
  );
  await q3.wait();
  console.log("✅ Question 3 created");

  console.log("");
  console.log("Creating a sample quiz...");

  // Create a quiz with these questions
  const quiz = await quizSystem.createQuiz(
    "General Knowledge Quiz",
    "General",
    [1, 2, 3], // Question IDs
    70, // Passing score 70%
    15 // 15 minutes time limit
  );
  await quiz.wait();
  console.log("✅ Quiz created with ID: 1");

  console.log("");
  console.log("📋 Summary:");
  console.log("===================");
  console.log("Contract Address:", quizSystem.address);
  console.log("Questions Created: 3");
  console.log("Quiz Created: 1 (ID: 1)");
  console.log("");
  console.log("📱 To take the quiz:");
  console.log("1. Update frontend/.env with this address:");
  console.log(`   VITE_QUIZ_SYSTEM_ADDRESS=${quizSystem.address}`);
  console.log("2. Or use the frontend's AI-generated quizzes (no blockchain needed)");
  console.log("");
  console.log("🎓 To create more quizzes:");
  console.log("   Use the contract functions in Hardhat console");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
