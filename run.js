/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/*  Web worker to encrypt/decrypt files using AES counter-mode        (c) Chris Veness 2016-2018  */
/*                                                                                   MIT Licence  */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
const path = require('path');
const AesCtr = require('./aes/aesCtr');
const fs = require('fs');
const Blob = require('node-blob');

/**
 * Web worker to encrypt/decrypt files using AES counter-mode.
 *
 * @param {string} msg.data.op - 'encrypt' or 'decrypt'.
 * @param {File}   msg.data.file - File to be encrypted or decrypted.
 * @param {string} msg.data.password - Password to use to encrypt/decrypt file.
 * @param {number} msg.data.bits - Number of bits to use for key.
 * @returns {ciphertext|plaintext} - Blob containing encrypted ciphertext / decrypted plaintext.
 *
 * @example
 *   let worker = new Worker('aes-ctr-file-webworker.js');
 *   let file = this.files[0];
 *   worker.postMessage({ op:'encrypt', file:file, password:'L0ck it up ŝaf3', bits:256 });
 *   worker.onmessage = function(msg) {
 *     if (msg.data.progress != 'complete') {
 *       $('progress').val(msg.data.progress * 100); // update progress bar
 *     }
 *     if (msg.data.progress == 'complete') {
 *       saveAs(msg.data.ciphertext, file.name+'.encrypted'); // save encrypted file
 *     }
 *   }
 *
 * Note saveAs() cannot run in web worker, so encrypted/decrypted file has to be passed back to UI
 * thread to be saved.
 *
 * TODO: error handling on failed decryption
 */

onmessage = function(msg) {
    let filePath = path.resolve(process.cwd(),`${msg.data.file}.decrypted`);
    let plaintext,ciphertext,blob;


    switch (msg.data.op) {
        case 'encrypt':
            plaintext = fs.readFileSync(msg.data.file);
            console.log(plaintext);
            // console.log({
            //     plaintext
            // });
            // let plaintext = reader.readAsText(msg.data.file, 'utf-8');
            ciphertext = AesCtr.encrypt(plaintext, msg.data.password, msg.data.bits);
            // return encrypted file as Blob; UI thread can then use saveAs()
            blob = new Blob([ciphertext], { type: 'text/plain' });
            // console.log(blob.size);
            // self.postMessage({ progress: 'complete', ciphertext: blob });
            console.log({ciphertext});
            // console.log(blob.buffer);

            fs.writeFile(filePath, blob.buffer,function(err) {
                if (err) throw 'error writing file: ' + err;

            });
            return { progress: 'complete', ciphertext: blob }

            break;
        case 'decrypt':
            // reader = new FileReaderSync();
            // ciphertext = reader.readAsText(msg.data.file, 'iso-8859-1');
            ciphertext = fs.readFileSync(msg.data.file);
            console.log({
                ciphertext
            });
            plaintext = AesCtr.decrypt(ciphertext, msg.data.password, msg.data.bits);
            // return decrypted file as Blob; UI thread can then use saveAs()
            blob = new Blob([plaintext], { type: 'application/octet-stream' });
            // self.postMessage({ progress: 'complete', plaintext: blob });xx`
            console.log(plaintext)
            fs.writeFile('decrypted_data.png', blob.buffer,function(err) {
                if (err) throw 'error writing file: ' + err;

            });
            return { progress: 'complete', plaintext: blob }

            break;
    }
};
const message = {
    data: {
        op: 'encrypt',
        file: './text.txt',
        password: 1111111111111111,
        bits: 128
    }
}
// const message1 = {
//     data: {
//         op: 'decrypt',
//         file: filePath,
//         password: 1111111111111111,
//         bits: 128
//     }
// }
onmessage(message);
// onmessage(message);
