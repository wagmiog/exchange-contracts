# Pangolin Near Scripts

This repo contains all of the Near script

### createAccounts.js

This script can be used to create account necessary for the deployment with a specified amount

1. Setup accounts that need to be create: 
`exports.CONTRACTS = {`
`    exchange: "png-exchange-v1.testnet",`
`    farming: "png-farm-v1.testnet",`
`    token: "png-token-v1.testnet",`
`    xToken: "png-xtoken-v1.testnet"`
`};`

2. Use this command to launch the script: 
`node create-testnet-account.js CREATOR_ACCOUNT.testnet AMOUNT`

### deploy-testnet.js

This script can be used to deploy all Near Pangolin contracts

1. Setup your deployement: 
`exports.OWNER = "0xsimo.testnet"`
`exports.MINTER = "0xsimo.testnet"`
`exports.FEES = {`
`    exchange_fee: 20,`
`    referral_fee: 20`
`}`

2. Use this command to launch the script:
`node deploy-testnet.js deployer.testnet`

# Exchange scripts

This folder contain all scripts for the exchange-contract

## ViewMethods

This folder `view` contain all views scripts for the exchange-contract

### metadata.js

Display contract basic info

1. Use this command to launch the script:
`node metadata.js` 

### get_all_pools.js

Display list of pools.

1. Use this command to launch the script:
`node get_all_pools.js`

### get_guardians.js

Display list of guardians.

1. Use this command to launch the script:
`node get_guardians.js`

### get_number_of_pools.js

Display number of pools.

1. Use this command to launch the script:
`node get_number_of_pools.js`

### get_owner.js

Display owner ID.

1. Use this command to launch the script:
`node get_owner.js`

### get_pool_shares.js

Display number of shares given account has in given pool.

1. Use this command to launch the script:
`node get_pool_shares.js pool_id account_id`

### get_pool.js

Display information about specified pool.

1. Use this command to launch the script:
`node get_pool.js pool_id`

### get_pools.js 

Display list of pools of given length from given start index.

1. Use this command to launch the script:
`node get_pools.js from_index limit`

### get_whitelisted_token.js

Display contract level whitelisted tokens.

1. Use this command to launch the script:
`node get_whitelisted_token.js` 

## ChangeMethods

This folder contain all changeMethods scripts for the exchange-contract

### add_liquidity.js

Add liquidity of given pool and given amount.

1. Use this command to launch the script:
`node add_liquidity.js account.testnet pool_id amount0 amount1`

### change_state.js

Change state of contract, Only can be called by owner or guardians.

1. Use this command to launch the script: 
`node change_state.js owner.testnet state`

### create_pool.js

Create a new pool.

1. Use this command to launch the script: 
`node create_pool.js account.testnet token0.testnet token1.testnet`

### create_stable_pool.js

Create a new stable pool, Only can be called by owner or guardians.

1. Use this command to launch the script: 
`node create_stable_pool.js deployer stable1.testnet stable2.testnet stable3.testnet ...`

### extend_guardians.js

Extend guardians. Only can be called by owner.

1. Use this command to launch the script: 
`node set_owner.js owner.testnet guardian1 guardian2 guardian3 ...`

### extend_whitelisted_tokens.js

Extend whitelisted tokens with new tokens. Only can be called by owner or guardians.

1. Use this command to launch the script: 
`node extend_withelisted_tokens.js owner.testnet token1 token2 token3 ... `

### modify_admin_fee.js

Modify exchange_fees and referral_fees percent. Only can be called by owner.

1. Use this command to launch the script: 
`node modify_admin_fee.js owner.testnet exchange_fee referral_fee`

### remove_exchange_fee_liquidity.js

Remove exchange fee liquidity to owner's inner account. Only can be called by owner or guardians.

1. Use this command to launch the script: 
`node remove_exchange_fee_liquidity.js owner.testnet pool_id shares min_amounts1 min_amounts2 min_amounts3 ...`

### remove_guardians.js

Remove guardians. Only can be called by owner.

1. Use this command to launch the script: 
`node remove_guardians.js owner.testnet removeGuardian1 removeGuardian2 removeGuardian3 ...`

### remove_liquidity.js

Remove liquidity from the pool into general pool of liquidity.

1. Use this command to launch the script: 
`node remove_liquidity.js account.testnet pool_id shares min_amount0 min_amount1`

### remove_whitelist_tokens.js

Remove whitelisted token. Only can be called by owner or guardians.

1. Use this command to launch the script: 
`node remove_whitelisted_tokens.js owner.testnet token1 token2 token3 ... `

### retrieve_unmanaged_token.js

Retrieve NEP-141 tokens that not mananged by contract to owner. Only can be called by owner.

1. Use this command to launch the script:
`node retrieve_unmanaged_token.js owner.testnet token_id amount`

### set_owner.js

Change owner. Only can be called by owner.

1. Use this command to launch the script:
`node set_owner.js owner.testnet newOwner.testnet`

### swap.js

Execute a swap between two tokens of the same pool.

1. Use this command to launch the script:
`node swap.js account.testnet pool_id token_in amount_in token_out`

### withdraw_funds.js

Withdraws given token from the deposits of given user.

1. Use this command to launch the script:
`node withdraw_funds.js account.testnet token_id amount`

### withdraw_owner_token.js

Withdraw owner inner account token to owner wallet. Only can be called by owner or Guardians.

1. Use this command to launch the script:
`node withdraw_owner_token.js owner.testnet token_id amount`

# Farms scripts

This folder contain all scripts for the farms-contract

## ViewMethods

This folder `view` contain all views scripts for the farms-contract

### all_farms_list.js

Display list of farms

1. Use this command to launch the script:
`node all_farms_list.js`

### all_outdated_farms.js

Display list of outdated farms

1. Use this command to launch the script:
`node all_outdated_farms.js`

### farms_list.js

Display list of farms of given length from given start index.

1. Use this command to launch the script:
`node farms_list.js from_index limit`

### get_farm.js

Display information about specified farm.

1. Use this command to launch the script:
`node get_farm.js farmId`

### get_number_of_farms.js

Display number of farms.

1. Use this command to launch the script:
`node get_number_of_farms.js`

### get_number_of_outdated_farms.js

Display number of outdated farms.

1. Use this command to launch the script:
`node get_number_of_outdated_farms.js`

### get_outdated_farm.js

Display information about specified outdated farm.

1. Use this command to launch the script:
`node get_outdated_farm.js farmId`

### get_reward.js

Display balance of amount of given reward token that ready to withdraw.

1. Use this command to launch the script:
`node get_reward.js account_id token_id`

### get_seed_info.js

Display information about specified seed

1. Use this command to launch the script:
`node get_seed_info.js seed_id`

### get_unclaimed_reward.js

Display balance of unclaimed amount of given reward

1. Use this command to launch the script:
`node get_unclaimed_reward.js account_id farm_id`

### list_farms_by_seed.js

Display information about specified farm by seed.

1. Use this command to launch the script:
`node list_farms_by_seed.js`

### list_seeds_info.js

Display list of seeds of given length from given start index.

1. Use this command to launch the script:
`node list_seeds_info.js from_index limit`

### metadata.js

Display contract basic info 

1. Use this command to launch the script:
`node metadata.js`

### rewards_list_info.js

Display list of informations about rewards of given length from given start index.

1. Use this command to launch the script:
`node rewards_list_info.js from_index limit`

### rewards_list.js

Display reward token claimed for given user outside of any farms.

1. Use this command to launch the script:
`node rewards_list.js account_id`

## ChangeMethods

This folder contain all changeMethods scripts for the farms-contract

### claim_reward_by_farm.js

Claim reward from single farm

1. Use this command to launch the script:
`node claim_reward_by_farm.js account_id farm_id`

### claim_reward_by_seed.js

batch claim from farms with same seeds

1. Use this command to launch the script:
`node claim_reward_by_seed.js account_id seed_id`

### clean_farm_by_seed.js

Those farm with Ended status and zero unclaimed reward, can be cleaned to save storage. Only can be called by owner or Operators.

1. Use this command to launch the script:
`node clean_farm_by_seed.js account_id seed_id`

### create_farms.js

This script can create farms. Only can be called by owner or Operators.

1. Setup accounts that need to be create: 
`exports.FARMS = [`
`    {`
`        poolId: 1,`
`        rewardToken: "png-token-v1.testnet",`
`        start_at: 1653512400,`
`        reward_per_session: "1",`
`        session_interval: 1000`
`    },`
`    {`
`        poolId: 2,`
`        rewardToken: this.CONTRACTS.token,`
`        start_at: 1653512400,`
`        reward_per_session: "1",`
`        session_interval: 1000,`
`        amountRewardToken: "0"`
`    }`
`]`

2. Use this command to launch the script: 
`node create_farms.js owner.testnet`

### deposit_farm.js

Deposit some shares in a farm

1. Use this command to launch the script:
`node deposit_farm.js account.testnet pool_id amount `

### extend_operators.js

Extend operators. Only can be called by owner.

1. Use this command to launch the script:
`node extend_operators.js owner.testnet guardian1 guardian2 guardian3 ...`

### modify_seed_min_deposit.js

Modify min_deposit of given seed. Only can be called by owner or Operators.

1. Use this command to launch the script:
`node modify_seed_min_deposit.js owner.testnet seed_id min_deposit`

### reload_reward_token.js

Refill the reward token. Can be called by everyone.

1. Use this command to launch the script:
`node reload_reward_token.js account.testnet farm_id amount`

### remove_operators.js

Remove operators. Only can be called by owner.

1. Use this command to launch the script:
`node remove_operators.js owner removeGuardian1 removeGuardian2 removeGuardian3 ...`

### set_owner.js

Change owner. Only can be called by owner.

1. Use this command to launch the script:
`node set_owner.js owner.testnet newOwner.testnet`

### withdraw_reward.js

Farmer can withdraw given reward token back to his own account.

1. Use this command to launch the script:
`node withdraw_reward.js account.testnet token_id`


### withdraw_seed.js

Unstake all rewards with a specified seed, unstake with amount is 0, means to unstake all.

1. Use this command to launch the script:
`node withdraw_seed.js account.testnet seed_id amount`

# Token scripts

This folder contain all scripts for the tokens-contract

## ViewMethods

This folder `view` contain all views scripts for the tokens-contract

### metadata.js

Display contract basic info

1. Use this command to launch the script:
`node metadata.js`

## ChangeMethods

This folder contain all scripts for the tokens-contract

### nPng_mint.js

Mint some nPng. Only can call by Minter

1. Use this command to launch the script:
`node nPngMint.js minter.testnet amount receiver`

# xToken scripts

This folder contain all scripts for the stake-contract

## ViewMethods

This folder `view` contain all views scripts for the stake-contract

### metadata.js

Display contract basic info

1. Use this command to launch the script:
`node metadata.js`

### get_virtual_price.js

Display the virtual price TOKEN/x-TOKEN price in 1e8

1. Use this command to launch the script:
`node get_virtual_price.js`

## ChangeMethods

This folder contain all scripts for the stake-contract

### nPng_mint.js

Mint some nPng. Only can call by Minter

1. Use this command to launch the script:
`node nPngMint.js minter.testnet amount receiver`

### changeRewardTime.js

Modify the number of reward per sec. Only can call by Owner

1. Setup accounts that need to be create: 
`reward_per_sec: "1000000000000000000",`
`distribute_before_change: false`

2. Use this command to launch the script:
`node changeRewardTime.js owner.testnet`

### reloadReward.js

Refill the reward token. Can be called by everyone.

1. Use this command to launch the script:
` node reloadReward.js account.testnet reloadAmount`

### resetRewardGenesis.js

Modify or make the reward genesis. Only can call by Owner

1. Setup accounts that need to be create: 
`reward_genesis_time_in_sec: 1653512400,`

2. Use this command to launch the script:
`node resetRewardGenesis.js owner.testnet`

### singleSideStaking.js

Launch changeRewardTime.js, resetRewardGenesis.js and reloadReward.js

1. Setup accounts that need to be create: 
`exports.STAKING = {`
`    reward_genesis_time_in_sec: 1653512400,`
`    reward_per_sec: "1000000000000000000",`
`    distribute_before_change: false`
`}`

2. Use this command to launch the script:
`node singleSideStaking.js owner.testnet reloadAmount`

### stake.js

Stake your tokens.

1. Use this command to launch the script:
`node stake.js account.testnet amount`

### unstake_ref.js

Unstake your xTokens

1. Use this command to launch the script: 
`node unstake.js account.testnet amount`