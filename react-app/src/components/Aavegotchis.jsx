import { useEffect, useState } from "react";
import { ethers } from "ethers";
import Gotchi from "./Gotchi";
import Loader from "./Loader";

export default function Aavegotchis(props) {
  const [pets, setPets] = useState([]);

  useEffect(() => {
    (async function () {
      const realmIds = await props.readContracts.AavegotchiRealmFacet.tokenIdsOfOwner(props.address);

      const aavegotchis = props.childrenIds.reduce(
        (a, v) => ({
          ...a,
          [v]: {
            aavegotchi: { tokenId: ethers.BigNumber.from(v) },
            lendingInfo: { loaded: false },
            metadata: {},
            realm: { ids: realmIds },
          },
        }),
        {},
      );

      for (const id of props.childrenIds) {
        const aavegotchi = await props.readContracts.PetMyGotchi.getAavegotchi(id);

        let lendingInfo = {};
        const realm = {};
        const common = {};

        if (await props.readContracts.AavegotchiFacet.isAavegotchiLent(aavegotchi.tokenId)) {
          common.lent = true;
          lendingInfo = await props.readContracts.AavegotchiFacet.getGotchiLendingFromToken(aavegotchi.tokenId);
          common.borrwed = lendingInfo.borrower === props.address;
          common.owned = !common.borrwed;
        } else {
          common.lent = false;
          common.borrwed = false;
          common.owned = true;
        }

        // Realm
        if (realmIds && realmIds.length) {
          realm.ids = realmIds;
        }

        common.lastChanneled = await props.readContracts.AavegotchiRealmFacet.getLastChanneled(id);

        aavegotchis[id] = { aavegotchi, lendingInfo, metadata: {}, realm, ...common };

        setStatePets(aavegotchis);

        fetch("https://app.aavegotchi.com/metadata/aavegotchis/" + id)
          .then(res => res.json())
          .then(res => {
            aavegotchis[id].metadata = res;
            setStatePets(aavegotchis);
          })
          .catch(e => {});
      }
    })();
  }, [
    props.readContracts.PetMyGotchi,
    props.childrenIds,
    props.readContracts.AavegotchiFacet,
    props.readContracts.AavegotchiRealmFacet,
    props.address,
  ]);

  const setStatePets = newPets => {
    newPets = Object.values(newPets);
    newPets.sort(function (x, y) {
      // true values first
      return x.owned === y.owned ? 0 : x.owned ? -1 : 1;
      // false values first
      // return (x === y)? 0 : x? 1 : -1;
    });

    setPets(newPets);
  };

  return (
    <>
      {pets && pets.length > 0 && (
        <div className="mt-16">
          <div className="mx-auto py-8 px-4 sm:py-12 sm:px-6 lg:px-8">
            <div className="space-y-12">
              <div className="space-y-5 sm:space-y-4 md:max-w-xl lg:max-w-3xl xl:max-w-none">
                <h2 className="text-center text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                  Your Aavegotchis
                </h2>
              </div>
              <ul className="space-y-12 text-gray-500 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:gap-y-12 sm:space-y-0 lg:grid-cols-4 lg:gap-x-6">
                {Object.values(pets).map((pet, i) => (
                  <li
                    key={pet.aavegotchi.tokenId}
                    className={`relative bg-white px-8 py-8 shadow sm:rounded-lg sm:px-3 sm:py-3`}
                  >
                    <div className="">
                      <h3 className={`text-center`}>
                        <a
                          href={`https://app.aavegotchi.com/gotchi/${ethers.BigNumber.from(
                            pet.aavegotchi.tokenId,
                          ).toString()}`}
                          target={`_blank`}
                          className={`text-purple-500`}
                        >
                          #{ethers.BigNumber.from(pet.aavegotchi.tokenId).toString()}
                        </a>
                      </h3>

                      {typeof pet.owned !== "undefined" && (
                        <div className={`mt-2 flex items-center justify-center`}>
                          {pet.borrwed ? (
                            <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                              {" "}
                              Borrowed{" "}
                            </span>
                          ) : (
                            <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                              {" "}
                              Owned{" "}
                            </span>
                          )}
                        </div>
                      )}

                      <div className="aspect-w-3 aspect-h-2 px-2 py-4 sm:px-4 sm:py-8">
                        {pet.metadata.image_data && (
                          <a
                            href={`https://app.aavegotchi.com/gotchi/${ethers.BigNumber.from(
                              pet.aavegotchi.tokenId,
                            ).toString()}`}
                            target={`_blank`}
                            dangerouslySetInnerHTML={{ __html: pet.metadata.image_data }}
                          ></a>
                        )}
                      </div>

                      {pet.aavegotchi.name && (
                        <Gotchi pet={pet} getChannelingSignature={props.getChannelingSignature} />
                      )}

                      {!pet.aavegotchi.name && (
                        <div className={`flex items-center justify-center`}>
                          <Loader show={true} />
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
