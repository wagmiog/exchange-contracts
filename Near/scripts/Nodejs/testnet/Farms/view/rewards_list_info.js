const HELP = `Please run this script in the following format:
    node get_pools.js from_index limit
`;

const { connect, KeyPair, keyStores, utils, WalletConnection, Contract } = require("near-api-js");
const fs = require("fs")
const path = require("path");
const homedir = require("os").homedir();
const { CONTRACTS, OWNER, MINTER, FEES, TESTTOKEN } = require("../../../nearConfig");
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

main("0.testnet");

async function main(deployerAccount) {
    const near = await connect({ ...config, keyStore });
    const deployer = await near.account(deployerAccount);
    const FARMING = await initializeFarming(deployer, CONTRACTS.farming);
    const farms = await FARMING.list_rewards_info(
        {
            from_index: parseInt(process.argv[2]), 
            limit: parseInt(process.argv[3])
        }
    );
    for(i = 0; i < farms.length; i++) {
        console.log(farms[i])
        console.log("----------------------------------------------")
    }
}

async function initializeFarming(deployer, farming) {
    const FARMING = new Contract(
        deployer,
        farming,
        {
            viewMethods: [ "list_rewards_info" ],
            changeMethods: [ ],
            sender: deployer
        }
    );
    return FARMING;
}