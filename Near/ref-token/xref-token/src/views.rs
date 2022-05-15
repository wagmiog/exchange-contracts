//! View functions for the contract.

use crate::*;
use near_sdk::serde::{Deserialize, Serialize};

#[derive(Serialize)]
#[serde(crate = "near_sdk::serde")]
#[cfg_attr(not(target_arch = "wasm32"), derive(Deserialize, Debug))]
pub struct ContractMetadata {
    pub version: String,
    pub owner_id: AccountId,
    pub locked_token: AccountId,
    // at prev_distribution_time, the amount of undistributed reward
    pub undistributed_reward: U128,
    // at prev_distribution_time, the amount of staked token
    pub locked_token_amount: U128,
    // at call time, the amount of undistributed reward
    pub cur_undistributed_reward: U128,
    // at call time, the amount of staked token
    pub cur_locked_token_amount: U128,
    // cur XREF supply
    pub supply: U128,
    pub prev_distribution_time_in_sec: u32,
    pub reward_genesis_time_in_sec: u32,
    pub reward_per_sec: U128,
    /// current account number in contract
    pub account_number: u64,
}

#[near_bindgen]
impl Contract {
    /// Return contract basic info
    pub fn contract_metadata(&self) -> ContractMetadata {
        let to_be_distributed =
            self.try_distribute_reward(nano_to_sec(env::block_timestamp()));
        ContractMetadata {
            version: env!("CARGO_PKG_VERSION").to_string(),
            owner_id: self.owner_id.clone(),
            locked_token: self.locked_token.clone(),
            undistributed_reward: self.undistributed_reward.into(),
            locked_token_amount: self.locked_token_amount.into(),
            cur_undistributed_reward: (self.undistributed_reward - to_be_distributed).into(),
            cur_locked_token_amount: (self.locked_token_amount + to_be_distributed).into(),
            supply: self.ft.total_supply.into(),
            prev_distribution_time_in_sec: self.prev_distribution_time_in_sec,
            reward_genesis_time_in_sec: self.reward_genesis_time_in_sec,
            reward_per_sec: self.reward_per_sec.into(),
            account_number: self.account_number,
        }
    }

    // get the X-REF / REF price in decimal 8
    pub fn get_virtual_price(&self) -> U128 {
        if self.ft.total_supply == 0 {
            100_000_000.into()
        } else {
            ((self.locked_token_amount
                + self.try_distribute_reward(nano_to_sec(env::block_timestamp())))
                * 100_000_000
                / self.ft.total_supply)
                .into()
        }
    }
}
