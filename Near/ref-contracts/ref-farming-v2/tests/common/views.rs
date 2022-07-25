use near_sdk::json_types::{U128, U64};
use near_sdk::serde::{Deserialize, Serialize};
use near_sdk_sim::{view, ContractAccount};

use super::utils::to_va;
use ref_farming_v2::{ContractContract as Farming, FarmInfo, CDStrategyInfo, UserSeedInfo};
use std::collections::HashMap;

#[derive(Serialize, Deserialize, Clone)]
#[serde(crate = "near_sdk::serde")]
pub struct Metadata {
    pub version: String,
    pub owner_id: String,
    pub operators: Vec<String>,
    pub farmer_count: U64,
    pub farm_count: U64,
    pub seed_count: U64,
    pub reward_count: U64,
    pub farm_expire_sec: u32,
}


#[derive(Debug, Serialize, Deserialize, PartialEq, Clone)]
#[serde(crate = "near_sdk::serde")]
pub struct SeedInfo {
    pub seed_id: String,
    pub seed_type: String,
    pub farms: Vec<String>,
    pub next_index: u32,
    pub amount: U128,
    pub power: U128,
    pub min_deposit: U128,
    pub slash_rate: u32,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(crate = "near_sdk::serde")]
pub struct StorageBalance {
    pub total: U128,
    pub available: U128,
}

#[allow(dead_code)]
pub fn get_metadata(farming: &ContractAccount<Farming>) -> Metadata {
    view!(farming.get_metadata()).unwrap_json::<Metadata>()
}

#[allow(dead_code)]
pub(crate) fn show_farms_by_seed(
    farming: &ContractAccount<Farming>,
    seed_id: String,
    show_print: bool,
) -> Vec<FarmInfo> {
    let farms_info = view!(farming.list_farms_by_seed(seed_id)).unwrap_json::<Vec<FarmInfo>>();
    if show_print {
        println!("Farms Info has {} farms ===>", farms_info.len());
        for farm_info in farms_info.iter() {
            println!(
                "  ID:{}, Status:{}, Seed:{}, Reward:{}",
                farm_info.farm_id, farm_info.farm_status, farm_info.seed_id, farm_info.reward_token
            );
            println!(
                "  StartAt:{}, SessionReward:{}, SessionInterval:{}",
                farm_info.start_at, farm_info.reward_per_session.0, farm_info.session_interval
            );
            println!(
                "  TotalReward:{}, Claimed:{}, Unclaimed:{}, LastRound:{}, CurRound:{}",
                farm_info.total_reward.0,
                farm_info.claimed_reward.0,
                farm_info.unclaimed_reward.0,
                farm_info.last_round,
                farm_info.cur_round
            );
        }
    }
    farms_info
}

#[allow(dead_code)]
pub(crate) fn show_farminfo(
    farming: &ContractAccount<Farming>,
    farm_id: String,
    show_print: bool,
) -> FarmInfo {
    let farm_info = get_farminfo(farming, farm_id);
    if show_print {
        println!("Farm Info ===>");
        println!(
            "  ID:{}, Status:{}, Seed:{}, Reward:{}",
            farm_info.farm_id, farm_info.farm_status, farm_info.seed_id, farm_info.reward_token
        );
        println!(
            "  StartAt:{}, SessionReward:{}, SessionInterval:{}",
            farm_info.start_at, farm_info.reward_per_session.0, farm_info.session_interval
        );
        println!(
            "  TotalReward:{}, Claimed:{}, Unclaimed:{}, LastRound:{}, CurRound:{}",
            farm_info.total_reward.0,
            farm_info.claimed_reward.0,
            farm_info.unclaimed_reward.0,
            farm_info.last_round,
            farm_info.cur_round
        );
    }
    farm_info
}

#[allow(dead_code)]
pub(crate) fn show_outdated_farms(
    farming: &ContractAccount<Farming>,
    show_print: bool,
) -> Vec<FarmInfo> {
    let outdated_farms_info = view!(farming.list_outdated_farms(0, 100)).unwrap_json::<Vec<FarmInfo>>();
    if show_print {
        println!("Farms Info has {} farms ===>", outdated_farms_info.len());
        for farm_info in outdated_farms_info.iter() {
            println!(
                "  ID:{}, Status:{}, Seed:{}, Reward:{}",
                farm_info.farm_id, farm_info.farm_status, farm_info.seed_id, farm_info.reward_token
            );
            println!(
                "  StartAt:{}, SessionReward:{}, SessionInterval:{}",
                farm_info.start_at, farm_info.reward_per_session.0, farm_info.session_interval
            );
            println!(
                "  TotalReward:{}, Claimed:{}, Unclaimed:{}, LastRound:{}, CurRound:{}",
                farm_info.total_reward.0,
                farm_info.claimed_reward.0,
                farm_info.unclaimed_reward.0,
                farm_info.last_round,
                farm_info.cur_round
            );
        }
    }
    outdated_farms_info
}

#[allow(dead_code)]
pub(crate) fn show_outdated_farminfo(
    farming: &ContractAccount<Farming>,
    farm_id: String,
    show_print: bool,
) -> FarmInfo {
    let farm_info = get_outdated_farminfo(farming, farm_id);
    if show_print {
        println!("Farm Info ===>");
        println!(
            "  ID:{}, Status:{}, Seed:{}, Reward:{}",
            farm_info.farm_id, farm_info.farm_status, farm_info.seed_id, farm_info.reward_token
        );
        println!(
            "  StartAt:{}, SessionReward:{}, SessionInterval:{}",
            farm_info.start_at, farm_info.reward_per_session.0, farm_info.session_interval
        );
        println!(
            "  TotalReward:{}, Claimed:{}, Unclaimed:{}, LastRound:{}, CurRound:{}",
            farm_info.total_reward.0,
            farm_info.claimed_reward.0,
            farm_info.unclaimed_reward.0,
            farm_info.last_round,
            farm_info.cur_round
        );
    }
    farm_info
}

#[allow(dead_code)]
pub(crate) fn show_seedsinfo(
    farming: &ContractAccount<Farming>,
    show_print: bool,
) -> HashMap<String, SeedInfo> {
    let ret = view!(farming.list_seeds_info(0, 100)).unwrap_json::<HashMap<String, SeedInfo>>();
    if show_print {
        for (k, v) in &ret {
            println!("FarmSeed=>  {}: {:#?}", k, v);
        }
    }
    ret
}

#[allow(dead_code)]
pub(crate) fn show_user_seed_amounts(
    farming: &ContractAccount<Farming>,
    user_id: String,
    show_print: bool,
) -> HashMap<String, U128> {
    let ret = view!(farming.list_user_seed_amounts(to_va(user_id.clone())))
        .unwrap_json::<HashMap<String, U128>>();
    if show_print {
        println!("User Seeds for {}: {:#?}", user_id, ret);
    }
    ret
}

#[allow(dead_code)]
pub(crate) fn show_user_seed_powers(
    farming: &ContractAccount<Farming>,
    user_id: String,
    show_print: bool,
) -> HashMap<String, U128> {
    let ret = view!(farming.list_user_seed_powers(to_va(user_id.clone())))
        .unwrap_json::<HashMap<String, U128>>();
    if show_print {
        println!("User Seeds for {}: {:#?}", user_id, ret);
    }
    ret
}

#[allow(dead_code)]
pub(crate) fn show_unclaim(
    farming: &ContractAccount<Farming>,
    user_id: String,
    farm_id: String,
    show_print: bool,
) -> U128 {
    let farm_info = get_farminfo(farming, farm_id.clone());
    let ret = view!(farming.get_unclaimed_reward(to_va(user_id.clone()), farm_id.clone()))
        .unwrap_json::<U128>();
    if show_print {
        println!(
            "User Unclaimed for {}@{}:[CRR:{}, LRR:{}] {}",
            user_id, farm_id, farm_info.cur_round, farm_info.last_round, ret.0
        );
    }
    ret
}

#[allow(dead_code)]
pub(crate) fn show_reward(
    farming: &ContractAccount<Farming>,
    user_id: String,
    reward_id: String,
    show_print: bool,
) -> U128 {
    let ret = view!(farming.get_reward(to_va(user_id.clone()), to_va(reward_id.clone())))
        .unwrap_json::<U128>();
    if show_print {
        println!("Reward {} for {}: {}", reward_id, user_id, ret.0);
    }
    ret
}

#[allow(dead_code)]
pub(crate) fn show_storage_balance(farming: &ContractAccount<Farming>, farmer: String, show_print: bool) -> StorageBalance {
    let ret = view!(farming.storage_balance_of(to_va(farmer.clone()))).unwrap_json::<StorageBalance>();
    if show_print {
        println!("total {}, available {}", ret.total.0, ret.available.0);
    }
    ret
}

#[allow(dead_code)]
pub(crate) fn show_lostfound(
    farming: &ContractAccount<Farming>,
    show_print: bool,
) -> HashMap<String, U128> {
    let ret = view!(farming.list_lostfound(0, 100)).unwrap_json::<HashMap<String, U128>>();
    if show_print {
        for (k, v) in &ret {
            println!("FarmSeed=>  {}: {:#?}", k, v);
        }
    }
    ret
}

#[allow(dead_code)]
pub(crate) fn show_shashed(
    farming: &ContractAccount<Farming>,
    show_print: bool,
) -> HashMap<String, U128> {
    let ret = view!(farming.list_shashed(0, 100)).unwrap_json::<HashMap<String, U128>>();
    if show_print {
        for (k, v) in &ret {
            println!("FarmSeed=>  {}: {:#?}", k, v);
        }
    }
    ret
}

#[allow(dead_code)]
pub(crate) fn get_user_rps(
    farming: &ContractAccount<Farming>,
    user_id: String,
    farm_id: String,
) -> Option<String> {
    view!(farming.get_user_rps(to_va(user_id), farm_id)).unwrap_json::<Option<String>>()
}

#[allow(dead_code)]
pub(crate) fn get_user_seed_info(
    farming: &ContractAccount<Farming>,
    user_id: String,
    seed_id: String,
) -> UserSeedInfo {
    view!(farming.get_user_seed_info(to_va(user_id), seed_id.clone())).unwrap_json::<UserSeedInfo>()
}

// =============  Assertions  ===============
#[allow(dead_code)]
pub(crate) fn assert_farming(
    farm_info: &FarmInfo,
    farm_status: String,
    total_reward: u128,
    cur_round: u32,
    last_round: u32,
    claimed_reward: u128,
    unclaimed_reward: u128,
    beneficiary_reward: u128,
) {
    assert_eq!(farm_info.farm_status, farm_status);
    assert_eq!(farm_info.total_reward.0, total_reward);
    assert_eq!(farm_info.cur_round, cur_round);
    assert_eq!(farm_info.last_round, last_round);
    assert_eq!(farm_info.claimed_reward.0, claimed_reward);
    assert_eq!(farm_info.unclaimed_reward.0, unclaimed_reward);
    assert_eq!(farm_info.beneficiary_reward.0, beneficiary_reward);
}

#[allow(dead_code)]
pub(crate) fn assert_strategy(
    strategy_info: &CDStrategyInfo,
    index: usize,
    lock_sec: u32,
    additional: u32,
    enable: bool,
    damage: u32,
) {
    assert_eq!(strategy_info.stake_strategy[index].lock_sec, lock_sec);
    assert_eq!(strategy_info.stake_strategy[index].power_reward_rate, additional);
    assert_eq!(strategy_info.stake_strategy[index].enable, enable);
    assert_eq!(strategy_info.seed_slash_rate, damage);
}

// =============  internal methods ================
fn get_farminfo(farming: &ContractAccount<Farming>, farm_id: String) -> FarmInfo {
    view!(farming.get_farm(farm_id)).unwrap_json::<FarmInfo>()
}

fn get_outdated_farminfo(farming: &ContractAccount<Farming>, farm_id: String) -> FarmInfo {
    view!(farming.get_outdated_farm(farm_id)).unwrap_json::<FarmInfo>()
}

