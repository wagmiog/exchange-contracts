if [ -z "$1" -o -z "$2" -o -z "$3" ]
then
    echo "Single Side Staking"
    echo "Missing args"
    echo "Time Amount Reward_per_sec"
    exit
fi
export TIME=$1
export AMOUNT=$2
export REWARD_PER_SEC=$3

sh utils/XToken/reset_reward_time.sh $TIME $XTOKEN
sh utils/storage_deposit.sh $TOKEN $XTOKEN $TOKEN
sh utils/ft_transfer_call.sh $TOKEN $XTOKEN $AMOUNT reward $TOKEN
sh utils/XToken/modify_reward_per_sec.sh $REWARD_PER_SEC false $XTOKEN