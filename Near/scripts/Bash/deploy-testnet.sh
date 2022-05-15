cd ref-contracts/ref-exchange
npx near dev-deploy ../res/ref_exchange_release.wasm
export EX=$(cat neardev/dev-account)
npx near call $EX new '{"owner_id":"'$EX'", "exchange_fee": 30, "referral_fee": 10}' --accountId $EX
cd ../ref-farming-v2
npx near dev-deploy ../res/ref_farming_v2_release.wasm
export FARMING=$(cat neardev/dev-account)
npx near call $FARMING new '{"owner_id":"'$FARMING'"}' --accountId $FARMING
cd ../../ref-token/ref-token
npx near dev-deploy ../res/ref_token_release.wasm
export TOKEN=$(cat neardev/dev-account)
npx near call $TOKEN new '{"owner":"'$TOKEN'", "total_supply": "230000000000000000000000000"}' --accountId $TOKEN
cd ../xref-token
npx near dev-deploy ../res/xref_token_release.wasm
export XTOKEN=$(cat neardev/dev-account)
npx near call $XTOKEN new '{"owner_id":"'$XTOKEN'", "locked_token": "'$TOKEN'"}' --accountId $XTOKEN

cd ../../
echo "export EX=$EX" "&&" "export FARMING=$FARMING" "&&" "export TOKEN=$TOKEN" "&&" "export XTOKEN=$XTOKEN"

echo "{\"EX\":\"$EX\",\"FARMING\":\"$FARMING\",\"TOKEN\":\"$TOKEN\",\"XTOKEN\":\"$XTOKEN\"}" > ID.near
