import { useState, useEffect, useMemo } from "react";
import { ethers } from "ethers";
import { ThirdwebSDK } from "@3rdweb/sdk";
import "./Member.css";

export function Member({
  memberAddresses,
  memberTokenAmounts,
  hasClaimedNFT,
  address,
  tokenModule
}) {
  const [proposals, setProposals] = useState([]);
  const [isVoting, setIsVoting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }
    voteModule
      .getAll()
      .then((proposals) => {
        setProposals(proposals);
      })
      .catch((err) => {
        console.error("Failed to get proposals", err);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasClaimedNFT]);
  
  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }
    if (!proposals.length) {
      return;
    }
  
    voteModule
      .hasVoted(proposals[0].proposalId, address)
      .then((hasVoted) => {
        setHasVoted(hasVoted);
      })
      .catch((err) => {
        console.error("Failed to check if wallet has voted", err);
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasClaimedNFT, proposals, address]);

  const sdk = new ThirdwebSDK("rinkeby");

  const shortenAddress = (str) => {
    return str.substring(0, 6) + "..." + str.substring(str.length - 4);
  };

  const voteModule = sdk.getVoteModule(
    "0xbc3a2b1A0d561e01704487D99cF0cd27231A88e4",
  );

  const memberList = useMemo(() => {
    return memberAddresses.map((address) => {
      return {
        address,
        tokenAmount: ethers.utils.formatUnits(
          memberTokenAmounts[address] || 0,
          18,
        ),
      };
    });
  }, [memberAddresses, memberTokenAmounts]);

  return (
    <div className="member-page">
      <h1>Pokémon DAO Member Page</h1>
      <p>Congratulations on being a member</p>
      <div>
        <div>
          <h2>Member List</h2>
          <table className="card">
            <thead>
              <tr>
                <th>Address</th>
                <th>Token Amount</th>
              </tr>
            </thead>
            <tbody>
              {memberList.map((member) => {
                return (
                  <tr key={member.address}>
                    <td>{shortenAddress(member.address)}</td>
                    <td>{member.tokenAmount}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div>
          <h2>Active Proposals</h2>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsVoting(true);

              const votes = proposals.map((proposal) => {
                let voteResult = {
                  proposalId: proposal.proposalId,
                  //abstain by default
                  vote: 2,
                };
                proposal.votes.forEach((vote) => {
                  const elem = document.getElementById(
                    proposal.proposalId + "-" + vote.type
                  );

                  if (elem.checked) {
                    voteResult.vote = vote.type;
                    return;
                  }
                });
                return voteResult;
              });

              try {
                const delegation = await tokenModule.getDelegationOf(address);
                // if the delegation is the 0x0 address that means they have not delegated their governance tokens yet
                if (delegation === ethers.constants.AddressZero) {
                  //if they haven't delegated their tokens yet, we'll have them delegate them before voting
                  await tokenModule.delegateTo(address);
                }
                // then we need to vote on the proposals
                try {
                  await Promise.all(
                    votes.map(async (vote) => {
                      // before voting we first need to check whether the proposal is open for voting
                      // we first need to get the latest state of the proposal
                      const proposal = await voteModule.get(vote.proposalId);
                      // then we check if the proposal is open for voting (state === 1 means it is open)
                      if (proposal.state === 1) {
                        // if it is open for voting, we'll vote on it
                        return voteModule.vote(vote.proposalId, vote.vote);
                      }
                      // if the proposal is not open for voting we just return nothing, letting us continue
                      return;
                    })
                  );
                  try {
                    await Promise.all(
                      votes.map(async (vote) => {
                        // we'll first get the latest state of the proposal again, since we may have just voted before
                        const proposal = await voteModule.get(
                          vote.proposalId
                        );

                        //if the state is in state 4 (meaning that it is ready to be executed), we'll execute the proposal
                        if (proposal.state === 4) {
                          return voteModule.execute(vote.proposalId);
                        }
                      })
                    );
                    setHasVoted(true);
                  } catch (err) {
                    console.error("Failed to execute votes", err);
                  }
                } catch (err) {
                  console.error("Failed to vote", err);
                }
              } catch (err) {
                console.error("Failed to delegate tokens");
              } finally {
                setIsVoting(false);
              }
            }}
          >
            {proposals.map((proposal, index) => (
              <div key={proposal.proposalId} className="card">
                <h5>{proposal.description}</h5>
                <div>
                  {proposal.votes.map((vote) => (
                    <div key={vote.type}>
                      <input
                        type="radio"
                        id={proposal.proposalId + "-" + vote.type}
                        name={proposal.proposalId}
                        value={vote.type}
                        defaultChecked={vote.type === 2}
                      />
                      <label htmlFor={proposal.proposalId + "-" + vote.type}>
                        {vote.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <button disabled={isVoting || hasVoted} type="submit">
              {isVoting
                ? "Voting..."
                : hasVoted
                  ? "You Already Voted"
                  : "Submit Votes"}
            </button>
            <small>
              This will trigger multiple transactions that you will need to
              sign.
            </small>
          </form>
        </div>
      </div>
    </div>
  )
}
