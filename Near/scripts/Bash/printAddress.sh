export ADDRESSES=$(cat ID.near)
export EX=$(echo $ADDRESSES | jq '.EX') 
export FARMING=$(echo $ADDRESSES | jq '.FARMING')
export TOKEN=$(echo $ADDRESSES | jq '.TOKEN')
export XTOKEN=$(echo $ADDRESSES | jq '.XTOKEN')
echo "export EX=$EX && export FARMING=$FARMING && export TOKEN=$TOKEN && export XTOKEN=$XTOKEN" 