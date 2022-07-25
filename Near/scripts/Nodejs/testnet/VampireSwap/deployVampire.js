const HELP = `Please run this script in the following format:
    node deploy-testnet deployer.testnet
`;

const { connect, KeyPair, keyStores, utils, WalletConnection, Contract } = require("near-api-js");
const fs = require("fs")
const path = require("path");
const homedir = require("os").homedir();
const { CONTRACTS, OWNER, MINTER, FEES } = require("../../nearConfig");
const { vampireConst, exchangeConst } = require("../../constants-testnet");

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
  const vampire = await near.account(CONTRACTS.vampire);
  await checkIfFullAccess([deployer, vampire]);
  await vampire.deployContract(fs.readFileSync(vampireConst.wasmPath));
  const [VAMPIRE] = await initializeContracts(deployer, [vampire]);

  await useNew(VAMPIRE, [{
    owner_id: OWNER
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
    await contractsAccounts[i].deployContract(fs.readFileSync(contractsInfo[i].wasmPath));
  }
  console.log("Contracts deployed ✅")
}

async function initializeContracts(deployer, contractsAccounts) {
  let contractsInfo = [vampireConst];
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
