module.exports = {
    transpileDependencies: [
        'vuetify'
    ],
    pluginOptions: {
        electronBuilder: {
            builderOptions: {
                win: {
                    icon: 'icons/icon_commerce.ico'
                }
            }
        }
    }
}