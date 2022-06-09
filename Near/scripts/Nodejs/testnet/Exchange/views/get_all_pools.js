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

main("0.testnet");

async function main(deployerAccount) {
    const near = await connect({ ...config, keyStore });
    const deployer = await near.account(deployerAccount);
    const EXCHANGE = await initializeExchange(deployer, CONTRACTS.exchange);
    const numberOfPools = await EXCHANGE.get_number_of_pools();
    console.log(await EXCHANGE.get_pools(
        {
            from_index: 0, 
            limit: numberOfPools
        }
    ));
}

async function initializeExchange(deployer, exchange) {
    const EXCHANGE = new Contract(
        deployer,
        exchange,
        {
            viewMethods: [ "get_pools", "get_number_of_pools" ],
            changeMethods: [ ],
            sender: deployer
        }
    );
    return EXCHANGE;
}