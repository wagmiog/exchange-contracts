exports.exchangeConst = {
    wasmPath: "../../../ref-contracts/res/ref_exchange.wasm",
    viewMethods: ["getMessages", "get_number_of_pools"],
    changeMethods: ["new"]
};
exports.farmingConst = {
    wasmPath: "../../../ref-contracts/res/ref_farming_v2_release.wasm",
    viewMethods: ["getMessages"],
    changeMethods: ["new"]
};
exports.tokenConst = {
    wasmPath: "../../../ref-token/res/ref_token.wasm",
    viewMethods: ["getMessages"],
    changeMethods: ["new"]
};
exports.xTokenConst = {
    wasmPath: "../../../ref-token/res/xref_token_release.wasm",
    viewMethods: ["getMessages"],
    changeMethods: ["new"]
};
exports.vampireConst = {
    wasmPath: "../../../ref-contracts/res/ref_farming_v2.wasm",
    viewMethods: ["getMessages"],
    changeMethods: ["new"]
};

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