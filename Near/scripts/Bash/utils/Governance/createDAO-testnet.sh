export ACCOUNTS=
for account in "$@"
do
    if [ "$account" = "$1" -o "$account" = "$2" -o "$account" = "$3" ]
    then
        export NAME=$1
        export PURPOSE=$2
        export PRICE=$3
    elif [ -z "$ACCOUNTS" ]
    then
        export ACCOUNTS='["'$account'"'
    else
        export ACCOUNTS="$ACCOUNTS"', "'$account'"'
    fi
done
export ACCOUNTS="$ACCOUNTS"']'
export ARGS=`echo '{"config": {"name": "'$NAME'", "purpose": "'$PURPOSE'", "metadata":""}, "policy": '$ACCOUNTS'}' | base64`
npx near call sputnik-v2.testnet create '{"name": "simodao", "args": "'$ARGS'"}' --accountId 0xsimo.testnet --amount $PRICE --gas 150000000000000