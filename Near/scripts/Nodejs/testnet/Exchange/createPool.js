const HELP = `Please run this script in the following format:
    node deployer token1.testnet token2.testnet
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
    const EXCHANGE = await initializeExchange(deployer, CONTRACTS.exchange);
    await createPool(deployer, EXCHANGE);
}

async function createPool(deployer, EXCHANGE) {
    let decimals = [];
    for (let i = 0; i < accounts.length; i++) {
        const token = new Contract(
            deployer,
            accounts[i],
            {
                viewMethods: [ "ft_metadata" ],
                changeMethods: [],
                sender: deployer
            }
        );
        const metadata = await token.ft_metadata();
        decimals.push(metadata.decimals);

    }
    const result = await EXCHANGE.add_simple_pool(
        {
            tokens: accounts,
        },
        "100000000000000",
        "100000000000000000000000"
    );
    console.log("PoolId :", result);
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
            viewMethods: [ "get_owner", "get_guardians" ],
            changeMethods: [ "add_simple_pool" ],
            sender: deployer
        }
    );
    return EXCHANGE;
}