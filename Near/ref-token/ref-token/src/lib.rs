/*!
* Ref NEP-141 Token contract
*
*/
use near_contract_standards::fungible_token::metadata::{
    FungibleTokenMetadata, FungibleTokenMetadataProvider, FT_METADATA_SPEC,
};
use near_contract_standards::fungible_token::FungibleToken;
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::json_types::{ValidAccountId, U128};
// Needed by `impl_fungible_token_core` for old Rust.
#[allow(unused_imports)]
use near_sdk::env;
use near_sdk::{near_bindgen, AccountId, PanicOnDefault, PromiseOrValue};


near_sdk::setup_alloc!();

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize, PanicOnDefault)]
pub struct Contract {
    pub minter_id: AccountId,
    pub ft: FungibleToken,
}

#[near_bindgen]
impl Contract {
    #[init]
    pub fn new(minter_id: ValidAccountId) -> Self {
        Contract {
            minter_id: minter_id.as_ref().clone(),
            ft: FungibleToken::new(b"a".to_vec()),
        }
    }

    pub fn mint(&mut self, account_id: ValidAccountId, amount: U128) {
        self.assert_minter();
        self.ft
            .internal_deposit(account_id.as_ref(), amount.into());
    }

    #[payable]
    pub fn set_minter(&mut self, minter_id: ValidAccountId) {
        assert_one_yocto();
        self.assert_minter();
        self.minter_id = minter_id.as_ref().clone();
    }

    /// Get the minter of this account.
    pub fn get_minter(&self) -> AccountId {
        self.minter_id.clone()
    }

    pub(crate) fn assert_minter(&self) {
        assert_eq!(
            env::predecessor_account_id(),
            self.minter_id,
            "NOT ALLOWED"
        );
    }

    pub fn assert_one_yocto() {
        assert_eq!(env::attached_deposit(), 1, "Requires attached deposit of exactly 1 yoctoNEAR")
    }
}

near_contract_standards::impl_fungible_token_core!(Contract, ft);
near_contract_standards::impl_fungible_token_storage!(Contract, ft);

#[near_bindgen]
impl FungibleTokenMetadataProvider for Contract {
    fn ft_metadata(&self) -> FungibleTokenMetadata {
        let data_url = "";

        FungibleTokenMetadata {
            spec: FT_METADATA_SPEC.to_string(),
            name: String::from("Near Pangolin"),
            symbol: String::from("NPNG"),
            icon: Some(String::from(data_url)),
            reference: None,
            reference_hash: None,
            decimals: 18,
        }
    }
}
