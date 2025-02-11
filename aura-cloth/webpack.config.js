const webpack = require('webpack');

module.exports = {
    mode: 'development', // ou 'production'
    resolve: {
        fallback: {
            crypto: require.resolve('crypto-browserify'),
            path: require.resolve('path-browserify'),
            stream: require.resolve('stream-browserify'),
            zlib: require.resolve('browserify-zlib'),
            util: require.resolve('util/'),
            buffer: require.resolve('buffer/'),
            http: require.resolve('stream-http'),
            https: require.resolve('https-browserify'),
            fs: false,
            net: false,
            querystring: require.resolve('querystring-es3'),
            url: require.resolve('url/'),
            async_hooks: false,
            worker_threads: false,
            inspector: false,
        },
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react'],
                    },
                },
            },
        ],
    },
    plugins: [
        new webpack.ProvidePlugin({
            Buffer: ['buffer', 'Buffer'],
            process: 'process/browser',
        }),
    ],
};
