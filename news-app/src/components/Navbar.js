import classes from "./Navbar.module.css";
import { SiDesignernews } from "react-icons/si";
import { useState } from "react";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import { AiFillCaretDown } from "react-icons/ai";

const Navbar = () => {
  const [address, setAddress] = useState("");
  const [walletConnected, setWalletConnected] = useState(false);

  const connectWallet = async () => {
    const web3Modal = new Web3Modal({
      network: "goerli",
      cacheProvider: false,
    });
    const provider = await web3Modal.connect();
    const ethersProvider = new ethers.providers.Web3Provider(provider);
    const signer = await ethersProvider.getSigner();
    const userAddress = await signer.getAddress();
    setAddress(userAddress);
    setWalletConnected(true);
    console.log("Connection successful!");
  };

  const logoutHandler = () => {
    const disconnect = window.confirm("Are you sure you want to disconnect your wallet?")
    if(disconnect) {
      setWalletConnected(false);
      setAddress("");
    }
  }

  const renderButton = () => {
    if (walletConnected) {
      return (
        <button className={classes.wallet_connected} onClick={logoutHandler}>
          <p className={classes.user_address}>
            Welcome {address.slice(0, 8)}... <AiFillCaretDown />
          </p>
        </button>
      );
    } else {
      return (
        <button className={classes.connect_wallet} onClick={connectWallet}>
          Connect your wallet
        </button>
      );
    }
  };

  return (
    <div className={classes.container}>
      <div className={classes.logo}>
        <SiDesignernews />
        {renderButton()}
      </div>
    </div>
  );
};

export default Navbar;
