const HELP = `Please run this script in the following format:
    node stake_ref.js account_id amount
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

main(process.argv[2]);

async function main(deployerAccount) {
    const near = await connect({ ...config, keyStore });
    const deployer = await near.account(deployerAccount);
    const XTOKEN = await initializeXToken(deployer, CONTRACTS.xToken);
    await XTOKEN.unstake( {
        args: {
            amount: process.argv[3],
        },
        gas: "100000000000000",
        amount: "1"
    });
}

async function initializeXToken(deployer, xToken) {
    const XTOKEN = new Contract(
        deployer,
        xToken,
        {
            viewMethods: [ ],
            changeMethods: [ "unstake" ],
            sender: deployer
        }
    );
    return XTOKEN;
}