export ZERO18=000000000000000000
if [ -z "$1" -o -z "$2" ]
then
    echo "MODIFY_REWARD_PER_SEC"
    echo "Missing args"
    echo "Time Sender"
    exit
fi
npx near call $XTOKEN reset_reward_genesis_time_in_sec '{"reward_genesis_time_in_sec": '$1'}' --account_id=$2