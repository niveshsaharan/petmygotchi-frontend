import moment from "moment";
import { ethers } from "ethers";

export default function Gotchi({ pet, getChannelingSignature }) {
  return (
    <div className="">
      <div className="space-y-1 text-lg font-medium leading-6">
        <h3 className={` text-center text-purple-500`}>
          <a
            href={`https://app.aavegotchi.com/gotchi/${ethers.BigNumber.from(pet.aavegotchi.tokenId).toString()}`}
            target={`_blank`}
            className={`text-purple-500`}
          >
            {pet.aavegotchi.name}
          </a>
        </h3>
      </div>
      <dl className="mt-4 grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
        <div className="sm:col-span-1">
          <dt className="text-sm font-medium text-gray-500">Last Interaction</dt>
          <dd
            className="mt-1 text-sm text-gray-900"
            title={moment(ethers.BigNumber.from(pet.aavegotchi.lastInteracted).toNumber() * 1000).format(
              "MMM DD, YYYY [at] hh:mm a",
            )}
          >
            {moment(ethers.BigNumber.from(pet.aavegotchi.lastInteracted).toNumber() * 1000).fromNow()}
          </dd>
        </div>
        <div className="sm:col-span-1">
          <dt className="text-sm font-medium text-gray-500  sm:text-right">Next Interaction</dt>
          <dd
            className="mt-1 text-sm text-gray-900 sm:text-right"
            title={moment(
              ethers.BigNumber.from(pet.aavegotchi.lastInteracted).toNumber() * 1000 + 60 * 60 * 12 * 1000,
            ).format("MMM DD, YYYY [at] hh:mm a")}
          >
            {moment(
              ethers.BigNumber.from(pet.aavegotchi.lastInteracted).toNumber() * 1000 + 60 * 60 * 12 * 1000,
            ).fromNow()}
          </dd>
        </div>
        <div className="sm:col-span-1">
          <dt className="text-sm font-medium text-gray-500">Escrow</dt>
          <dd className="mt-1 text-sm text-gray-900">
            <a
              href={`https://polygonscan.com/address/${pet.aavegotchi.escrow}`}
              target={`_blank`}
              className={`text-purple-500`}
            >
              {`${pet.aavegotchi.escrow.substr(0, 6)}...${pet.aavegotchi.escrow.substr(-6, 6)}`}
            </a>
          </dd>
        </div>
        <div className="sm:col-span-1">
          <dt className="text-sm font-medium text-gray-500  sm:text-right">Rented out</dt>
          <dd className="mt-1 text-sm text-gray-900  sm:text-right">{pet.lendingInfo.borrower ? "Yes" : "Not yet"}</dd>
        </div>
        {pet.lendingInfo.borrower && (
          <>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500 ">Borrower</dt>
              <dd className="mt-1 text-sm text-gray-900">
                <a
                  href={`https://polygonscan.com/address/${pet.lendingInfo.borrower}`}
                  target={`_blank`}
                  className={`text-purple-500`}
                >
                  {`${pet.lendingInfo.borrower.substr(0, 6)}...${pet.lendingInfo.borrower.substr(-6, 6)}`}
                </a>
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500  sm:text-right">Revenue Split</dt>
              <dd className="mt-1 text-sm text-gray-900  sm:text-right">
                {pet.lendingInfo.revenueSplit[0]}/{pet.lendingInfo.revenueSplit[1]}/{pet.lendingInfo.revenueSplit[2]}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Lent at</dt>
              <dd className="mt-1 text-sm text-gray-900" title={moment(pet.lendingInfo.timeAgreed * 1000).fromNow()}>
                {moment(pet.lendingInfo.timeAgreed * 1000).format("MMM DD, YYYY [at] hh:mm a")}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Lending expires at</dt>
              <dd
                className="mt-1 text-sm text-gray-900"
                title={moment((pet.lendingInfo.timeAgreed + pet.lendingInfo.period) * 1000).fromNow()}
              >
                {moment((pet.lendingInfo.timeAgreed + pet.lendingInfo.period) * 1000).isBefore(moment.now())
                  ? "Expired"
                  : moment((pet.lendingInfo.timeAgreed + pet.lendingInfo.period) * 1000).format(
                      "MMM DD, YYYY [at] hh:mm a",
                    )}
              </dd>
            </div>
          </>
        )}

        <>
          <div
            className="sm:col-span-1"
            onClick={() =>
              getChannelingSignature(
                null,
                ethers.BigNumber.from(pet.aavegotchi.tokenId).toNumber(),
                pet.lastChanneled,
                pet.realm.ids,
              )
            }
          >
            <dt className="text-sm font-medium text-gray-500 ">Last channeled</dt>
            <dd
              className="mt-1 text-sm text-gray-900"
              title={moment(ethers.BigNumber.from(pet.lastChanneled).toNumber() * 1000).format(
                "MMM DD, YYYY [at] hh:mm a",
              )}
            >
              {moment(ethers.BigNumber.from(pet.lastChanneled).toNumber() * 1000).fromNow()}
            </dd>
          </div>
        </>
      </dl>
    </div>
  );
}
