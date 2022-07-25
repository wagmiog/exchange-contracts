if [ -z "$1" -o -z "$2" -o -z "$3" -o -z "$4" -o -z "$5" ]
then
    echo "Single Side Staking"
    echo "Missing args"
    echo "PoolID RewardToken RewardPerSec SessionInterval amount"
    exit
fi
export pool_ID=$1
export reward_token=$2
export reward_per_sec=$3
export session_interval=$4
export AMOUNT=$5

sh utils/Farm/create_simple_farm.sh $pool_ID $reward_token 0 $reward_per_sec $session_interval $FARMING
sh utils/ft_transfer_call.sh $TOKEN $FARMING $AMOUNT {\\\"Reward\\\":{\\\"farm_id\\\":\\\"dev-1650966882894-35018349646207@2#4\\\"}} $TOKEN