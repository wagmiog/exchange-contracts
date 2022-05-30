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

main("0.testnet");

async function main(deployerAccount) {
    const near = await connect({ ...config, keyStore });
    const deployer = await near.account(deployerAccount);
    const FARMING = await initializeFarming(deployer, CONTRACTS.farming);
    const numberOfFarms = await FARMING.get_number_of_outdated_farms();
    const farms = await FARMING.list_outdated_farms(
        {
            from_index: 0,
            limit: numberOfFarms
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
            viewMethods: [ "list_outdated_farms", "get_number_of_outdated_farms" ],
            changeMethods: [ ],
            sender: deployer
        }
    );
    return FARMING;
}