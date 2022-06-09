const HELP = `Please run this script in the following format:
    node get_pool_shares.js pool_id account_id
`;

const { connect, KeyPair, keyStores, utils, WalletConnection, Contract } = require("near-api-js");
const fs = require("fs")
const path = require("path");
const homedir = require("os").homedir();
const { CONTRACTS, OWNER, MINTER, FEES } = require("../../../nearConfig");
const { exchangeConst, farmingConst, tokenConst, xTokenConst } = require("../../../constants-testnet");
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

main(process.argv[3]);

async function main(deployerAccount) {
    const near = await connect({ ...config, keyStore });
    const deployer = await near.account(deployerAccount);
    const EXCHANGE = await initializeExchange(deployer, CONTRACTS.exchange);
    console.log(await EXCHANGE.get_pool_shares({
        pool_id: parseInt(process.argv[2]),
        account_id: process.argv[3]
    }));
}

async function initializeExchange(deployer, exchange) {
    const EXCHANGE = new Contract(
        deployer,
        exchange,
        {
            viewMethods: [ "get_pool_shares" ],
            changeMethods: [ ],
            sender: deployer
        }
    );
    return EXCHANGE;
}