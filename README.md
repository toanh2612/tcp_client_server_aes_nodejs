run code 
setup: npm install
example: 
server: node receiver.js host=127.0.0.1 port=1234 password=toanh
client: node sender.js host=127.0.0.1 port=1234 password=toanh filePath=./1.png op=encrypt bits=128
