import { 
    Client, 
    PrivateKey,
    ScheduleCreateTransaction,
    TransferTransaction, 
    ScheduleSignTransaction,
    ScheduleInfoQuery, 
    Hbar
} from '@hashgraph/sdk';
import dotenv from 'dotenv';
import { setEnvValue } from '../helper.js';

const myAccountId = process.env.NEW_ACCOUNT_ID1;
const myPrivateKey = PrivateKey.fromString(process.env.NEW_PRIVATE_KEY1);

const account2Id = process.env.NEW_ACCOUNT_ID2;
const account2PrivateKey =  PrivateKey.fromString(process.env.NEW_PRIVATE_KEY2);

const client = Client.forTestnet();
client.setOperator(myAccountId, myPrivateKey);

async function scheduleTransaction(){
//Create a transaction to schedule
const transaction = new TransferTransaction()
     .addHbarTransfer(myAccountId,new Hbar(-10))
     .addHbarTransfer(account2Id,new Hbar(10));

const scheduleTransaction = await new ScheduleCreateTransaction()
     .setScheduledTransaction(transaction)
     .setScheduleMemo("Scheduled TX 2!")
    //  .setAdminKey(myPrivateKey)
     .execute(client);

 //Get the receipt of the transaction
 const receipt = await scheduleTransaction.getReceipt(client);

 //Get the schedule ID
 const scheduleId = receipt.scheduleId;
 console.log("The schedule ID is " +scheduleId);

 //Get the scheduled transaction ID
 const scheduledTxId = receipt.scheduledTransactionId;
 console.log("The scheduled transaction ID is " +scheduledTxId);
 setEnvValue(`SCHEDULE_ID`, receipt.accountId);

}

scheduleTransaction();

// scheduleTransaction()
signScheduledTX("0.0.10569703")

