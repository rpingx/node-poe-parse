/**
 * Created by rxudsk on 6/15/2018.
 */
// webpack.config.js
const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');

module.exports = env => {
    return {
        entry: {
            polyfill: 'babel-polyfill',
            app: './js/main.js'
        },
        output: {
            path: path.resolve(__dirname, './dist'),
            publicPath: '/',
            filename: '[name].js'
        },
        resolve: {
            alias: {
                vue: path.resolve(__dirname, './node_modules/vue/dist/vue.min.js')
            }
        },
        module: {
            rules: [
                {
                    test: /\.vue$/,
                    exclude: /(node_modules)/,
                    loader: 'vue-loader'
                },
                // this will apply to both plain `.js` files
                // AND `<script>` blocks in `.vue` files
                {
                    test: /\.js$/,
                    exclude: /(node_modules)/,
                    loader: 'babel-loader',
                    query: {
                        presets: ['es2015']
                    }
                },
                // this will apply to both plain `.css` files
                // AND `<style>` blocks in `.vue` files
                {
                    test: /\.css$/,
                    exclude: /(node_modules)/,
                    use: [
                        'vue-style-loader',
                        'css-loader'
                    ]
                }
            ]
        },
        plugins: [
            // make sure to include the plugin for the magic
            new VueLoaderPlugin(),
            new webpack.DefinePlugin({
                "DATAAPIURL": JSON.stringify(env.apiurl || 'api/')
            }),
            // copy static files into dist directory
            new CopyWebpackPlugin([
                {
                    from: 'static'
                }
            ])
        ]
    };
};