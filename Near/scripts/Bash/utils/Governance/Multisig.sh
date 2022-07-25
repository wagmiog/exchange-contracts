export ACCOUNTS=
for account in "$@"
do
    echo $ACCOUNTS
    if [ "$account" = "$1" ]
    then
        export THRESHOLD=$1
    elif [ -z "$ACCOUNTS" ]
    then
        export ACCOUNTS='[{"account_id": "'$account'"}'
    else
        export ACCOUNTS="$ACCOUNTS"', {"account_id": "'$account'"}'
    fi
done
export ACCOUNTS="$ACCOUNTS"']'
cd governance/multisig
npx near dev-deploy ../res/multisig.wasm 
export MULTISIG=$(cat neardev/dev-account)
npx near call $MULTISIG new '{"members": '$ACCOUNTS', "num_confirmations": '$THRESHOLD'}' --accountId $MULTISIG