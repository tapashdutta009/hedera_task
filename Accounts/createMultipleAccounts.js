import { 
    Client, 
    Hbar, 
    PrivateKey, 
    AccountCreateTransaction 
} from '@hashgraph/sdk';
import dotenv from 'dotenv';
import { setEnvValue } from '../helper.js';

// env config
dotenv.config();

// get and prepare credentials
const myAccountId = process.env.MY_ACCOUNT_ID;
const myPrivateKey = process.env.MY_PRIVATE_KEY ? PrivateKey.fromString(process.env.MY_PRIVATE_KEY) : null;

// check credentials
if(myAccountId == null || myPrivateKey == null){
    throw new Error("Environment variables myAccountId and myPrivateKey must be present");
}

// create a Hedera test network
const client = Client.forTestnet();
client.setOperator(myAccountId, myPrivateKey);

// Generate 5 accounts
async function createMultipleAccounts() {
    const initialBalance = 1000;

    try {
        for (let x = 1; x < 6; x++) {
            const accountPrivateKey = PrivateKey.generateED25519();
            const response = await new AccountCreateTransaction()
            .setInitialBalance(new Hbar(initialBalance))
            .setKey(accountPrivateKey)
            .execute(client);
            const receipt = await response.getReceipt(client);
    
            setEnvValue(`NEW_ACCOUNT_ID${x}`, receipt.accountId);
            setEnvValue(`NEW_PRIVATE_KEY${x}`, accountPrivateKey);
            console.log(`Newly created account ID: ${receipt.accountId} and private key is: ${accountPrivateKey}`);
        }
    } catch (error) {
        const err = new Error(error);
        const formatErr = JSON.parse(err.message);
        console.log(`Error Status: ${formatErr.status} \n`);
        console.log(formatErr.message);
    }
    
    process.exit();
}

createMultipleAccounts();