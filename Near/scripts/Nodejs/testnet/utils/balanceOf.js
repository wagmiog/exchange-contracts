const HELP = `Please run this script in the following format:
    node balanceOf.js AccountId tokenId 
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

if (process.argv.length !== 4) {
  console.info(HELP);
  process.exit(1);
}

main(process.argv[2]);

async function main(deployerAccount) {
    const near = await connect({ ...config, keyStore });
    const deployer = await near.account(deployerAccount);
    const TOKEN = await initializeExchange(deployer, process.argv[3]);
    const amount = await TOKEN.ft_balance_of({
        account_id: deployerAccount,
    });
    const metadata = await TOKEN.ft_metadata()
    console.log("With decimals:", amount)
    console.log("Without decimals:", amount / (10**metadata.decimals))

}

async function initializeExchange(deployer, exchange) {
    const EXCHANGE = new Contract(
        deployer,
        exchange,
        {
            viewMethods: [ "ft_balance_of", "ft_metadata" ],
            changeMethods: [ "add_liquidity" ],
            sender: deployer
        }
    );
    return EXCHANGE;
}