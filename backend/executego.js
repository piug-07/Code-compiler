const { exec } = require('child_process');


const executeGo = (filepath) => {

    return new Promise((resolve, reject) => {
        exec(`go run "${filepath}"`, (error, stdout, stderr) => {
            if (error || stderr) {
                reject(error || stderr);
            } else {
                resolve(stdout);
            }
        });
    }); 
};

module.exports = {
    executeGo
};