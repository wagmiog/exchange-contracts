export ZERO18=000000000000000000
if [ -z "$1" -o -z "$2" -o -z "$3" -o -z "$4" ]
then
    echo "FT_TRANSFER"
    echo "Missing args"
    echo "TokenToTransfer Receiver Amount Sender"
    exit
fi
npx near call $1 ft_transfer '{"receiver_id": "'$2'", "amount": "'$3''$ZERO18'"}' --account_id=$4 --amount=0.000000000000000000000001 --gas=100000000000000