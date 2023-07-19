# Point of Sale

**Kryptik Pay** is a simple way to accept online payments. The first asset supported is the ckBTC token, which lives on the Internet Computer. 


## Features
- Authenticate with the Internet Identity standard
- Display a QR code for customers to scan
- Unique URLs for each payment page
- Custom store themes
- Send ckBTC with native support for scanning
- Realtime payment alerts

## Try It!
Go [here](https://pay.kryptik.app/) for a live demo.

## Notes
The production frontend is deployed on Vercel to enable dynamic routes and multiple entry points. Eventually, we would like to host the front end on the Internet Computer.

We would also like to expand support beyond ckBtc. The more options we can provide merchants, the better. Finally, we are also working on additional customization support for merchants, starting with business thumbnails. 

The backend notification system is in development; ETA: 24 hours. 

## Deployment

Once dependencies are installed, we can deploy the app to the Internet Computer. 

1. Create a new identity to use for your cycle wallet.
```{bash}
dfx identity new <new_name>
dfx identity use <new_name>
```
2. Get identity metadata.
```{bash}
# get principal for active id
dfx identity get-principal
# get address for active id
dfx ledger account-id
# check balance
dfx ledger --network ic balance
```
3. Deploy the canister and create a new cycle wallet.
```{bash}
# deploy canister container (to be used for the wallet)
dfx ledger --network ic create-canister <principal> --amount <amount>
# create cycles wallet
dfx identity --network ic deploy-wallet <canister-identifer>
# add more funds to cycles wallet
dfx ledger --network ic top-up <wallet_id> --amount <amount>
```

4. Deploy backend canister to an internet computer subnet.
```{bash}
dfx deploy --argument '(<courier API key>, <test arg>)' merchant_backend --network ic
```
You can get a courier API key can be found [here](https://app.courier.com/settings/api-keys).

5. Build and deploy frontend.
```{bash}
yarn buildProd
dfx deploy frontend --network ic
```
The 'buildProd' command builds the project with values from the .env.production file.
