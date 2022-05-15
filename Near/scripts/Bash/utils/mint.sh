export ZERO18=000000000000000000
if [ -z "$1" -o -z "$2" -o -z "$3" -o -z "$4" ]
then
    echo "FT_TRANSFER"
    echo "Missing args"
    echo "TokenToMint Receiver Amount RequestSender"
    exit
fi
npx near call $1 mint '{"account_id": "'$2'", "amount": "'$3''$ZERO18'"}' --account_id=$4