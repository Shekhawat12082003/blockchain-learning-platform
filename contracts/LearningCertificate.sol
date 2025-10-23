// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title LearningCertificate
 * @dev Enhanced ERC721 token for learning certificates with progress tracking and achievements
 */
contract LearningCertificate is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    
    Counters.Counter private _tokenIds;
    
    // Structs
    struct CertificateData {
        address holder;
        string subject;
        uint256 timestamp;
        uint256 sessionCount;
        bool revoked;
        address issuer;
    }
    
    struct UserProgress {
        uint256 totalCertificates;
        uint256 totalSessions;
        uint256 points;
        uint256 level;
        mapping(string => uint256) subjectCertificates; // subject => count
    }
    
    struct LeaderboardEntry {
        address user;
        uint256 points;
        uint256 certificates;
    }
    
    // Storage
    mapping(uint256 => CertificateData) public certificates;
    mapping(address => UserProgress) public userProgress;
    mapping(address => bool) public issuers;
    mapping(string => uint256) public subjectCertificatesIssued;
    
    // Global stats
    uint256 public totalCertificatesIssued;
    uint256 public totalUsers;
    
    // Events
    event CertificateIssued(
        address indexed to,
        uint256 indexed tokenId,
        string subject,
        uint256 points
    );
    event CertificateRevoked(uint256 indexed tokenId);
    event IssuerAdded(address indexed issuer);
    event IssuerRemoved(address indexed issuer);
    event ProgressUpdated(address indexed user, uint256 points, uint256 level);
    
    modifier onlyIssuer() {
        require(issuers[msg.sender] || msg.sender == owner(), "Not authorized issuer");
        _;
    }
    
    constructor() ERC721("Learning Certificate", "LEARN") {
        _tokenIds.increment(); // Start from 1
    }
    
    /**
     * @dev Issue a new certificate with learning data
     */
    function issueCertificate(
        address to,
        string memory subject,
        string memory tokenURI_,
        uint256 sessionCount
    ) external onlyIssuer returns (uint256) {
        require(to != address(0), "Invalid address");
        
        uint256 tokenId = _tokenIds.current();
        _tokenIds.increment();
        
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenURI_);
        
        // Calculate points based on sessions
        uint256 points = sessionCount * 10; // 10 points per session
        
        // Store certificate data
        certificates[tokenId] = CertificateData({
            holder: to,
            subject: subject,
            timestamp: block.timestamp,
            sessionCount: sessionCount,
            revoked: false,
            issuer: msg.sender
        });
        
        // Update user progress
        UserProgress storage progress = userProgress[to];
        if (progress.totalCertificates == 0) {
            totalUsers++;
        }
        
        progress.totalCertificates++;
        progress.totalSessions += sessionCount;
        progress.points += points;
        progress.subjectCertificates[subject]++;
        
        // Level up logic (every 100 points = 1 level)
        progress.level = progress.points / 100;
        
        // Update global stats
        totalCertificatesIssued++;
        subjectCertificatesIssued[subject]++;
        
        emit CertificateIssued(to, tokenId, subject, points);
        emit ProgressUpdated(to, progress.points, progress.level);
        
        return tokenId;
    }
    
    /**
     * @dev Revoke a certificate
     */
    function revokeCertificate(uint256 tokenId) external onlyIssuer {
        require(_exists(tokenId), "Certificate doesn't exist");
        require(!certificates[tokenId].revoked, "Already revoked");
        
        certificates[tokenId].revoked = true;
        emit CertificateRevoked(tokenId);
    }
    
    /**
     * @dev Check if certificate is valid
     */
    function isValid(uint256 tokenId) public view returns (bool) {
        return _exists(tokenId) && !certificates[tokenId].revoked;
    }
    
    /**
     * @dev Get user's certificates
     */
    function getUserCertificates(address user) external view returns (uint256[] memory) {
        uint256 balance = balanceOf(user);
        uint256[] memory tokenIds = new uint256[](balance);
        
        uint256 currentIndex = 0;
        for (uint256 i = 1; i < _tokenIds.current() && currentIndex < balance; i++) {
            if (_exists(i) && ownerOf(i) == user) {
                tokenIds[currentIndex] = i;
                currentIndex++;
            }
        }
        
        return tokenIds;
    }
    
    /**
     * @dev Get certificate details
     */
    function getCertificateData(uint256 tokenId) external view returns (
        address holder,
        string memory subject,
        uint256 timestamp,
        uint256 sessionCount,
        bool revoked,
        string memory uri
    ) {
        require(_exists(tokenId), "Certificate doesn't exist");
        
        CertificateData memory cert = certificates[tokenId];
        return (
            cert.holder,
            cert.subject,
            cert.timestamp,
            cert.sessionCount,
            cert.revoked,
            tokenURI(tokenId)
        );
    }
    
    /**
     * @dev Get user progress
     */
    function getUserProgress(address user) external view returns (
        uint256 totalCertificates,
        uint256 totalSessions,
        uint256 points,
        uint256 level
    ) {
        UserProgress storage progress = userProgress[user];
        return (
            progress.totalCertificates,
            progress.totalSessions,
            progress.points,
            progress.level
        );
    }
    
    /**
     * @dev Get subject certificate count for user
     */
    function getUserSubjectCount(address user, string memory subject) external view returns (uint256) {
        return userProgress[user].subjectCertificates[subject];
    }
    
    /**
     * @dev Get global statistics
     */
    function getGlobalStats() external view returns (
        uint256 totalCerts,
        uint256 totalUsersCount,
        uint256 totalTokens
    ) {
        return (totalCertificatesIssued, totalUsers, _tokenIds.current() - 1);
    }
    
    /**
     * @dev Add an issuer
     */
    function addIssuer(address issuer) external onlyOwner {
        require(issuer != address(0), "Invalid address");
        issuers[issuer] = true;
        emit IssuerAdded(issuer);
    }
    
    /**
     * @dev Remove an issuer
     */
    function removeIssuer(address issuer) external onlyOwner {
        issuers[issuer] = false;
        emit IssuerRemoved(issuer);
    }
    
    /**
     * @dev Prevent transfers to keep certificates soulbound (optional)
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal virtual override {
        // Allow minting and burning, but prevent transfers
        require(from == address(0) || to == address(0), "Certificates are soulbound");
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }
}
