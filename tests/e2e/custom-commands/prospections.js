const index = require('../functions/index');

module.exports = {
    command: async function() {
        this.click({ locateStrategy: 'xpath', selector: "//body/div[@id='app']/div[1]/nav[1]/div[2]/div[1]/a[9]/div[2]" })
        this.waitForElementVisible({ locateStrategy: 'xpath', selector: "//body/div[@id='app']/div[1]/main[1]/div[1]/div[1]/section[1]/div[8]/div[1]/div[2]/div[1]" })
        this.click({ locateStrategy: 'xpath', selector: "//body/div[@id='app']/div[1]/main[1]/div[1]/div[1]/section[1]/div[8]/div[2]/div[1]/button[1]" })
        this.screen("New evenement")
    }
}