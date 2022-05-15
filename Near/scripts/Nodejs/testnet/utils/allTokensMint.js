const HELP = `Please run this script in the following format:
    node amount addresses1.testnet addresses2.testnet addresses3.testnet ...
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

let accounts = [];
for (let i = 3; process.argv.length > i; i++) {
    accounts.push(process.argv[i]);
}

const config = {
  keyStore,
  networkId: "testnet",
  nodeUrl: "https://rpc.testnet.near.org",
};

main(process.argv[3]);

async function main(deployerAccount) {
    const near = await connect({ ...config, keyStore });
    const deployer = await near.account(deployerAccount);
    await checkIfFullAccess([ deployer ]);
    await storageAndMint(near, deployer, CONTRACTS.token);
    await storageAndMint(near, deployer, TESTTOKEN.OGS);
    await storageAndMint(near, deployer, TESTTOKEN.DEX);
    await storageAndMint(near, deployer, TESTTOKEN.DNS);
    await storageAndMint(near, deployer, TESTTOKEN.PCC);
    await storageAndMint(near, deployer, TESTTOKEN.SLS);
    await storageAndMint(near, deployer, TESTTOKEN.TIME);
    await storageAndMint(near, deployer, TESTTOKEN.FBTC);
    await storageAndMint(near, deployer, TESTTOKEN.FDAI);
    await storageAndMint(near, deployer, TESTTOKEN.FUSDC);
    await storageAndMint(near, deployer, TESTTOKEN.FUSDT);
}

async function storageAndMint(near, deployer, token) {
  const TOKEN = new Contract(
    deployer,
    token,
    {
      viewMethods: [ "ft_metadata" ],
      changeMethods: [ "mint", "storage_deposit" ],
      sender: deployer
    }
  );
  for (let i = 0; accounts.length > i; i++) {
    if (await storage_balance_of({account_id: accounts[i]}) === null) {
      await TOKEN.storage_deposit(
        {
          account_id: accounts[i],
          registration_only: true
        },
        "100000000000000",
        "10000000000000000000000"
      );
    }
    await TOKEN.mint(
      {
        account_id: accounts[i],
        amount: process.argv[2]
      },
    );
  }
  console.log(TOKEN.contractId, "has been distribute");
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
