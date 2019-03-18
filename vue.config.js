const webpack = require('webpack')
const path = require('path');
 
function resolve(dir) {
    return path.join(__dirname, dir)
}
module.exports = {
    baseUrl: './',
    devServer: {
        host: '0.0.0.0',
        port: 9000,
        https: false, // https:{type:Boolean}
        open: true,
        disableHostCheck:true,
    },
    configureWebpack: {
        plugins: [
            new webpack.ProvidePlugin({
                jQuery: 'jquery',
                $: 'jquery'
            })
        ]
    },
    productionSourceMap: false,
    lintOnSave: false,
    // chainWebpack: config => {
    //     config.entry.app = ["babel-polyfill", resolve('src/main.js')],
    //     config.resolve.alias
    //         .set('@', resolve('src'))
    //         .set('./@assets', resolve('src/assets'))
    //         .set('@components', resolve('src/components'))
    //         .set('@font', resolve('src/font'));
    // }
}
