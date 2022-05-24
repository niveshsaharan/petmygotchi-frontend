import { useEffect, useState } from "react";
import Loader from "./Loader";
import Parcel from "./Parcel";
import { ApolloClient, InMemoryCache, gql, useQuery, useLazyQuery } from "@apollo/client";
import getAaltarByLevel from "../helpers/getAaltarByLevel";
import moment from "moment";

const aavegotchiRealmMaticClient = new ApolloClient({
  uri: "https://api.thegraph.com/subgraphs/name/aavegotchi/aavegotchi-realm-matic",
  cache: new InMemoryCache(),
});

const gotchiverseMaticClient = new ApolloClient({
  uri: "https://api.thegraph.com/subgraphs/name/aavegotchi/gotchiverse-matic",
  cache: new InMemoryCache(),
});

export default function Parcels(props) {
  const [parcels, setParcels] = useState([]);

  const getParcels = gql`
    query GetParcels($owner: String!) {
      parcels(first: 1000, orderBy: tokenId, where: { tokenId_gt: 0, owner: $owner }) {
        id
        parcelHash
        district
        size
      }
    }
  `;

  const {
    loading,
    error,
    data: parcelsQueryData,
  } = useQuery(getParcels, {
    variables: {
      owner: props.address.toLowerCase(),
    },
    client: aavegotchiRealmMaticClient,
    onCompleted: ({ parcels: data }) => {
      setParcels(data);
    },
  });

  const getParcelsDataQuery = gql`
    query GetParcelsData($ids: [String!]!) {
      parcels(where: { id_in: $ids }) {
        id
        equippedInstallations
        lastChanneledAlchemica
      }
    }
  `;

  const [getParcelsData] = useLazyQuery(getParcelsDataQuery, {
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
        }
      });

      setParcels(Object.values(parcelData));
    },
  });

  useEffect(() => {
    if (parcelsQueryData && parcelsQueryData.parcels && parcelsQueryData.parcels.length) {
      getParcelsData({ variables: { ids: parcelsQueryData.parcels.map(parcel => parcel.id) } });
    }
  }, [parcelsQueryData, getParcelsData]);

  if (loading) {
    return null;
  }
  if (error) {
    return null;
  }

  return (
    <>
      {parcels && parcels.length > 0 && (
        <div className="mt-16">
          <div className="mx-auto py-8 px-4 sm:py-12 sm:px-6 lg:px-8">
            <div className="space-y-12">
              <div className="space-y-5 sm:space-y-4 md:max-w-xl lg:max-w-3xl xl:max-w-none">
                <h2 className="text-center text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                  Your Parcels
                </h2>
              </div>
              <ul className="space-y-12 text-gray-500 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:gap-y-12 sm:space-y-0 lg:grid-cols-4 lg:gap-x-6">
                {parcels.map((parcel, i) => (
                  <li key={parcel.id} className={`relative bg-white px-8 py-8 shadow sm:rounded-lg sm:px-3 sm:py-3`}>
                    <div className="">
                      <h3 className={`text-center`}>
                        <a
                          href={`https://app.aavegotchi.com/realm/${parcel.id}`}
                          target={`_blank`}
                          className={`text-purple-500`}
                        >
                          #{parcel.id}
                        </a>
                      </h3>

                      {/*{pet.lendingInfo.loaded !== false && (
                        <div className={`mt-2 flex items-center justify-center`}>
                          {pet.lendingInfo.borrower === props.address ? (
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
                      )}*/}

                      {parcel.parcelHash && (
                        <Parcel
                          parcel={parcel}
                          getChannelingSignature={props.getChannelingSignature}
                          gotchis={props.childrenIds}
                        />
                      )}

                      {!parcel.parcelHash && (
                        <div className={`flex items-center justify-center`}>
                          <Loader show={true} />
                        </div>
                      )}

                      {parcel.nextChannelAt && moment().isSameOrAfter(parcel.nextChannelAt) && (
                        <div className={`mt-5 flex items-center`}>
                          <button
                            type="button"
                            onClick={() => props.getChannelingSignature(parcel.id, null, null, props.childrenIds)}
                            className="w-full items-center justify-center rounded-md border border-transparent bg-purple-600 px-2 py-1 font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 sm:w-auto sm:text-sm"
                          >
                            Channel Alchemica
                          </button>
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
