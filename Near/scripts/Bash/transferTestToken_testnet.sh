while read tokens
do
    export TestTOKEN=$(echo $tokens | jq '.id')
    while read account
    do
        sh utils/storage_deposit.sh $TestTOKEN $account $TestTOKEN
        sh utils/mint.sh $TestTOKEN $account 1000 $TestTOKEN
    done < list_addresses

done < TestNetTokens.txt