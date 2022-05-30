const HELP = `Please run this script in the following format:
    node deposit_farm.js deployer pool_id amount 
`;

const { connect, KeyPair, keyStores, utils, WalletConnection, Contract } = require("near-api-js");
const fs = require("fs")
const path = require("path");
const homedir = require("os").homedir();
const { CONTRACTS, OWNER, MINTER, FEES, TESTTOKEN, FARMS } = require("../../nearConfig");
const { exchangeConst, farmingConst, tokenConst, xTokenConst } = require("../../constants-testnet");
const { functionCall } = require("near-api-js/lib/transaction");

const CREDENTIALS_DIR = ".near-credentials";
const credentialsPath = path.join(homedir, CREDENTIALS_DIR);
const keyStore = new keyStores.UnencryptedFileSystemKeyStore(credentialsPath);

const config = {
  keyStore,
  networkId: "testnet",
  nodeUrl: "https://rpc.testnet.near.org",
};

main(process.argv[2]);

async function main(deployerAccount) {
    const near = await connect({ ...config, keyStore });
    const deployer = await near.account(deployerAccount);
    await checkIfFullAccess([ deployer ]);
    const FARMING = await initializeFarming(deployer, CONTRACTS.farming);
    const EXCHANGE = await initializeExchange(deployer, CONTRACTS.exchange);
    if (await FARMING.storage_balance_of({account_id: deployerAccount}) === null) {
        await FARMING.storage_deposit(
          {
            account_id: deployerAccount,
            registration_only: false
          },
          "100000000000000",
          "10000000000000000000000"
        );
    }
    await EXCHANGE.mft_transfer_call({
        args: {
            receiver_id: CONTRACTS.farming,
            token_id: ":" + process.argv[3],
            amount: process.argv[4],
            msg: "",
        }
    })

    
}

async function checkIfFullAccess(contractsAccounts) {
    for (let i = 0; i < contractsAccounts.length; i++) {
      let contractAccount = await contractsAccounts[i].findAccessKey();
      if (await contractAccount === null) {
        console.log("⚠️", await contractsAccounts[i].accountId, "need access Key ⚠️");
        process.exit(1);
      } else if (contractAccount.accessKey.permission !== "FullAccess") {
        console.log("⚠️", await contractsAccounts[i].accountId, "need FULL access Key ⚠️");
        process.exit(1);
      }
    }
    console.log("Full Access Key ✅");
}

async function initializeFarming(deployer, farming) {
    const FARMING = new Contract(
        deployer,
        farming,
        {
            viewMethods: [ "storage_balance_of" ],
            changeMethods: [ "create_simple_farm", "storage_deposit" ],
            sender: deployer
        }
    );
    return FARMING;
}

async function initializeExchange(deployer, exchange) {
    const EXCHANGE = new Contract(
        deployer,
        exchange,
        {
            viewMethods: [ ],
            changeMethods: [ "mft_transfer_call" ],
            sender: deployer
        }
    );
    return EXCHANGE;
}