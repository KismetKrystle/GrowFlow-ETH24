// SPDX-License-Identifier: MIT

// Implemented:
// 1. User Registration
// 2. Asset Management
// 3. User balance tracking

// Not implemented
// 1. Progress tracking

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract UserMetadataManager is ERC721URIStorage {

    address public owner;
    uint256 public tokenIdCounter;
    string private _usrMetadata;
    uint256 public assetPrice;

    // Mapping from user address to their assets (NFTs)
    mapping(address => uint256[]) private _userAssets;

    // Metadata contains username, user data etc.
    mapping(address => string) private _addrUsrMetadata;

    // Mapping from user address to their in-game token balance
    mapping(address => uint256) private _userBalances;

    constructor() ERC721("UsrAssetsNFT", "AssetsNFT") {}

    // Register user's metadata
    function register(address _usr, string calldata _usrMetadata) private {
        require(bytes(_addrUsrMetadata[_usr]).length == 0, "Username already taken.");
        _addrUsrMetadata[_usr] = _usrMetadata;
    }

    // Retrieve the metadata for a specific user
    function getMetadata(address _usr) public view returns (string memory _usrmetadata) {
        require(bytes(_addrUsrMetadata[_usr]).length != 0, "No metadata for the user found.");
        return _addrUsrMetadata[_usr];
    }

    // Update user's metadata
    function updateMetadata(address _usr, string calldata _usrMetadata) private {
        require(bytes(_addrUsrMetadata[_usr]).length != 0, "No metadata for the user found.");
        _addrUsrMetadata[_usr] = _usrMetadata;
    }

    // Function to mint a new NFT
    function mintAsset(address _user, string memory _metadataURI) public {
        // Increment the token ID counter
        tokenIdCounter++;

        // Mint the NFT and assign it to the user
        uint256 tokenId = tokenIdCounter;
        _mint(_user, tokenId);

        // Set the metadata URI
        _setTokenURI(tokenId, _metadataURI);

        // Link the NFT (tokenId) to the user's profile by storing it in the userAssets mapping
        _userAssets[_user].push(tokenId);
    }

    // Function to get all assets (NFTs) for a specific user
    function getUserAssets(address _user) external view returns (uint256[] memory) {
        return _userAssets[_user];
    }

    // Mint in-game tokens to a specific user
    function mintTokens(address _user, uint256 _amount) public {
        require(_amount > 0, "Amount must be greater than zero.");
        _userBalances[_user] += _amount;
    }

    // Get the in-game token balance for a specific user
    function getBalance(address _user) public view returns (uint256) {
        return _userBalances[_user];
    }

    // Decrease the in-game token balance of a user
    function spendTokens(address _user, uint256 _amount) external {
        require(_userBalances[_user] >= _amount, "Insufficient balance.");
        _userBalances[_user] -= _amount;
    }

}
