import React, { useCallback, useEffect, useState } from "react";
import externalContracts from "./contracts/external_contracts";
import { useStaticJsonRPC } from "./hooks";
import { useContractLoader, useUserProviderAndSigner } from "eth-hooks";
import { Header } from "./components";
import { ethers } from "ethers";
import { GELATO_ADDRESS, INFURA_ID } from "./constants";
import { Transactor, Web3ModalSetup } from "./helpers";
import Stats from "./components/Stats";
import ApproveSmartContract from "./components/ApproveSmartContract";
import { notification } from "antd";
import TakeCareOfMyPets from "./components/TakeCareOfMyPets";
import { utils } from "ethers/lib.esm";
import DepositFunds from "./components/DepositFunds";
import Footer from "./components/Footer";
import getUrlParam from "./helpers/getUrlParam";
import Faq from "./components/Faq";
import Aavegotchis from "./components/Aavegotchis";
import Parcels from "./components/Parcels";
import getAaltarByLevel from "./helpers/getAaltarByLevel";
import { ApolloClient, InMemoryCache, gql, useLazyQuery } from "@apollo/client";
import moment from "moment";
import getChannelingCutoffTimeInUTC from "./helpers/getChannelingCutoffTimeInUTC";
const { MultiCall } = require("@indexed-finance/multicall");
let web3Modal = Web3ModalSetup();

const aavegotchiCoreMaticClient = new ApolloClient({
  uri: "https://api.thegraph.com/subgraphs/name/aavegotchi/aavegotchi-core-matic",
  cache: new InMemoryCache(),
});

const aavegotchiLendingMaticClient = new ApolloClient({
  uri: "https://api.thegraph.com/subgraphs/name/froid1911/aavegotchi-lending",
  cache: new InMemoryCache(),
});

const aavegotchiRealmMaticClient = new ApolloClient({
  uri: "https://api.thegraph.com/subgraphs/name/aavegotchi/aavegotchi-realm-matic",
  cache: new InMemoryCache(),
});

const gotchiverseMaticClient = new ApolloClient({
  uri: "https://api.thegraph.com/subgraphs/name/aavegotchi/gotchiverse-matic",
  cache: new InMemoryCache(),
});
const aavegotchiSvgClient = new ApolloClient({
  uri: "https://api.thegraph.com/subgraphs/name/aavegotchi/aavegotchi-svg",
  cache: new InMemoryCache(),
});

function App() {
  const [injectedProvider, setInjectedProvider] = useState();
  const [address, setAddress] = useState();
  const [isPetOperatorForAll, setIsPetOperatorForAll] = useState();
  const [isParentAdded, setIsParentAdded] = useState();
  const [totalParents, setTotalParents] = useState();
  const [totalPets, setTotalPets] = useState();
  const [totalPetsOfMine, setTotalPetsOfMine] = useState();
  const [accountBalance, setAccountBalance] = useState();
  const [feePerPetPerDay, setFeePerPetPerDay] = useState();
  const [whenNextDepositIsRequired, setWhenNextDepositIsRequired] = useState();
  const [nextPetTimeForChildrenOf, setNextPetTimeForChildrenOf] = useState();
  const [gotchis, setGotchis] = useState({});
  const [parcels, setParcels] = useState([]);

  const impersonate = getUrlParam("coinbase");

  const targetNetwork = {
    name: "polygon",
    chainId: 137,
    rpcUrlInfura: "https://polygon-mainnet.infura.io/v3/" + INFURA_ID,
    rpcUrl: "https://polygon-rpc.com/",
    blockExplorer: "https://polygonscan.com/",
  };

  const rpcUrl =
    targetNetwork[getUrlParam("rpc")] ||
    process.env["REACT_APP_RPC_URL_" + targetNetwork.chainId] ||
    targetNetwork.rpcUrl;

  web3Modal = Web3ModalSetup(rpcUrl);

  const localProvider = useStaticJsonRPC([
    process.env.REACT_APP_PROVIDER ? process.env.REACT_APP_PROVIDER : rpcUrl || targetNetwork.rpcUrl,
  ]);

  const provider = localProvider || injectedProvider;

  const userProviderAndSigner = useUserProviderAndSigner(injectedProvider, localProvider, false);
  const userSigner = userProviderAndSigner.signer;

  const localChainId = localProvider && localProvider._network && localProvider._network.chainId;
  const selectedChainId =
    userSigner && userSigner.provider && userSigner.provider._network && userSigner.provider._network.chainId;

  if (selectedChainId && localChainId && selectedChainId !== localChainId) {
    notification.warn({
      message: "Wrong Network!",
      description: "Please change the network to " + targetNetwork.name,
      placement: "topRight",
      key: "wrong-network",
      duration: null,
    });
  } else {
    notification.close("wrong-network");
  }

  const contractConfig = { deployedContracts: {}, externalContracts: externalContracts || {} };

  // Load in your local 📝 contract and read a value from it:
  const readContracts = useContractLoader(localProvider, contractConfig);

  // If you want to make 🔐 write transactions to your contracts, use the userSigner:
  const writeContracts = useContractLoader(userSigner, contractConfig, localChainId);
  const tx = Transactor(userSigner);

  const getAavegotchiUserQuery = gql`
    query GetUsers($address: String!) {
      users(where: { id: $address }) {
        id
        gotchisOwned {
          id
          gotchiId
          owner {
            id
          }
          originalOwner {
            id
          }
          name
          status
          escrow
          kinship
          lastInteracted
          experience
          locked
          createdAt
          claimedAt
          locked
          lending
          activeListing
        }
        gotchisLentOut
        gotchisBorrowed
      }
    }
  `;

  const getAavegotchiLendingsQuery = gql`
    query GetGotchiLendings($address: String!) {
      gotchiLendings: gotchiLendings(first: 1000, where: { lender: $address, cancelled: false, completed: false }) {
        id
        lender
        borrower
        upfrontCost
        period
        splitOwner
        splitBorrower
        splitOther
        originalOwner
        rentDuration
        timeAgreed
        completed
        lastClaimed
        gotchi {
          id
          gotchiId
          owner {
            id
          }
          name
          status
          escrow
          kinship
          lastInteracted
          experience
          locked
          createdAt
          claimedAt
          locked
          lending
          activeListing
        }
      }

      gotchiBorrowings: gotchiLendings(first: 1000, where: { borrower: $address, cancelled: false, completed: false }) {
        id
        lender
        borrower
        upfrontCost
        period
        splitOwner
        splitBorrower
        splitOther
        originalOwner
        rentDuration
        timeAgreed
        completed
        lastClaimed
        gotchi {
          id
          gotchiId
          owner {
            id
          }
          name
          status
          escrow
          kinship
          lastInteracted
          experience
          locked
          createdAt
          claimedAt
          locked
          lending
          activeListing
        }
      }
    }
  `;

  const getAavegotchiSvgQuery = gql`
    query GetSVG($ids: [String!]!) {
      aavegotchis(first: 1000, where: { id_in: $ids }) {
        id
        svg
      }
    }
  `;

  const getGotchisChannelQuery = gql`
    query GetGotchisData($ids: [String!]!) {
      gotchis(orderBy: lastChanneledAlchemica, orderDirection: desc, where: { id_in: $ids }) {
        id
        lastChanneledAlchemica
      }
    }
  `;

  const [getAavegotchiSvgQueryData] = useLazyQuery(getAavegotchiSvgQuery, {
    client: aavegotchiSvgClient,
  });

  const [getAavegotchiLendingsQueryData] = useLazyQuery(getAavegotchiLendingsQuery, {
    client: aavegotchiLendingMaticClient,
  });

  const [getGotchisChannelQueryData] = useLazyQuery(getGotchisChannelQuery, {
    client: gotchiverseMaticClient,
  });

  const [getAavegotchiUserQueryData] = useLazyQuery(getAavegotchiUserQuery, {
    client: aavegotchiCoreMaticClient,
    onCompleted: async ({ users: data }) => {
      const aavegotchiUser = data[0];

      const myGotchis = {};
      aavegotchiUser.gotchisOwned
        .filter(gotchi => {
          return !aavegotchiUser.gotchisBorrowed.includes(gotchi.gotchiId);
        })
        .forEach(gotchi => {
          gotchi = { ...gotchi };
          gotchi.borrowed = false;
          gotchi.owned = true;

          myGotchis[gotchi.gotchiId] = gotchi;
        });

      const b = await getAavegotchiLendingsQueryData({
        variables: { address: (impersonate || address).toLowerCase() },
      });
      const gotchiLendings = b.data.gotchiLendings;
      const gotchiBorrowings = b.data.gotchiBorrowings;

      gotchiLendings.forEach(gotchiLending => {
        const gotchi = { ...gotchiLending.gotchi };
        if (parseInt(gotchi.timeAgreed) > 0) {
          gotchi.owned = true;
          gotchi.borrowed = false;
          gotchi.owner = { id: impersonate || address };
          gotchi.borrower = gotchiLending.borrower;
          gotchi.listingId = gotchiLending.id;
          gotchi.lender = gotchiLending.lender;
          gotchi.period = gotchiLending.period;
          gotchi.rentDuration = gotchiLending.rentDuration;
          gotchi.timeAgreed = gotchiLending.timeAgreed;
          gotchi.upfrontCost = gotchiLending.upfrontCost;
          gotchi.revenueSplit = [gotchi.splitOwner, gotchi.splitBorrower, gotchi.splitOther];

          myGotchis[gotchi.gotchiId] = gotchi;
        }
      });

      gotchiBorrowings.forEach(gotchiBorrowing => {
        const gotchi = { ...gotchiBorrowing.gotchi };
        gotchi.owned = false;
        gotchi.borrowed = true;
        gotchi.owner = gotchiBorrowing.lender;
        gotchi.borrower = gotchiBorrowing.borrower;
        gotchi.listingId = gotchiBorrowing.id;
        gotchi.lender = gotchiBorrowing.lender;
        gotchi.period = gotchiBorrowing.period;
        gotchi.rentDuration = gotchiBorrowing.rentDuration;
        gotchi.timeAgreed = gotchiBorrowing.timeAgreed;
        gotchi.upfrontCost = gotchiBorrowing.upfrontCost;
        gotchi.revenueSplit = [gotchiBorrowing.splitOwner, gotchiBorrowing.splitBorrower, gotchiBorrowing.splitOther];
        myGotchis[gotchi.gotchiId] = gotchi;
      });

      // Get SVGs
      let svgs = await getAavegotchiSvgQueryData({ variables: { ids: Object.keys(myGotchis) } });
      svgs.data.aavegotchis.forEach(svg => {
        myGotchis[svg.id].svg = svg.svg;
      });

      let channeledData = await getGotchisChannelQueryData({ variables: { ids: Object.keys(myGotchis) } });
      channeledData.data.gotchis.forEach(channeled => {
        myGotchis[channeled.id].lastChanneled = parseInt(channeled.lastChanneledAlchemica);
        myGotchis[channeled.id].canChannelNow =
          getChannelingCutoffTimeInUTC() >= parseInt(channeled.lastChanneledAlchemica) * 1000;
      });

      setGotchis(myGotchis);
    },
  });
  //

  const getParcelsQuery = gql`
    query GetParcels($owner: String!) {
      parcels(first: 1000, orderBy: tokenId, where: { tokenId_gt: 0, owner: $owner }) {
        id
        parcelHash
        district
        size
      }
    }
  `;

  const getParcelsChannelDataQuery = gql`
    query GetParcelsData($ids: [String!]!) {
      parcels(orderBy: lastChanneledAlchemica, orderDirection: desc, where: { id_in: $ids }) {
        id
        equippedInstallations
        lastChanneledAlchemica
      }
    }
  `;

  const [getParcelsQueryData] = useLazyQuery(getParcelsQuery, {
    client: aavegotchiRealmMaticClient,
    onCompleted: ({ parcels: data }) => {
      if (data && data.length) {
        getParcelsChannelDataQueryData({ variables: { ids: data.map(parcel => parcel.id) } });
      }

      setParcels(data);
    },
  });

  const [getParcelsChannelDataQueryData] = useLazyQuery(getParcelsChannelDataQuery, {
    client: gotchiverseMaticClient,
    onCompleted: ({ parcels: data }) => {
      const parcelData = [...parcels].reduce((prev, curr) => {
        prev[curr.id] = { ...curr };
        return prev;
      }, {});

      data.forEach(d => {
        const aaltar = getAaltarByLevel(d.equippedInstallations);
        parcelData[d.id] = parcelData[d.id] || {};
        parcelData[d.id].equippedInstallations = d.equippedInstallations;
        parcelData[d.id].lastChanneled = parseInt(d.lastChanneledAlchemica) * 1000;
        parcelData[d.id].aaltar = aaltar;

        if (aaltar) {
          if (parcelData[d.id].lastChanneled) {
            parcelData[d.id].nextChannelAt = parseInt(parcelData[d.id].lastChanneled) + aaltar.hours * 60 * 60 * 1000;
          } else {
            parcelData[d.id].nextChannelAt = new Date().getTime();
          }

          parcelData[d.id].channelable =
            parcelData[d.id].nextChannelAt && moment().isSameOrAfter(parcelData[d.id].nextChannelAt);
        }
      });

      setParcels(Object.values(parcelData));
    },
  });

  const loadData = useCallback(
    async (functions = []) => {
      if (!functions.length) {
        functions = [
          // Pet My gotchi
          "PetMyGotchi:parentExists",
          "PetMyGotchi:getBalanceOf",
          "PetMyGotchi:whenNextDepositIsRequiredFor",
          "PetMyGotchi:countTakingCareOfChildrenOf",
          "PetMyGotchi:nextPetTimeForChildrenOf",
          "PetMyGotchi:countParents",
          "PetMyGotchi:getPricePerPetPerDayForParent",
          "PetMyGotchi:countTakingCareOf",
          //   "PetMyGotchi:childrenOf",
          // Aavegotchi
          "AavegotchiFacet:isPetOperatorForAll",

          // Realm
          //    "AavegotchiRealmFacet:tokenIdsOfOwner",
          "function:getAavegotchiUserQueryData",
          "function:getParcelsQueryData",
        ];
      }

      if (provider) {
        const multi = new MultiCall(provider);

        const inputs = [];
        const functionsCalled = [];
        if (readContracts.PetMyGotchi) {
          if (functions.includes("PetMyGotchi:parentExists") && (impersonate || address)) {
            functionsCalled.push("PetMyGotchi:parentExists");
            inputs.push({
              interface: externalContracts[targetNetwork.chainId].contracts.PetMyGotchi.abi,
              target: externalContracts[targetNetwork.chainId].contracts.PetMyGotchi.address,
              function: "parentExists",
              args: [impersonate || address],
            });
          }

          if (functions.includes("PetMyGotchi:getBalanceOf")) {
            functionsCalled.push("PetMyGotchi:getBalanceOf");
            inputs.push({
              interface: externalContracts[targetNetwork.chainId].contracts.PetMyGotchi.abi,
              target: externalContracts[targetNetwork.chainId].contracts.PetMyGotchi.address,
              function: "getBalanceOf",
              args: [impersonate || address || ethers.constants.AddressZero],
            });
          }

          if (functions.includes("PetMyGotchi:whenNextDepositIsRequiredFor") && (impersonate || address)) {
            functionsCalled.push("PetMyGotchi:whenNextDepositIsRequiredFor");
            inputs.push({
              interface: externalContracts[targetNetwork.chainId].contracts.PetMyGotchi.abi,
              target: externalContracts[targetNetwork.chainId].contracts.PetMyGotchi.address,
              function: "whenNextDepositIsRequiredFor",
              args: [impersonate || address],
            });
          }

          if (functions.includes("PetMyGotchi:countTakingCareOfChildrenOf") && (impersonate || address)) {
            functionsCalled.push("PetMyGotchi:countTakingCareOfChildrenOf");
            inputs.push({
              interface: externalContracts[targetNetwork.chainId].contracts.PetMyGotchi.abi,
              target: externalContracts[targetNetwork.chainId].contracts.PetMyGotchi.address,
              function: "countTakingCareOfChildrenOf",
              args: [impersonate || address],
            });
          }

          if (functions.includes("PetMyGotchi:nextPetTimeForChildrenOf") && (impersonate || address)) {
            functionsCalled.push("PetMyGotchi:nextPetTimeForChildrenOf");
            inputs.push({
              interface: externalContracts[targetNetwork.chainId].contracts.PetMyGotchi.abi,
              target: externalContracts[targetNetwork.chainId].contracts.PetMyGotchi.address,
              function: "nextPetTimeForChildrenOf",
              args: [impersonate || address],
            });
          }

          if (functions.includes("PetMyGotchi:countParents")) {
            functionsCalled.push("PetMyGotchi:countParents");
            inputs.push({
              interface: externalContracts[targetNetwork.chainId].contracts.PetMyGotchi.abi,
              target: externalContracts[targetNetwork.chainId].contracts.PetMyGotchi.address,
              function: "countParents",
              args: [],
            });
          }

          if (functions.includes("PetMyGotchi:getPricePerPetPerDayForParent")) {
            functionsCalled.push("PetMyGotchi:getPricePerPetPerDayForParent");
            inputs.push({
              interface: externalContracts[targetNetwork.chainId].contracts.PetMyGotchi.abi,
              target: externalContracts[targetNetwork.chainId].contracts.PetMyGotchi.address,
              function: "getPricePerPetPerDayForParent",
              args: [impersonate || address || ethers.constants.AddressZero],
            });
          }

          if (functions.includes("PetMyGotchi:countTakingCareOf")) {
            const takingCareOfCount = await readContracts.PetMyGotchi.countTakingCareOf();
            setTotalPets(ethers.BigNumber.from(takingCareOfCount).toString());
          }
        }

        if (readContracts.AavegotchiFacet) {
          if (functions.includes("AavegotchiFacet:isPetOperatorForAll") && (impersonate || address)) {
            functionsCalled.push("AavegotchiFacet:isPetOperatorForAll");
            inputs.push({
              interface: externalContracts[targetNetwork.chainId].contracts.AavegotchiFacet.abi,
              target: externalContracts[targetNetwork.chainId].contracts.AavegotchiFacet.address,
              function: "isPetOperatorForAll",
              args: [impersonate || address, GELATO_ADDRESS],
            });
          }
        }

        if (inputs.length) {
          const roundData = await multi.multiCall(inputs);

          for (let i = 0; i < functionsCalled.length; i++) {
            switch (functionsCalled[i]) {
              case "PetMyGotchi:parentExists":
                setIsParentAdded(roundData[1][i]);
                break;
              case "PetMyGotchi:getBalanceOf":
                setAccountBalance(ethers.BigNumber.from(roundData[1][i]).toString());
                break;
              case "PetMyGotchi:whenNextDepositIsRequiredFor":
                setWhenNextDepositIsRequired(ethers.BigNumber.from(roundData[1][i]).toNumber());
                break;
              case "PetMyGotchi:countTakingCareOfChildrenOf":
                setTotalPetsOfMine(ethers.BigNumber.from(roundData[1][i]).toString());
                break;
              case "PetMyGotchi:nextPetTimeForChildrenOf":
                setNextPetTimeForChildrenOf(roundData[1][i] ? ethers.BigNumber.from(roundData[1][i]).toNumber() : 0);
                break;
              case "PetMyGotchi:countParents":
                setTotalParents(ethers.BigNumber.from(roundData[1][i]).toString());
                break;
              case "PetMyGotchi:getPricePerPetPerDayForParent":
                setFeePerPetPerDay(ethers.BigNumber.from(roundData[1][i]).toString());
                break;
              case "AavegotchiFacet:isPetOperatorForAll":
                setIsPetOperatorForAll(roundData[1][i]);
                break;
              default:
                break;
            }
          }
        }

        if (functions.includes("function:getAavegotchiUserQueryData") && (impersonate || address)) {
          getAavegotchiUserQueryData({ variables: { address: (impersonate || address).toLowerCase() } });
        }

        // Get Parcels
        if (functions.includes("function:getParcelsQueryData") && (impersonate || address)) {
          getParcelsQueryData({ variables: { owner: (impersonate || address).toLowerCase() } });
        }
      }
    },
    [
      provider,
      address,
      impersonate,
      readContracts.AavegotchiFacet,
      readContracts.PetMyGotchi,
      targetNetwork.chainId,
      getParcelsQueryData,
      getAavegotchiUserQueryData,
    ],
  );

  useEffect(() => {
    (async function () {
      await loadData();
    })();
  }, [address, impersonate, readContracts.PetMyGotchi, readContracts.AavegotchiRealmFacet, loadData]);

  useEffect(() => {
    async function getAddress() {
      if (userSigner) {
        const newAddress = await userSigner.getAddress();
        setAddress(newAddress);
      }
    }
    getAddress();
  }, [userSigner]);

  const logoutOfWeb3Modal = async () => {
    await web3Modal.clearCachedProvider();
    if (injectedProvider && injectedProvider.provider && typeof injectedProvider.provider.disconnect == "function") {
      await injectedProvider.provider.disconnect();
    }
    setTimeout(() => {
      window.location.reload();
    }, 1);
  };

  const setPetOperatorForAll = useCallback(async () => {
    if (writeContracts.AavegotchiFacet && address) {
      tx(writeContracts.AavegotchiFacet.setPetOperatorForAll(GELATO_ADDRESS, true), result => {
        if (result.hash) {
          notification.close(result.hash);
          if (result.status === "confirmed" || result.status === 1) {
            notification.success({
              message: "Transaction success!",
              description: "Smart contract is set as pet operator successfully.",
              placement: "topRight",
            });
            loadData(["AavegotchiFacet:isPetOperatorForAll"]);
          }
        }
      });
    }
  }, [address, tx, writeContracts.AavegotchiFacet, loadData]);

  const removePetOperatorForAll = useCallback(async () => {
    if (writeContracts.AavegotchiFacet && address) {
      tx(writeContracts.AavegotchiFacet.setPetOperatorForAll(GELATO_ADDRESS, false), result => {
        if (result.hash) {
          notification.close(result.hash);
          if (result.status === "confirmed" || result.status === 1) {
            notification.close(result.hash);
            notification.success({
              message: "Transaction success!",
              description: "Smart contract is removed as pet operator successfully.",
              placement: "topRight",
            });
            loadData(["AavegotchiFacet:isPetOperatorForAll"]);
          }
        }
      });
    }
  }, [address, tx, writeContracts.AavegotchiFacet, loadData]);

  const addParent = useCallback(
    async amount => {
      if (writeContracts.PetMyGotchi && address) {
        tx(writeContracts.PetMyGotchi.addParent({ value: utils.parseEther(amount) }), result => {
          if (result.hash) {
            notification.close(result.hash);
            if (result.status === "confirmed" || result.status === 1) {
              notification.close(result.hash);
              notification.success({
                message: "Transaction success!",
                description: "Care has been started successfully.",
                placement: "topRight",
              });

              loadData();
            }
          }
        });
      }
    },
    [address, tx, writeContracts.PetMyGotchi, loadData],
  );

  const removeParent = useCallback(async () => {
    if (
      writeContracts.PetMyGotchi &&
      address &&
      window.confirm("Are you sure you want us to stop petting your Gotchies?")
    ) {
      tx(writeContracts.PetMyGotchi.removeParent(), result => {
        if (result.hash) {
          notification.close(result.hash);
          if (result.status === "confirmed" || result.status === 1) {
            notification.close(result.hash);
            notification.success({
              message: "Transaction success!",
              description: "Care has been stopped successfully.",
              placement: "topRight",
            });

            loadData();
          }
        }
      });
    }
  }, [address, tx, writeContracts.PetMyGotchi, loadData]);

  const depositFunds = useCallback(
    async amount => {
      if (writeContracts.PetMyGotchi && address) {
        tx(writeContracts.PetMyGotchi.depositFor(address, { value: utils.parseEther(amount) }), result => {
          if (result.hash) {
            notification.close(result.hash);
            if (result.status === "confirmed" || result.status === 1) {
              notification.close(result.hash);
              notification.success({
                message: "Transaction success!",
                description: amount + " MATIC has been deposited successfully.",
                placement: "topRight",
              });

              loadData();
            }
          }
        });
      }
    },
    [address, tx, writeContracts.PetMyGotchi, loadData],
  );

  const loadWeb3Modal = useCallback(async () => {
    const provider = await web3Modal.connect();

    setInjectedProvider(new ethers.providers.Web3Provider(provider));

    provider.on("chainChanged", chainId => {
      setInjectedProvider(new ethers.providers.Web3Provider(provider));
    });

    provider.on("accountsChanged", a => {
      if (a && a[0]) {
        //    window.location.reload();
        setInjectedProvider(new ethers.providers.Web3Provider(provider));
      } else {
        logoutOfWeb3Modal();
      }
    });

    // Subscribe to session disconnection
    provider.on("disconnect", (code, reason) => {
      logoutOfWeb3Modal();
    });
    // eslint-disable-next-line
  }, [setInjectedProvider]);

  useEffect(() => {
    if (web3Modal.cachedProvider) {
      loadWeb3Modal();
    }
  }, [loadWeb3Modal]);

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Header
          address={address}
          targetNetwork={targetNetwork}
          login={loadWeb3Modal}
          logout={logoutOfWeb3Modal}
          accountBalance={accountBalance}
        />

        <h3 className={`mt-16 pb-8 text-center text-3xl`}>
          The safest, fastest & cheapest petting service for your Aavegotchi's
        </h3>

        <Stats
          address={impersonate || address}
          feePerPetPerDay={feePerPetPerDay}
          totalPets={totalPets}
          totalPetsOfMine={totalPetsOfMine}
          totalParents={totalParents}
          nextPetTimeForChildrenOf={nextPetTimeForChildrenOf}
          whenNextDepositIsRequired={whenNextDepositIsRequired}
        />

        <h3 className={`mt-16 text-center text-3xl`}>Step 1</h3>

        <div className={`mt-8`}>
          <ApproveSmartContract
            address={address}
            isPetOperatorForAll={isPetOperatorForAll}
            setPetOperatorForAll={setPetOperatorForAll}
            removePetOperatorForAll={removePetOperatorForAll}
          />
        </div>

        <h3 className={`mt-16 text-center text-3xl`}>Step 2</h3>
        <div className={`mt-8`}>
          <TakeCareOfMyPets
            address={address}
            isParentAdded={isParentAdded}
            isPetOperatorForAll={isPetOperatorForAll}
            setPetOperatorForAll={setPetOperatorForAll}
            removePetOperatorForAll={removePetOperatorForAll}
            feePerPetPerDay={feePerPetPerDay}
            addParent={addParent}
            removeParent={removeParent}
            depositFunds={depositFunds}
          />
        </div>
        {isParentAdded && (
          <>
            <h3 className={`mt-16 text-center text-3xl`}>Step 3</h3>
            <div className={`mt-8`}>
              <DepositFunds
                address={address}
                accountBalance={`${ethers.utils.formatEther(accountBalance || 0)} MATIC`}
                isParentAdded={isParentAdded}
                depositFunds={depositFunds}
              />
            </div>
          </>
        )}

        <div className={`mt-24`}>
          <Faq feePerPetPerDay={feePerPetPerDay} />
        </div>

        {gotchis && Object.keys(gotchis).length > 0 && (
          <Aavegotchis gotchis={gotchis} getChannelingSignature={getChannelingSignature} />
        )}

        {parcels && parcels.length > 0 && <Parcels parcels={parcels} />}
      </div>
      <div className={`mt-24`}>
        <Footer {...{ contractConfig, targetNetwork }}></Footer>
      </div>
    </>
  );
}

export default App;
