//! FarmSeed stores information per seed about 
//! staked seed amount and farms under it.

use std::collections::HashSet;
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::{Balance};
use near_sdk::serde::{Deserialize, Serialize};
use near_sdk::json_types::{U128};
use crate::errors::*;
use crate::farm::FarmId;
use crate::utils::parse_seed_id;


/// For MFT, SeedId composes of token_contract_id 
/// and token's inner_id in that contract. 
/// For FT, SeedId is the token_contract_id.
pub(crate) type SeedId = String;

#[derive(BorshSerialize, BorshDeserialize, Clone)]
pub enum SeedType {
    FT,
    MFT,
}


#[derive(BorshSerialize, BorshDeserialize)]
#[cfg_attr(feature = "test", derive(Clone))]
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
    /// the CD Account slash rate for this seed
    pub slash_rate: u32,
}

impl FarmSeed {
    pub fn new(seed_id: &SeedId, min_deposit: Balance, default_slash_rate: u32) -> Self {
        let (token_id, token_index) = parse_seed_id(seed_id);
        let seed_type: SeedType;
        if token_id == token_index {
            seed_type = SeedType::FT;
        } else {
            seed_type = SeedType::MFT;
        }
        Self {
            seed_id: seed_id.clone(),
            seed_type,
            farms: HashSet::new(),
            next_index: 0,
            total_seed_amount: 0,
            total_seed_power: 0,
            min_deposit,
            slash_rate: default_slash_rate,
        }
    }

    pub fn add_seed_amount(&mut self, amount: Balance) {
        self.total_seed_amount += amount;
    }

    /// return seed amount remains.
    pub fn sub_seed_amount(&mut self, amount: Balance) -> Balance {
        assert!(self.total_seed_amount >= amount, "{}", ERR500);
        self.total_seed_amount -= amount;
        self.total_seed_amount
    }

    pub fn add_seed_power(&mut self, amount: Balance) {
        self.total_seed_power += amount;
    }

    /// return seed power remains.
    pub fn sub_seed_power(&mut self, amount: Balance) -> Balance {
        assert!(self.total_seed_power >= amount, "{}", ERR500);
        self.total_seed_power -= amount;
        self.total_seed_power
    }

}

/// Versioned FarmSeed, used for lazy upgrade.
/// Which means this structure would upgrade automatically when used.
/// To achieve that, each time the new version comes in, 
/// each function of this enum should be carefully re-code!
#[derive(BorshSerialize, BorshDeserialize)]
pub enum VersionedFarmSeed {
    V101(FarmSeed),
}

impl VersionedFarmSeed {

    pub fn new(seed_id: &SeedId, min_deposit: Balance, default_slash_rate: u32) -> Self {
        VersionedFarmSeed::V101(FarmSeed::new(seed_id, min_deposit, default_slash_rate))
    }

    /// Upgrades from other versions to the currently used version.
    pub fn upgrade(self) -> Self {
        match self {
            VersionedFarmSeed::V101(farm_seed) => VersionedFarmSeed::V101(farm_seed),
        }
    }

    #[inline]
    #[allow(unreachable_patterns)]
    pub fn need_upgrade(&self) -> bool {
        match self {
            VersionedFarmSeed::V101(_) => false,
            _ => true,
        }
    }

    #[inline]
    #[allow(unreachable_patterns)]
    pub fn get_ref(&self) -> &FarmSeed {
        match self {
            VersionedFarmSeed::V101(farm_seed) => farm_seed,
            _ => unimplemented!(),
        }
    }

    #[inline]
    #[allow(unreachable_patterns)]
    pub fn get_ref_mut(&mut self) -> &mut FarmSeed {
        match self {
            VersionedFarmSeed::V101(farm_seed) => farm_seed,
            _ => unimplemented!(),
        }
    }
}


#[derive(Debug, Serialize, Deserialize, PartialEq, Clone)]
#[serde(crate = "near_sdk::serde")]
pub struct SeedInfo {
    pub seed_id: SeedId,
    pub seed_type: String,
    pub farms: Vec<FarmId>,
    pub next_index: u32,
    pub amount: U128,
    pub power: U128,
    pub min_deposit: U128,
    pub slash_rate: u32,
}

impl From<&FarmSeed> for SeedInfo {
    fn from(fs: &FarmSeed) -> Self {

        let seed_type = match fs.seed_type {
            SeedType::FT => "FT".to_string(),
            SeedType::MFT => "MFT".to_string(),
        };
        Self {
            seed_id: fs.seed_id.clone(),
            seed_type,
            next_index: fs.next_index,
            amount: fs.total_seed_amount.into(),
            power: fs.total_seed_power.into(),
            min_deposit: fs.min_deposit.into(),
            slash_rate: fs.slash_rate,
            farms: fs.farms.iter().map(|key| key.clone()).collect(),
        }
    }
}
