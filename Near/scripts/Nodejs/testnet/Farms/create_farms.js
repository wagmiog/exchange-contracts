const HELP = `Please run this script in the following format:
    node create_farms.js owner.testnet
    You can param this script with nearConfig.js
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

if (process.argv.length !== 2) {
    console.info(HELP);
    process.exit(1);
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
    const FARMING = await initializeFarming(deployer, CONTRACTS.farming);
    await checkIfOwner(deployerAccount, FARMING);
    for(let i = 0; i < FARMS.length; i++) {
        const farmId = await FARMING.create_simple_farm(
            {
                args: {
                    "terms":
                    {
                        "seed_id": CONTRACTS.exchange + "@" + FARMS[i].poolId,
                        "reward_token": FARMS[i].rewardToken,
                        "start_at": FARMS[i].start_at,
                        "reward_per_session": FARMS[i].reward_per_session,
                        "session_interval": FARMS[i].session_interval,
                    },
                },
                gas: "300000000000000",
                amount: "1"
            }
        )
        if (FARMS[i].amountRewardToken !== "0" && FARMS[i].amountRewardToken !== undefined) {
            await loadRewardToken(deployer, FARMING, farmId, FARMS[i].amountRewardToken);
        }
    }
    
}

async function loadRewardToken(deployer, FARMING, farmId, rewardAmount) {
    const TOKEN = new Contract(
        deployer,
        FARMS[i].rewardToken,
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
            registration_only: true
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


async function checkIfOwner(deployer, FARMING) {
    const metadata = await FARMING.get_metadata()
    if(deployer !== metadata.owner_id) {
        console.log("Need to be owner");
        process.exit(1);
    }
    return ;
}

async function initializeFarming(deployer, farming) {
    const FARMING = new Contract(
        deployer,
        farming,
        {
            viewMethods: [ "get_metadata" ],
            changeMethods: [ "create_simple_farm" ],
            sender: deployer
        }
    );
    return FARMING;
}