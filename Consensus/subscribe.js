import {
    TopicCreateTransaction,
    Client,
    Wallet,
    TopicMessageQuery,
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

const topicId = process.env.TOPIC_ID;
  
  const client = Client.forTestnet();
  client.setOperator(myAccountId, myPrivateKey);
  
  const walletUser = new Wallet(myAccountId, myPrivateKey);
  const walletUser2 = new Wallet(myAccountId2, myPrivateKey2);
  
  async function subscribeTopic() {
    new TopicMessageQuery()
      .setTopicId(topicId)
      .setStartTime(0)
      .subscribe(client, (message) =>
        console.log(Buffer.from(message.contents, 'utf8').toString())
      );
  }
  
  subscribeTopic();