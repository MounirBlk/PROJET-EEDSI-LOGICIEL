const index = require('../functions/index');
const fs = require('fs')

module.exports = {
    command: async function() {
        this.click({ locateStrategy: 'xpath', selector: "//header/div[1]/button[4]" });
        this.pause(3000);
        this.getLogTypes((result) => {
            console.log('LogType: ', result);
        });
        this.getLog('browser', (result) => {
            console.log('Log: ', result);
        });
        fs.appendFile('tests/logs.txt', '\n' + index.randomFileName(), (err) => {
            if (err)
                throw err;
            console.log('Saved!');
        });
    }
};