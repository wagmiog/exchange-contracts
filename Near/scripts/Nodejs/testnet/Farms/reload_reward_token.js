const HELP = `Please run this script in the following format:
    node reload_reward_token.js deployer farm_id amount
`;

const { connect, KeyPair, keyStores, utils, WalletConnection, Contract } = require("near-api-js");
const fs = require("fs")
const path = require("path");
const homedir = require("os").homedir();
const { CONTRACTS, OWNER, MINTER, FEES, TESTTOKEN, FARMS } = require("../../nearConfig");
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

if (process.argv.length !== 5) {
    console.info(HELP);
    process.exit(1);
  }

main(process.argv[2]);

async function main(deployerAccount) {
    const near = await connect({ ...config, keyStore });
    const deployer = await near.account(deployerAccount);
    await checkIfFullAccess([ deployer ]);
    const FARMING = await initializeFarming(deployer, CONTRACTS.farming);
    await loadRewardToken(deployer, FARMING, process.argv[3] , process.argv[4]);
}

async function loadRewardToken(deployer, FARMING, farmId, rewardAmount) {
    const farm = await FARMING.get_farm({ farm_id: farmId});
    const TOKEN = new Contract(
        deployer,
        farm.reward_token,
        {
            viewMethods: [ "ft_metadata", "storage_balance_of" ],
            changeMethods: [ "ft_transfer_call", "storage_deposit" ],
            sender: deployer
        }
    );
    if (await TOKEN.storage_balance_of({account_id: FARMING.contractId}) === null) {
        await TOKEN.storage_deposit(
          {
            account_id: FARMING.contractId,
            registration_only: false
          },
          "100000000000000",
          "10000000000000000000000"
        );
    }
    await TOKEN.ft_transfer_call(
        {
            receiver_id: FARMING.contractId,
            amount: rewardAmount,
            msg: "{\"Reward\":{\"farm_id\":\"" + farmId + "\"}}"
        },
        "100000000000000",
        "1"
    )
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

async function initializeFarming(deployer, farming) {
    const FARMING = new Contract(
        deployer,
        farming,
        {
            viewMethods: [ "get_metadata", "get_farm" ],
            changeMethods: [ "create_simple_farm" ],
            sender: deployer
        }
    );
    return FARMING;
}