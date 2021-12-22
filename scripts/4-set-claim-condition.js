import sdk from "./1-initialize-sdk.js";

// Insert the bundleDrop module address bellow
const bundleDrop = sdk.getBundleDropModule(
  "0xcf0862641f963890E7e0d63A6AC2B9Af2B67d3C7",
);

(async () => {
  try {
    const claimConditionFactory = bundleDrop.getClaimConditionFactory();
    // Specify conditions.
    claimConditionFactory.newClaimPhase({
      startTime: new Date(),
      maxQuantity: 50_000,
      maxQuantityPerTransaction: 1,
    });
    
    
    await bundleDrop.setClaimCondition(0, claimConditionFactory);
    console.log("✅ Sucessfully set claim condition!");
  } catch (error) {
    console.error("🛑 Failed to set claim condition", error);
  }
})()
