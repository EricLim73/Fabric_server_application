/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
*/

/*
 * This application has 6 basic steps:
 * 1. Select an identity from a wallet
 * 2. Connect to network gateway
 * 3. Access PaperNet network
 * 4. Construct request to buy (buy_request) commercial paper
 * 5. Submit transaction
 * 6. Process response
 */

'use strict';

// Bring key classes into scope, most importantly Fabric SDK network class
const fs = require('fs');
const yaml = require('js-yaml');
const { Wallets, Gateway } = require('fabric-network');
const BioConsent = require('../contract_test/lib/consent.js');



// Main program function
async function main () {

    // A wallet stores a collection of identities for use
    const wallet = await Wallets.newFileSystemWallet('../identity/user/balaji/wallet');


    // A gateway defines the peers used to access Fabric networks
    const gateway = new Gateway();

    // Main try/catch block
    try {

        // Specify userName for network access
        const userName = 'balaji';

        // Load connection profile; will be used to locate a gateway
        let connectionProfile = yaml.safeLoad(fs.readFileSync('../gateway/connection-org1.yaml', 'utf8'));

        // Set connection options; identity and wallet
        let connectionOptions = {
            identity: userName,
            wallet: wallet,
            discovery: { enabled: true, asLocalhost: true }

        };

        // Connect to gateway using application specified parameters
        console.log('Connect to Fabric gateway.');

        await gateway.connect(connectionProfile, connectionOptions);

        // Access PaperNet network
        console.log('Use network channel: mychannel.');

        const network = await gateway.getNetwork('mychannel');

        // Get addressability to commercial paper contract
        console.log('Use org.biodocnet.biocontract smart contract.');

        const contract = await network.getContract('papercontract', 'org.biodocnet.biocontract');

        
        console.log('Submit Reject transaction.');

//        const rejectResponse = await contract.submitTransaction('reject', 'KoreaBio2', 'asdqw123qawsed', '2022-10-27');
        const rejectResponse = await contract.submitTransaction('reject',  'ChilGok_Lab', 'asdqw123qawsed', '2022-11-10');

        // process response
        console.log('Process reject transaction response.');

        let consent = BioConsent.fromBuffer(rejectResponse);
        
        console.log(`${consent.User_UID} consent : ${consent.TimeStamp} successfully Reject valid `);
        console.log('Transaction complete.');

    } catch (error) {

        console.log(`Error processing transaction. ${error}`);
        console.log(error.stack);

    } finally {

        // Disconnect from the gateway
        console.log('Disconnect from Fabric gateway.');
        gateway.disconnect();

    }
}
main().then(() => {

    console.log('Buy_request program complete.');

}).catch((e) => {

    console.log('Buy_request program exception.');
    console.log(e);
    console.log(e.stack);
    process.exit(-1);

});
