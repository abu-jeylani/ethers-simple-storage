import path from "path"
import { ethers } from "ethers"
import * as fs from "fs"
import "dotenv/config"

const binFilePath = path.join(__dirname, "SimpleStorage_sol_SimpleStorage.bin")
const abiFilePath = path.join(__dirname, "SimpleStorage_sol_SimpleStorage.abi")

const main = async () => {
  const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL)
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider)
  const abi = fs.readFileSync(abiFilePath, "utf-8")
  const binary = fs.readFileSync(binFilePath, "utf-8")

  const contractFactory = new ethers.ContractFactory(abi, binary, wallet)
  console.log("Deploying, please wait...")
  const contract = await contractFactory.deploy()
  console.log(`Contract Address: ${contract.address}`)
  await contract.deployTransaction.wait(1)

  const currentFavoriteNumber = await contract.retrieve()
  console.log(`currentFavoriteNumber: ${currentFavoriteNumber.toString()}`)
  const transactionResponse = await contract.store("7")
  await transactionResponse.wait(1)
  const updatedFavoriteNumber = await contract.retrieve()
  console.log(`Updated favorite number is: ${updatedFavoriteNumber}`)
}

main()
  .then(() => {
    process.exit(0)
  })
  .catch((error) => {
    console.log(error)
    process.exit(1)
  })
