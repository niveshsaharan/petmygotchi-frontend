import { Switch } from "@headlessui/react";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function ApproveSmartContract(props) {
  return (
    <div className="bg-white shadow sm:rounded-lg">
      <Switch.Group as="div" className="px-4 py-5 sm:p-6">
        <Switch.Label as="h3" className="text-lg font-medium leading-6 text-gray-900" passive>
          Allow smart contract to pet your Gotchi's
        </Switch.Label>
        <div className="mt-2 sm:flex sm:items-start sm:justify-between">
          <div className="max-w-xl text-sm text-gray-500">
            <Switch.Description>
              This will set{" "}
              <a href={`https://gelato.network`} target={`_blank`}>
                Gelato's
              </a>{" "}
              smart contract as Pet Operator for all your Aavegotchi's. This is a completely safe action because setting
              Pet Operator doesn't allow any access other than petting. You will be able remove the access anytime.
            </Switch.Description>
          </div>
          <div className="mt-5 sm:mt-0 sm:ml-6 sm:flex sm:flex-shrink-0 sm:items-center">
            <Switch
              title={props.address ? `` : `Connect to a wallet first!`}
              disabled={!props.address}
              checked={props.isPetOperatorForAll}
              onChange={props.isPetOperatorForAll ? props.removePetOperatorForAll : props.setPetOperatorForAll}
              className={classNames(
                props.address ? "cursor-pointer" : "cursor-not-allowed",
                props.isPetOperatorForAll ? "bg-purple-600" : "bg-gray-200",
                "relative inline-flex h-6 w-11 flex-shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2",
              )}
            >
              <span className="sr-only">Use setting</span>
              <span
                className={classNames(
                  props.isPetOperatorForAll ? "translate-x-5" : "translate-x-0",
                  "pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                )}
              >
                <span
                  className={classNames(
                    props.isPetOperatorForAll ? "opacity-0 duration-100 ease-out" : "opacity-100 duration-200 ease-in",
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
                    props.isPetOperatorForAll ? "opacity-100 duration-200 ease-in" : "opacity-0 duration-100 ease-out",
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
          </div>
        </div>
      </Switch.Group>
    </div>
  );
}
