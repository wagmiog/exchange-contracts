exports.exchangeConst = {
    wasmPath: "../../../ref-contracts/res/ref_exchange_release.wasm",
    viewMethods: ["getMessages", "get_number_of_pools"],
    changeMethods: ["new"]
};
exports.farmingConst = {
    wasmPath: "../../../ref-contracts/res/ref_farming_v2_release.wasm",
    viewMethods: ["getMessages"],
    changeMethods: ["new"]
};
exports.tokenConst = {
    wasmPath: "../../../ref-token/res/ref_token_release.wasm",
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