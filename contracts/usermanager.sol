// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import { IMantle } from '@mantlenetworkio/sdk/contracts/IMantle.sol';
import { IMantleERC20 } from '@mantlenetworkio/sdk/contracts/IMantleERC20.sol';
import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

contract UserManager {
    address public owner;

    struct User {
        string username;
        address wallet;
        uint256[] ownedNFTs; // Array of owned NFT IDs
        uint256[] achievements; // Array of completed challenge IDs
        uint256 tokenBalance;
    }

    mapping(address => User) public users;
    mapping(address => bool) public isRegistered;

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    modifier onlyRegisteredUser() {
        require(isRegistered[msg.sender], "User not registered");
        _;
    }

   IMantle public mantle;

constructor(address _mantleAddress) {
    mantle = IMantle(0x78c1b0C915c4FAA5FffA6CAbf0219DA63d7f4cb8);
    owner = msg.sender;
}


    }

    // Register a new user
    function registerUser(string memory username) public {
        require(!isRegistered[msg.sender], "Already registered");
        users[msg.sender] = User({
            username: username,
            wallet: msg.sender,
            ownedNFTs: new uint256[](0),          
            achievements: new uint256[](0),
       tokenBalance: 0
        });
        isRegistered[msg.sender] = true;
    }

    // Add an NFT to a user's profile
    function addNFTToUser(uint256 nftId) public onlyRegisteredUser {
        users[msg.sender].ownedNFTs.push(nftId);
    }

    // Track user achievements
    function addAchievement(uint256 achievementId) public onlyRegisteredUser {
        users[msg.sender].achievements.push(achievementId);
    }

    // Update token balance for a user
    function updateTokenBalance(uint256 amount, bool add) public onlyOwner {
    IMantleERC20 mantleToken = IMantleERC20(mantle.getERC20Token());
    if (add) {
        mantleToken.deposit(msg.sender, amount);
        users[msg.sender].tokenBalance += amount;
    } else {
        require(users[msg.sender].tokenBalance >= amount, "Insufficient balance");
        mantleToken.withdraw(msg.sender, amount);
        users[msg.sender].tokenBalance -= amount;
    }
}


    // Get user profile
    function getUserProfile(address userAddress) 
        public 
        view 
        returns (User memory) 
    {
        require(isRegistered[userAddress], "User not registered");
        return users[userAddress];
    }
}



