require("@nomiclabs/hardhat-waffle");
require('@openzeppelin/hardhat-upgrades');

module.exports = {
  solidity: "0.8.3",
  networks: {
    rinkeby: {
      url: "https://rinkeby.infura.io/v3/ef9b396dbd1747a8b372910dc434ac28",
      accounts: ["e5de45d2ef16347934a79f9187e32236c3d3126ed970d762a35a3e008435090f"]
    },
  },
};