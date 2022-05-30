const HELP = `Please run this script in the following format:
    node add_liquidity.js deployer pool_id amount1 amount2
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

let amounts = [];
for (let i = 4; process.argv.length > i; i++) {
    amounts.push(process.argv[i]);
}

const config = {
  keyStore,
  networkId: "testnet",
  nodeUrl: "https://rpc.testnet.near.org",
};

if (process.argv.length !== 6) {
  console.info(HELP);
  process.exit(1);
}

main(process.argv[2]);

async function main(deployerAccount) {
    const near = await connect({ ...config, keyStore });
    const deployer = await near.account(deployerAccount);
    await checkIfFullAccess([ deployer ]);
    const EXCHANGE = await initializeExchange(deployer, CONTRACTS.exchange);
    const pool = await EXCHANGE.get_pool(
        {
            pool_id: parseInt(process.argv[3])
        }
    );
    await storage(deployer, pool.token_account_ids[0], CONTRACTS.exchange, EXCHANGE)
    await storage(deployer, pool.token_account_ids[1], CONTRACTS.exchange, EXCHANGE)
    await transferCall(deployer, pool.token_account_ids[0], CONTRACTS.exchange, amounts[0])
    await transferCall(deployer, pool.token_account_ids[1], CONTRACTS.exchange, amounts[1])
    await EXCHANGE.add_liquidity({
        args: {
            pool_id: parseInt(process.argv[3]),
            amounts: amounts
        },
        amount: "790000000000000000000",
    });
    console.log("Liquidity has been added");
}
async function transferCall(deployer, tokenId, to, amount) {
    const TOKEN = await initializeToken(deployer, tokenId);
    await TOKEN.ft_transfer_call({
        args: {
            receiver_id: to,
            amount: amount,
            msg: ""
        },
        gas: "300000000000000",
        amount: "1"
    })

}

async function storage(deployer, tokenId, to, EXCHANGE) {
    const TOKEN = await initializeToken(deployer, tokenId);
    if (await TOKEN.storage_balance_of({account_id: to}) === null) {
        await TOKEN.storage_deposit(
          {
            account_id: to,
            registration_only: true
          },
          "100000000000000",
          "10000000000000000000000"
        );
        await EXCHANGE.register_tokens({
            args: {
                token_ids: [tokenId]
            },
            gas: "300000000000000",
            amount: "1"
        })
    }
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
            viewMethods: [ "metadata", "get_pool" ],
            changeMethods: [ "add_liquidity", "register_tokens" ],
            sender: deployer
        }
    );
    return EXCHANGE;
}

async function initializeToken(deployer, token) {
    const TOKEN = new Contract(
        deployer,
        token,
        {
          viewMethods: [ "storage_balance_of" ],
          changeMethods: ["storage_deposit", "ft_transfer_call" ],
          sender: deployer
        }
    );
    return TOKEN;
}
