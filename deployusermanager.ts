import { ethers } from 'ethers';
import { IMantle, IMantleERC20 } from '@mantlenetworkio/sdk/contracts';

// Replace these with your own values
const MANTLE_RPC_URL = 'https://rpc.testnet.mantle.xyz';
const MANTLE_CONTRACT_ADDRESS = '0x78c1b0C915c4FAA5FffA6CAbf0219DA63d7f4cb8';
const PRIVATE_KEY = 'your_private_key_here';

async function deployUserManager() {
  // Connect to the Mantle network
  const provider = new ethers.providers.JsonRpcProvider(MANTLE_RPC_URL);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

  // Instantiate the Mantle contracts
  const mantle: IMantle = new ethers.Contract(
    MANTLE_CONTRACT_ADDRESS,
    IMantle.abi,
    wallet
  ) as IMantle;

  // Deploy the UserManager contract
  const UserManagerFactory = await ethers.getContractFactory('UserManager', wallet);
  const userManager = await UserManagerFactory.deploy(mantle.address);
  await userManager.deployed();

  console.log('UserManager contract deployed to:', userManager.address);
}

deployUserManager().catch((error) => {
  console.error('Error deploying UserManager contract:', error);
  process.exit(1);
});
