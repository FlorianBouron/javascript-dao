import sdk from "./1-initialize-sdk.js";
import { readFileSync } from "fs";

// Insert the bundleDrop module address bellow
const bundleDrop = sdk.getBundleDropModule(
  "0xcf0862641f963890E7e0d63A6AC2B9Af2B67d3C7",
);

(async () => {
  try {
    await bundleDrop.createBatch([
      {
        name: "Poképass",
        description: "This NFT will give you access to Pokémon DAO!",
        image: readFileSync("scripts/assets/pokepass.jpeg"),
      },
    ]);
    console.log("✅ Successfully created a new NFT in the drop!");
  } catch (error) {
    console.error("🛑 Failed to create the new NFT", error);
  }
})()
