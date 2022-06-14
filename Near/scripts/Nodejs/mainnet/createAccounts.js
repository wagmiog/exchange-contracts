const HELP = `Please run this script in the following format:
    node create-testnet-account.js CREATOR_ACCOUNT.testnet AMOUNT
`;

const { connect, KeyPair, keyStores, utils } = require("near-api-js");
const path = require("path");
const homedir = require("os").homedir();
const { CONTRACTS, OWNER, MINTER, FEES } = require("../nearConfig");
const CREDENTIALS_DIR = ".near-credentials";
const credentialsPath = path.join(homedir, CREDENTIALS_DIR);
const keyStore = new keyStores.UnencryptedFileSystemKeyStore(credentialsPath);

const config = {
  keyStore,
  networkId: "mainnet",
  nodeUrl: "https://rpc.mainnet.near.org",
};

if (process.argv.length !== 4) {
  console.info(HELP);
  process.exit(1);
}

main(process.argv[2], process.argv[3]);

async function main(creatorAccountId, amounts) {
    
    await createAccount(creatorAccountId, CONTRACTS.token, amounts);
    console.log(CONTRACTS.token ,"has been created")
    
}

async function createAccount(creatorAccountId, newAccountId, amount) {
  const near = await connect(config);
  const creatorAccount = await near.account(creatorAccountId);
  const keyPair = KeyPair.fromRandom("ed25519");
  const publicKey = keyPair.publicKey.toString();
  await keyStore.setKey(config.networkId, newAccountId, keyPair);

  return await creatorAccount.functionCall({
    contractId: "near",
    methodName: "create_account",
    args: {
      new_account_id: newAccountId,
      new_public_key: publicKey,
    },
    gas: "300000000000000",
    attachedDeposit: utils.format.parseNearAmount(amount),
  });
}