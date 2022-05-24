/* This example requires Tailwind CSS v2.0+ */
import { useState } from "react";
import { Switch } from "@headlessui/react";

/*

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
*/

export default function DepositFunds(props) {
  const [amount, setAmount] = useState("5");

  return (
    <div className="bg-white shadow sm:rounded-lg">
      <Switch.Group as="div" className="px-4 py-5 sm:p-6">
        <Switch.Label as="h3" className="text-lg font-medium leading-6 text-gray-900" passive>
          Deposit more funds
        </Switch.Label>
        <div className="mt-2 sm:flex sm:items-start sm:justify-between">
          <div className="max-w-xl text-sm text-gray-500">
            <Switch.Description>
              Enter amount of MATIC tokens you want to fund your account with. You will be able to withdraw your balance
              anytime. Your current balance is {props.accountBalance}.
            </Switch.Description>
          </div>
          <div className="sm:mt-0 sm:ml-6 sm:flex sm:flex-shrink-0 sm:items-center">
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
              <button
                type="submit"
                onClick={() => props.depositFunds(amount)}
                className="mt-3 inline-flex w-full items-center justify-center rounded-md border border-transparent bg-purple-600 px-4 py-2 font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Deposit
              </button>
            </div>
          </div>
        </div>
      </Switch.Group>
    </div>
  );
}
