const HELP = `Please run this script in the following format:
    node deployer stable1.testnet stable2.testnet stable3.testnet ...
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
    await checkIfOwnerOrGuardians(EXCHANGE);
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
    EXCHANGE.add_stable_swap_pool(
        {
            tokens: accounts,
            decimals: decimals,
            amp_factor: 100000
        },
        "100000000000000",
        "100000000000000000000000"
    );
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


async function checkIfOwnerOrGuardians(deployer, EXCHANGE) {
    if(deployer != await EXCHANGE.get_owner() && deployer != await EXCHANGE.get_guardians()) {
        console.log("Need to be guardian or owner");
        process.exit(1);
    }
    return ;
}

async function initializeExchange(deployer, exchange) {
    const EXCHANGE = new Contract(
        deployer,
        exchange,
        {
            viewMethods: [ "get_owner", "get_guardians" ],
            changeMethods: [ "add_stable_swap_pool" ],
            sender: deployer
        }
    );
    return EXCHANGE;
}