require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.27",
};
{
  "contracts": {
    "Calculator": {
      "source": "./lock.sol",
      "aliases": {
        "testing": "0x0000000000000006"
      }
    }
  },
  "networks": {...},
  "accounts": {...},
  "deployments": {...}
}
{
  "contracts": {
    "Calculator": {
      "source": "./usermanager.sol",
      "aliases": {
        "testing": "0x0000000000000005"
      }
    }
  },
  "networks": {...},
  "accounts": {...},
  "deployments": {...}
}
