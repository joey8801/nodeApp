'use strict';

module.exports = function(config) {
  const {Wallets, Gateway} = require('fabric-network');
  const fs = require('fs');

  const path = require('path');

  return new Promise (async (resolve, reject) => {
    const ccpPath = path.resolve(__dirname, config.ccpPath);
    const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

    const walletPath = path.join(__dirname, '.', 'wallet');
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    const gateway = new Gateway();
    await gateway.connect(ccp, {
      wallet,
      identity: config.identityLabel,
      discovery: {enabled: true, asLocalhost: true}
    });

    const network = await gateway.getNetwork(config.channel);
    const contract = network.getContract(config.cc);

    let result = {
      gateway: gateway,
      contract: contract,
    }
    
    resolve(result);
  })
}