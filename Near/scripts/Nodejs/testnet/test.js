const HELP = `Please run this script in the following format:
    node amount addresses1.testnet addresses2.testnet addresses3.testnet ...
`;

const { connect, KeyPair, keyStores, utils, WalletConnection, Contract } = require("near-api-js");
const fs = require("fs")
const path = require("path");
const homedir = require("os").homedir();
const { CONTRACTS, OWNER, MINTER, FEES, TESTTOKEN } = require("../nearConfig");
const { exchangeConst, farmingConst, tokenConst, xTokenConst } = require("../constants-testnet");
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
    console.log(near, deployerAccount, TESTTOKEN.OGS)
    await useNew("0xsimo.testnet", [{
      lol: "lol",
      mdr: "mdr"
    }]);
    console.log(process.argv[5]);
}

async function useNew(contract, args) {
  console.log(...args);
  try {
    await contract.new(...args);
    console.log(contract.contractId, "has been initialized ✅");
    return (1);
  } catch (e) {
    console.log(contract.contractId, "already initialize");
    return (0)
  }
}