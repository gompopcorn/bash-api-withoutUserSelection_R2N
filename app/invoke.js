const { Gateway, Wallets, TxEventHandler, GatewayOptions, DefaultEventHandlerStrategies, TxEventHandlerFactory } = require('fabric-network');
const fs = require('fs');
const path = require("path")
const log4js = require('log4js');
const logger = log4js.getLogger('BasicNetwork');
const util = require('util');
const colors = require('colors');
const shell = require('shelljs');

const { spawn } = require('child_process');

const bashFilesDir = path.join(__dirname, '../bash-files');

// const createTransactionEventHandler = require('./MyTransactionEventHandler.ts')

const helper = require('./helper')

// const createTransactionEventHandler = (transactionId, network) => {
//     /* Your implementation here */
//     const mspId = network.getGateway().getIdentity().mspId;
//     const myOrgPeers = network.getChannel().getEndorsers(mspId);
//     return new MyTransactionEventHandler(transactionId, network, myOrgPeers);
// }

const invokeTransaction = async (channelName, chaincodeName, fcn, args, username, org_name, transientData, res) => {
    try {
        logger.debug(util.format('\n============ invoke transaction on channel %s ============\n', channelName));

        // load the network configuration
        const ccpPath =path.resolve(__dirname, '..', 'config', 'connection-org1.json');
        const ccpJSON = fs.readFileSync(ccpPath, 'utf8')
        const ccp = await helper.getCCP(org_name) //JSON.parse(ccpJSON);

        // Create a new file system based wallet for managing identities.
        const walletPath = await helper.getWalletPath(org_name) //path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        let identity = await wallet.get(username);
        if (!identity) {
            console.log(`An identity for the user ${username} does not exist in the wallet, so registering user`);
            await helper.getRegisteredUser(username, org_name, true)
            identity = await wallet.get(username);
            console.log('Run the registerUser.js application before retrying');
            return;
        }


        // // #changed
        // const connectOptions = {
        //     wallet, identity: username, discovery: { enabled: true, asLocalhost: true },
        //     // eventHandlerOptions: {
        //     //     commitTimeout: 100,
        //     //     strategy: DefaultEventHandlerStrategies.NETWORK_SCOPE_ALLFORTX
        //     // }
        //     // transaction: {
        //     //     strategy: createTransactionEventhandler()
        //     // }
        // }

        // // Create a new gateway for connecting to our peer node.
        // const gateway = new Gateway();
        // await gateway.connect(ccp, connectOptions);

        // // Get the network (channel) our contract is deployed to.
        // const network = await gateway.getNetwork(channelName);

        // const contract = network.getContract(chaincodeName);


        let result
        let message;
        if (fcn === "createCar" || fcn === "createPrivateCarImplicitForOrg1"
        || fcn == "createPrivateCarImplicitForOrg2") 
        {
            // createCar(ctx, carNumber, make, model, color, owner)

            // for (let i = 0; i < 1000; i++) 
            // {
            //     // let shellResult = shell.exec(`${bashFilesDir}/createCar.sh bash_car_${i} ${args[1]} ${args[2]} ${args[3]} ${args[4]}`);
    
            //     // if (shellResult.code !== 0) {
            //     //     let shellError = shellResult.stderr;
            //     //     console.log(colors.bgRed("Error in createCar.sh"));
            //     //     console.log(colors.red(shellError));
            //     //     return;
            //     // }
            //     // else message = `Successfully added the car asset with key ${args[0]}`;


            //     // let test_network_dir="/usr/local/go/src/github.com/hyperledger/fabric-samples/test-network"
            //     // let fabric_samples_dir="/usr/local/go/src/github.com/hyperledger/fabric-samples"

            //     // shell.exec(`export PATH=${fabric_samples_dir}/bin:$PATH`);
            //     // shell.exec(`export FABRIC_CFG_PATH=${fabric_samples_dir}/config/`);
            //     // shell.cd(`${test_network_dir}`);
            //     // shell.exec(`. ./scripts/envVar.sh`);
            //     // shell.exec(`setGlobals 1`);
            //     // shell.exec(`peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls --cafile ${test_network_dir}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem -C channel1 -n fabcar --peerAddresses localhost:7051 --tlsRootCertFiles ${test_network_dir}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt --peerAddresses localhost:9051 --tlsRootCertFiles ${test_network_dir}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt -c '{"function":"createCar", "Args":["bash_car_${i}", "${args[1]}", "${args[2]}", "${args[13]}", "${args[4]}"]}'`);


            //     // const { spawn } = require('child_process');
            //     // const child = spawn(`${test_network_dir}/bash-api/bash-files/createCar.sh bash_car_${i} ${args[1]} ${args[2]} ${args[3]} ${args[4]}`, 
            //     // {shell: true});

            //     // let response_payload = {
            //     //     result: { message },
            //     //     error: null,
            //     //     errorData: null
            //     // }
                
            //     // child.stdout.on('data', (data) => 
            //     // {
            //     //     console.log(`stdout: ${data}`);
            //     //     // console.log("string", String(data));
            //     //     // console.log(String(data).search("Chaincode invoke successful"));

            //     //     if (data.toString().search("Chaincode invoke successful" !== -1)) 
            //     //     {
            //     //         message = `Successfully added the car asset with key ${args[0]}`;

            //     //         // return res.send({
            //     //         //     result: { message },
            //     //         //     error: null,
            //     //         //     errorData: null
            //     //         // });
            //     //     }
                    
            //     // });

                
            //     // child.stderr.on('data', (data) => 
            //     // {
            //     //     console.error(`stderr: ${data}`);

            //     //     if (data.toString().search("Chaincode invoke successful" !== -1)) 
            //     //     {
            //     //         message = `Successfully added the car asset with key ${args[0]}`;

            //     //         // return res.send({
            //     //         //     result: { message },
            //     //         //     error: null,
            //     //         //     errorData: null
            //     //         // });

            //     //         if (i === 999) {
            //     //             console.log(colors.bgGreen("DONE"));
            //     //         }
            //     //     }
            //     // });                
                
            //     // // child.on('close', (code) => {
            //     // //     console.log(`child process exited with code ${code}`);
            //     // // });
            // }

            // let OrgNumber = org_name.match(/\d/g).join("");
            // let shellResult = shell.exec(`${bashFilesDir}/createCar.sh ${OrgNumber} ${args[0]} ${args[1]} ${args[2]} ${args[3]} ${args[4]} `);
            
            let shellResult = shell.exec(`${bashFilesDir}/createCar.sh ${channelName} ${chaincodeName} \
                ${args[0]} ${args[1]} ${args[2]} ${args[3]} ${args[4]}`);
    
            if (shellResult.code !== 0) {
                let shellError = shellResult.stderr;
                console.log(colors.bgRed("Error in createCar.sh"));
                console.log(colors.red(shellError));
                return;
            }
            else message = `Successfully added the car asset with key ${args[0]}`;
        } 


        // // #changed
        // else if (fcn === 'queryAllCars') 
        // {
        //     let shellResult = shell.exec(`${bashFilesDir}/queryAllCars.sh`, {silent: true});

        //     if (shellResult.code !== 0) {
        //         let shellError = shellResult.stderr;
        //         console.log(colors.bgRed("Error in queryAllCars.sh"));
        //         console.log(colors.red(shellError));
        //         return;
        //     }
        //     else {
        //         console.log("--------------");
        //         console.log();
        //         console.log("--------------");
        //         message = `Successfully queryAllCars done`;
        //     }
        // }

        // // #changed
        // else if (fcn === 'UpdateAsset') {
        //     let result = await contract.submitTransaction('UpdateAsset', args[0], args[1], args[2], args[3], args[4]);
        //     console.log('*** Result: committed', result.toString());
        //     message = `Successfully added the asset with key asset1`;
        // }



        else if (fcn === "changeCarOwner") {
            result = await contract.submitTransaction(fcn, args[0], args[1]);
            message = `Successfully changed car owner with key ${args[0]} to ${args[1]}`; 
        } 
        else if (fcn == "createPrivateCar" || fcn == "updatePrivateData") {
            console.log(`Transient data is : ${transientData}`)
            let carData = JSON.parse(transientData)
            console.log(`car data is : ${JSON.stringify(carData)}`)
            let key = Object.keys(carData)[0]
            const transientDataBuffer = {}
            transientDataBuffer[key] = Buffer.from(JSON.stringify(carData.car))
            result = await contract.createTransaction(fcn)
                .setTransient(transientDataBuffer)
                .submit()

            message = `Successfully submitted transient data`
        }
        else {
            return `Invocation require either createCar or changeCarOwner as function but got ${fcn}`
        }


        // await gateway.disconnect();

        // result = JSON.parse(result.toString());

        let response = {
            message: message
            // result
        }


        return response;


    } catch (error) {

        console.log(`Getting error: ${error}`)
        return error.message

    }
}

exports.invokeTransaction = invokeTransaction;