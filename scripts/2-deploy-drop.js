import { ethers } from "ethers";
import sdk from "./1-initialize-sdk.js";
import { readFileSync } from "fs";

// Insert your address from script 1 below
const app = sdk.getAppModule("0x0836AE4b5b78bCd1BB68802D57f3705050E5f28F");

(async () => {
  try {
    const bundleDropModule = await app.deployBundleDropModule({
      name: "Pokémon DAO",
      description: "A DAO for voting on the Pokémon stuff for the Pokémon community",
      image: readFileSync("scripts/assets/pokemon.jpeg"),
      // We need to pass in the address of the person who will be receiving the proceeds from sales of nfts in the module.
      // We're planning on not charging people for the drop, so we'll pass in the 0x0 address
      // you can set this to your own wallet address if you want to charge for the drop.
      primarySaleRecipientAddress: ethers.constants.AddressZero,
    });
    
    console.log(
      "✅ Successfully deployed bundleDrop module, address:",
      bundleDropModule.address,
    );
    console.log(
      "✅ BundleDrop metadata:",
      await bundleDropModule.getMetadata(),
    );
  } catch (error) {
    console.log("🛑 Failed to deploy bundleDrop module", error);
  }
})()
