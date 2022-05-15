export ZERO18=000000000000000000
if [ -z "$1" -o -z "$2" -o -z "$3" -o -z "$4" ]
then
    echo "ADD STABLE SWAP POOL"
    echo "Missing args"
    echo "TokenToTransfer Receiver Amount Msg Sender"
    exit
fi
npx near call $EX add_stable_swap_pool '{"tokens": '$1', "decimals": '$2', "fee": '$3', "amp_factor": 100000}' --account_id=$4 --amount=1