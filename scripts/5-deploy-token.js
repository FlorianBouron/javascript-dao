import sdk from "./1-initialize-sdk.js";

// Insert your address from script 1 below
const app = sdk.getAppModule("0x0836AE4b5b78bCd1BB68802D57f3705050E5f28F");

(async () => {
  try {
    // Deploy a standard ERC-20 contract.
    const tokenModule = await app.deployTokenModule({
      name: "Pokecoin",
      symbol: "POKC",
    });
    console.log(
      "✅ Successfully deployed token module, address:",
      tokenModule.address,
    );
  } catch (error) {
    console.error("🛑 Failed to deploy token module", error);
  }
})();
