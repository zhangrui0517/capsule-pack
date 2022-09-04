import { Configuration } from 'webpack';
export declare type CustomConfig = {
    config?: (webapckConfig: Configuration) => Configuration;
} & CustomExtraConfig;
export declare type CustomExtraConfig = {
    root?: string;
    dynamicPolyfill?: true;
    dynamicPolyfillCDN?: string;
};
