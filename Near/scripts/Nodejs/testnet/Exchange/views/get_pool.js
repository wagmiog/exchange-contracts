const HELP = `Please run this script in the following format:
    node get_pools.js pool_id
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

if (process.argv.length !== 3) {
    console.info(HELP);
    process.exit(1);
}

main("0.testnet");

async function main(deployerAccount) {
    const near = await connect({ ...config, keyStore });
    const deployer = await near.account(deployerAccount);
    const EXCHANGE = await initializeExchange(deployer, CONTRACTS.exchange);
    if (await EXCHANGE.get_number_of_pools() <= parseInt(process.argv[2])) {
        console.log("INVALID POOL_ID")
        console.log("MAXIMUM ID:", await EXCHANGE.get_number_of_pools() - 1)
        process.exit(1);
    }
    const pool = await EXCHANGE.get_pool(
        {
            pool_id: parseInt(process.argv[2])
        }
    );
    const poolVolumes = await EXCHANGE.get_pool_volumes(
        {
            pool_id: parseInt(process.argv[2])
        }
    );
    console.log("Pool Kind:", "\x1b[32m" + pool.pool_kind);
    console.log("\x1b[37m" + "Tokens:", "\x1b[32m" + pool.token_account_ids);
    console.log("\x1b[37m" + "Amounts:", "\x1b[32m" + pool.amounts);
    console.log("\x1b[37m" + "Total fee:", "\x1b[32m" + pool.total_fee);
    console.log("\x1b[37m" + "Shares total supply:", "\x1b[32m" + pool.shares_total_supply);
    console.log("\x1b[37m" + "AMP:", "\x1b[32m" + pool.amp);
    console.log("\x1b[37m" + "Volumes:")
    for(i = 0; i < poolVolumes.length; i++) {
        console.log("   \x1b[34m" + pool.token_account_ids[i])
        console.log("       \x1b[37m" + "Input:", "\x1b[32m" + poolVolumes[i].input);
        console.log("       \x1b[37m" + "Output:", "\x1b[32m" + poolVolumes[i].output);
    }
}

async function initializeExchange(deployer, exchange) {
    const EXCHANGE = new Contract(
        deployer,
        exchange,
        {
            viewMethods: [ "get_pool", "get_number_of_pools", "get_pool_volumes" ],
            changeMethods: [ ],
            sender: deployer
        }
    );
    return EXCHANGE;
}