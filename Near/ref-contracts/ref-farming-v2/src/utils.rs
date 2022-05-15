use crate::errors::*;
use crate::{FarmId, SeedId};
use near_sdk::json_types::U128;
use near_sdk::{env, ext_contract, Gas, Timestamp};
use uint::construct_uint;

pub type TimestampSec = u32;

pub const STRATEGY_LIMIT: usize = 32;
pub const DENOM: u128 = 10_000;
pub const MIN_SEED_DEPOSIT: u128 = 1_000_000_000_000_000_000;
pub const STORAGE_BALANCE_MIN_BOUND: u128 = 100_000_000_000_000_000_000_000;
pub const MAX_CDACCOUNT_NUM: u64 = 16;
pub const MAX_FARM_NUM: usize = 32;
pub const DEFAULT_FARM_EXPIRE_SEC: u32 = 3600 * 24 * 30;
/// Amount of gas for fungible token transfers.
pub const GAS_FOR_FT_TRANSFER: Gas = 20_000_000_000_000;
/// Amount of gas for reward token transfers resolve.
pub const GAS_FOR_RESOLVE_TRANSFER: Gas = 10_000_000_000_000;
/// Amount of gas for seed token transfers resolve.
pub const GAS_FOR_RESOLVE_WITHDRAW_SEED: Gas = 10_000_000_000_000;
pub const MFT_TAG: &str = "@";

construct_uint! {
    /// 256-bit unsigned integer.
    pub struct U256(4);
}

/// TODO: this should be in the near_standard_contracts
#[ext_contract(ext_fungible_token)]
pub trait FungibleToken {
    fn ft_transfer(&mut self, receiver_id: AccountId, amount: U128, memo: Option<String>);
}

/// TODO: this should be in the near_standard_contracts
#[ext_contract(ext_multi_fungible_token)]
pub trait MultiFungibleToken {
    fn mft_transfer(
        &mut self,
        token_id: String,
        receiver_id: AccountId,
        amount: U128,
        memo: Option<String>,
    );
}

#[ext_contract(ext_self)]
pub trait TokenPostActions {
    fn callback_post_withdraw_reward(
        &mut self,
        token_id: AccountId,
        sender_id: AccountId,
        amount: U128,
    );

    fn callback_withdraw_seed(&mut self, seed_id: SeedId, sender_id: AccountId, amount: U128);

    fn callback_withdraw_seed_slashed(&mut self, seed_id: SeedId, amount: U128);

    fn callback_withdraw_seed_lostfound(&mut self, seed_id: SeedId, sender_id: AccountId, amount: U128);
}

/// Assert that 1 yoctoNEAR was attached.
pub fn assert_one_yocto() {
    assert_eq!(
        env::attached_deposit(),
        1,
        "Requires attached deposit of exactly 1 yoctoNEAR"
    )
}

/// wrap token_id into correct format in MFT standard
pub fn wrap_mft_token_id(token_id: &str) -> String {
    format!(":{}", token_id)
}

// return receiver_id, token_id
pub fn parse_seed_id(lpt_id: &str) -> (String, String) {
    let v: Vec<&str> = lpt_id.split(MFT_TAG).collect();
    if v.len() == 2 {
        // receiver_id@pool_id
        (v[0].to_string(), v[1].to_string())
    } else if v.len() == 1 {
        // receiver_id
        (v[0].to_string(), v[0].to_string())
    } else {
        env::panic(format!("{}", ERR33_INVALID_SEED_ID).as_bytes())
    }
}

pub fn parse_farm_id(farm_id: &FarmId) -> (String, usize) {
    let v: Vec<&str> = farm_id.split("#").collect();
    if v.len() != 2 {
        env::panic(format!("{}", ERR42_INVALID_FARM_ID).as_bytes())
    }
    (v[0].to_string(), v[1].parse::<usize>().unwrap())
}

pub fn gen_farm_id(seed_id: &SeedId, index: usize) -> FarmId {
    format!("{}#{}", seed_id, index)
}

pub(crate) fn to_nano(timestamp: TimestampSec) -> Timestamp {
    Timestamp::from(timestamp) * 10u64.pow(9)
}

pub(crate) fn to_sec(timestamp: Timestamp) -> TimestampSec {
    (timestamp / 10u64.pow(9)) as u32
}
