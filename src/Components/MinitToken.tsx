import { clusterApiUrl, Connection, PublicKey, Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";
import {
    createMint,
    getOrCreateAssociatedTokenAccount,
    mintTo, transfer, Account,
    getMint, getAccount
} from "@solana/spl-token";
//import { Buffer } from 'buffer';
import { useState } from "react";

//window.Buffer = Buffer;

//Special setup to add a Buffer class
//window.Buffer = window.Buffer || require("buffer").Buffer;

const fromWallet = Keypair.generate();

export default function MinitToken() {
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed"); // url of solana network
    //const connection = new Connection("http://localhost:8899", "confirmed"); // url for local solana test validator
    // const fromWallet = Keypair.generate();
    let mint: PublicKey;
    let fromTokenAccount: Account;
    const toWallet = new PublicKey("6917dyPmByyGvoCawAqsnD4xy9h96exmB4cpN47u9oMo");

    const[createTokenValue, setCreateTokenValue] = useState('');
    const[createTokenAccount, setCreateTokenAccount] = useState('');
    const[mintSignature, setMintSignature] = useState('');
    const[checkSupplyToken, setCheckSupplyToken] = useState<bigint | null>(null);
    const[amountOfToken, setAmountOfToken] = useState<bigint | null>(null);
    const[toTokenAccountVal, setToTokenAccountVal] = useState<PublicKey | null>(null);
    const [transferSignature, setTransferSignature] = useState(''); // Initialize with an empty string



    async function createToken() {
        try {
            const balance = await connection.getBalance(fromWallet.publicKey);
            if (balance < LAMPORTS_PER_SOL) {
                const fromAirdropSignature = await connection.requestAirdrop(fromWallet.publicKey, LAMPORTS_PER_SOL);
                await connection.confirmTransaction(fromAirdropSignature);
            }

            // Create new Token Mint
            mint = await createMint(
                connection,
                fromWallet,
                fromWallet.publicKey,
                null,
                9 // 9 means we have a decimal of 9 zeros
            );
            console.log(`Create Token: ${mint.toBase58()}`);
            setCreateTokenValue(mint.toBase58());

            // Get the token account of the fromWallet address, and if it does not exist, create it
            fromTokenAccount = await getOrCreateAssociatedTokenAccount(
                connection,
                fromWallet,
                mint,
                fromWallet.publicKey
            );
            console.log(`Create Token Account: ${fromTokenAccount.address.toBase58()}`);
            setCreateTokenAccount(fromTokenAccount.address.toBase58());
        } catch (error) {
            console.error(error);
        }
    }

    async function mintToken() {
        //Mint 1 new token to the "fromTokenAccount" account we just created
        const signature = await mintTo(
            connection,
            fromWallet,
            mint,
            fromTokenAccount.address,
            fromWallet.publicKey,
            50000000000 //50 billion
        );
        console.log(`Mint Signature: ${signature}`);
        setMintSignature(signature);
    }

    async function checkBalance() {
        // get supply of token we have minted into existance
        const mintInfo = await getMint(connection, mint);
        console.log(mintInfo.supply);
        setCheckSupplyToken(mintInfo.supply);

        //get the amount of token left in account
        const tokenAccountInfo = await getAccount(connection, fromTokenAccount.address);
        console.log(tokenAccountInfo.amount);
        setAmountOfToken(tokenAccountInfo.amount);
    }

    async function sendToken() {
        //Get the token account of the wallet address, and if doesn't exit create it
        const toTokenAccount = await getOrCreateAssociatedTokenAccount(connection, fromWallet, mint, toWallet);
        console.log(`toTokenAccount: ${toTokenAccount.address}`);
        setToTokenAccountVal(toTokenAccount.address);

        const signature = await transfer(
            connection,
            fromWallet,
            fromTokenAccount.address,
            toTokenAccount.address,
            fromWallet.publicKey,
            5000000000 //5 billion
        );
        console.log(`Transfer Signature: ${signature}`);
        // Update the state variable with the value of signature
        setTransferSignature(signature);
    }



    return (
        <div>
            <div>
                <h1 className="text-center text-4xl font-bold text-white mb-5">Mint Token Section</h1>
            </div>
            <button onClick={createToken} className="p-4 m-2 bg-green-500">Create Token</button>
            <button onClick={mintToken} className="p-4 m-2 bg-orange-500">Mint Token</button>
            <button onClick={checkBalance} className="p-4 m-2 bg-amber-500">Check Balance</button>
            <button onClick={sendToken} className="p-4 m-2 bg-red-500">Send Token</button>

            <div className="flex items-center justify-center mt-10">
                <div className="max-w-lg w-full p-6 bg-white rounded-lg shadow-lg">
                    <form>
                        <div className="mb-6">
                            <label htmlFor="text" className="block mb-2 text-lg font-bold text-gray-600">
                                Create Token:
                                <input type="text" name="createtOKEN" value={createTokenValue} className="
                                w-full px-4 py-2 border rounded-lg bg-white text-black focus:outline-none 
                                focus:ring-2 focus:ring-cyan-400" readOnly
                                />
                            </label>
                        </div>
                        <div className="mb-6">
                            <label htmlFor="text" className="block mb-2 text-lg font-bold text-gray-600">
                                Create Token Account:
                                <input type="text" name="createtOKEN" value={createTokenAccount} className="
                                w-full px-4 py-2 border rounded-lg bg-white text-black focus:outline-none 
                                focus:ring-2 focus:ring-cyan-400" readOnly
                                />
                            </label>

                        </div>
                        <div className="mb-6">
                            <label htmlFor="text" className="block mb-2 text-lg font-bold text-gray-600">
                                Mint Signature:
                                <input type="text" name="createtOKEN" value={mintSignature} className="
                                w-full px-4 py-2 border rounded-lg bg-white text-black focus:outline-none 
                                focus:ring-2 focus:ring-cyan-400" readOnly
                                />
                            </label>

                        </div>
                        <div className="mb-6">
                            <label htmlFor="text" className="block mb-2 text-lg font-bold text-gray-600">
                                Supply Of Token:
                                <input type="text" name="createtOKEN" value={checkSupplyToken?.toString() || ''} className="
                                w-full px-4 py-2 border rounded-lg bg-white text-black focus:outline-none 
                                focus:ring-2 focus:ring-cyan-400" readOnly
                                />
                            </label>

                        </div>
                        <div className="mb-6">
                            <label htmlFor="text" className="block mb-2 text-lg font-bold text-gray-600">
                                Amount Of Token Left:
                                <input type="text" name="createtOKEN" value={amountOfToken?.toString() || ''} className="
                                w-full px-4 py-2 border rounded-lg bg-white text-black focus:outline-none 
                                focus:ring-2 focus:ring-cyan-400" readOnly
                                />
                            </label>

                        </div>
                        <div className="mb-6">
                            <label htmlFor="text" className="block mb-2 text-lg font-bold text-gray-600">
                                ToTokenAccount:
                                <input type="text" name="createtOKEN" value={toTokenAccountVal?.toString() || ''} className="
                                w-full px-4 py-2 border rounded-lg bg-white text-black focus:outline-none 
                                focus:ring-2 focus:ring-cyan-400" readOnly
                                />
                            </label>

                        </div>
                        <div className="mb-6">
                            <label htmlFor="text" className="block mb-2 text-lg font-bold text-gray-600">
                                Transfer Signature:
                                <input type="text" name="createtOKEN" value={transferSignature} className="
                                w-full px-4 py-2 border rounded-lg bg-white text-black focus:outline-none 
                                focus:ring-2 focus:ring-cyan-400" readOnly
                                />
                            </label>

                        </div>
                    </form>
                </div>
            </div>

        </div>
    )
}
