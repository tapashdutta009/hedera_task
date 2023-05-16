import {
  TopicCreateTransaction,
  Client,
  Wallet,
  PrivateKey,
  TopicMessageQuery,
} from '@hashgraph/sdk';
import dotenv from 'dotenv';

// env config
dotenv.config();

import { setEnvValue } from '../helper.js';

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

async function createTopic() {
  let transaction = new TopicCreateTransaction()
    .setSubmitKey(walletUser.publicKey)
    .setAdminKey(walletUser.publicKey)
    .setTopicMemo('Chain group');

  console.log(
    `Created a new TopicCreateTransaction with admin and submit key both set to: ${walletUser.publicKey}`
  );

  let txResponse = await transaction.execute(client);
  let receipt = await txResponse.getReceipt(client);

  let topicId = receipt.topicId;
  console.log(`Your topic ID is: ${topicId}`);

  setEnvValue(`TOPIC_ID`, topicId);

  await new Promise((resolve) => setTimeout(resolve, 5000));
}

createTopic();