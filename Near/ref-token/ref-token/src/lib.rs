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
        let data_url = "data:image/svg+xml;base64,PHN2ZyBpZD0ia2F0bWFuXzEiIGRhdGEtbmFtZT0ia2F0bWFuIDEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgdmlld0JveD0iMCAwIDEwODAgMTA4MCI+PGRlZnM+PHN0eWxlPi5jbHMtMXtmaWxsOiNmZmM4MDA7fS5jbHMtMntmaWxsOiNlMWFhMDA7fS5jbHMtM3tmaWxsOiNmZmY7fTwvc3R5bGU+PC9kZWZzPjxwb2x5Z29uIGNsYXNzPSJjbHMtMSIgcG9pbnRzPSI0MjEuODQgMzQ2LjcxIDQwMy45MyA0MDEuNjkgNTI3Ljk5IDQ5MS45NSA1MjguMDUgNDkxLjkxIDUyOC4wNSA0MjMuOSA1MjcuOTkgNDIzLjk0IDQyMS44NCAzNDYuNzEiLz48cG9seWdvbiBjbGFzcz0iY2xzLTEiIHBvaW50cz0iNjU4LjE2IDM0Ni44IDU1MS44OSA0MjMuOSA1NTEuODkgNDkxLjkxIDY3Ni4wMSA0MDEuODcgNjU4LjE2IDM0Ni44Ii8+PHBvbHlnb24gY2xhc3M9ImNscy0xIiBwb2ludHM9IjQwNC4xOSA2MTEuNDYgNDAzLjkzIDYxMi4yNiA1MjcuOTkgNzAyLjUyIDUyOC4wNSA3MDIuNDggNTI4LjA1IDUyMS42MSA0MTcuNjMgNjAxLjcxIDQwNC4xOSA2MTEuNDYiLz48cG9seWdvbiBjbGFzcz0iY2xzLTEiIHBvaW50cz0iNjYyLjIxIDYwMS42OSA1NTIuMDIgNTIxLjUxIDU1MS44OSA1MjEuNjEgNTUxLjg5IDcwMi40OCA2NzYuMDEgNjEyLjQ0IDY3NS43MSA2MTEuNTEgNjYyLjIxIDYwMS42OSIvPjxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTgwMi43Myw0MjlhMjgzLjU2LDI4My41NiwwLDAsMC00OC4wOC03Ni43MWMtMS42My0xLjg3LTMuMy0zLjcxLTUtNS41NC0yLjYyLTIuODMtNS4yOS01LjY0LTgtOC4zOGEyODUsMjg1LDAsMCwwLTQwMy4yOCwwYy0yLjcxLDIuNzEtNS4zNCw1LjQ4LTcuOTMsOC4yN3EtMi40NCwyLjY1LTQuODEsNS4zNWEyODUuMDksMjg1LjA5LDAsMSwwLDQ3Ny4xMSw3N1pNNjM2LjMsNzU3Ljc0LDY3Niw3MjguOTQsNjUzLDY1OGwtODcuNDYsNjMuNDUtMTMuNjcsOS45MXY0Ni4zOGMtMy45NC4xOS03LjkuMy0xMS44OS4zcy04LS4xMS0xMi0uM1Y3MzEuMzdsLS4wOS4wNi0xMy43NC0xMEw0MjcsNjU4bC0yMy4wNiw3MC44LDM5Ljk0LDI5LjA2QzM2MC4yOSw3MjAuODgsMzAyLDYzNy4yNiwzMDIsNTQwYTI0MiwyNDIsMCwwLDEsMS44OC0zMGwxMDAuMDYsNzIuODEsMTA0Ljc1LTc2TDM5MC4xNyw0MjAuNmwtMTMuNzQtMTAsNS4yNi0xNi4xNiwxNC4zNC00NGEyMzgsMjM4LDAsMCwxLDI4Ny44OC0uMDVsMTQuMzUsNDQuMjgsNS4yNCwxNi4xNi0xMy43NiwxMEw1NzEuMzcsNTA2LjY3LDY3Niw1ODIuNzhsMTAwLjIxLTcyLjY5QTI0MC4wNywyNDAuMDcsMCwwLDEsNzc4LjA1LDU0MEM3NzguMDUsNjM3LjE5LDcxOS43OSw3MjAuNzYsNjM2LjMsNzU3Ljc0WiIvPjxwYXRoIGNsYXNzPSJjbHMtMiIgZD0iTTU0MCwyNjdhMjczLDI3MywwLDEsMS0xOTMuMDgsODBBMjcxLjMsMjcxLjMsMCwwLDEsNTQwLDI2N20wLTE1LjA4Yy0xNTkuMTMsMC0yODguMTMsMTI5LTI4OC4xMywyODguMTNTMzgwLjg3LDgyOC4xMyw1NDAsODI4LjEzLDgyOC4xMyw2OTkuMTMsODI4LjEzLDU0MCw2OTkuMTMsMjUxLjg3LDU0MCwyNTEuODdaIi8+PHBhdGggY2xhc3M9ImNscy0yIiBkPSJNNjcyLjgzLDcxOS4xMyw2MzYuMyw3NTcuNzRzMzAuNTktMTMuMDcsNTAtMzBMNjc2LDcyOC45NFoiLz48cGF0aCBjbGFzcz0iY2xzLTIiIGQ9Ik00MDcuMTcsNzE5LjEzbDM2LjUzLDM4LjYxcy0zMC41OS0xMy4wNy01MC0zMEw0MDQsNzI4Ljk0WiIvPjxwYXRoIGNsYXNzPSJjbHMtMiIgZD0iTTQwMy44OSw1ODIuNzgsMzA4LjcxLDQ2NS4xM3MtMywxMS4zNS00Ljg4LDQ0Ljg0WiIvPjxwYXRoIGNsYXNzPSJjbHMtMiIgZD0iTTY3Ni4xMSw1ODIuNzhsOTUuMTgtMTE3LjY1czMsMTEuMzUsNC44OCw0NC44NFoiLz48cG9seWdvbiBjbGFzcz0iY2xzLTIiIHBvaW50cz0iNDAzLjkzIDYxMi4yNiA1MjguMDUgNjY1Ljk1IDUyOC4wNSA3MDIuNDggNDAzLjkzIDYxMi4yNiIvPjxwb2x5Z29uIGNsYXNzPSJjbHMtMiIgcG9pbnRzPSI2NzYuMDcgNjEyLjI2IDU1MS45NSA2NjUuOTUgNTUxLjk1IDcwMi40OCA2NzYuMDcgNjEyLjI2Ii8+PHBvbHlnb24gY2xhc3M9ImNscy0yIiBwb2ludHM9IjUyOC4wNSA0NjguMzcgNDAzLjkzIDQwMS42OSA1MjcuOTkgNDkxLjk1IDUyOC4wNSA0NjguMzciLz48cG9seWdvbiBjbGFzcz0iY2xzLTIiIHBvaW50cz0iNTUxLjk1IDQ2OC4zNyA2NzYuMDcgNDAxLjY5IDU1Mi4wMSA0OTEuOTUgNTUxLjk1IDQ2OC4zNyIvPjxjaXJjbGUgY2xhc3M9ImNscy0yIiBjeD0iNjg0LjA3IiBjeT0iNjg0LjA3IiByPSIxNDQuMDciLz48Y2lyY2xlIGN4PSI2ODQuMDciIGN5PSI2ODQuMDciIHI9IjExOC4yMSIvPjxnIGlkPSJMYXllcl8xIiBkYXRhLW5hbWU9IkxheWVyIDEiPjxwYXRoIGNsYXNzPSJjbHMtMyIgZD0iTTcyMS40MSw2MjguNjNsLTI1Ljc5LDM4LjNhMi43NCwyLjc0LDAsMCwwLDQuMDcsMy42bDI1LjM5LTIyYTEsMSwwLDAsMSwxLjQ1LjA5LDEsMSwwLDAsMSwuMjYuNjl2NjlhMSwxLDAsMCwxLTEsMSwxLjA2LDEuMDYsMCwwLDEtLjc5LS4zN0w2NDguMjMsNjI3YTEzLjE1LDEzLjE1LDAsMCwwLTEwLTQuNjVoLTIuNjlhMTMuMTQsMTMuMTQsMCwwLDAtMTMuMTQsMTMuMTR2OTcuMTFhMTMuMTQsMTMuMTQsMCwwLDAsMTMuMTQsMTMuMTRoMGExMy4xNiwxMy4xNiwwLDAsMCwxMS4yMS02LjI2bDI1Ljc5LTM4LjNhMi43NCwyLjc0LDAsMCwwLTQuMDctMy42bC0yNS4zOSwyMmExLDEsMCwwLDEtMS40NS0uMDgsMS4wOCwxLjA4LDAsMCwxLS4yNi0uN3YtNjlhMSwxLDAsMCwxLDEtMSwxLDEsMCwwLDEsLjc5LjM2bDc2LjczLDkxLjg5YTEzLjE2LDEzLjE2LDAsMCwwLDEwLDQuNjVoMi42OGExMy4xNCwxMy4xNCwwLDAsMCwxMy4xNS0xMy4xM2gwVjYzNS41MWExMy4xNCwxMy4xNCwwLDAsMC0xMy4xNC0xMy4xNGgwQTEzLjE2LDEzLjE2LDAsMCwwLDcyMS40MSw2MjguNjNaIi8+PC9nPjwvc3ZnPg==";

        FungibleTokenMetadata {
            spec: FT_METADATA_SPEC.to_string(),
            name: String::from("Pangolin Near"),
            symbol: String::from("PNR"),
            icon: Some(String::from(data_url)),
            reference: None,
            reference_hash: None,
            decimals: 18,
        }
    }
}
