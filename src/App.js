import { useEffect, useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useContract, useSigner } from "wagmi";
import { abi as CONTRACT_ABI } from "./ABI";
const CONTRACT_ADDRESS = "0x3D23D647Bf5BCCdA1801dA57C068E7FEcEa4336e";

function App() {
	const { address } = useAccount();
	const { data: signer } = useSigner();
	const [mintRate, setMintRate] = useState("0");
	const [error, setError] = useState(false);
	const [tokenId, setTokenId] = useState(null);
	const [loading, setLoading] = useState(false);

	const contract = useContract({
		addressOrName: CONTRACT_ADDRESS,
		contractInterface: CONTRACT_ABI,
		signerOrProvider: signer,
	});

	console.log(contract);
	const getMint = async () => {
		const price = await contract.mintRate();
		setMintRate(price.toString());
	};

	useEffect(() => {
		if (contract?.signer) {
			getMint();
		}
	}, [contract]);

	const mintNft = async () => {
		setLoading(true);
		try {
			const mint = await contract.safeMint({ value: mintRate });
			console.log(mint);

			contract.on("Transfer", (to, from, token) => {
				console.log(to, from, token);
				setTokenId(token.toString());
				setLoading(false);
			});
		} catch (err) {
			console.log(err);
			setError(err);
			setLoading(false);
		}
	};

	console.log("MINT ", mintRate);
	console.log("TOKEN ", tokenId);
	console.log("ERROR ", error);
	console.log("LOADING ", loading);

	return (
		<div>
			<div className="flex items-center justify-end p-2">
				<ConnectButton />
			</div>
			<div className="flex flex-col items-center justify-center min-h-[90vh] gap-4">
				<h1 className="text-4xl font-extrabold">Mint an NFT</h1>
				{address ? (
					loading ? (
						<h3 className="text-xl">Minting your NFT...</h3>
					) : (
						<button
							onClick={mintNft}
							className="bg-black text-white py-2 px-4 rounded-xl transform hover:scale-105"
						>
							Mint
						</button>
					)
				) : (
					<ConnectButton />
				)}
				{error && (
					<div>
						<p>Something went wrong!</p>
					</div>
				)}
				{tokenId && (
					<div className="flex flex-col">
						<p className="font-bold">Token with id {tokenId} minted</p>
						<p>
							Check it over here:{" "}
							<a
								href={`https://testnets.opensea.io/assets/goerli/${CONTRACT_ADDRESS}/${tokenId}`}
                target="_blank"
                rel="noreferrer"
							>
								Opensea
							</a>
						</p>
					</div>
				)}
			</div>
		</div>
	);
}

export default App;