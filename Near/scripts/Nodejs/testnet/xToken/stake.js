const HELP = `Please run this script in the following format:
    node stake.js account.testnet amount
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

main(process.argv[2]);

async function main(deployerAccount) {
    const near = await connect({ ...config, keyStore });
    const deployer = await near.account(deployerAccount);
    const XTOKEN = await initializeXToken(deployer, CONTRACTS.xToken);
    const TOKEN = await initializeToken(deployer, CONTRACTS.token);
    if (await XTOKEN.storage_balance_of({account_id: deployerAccount}) === null) {
        await XTOKEN.storage_deposit(
          {
            account_id: deployerAccount,
            registration_only: false
          },
          "100000000000000",
          "10000000000000000000000"
        );
    }
    await TOKEN.ft_transfer_call({ 
        args: {
            receiver_id: CONTRACTS.xToken,
            amount: process.argv[3],
            msg: ""
        },
        gas: "100000000000000",
        amount: "1"
     })
}

async function initializeToken(deployer, Token) {
    const TOKEN = new Contract(
        deployer,
        Token,
        {
            viewMethods: [ ],
            changeMethods: [ "ft_transfer_call" ],
            sender: deployer
        }
    );
    return TOKEN;
}

async function initializeXToken(deployer, xToken) {
    const XTOKEN = new Contract(
        deployer,
        xToken,
        {
            viewMethods: [ "get_virtual_price", "storage_balance_of" ],
            changeMethods: [ "storage_deposit" ],
            sender: deployer
        }
    );
    return XTOKEN;
}