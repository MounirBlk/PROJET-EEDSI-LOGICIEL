module.exports = {
    command: async function() {
        this.waitForElementVisible({ locateStrategy: 'xpath', selector: "//body/div[@id='app']/div[1]/main[1]" })
        this.setValue({ locateStrategy: 'xpath', selector: "//html[1]/body[1]/div[1]/div[1]/main[1]/div[1]/div[1]/div[1]/div[3]/div[3]/div[1]/div[1]/div[2]/form[1]/div[1]/div[1]/div[2]/div[1]/div[1]/input[1]" }, "admin@admin.com")
        this.setValue({ locateStrategy: 'xpath', selector: "//html[1]/body[1]/div[1]/div[1]/main[1]/div[1]/div[1]/div[1]/div[3]/div[3]/div[1]/div[1]/div[2]/form[1]/div[2]/div[1]/div[2]/div[1]/div[1]/input[1]" }, "Admin123*")
        this.click({ locateStrategy: 'xpath', selector: "//body/div[@id='app']/div[1]/main[1]/div[1]/div[1]/div[1]/div[3]/div[3]/div[1]/div[1]/div[2]/form[1]/span[1]/button[1]" })
        this.pause(10000)
        this.waitForElementVisible({ locateStrategy: 'xpath', selector: "//header/div[1]/button[2]" })
    }
}