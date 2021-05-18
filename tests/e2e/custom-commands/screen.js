const index = require('../functions/index');
const fs = require('fs')

module.exports = {
    command: async function(name) {
        var today = index.randomFileName()
        if (!fs.existsSync('./tests/screens/')) fs.mkdirSync('./tests/screens/')
        this.saveScreenshot('./tests/screens/screen_' + today + '.png')
        this.perform((done) => {
            //index.sendEmail(name, today)
            done()
        })
    }
}