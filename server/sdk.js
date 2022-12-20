
'use strict';
const { Gateway, Wallets } = require('fabric-network');
const path = require('path'); 
const yaml = require('js-yaml');
const fs = require('fs');

async function send(type, func, args,res) {
    try {
        let connectionProfile = yaml.safeLoad(fs.readFileSync('../../gateway/connection-org1.yaml', 'utf8'));
        const walletPath = path.join(process.cwd(), '../../identity/user/balaji/wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        const gateway = new Gateway(); // new gateway instance for interacting with fabric network
        let resultString = '';

        // connect to gateway with connecting profile
        await gateway.connect(connectionProfile, {
            identity: 'balaji',
            wallet: wallet,
            discovery: { enabled: true, asLocalhost: true }
        });
        const network = await gateway.getNetwork('mychannel'); // get network with channel name
        const contract = network.getContract('papercontract'); // get contract with chaincode name

        console.log('>>>> Transaction <<<<');
        if(type == true) { // type true : submit transaction, not only query
            await contract.submitTransaction(func, ...args);
            let result = 'Submit transaction success';
            console.log(result);
            res.send(true); // inform React the change
        } else {
            const result = await contract.evaluateTransaction(func, ...args);
            console.log('Evaluate transaction success');
    
            resultString = result.toString();
            console.log(`*** Result: ${resultString}`);
            res.json(JSON.parse(resultString)); // send with json format
        }
        gateway.disconnect();
        
    }
    catch(error) {
        console.log('Fail transaction');
        console.log(error);
        res.send(error);
    }
}

module.exports = {
    send:send
}
 





// balaji
// const walletPath = path.join(process.cwd(), '../../identity/user/balaji/wallet');
