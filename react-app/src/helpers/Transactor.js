import { notification } from "antd";
import { NETWORK } from "../constants";

const { ethers } = require("ethers");

// this should probably just be renamed to "notifier"
// it is basically just a wrapper around BlockNative's wonderful Notify.js
// https://docs.blocknative.com/notify
const callbacks = {};

const DEBUG = false;

function logger() {
  if (DEBUG) {
    console.log(...arguments);
  }
}

export default function Transactor(providerOrSigner, gasPrice) {
  if (typeof providerOrSigner !== "undefined") {
    // eslint-disable-next-line consistent-return
    return async (tx, callback) => {
      let signer;
      let network;
      let provider;
      if (ethers.Signer.isSigner(providerOrSigner) === true) {
        provider = providerOrSigner.provider;
        signer = providerOrSigner;
        network = providerOrSigner.provider && (await providerOrSigner.provider.getNetwork());
      } else if (providerOrSigner._isProvider) {
        provider = providerOrSigner;
        signer = providerOrSigner.getSigner();
        network = await providerOrSigner.getNetwork();
      }

      logger(provider);
      logger("network", network);

      const currentNetwork = NETWORK(network.chainId);

      let blockExplorerTxUrl = currentNetwork.blockExplorer + "tx/";

      if (network.chainId === 100) {
        blockExplorerTxUrl = "https://blockscout.com/poa/xdai/tx/";
      }

      try {
        let result;
        logger(tx);
        if (tx instanceof Promise) {
          if (provider.provider.isWalletConnect) {
            notification.warn({
              message: "Check your connected wallet!",
              description: "A confirmation is required in your Walletconnect connected wallet.",
              placement: "topRight",
              duration: null,
              key: "awaiting-wc-confirmation",
            });
          }
          result = await tx;
          if (provider.provider.isWalletConnect) {
            notification.close("awaiting-wc-confirmation");
          }
        } else {
          if (!tx.gasPrice) {
            tx.gasPrice = gasPrice || ethers.utils.parseUnits("4.1", "gwei");
          }
          if (!tx.gasLimit) {
            tx.gasLimit = ethers.utils.hexlify(120000);
          }
          logger("RUNNING TX", tx);
          result = await signer.sendTransaction(tx);
        }
        logger("RESULT:", result);
        // logger("Notify", notify);

        if (callback) {
          callbacks[result.hash] = callback;
        }

        notification.info({
          message: "Transaction Sent",
          description: "Waiting for confirmation...",
          placement: "topRight",
          duration: null,
          key: result.hash,
          onClick: () => window.open(blockExplorerTxUrl + result.hash),
        });
        // on most networks BlockNative will update a transaction handler,
        // but locally we will set an interval to listen...
        if (callback) {
          const txResult = await tx;
          const listeningInterval = setInterval(async () => {
            logger("CHECK IN ON THE TX", txResult, provider);
            const currentTransactionReceipt = await provider.getTransactionReceipt(txResult.hash);
            if (currentTransactionReceipt && currentTransactionReceipt.confirmations) {
              callback({ ...txResult, ...currentTransactionReceipt });
              clearInterval(listeningInterval);
            }
          }, 5000);
        }

        if (typeof result.wait === "function") {
          await result.wait();
        }

        return result;
      } catch (e) {
        logger("yo", e);
        // Accounts for Metamask and default signer on all networks
        let message =
          e.data && e.data.message
            ? e.data.message
            : e.error && JSON.parse(JSON.stringify(e.error)).body
            ? JSON.parse(JSON.parse(JSON.stringify(e.error)).body).error.message
            : e.data
            ? e.data
            : e.message
            ? e.message
            : JSON.stringify(e);
        logger("Nivesh", message);
        if (!e.error && e.message) {
          message = e.message + (message && message !== e.message ? ": " + message : "");
        }

        logger("Attempt to clean up:", message);
        try {
          let obj = JSON.parse(message);
          if (obj && obj.body) {
            let errorObj = JSON.parse(obj.body);
            if (errorObj && errorObj.error && errorObj.error.message) {
              message = errorObj.error.message;
            }
          }
        } catch (e) {
          //ignore
        }

        if (typeof message === "string") {
          message = message.replaceAll("execution reverted:", "").trim();
        }

        try {
          const message1 = JSON.parse(`{` + message.split("(error={")[1].split("}, ")[0] + `}`);
          message = message1.message || message;
          message = message.replaceAll("AlchemicaFacet:", "").trim();
        } catch (e) {}

        if (provider.provider.isWalletConnect) {
          notification.close("awaiting-wc-confirmation");
        }

        notification.error({
          message: "Transaction Error",
          description: message,
          placement: "topRight",
          duration: 30,
        });
        if (callback && typeof callback === "function") {
          callback(e);
        }
      }
    };
  }
}
