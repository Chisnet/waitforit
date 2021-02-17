const es5Config = {
    entry: ['regenerator-runtime/runtime', './WaitForIt.js'],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            ['@babel/preset-env', {
                                targets: {
                                    ie: '11'
                                },
                            }],
                        ],
                    }
                }
            }
        ]
    },
    target: ['es5'],
    output: {
        filename: 'WaitForIt.es5.min.js',
    }
}

const config = {
    entry: ['./WaitForIt.js'],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            ['@babel/preset-env', {
                                targets: {
                                    "esmodules": true
                                }
                            }],
                        ],
                    }
                }
            }
        ]
    },
    output: {
        filename: 'WaitForIt.min.js',
    }
}

module.exports = [es5Config, config];
