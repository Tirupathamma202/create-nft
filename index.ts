import AndromedaClient, { queryChainConfig, Wallet } from "@andromedaprotocol/andromeda.js";
import { GasPrice } from "@cosmjs/stargate";

const client = new AndromedaClient()

let walletAddress = ''
let contractAddress = ''

/**
 * Connects the Andromeda Client.
 */
async function connectClient() {
  const phrase = "mesh brisk main dad praise cruel claw sausage zone wait flip hard ostrich light scorpion original make address upper silly cabbage rookie copper primary"
  const wallet = await Wallet.fromMnemonic("my-wallet", phrase, "123", "andr")
  const signer = await wallet.getWallet("123")
  const [account] = await signer.getAccounts();
  walletAddress = account.address;
  console.log("walletAddress: " + walletAddress)
  const config = await queryChainConfig("galileo-3")
  await client.connect(config.chainUrl, config.registryAddress, config.addressPrefix, signer, {
    gasPrice: GasPrice.fromString(config.defaultFee),
  });
}

/**
 * Instantiate an NFT contract using Code ID 59
 * @returns 
 */
async function instantiate() {
  await connectClient()

  const instantiateMsg = {
    "name": "Example Token",
    "symbol": "ET",
    "minter":{
        "identifier": walletAddress
        },
   "modules": []
  }
  
  console.log("Started instantiate..")
  const resp = await client.instantiate(59, instantiateMsg, "nft")
  contractAddress = (await resp).contractAddress
  console.log("NFT contractAddress: " + contractAddress)
  execute()
}

instantiate()

/**
 * Mint an NFT using your NFT contract
 * @returns 
 */  
async function execute() {

  const mintMsg = {
    "mint": {                                                                                                                             
      "token_id": "1",
      "owner": walletAddress,
      "extension": {
              "name": "Andromeda",
              "publisher": "Andromeda",
              "description": "A minted token for testing",
              "attributes": [],
              "image": "https://google.com"
          }
      }
    }
  
  console.log("Started execute.. contractAddress: " + contractAddress)

  await client.execute(contractAddress, mintMsg)

  console.log("Ended execute..")
}



