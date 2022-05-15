const HELP = `Please run this script in the following format:
    node deployer
`;

const { connect, KeyPair, keyStores, utils, WalletConnection, Contract } = require("near-api-js");
const fs = require("fs")
const path = require("path");
const homedir = require("os").homedir();
const { CONTRACTS, OWNER, MINTER, FEES, TESTTOKEN, STAKING } = require("../../nearConfig");
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
    const XTOKEN = await initializeXToken(deployer, CONTRACTS.xToken);
    await checkIfOwner(XTOKEN);
    await XTOKEN.modify_reward_per_sec(
        {
            reward_per_sec: STAKING.reward_per_sec,
            distribute_before_change: STAKING.distribute_before_change
        },
        "100000000000000"
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


async function checkIfOwner(deployer, XTOKEN) {
    if(deployer != await XTOKEN.get_owner()) {
        console.log("Need to be owner");
        process.exit(1);
    }
    return ;
}

async function initializeXToken(deployer, xToken) {
    const XTOKEN = new Contract(
        deployer,
        xToken,
        {
            viewMethods: [ "get_owner" ],
            changeMethods: [ "reset_reward_genesis_time_in_sec", "modify_reward_per_sec" ],
            sender: deployer
        }
    );
    return XTOKEN;
}