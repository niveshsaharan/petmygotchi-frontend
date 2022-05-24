const petMyGotchiJson = require("@scaffold-eth/hardhat/artifacts/contracts/PetMyGotchi.sol/PetMyGotchi.json");
const petMyGotchiNonUpgradableJson = require("@scaffold-eth/hardhat/artifacts/contracts/PetMyGotchiNonUpgradable.sol/PetMyGotchiNonUpgradable.json");
const aavegotchiFacet = require("./AavegotchiFacet.json");
const AavegotchiRealmDiamond = require("./AavegotchiRealmDiamond.json");
// Mainnet DAI, Optimism and Arbitrium Rollup Contracts with local addresses
module.exports = {
  137: {
    contracts: {
      PetMyGotchi: {
        address:
          process.env.REACT_APP_PET_MY_GOTCHI_TYPE === "NON_UPGRADABLE"
            ? "0x154eD36491524650947C1efE499BcBB78Fc11324"
            : "0x490bf5a3662ade6488307caec8ef8e5b789b2db2",
        abi:
          process.env.REACT_APP_PET_MY_GOTCHI_TYPE === "NON_UPGRADABLE"
            ? petMyGotchiNonUpgradableJson.abi
            : petMyGotchiJson.abi,
      },
      AavegotchiFacet: {
        address: "0x86935f11c86623dec8a25696e1c19a8659cbf95d",
        abi: aavegotchiFacet.abi,
      },
      AavegotchiRealmFacet: {
        address: "0x1D0360BaC7299C86Ec8E99d0c1C9A95FEfaF2a11",
        abi: AavegotchiRealmDiamond.abi,
      },
    },
  },
};
