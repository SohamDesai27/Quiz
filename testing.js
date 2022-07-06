const process = require('child_process');
const fs = require('fs');

fs.readdirSync(__dirname + '/test').forEach(function (file) {
    if (file == "index.js") {
        return;
    }
    console.log(file);
    process.exec('mocha ' + file);
});

