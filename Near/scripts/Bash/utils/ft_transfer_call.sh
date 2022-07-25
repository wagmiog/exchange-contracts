export ZERO18=000000000000000000
if [ -z "$1" -o -z "$2" -o -z "$3" -o -z "$4" -o -z "$5" ]
then
    if [ -z "$1" -o -z "$2" -o -z "$3" -o -z "$4" ]
    then
        echo "FT_TRANSFER_CALL"
        echo "Missing args"
        echo "TokenToTransfer Receiver Amount Msg Sender"
        exit
    fi
    if [ -z "$5" ]
    then
        npx near call $1 ft_transfer_call '{"receiver_id": "'$2'", "amount": "'$3''$ZERO18'", "msg": ""}' --account_id=$5 --amount=0.000000000000000000000001 --gas=100000000000000
    fi
fi
npx near call $1 ft_transfer_call '{"receiver_id": "'$2'", "amount": "'$3''$ZERO18'", "msg": "'$4'"}' --account_id=$5 --amount=0.000000000000000000000001 --gas=100000000000000

