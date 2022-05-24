/* This example requires Tailwind CSS v2.0+ */
import { useState } from "react";
import { Switch } from "@headlessui/react";
import Loader from "./Loader";
import { ethers } from "ethers";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function TakeCareOfMyPets(props) {
  const [amount, setAmount] = useState("5");
  const [enabled, setEnabled] = useState(!!props.isParentAdded);
  const isPreviousStepCompleted = props.isParentAdded || (props.isPetOperatorForAll && props.address);
  return (
    <div className="bg-white shadow sm:rounded-lg">
      <Switch.Group as="div" className="px-4 py-5 sm:p-6">
        <Switch.Label as="h3" className="text-lg font-medium leading-6 text-gray-900" passive>
          Take care of my Aavegotchi's
        </Switch.Label>
        <div className="mt-2 sm:flex sm:items-start sm:justify-between">
          <div className="max-w-xl text-sm text-gray-500">
            <Switch.Description>
              {enabled
                ? `Some MATIC are required to start the care and you can start with as small as 1 MATIC and can deposit more as your go. You will be able to withdraw your balance anytime. ${
                    props.feePerPetPerDay > 0
                      ? `1 MATIC can cover about ` +
                        Math.floor(1 / ethers.utils.formatEther(props.feePerPetPerDay)) +
                        ` days of petting for 1 Gotchi. `
                      : ``
                  }`
                : props.isParentAdded
                ? `Your Gotchi's are being taken good care of. Stopping the care will refund you your remaining balance automatically.`
                : `Click the button to setup automatic petting for your Aavegotchi's.`}
            </Switch.Description>
          </div>
          <div className="mt-5 sm:mt-0 sm:ml-6 sm:flex sm:flex-shrink-0 sm:items-center">
            <Loader show={false} />
            {(!enabled || props.isParentAdded) && (
              <Switch
                title={isPreviousStepCompleted ? `` : `Complete previous step first.`}
                disabled={!isPreviousStepCompleted}
                checked={props.isParentAdded}
                onChange={() => (!props.isParentAdded ? setEnabled(true) : props.removeParent())}
                className={classNames(
                  isPreviousStepCompleted ? "cursor-pointer" : "cursor-not-allowed",
                  props.isParentAdded ? "bg-purple-600" : "bg-gray-200",
                  "relative inline-flex h-6 w-11 flex-shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2",
                )}
              >
                <span className="sr-only">Use setting</span>
                <span
                  className={classNames(
                    props.isParentAdded ? "translate-x-5" : "translate-x-0",
                    "pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                  )}
                >
                  <span
                    className={classNames(
                      props.isParentAdded ? "opacity-0 duration-100 ease-out" : "opacity-100 duration-200 ease-in",
                      "absolute inset-0 flex h-full w-full items-center justify-center transition-opacity",
                    )}
                    aria-hidden="true"
                  >
                    <svg className="h-3 w-3 text-gray-400" fill="none" viewBox="0 0 12 12">
                      <path
                        d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <span
                    className={classNames(
                      props.isParentAdded ? "opacity-100 duration-200 ease-in" : "opacity-0 duration-100 ease-out",
                      "absolute inset-0 flex h-full w-full items-center justify-center transition-opacity",
                    )}
                    aria-hidden="true"
                  >
                    <svg className="h-3 w-3 text-purple-600" fill="currentColor" viewBox="0 0 12 12">
                      <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
                    </svg>
                  </span>
                </span>
              </Switch>
            )}

            {enabled && !props.isParentAdded && (
              <div className="sm:flex sm:items-center">
                <div className="relative rounded-md text-purple-500 shadow-sm">
                  <label htmlFor="email" className="sr-only">
                    Amount
                  </label>
                  <input
                    type="number"
                    className="block w-full rounded-md border-gray-300 pl-4 pr-16 focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                    placeholder="For eg. 20"
                    min={`0`}
                    aria-describedby="amount-currency"
                    value={amount}
                    step={`0.1`}
                    onChange={e => setAmount(e.target.value)}
                    autoComplete={`off`}
                    aria-autocomplete={`none`}
                  />
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    <span className="text-gray-500 sm:text-sm" id="amount-currency">
                      MATIC
                    </span>
                  </div>
                </div>
                {props.isParentAdded ? (
                  <button
                    type="submit"
                    onClick={() => props.depositFunds(amount)}
                    className="mt-3 inline-flex w-full items-center justify-center rounded-md border border-transparent bg-purple-600 px-4 py-2 font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Deposit Funds
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={amount <= 0}
                    onClick={() => props.addParent(amount)}
                    className={classNames(
                      amount <= 0
                        ? "cursor-not-allowed bg-gray-500"
                        : "bg-purple-600 hover:bg-purple-700 focus:ring-purple-500",
                      "mt-3 inline-flex w-full items-center justify-center rounded-md border border-transparent px-4 py-2 font-medium text-white shadow-sm  focus:outline-none focus:ring-2 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm",
                    )}
                  >
                    Start care
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </Switch.Group>
    </div>
  );
}
