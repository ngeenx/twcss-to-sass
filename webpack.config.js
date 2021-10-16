const path = require('path');

module.exports = {
    mode: 'production',
    entry: './src/index.js',
    // target: 'node',
    // externals: [
    //     nodeExternals({
    //         importType: 'umd'
    //     })
    // ],
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: 'twcss-to-sass.js',
        library: 'twcssToSass',
        libraryTarget: 'umd',
        globalObject: 'this',
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /(node_modules)/,
            use: 'babel-loader',
        }],
    },
};