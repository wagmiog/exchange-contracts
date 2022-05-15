exports.CONTRACTS = {
    exchange: "dev-1650966882894-35018349646207",
    farming: "dev-1650966900941-97217298551664",
    token: "dev-1650966914129-56221028891622",
    xToken: "dev-1651038298465-10173938691391"
};
exports.MINTER = "0xsimo.testnet"
exports.OWNER = "0xsimo.testnet"
exports.FEES = {
    exchange_fee: 30,
    referral_fee: 10
}

exports.STAKING = {
    reward_genesis_time_in_sec: 1548941263,
    reward_per_sec: "1000000000000000000"
    distribute_before_change: false
}

exports.FARMS = [
    {
        poolId: 1,
        rewardToken: "dev-1650954366998-91412718863128",
        start_at: 15648978412,
        reward_per_session: 1,
        session_interval: 1000
    },
    {
        poolId: 2,
        rewardToken: this.CONTRACTS.token,
        start_at: 15648978412,
        reward_per_session: 1,
        session_interval: 1000,
        amountRewardToken: "0"
    }
]

exports.TESTTOKEN = {
    OGS: "dev-1650954366998-91412718863128",
    DNS: "dev-1650954384223-67276671787968",
    SLS: "dev-1650954398448-25828373195625",
    TIME: "dev-1650954410528-79900618307564",
    PCC: "dev-1650954427217-27721481734390",
    DEX: "dev-1650954441809-80962838537153",
    FBTC: "dev-1650954456377-50298924037069",
    FUSDC: "dev-1650954469424-66287698100259",
    FUSDT: "dev-1650954487434-33761151294954",
    FDAI: "dev-1650954499525-96253036746817"
}

