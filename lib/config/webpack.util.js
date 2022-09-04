"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.polyfillInsert = void 0;
var utils_1 = require("../utils");
var htmlWebpackInsertAsset_1 = __importDefault(require("../plugins/htmlWebpackInsertAsset"));
function polyfillInsert(extraConfig, config) {
    var dynamicPolyfill = extraConfig.dynamicPolyfill, dynamicPolyfillCDN = extraConfig.dynamicPolyfillCDN;
    if (dynamicPolyfill) {
        config.plugins = config.plugins || [];
        config.plugins.push(new htmlWebpackInsertAsset_1["default"]([
            {
                tag: 'script',
                attributes: {
                    src: dynamicPolyfillCDN || utils_1.polyfillIO,
                    defer: true
                },
                position: 'before'
            }
        ]));
    }
    return config;
}
exports.polyfillInsert = polyfillInsert;
