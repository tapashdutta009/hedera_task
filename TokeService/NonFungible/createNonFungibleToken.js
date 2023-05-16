import { 
    Client, 
    PrivateKey, 
    TokenCreateTransaction, 
    TokenInfoQuery, 
    TokenSupplyType, 
    TokenType,
    Wallet,
    
} from '@hashgraph/sdk';
import dotenv from 'dotenv';
import { setEnvValue } from '../../helper.js';

// env config
dotenv.config();

// get and prepare credentials
const newAccountId1 = process.env.NEW_ACCOUNT_ID1;
const newPrivateKey1 = process.env.NEW_PRIVATE_KEY1 ? PrivateKey.fromString(process.env.NEW_PRIVATE_KEY1) : null;

// check credentials
if(newAccountId1 == null || newPrivateKey1 == null){
    throw new Error("Environment variables newAccountId1 and newPrivateKey1 must be present");
}

// create a Hedera test network
const client = Client.forTestnet();
client.setOperator(newAccountId1, newPrivateKey1);

async function createNFT() {
    try {
        const feeDetails = new CustomRoyaltyFee()
            .setNumerator(10)
            .setDenominator(100)
            .setFeeCollectorAccountId(account2Id)
            .setFallbackFee(new CustomFixedFee().setHbarAmount(new Hbar(200)));

        const createNFTTransaction = await new TokenCreateTransaction()
            .setTokenName("Online Adavnture Game")
            .setTokenSymbol("OAG")
            .setTokenType(TokenType.NonFungibleUnique)
            .setDecimals(0)
            .setInitialSupply(0)
            .setMaxSupply(5)
            //.setCustomFees([feeDetails]) this one giving error
            .setTreasuryAccountId(newAccountId1)
            .setSupplyType(TokenSupplyType.Finite)
            .setSupplyKey(newPrivateKey1)
            .freezeWith(client);

        //Sign the transaction with the treasury key
        let nftCreateTxSign = await createNFTTransaction.sign(newPrivateKey1);

        //Submit the transaction to a Hedera network
        let nftCreateSubmit = await nftCreateTxSign.execute(client);

        //Get the transaction receipt
        let nftCreateRx = await nftCreateSubmit.getReceipt(client);

        //Get the token ID
        let tokenId = nftCreateRx.tokenId;

        //Log the token ID
        console.log(`Created NFT with Token ID: ${tokenId}`);

        // Set token value in env file
        setEnvValue(`NFT_ID`, tokenId);
    } catch (error) {
        const err = new Error(error);
        const formatErr = JSON.parse(err.message);
        console.log(`Error Status: ${formatErr.status} \n`);
        console.log(formatErr.message);
    }

    process.exit();
}

createNFT();