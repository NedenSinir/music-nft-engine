import React from "react";
import logo from "./logo.svg";
import "./App.css";
import './App.css';



function App() {
  const [walletAddress, setWalletAddress] = React.useState(null);

  const checkIfWalletIsConnected = async () => {
    console.log("asdasdasdasd")
    try {
      const { solana } = window;

      if (solana) {
        if (solana.isPhantom) {
          console.log('Phantom wallet found!');
          const response = await solana.connect({ onlyIfTrusted: true });
          console.log(
            'Connected with Public Key:',
            response.publicKey.toString()
          );

          /*
           * Set the user's publicKey in state to be used later!
           */
          setWalletAddress(response.publicKey.toString());
        }
      } else {
        alert('Solana object not found! Get a Phantom Wallet 👻');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const connectWallet = async () => {
    const { solana } = window;
  
    if (solana) {
      const response = await solana.connect();
      console.log('Connected with Public Key:', response.publicKey.toString());
      setWalletAddress(response.publicKey.toString());
    }
  };


  const sendWallet = async () =>{
    try{

    
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ wallet: walletAddress })
  };
 await fetch('/data', requestOptions);
  }catch(err){
    console.log(err)
  }


}
function Mint()  {

  if (walletAddress == null){
   return( <button   className="cta-button connect-wallet-button"onClick={connectWallet}>
    Connect to Wallet
    </button>)
    
    
  }else{
    return(<button  className="cta-button connect-wallet-button"onClick={sendWallet}>
      Mint One
      (Don't spam to this button just click one)
    </button>)
  }


}







  React.useEffect(() => {
      const onLoad = async () => {
        await checkIfWalletIsConnected();
      };
      window.addEventListener('load', onLoad);
      return () => window.removeEventListener('load', onLoad);
  }, []);
   
  return (

    <div className="App">

      

      <header className="App-header">
      <Mint/>
        <p>This engine will mint to connected wallet</p>
        <img src={logo} className="App-logo" alt="logo" />
        <p>{!walletAddress ? "wallet not connected" : walletAddress}</p>
      </header>
    </div>
  );
}

export default App;