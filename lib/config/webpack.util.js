"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.babelPresetGenerator = exports.polyfillInsert = void 0;
const resource_1 = require("../utils/resource");
const htmlWebpackInsertAsset_1 = __importDefault(require("../plugins/htmlWebpackInsertAsset"));
function polyfillInsert(extraConfig, config) {
    const { dynamicPolyfill, dynamicPolyfillCDN } = extraConfig;
    if (dynamicPolyfill) {
        config.plugins = config.plugins || [];
        config.plugins.push(new htmlWebpackInsertAsset_1.default([
            {
                tag: 'script',
                attributes: {
                    src: dynamicPolyfillCDN || resource_1.polyfillIO,
                    defer: true
                },
                position: 'before'
            }
        ]));
    }
    return config;
}
exports.polyfillInsert = polyfillInsert;
function babelPresetGenerator(extraConfig) {
    const { react = true } = extraConfig;
    const presetResult = ['@babel/preset-typescript', '@babel/preset-env'];
    if (react) {
        presetResult.push('@babel/preset-react');
    }
    return presetResult;
}
exports.babelPresetGenerator = babelPresetGenerator;
