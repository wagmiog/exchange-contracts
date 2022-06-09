const HELP = `Please run this script in the following format:
    node deposit_farm.js deployer transferShares 
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
    const predict_remove = await EXCHANGE.predict_remove_liquidity(
        {
            pool_id: parseInt(process.argv[3]),
            shares: process.argv[4]
        }
    );
    console.log(predict_remove);
    let transactions = [];
    transactions.push(
        {
            receiverId: "png-exchange-v1.testnet",
            functionCalls: [
              {
                methodName: 'remove_liquidity',
                args: {
                    pool_id: pool_id,
                    shares: process.argv[4],
                    min_amounts: [0, 0]
                },
                amount: ONE_YOCTO_NEAR,
                gas: '180000000000000',
              },
            ],
        },)
        const neededStorage = await storageNeeded(deployer, pool.token_account_ids[0], CONTRACTS.exchange);
        if (neededStorage == true) {
            transactions.push({
                receiverId: pool.token_account_ids[0],
                functionCalls: [
                    {
                        methodName: 'storage_deposit',
                        args: {
                            account_id: CONTRACTS.exchange,
                            registration_only: true
                        },
                        gas: '180000000000000',
                        amount: '1250000000000000000000'
                    }
                ],
            });
        }

        const neededStorage = await storageNeeded(deployer, pool.token_account_ids[1], CONTRACTS.exchange);
        if (neededStorage == true) {
            transactions.push({
                receiverId: pool.token_account_ids[1],
                functionCalls: [
                    {
                        methodName: 'storage_deposit',
                        args: {
                            account_id: CONTRACTS.exchange,
                            registration_only: true
                        },
                        gas: '180000000000000',
                        amount: '1250000000000000000000'
                    }
                ],
            });
        }

        transactions.push(
        {
            receiverId: pool.token_account_ids[0],
            functionCalls: [
              {
                methodName: 'ft_transfer_call',
                args: {
                    receiver_id: "png-exchange-v1.testnet",
                    amount: amount,
                    msg: ""
                },
                amount: ONE_YOCTO_NEAR,
                gas: '180000000000000',
              },
            ],
        },)

            transactions.push(
            {
                receiverId: pool.token_account_ids[1],
                functionCalls: [
                  {
                    methodName: 'ft_transfer_call',
                    args: {
                        receiver_id: "png-exchange-v1.testnet",
                        amount: amount,
                        msg: ""
                    },
                    amount: ONE_YOCTO_NEAR,
                    gas: '180000000000000',
                  },
                ],
            },)


          transactions.push(
            {
                receiverId: "png-exchange-v1.testnet",
                functionCalls: [
                  {
                    methodName: 'add_liquidity',
                    args: {
                        pool_id: pool_id,
                        amounts: amounts
                    },
                    amount: "790000000000000000000",
                    gas: '180000000000000',
                  },
                ],
              },)
  
    const neededStorage = await storageNeeded(deployer, CONTRACTS.farming, deployerAccount);
    if (neededStorage == true) {
      transactions.push({
        receiverId: CONTRACTS.farming,
        functionCalls: [
            {
                methodName: 'storage_deposit',
                args: {
                    account_id: deployerAccount,
                    registration_only: true
                },
                gas: '180000000000000',
                amount: '1250000000000000000000'
            }
        ],
      });
    }

    transactions.push(
    {
        receiverId: "png-exchange-v1.testnet",
        functionCalls: [
          {
            methodName: 'mft_transfer_call',
            args: {
              receiver_id: 'png-farm-v1.testnet',
              token_id: token_id,
              amount: amount,
              msg,
            },
            amount: ONE_YOCTO_NEAR,
            gas: '180000000000000',
          },
        ],
      },)
  
    currentTransactions = await Promise.all(
        transactions.map((t, i) => {
          return deployer.createTransaction({
            receiverId: t.receiverId,
            nonceOffset: i + 1,
            actions: t.functionCalls.map((fc) =>
              functionCall(
                fc.methodName,
                fc.args,
                getGas(fc.gas),
                getAmount(fc.amount)
              )
            ),
          });
        })
      );
    deployer.requestSignTransactions(currentTransactions, '');

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

async function storageNeeded(deployer, tokenId, to) {
    const TOKEN = new Contract(
        deployer,
        token,
        {
          viewMethods: [ "storage_balance_of" ],
          changeMethods: ["storage_deposit", "ft_transfer_call" ],
          sender: deployer
        }
    );
    if (await TOKEN.storage_balance_of({account_id: to}) === null) {
       return false;
    } 
    return true;
}