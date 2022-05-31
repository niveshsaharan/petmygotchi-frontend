import Loader from "./Loader";
import Parcel from "./Parcel";

export default function Parcels(props) {
  const parcels = props.parcels;

  return (
    <>
      {parcels && parcels.length > 0 && (
        <div className="mt-8">
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
                        <Parcel parcel={parcel} />
                      )}

                      {!parcel.parcelHash && (
                        <div className={`flex items-center justify-center`}>
                          <Loader show={true} />
                        </div>
                      )}

                      {/*{parcel.nextChannelAt && moment().isSameOrAfter(parcel.nextChannelAt) && (
                        <div className={`mt-5 flex items-center`}>
                          <button
                            type="button"
                            onClick={() => props.getChannelingSignature(parcel.id, null, null, props.childrenIds)}
                            className="w-full items-center justify-center rounded-md border border-transparent bg-purple-600 px-2 py-1 font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 sm:w-auto sm:text-sm"
                          >
                            Channel Alchemica
                          </button>
                        </div>
                      )}*/}
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
