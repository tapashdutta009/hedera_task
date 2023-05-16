import { 
    Client, 
    ContractCreateTransaction, 
    ContractFunctionParameters, 
    FileCreateTransaction, 
    PrivateKey
    
} from '@hashgraph/sdk';
import dotenv from 'dotenv';
import { setEnvValue } from '../../helper.js';
import compliedContract from '../contract/CertificationC1.json' assert {type: 'json'};

// env config
dotenv.config();

// get and prepare credentials
const myAccountId = process.env.NEW_ACCOUNT_ID1;
const myPrivateKey = process.env.NEW_PRIVATE_KEY1 ? PrivateKey.fromString(process.env.NEW_PRIVATE_KEY1) : null;

// check credentials
if(myAccountId == null || myPrivateKey == null){
    throw new Error("Environment variables myAccountId and myPrivateKey must be present");
}

// create a Hedera test network
const client = Client.forTestnet();
client.setOperator(myAccountId, myPrivateKey);

async function deployContract(){
    const byteCode = compliedContract.bytecode;
    //console.log(byteCode);

    //Create a file on Hedera and store the hex-encoded bytecode
    const fileCreateTx = new FileCreateTransaction()
        .setContents(byteCode);

    //Submit the file to the Hedera test network signing with the transaction fee payer key specified with the client
    const submitTx = await fileCreateTx.execute(client);

    //Get the receipt of the file create transaction
    const fileReceipt = await submitTx.getReceipt(client);

    //Get the file ID from the receipt
    const bytecodeFileId = fileReceipt.fileId;

    //Log the file ID
    console.log("The smart contract byte code file ID is " + bytecodeFileId)

    // Instantiate the contract instance
    const contractTx = new ContractCreateTransaction()
        .setBytecodeFileId(bytecodeFileId)
        .setGas(100000)
        .setConstructorParameters(new ContractFunctionParameters().addString("Hello from Indusnet!"));

    //Submit the transaction to the Hedera test network
    const contractResponse = await contractTx.execute(client);

    //Get the receipt of the file create transaction
    const contractReceipt = await contractResponse.getReceipt(client);

    //Get the smart contract ID
    const newContractId = contractReceipt.contractId;

    setEnvValue('SMART_CONTRACT_ID', newContractId);

    //Log the smart contract ID
    console.log("The smart contract ID is " + newContractId);

    process.exit();
}

deployContract();