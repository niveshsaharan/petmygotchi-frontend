/* This example requires Tailwind CSS v2.0+ */

import { TELEGRAM_ID } from "../constants";

export default function Footer(props) {
  const navigation = [
    {
      name: "Polygon",
      href: `${props.targetNetwork.blockExplorer}address/${
        props.contractConfig.externalContracts[props.targetNetwork.chainId].contracts.PetMyGotchi.address
      }`,
      icon: props => (
        <svg fill="currentColor" viewBox="0 0 80 80" {...props}>
          <circle cx="40" cy="40" r="40" fill="currentColor" />
          <path
            d="M66.6663 40.9337V53.0011C66.662 53.7537 66.4632 54.4922 66.0892 55.1445C65.7153 55.7968 65.1791 56.3405 64.533 56.7226L54.1163 62.7438C53.4712 63.1297 52.7341 63.3334 51.983 63.3334C51.2319 63.3334 50.4948 63.1297 49.8497 62.7438L39.433 56.7226C38.7869 56.3405 38.2507 55.7968 37.8768 55.1445C37.5029 54.4922 37.304 53.7537 37.2997 53.0011V49.6142L42.633 46.5075V52.3948L51.9663 57.8306L61.2997 52.3948V41.5483L51.9663 36.1125L30.0997 48.8239C29.4485 49.1921 28.7137 49.3856 27.9663 49.3856C27.2189 49.3856 26.4842 49.1921 25.833 48.8239L15.4163 42.7777C14.7802 42.3898 14.2543 41.844 13.8894 41.1929C13.5245 40.5418 13.3329 39.8074 13.333 39.0604V26.9929C13.3373 26.2404 13.5362 25.5019 13.9101 24.8496C14.2841 24.1973 14.8203 23.6535 15.4663 23.2715L25.883 17.2503C26.5295 16.8682 27.2661 16.6667 28.0163 16.6667C28.7666 16.6667 29.5032 16.8682 30.1497 17.2503L40.5663 23.2715C41.2124 23.6535 41.7486 24.1973 42.1225 24.8496C42.4965 25.5019 42.6953 26.2404 42.6997 26.9929V30.3798L37.333 33.4657V27.6118L27.9997 22.176L18.6663 27.6118V38.4457L27.9997 43.8815L49.8663 31.1701C50.5175 30.8019 51.2523 30.6085 51.9997 30.6085C52.7471 30.6085 53.4818 30.8019 54.133 31.1701L64.5497 37.2164C65.192 37.6002 65.7245 38.1442 66.0954 38.7955C66.4663 39.4469 66.663 40.1835 66.6663 40.9337Z"
            fill="white"
          />
        </svg>
      ),
    },
    {
      name: "Telegram",
      href: "https://t.me/" + TELEGRAM_ID,
      icon: props => (
        <svg fill="currentColor" viewBox="0 0 496 512" {...props}>
          <path d="M248,8C111.033,8,0,119.033,0,256S111.033,504,248,504,496,392.967,496,256,384.967,8,248,8ZM362.952,176.66c-3.732,39.215-19.881,134.378-28.1,178.3-3.476,18.584-10.322,24.816-16.948,25.425-14.4,1.326-25.338-9.517-39.287-18.661-21.827-14.308-34.158-23.215-55.346-37.177-24.485-16.135-8.612-25,5.342-39.5,3.652-3.793,67.107-61.51,68.335-66.746.153-.655.3-3.1-1.154-4.384s-3.59-.849-5.135-.5q-3.283.746-104.608,69.142-14.845,10.194-26.894,9.934c-8.855-.191-25.888-5.006-38.551-9.123-15.531-5.048-27.875-7.717-26.8-16.291q.84-6.7,18.45-13.7,108.446-47.248,144.628-62.3c68.872-28.647,83.183-33.623,92.511-33.789,2.052-.034,6.639.474,9.61,2.885a10.452,10.452,0,0,1,3.53,6.716A43.765,43.765,0,0,1,362.952,176.66Z"></path>
        </svg>
      ),
    },
  ];

  return (
    <footer className="bg-white">
      <div className="mx-auto max-w-7xl py-12 px-4 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
        <p className="basis-1/3 text-base text-gray-400 md:order-1">
          Made with ❤️ by{" "}
          <a href={`https://twitter.com/nivesh_saharan`} target={`_blank`}>
            Nivesh
          </a>{" "}
          for Aavegotchi frens.
        </p>
        <p className="basis-1/2 text-base text-gray-400 md:order-1">
          &copy; {new Date().getFullYear()} Pet My Gotchi. All Rights Reserved.
        </p>
        <div className="flex justify-center space-x-2 md:order-3">
          {navigation.map(item => (
            <a
              key={item.name}
              title={item.name}
              href={item.href}
              target={`_blank`}
              className="text-gray-400 hover:text-purple-500"
            >
              <span className="sr-only">{item.name}</span>
              <item.icon className="h-6 w-6" aria-hidden="true" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
