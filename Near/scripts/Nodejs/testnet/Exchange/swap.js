const HELP = `Please run this script in the following format:
    node swap.js deployer pool_id token_in amount_in token_out 
`;
const { connect, KeyPair, keyStores, utils, WalletConnection, Contract } = require("near-api-js");
const fs = require("fs")
const path = require("path");
const homedir = require("os").homedir();
const { CONTRACTS, OWNER, MINTER, FEES } = require("../../nearConfig");
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

if (process.argv.length !== 7) {
  console.info(HELP);
  process.exit(1);
}

main(process.argv[2]);

async function main(deployerAccount) {
    const near = await connect({ ...config, keyStore });
    const deployer = await near.account(deployerAccount);
    await checkIfFullAccess([ deployer ]);
    const TOKEN = await initializeToken(deployer, process.argv[4]);
    const msg = "{\"force\": 0,\"actions\": [{\"pool_id\": "+ parseInt(process.argv[3]) +",\"token_in\": \""+ process.argv[4] +"\",\"amount_in\": \""+ process.argv[5] +"\",\"token_out\": \""+ process.argv[6] +"\",\"min_amount_out\": \"0\"}]}"
    await TOKEN.ft_transfer_call({
        args: {
            receiver_id: CONTRACTS.exchange,
            amount: process.argv[5],
            msg: msg
        },
        gas: "300000000000000",
        amount: "1"
    });
    console.log("Swap ✅");
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

async function initializeToken(deployer, token) {
    const TOKEN = new Contract(
        deployer,
        token,
        {
          viewMethods: [ "storage_balance_of" ],
          changeMethods: ["storage_deposit", "ft_transfer_call" ],
          sender: deployer
        }
    );
    return TOKEN;
}
