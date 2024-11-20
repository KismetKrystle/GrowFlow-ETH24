import { ethers } from 'ethers';
import { IMantle, IMantleERC20 } from '@mantlenetworkio/sdk/contracts';
import { expect } from 'chai';

// Replace these with your own values
const MANTLE_RPC_URL = 'https://rpc.testnet.mantle.xyz';
const MANTLE_CONTRACT_ADDRESS = '0x78c1b0C915c4FAA5FffA6CAbf0219DA63d7f4cb8';
const OWNER_PRIVATE_KEY = 'your_owner_private_key_here';
const USER_PRIVATE_KEY = 'your_user_private_key_here';

describe('UserManager', () => {
  let owner: ethers.Wallet;
  let user: ethers.Wallet;
  let userManager: ethers.Contract;
  let mantle: IMantle;
  let mantleToken: IMantleERC20;

  before(async () => {
    // Connect to the Mantle network
    const provider = new ethers.providers.JsonRpcProvider(MANTLE_RPC_URL);
    owner = new ethers.Wallet(OWNER_PRIVATE_KEY, provider);
    user = new ethers.Wallet(USER_PRIVATE_KEY, provider);

    // Instantiate the Mantle contracts
    mantle = new ethers.Contract(MANTLE_CONTRACT_ADDRESS, IMantle.abi, owner) as IMantle;
    mantleToken = new ethers.Contract(await mantle.getERC20Token(), IMantleERC20.abi, owner) as IMantleERC20;

    // Deploy the UserManager contract
    const UserManagerFactory = await ethers.getContractFactory('UserManager', owner);
    userManager = await UserManagerFactory.deploy(mantle.address);
    await userManager.deployed();
  });

  it('should register a new user', async () => {
    const username = 'testuser';
    await userManager.connect(user).registerUser(username);

    const userProfile = await userManager.getUserProfile(user.address);
    expect(userProfile.username).to.equal(username);
    expect(userProfile.wallet).to.equal(user.address);
    expect(userProfile.ownedNFTs.length).to.equal(0);
    expect(userProfile.achievements.length).to.equal(0);
    expect(userProfile.tokenBalance).to.equal(0);
  });

  it('should add an NFT to a user', async () => {
    const nftId = 1234;
    await userManager.connect(user).addNFTToUser(nftId);

    const userProfile = await userManager.getUserProfile(user.address);
    expect(userProfile.ownedNFTs.length).to.equal(1);
    expect(userProfile.ownedNFTs[0]).to.equal(nftId);
  });

  it('should add an achievement to a user', async () => {
    const achievementId = 5678;
    await userManager.connect(user).addAchievement(achievementId);

    const userProfile = await userManager.getUserProfile(user.address);
    expect(userProfile.achievements.length).to.equal(1);
    expect(userProfile.achievements[0]).to.equal(achievementId);
  });

  it('should update the token balance for a user', async () => {
    const amount = 100;
    await userManager.connect(owner).updateTokenBalance(amount, true);

    const userProfile = await userManager.getUserProfile(user.address);
    expect(userProfile.tokenBalance).to.equal(amount);

    await userManager.connect(owner).updateTokenBalance(amount, false);
    expect(await userManager.getUserProfile(user.address)).to.have.property('tokenBalance', 0);
  });
});
