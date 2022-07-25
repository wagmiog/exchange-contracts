export ZERO18=000000000000000000
if [ -z "$1" -o -z "$2" -o -z "$3" -o -z "$4" -o -z "$5" -o -z "$6" ]
then
    echo "CREATE SIMPLE FARM"
    echo "Missing args"
    echo "poolID reward_token start_time reward_per_session session_interval sender"
    exit
fi
npx near call $FARMING create_simple_farm '{"terms": {"seed_id": "'$EX'@'$1'", "reward_token": "'$2'", "start_at": '$3', "reward_per_session": "'$4'", "session_interval": '$5'}}' --account_id=$6 --amount=0.01