import { Container } from "../../templates/Container";

export function Minting({isClaiming, mintNft}) {
  return (
    <Container>
      <h1>Mint your free Pokémon DAO Membership NFT</h1>
      <div>
        <button
          disabled={isClaiming}
          onClick={() => mintNft()}
        >
          {isClaiming ? "Minting..." : "Mint your nft (FREE)"}
        </button>
      </div>
    </Container>
  )
}
