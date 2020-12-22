const regex = {
    port: /port=/i,
    host: /host=/i,
    filePath: /filepath=/i,
    outputFilePath: /outputFilePath=/i,
    password: /password=/i,
    bits: /bits=/i,
    op: /op=/i,
    outputFolderPath: /outputFolderPath=/i

}
const handleArgv = () => {
    const result = {};
    process.argv.map((argv)=>{
        Object.keys(regex).map((re)=>{
            if (argv.match(regex[re])) {
                result[re] = argv.replace(regex[re], '');
            }
        })
    });
    return result;
}
function generate(n) {
    var add = 1, max = 12 - add;   

    if ( n > max ) {
            return generate(max) + generate(n - max);
    }

    max        = Math.pow(10, n+add);
    var min    = max/10; 
    var number = Math.floor( Math.random() * (max - min + 1) ) + min;

    return ("" + number).substring(add); 
}

module.exports = {
    regex,
    handleArgv, 
    generate
}