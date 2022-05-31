import moment from "moment";
import getRealParcelSizeName from "../helpers/getRealParcelSizeName";

export default function Parcel({ parcel }) {
  return (
    <div className="">
      {parcel.aaltar && (
        <div className={`my-2 flex items-center justify-center`}>
          <span className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
            {parcel.aaltar.label}
          </span>
        </div>
      )}

      <div className="space-y-1 text-lg font-medium leading-6">
        <h3 className={` text-center text-purple-500`}>
          <a href={`https://app.aavegotchi.com/realm/${parcel.id}`} target={`_blank`} className={`text-purple-500`}>
            {parcel.parcelHash}
          </a>
        </h3>
      </div>
      <dl className="mt-4 grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-3">
        <div className="sm:col-span-2">
          <dt className="text-sm font-medium text-gray-500">Size</dt>
          <dd className="mt-1 text-sm text-gray-900">{getRealParcelSizeName(parcel.size)}</dd>
        </div>
        <div className="sm:col-span-1">
          <dt className="text-sm font-medium text-gray-500">District</dt>
          <dd className="mt-1 text-sm text-gray-900">{parcel.district}</dd>
        </div>

        {parcel.lastChanneled && (
          <>
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500 ">Last channeled</dt>
              <dd
                className="mt-1 text-sm text-gray-900"
                title={moment(parcel.lastChanneled).format("MMM DD, YYYY [at] hh:mm a")}
              >
                {moment(parcel.lastChanneled).fromNow()}
              </dd>
            </div>

            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500 ">Cooldown</dt>
              <dd className="mt-1 text-sm text-gray-900">{parcel.aaltar.hours} hrs</dd>
            </div>
          </>
        )}

        {parcel.nextChannelAt && (
          <>
            <div className="sm:col-span-3">
              <dt
                className="cursor-pointer text-sm font-medium text-gray-500"
              >
                Next channel
              </dt>
              <dd
                className="mt-1 text-sm text-gray-900"
                title={moment(parcel.nextChannelAt).format("MMM DD, YYYY [at] hh:mm a")}
              >
                {parcel.channelable ? "Now" : moment(parcel.nextChannelAt).fromNow()}
              </dd>
            </div>
          </>
        )}
      </dl>
    </div>
  );
}
