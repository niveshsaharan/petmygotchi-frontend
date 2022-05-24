import Loader from "./Loader";
import { ethers } from "ethers";
import moment from "moment";

export default function Stats(props) {
  //console.log(props.whenNextDepositIsRequired > 0 ? moment(props.whenNextDepositIsRequired * 1000).fromNow() : "N/A")
  /* This example requires Tailwind CSS v2.0+ */
  const stats = [
    /*{ name: 'Your balance', variable: 'accountBalance' },*/
    {
      name: "Fee per day for each of your gotchi's",
      variable: "feePerPetPerDay",
      value: `${
        typeof props.feePerPetPerDay !== "undefined"
          ? `${ethers.utils.formatEther(props.feePerPetPerDay || 0)} MATIC`
          : ``
      }`,
      title: `${
        typeof props.feePerPetPerDay !== "undefined"
          ? `${ethers.utils.formatEther(props.feePerPetPerDay || 0)} MATIC`
          : ``
      }`,
      description: `This is how much we will charge you every day for each of your gotchi's to pet it every 12 hours..`,
    },
    {
      name: "You have to deposit more MATIC",
      variable: "whenNextDepositIsRequired",
      value:
        props.whenNextDepositIsRequired > 0
          ? moment(props.whenNextDepositIsRequired * 1000).format("MMM DD, YYYY")
          : "N/A",
      title: props.whenNextDepositIsRequired > 0 ? moment(props.whenNextDepositIsRequired * 1000).fromNow() : "",
      description: `This is when your balance will run out and we won't be able to pet your gotchi's`,
      conditions: [props => !!props.address],
    },
    {
      name: "We will pet your Gotchi",
      variable: "nextPetTimeForChildrenOf",
      value: props.nextPetTimeForChildrenOf > 0 ? moment(props.nextPetTimeForChildrenOf * 1000).fromNow() : "N/A",
      title: props.nextPetTimeForChildrenOf > 0 ? moment(props.nextPetTimeForChildrenOf * 1000).fromNow() : "N/A",
      description: `This is when your gotchi will receive their next pet.`,
      conditions: [props => !!props.address],
    },
    {
      name: "Total Gotchies of yours under our care",
      variable: "totalPetsOfMine",
      value: `${typeof props.totalPetsOfMine !== "undefined" ? `${ethers.BigNumber.from(props.totalPetsOfMine)}` : ``}`,
      title: `${typeof props.totalPetsOfMine !== "undefined" ? `${ethers.BigNumber.from(props.totalPetsOfMine)}` : ``}`,
      description: `This is how many of your gotchi's we will pet the next time they are available to pet. `,
      conditions: [props => !!props.address],
    },
    {
      name: "Total gotchi's under our care",
      variable: "totalPets",
      value: `${typeof props.totalPets !== "undefined" ? `${ethers.BigNumber.from(props.totalPets)}` : ``}`,
      title: `${typeof props.totalPets !== "undefined" ? `${ethers.BigNumber.from(props.totalPets)}` : ``}`,
      description: `This is how many Aavegotchi's in total we pet daily.`,
    },
    {
      name: "Total frens using Pet My Gotchi",
      variable: "totalParents",
      description: `This is the number of people using Pet My Gotchi service.`,
    },
  ];

  return (
    <div className={`py-6`}>
      <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
        {stats
          .filter(item => {
            if (item.conditions) {
              return item.conditions.every(condition => condition(props));
            }

            return true;
          })
          .map(item => (
            <div key={item.name} className={` group perspective`}>
              <div className="relative duration-1000 preserve-3d group-hover:my-rotate-y-180">
                <div className="rounded-lg bg-white px-4 py-5 shadow backface-hidden sm:p-6">
                  <dt className="truncate text-sm font-medium text-gray-500">{item.name}</dt>
                  <dd
                    title={item.title || props[item.variable]}
                    className="mt-3 truncate text-2xl font-semibold text-purple-500"
                  >
                    {typeof props[item.variable] !== "undefined"
                      ? typeof item.value !== "undefined"
                        ? item.value
                        : props[item.variable || "-"]
                      : ""}
                    <Loader show={typeof props[item.variable] === "undefined"} />
                  </dd>
                </div>

                <div className="absolute inset-0 overflow-hidden rounded-lg bg-white px-4 py-5 shadow my-rotate-y-180 backface-hidden sm:p-6">
                  <dt className="text-sm font-medium text-gray-500 ">{item.description}</dt>
                </div>
              </div>
            </div>
          ))}
      </dl>
    </div>
  );
}
