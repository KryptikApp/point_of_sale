# Point Of Sale

This web application allows you to quickly accept digital payments. Identity and asset transfer are enabled by the internet computer project.

## Deployment

```{bash}
dfx identity new <new_name>
dfx identity use <new_name>
# get prinicapl for active id
dfx identity get-principal
# get address for acive id
dfx ledger account-id
# check balance
dfx ledger --network ic balance
# deploy canister container (to be used for wallet)
dfx ledger --network ic create-canister <principal> --amount <amount>
# create cycles wallet
dfx identity --network ic deploy-wallet <canister-identifer>
# add more funds to cycles wallet
dfx ledger --network ic top-up <wallet_id> --amount <amount>
```
