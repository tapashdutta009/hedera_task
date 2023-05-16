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

const scheduleId = process.env.SCHEDULE_ID;

const client = Client.forTestnet();
client.setOperator(myAccountId, myPrivateKey);

async function signScheduledTX() {
    const transaction = await new ScheduleSignTransaction()
      .setScheduleId(scheduleId)
      .freezeWith(client)
      .sign(account2PrivateKey);
  
    const txResponse = await transaction.execute(client);
  
    const receipt = await txResponse.getReceipt(client);
  
    const transactionStatus = receipt.status;
    console.log(
      'The transaction consensus status is ' + transactionStatus
    );
  
    process.exit();
  }

signScheduledTX();