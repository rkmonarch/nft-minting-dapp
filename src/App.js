import logo from './logo.svg';
import './App.css';

function App() {
	return (
		<div className="flex items-center justify-center min-h-screen">
			<div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-4xl font-extrabold">Mint an NFT</h1>
        <button className="bg-black text-white py-2 px-4 rounded-xl transform hover:scale-105">
          Mint
        </button>
      </div>
		</div>
	);
}


export default App;
