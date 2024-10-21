const path = require('path');

module.exports = {
    mode: 'development',
    entry: {
        script: './src/index.js'
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'public'),
        publicPath: '/', // 确保使用根路径
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                    },
                },
            },
        ],
    },
    resolve: {
        extensions: ['.js', '.jsx'],
    },
    devtool: 'source-map',
    devServer: {
        static: path.resolve(__dirname, 'public'), // 指定静态文件目录
        port: 8080,
        hot: true,
        historyApiFallback: true, // 处理 SPA 路由
    },
};
