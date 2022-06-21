const express = require('express');
const bodyParser = require('body-parser');

const connectToContract = require('./connection')

const config = require('./config.json');

let gateway;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

connectToContract(config).then(function(connection) {
  gateway = connection.gateway;
  contract = connection.contract;
  let listner = connection.listner;
  let checkTransaction = connection.checkTransaction;

  console.log('-connection to fabric network ready');

  app.post('/api/createasset', async function (req, res) {
    try {
      const assetKey = req.body.id
      const assetColor = req.body.color;
      const assetSize = req.body.size;
      const assetOwner = req.body.owner;
      const assetValue = req.body.appraisedValue;

      transaction = contract.createTransaction('CreateAsset');
      const result = await transaction.submit(assetKey, assetColor, Number(assetSize), assetOwner, Number(assetValue));
      console.log("success")
      res.send('Transaction has been submitted');
    } catch (error) {
      console.error(`Failed to submit transaction: ${error}`);
      process.exit(1);
    }	
  });

  app.listen(8001, function() {
    console.log('-api listeing on port 8001!');
  })
})

process.on('SIGINT', async function() {
  console.log("Caught interrupt signal - start disconnect from the gateway");
  gateway.disconnect();
  contract.removeContractListener(listener);
  process.exit();
})

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}