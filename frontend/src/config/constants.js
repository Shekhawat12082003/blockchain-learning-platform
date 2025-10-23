export const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || '0xF5689A0B960b9fED8D40422676B580FD10Ed6322';
export const CHAIN_ID = parseInt(import.meta.env.VITE_CHAIN_ID || '1114');
export const CHAIN_NAME = 'Core Testnet2';
export const RPC_URL = 'https://rpc.test2.btcs.network';
export const CONTRACT_ABI = [
  "function issueCertificate(address to, string memory subject, string memory tokenURI_, uint256 sessionCount) external returns (uint256)",
  "function revokeCertificate(uint256 tokenId) external",
  "function isValid(uint256 tokenId) public view returns (bool)",
  "function addIssuer(address issuer) external",
  "function removeIssuer(address issuer) external",
  "function issuers(address) public view returns (bool)",
  "function ownerOf(uint256 tokenId) public view returns (address)",
  "function tokenURI(uint256 tokenId) public view returns (string)",
  "function owner() public view returns (address)",
  "function getUserCertificates(address user) external view returns (uint256[])",
  "function getCertificateData(uint256 tokenId) external view returns (address holder, string memory subject, uint256 timestamp, uint256 sessionCount, bool revoked, string memory uri)",
  "function getUserProgress(address user) external view returns (uint256 totalCertificates, uint256 totalSessions, uint256 points, uint256 level)",
  "function getUserSubjectCount(address user, string memory subject) external view returns (uint256)",
  "function getGlobalStats() external view returns (uint256 totalCerts, uint256 totalUsersCount, uint256 totalTokens)",
  "function balanceOf(address owner) public view returns (uint256)",
  "event CertificateIssued(address indexed to, uint256 indexed tokenId, string subject, uint256 points)",
  "event CertificateRevoked(uint256 indexed tokenId)",
  "event ProgressUpdated(address indexed user, uint256 points, uint256 level)"
];
export const AI_PROVIDERS = {
  GEMINI: 'gemini',
  HUGGINGFACE: 'huggingface',
  COHERE: 'cohere'
};
