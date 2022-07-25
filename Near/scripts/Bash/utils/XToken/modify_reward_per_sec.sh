export ZERO18=000000000000000000
if [ -z "$1" -o -z "$2" -o -z "$3" ]
then
    echo "MODIFY_REWARD_PER_SEC"
    echo "Missing args"
    echo "Receiver Amount Sender"
    exit
fi
npx near call $XTOKEN modify_reward_per_sec '{"reward_per_sec": "'$1'", "distribute_before_change": '$2'}' --account_id=$3 --gas=100000000000000