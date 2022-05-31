import moment from "moment";
import { ethers } from "ethers";
import getChannelingCutoffTimeInUTC from "../helpers/getChannelingCutoffTimeInUTC";

export default function Gotchi({ pet }) {
  return (
    <div className="">
      <div className="space-y-1 text-lg font-medium leading-6">
        <h3 className={` text-center text-purple-500`}>
          <a
            href={`https://app.aavegotchi.com/gotchi/${ethers.BigNumber.from(pet.gotchiId).toString()}`}
            target={`_blank`}
            className={`text-purple-500`}
          >
            {pet.name}
          </a>
        </h3>
      </div>
      <dl className="mt-4 grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
        <div className="sm:col-span-1">
          <dt className="text-sm font-medium text-gray-500">Last Interaction</dt>
          <dd
            className="mt-1 text-sm text-gray-900"
            title={moment(parseInt(pet.lastInteracted) * 1000).format("MMM DD, YYYY [at] hh:mm a")}
          >
            {moment(parseInt(pet.lastInteracted) * 1000).fromNow()}
          </dd>
        </div>
        <div className="sm:col-span-1">
          <dt className="text-sm font-medium text-gray-500  sm:text-right">Next Interaction</dt>
          <dd
            className="mt-1 text-sm text-gray-900 sm:text-right"
            title={moment(parseInt(pet.lastInteracted) * 1000 + 60 * 60 * 12 * 1000).format(
              "MMM DD, YYYY [at] hh:mm a",
            )}
          >
            {moment(parseInt(pet.lastInteracted) * 1000 + 60 * 60 * 12 * 1000).fromNow()}
          </dd>
        </div>

        <div className="sm:col-span-1">
          <dt className="text-sm font-medium text-gray-500">Total XP</dt>
          <dd className="mt-1 text-sm text-gray-900">{pet.experience}</dd>
        </div>

        <div className="sm:col-span-1">
          <dt className="text-sm font-medium text-gray-500  sm:text-right">Kinship</dt>
          <dd className="mt-1 text-sm text-gray-900  sm:text-right">{pet.kinship}</dd>
        </div>

        <div className="sm:col-span-1">
          <dt className="text-sm font-medium text-gray-500">Pocket</dt>
          <dd className="mt-1 text-sm text-gray-900">
            <a href={`https://polygonscan.com/address/${pet.escrow}`} target={`_blank`} className={`text-purple-500`}>
              {`${pet.escrow.substr(0, 6)}...${pet.escrow.substr(-6, 6)}`}
            </a>
          </dd>
        </div>
        <div className="sm:col-span-1">
          <dt className="text-sm font-medium text-gray-500  sm:text-right">{pet.borrowed ? "Borrowed" : "Rented"}</dt>
          <dd className="mt-1 text-sm text-gray-900  sm:text-right">{pet.borrower ? "Yes" : "No"}</dd>
        </div>
        {pet.borrower && (
          <>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500 ">{pet.owned ? "Borrower" : "Lender"}</dt>
              <dd className="mt-1 text-sm text-gray-900">
                <a
                  href={`https://polygonscan.com/address/${pet.owned ? pet.borrower : pet.lender}`}
                  target={`_blank`}
                  className={`text-purple-500`}
                >
                  {`${(pet.owned ? pet.borrower : pet.lender).substr(0, 6)}...${(pet.owned
                    ? pet.borrower
                    : pet.lender
                  ).substr(-6, 6)}`}
                </a>
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500  sm:text-right">Revenue Split</dt>
              <dd className="mt-1 text-sm text-gray-900  sm:text-right">
                {pet.revenueSplit[0]}/{pet.revenueSplit[1]}/{pet.revenueSplit[2]}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">{pet.owned ? "Lent at" : "Borrowed at"}</dt>
              <dd className="mt-1 text-sm text-gray-900" title={moment(parseInt(pet.timeAgreed) * 1000).fromNow()}>
                {moment(parseInt(pet.timeAgreed) * 1000).format("MMM DD, YYYY [at] hh:mm a")}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">{pet.owned ? "Lending" : "Borrowing"} expires at</dt>
              <dd
                className="mt-1 text-sm text-gray-900"
                title={moment((parseInt(pet.timeAgreed) + parseInt(pet.period)) * 1000).fromNow()}
              >
                {moment((parseInt(pet.timeAgreed) + parseInt(pet.period)) * 1000).isBefore(moment.now())
                  ? "Expired"
                  : moment((parseInt(pet.timeAgreed) + parseInt(pet.period)) * 1000).format(
                      "MMM DD, YYYY [at] hh:mm a",
                    )}
              </dd>
            </div>
          </>
        )}

        <>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500 ">Last channeled</dt>
            <dd
              className="mt-1 text-sm text-gray-900"
              title={moment(parseInt(pet.lastChanneled) * 1000).format("MMM DD, YYYY [at] hh:mm a")}
            >
              {moment(parseInt(pet.lastChanneled) * 1000).fromNow()}
            </dd>
          </div>

          <div className="sm:col-span-1">
            <dt
              className="cursor-pointer text-sm font-medium text-gray-500 sm:text-right"
            >
              Next channel
            </dt>
            <dd
              className="mt-1 text-sm text-gray-900 sm:text-right"
              title={moment(
                pet.canChannelNow ? getChannelingCutoffTimeInUTC() : getChannelingCutoffTimeInUTC(1),
              ).format("MMM DD, YYYY [at] hh:mm a")}
            >
              {pet.canChannelNow ? "Now" : moment(getChannelingCutoffTimeInUTC(1)).fromNow()}
            </dd>
          </div>
        </>
      </dl>
    </div>
  );
}
