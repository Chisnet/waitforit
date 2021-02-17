module.exports = {
    entry: ['regenerator-runtime/runtime', './WaitForIt.js'],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                }
            }
        ]
    },
    target: ['es5'],
    output: {
        filename: 'WaitForIt.js',
    }
}