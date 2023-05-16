import { 
    Client, 
    Hbar, 
    PrivateKey, 
    TransferTransaction
} from '@hashgraph/sdk';
import dotenv from 'dotenv';

// env config
dotenv.config();

// get and prepare credentials
const myAccountId = process.env.NEW_ACCOUNT_ID1;
const myPrivateKey = process.env.NEW_PRIVATE_KEY1 ? PrivateKey.fromString(process.env.NEW_PRIVATE_KEY1) : null;

// check credentials
if(myAccountId == null || myPrivateKey == null){
    throw new Error("Environment variables myAccountId and myPrivateKey must be present");
}

// get and prepare credentials for supplier
const newAccountId2 = process.env.NEW_ACCOUNT_ID2;
const newPrivateKey2 = process.env.NEW_PRIVATE_KEY2 ? PrivateKey.fromString(process.env.NEW_PRIVATE_KEY2) : null;

// get and prepare credentials for supplier
const newAccountId3 = process.env.NEW_ACCOUNT_ID3;
const newPrivateKey3 = process.env.NEW_PRIVATE_KEY3 ? PrivateKey.fromString(process.env.NEW_PRIVATE_KEY3) : null;

// get and prepare credentials for supplier
const newAccountId4 = process.env.NEW_ACCOUNT_ID4;
const newPrivateKey4 = process.env.NEW_PRIVATE_KEY4 ? PrivateKey.fromString(process.env.NEW_PRIVATE_KEY4) : null;

// check supplier credentials
if (newAccountId2 == null || newPrivateKey2 == null ) {
    throw new Error("Environment variables newAccountId2 and newPrivateKey2 must be present");
}

// create a Hedera test network
const client = Client.forTestnet();
client.setOperator(myAccountId, myPrivateKey);

async function transferTransaction(){

    try {
        const transferTransaction = new TransferTransaction()
        .addHbarTransfer(myAccountId, new Hbar(-20))
        .addHbarTransfer(newAccountId2, new Hbar(20));

        //Submit the transaction to a Hedera network
        const txResponse = await transferTransaction.execute(client);

        //Request the receipt of the transaction
        const receipt = await txResponse.getReceipt(client);

        //Get the transaction consensus status
        const transactionStatus = receipt.status;

        console.log("The transaction consensus status is " +transactionStatus.toString());
    } catch (error) {
        const err = new Error(error);
        const formatMsg = JSON.parse(err.message);
        console.log(`Something went wrong, the status is ${formatMsg.status}`);
        console.log(formatMsg);
    }
    

    process.exit();
}

transferTransaction();