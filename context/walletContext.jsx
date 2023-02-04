import { createContext, useContext, useEffect, useState } from "react";

import { contractABI, contractAddress } from "@/helpers/constants";

import { ethers } from "ethers";

export const walletContext = createContext();
export const useWalletContext = () => useContext(walletContext);

function WalletProvider({ children }) {
  const [currentAccount, setCurrentAccount] = useState(null);
  const [contractState, setContractState] = useState(null);

  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) return;

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const checkConnection = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) return;

      const accounts = await ethereum.request({
        method: "eth_accounts",
      });

      setCurrentAccount(accounts[0]);

      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",

          params: [{ chainId: `0x${Number(80001).toString(16)}` }],
        });
      } catch (error) {
        console.log(error);

        if (error.code === 4902) {
          addNetwork();
        }

        if (error.code === -32002) {
          alert("Open Metamask");
        }
      }

      getContractState();
    } catch (error) {
      console.log(error);
    }
  };


  const addNetwork = async () => {
      try {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: '5',
              chainName: "ETH",
              nativeCurrency: {
                name: "Goerli Ether",
                symbol: "ETH",
                decimals: 18,
              },
              rpcUrls: [
                "https://goerli.infura.io/v3/${INFURA_API_KEY}",
                "https://goerli.infura.io/v3/${INFURA_API_KEY ",
                "https://rpc.goerli.mudit.blog/",
              ],
              blockExplorerUrls: ["https://goerli.net"],
            },
          ],
        });
      } catch (error) {
        console.log(error);
      }
  }

  const getContract = () => {
    const { ethereum } = window;

    if (!ethereum) return;

    const provider = = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();

    const contractMethods = new ethers.Contract(
      contractAddress,
      contractABI,
      signer
    );

    return contractMethods;
  };

  const getContractState = async () => {
    try {
      const contractMethods = getContract();
      const state = await contractMethods.returnState();
  
      setContractState({
        myBalance: state[0] ? parseFloat(ethers.utils.formatEther(state[0])) : 0,
        maxSupply: parseFloat(ethers.utils.formatEther(state[1])),
        totalSupply: parseFloat(ethers.utils.formatEther(state[2])),
        tokenPrice: ethers.utils.formatEther(state[3]),
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleMint = async () => {
    if (mintAmount == 0) return;

    const contractMethods = createEthereumContract();
  
    const options = {
      value: ethers.utils.parseEther(
        (mintAmount * contractState.tokenPrice).toString()
      ),
    };
  
    try {
      const txn = await contractMethods.mint(
        ethers.utils.parseEther(mintAmount.toString()),
        options
      );
  
      await txn.wait();
  
      getContractStates();
    } catch (error) {
      console.log(error);
    }
  };

  const handleTransfer = async () => {
    if(amount == 0) return;

    const contractMethods = createEthereumContract();

    try {
      const txn = await contractMethods.transfer(
        to,
        ethers.utils.parseEther(amount.toString())
      )

      await txn.wait();

      getContractStates();

    }catch (error){
      if (error.reason === "invalid address") alert ("invalid address");

      else if(
        error.reason ===
        "execution reverted: ERC20: transfer amount exceeds balance"
      )
      alert("Transfer amount exceeds balance");
      else alert(error.reason)
    }
  }

  useEffect(() => {
    if (!window.ethereum) return;

    checkConnection();

    ethereum.on("chainChanged", handleChainChanged);
    ethereum.on("accountsChanged", handleDisconnect);

    return () => {
      ethereum.removeListener("chainChanged", handleChainChanged);
      ethereum.removeListener("accountsChanged", handleDisconnect);
    };
  }, []);

  const handleDisconnect = (accounts) => {
    if (accounts.length == 0) {
      setCurrentAccount("");
    } else {
      setCurrentAccount(accounts[0]);
    }
  };

  const handleChainChanged = (chainId) => {
    if (chainId == "0x13881") return; 

    window.location.reload();
  };

  const contextValue = {
    connectWallet,
    currentAccount,
    contractState,
    getContract,
  };

  return (
    <walletContext.Provider value={contextValue}>
      {children}
    </walletContext.Provider>
  );
}

export default WalletProvider;