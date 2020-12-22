const Cryptor = require('./aes/Cryptor');
const net = require('net');
const fs = require('fs');
const utils = require('./utils');
const { regex, handleArgv, generate } = utils;
const _ = require('lodash');
const argv = handleArgv();
let sender = new net.Socket();

sender.connect(Number(argv['port']), argv['host'], async function () {
    try {
        const senderData = new Cryptor({..._.pick(argv,['filePath','outputFilePath','password','bits','op'])});

        const result = await senderData.encrypt();
        console.log({
            encryptedResult: result
        });
        let fileData = fs.readFileSync(result['outputFilePath']);
        let package = {
            result,
            fileData
        }
        package = JSON.stringify(package);
        sender.write(package);
    } catch(error) {
        console.log({error})
    }
    

});

sender.on('data', function (data){
    console.log(data);
    sender.end();
});

sender.on('end',()=> {
    console.log('disconnected');
});
