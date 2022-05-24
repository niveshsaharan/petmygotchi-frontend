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
const { MultiCall } = require("@indexed-finance/multicall");
let web3Modal = Web3ModalSetup();
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
  const [childrenOf, setChildrenOf] = useState([]);
  const [realmIds, setRealIds] = useState([]);

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
          "PetMyGotchi:childrenOf",

          // Aavegotchi
          "AavegotchiFacet:isPetOperatorForAll",

          // Realm
          "AavegotchiRealmFacet:tokenIdsOfOwner",
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
            functionsCalled.push("PetMyGotchi:countTakingCareOf");
            inputs.push({
              interface: externalContracts[targetNetwork.chainId].contracts.PetMyGotchi.abi,
              target: externalContracts[targetNetwork.chainId].contracts.PetMyGotchi.address,
              function: "countTakingCareOf",
              args: [],
            });
          }

          if (functions.includes("PetMyGotchi:childrenOf") && (impersonate || address)) {
            functionsCalled.push("PetMyGotchi:childrenOf");
            inputs.push({
              interface: externalContracts[targetNetwork.chainId].contracts.PetMyGotchi.abi,
              target: externalContracts[targetNetwork.chainId].contracts.PetMyGotchi.address,
              function: "childrenOf",
              args: [impersonate || address],
            });
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

        if (readContracts.AavegotchiRealmFacet) {
          if (functions.includes("AavegotchiRealmFacet:tokenIdsOfOwner") && (impersonate || address)) {
            functionsCalled.push("AavegotchiRealmFacet:tokenIdsOfOwner");
            inputs.push({
              interface: externalContracts[targetNetwork.chainId].contracts.AavegotchiRealmFacet.abi,
              target: externalContracts[targetNetwork.chainId].contracts.AavegotchiRealmFacet.address,
              function: "tokenIdsOfOwner",
              args: [impersonate || address],
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
                setNextPetTimeForChildrenOf(ethers.BigNumber.from(roundData[1][i]).toNumber());
                break;
              case "PetMyGotchi:countParents":
                setTotalParents(ethers.BigNumber.from(roundData[1][i]).toString());
                break;
              case "PetMyGotchi:getPricePerPetPerDayForParent":
                setFeePerPetPerDay(ethers.BigNumber.from(roundData[1][i]).toString());
                break;
              case "PetMyGotchi:countTakingCareOf":
                setTotalPets(ethers.BigNumber.from(roundData[1][i]).toString());
                break;
              case "AavegotchiFacet:isPetOperatorForAll":
                setIsPetOperatorForAll(roundData[1][i]);
                break;
              case "PetMyGotchi:childrenOf":
                setChildrenOf(roundData[1][i]);
                break;
              case "AavegotchiRealmFacet:tokenIdsOfOwner":
                setRealIds(roundData[1][i]);
                break;
              default:
                break;
            }
          }
        }
      }
    },
    [
      provider,
      address,
      impersonate,
      readContracts.AavegotchiFacet,
      readContracts.PetMyGotchi,
      readContracts.AavegotchiRealmFacet,
      targetNetwork.chainId,
    ],
  );

  const getChannelingSignature = useCallback(
    async (parcelId, gotchiId, lastChanneled, availableIds) => {
      let message = "";

      const type = parcelId === null ? "gotchi" : "parcel";
      if (gotchiId !== null) {
        message = "Do you want to channel Alchemica with Gotchi #" + gotchiId + " now?";
      } else if (parcelId !== null) {
        message = "Do you want to channel Alchemica for Parcel #" + parcelId + " now?";
      }

      if (!window.confirm(message)) {
        return;
      }

      const availableOptions = availableIds.map(realm => ethers.BigNumber.from(realm).toNumber());

      if (parcelId === null && type === "gotchi") {
        parcelId = window.prompt(
          "Enter the Parcel ID that you want to channel Alchemica for. (Available parcels are: " +
            availableOptions.join(", ") +
            ")",
        );
      }

      if (gotchiId === null && type === "parcel") {
        gotchiId = window.prompt(
          "Enter the Gotchi ID that you want to channel Alchemica with. (Available gotchis are: " +
            availableOptions.join(", ") +
            ")",
        );

        // Get last channeled
        if (gotchiId && parseInt(gotchiId) > 0) {
          lastChanneled = await readContracts.AavegotchiRealmFacet.getLastChanneled(gotchiId);
        }
      }

      if (parseInt(parcelId) > 0 && parseInt(gotchiId)) {
        // Find from API
        let a = await window.fetch(
          "https://api.gotchiverse.io/realm/alchemica/signature/channel/get",
          {
            headers: {
              "content-type": "application/json",
            },
            body: JSON.stringify({ parcelId: parcelId, gotchiId: gotchiId, lastChanneled: lastChanneled + "" }),
            method: "POST",
            mode: "cors",
            credentials: "omit",
          },
        );
        a = await a.json();
        let signature = Object.values(a);

        if (!signature) {
          console.log(`let a = await fetch("https://api.gotchiverse.io/realm/alchemica/signature/channel/get", {
      "headers": {
        "accept": "*/*",
        "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
        "cache-control": "no-cache",
        "content-type": "application/json",
        "pragma": "no-cache",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "cross-site",
        "sec-gpc": "1"
      },
      "referrerPolicy": "same-origin",
      "body": JSON.stringify({parcelId:${parcelId},gotchiId:${gotchiId},lastChanneled:"${lastChanneled}"}),
      "method": "POST",
      "mode": "cors",
      "credentials": "omit"
    });
    a = await a.json();
    console.log(JSON.stringify(Object.values(a)));
   `);
          signature = JSON.parse(window.prompt("Paste the signature and submit"));
        }

        if (Array.isArray(signature)) {
          tx(
            writeContracts.AavegotchiRealmFacet.channelAlchemica(
              parcelId,
              gotchiId,
              lastChanneled,
              utils.hexlify(signature),
            ),
            result => {
              if (result.hash) {
                notification.close(result.hash);
                if (result.status === "confirmed" || result.status === 1) {
                  notification.success({
                    message: "Transaction success!",
                    description: "Successfully channeled.",
                    placement: "topRight",
                  });
                  loadData(["PetMyGotchi:childrenOf"]);
                }
              }
            },
          );
        } else if (signature) {
          notification.error({
            message: "Signature Error",
            description: "Invalid signature",
            placement: "topRight",
            duration: 30,
          });
        }
      }
    },
    [loadData, tx, readContracts.AavegotchiRealmFacet, writeContracts.AavegotchiRealmFacet],
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

        {childrenOf && childrenOf.length > 0 && (
          <Aavegotchis
            readContracts={readContracts}
            address={impersonate || address}
            childrenIds={childrenOf}
            provider={provider}
            targetNetwork={targetNetwork}
            contracts={externalContracts[targetNetwork.chainId].contracts}
            getChannelingSignature={getChannelingSignature}
          />
        )}

        {realmIds && realmIds.length > 0 && (
          <Parcels
            readContracts={readContracts}
            address={impersonate || address}
            childrenIds={childrenOf}
            realmIds={realmIds}
            provider={provider}
            targetNetwork={targetNetwork}
            contracts={externalContracts[targetNetwork.chainId].contracts}
            getChannelingSignature={getChannelingSignature}
          />
        )}
      </div>
      <div className={`mt-24`}>
        <Footer {...{ contractConfig, targetNetwork }}></Footer>
      </div>
    </>
  );
}

export default App;
