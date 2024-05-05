import { clusterApiUrl, Connection, PublicKey, Keypair, LAMPORTS_PER_SOL} from "@solana/web3.js";
import {
    createMint,
    getOrCreateAssociatedTokenAccount,
    mintTo, transfer, Account,
    getMint, getAccount
} from "@solana/spl-token";
//import { Buffer } from 'buffer';

//window.Buffer = Buffer;

//Special setup to add a Buffer class
//window.Buffer = window.Buffer || require("buffer").Buffer;


export default function MinitToken() {
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed"); // url of solana network
    const fromWallet = Keypair.generate();
    let mint:PublicKey;
    let fromTokenAccount: Account;
    const toWallet = new PublicKey("6917dyPmByyGvoCawAqsnD4xy9h96exmB4cpN47u9oMo");


    async function createToken() {
        try {
            const fromAirdropSignature = await connection.requestAirdrop(fromWallet.publicKey, LAMPORTS_PER_SOL);
            await connection.confirmTransaction(fromAirdropSignature);

            // Create new Token Mint
            mint = await createMint(
                connection,
                fromWallet,
                fromWallet.publicKey,
                null,
                9 // 9 means we have a decimal of 9 zeros
            );
            console.log(`Create Token: ${mint.toBase58()}`);

            // Get the token account of the fromWallet address, and if it does not exist, create it
            fromTokenAccount = await getOrCreateAssociatedTokenAccount(
                connection,
                fromWallet,
                mint,
                fromWallet.publicKey
            );
            console.log(`Create Token Account: ${fromTokenAccount.address.toBase58()}`);
        } catch (error) {
            console.error(error);
        }
    }

    async function mintToken(){
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
    }

    async function checkBalance(){
        // get supply of token we have minted into existance
        const mintInfo =  await getMint(connection, mint);
               console.log(mintInfo.supply);

        //get the amount of token left in account
        const tokenAccountInfo =  await getAccount(connection, fromTokenAccount.address);
              console.log(tokenAccountInfo.amount);
    }

    async function sendToken() {
        //Get the token account of the wallet address, and if doesn't exit create it
        const toTokenAccount = await getOrCreateAssociatedTokenAccount(connection, fromWallet, mint, toWallet);
        console.log(`toTokenAccount: ${toTokenAccount.address}`);

        const signature = await transfer(
            connection,
            fromWallet,
            fromTokenAccount.address,
            toTokenAccount.address,
            fromWallet.publicKey,
            5000000000 //5 billion
        );
        console.log(`Transfer Signature: ${signature}`);
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

        </div>
    )
}
