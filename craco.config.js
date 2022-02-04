// const {addBeforeLoader, loaderByName} = require('@craco/craco');
const FilterWarningsPlugin = require('webpack-filter-warnings-plugin');

// const loadWasmPlugin = {
//     overrideWebpackConfig(webpackConfig) {
//         const wasmExtensionRegExp = /\.wasm$/;
//         webpackConfig.resolve.extensions.push('.wasm');
//
//         webpackConfig.module.rules.forEach((rule) => {
//             (rule.oneOf || []).forEach((oneOf) => {
//                 if(oneOf.loader && oneOf.loader.indexOf('file-loader') >= 0) {
//                     oneOf.exclude.push(wasmExtensionRegExp);
//                 }
//             });
//         });
//
//         const wasmLoader = {
//             test: /\.wasm$/,
//             exclude: /node_modules/,
//             loaders: ['wasm-loader'],
//         };
//
//         addBeforeLoader(webpackConfig, loaderByName('file-loader'), wasmLoader);
//
//         return webpackConfig;
//     },
// };

module.exports = {
    webpack: {
        plugins: {
            add: [
                // loadWasmPlugin,
                new FilterWarningsPlugin({
                    // Exclude warnings created by `require.context` polyfill
                    exclude: /Critical dependency/,
                }),
            ],
        },
    },
    // jest: {
    //     configure: {
    //         verbose: true,
    //         moduleDirectories: ['node_modules'],
    //         transform: {
    //             '\\.js$': '<rootDir>/utils/jest/requireContextTransformer', // TODO: fix
    //         },
    //         // transformIgnorePatterns: ['/node_modules/?!()'], // Fix compile errors
    //     },
    // },
};
