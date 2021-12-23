import { useState, useEffect, useMemo } from "react";
import { ThirdwebSDK } from "@3rdweb/sdk";
import { useWeb3 } from "@3rdweb/hooks";
import { Member } from "./components/pages/Member/Member";
import { ConnectWallet } from "./components/pages/ConnectWallet/ConnectWallet";
import { Minting } from "./components/pages/Minting/Minting";

const sdk = new ThirdwebSDK("rinkeby");

const bundleDropModule = sdk.getBundleDropModule(
  "0xcf0862641f963890E7e0d63A6AC2B9Af2B67d3C7",
);

const App = () => {
  const { connectWallet, address, error, provider } = useWeb3();

  // The signer is required to sign transactions on the blockchain.
  // Without it we can only read data, not write.
  const signer = provider ? provider.getSigner() : undefined;

  const [hasClaimedNFT, setHasClaimedNFT] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);

  useEffect(() => {
    sdk.setProviderOrSigner(signer);
  }, [signer]);

  useEffect(() => {
    if (!address) {
      return;
    }
    
    // Check if the user has the NFT by using bundleDropModule.balanceOf
    return bundleDropModule
      .balanceOf(address, "0")
      .then((balance) => {
        // If balance is greater than 0, they have our NFT!
        if (balance.gt(0)) {
          setHasClaimedNFT(true);
        } else {
          setHasClaimedNFT(false);
        }
      })
      .catch((error) => {
        setHasClaimedNFT(false);
        console.error("Failed to nft balance", error);
      });
  }, [address]);

  if (!address) {
    return (
      <ConnectWallet connectWallet={connectWallet} />
    );
  }

  if (hasClaimedNFT) {
    return (
      <Member />
    );
  };

  const mintNft = () => {
    setIsClaiming(true);
    // Call bundleDropModule.claim("0", 1) to mint nft to user's wallet.
    bundleDropModule
    .claim("0", 1)
    .catch((err) => {
      console.error("Failed to claim", err);
      setIsClaiming(false);
    })
    .finally(() => {
      setIsClaiming(false);
      setHasClaimedNFT(true);
      console.log(
        `🌊 Successfully Minted! Check it out on OpenSea: https://testnets.opensea.io/assets/${bundleDropModule.address}/0`
      );
    });
  }
  
  return (
    <Minting isClaiming={isClaiming} mintNft={mintNft}/>
  );
};

export default App;