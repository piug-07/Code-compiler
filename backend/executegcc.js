const { exec } = require('child_process');

const executeC = (filepath) => {
  return new Promise((resolve, reject) => {
    exec(
      `gcc ${filepath} -o ${filepath.split('.')[0]} && ./${filepath.split('.')[0]}`,
      (error, stdout, stderr) => {
        if (error) {
          reject({ error, stderr });
        } else if (stderr) {
          reject(stderr);
        } else {
          resolve(stdout);
        }
      }
    );
  });
};

module.exports = {
  executeC
};