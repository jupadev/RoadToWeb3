import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { MemoList } from "../components/MemoList";
import abi from "../utils/BuyMeACoffee.json";
import { SendCoffee } from "../components/SendCoffee";
import { ChangeAddressForm } from "../components/ChangeAddressForm";

export default function Home() {
  // Contract Address & ABI
  const contractAddress = "0x1fE6513336840cbD591388a68ffD5FD0D5AB251e";
  const contractABI = abi.abi;

  // Component state
  const [currentAccount, setCurrentAccount] = useState("");
  const [memos, setMemos] = useState([]);
  const [currentOwner, setCurrentOwner] = useState("");

  // Wallet connection logic
  const isWalletConnected = async () => {
    try {
      const { ethereum } = window;

      const accounts = await ethereum.request({ method: "eth_accounts" });
      console.log("accounts: ", accounts);

      if (accounts.length > 0) {
        const account = accounts[0];
        console.log("wallet is connected! " + account);
      } else {
        console.log("make sure MetaMask is connected");
      }
    } catch (error) {
      console.log("error: ", error);
    }
  };

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("please install MetaMask");
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const buyCoffee = async (name, message, isLargeCoffee) => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum, "any");
        const signer = provider.getSigner();
        const buyMeACoffee = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        console.log(`buying ${isLargeCoffee ? "large coffee.." : "coffee.."}`);
        const coffeeTxn = await buyMeACoffee.buyCoffee(
          name || "anon",
          message || "Enjoy your coffee!",
          { value: ethers.utils.parseEther(isLargeCoffee ? "0.003" : "0.001") }
        );

        await coffeeTxn.wait();

        console.log("mined ", coffeeTxn.hash);
        console.log("coffee purchased!");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleWithdrawBalance = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum, "any");
        const signer = provider.getSigner();
        const buyMeACoffee = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        console.log(`trying withdraw....`);
        const withdrawTxn = await buyMeACoffee.withdrawTips();

        await withdrawTxn.wait();

        console.log("mined ", withdrawTxn.hash);
        console.log("coffee purchased!");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleNewOwnership = async (address) => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum, "any");
        const signer = provider.getSigner();
        const buyMeACoffee = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        console.log(`updating ownership....`);
        const updateOwnerTxn = await buyMeACoffee.updateOwner(address);
        await updateOwnerTxn.wait();
        console.log(`Contract owner ${address} updated!!!`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Function to fetch all memos stored on-chain.
  const getMemos = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const buyMeACoffee = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        console.log("fetching memos from the blockchain..");
        const memos = await buyMeACoffee.getMemos();
        console.log("Memos fetched!");
        setMemos(memos);
      } else {
        console.log("Metamask is not connected");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getCurrentOwner = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const buyMeACoffee = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        console.log("fetching owner");
        const owner = await buyMeACoffee.checkOwner();
        console.log(`Contract owner ${owner}`);
        setCurrentOwner(owner);
      } else {
        console.log("Metamask is not connected");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (currentAccount) {
      getMemos();
      getCurrentOwner();
    }
  }, [currentAccount]);

  useEffect(() => {
    let buyMeACoffee;
    isWalletConnected();

    // Create an event handler function for when someone sends
    // us a new memo.
    const onNewMemo = (from, timestamp, name, message) => {
      console.log("Memo received: ", from, timestamp, name, message);
      setMemos((prevState) => [
        ...prevState,
        {
          address: from,
          timestamp: new Date(timestamp * 1000),
          message,
          name,
        },
      ]);
    };

    const { ethereum } = window;

    // Listen for new memo events.
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum, "any");
      const signer = provider.getSigner();
      buyMeACoffee = new ethers.Contract(contractAddress, contractABI, signer);
      buyMeACoffee.on("NewMemo", onNewMemo);
    }

    return () => {
      if (buyMeACoffee) {
        buyMeACoffee.off("NewMemo", onNewMemo);
      }
    };
  }, []);

  return (
    <div
      className={`${styles.container} bg-gradient-to-r from-cyan-500 to-blue-500`}
    >
      <Head>
        <title>Buy JhonnV a Coffee!</title>
        <meta name="description" content="Tipping site" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="text-al container  mx-auto px-4">
        <h1 className="text-4xl font-bold">Buy JhonnV a Coffee!</h1>

        {currentAccount ? (
          <SendCoffee buyCoffee={buyCoffee} />
        ) : (
          <button
            onClick={connectWallet}
            className="my-4 bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
          >
            Connect your wallet
          </button>
        )}
        {currentAccount && memos.length && <MemoList memos={memos} />}

        {currentAccount && (
          <ChangeAddressForm changeOwnership={handleNewOwnership} />
        )}
        {currentAccount && (
          <button
            className="bg-green-200 hover:bg-green-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
            onClick={handleWithdrawBalance}
          >
            Withdraw contract balance
          </button>
        )}
        {currentAccount && <div>Current Owner: {currentOwner}</div>}
      </main>

      <footer className={`${styles.footer} mt-6`}>
        <a
          href="https://alchemy.com/?a=roadtoweb3weektwo"
          target="_blank"
          rel="noopener noreferrer"
        >
          Created by Jupadev. Inspired on @thatguyintech for Alchemy's Road to
          Web3 lesson two!
        </a>
      </footer>
    </div>
  );
}
