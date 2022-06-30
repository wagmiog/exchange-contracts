# ref-v2-farming
This is an improved version of ref-farming contract.  
Compare to ref-farming contract, it has following new features:
- Multi-farming ability upgraded from 16 to 32 farms in one seed,
- Support locking liquidity (CD Account) when farming,
- Support farm expire to enable new farm even the seed has reached 32 farms limit,
- Simplified storage fee strategy to improve user experience.

## User Manual
---

### User Roles
There are three user roles:
- Farmer  
    * Can stake/unstake seed to participate in farming,
    * Can claim farming reward to inner account,
    * Can withdraw assets from inner account to user wallet,
- Operator (also can be a farmer)  
    * create new farming,
    * adjust CD Account strategy,
    * adjust full slash per seed rate and default rate,
    * adjust minimum deposit per seed,
    * withdraw slashed seed to owner account,
- Owner (mostly be a DAO)  
    * set owner to another account,
    * manage operators,
    * adjust farm expire time,
    * refund from seed lostfound,
    * upgrade the contract,

### User Register
```bash
near call $REF_V2FARM storage_deposit '{"account_id": "farmer.testnet", "registration_only": true}' --account_id=farmer.testnet --deposit=1
```
note:
- Each farmer would lock 0.1 near for their storage when register,
- Use registration_only=true, the unused deposited near would refund,

To check a user's register status:
```bash
near view $REF_V2FARM storage_balance_of '{"account_id": "farmer.testnet"}'
```

### Stake/Unstake Seed

**Stake Non-CD-Account seed**
```bash
near call $REF_EX mft_transfer_call '{"receiver_id": "'$REF_V2FARM'", "token_id": ":0", "amount": "xxxx", "msg": ""}' --account_id=farmer.testnet --depositYocto=1 --gas=150$TGAS
```
note:  
- with empty msg, user got same amount of seed power in reward distribution,
- with empty msg, user can unstake those seed at any time,

**Unstake Non-CD-Account seed**
```bash
near call $REF_V2FARM withdraw_seed '{"seed_id": "xxxx", "amount": "xxxx"}' --account_id=farmer.testnet --depositYocto=1 --gas=100$TGAS
```

**View CD-Account Policy**
```bash
near view $REF_V2FARM get_cd_strategy
```
response is like:
```bash
{
  stake_strategy: [
    { enable: true, lock_sec: 2592000, power_reward_rate: 1000 },
    { enable: true, lock_sec: 7776000, power_reward_rate: 3000 },
    { enable: true, lock_sec: 15552000, power_reward_rate: 5000 },
    { enable: false, lock_sec: 0, power_reward_rate: 0 },
    { enable: false, lock_sec: 0, power_reward_rate: 0 },
    ...
  ]
}
```
note:  
- `enable` indicates this item is valid or not,
- `lock_sec` means the minimum locking period (in sec) without slash,
- `power_reward_rate` means the addtional power rate in bps,

**Stake seed into a new CD-Account**
```bash
near call $REF_EX mft_transfer_call '{"receiver_id": "'$REF_V2FARM'", "token_id": ":0", "amount": "xxxx", "msg": "{\"NewCDAccount\":{\"index\":0,\"cd_strategy\":0}}"}' --account_id=farmer.testnet --depositYocto=1 --gas=150$TGAS
```
note:  
- index in msg: CD-Account index,
- cd_strategy in msg: the cd_strategy index this CD-Account applied,
- if CD-Account index is occupied, the TX succeed but refund seed token; 
- if cd_strategy doesn't exist, the TX succeed but refund seed token; 


**Append seed into an existing CD-Account**
```bash
near call $REF_EX mft_transfer_call '{"receiver_id": "'$REF_V2FARM'", "token_id": ":0", "amount": "xxxx", "msg": "{\"AppendCDAccount\":{\"index\":0}}"}' --account_id=farmer.testnet --depositYocto=1 --gas=150$TGAS
```
note:  
- index in msg: CD-Account index,
- if CD-Account not exist, the TX succeed but refund seed token; 
- if seed in CD-Account doesn't match, the TX succeed but refund seed token; 


**Unstake CD-Account seed**
```bash
near call $REF_V2FARM withdraw_seed_from_cd_account '{"index": 0, "amount": "xxxx"}' --account_id=farmer.testnet --depositYocto=1 --gas=100$TGAS
```
note:  
- index: CD-Account index, from 0-15 for each farmer.

**View User Seed Info**
```bash
# show users whole seed info
near view $REF_V2FARM list_user_seed_info '{"account_id": "farmer.testnet", "from_index": 0, "limit": 100}'
# or to show only cd account info
near view $REF_V2FARM list_user_cd_account '{"account_id": "farmer.testnet", "from_index": 0, "limit": 100}'
```
The response is like:
```bash
{
  'exchange.ref-dev.testnet@5': {
    seed_id: 'exchange.ref-dev.testnet@5',
    amount: '11100000000000000000000',
    power: '11209999756944444444444',
    cds: [
      {
        cd_account_id: 0,
        seed_id: 'exchange.ref-dev.testnet@5',
        seed_amount: '500000000000000000000',
        seed_power: '550000000000000000000',
        begin_sec: 1646919954,
        end_sec: 1649511954
      },
      {
        cd_account_id: 1,
        seed_id: 'exchange.ref-dev.testnet@5',
        seed_amount: '600000000000000000000',
        seed_power: '659999756944444444444',
        begin_sec: 1646966105,
        end_sec: 1649558105
      }
    ]
  }
}

```
Note:
- `end_sec` means the ealiest timestamp (in sec) that farmer unstake at without slash.

### Claim and Withdraw Reward

**show unclaimed reward of a farm**
```bash
near view $REF_V2FARM get_unclaimed_reward '{"account_id": "farmer.testnet", "farm_id": "xxx@5#2"}'
```

**claim per farm**
```bash
near call $REF_V2FARM claim_reward_by_farm '{"farm_id": "xxx@5#2"}' --account_id=farmer.testnet --gas=150$TGAS
```

**claim per seed**
```bash
near call $REF_V2FARM claim_reward_by_seed '{"seed_id": "xxx@5"}' --account_id=farmer.testnet --gas=150$TGAS
```

**withdraw reward**
```bash
# withdraw all amount of given token
near call $REF_V2FARM withdraw_reward '{"token_id": "xxx"}' --account_id=farmer.testnet --depositYocto=1 --gas=$GAS100
# or withdraw given amount of given token
near call $REF_FARM withdraw_reward '{"token_id": "xxx", "amount": "100"}' --account_id=farmer.testnet --depositYocto=1 --gas=$GAS100
```

### Operator Actions

**Create New Farm**
```bash
near call $REF_V2FARM create_simple_farm '{"terms": {"seed_id": "xxx", "reward_token": "xxx", "start_at": 0, "reward_per_session": "nnn", "session_interval": 60}}' --account_id=op.testnet --deposit=0.01 || true
```
Note:  
- `start_at` the distribution start timestamp or 0 means to start distribute as long as the reward token is deposited into the farm,
- `session_interval` the interval secs between distribution,
- will return farm_id of the created farm,

**Modify Seed Minimum Amount of Deposit**
```bash
near call $REF_V2FARM modify_seed_min_deposit '{"seed_id": "xxx", "min_deposit": "nnn"}' --account_id=op.testnet --depositYocto=1
```

**Modify Default Seed Slash Rate**
```bash
near call $REF_V2FARM modify_seed_slash_rate '{"slash_rate": nnn}' --account_id=op.testnet --depositYocto=1
```

**Modify Seed Slash Rate**
```bash
near call $REF_V2FARM modify_seed_slash_rate '{"seed_id": "xxx", "slash_rate": nnn}' --account_id=op.testnet --depositYocto=1
```

**Modify CD Account Policy**
```bash
near call $REF_V2FARM modify_cd_strategy_item '{"index": n, "lock_sec": nnn, "power_reward_rate": nnn}' --account_id=op.testnet --depositYocto=1
```

**Withdraw Slashed Seed to Owner Account**
```bash
near call $REF_V2FARM withdraw_seed_slashed '{"seed_id": "xxx"}' --account_id=op.testnet --depositYocto=1
```

## Developer Manual
---

## Interface Structure

```rust
/// Metadata and the  whole statistics of the contract
pub struct Metadata {
    pub version: String,
    pub owner_id: AccountId,
    pub farmer_count: U64,
    pub farm_count: U64,
    pub seed_count: U64,
    pub reward_count: U64,
}

/// Seed info
pub struct SeedInfo {
    pub seed_id: SeedId,
    pub seed_type: String, // FT, MFT
    pub farms: Vec<FarmId>,
    pub next_index: u32,
    pub amount: U128,
    pub power: U128,
    pub min_deposit: U128,
}

/// Farm status
pub struct FarmInfo {
    pub farm_id: FarmId,
    pub farm_kind: String,
    pub farm_status: String,  // Created, Running, Ended
    pub seed_id: SeedId,
    pub reward_token: AccountId,
    pub start_at: U64,
    pub reward_per_session: U128,
    pub session_interval: U64, 
    // total_reward = distributed + undistributed
    // distributed = claimed + unclaimed
    pub total_reward: U128,
    pub cur_round: U64,
    pub last_round: U64,
    pub claimed_reward: U128,
    pub unclaimed_reward: U128,
    pub beneficiary_reward: U128,
}

/// CDAccount stake strategy info
pub struct CDStakeItemInfo{
    pub enable: bool,
    pub lock_sec: u32,
    pub power_reward_rate: u32,
}

/// CDAccount strategy info
pub struct CDStrategyInfo {
    pub stake_strategy: Vec<CDStakeItemInfo>,
    pub seed_slash_rate: u32,
}


/// CDAccount status
pub struct CDAccountInfo {
    pub seed_id: SeedId,
    pub seed_amount: U128,
    pub seed_power: U128,
    pub begin_sec: u32,
    pub end_sec: u32
}

/// user seed info
pub struct UserSeedInfo {
    pub seed_id: SeedId,
    pub amount: U128,
    pub power: U128,
    pub cds: Vec<CDAccountInfo>
}

/// used to create a farm
pub struct HRSimpleFarmTerms {
    pub seed_id: SeedId,
    pub reward_token: ValidAccountId,
    pub start_at: U64,
    pub reward_per_session: U128,
    pub session_interval: U64, 
}

```

## Interface methods

***view functions***  
```rust

/// whole contract
pub fn get_metadata(&self) -> Metadata;

//***********************************
//************* about Farms *********
//***********************************

/// total number of farms.
pub fn get_number_of_farms(&self) -> u64;

/// total number of outdated farms.
pub fn get_number_of_outdated_farms(&self) -> u64;

/// Returns list of farms of given length from given start index.
list_farmspub fn list_farms(&self, from_index: u64, limit: u64) -> Vec<FarmInfo>

/// Returns list of outdated farms of given length from given start index.
pub fn list_outdated_farms(&self, from_index: u64, limit: u64) -> Vec<FarmInfo>

/// batch get farm info by seed;
/// Cause farms are organized under Seed(ie. Farming-Token) in the contract
pub fn list_farms_by_seed(&self, seed_id: SeedId) -> Vec<FarmInfo>;

/// Get single farm's status
pub fn get_farm(&self, farm_id: FarmId) -> Option<FarmInfo>;

/// Get single outdated farm's status
pub fn get_outdated_farm(&self, farm_id: FarmId) -> Option<FarmInfo>

//***********************************
//*********** about Rewards *********
//***********************************

/// get all rewards and its supply
pub fn list_rewards_info(&self, from_index: u64, limit: u64) -> HashMap<AccountId, U128>;

/// claimed rewards of given user
pub fn list_rewards(&self, account_id: ValidAccountId) -> HashMap<AccountId, U128>;

/// claimed reward of given user and given reward token.
pub fn get_reward(&self, account_id: ValidAccountId, token_id: ValidAccountId) -> U128;

/// unclaimed reward of given user and given farm
pub fn get_unclaimed_reward(&self, account_id: ValidAccountId, farm_id: FarmId) -> U128;

//***********************************
//*********** about Seeds ***********
//***********************************

/// all staked seeds and its info
pub fn get_seed_info(&self, seed_id: SeedId) -> Option<SeedInfo>;

/// all staked seeds of given user
pub fn list_seeds_info(&self, from_index: u64, limit: u64) -> HashMap<SeedId, SeedInfo>;

```

***Storage functions***  
User of farming contract should register first and keep their storage fee valid.  
```rust

/// Only farmer need to register for storage, 
/// Fixed 0.1 near per famer
#[payable]
fn storage_deposit(&mut self, account_id: 
    Option<ValidAccountId>, 
    registration_only: Option<bool>,
) -> StorageBalance;

/// thing can withdraw, storage_unregister directly
#[payable]
fn storage_withdraw(&mut self, amount: Option<U128>) -> StorageBalance;

/// to completely quit from this contract, 
/// should unstake all seeds、 withdraw all rewards and remove all CDAccont before call this one
fn storage_unregister(&mut self, force: Option<bool>) -> bool;

/// get current storage fee info
fn storage_balance_of(&self, account_id: ValidAccountId) -> Option<StorageBalance>;
```

***Manage farms***  
```rust
/// FarmId is like this:
let farm_id: FarmId = format!("{}#{}", seed_id, index);

/// create farm and pay for its storage fee
/// terms defines farm rules in type of HRSimpleFarmTerms,
/// min_deposit will set the minimum stake balance of seed token 
/// if this farm is the first farm in that seed, and 
/// if None is given, the default MIN_SEED_DEPOSIT will be used, 
/// that is 10**24.
#[payable]
pub fn create_simple_farm(&mut self, terms: HRSimpleFarmTerms, min_deposit: Option<U128>) -> FarmId;
```

***Manage seeds***  
```rust
/// SeedId is like this:
/// receiver_id@pool_id for MFT
/// receiver_id for FT

/// stake action is invoked outside this contract, 
/// actually by MFT's mft_on_transfer or FT's ft_on_transfer, 
/// with msg field left to empty string.

/// unstake, with amount is 0, means to unstake all.
#[payable]
pub fn withdraw_seed(&mut self, seed_id: SeedId, amount: U128);
```

***Manage rewards***  
```rust
/// claim reward from single farm
#[payable]
pub fn claim_reward_by_farm(&mut self, farm_id: FarmId);

/// batch claim from farms with same seeds
#[payable]
pub fn claim_reward_by_seed(&mut self, seed_id: SeedId);

/// All claimed rewards goes to farmer's inner account in this contract,
/// So, farmer can withdraw given reward token back to his own account.
#[payable]
pub fn withdraw_reward(&mut self, token_id: ValidAccountId, amount: Option<U128>);
```

***Manage CDAccount***  
```rust
///remove CDAccount by index
#[payable]
pub fn remove_cd_account(&mut self, index: u64)
```

***Owner methods***  
```rust
pub fn set_owner(&mut self, owner_id: ValidAccountId);

/// those farm with Ended status and zero unclaimed reward, 
/// can be cleaned to save storage.
pub fn clean_farm_by_seed(&mut self, seed_id: String);

/// owner can modify min_deposit of given seed.
pub fn modify_seed_min_deposit(&mut self, seed_id: String, min_deposit: Balance);

/// force clean 
pub fn force_clean_farm(&mut self, farm_id: String) -> bool;

/// owner can modify item of CDAccount strategy 
pub fn modify_cd_strategy_item(&mut self, index: usize, lock_sec: u32, additional: u32)

/// owner can modify damage of CDAccount strategy 
pub fn modify_cd_strategy_damage(&mut self, damage: u32)

/// upgrade the contract
pub fn upgrade(
        &self,
        #[serializer(borsh)] code: Vec<u8>,
        #[serializer(borsh)] migrate: bool,
    ) -> Promise;
```

## contract core structure

```rust


pub struct StakeStrategy{
    /// duration of seed lock.
    pub lock_sec: u32,
    /// gain additional numerator.
    pub additional: u32,
    pub enable: bool,
}

pub struct CDStrategy {
    /// total of 32 different strategies are supported.
    pub stake_strategy: Vec<StakeStrategy>,
    /// liquidated damages numerator.
    pub damage: u32,
}

pub struct ContractData {

    // owner of this contract
    owner_id: AccountId,
    
    // record seeds and the farms under it.
    // seeds: UnorderedMap<SeedId, FarmSeed>,
    seeds: UnorderedMap<SeedId, VersionedFarmSeed>,

    // each farmer has a structure to describe
    // farmers: LookupMap<AccountId, Farmer>,
    farmers: LookupMap<AccountId, VersionedFarmer>,

    farms: UnorderedMap<FarmId, Farm>,
    outdated_farms: UnorderedMap<FarmId, Farm>,

    // for statistic
    farmer_count: u64,
    reward_info: UnorderedMap<AccountId, Balance>,

    // strategy for farmer CDAccount
    cd_strategy: CDStrategy,
}

/// used to store U256 in contract storage
pub type RPS = [u8; 32];

pub struct CDAccount {
    pub seed_id: SeedId,
    /// From ft_on_transfer、ft_on_transfer amount
    pub seed_amount: Balance,
    /// self.seed_amount * CDStrategy.additional[self.cd_strategy] / CDStrategy.denominator
    pub seed_power: Balance,
    /// seed stake begin sec: to_sec(env::block_timestamp())
    pub begin_sec: u32,
    /// seed stake end sec: self.begin_sec + CDStrategy.lock_secs
    pub end_sec: u32
}

pub struct Farmer {
    /// Amounts of various reward tokens the farmer claimed.
    pub rewards: HashMap<AccountId, Balance>,
    /// Amounts of various seed tokens the farmer staked.
    pub seed_amounts: HashMap<SeedId, Balance>,
    /// Powers of various seed tokens the farmer staked.
    pub seed_powers: HashMap<SeedId, Balance>,
    /// Record user_last_rps of farms
    pub user_rps: LookupMap<FarmId, RPS>,
    pub rps_count: u32,
    /// Farmer can create up to 16 CD accounts
    pub cd_accounts: Vector<CDAccount>,
}

pub struct FarmSeed {
    /// The Farming Token this FarmSeed represented for
    pub seed_id: SeedId,
    /// The seed is a FT or MFT, enum size is 2 bytes?
    pub seed_type: SeedType,
    /// all farms that accepted this seed
    /// FarmId = {seed_id}#{next_index}
    pub farms: HashSet<FarmId>,
    pub next_index: u32,
    /// total (staked) balance of this seed (Farming Token)
    pub total_seed_amount: Balance,
    pub total_seed_power: Balance,
    pub min_deposit: Balance,
}
```
### Reward distribution implementation
Each simple farm has a terms `SimpleFarmTerms` to define how to distribute reward,  
And a Status `SimpleFarmStatus` to mark the life-circle,  
And the key last-distribution record - `SimpleFarmRewardDistribution`.  
```rust
pub struct SimpleFarmTerms {
    pub seed_id: SeedId,
    pub reward_token: AccountId,
    pub start_at: BlockHeight,
    pub reward_per_session: Balance,
    pub session_interval: BlockHeight,
}

pub enum SimpleFarmStatus {
    Created, Running, Ended, Cleared
}

pub struct SimpleFarmRewardDistribution {
    /// unreleased reward
    pub undistributed: Balance,
    /// the total rewards distributed but not yet claimed by farmers.
    pub unclaimed: Balance,
    /// Reward_Per_Seed
    /// rps(cur) = rps(prev) + distributing_reward / total_seed_staked
    pub rps: RPS,
    /// Reward_Round
    /// rr = (cur_block_height - start_at) / session_interval
    pub rr: u64,
}
```
Then, the whole farm is built as
```rust
pub struct SimpleFarm {

    pub farm_id: FarmId,
    
    pub terms: SimpleFarmTerms,

    pub status: SimpleFarmStatus,

    pub last_distribution: SimpleFarmRewardDistribution,

    /// total reward send into this farm by far, 
    /// every time reward deposited in, add to this field
    pub amount_of_reward: Balance,
    /// reward token has been claimed by farmer by far
    pub amount_of_claimed: Balance,

}
``` 

As designed that way, we can calculate farmers unclaimed reward like this:  

```rust
// 1. get current reward round CRR
let crr = (env::block_index() - self.terms.start_at) / self.terms.session_interval;
// 2. get reward to distribute this time
let reward_added = (crr - self.last_distribution.rr) as u128 * self.terms.reward_per_session;
// 3. get current RPS
let crps = self.last_distribution.rps + reward_added / total_seeds;
// 4. get user unclaimed by multiple user_staked_seed with rps diff.
let unclaimed_reward = user_staked_seed * (crps - user_last_rps);
```
This logic is sealed in 
```rust
pub(crate) fn view_farmer_unclaimed_reward(
        &self,
        user_rps: &RPS,
        user_seeds: &Balance,
        total_seeds: &Balance,
    ) -> Balance
```
which, based on 
```rust
pub(crate) fn try_distribute(&self, total_seeds: &Balance) -> Option<SimpleFarmRewardDistribution>
```
to calculate cur RPS and RR of the farm without modifying the storage (means not really update the farm)

And when farmer actually claims his reward, the whole logic is sealed in 
```rust
pub(crate) fn claim_user_reward(
        &mut self, 
        user_rps: &RPS,
        user_seeds: &Balance, 
        total_seeds: &Balance
    ) -> Option<(Balance, Balance)>
```
which, based on 
```rust
pub(crate) fn distribute(&mut self, total_seeds: &Balance)
```
to calculate and update the farm.

### User Register
This contract obeys NEP-145 to manage storage, but choose a fixed storage fee policy in this contract. Each user only needs deposit to lock a fixed 0.1 NEAR as storage cost.

Detailed interface description could be found at [NEP-145](https://nomicon.io/Standards/StorageManagement.html).

Here we only list some common-use interfaces:

* `storage_deposit`, to register a user,
* `storage_unregister`, to unregister caller self and get 0.1 NEAR back,
* `storage_balance_of`, to get given user storage balance.