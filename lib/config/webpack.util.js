"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { polyfillIO } = require('./utils/resource');
const htmlWebpackInsertAsset = require('../plugins/htmlWebpackInsertAsset');
function polyfillInsert(extraConfig, config) {
    const { dynamicPolyfill, dynamicPolyfillCDN } = extraConfig;
    if (dynamicPolyfill) {
        config.plugins = config.plugins || [];
        config.plugins.push(new htmlWebpackInsertAsset([
            {
                tag: 'script',
                attributes: {
                    src: dynamicPolyfillCDN || polyfillIO,
                    defer: true
                },
                position: 'before'
            }
        ]));
    }
    return config;
}
function babelPresetGenerator(extraConfig) {
    const { react = true } = extraConfig;
    const presetResult = ['@babel/preset-typescript', '@babel/preset-env'];
    if (react) {
        presetResult.push('@babel/preset-react');
    }
    return presetResult;
}
module.exports = {
    polyfillInsert,
    babelPresetGenerator
};
