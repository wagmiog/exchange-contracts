const HELP = `Please run this script in the following format:
    node deployer.testnet
`;

const { connect, KeyPair, keyStores, utils, WalletConnection, Contract } = require("near-api-js");
const fs = require("fs")
const path = require("path");
const homedir = require("os").homedir();
const { CONTRACTS, OWNER, MINTER, FEES } = require("../nearConfig");
const { exchangeConst, farmingConst, tokenConst, xTokenConst } = require("../constants-testnet");

const CREDENTIALS_DIR = ".near-credentials";
const ACCOUNT_ID = process.argv[2]
const credentialsPath = path.join(homedir, CREDENTIALS_DIR);
const keyStore = new keyStores.UnencryptedFileSystemKeyStore(credentialsPath);

if (process.argv.length !== 3) {
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
  const [exchange, farming, nPng, xNPng] = await connectContracts(near);
  await checkIfFullAccess([deployer, exchange, farming, nPng, xNPng]);
  await deployContracts(deployer, [exchange, farming, nPng, xNPng]);
  const [EXCHANGE, FARMING, PNG, XPNG] = await initializeContracts(deployer, [exchange, farming, nPng, xNPng]);
  await useNew(EXCHANGE, [{
    owner_id: OWNER,
    exchange_fee: FEES.exchange_fee,
    referral_fee: FEES.referral_fee
  }])

  await useNew(FARMING, [{
    owner_id: OWNER
  }])

  await useNew(NPNG, [{
    minter_id: MINTER
  }])

  await useNew(XNPNG, [{
    owner_id: OWNER,
    locked_token: NPNG.contractId
  }])
}

async function useNew(contract, args) {
  try {
    await contract.new(...args);
    console.log(contract.contractId, "has been initialized ✅");
    return (1);
  } catch (e) {
    console.log(contract.contractId, "already initialize");
    return (0)
  }
}

async function deployContracts(contractsAccounts) {
  let contractsInfo = [exchangeConst, farmingConst, tokenConst, xTokenConst];
  for (let i = 0; i < contractsAccounts.length; i++) {
    await contractsAccounts.deployContracts(fs.readFileSync(contractsInfo[i].wasmPath));
  }
  console.log("Contracts deployed ✅")
}

async function initializeContracts(deployer, contractsAccounts) {
  let contractsInfo = [exchangeConst, farmingConst, tokenConst, xTokenConst];
  let contractsRet = [];
  for (let i = 0; i < contractsAccounts.length; i++) {
    contractsRet.push(new Contract(
      deployer,
      contractsAccounts[i].accountId,
      {
        viewMethods: contractsInfo[i].viewMethods,
        changeMethods: contractsInfo[i].changeMethods,
        sender: deployer,
      }
    ));
  }
  return contractsRet;
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

async function connectContracts(near) {
  const exchange = await near.account(CONTRACTS.exchange);
  const farming = await near.account(CONTRACTS.farming);
  const nPng = await near.account(CONTRACTS.token);
  const xNPng = await near.account(CONTRACTS.xToken);

  return [exchange, farming, nPng, xNPng];
}
