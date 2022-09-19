"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const HtmlWebpackPlugins = require('html-webpack-plugin');
class HtmlWebpackInsertAsset {
    constructor(options) {
        this.options = [];
        this.tagToAssetTagsMap = {
            script: 'scripts',
            link: 'styles',
            meta: 'meta'
        };
        this.options = options;
    }
    apply(compiler) {
        compiler.hooks.compilation.tap('HtmlWebpackInsertAsset', (compilation) => {
            const htmlWebpackHooks = HtmlWebpackPlugins.getHooks(compilation);
            htmlWebpackHooks.alterAssetTags.tapAsync('HtmlWebpackInsertAsset', (data, cb) => {
                const { assetTags } = data;
                this.options.forEach(optionItem => {
                    var _a;
                    const { tag, attributes, position = 'after' } = optionItem;
                    const assetTag = this.tagToAssetTagsMap[tag];
                    const currentTags = assetTags[assetTag];
                    currentTags[position === 'after' ? 'push' : 'unshift']({
                        tagName: tag,
                        voidTag: false,
                        attributes,
                        meta: ((_a = currentTags[0]) === null || _a === void 0 ? void 0 : _a.meta) || {
                            plugin: 'html-webpack-plugin'
                        }
                    });
                });
                cb(null, data);
            });
        });
    }
}
module.exports = HtmlWebpackInsertAsset;
