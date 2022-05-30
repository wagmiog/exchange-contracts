const HELP = `Please run this script in the following format:
    node change_state.js owner state
`;
const { connect, KeyPair, keyStores, utils, WalletConnection, Contract } = require("near-api-js");
const fs = require("fs")
const path = require("path");
const homedir = require("os").homedir();
const { CONTRACTS, OWNER, MINTER, FEES, TESTTOKEN } = require("../../nearConfig");
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

if (process.argv.length !== 4) {
  console.info(HELP);
  process.exit(1);
}

main(process.argv[2]);

async function main(deployerAccount) {
    const near = await connect({ ...config, keyStore });
    const deployer = await near.account(deployerAccount);
    await checkIfFullAccess([ deployer ]);
    const EXCHANGE = await initializeExchange(deployer, CONTRACTS.exchange);
    await EXCHANGE.change_state({
        args: {
            state: process.argv[3],
        },
        amount: "1",
    });
    console.log("State :", await EXCHANGE.metadata().state)
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

async function initializeExchange(deployer, exchange) {
    const EXCHANGE = new Contract(
        deployer,
        exchange,
        {
            viewMethods: [ "metadata" ],
            changeMethods: [ "change_state" ],
            sender: deployer
        }
    );
    return EXCHANGE;
}