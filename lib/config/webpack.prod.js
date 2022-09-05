"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var purgecss_webpack_plugin_1 = __importDefault(require("purgecss-webpack-plugin"));
var webpack_base_1 = __importDefault(require("./webpack.base"));
var glob_1 = __importDefault(require("glob"));
var webpack_merge_1 = require("webpack-merge");
var utils_1 = require("../utils");
function prodConfig() {
    var customWebpackConfig = (0, utils_1.getCustomWebpack)() || {};
    var config = customWebpackConfig.config, otherConfig = __rest(customWebpackConfig, ["config"]);
    var _a = (otherConfig || {}).root, root = _a === void 0 ? 'src' : _a;
    var baseConfig = (0, webpack_base_1["default"])(otherConfig);
    var prodConfig = (0, webpack_merge_1.merge)(baseConfig, {
        mode: 'production',
        plugins: [
            new purgecss_webpack_plugin_1["default"]({
                paths: glob_1["default"].sync("".concat(utils_1.rootPath, "/").concat(root, "/**/*"), { nodir: true })
            }),
        ]
    });
    return config ? config(prodConfig) : prodConfig;
}
exports["default"] = prodConfig;
