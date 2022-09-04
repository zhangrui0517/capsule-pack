"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var html_webpack_plugin_1 = __importDefault(require("html-webpack-plugin"));
var HtmlWebpackInsertAsset = (function () {
    function HtmlWebpackInsertAsset(options) {
        this.options = [];
        this.tagToAssetTagsMap = {
            script: 'scripts',
            link: 'styles',
            meta: 'meta'
        };
        this.options = options;
    }
    HtmlWebpackInsertAsset.prototype.apply = function (compiler) {
        var _this = this;
        compiler.hooks.compilation.tap('HtmlWebpackInsertAsset', function (compilation) {
            var htmlWebpackHooks = html_webpack_plugin_1["default"].getHooks(compilation);
            htmlWebpackHooks.alterAssetTags.tapAsync('HtmlWebpackInsertAsset', function (data, cb) {
                var assetTags = data.assetTags;
                _this.options.forEach(function (optionItem) {
                    var _a;
                    var tag = optionItem.tag, attributes = optionItem.attributes, _b = optionItem.position, position = _b === void 0 ? 'after' : _b;
                    var assetTag = _this.tagToAssetTagsMap[tag];
                    var currentTags = assetTags[assetTag];
                    currentTags[position === 'after' ? 'push' : 'unshift']({
                        tagName: tag,
                        voidTag: false,
                        attributes: attributes,
                        meta: ((_a = currentTags[0]) === null || _a === void 0 ? void 0 : _a.meta) || {
                            plugin: 'html-webpack-plugin'
                        }
                    });
                });
                cb(null, data);
            });
        });
    };
    return HtmlWebpackInsertAsset;
}());
exports["default"] = HtmlWebpackInsertAsset;
