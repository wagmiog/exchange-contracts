const HELP = `Please run this script in the following format:
    node nPngMint.js minter.testnet amount receiver
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

let accounts = [];
for (let i = 3; process.argv.length > i; i++) {
    accounts.push(process.argv[i]);
}


if (process.argv.length !== 5) {
    console.info(HELP);
    process.exit(1);
}

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
    await storageAndMint(near, deployer, CONTRACTS.token);
}

async function storageAndMint(near, deployer, token) {
    const receiver = process.argv[4];
    const TOKEN = new Contract(
        deployer,
        token,
        {
            viewMethods: [ "ft_metadata", "storage_balance_of" ],
            changeMethods: [ "mint", "storage_deposit" ],
            sender: deployer
        }
    );
    if (await TOKEN.storage_balance_of({account_id: receiver}) === null) {
        await TOKEN.storage_deposit(
            {
                account_id: receiver,
                registration_only: true
            },
            "100000000000000",
            "10000000000000000000000"
        );
    }
    await TOKEN.mint(
        {
            account_id: receiver,
            amount: process.argv[3]
        },
    );
    console.log(TOKEN.contractId, "has been distribute");
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
