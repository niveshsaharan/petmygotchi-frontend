import { Popover } from "@headlessui/react";
import { MenuIcon, XIcon } from "@heroicons/react/outline";
import { ethers } from "ethers";
/*

const user = {
  name: "Chelsea Hagon",
  email: "chelsea.hagon@example.com",
  imageUrl:
    "https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
};
const navigation = [
  { name: "Dashboard", href: "#", current: true },
  { name: "Calendar", href: "#", current: false },
  { name: "Teams", href: "#", current: false },
  { name: "Directory", href: "#", current: false },
];
const userNavigation = [
  { name: "Your Profile", href: "#" },
  { name: "Settings", href: "#" },
  { name: "Sign out", href: "#" },
];
*/

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Header(props) {
  return (
    <>
      {/* When the mobile menu is open, add `overflow-hidden` to the `body` element to prevent double scrollbars */}
      <Popover
        as="header"
        className={({ open }) =>
          classNames(
            open ? "fixed inset-0 z-40 overflow-y-auto px-4 sm:px-6 lg:px-8" : "",
            "py-5 shadow-sm lg:static lg:overflow-y-visible",
          )
        }
      >
        {({ open }) => (
          <>
            <div className="relative flex justify-around lg:gap-8 xl:grid xl:grid-cols-12">
              <div className="flex md:absolute md:inset-y-0 md:left-0 lg:static xl:col-span-2">
                <div className="flex flex-shrink-0 items-center">
                  <a href="/#">
                    <h2 className={`block h-8 w-auto text-3xl font-bold`}>Pet My Gotchi</h2>
                  </a>
                </div>
              </div>

              <div className="flex items-center md:absolute md:inset-y-0 md:right-0 lg:hidden">
                {/* Mobile menu button */}
                <Popover.Button className="-mx-2 inline-flex items-center justify-center rounded-md p-2 text-white hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="sr-only">Open menu</span>
                  {open ? (
                    <XIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Popover.Button>
              </div>
              <div className="hidden lg:flex lg:items-center lg:justify-end xl:col-span-10">
                {process.env.REACT_APP_PET_MY_GOTCHI_TYPE !== "NON_UPGRADABLE" && (
                  <>
                    <a
                      href={`https://app.petmygotchi.com`}
                      className="mr-4 text-sm font-medium text-white hover:opacity-90"
                    >
                      Non-upgradable version
                    </a>
                    <a
                      href={`https://old.petmygotchi.com`}
                      className="mr-4 text-sm font-medium text-white hover:opacity-90"
                    >
                      Oldest version
                    </a>
                  </>
                )}
                {process.env.REACT_APP_PET_MY_GOTCHI_TYPE === "NON_UPGRADABLE" && (
                  <>
                    <a
                      href={`https://petmygotchi.com`}
                      className="mr-4 text-sm font-medium text-white hover:opacity-90"
                    >
                      Upgradable version
                    </a>
                    <a
                      href={`https://old.petmygotchi.com`}
                      className="mr-4 text-sm font-medium text-white hover:opacity-90"
                    >
                      Oldest version
                    </a>
                  </>
                )}
                {props.address && (
                  <>
                    <span className={`rounded-md bg-gray-100 px-4 py-2 text-sm text-purple-500 shadow-sm`}>
                      <span className={`border-r border-purple-500 pr-2`}>
                        {ethers.utils.formatEther(props.accountBalance || 0)} MATIC
                      </span>
                      <a
                        href={`${props.targetNetwork.blockExplorer}address/${props.address}`}
                        target={`_blank`}
                        className="ml-2 hover:opacity-90 focus:outline-none"
                      >
                        {props.address.substr(0, 7)}...{props.address.substr(-7, 7)}
                      </a>
                    </span>
                    <button
                      onClick={props.logout}
                      className="ml-2 inline-flex items-center rounded-md bg-pink-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
                    >
                      Logout
                    </button>
                  </>
                )}

                {!props.address && (
                  <button
                    onClick={props.login}
                    className="inline-flex items-center rounded-md border border-transparent bg-white px-4 py-2 text-sm font-medium text-purple-500 shadow-sm hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                  >
                    Connect Wallet
                  </button>
                )}
              </div>
            </div>

            <Popover.Panel as="nav" className="lg:hidden" aria-label="Global">
              <div className="mx-auto max-w-3xl px-2 pt-2 pb-3 sm:px-4">
                <div className={`flex max-w-3xl flex-col justify-center space-y-2`}>
                  {process.env.REACT_APP_PET_MY_GOTCHI_TYPE !== "NON_UPGRADABLE" && (
                    <>
                      <a
                        href={`https://app.petmygotchi.com`}
                        className="rounded-md border border-transparent bg-white px-4 py-2 text-center text-sm font-medium text-purple-500 shadow-sm hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                      >
                        Non-Upgradable version
                      </a>
                      <a
                        href={`https://old.petmygotchi.com`}
                        className="rounded-md border border-transparent bg-white px-4 py-2 text-center text-sm font-medium text-purple-500 shadow-sm hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                      >
                        Oldest version
                      </a>
                    </>
                  )}
                  {process.env.REACT_APP_PET_MY_GOTCHI_TYPE === "NON_UPGRADABLE" && (
                    <>
                      <a
                        href={`https://petmygotchi.com`}
                        className="rounded-md border border-transparent bg-white px-4 py-2 text-center text-sm font-medium text-purple-500 shadow-sm hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                      >
                        Visit upgradable version
                      </a>
                      <a
                        href={`https://old.petmygotchi.com`}
                        className="rounded-md border border-transparent bg-white px-4 py-2 text-center text-sm font-medium text-purple-500 shadow-sm hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                      >
                        Oldest version
                      </a>
                    </>
                  )}
                  {props.address && (
                    <>
                      <a
                        href={`${props.targetNetwork.blockExplorer}address/${props.address}`}
                        target={`_blank`}
                        className="rounded-md border border-transparent bg-white px-4 py-2 text-center text-sm font-medium text-purple-500 shadow-sm hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                      >
                        {props.address.substr(0, 15)}...{props.address.substr(-15, 15)}
                      </a>
                      <button
                        onClick={props.logout}
                        className="rounded-md border border-transparent bg-pink-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
                      >
                        Logout
                      </button>
                    </>
                  )}

                  {!props.address && (
                    <button
                      onClick={props.login}
                      className="rounded-md border border-transparent bg-white px-4 py-2 text-sm font-medium text-purple-500 shadow-sm hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                    >
                      Connect Wallet
                    </button>
                  )}
                </div>
              </div>
            </Popover.Panel>
          </>
        )}
      </Popover>
    </>
  );
}
