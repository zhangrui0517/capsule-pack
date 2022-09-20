import { CustomExtraConfig } from '../types';
import { Configuration } from 'webpack';
export declare function polyfillInsert(extraConfig: CustomExtraConfig, config: Configuration): Configuration;
export declare function babelPresetGenerator(extraConfig: CustomExtraConfig): string[];
