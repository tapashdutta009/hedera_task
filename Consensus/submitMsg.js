import {
    TopicCreateTransaction,
    Client,
    Wallet,
    TopicMessageQuery,
    TopicMessageSubmitTransaction,
    TopicInfoQuery,
    PrivateKey,
  } from '@hashgraph/sdk';
  import dotenv from 'dotenv';
  
  // env config
  dotenv.config();
  
  const myAccountId = process.env.NEW_ACCOUNT_ID1;
  const myPrivateKey = PrivateKey.fromString(
    process.env.NEW_PRIVATE_KEY1
  );
  
  const myAccountId2 = process.env.NEW_ACCOUNT_ID2;
  const myPrivateKey2 = PrivateKey.fromString(
    process.env.NEW_PRIVATE_KEY2
  );
  
  const client = Client.forTestnet();
  client.setOperator(myAccountId, myPrivateKey);

  const walletUser = new Wallet(myAccountId, myPrivateKey);
const walletUser2 = new Wallet(myAccountId2, myPrivateKey2);

const topicId = process.env.TOPIC_ID;

async function submitMessage() {
  let sendResponse = await new TopicMessageSubmitTransaction({
    topicId: topicId,
    message: new Date().toISOString(),
  }).execute(client);

  const getReceipt = await sendResponse.getReceipt(client);
  const transactionStatus = getReceipt.status;
  console.log('The message transaction status: ' + transactionStatus);

  process.exit();
}

submitMessage();