export ZERO18=000000000000000000
if [ -z "$1" -o -z "$2" -o -z "$3" ]
then
    echo "STORAGE_DEPOSIT"
    echo "Missing args"
    echo "Contract AccountId RequestSender"
    exit
fi
npx near call $1 storage_deposit '{"account_id": "'$2'", "registration_only": true}' --account_id=$3 --amount 0.1