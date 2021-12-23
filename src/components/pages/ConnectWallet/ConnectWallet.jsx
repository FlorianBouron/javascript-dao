import { Container } from "../../templates/Container";

export function ConnectWallet({connectWallet}) {
  return (
    <Container>
      <h1>Pokémon DAO</h1>
      <div>
        <button onClick={() => connectWallet("injected")}>
          Connect your wallet
        </button>
      </div>
    </Container>
  )
}
