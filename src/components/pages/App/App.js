import { useWeb3 } from "@3rdweb/hooks";
import './App.css';

const App = () => {
  const { connectWallet, address } = useWeb3();

  if (!address) {
    return (
      <div className="landing">
        <h1>Pokémon DAO</h1>
        <div>
          <button onClick={() => connectWallet("injected")} className="btn-hero">
            Connect your wallet
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="landing">
      <h1>👀 wallet connected, now what!</h1>
    </div>);
};

export default App;