import sdk from "./1-initialize-sdk.js";

// Grab the app module address.
const appModule = sdk.getAppModule(
  "0x0836AE4b5b78bCd1BB68802D57f3705050E5f28F",
);

(async () => {
  try {
    const voteModule = await appModule.deployVoteModule({
      name: "Pokémon's Epic Proposals",
      // ERC-20 contract
      votingTokenAddress: "0xBF469E4fEa4E332017A0E786F840E48EBD264Ca0",
      proposalStartWaitTimeInSeconds: 0,
      // Here, we set it to 24 hours (86400 seconds)
      proposalVotingTimeInSeconds: 24 * 60 * 60,
      votingQuorumFraction: 0,
      minimumNumberOfTokensNeededToPropose: "0",
    });

    console.log(
      "✅ Successfully deployed vote module, address:",
      voteModule.address,
    );
  } catch (err) {
    console.log("🛑 Failed to deploy vote module", err);
  }
})();
