import { 
    AccountAllowanceApproveTransaction,
    Client, 
    Hbar, 
    PrivateKey, 
    ScheduleCreateTransaction,
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

// get and prepare credentials for other accounts
const otherAccountId2 = process.env.NEW_ACCOUNT_ID2;
const otherAccountId3 = process.env.NEW_ACCOUNT_ID3;
const otherAccountId4 = process.env.NEW_ACCOUNT_ID4;

// check supplier credentials
if (otherAccountId2 == null || otherAccountId3 == null  || otherAccountId4 == null) {
    throw new Error("Environment variables otherAccountId2, otherAccountId3 and otherAccountId4 must be present");
}

// create a Hedera test network
const client = Client.forTestnet();
client.setOperator(myAccountId, myPrivateKey);

async function approveAllowance(){
    const createAllowanceTransaction = new AccountAllowanceApproveTransaction()
        .approveHbarAllowance(myAccountId, otherAccountId2, Hbar.from(35))
        .freezeWith(client);

    try {
        //Sign the transaction with the owner account key
        const signTx = await createAllowanceTransaction.sign(myPrivateKey);

        //Sign the transaction with the client operator private key and submit to a Hedera network
        const txResponse = await signTx.execute(client);

        //Request the receipt of the transaction
        const receipt = await txResponse.getReceipt(client);

        //Get the transaction consensus status
        const transactionStatus = receipt.status;
        console.log("The transaction consensus status is " +transactionStatus.toString());
    } catch (error) {
        const err = new Error(error);
        const formatErr = JSON.parse(err.message);
        console.log(`Error Status: ${formatErr.status} \n`);
        console.log(formatErr.message);
    }

    process.exit();
}

approveAllowance();