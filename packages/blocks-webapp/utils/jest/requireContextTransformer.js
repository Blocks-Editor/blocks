// `require.context(..)` polyfill for non-Webpack environments
// Derived from: https://gist.github.com/ezidio/f64c59d46b19a3fe671a9ded6441de18

const regexp = /require\.context\(/g;
const polyfillSource = `
console.log('test!!')//////
if(typeof require.context === 'undefined') {
    const fs = require('fs');
    const path = require('path');

    require.context = (base = '.', scanSubDirectories = false, regularExpression = /\\.js$/) => {
        const files = {};

        const readDirectory = (directory) => {
            fs.readdirSync(directory).forEach((file) => {
                const fullPath = path.resolve(directory, file);
                if(fs.statSync(fullPath).isDirectory()) {
                    if(scanSubDirectories) {
                        readDirectory(fullPath);
                    }
                }
                else if(regularExpression.test(fullPath)) {
                    files[fullPath] = true;
                }
            });
        };

        const Module = (file) => {
            return require(file);
        };
        Module.keys = () => Object.keys(files);

        readDirectory(path.resolve(__dirname, base));
        return Module;
    };
}
`;

module.exports = {
    process(src) {
        return regexp.test(src) ? `${polyfillSource}${src}` : src;
    },
};