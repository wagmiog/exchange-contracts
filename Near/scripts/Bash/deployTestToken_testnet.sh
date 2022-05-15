cd ref-token/test-token

npx near dev-deploy ../res/test_token.wasm
export OGS=$(cat neardev/dev-account)
npx near call $OGS new '{"name": "OriginalGS", "symbol": "OGS", "decimals": 18}' --accountId $OGS
mv neardev OGS
npx near dev-deploy ../res/test_token.wasm
export DNS=$(cat neardev/dev-account)
npx near call $DNS new '{"name": "Dinos", "symbol": "DNS", "decimals": 18}' --accountId $DNS
mv neardev DNS
npx near dev-deploy ../res/test_token.wasm
export SLS=$(cat neardev/dev-account)
npx near call $SLS new '{"name": "Space Launch System", "symbol": "SLS", "decimals": 18}' --accountId $SLS
mv neardev SLS
npx near dev-deploy ../res/test_token.wasm
export TM=$(cat neardev/dev-account)
npx near call $TM new '{"name": "Time", "symbol": "TM", "decimals": 18}' --accountId $TM
mv neardev TM
npx near dev-deploy ../res/test_token.wasm
export PCC=$(cat neardev/dev-account)
npx near call $PCC new '{"name": "Pichichi", "symbol": "PCC", "decimals": 18}' --accountId $PCC
mv neardev PCC
npx near dev-deploy ../res/test_token.wasm
export DEX=$(cat neardev/dev-account)
npx near call $DEX new '{"name": "Deus Ex", "symbol": "DEX", "decimals": 18}' --accountId $DEX
mv neardev DEX
npx near dev-deploy ../res/test_token.wasm
export FBTC=$(cat neardev/dev-account)
npx near call $FBTC new '{"name": "Fake Bitcoin", "symbol": "FBTC", "decimals": 18}' --accountId $FBTC
mv neardev FBTC
npx near dev-deploy ../res/test_token.wasm
export FUSDC=$(cat neardev/dev-account)
npx near call $FUSDC new '{"name": "Fake USDC", "symbol": "FUSDC", "decimals": 18}' --accountId $FUSDC
mv neardev FUSDC
npx near dev-deploy ../res/test_token.wasm
export FUSDT=$(cat neardev/dev-account)
npx near call $FUSDT new '{"name": "Fake USDT", "symbol": "FUSDT", "decimals": 18}' --accountId $FUSDT
mv neardev FUSDT
npx near dev-deploy ../res/test_token.wasm
export FDAI=$(cat neardev/dev-account)
npx near call $FDAI new '{"name": "Fake DAI", "symbol": "FDAI", "decimals": 18}' --accountId $FDAI
mv neardev FDAI

cd ../../
echo '{"name": "OriginalGS", "id": "'$OGS'"}' > TestNetTokens.txt
echo '{"name": "Dinos", "id": "'$DNS'"}' >> TestNetTokens.txt
echo '{"name": "Space Launch System", "id": "'$SLS'"}' >> TestNetTokens.txt
echo '{"name": "Time", "id": "'$TM'"}' >> TestNetTokens.txt
echo '{"name": "Pichichi", "id": "'$PCC'"}' >> TestNetTokens.txt
echo '{"name": "Deux Ex", "id": "'$DEX'"}' >> TestNetTokens.txt
echo '{"name": "Fake Bitcoin", "id": "'$FBTC'"}' >> TestNetTokens.txt
echo '{"name": "Fake USDC", "id": "'$FUSDC'"}' >> TestNetTokens.txt
echo '{"name": "Fake USDT", "id": "'$FUSDT'"}' >> TestNetTokens.txt
echo '{"name": "Fake DAI", "id": "'$FDAI'"}' >> TestNetTokens.txt
echo "*/*/*/*/*/*/*/*/*/*/*/LAST LINE\*\*\*\*\*\*\*\*\*\*\*" >> TestNetTokens.txt

#sh transferNPNG_testnet.sh
#sh transferTestToken_testnet.sh


