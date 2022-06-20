exports.CONTRACTS = {
    exchange: "png-exchange-v1.testnet",
    farming: "png-farm-v1.testnet",
    token: "png-token-v1.testnet",
    xToken: "png-xtoken-v1.testnet",
    vampire: "png-vampire-v2.testnet"
};

exports.OWNER = "0xsimo.testnet"
exports.MINTER = "0xsimo.testnet"
exports.FEES = {
    exchange_fee: 20,
    referral_fee: 20
}

exports.STAKING = {
    reward_genesis_time_in_sec: 1653512400,
    reward_per_sec: "1000000000000000000",
    distribute_before_change: false
}

exports.FARMS = [
    {
        poolId: 1,
        rewardToken: "png-token-v1.testnet",
        start_at: 1653512400,
        reward_per_session: "1",
        session_interval: 1000
    },
    {
        poolId: 2,
        rewardToken: this.CONTRACTS.token,
        start_at: 1653512400,
        reward_per_session: "1",
        session_interval: 1000,
        amountRewardToken: "0"
    }
]

exports.VFARMS = [
    {
        poolId: 0,
        rewardToken: "png-token-v1.testnet",
        start_at: 1653512400,
        reward_per_session: "1",
        session_interval: 1000,
        amountRewardToken: "10000000000000000000"
    },
]



