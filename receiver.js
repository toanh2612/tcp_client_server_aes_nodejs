const Cryptor = require('./aes/Cryptor');
const net = require('net');
const { fstat } = require('fs');
const fs = require('fs');
const utils = require('./utils');
const { regex, handleArgv, generate } = utils;
const path = require('path')
const argv = handleArgv();
<<<<<<< HEAD
const outputFolderPath = argv['outputFolderPath'] || 'serverStorage';
if (!fs.existsSync(outputFolderPath)){
  fs.mkdirSync(outputFolderPath);
}
=======
const folderName = 'serverStorage';
const _ = require('lodash');
>>>>>>> d237f5e9b154b38699d7ab6cf06ef49d4a9eb9ba
const server = net.createServer(function (c) {
  console.log('client connected');
    let receivedDataArray = [];
  c.on('data', function (data) {
    //   console.log(data);
      receivedDataArray.push(data);
  });

  c.on('end', async() => {
    console.log('client disconnected');

    const buffer = Buffer.concat(receivedDataArray);
    const bufferToString = buffer.toString('utf-8');
    const json = JSON.parse(bufferToString);
    let bufferOriginal = Buffer.from(json.fileData.data);
    const decryptedFileName = path.basename(json.result['filePath'])+json.result['decryptExt'];
    const encryptedFileName = path.basename(json.result['outputFilePath']);
    const encryptedFilePath = path.resolve(outputFolderPath,encryptedFileName);
    const decryptedFilePath = path.resolve(outputFolderPath,decryptedFileName);

    // console.log({encryptedFilePath, decryptedFilePath});
    fs.writeFileSync(encryptedFilePath, bufferOriginal);
    const options = {
        filePath: encryptedFilePath,
        outputFilePath: decryptedFilePath,
        bits: Number(argv['bits']),
        password: argv['password'],
        op: 'decrypt'
    };
    try {
      const senderData = new Cryptor(options);
      const result = await senderData.decrypt();
      console.log({decryptedResult:{..._.pick(result,['op','password', 'bits','outputFilePath','raw'])}});
    } catch(error){
      console.log({error});
    }


  });
  c.pipe(c);
});

server.on('error', (err) => {
  throw err;
});

server.listen(Number(argv['port']), argv['host'], () => {
  console.log('server bound');
});
