while read account
do
    sh utils/storage_deposit.sh $TOKEN $account $TOKEN
    sh utils/ft_transfer.sh $TOKEN $account 1000 $TOKEN
done < list_addresses