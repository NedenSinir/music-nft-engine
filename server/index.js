const {  clusterApiUrl, 
    Connection, 
    PublicKey, 
    Keypair, 
    LAMPORTS_PER_SOL} = require("@solana/web3.js");
const { NONAME } = require("dns");
const express = require("express");
const fs = require('fs')
const app = express();
const bp = require('body-parser')
const Arweave = require('arweave');
const arweave = Arweave.init({
    host: "arweave.net",
    port: 443,
    protocol: "https",
  });
  app.use(bp.json())
app.use(bp.urlencoded({ extended: true }))


const PORT = process.env.PORT || 3001;
async function a(wallet){
    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
console.log(wallet);
    const { exec } = require("child_process");
exec(`metaboss mint one --keypair .\\server\\my-keypair.json --receiver  ${wallet} --nft-data-file .\\example_nft_file\\dont_edit.json`, (error, stdout, stderr) => {
    if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
});



}
async function uploadArw(){
  let key = await require("../server/wallet.json")

  //upload img to arweave

 const data = fs.readFileSync('.\\example_nft_file\\0.png');
 console.log(data)
    
    const transaction = await arweave.createTransaction({
        data: data
    });
    
    transaction.addTag('Content-Type', 'image/png');
    
    await arweave.transactions.sign(transaction, key);
    
   await arweave.transactions.post(transaction);

    const imageUrl =  `https://arweave.net/${transaction.id}`;
    console.log(imageUrl)


//upload  metadata to arweave
    const metadataRequest = require("../example_nft_file/arweave_upload.json");
   metadataRequest["properties"]["files"][0]["uri"] = imageUrl;
   metadataRequest["image"] = imageUrl;
    const metadataJson = JSON.stringify(metadataRequest);

    const metadataTransaction = await arweave.createTransaction({  data:metadataJson});
    
    metadataTransaction.addTag('Content-Type', 'application/json');
    
    await arweave.transactions.sign(metadataTransaction, key);
    
     await arweave.transactions.post(metadataTransaction);
    const arweaveLink = `https://arweave.net/${metadataTransaction.id}`;
    return arweaveLink;

}
app.post('/data', async (req, res) => {
  try{
    console.log(req.body)
  const { wallet } = req.body;
  const { authorization } = req.headers;

  let metadata=require("../example_nft_file/nft_metadata_template.json");
  metadata["uri"]=await uploadArw();
  const data = JSON.stringify(metadata);
  console.log(data)

  fs.writeFile(".\\example_nft_file\\dont_edit.json", data, (err) => {
      if (err) {
          throw err;
      }
      console.log("JSON data is saved.");
  });
  console.log(metadata);
  
  a(wallet);

    res.send({
        wallet,
        authorization,
    });
  }
  catch(err){
    console.log(err)
  }
    

  });
   
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});


