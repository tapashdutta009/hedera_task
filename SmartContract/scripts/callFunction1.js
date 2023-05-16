import { 
    Client,
    FileCreateTransaction,
    ContractCreateTransaction,
    PrivateKey,
    ContractFunctionParameters,
    ContractCallQuery,
    ContractExecuteTransaction,
    Hbar    
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

const smartContract = process.env.SMART_CONTRACT_ID;

// create a Hedera test network
const client = Client.forTestnet();
client.setOperator(myAccountId, myPrivateKey);

  
  async function function1(smartContract) {
    const contractExecTx = await new ContractExecuteTransaction()
      //Set the ID of the contract
      .setContractId(smartContract)
      //Set the gas for the contract call
      .setGas(100000)
      //Set the contract function to call
      .setFunction(
        'function1',
        new ContractFunctionParameters().addUint16(4).addUint16(3)
      );
  
    //Submit the transaction to a Hedera network and store the response
    const submitExecTx = await contractExecTx.execute(client);
  
    //Get the receipt of the transaction
    const receipt2 = await submitExecTx.getReceipt(client);
  
    //Confirm the transaction was executed successfully
    console.log(
      'The transaction status is ' + receipt2.status.toString(),
      receipt2
    );

    process.exit();
  }

  function1();
  
  