// For authoring Nightwatch tests, see
// https://nightwatchjs.org/guide

module.exports = {
    beforeEach: (browser) => {
        /*browser.execute(() => {
            return localStorage.clear();
        })*/
        browser.maximizeWindow((result) => {
            console.log(result);
        })
        console.log("Start !")
    },
    'Dashboard TEST': browser => {
        browser
            .init()
            .waitForElementVisible('#app')
            .connexion() //connexion a la plateforme
            //.prospections() // prospections
            .deconnexion() //deconnexion a la plateforme
            .end()

    },
    after: (browser) => {
        /*browser.execute(() => {
            return localStorage.clear();
        })*/
        console.log("End !")
    }
}